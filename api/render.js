// "Render this view": turns the walkthrough's picture of the current view, with its outline and depth images, into a photograph.
// The page captures the view (captureView in src/app.html) and posts it here; this function holds the image service's key, checks the
// limits, starts the job and hands back a signed ticket the page polls with.
//
//   GET  /api/render              -> { ok, model, left }            the page shows the button only when ok is true
//   POST /api/render  {image, lines, depth, w, h, aspect, scene}     -> { job, model }
//   GET  /api/render?job=…        -> { status: 'queued'|'working'|'done'|'failed', image?, error? }
//   GET  /api/render?job=…&get=1  -> the finished photo itself (for browsers that cannot fetch it from the image service directly)
//
// Settings, in Vercel > Project > Settings > Environment Variables:
//   FAL_KEY                    image service key from fal.ai. Without it the button stays hidden.
//   RENDER_MODEL               nano-banana-pro (default), nano-banana-2, grok, seedream (4.5), seedream-5-lite, flux-2-pro or flux-depth
//   RENDER_SECRET              any long random string: signs job tickets and hashes visitor addresses
//   RENDER_PROMPT              optional: your own instruction for the image model, with {scene} where the room description goes
//   RENDER_DAILY_PER_VISITOR   renders per visitor per day (default 5)
//   RENDER_DAILY_TOTAL         renders per day across all visitors (default 100)
//   RENDER_MONTHLY_BUDGET      US dollars a month; the button pauses once estimated spend reaches it (default 20)
//   RENDER_COST_USD            estimated cost of one render, if the model's default below is out of date
//   KV_REST_API_URL, KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
//                              an Upstash Redis database (Vercel Marketplace, free tier) so the limits hold across servers;
//                              without one they are counted per server instance, which is much looser.
'use strict';
const crypto = require('crypto');

const ENV = process.env;
const num = (v, d) => (v != null && v !== '' && isFinite(+v) ? +v : d);
const SECRET = ENV.RENDER_SECRET || crypto.createHash('sha256').update('ridgeline-render:' + (ENV.FAL_KEY || '')).digest('hex');
const PER_VISITOR = num(ENV.RENDER_DAILY_PER_VISITOR, 5), DAILY_TOTAL = num(ENV.RENDER_DAILY_TOTAL, 100), BUDGET = num(ENV.RENDER_MONTHLY_BUDGET, 20);
const ASPECTS = ['21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16'];

/* The instruction-following models get the render, the outline drawing and the depth map. The prompt leads with the change (a full
   re-render into a photograph), because an editing model told mostly to "keep everything" hands back a near-copy; the geometry rule is one
   line: change how things look, not where they are. RENDER_PROMPT in the environment replaces it, with {scene} where the scene goes. */
const PROMPT = [
  'Turn this 3D render (the first image) into a real photograph of the same room, as if a professional architectural photographer shot it on location.',
  'Re-render the whole image so that nothing looks computer-generated.',
  'Change how everything looks, not where it is: keep the same camera angle, framing and perspective, and keep every wall, window, door, beam, stair, cabinet and piece of furniture in the same place, size and shape.',
  'Do not add, remove or rearrange anything, and add no people, text or watermarks.',
  'The second and third images only guide the exact geometry (an outline drawing and a depth map, nearer is lighter): follow their lines, but do not copy their look.',
  'Scene: {scene}.',
  'Make every material real and detailed: wood grain and plank seams in wood floors, woven fabric with soft creases and natural wear on upholstery, real rug pile, matte painted walls with subtle variation, real stone, metal and glass with true reflections.',
  'Replace flat, even lighting with real light in the conditions described: soft bounce light, gentle shadows into corners and under every piece of furniture, small highlights on glossy surfaces, and a believable view through the windows.',
  'Shot on a professional full-frame camera with natural exposure, accurate colour and crisp detail. It must read as a photograph, not a rendering.',
].join(' ');
const INSTRUCT = scene => (ENV.RENDER_PROMPT || PROMPT).replace(/\{scene\}/g, scene);
/* The depth-locked model is not an editor: it takes a description, and the depth map holds the geometry. */
const DESCRIBE = scene => `Professional architectural photograph, ${scene}. Physically realistic materials, soft natural light, realistic shadows and reflections, sharp focus, high dynamic range, no people, no text.`;

const fit = (r, long) => { const k = long / Math.max(r.w, r.h); return { width: Math.round(r.w * k / 16) * 16, height: Math.round(r.h * k / 16) * 16 }; };
/* Seedream wants at least 2560×1440 pixels in all: the view's own aspect at that area, in multiples of 16 */
const atLeast = (r, px) => { const k = Math.sqrt(px / (r.w * r.h)), up = v => Math.ceil(v / 16 - 1e-6) * 16; return { width: up(r.w * k), height: up(r.h * k) }; };
const MODELS = {
  'nano-banana-pro': { id: 'fal-ai/nano-banana-pro/edit', usd: 0.15,
    input: r => ({ prompt: INSTRUCT(r.scene), image_urls: [r.image, r.lines, r.depth], aspect_ratio: r.aspect, resolution: '2K', output_format: 'jpeg', num_images: 1 }) },
  'nano-banana-2': { id: 'fal-ai/nano-banana-2/edit', usd: 0.08,
    input: r => ({ prompt: INSTRUCT(r.scene), image_urls: [r.image, r.lines, r.depth], aspect_ratio: r.aspect, output_format: 'jpeg', num_images: 1 }) },
  /* Grok follows the first image's shape; it takes up to three images */
  'grok': { id: 'xai/grok-imagine-image/edit', usd: 0.07,
    input: r => ({ prompt: INSTRUCT(r.scene), image_urls: [r.image, r.lines, r.depth], resolution: '2k', output_format: 'jpeg', num_images: 1 }) },
  'seedream': { id: 'fal-ai/bytedance/seedream/v4.5/edit', usd: 0.04,
    input: r => ({ prompt: INSTRUCT(r.scene), image_urls: [r.image, r.lines, r.depth], image_size: atLeast(r, 2560 * 1440), num_images: 1, max_images: 1 }) },
  'seedream-5-lite': { id: 'fal-ai/bytedance/seedream/v5/lite/edit', usd: 0.04,
    input: r => ({ prompt: INSTRUCT(r.scene), image_urls: [r.image, r.lines, r.depth], image_size: atLeast(r, 2560 * 1440), num_images: 1, max_images: 1 }) },
  'flux-2-pro': { id: 'fal-ai/flux-2-pro/edit', usd: 0.09,
    input: r => ({ prompt: INSTRUCT(r.scene), image_urls: [r.image, r.lines, r.depth], image_size: fit(r, 1536), output_format: 'jpeg' }) },
  'flux-depth': { id: 'fal-ai/flux-control-lora-depth/image-to-image', usd: 0.06,
    input: r => ({ prompt: DESCRIBE(r.scene), image_url: r.image, control_lora_image_url: r.depth, control_lora_strength: 0.8, strength: 0.65, image_size: fit(r, 1536), output_format: 'jpeg', num_images: 1 }) },
};
const MODEL_KEY = MODELS[ENV.RENDER_MODEL] ? ENV.RENDER_MODEL : 'nano-banana-pro';
const COST = num(ENV.RENDER_COST_USD, MODELS[MODEL_KEY].usd);

/* ---------- limits: an Upstash Redis REST database when configured, else this instance's memory ---------- */
const KV_URL = ENV.KV_REST_API_URL || ENV.UPSTASH_REDIS_REST_URL, KV_TOKEN = ENV.KV_REST_API_TOKEN || ENV.UPSTASH_REDIS_REST_TOKEN;
const MEM = new Map();
async function kv(cmds) {
  if (KV_URL && KV_TOKEN) {
    const r = await fetch(KV_URL.replace(/\/$/, '') + '/pipeline', { method: 'POST', headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
    if (!r.ok) throw new Error('limits store ' + r.status);
    return (await r.json()).map(x => x.result);
  }
  const now = Date.now();
  return cmds.map(([op, k, v]) => { const e = MEM.get(k); const cur = e && e.until > now ? e.v : 0;
    if (op === 'GET') return cur;
    if (op === 'INCRBY') { MEM.set(k, { v: cur + +v, until: e && e.until > now ? e.until : now + 40 * 864e5 }); return cur + +v; }
    if (op === 'EXPIRE') { const x = MEM.get(k); if (x) x.until = now + v * 1000; return 1; }
    return null; });
}
const day = () => new Date().toISOString().slice(0, 10), month = () => new Date().toISOString().slice(0, 7);
function visitor(req) { const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  return crypto.createHmac('sha256', SECRET).update(ip).digest('hex').slice(0, 24); }
async function usage(req) { const v = visitor(req), d = day(), m = month();
  const [mine, all, cents] = await kv([['GET', `render:v:${v}:${d}`], ['GET', `render:d:${d}`], ['GET', `render:usd:${m}`]]);
  return { v, d, m, mine: +mine || 0, all: +all || 0, spent: (+cents || 0) / 100 }; }
const blocked = u => u.mine >= PER_VISITOR ? `That's ${PER_VISITOR} photos today, the daily limit. More tomorrow.`
  : u.all >= DAILY_TOTAL ? 'Photo rendering has reached its limit for today. Try again tomorrow.'
  : u.spent + COST > BUDGET ? 'Photo rendering is paused for the rest of the month.' : null;

/* ---------- signed job tickets ---------- */
const b64u = b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sign = s => b64u(crypto.createHmac('sha256', SECRET).update(s).digest());
const ticket = o => { const s = b64u(JSON.stringify(o)); return s + '.' + sign(s); };
function unticket(t) { const [s, sig] = String(t || '').split('.'); if (!s || !sig) return null; const want = sign(s);
  if (want.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(want), Buffer.from(sig))) return null;
  try { return JSON.parse(Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()); } catch (e) { return null; } }

/* ---------- fal.ai queue ---------- */
const FAL = 'https://queue.fal.run/';
const falHeaders = () => ({ Authorization: `Key ${ENV.FAL_KEY}`, 'Content-Type': 'application/json' });
const falBase = id => id.split('/').slice(0, 2).join('/'); // status and results live under owner/app, without the sub-path
async function falJson(r) { const t = await r.text(); try { return JSON.parse(t); } catch (e) { return { detail: t.slice(0, 300) }; } }
async function falSubmit(model, input) { const r = await fetch(FAL + model.id, { method: 'POST', headers: falHeaders(), body: JSON.stringify(input) }), j = await falJson(r);
  if (!r.ok || !j.request_id) throw Object.assign(new Error(detail(j) || `image service ${r.status}`), { status: r.status }); return j.request_id; }
async function falPoll(job) { const base = FAL + falBase(job.e) + '/requests/' + encodeURIComponent(job.id);
  const s = await fetch(base + '/status', { headers: falHeaders() }), sj = await falJson(s);
  if (!s.ok) return { status: 'failed', error: detail(sj) || `image service ${s.status}` };
  if (sj.status === 'IN_QUEUE') return { status: 'queued', position: sj.queue_position };
  if (sj.status !== 'COMPLETED') return { status: 'working' };
  const r = await fetch(base, { headers: falHeaders() }), rj = await falJson(r), img = rj.images && rj.images[0];
  if (!r.ok || !img || !img.url) return { status: 'failed', error: detail(rj) || 'No photo came back.' };
  return { status: 'done', image: img.url, w: img.width, h: img.height }; }
function detail(j) { const d = j && (j.detail || j.error || j.message); if (!d) return ''; if (typeof d === 'string') return d.slice(0, 300);
  if (Array.isArray(d)) return d.map(x => x.msg || x.message || JSON.stringify(x)).join('; ').slice(0, 300); return JSON.stringify(d).slice(0, 300); }

/* ---------- requests ---------- */
const send = (res, code, body) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };
const okImage = (s, max) => typeof s === 'string' && s.length < max && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s);
function sameSite(req) { const o = req.headers.origin; if (!o) return true; const allow = (ENV.RENDER_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  try { const h = new URL(o).host; return h === req.headers.host || h === req.headers['x-forwarded-host'] || allow.some(a => a === o || a === h); } catch (e) { return false; } }
async function readBody(req) { if (req.body && typeof req.body === 'object') return req.body; if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = []; for await (const c of req) chunks.push(c); return JSON.parse(Buffer.concat(chunks).toString() || '{}'); }

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://x'), q = url.searchParams;
    if (req.method === 'GET' && !q.get('job')) {
      if (!ENV.FAL_KEY) return send(res, 200, { ok: false, reason: 'not-configured' });
      const u = await usage(req), why = blocked(u);
      return send(res, 200, { ok: true, model: MODEL_KEY, left: Math.max(0, PER_VISITOR - u.mine), paused: why || null, sharedLimits: !!(KV_URL && KV_TOKEN) });
    }
    if (req.method === 'GET') {
      const job = unticket(q.get('job')); if (!job) return send(res, 400, { status: 'failed', error: 'Unknown render.' });
      if (Date.now() - job.t > 6 * 3600e3) return send(res, 410, { status: 'failed', error: 'This render has expired.' });
      const st = await falPoll(job);
      if (q.get('get') && st.status === 'done') { // hand the photo over from here
        const u = new URL(st.image); if (u.protocol !== 'https:' || !/(^|\.)(fal\.(media|run|ai)|x\.ai)$/.test(u.hostname)) return send(res, 400, { status: 'failed', error: 'Unexpected image address.' });
        const r = await fetch(u); const buf = Buffer.from(await r.arrayBuffer()); if (!r.ok || buf.length > 4.4e6) return send(res, 502, { status: 'failed', error: 'Could not fetch the photo.' });
        res.statusCode = 200; res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg'); res.setHeader('Cache-Control', 'private, max-age=3600'); return res.end(buf);
      }
      return send(res, 200, st);
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'Use GET or POST.' });
    if (!ENV.FAL_KEY) return send(res, 503, { error: 'Photo rendering is not set up on this site yet.' });
    if (!sameSite(req)) return send(res, 403, { error: 'Not allowed from this page.' });
    const b = await readBody(req);
    if (!okImage(b.image, 2.2e6) || !okImage(b.lines, 1.2e6) || !okImage(b.depth, 1.6e6)) return send(res, 400, { error: 'The view images are missing or too large.' });
    const w = Math.round(num(b.w, 0)), h = Math.round(num(b.h, 0)); if (w < 256 || h < 256 || w > 4096 || h > 4096) return send(res, 400, { error: 'Bad image size.' });
    const aspect = ASPECTS.includes(b.aspect) ? b.aspect : '16:9';
    const scene = String(b.scene || 'a mountain-modern home').replace(/[\u0000-\u001f<>{}]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 700);
    const u = await usage(req), why = blocked(u); if (why) return send(res, 429, { error: why });
    const model = MODELS[MODEL_KEY], id = await falSubmit(model, model.input({ image: b.image, lines: b.lines, depth: b.depth, w, h, aspect, scene }));
    const cents = Math.round(COST * 100), ttl = 2 * 86400;
    await kv([['INCRBY', `render:v:${u.v}:${u.d}`, 1], ['EXPIRE', `render:v:${u.v}:${u.d}`, ttl], ['INCRBY', `render:d:${u.d}`, 1], ['EXPIRE', `render:d:${u.d}`, ttl],
      ['INCRBY', `render:usd:${u.m}`, cents], ['EXPIRE', `render:usd:${u.m}`, 40 * 86400]]);
    return send(res, 200, { job: ticket({ e: model.id, id, t: Date.now() }), model: MODEL_KEY, left: Math.max(0, PER_VISITOR - u.mine - 1) });
  } catch (e) {
    return send(res, e.status === 422 ? 422 : 502, { error: e.message ? 'The image service said: ' + e.message : 'Something went wrong.' });
  }
};
// for tests
module.exports.MODELS = MODELS; module.exports.INSTRUCT = INSTRUCT; module.exports.ticket = ticket; module.exports.unticket = unticket;
