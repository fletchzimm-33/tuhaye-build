// api/render.js without the network: fal.ai and the limits store are stand-ins. Checks the status call, the inputs each model gets,
// the per-visitor, daily and monthly limits, signed job tickets, polling through to the finished photo, and refusals.
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE=path.dirname(fileURLToPath(import.meta.url)), require=createRequire(import.meta.url);
const res={}; let fails=0; const ok=(name,cond,info)=>{ res[name]=cond?'ok':'FAIL '+JSON.stringify(info??''); if(!cond) fails++; };
const IMG='data:image/jpeg;base64,'+'A'.repeat(4000), PNG='data:image/png;base64,'+'B'.repeat(2000);
const view={ image:IMG, lines:PNG, depth:IMG, w:1536, h:864, aspect:'16:9', scene:'the great room on the main level; bright midday daylight' };

function load(env){ for(const k of Object.keys(process.env)) if(/^(FAL_KEY|RENDER_|KV_|UPSTASH_)/.test(k)) delete process.env[k]; Object.assign(process.env, env);
  const p=require.resolve(path.join(HERE,'..','api','render.js')); delete require.cache[p]; return require(p); }
let falCalls=[], falState={};
globalThis.fetch=async (url, o={})=>{ url=String(url); falCalls.push({url, method:o.method||'GET', body:o.body?JSON.parse(o.body):null, auth:o.headers&&o.headers.Authorization});
  const json=(code,b)=>({ ok:code<300, status:code, text:async()=>JSON.stringify(b), json:async()=>b, headers:new Map([['content-type','application/json']]) });
  if(url.startsWith('https://queue.fal.run/')&&o.method==='POST'){ if(falState.reject) return json(422,{detail:[{msg:'image_urls: too many images'}]}); return json(200,{request_id:'req-123'}); }
  if(/\/requests\/req-123\/status$/.test(url)) return json(200,{status:falState.done?'COMPLETED':'IN_PROGRESS'});
  if(/\/requests\/req-123$/.test(url)) return json(200,{images:[{url:'https://v3.fal.media/files/photo.jpg', width:2048, height:1152}]});
  if(url==='https://v3.fal.media/files/photo.jpg') return { ok:true, status:200, headers:new Map([['content-type','image/jpeg']]), arrayBuffer:async()=>new Uint8Array(5000).buffer };
  return json(404,{detail:'not found'}); };
async function call(h, method, url, body, headers={}){ let out={ code:0, headers:{}, body:null };
  const req={ method, url, headers:Object.assign({ host:'ridgeline.test', 'x-real-ip':'203.0.113.9' }, headers), body };
  const resp={ statusCode:200, setHeader:(k,v)=>out.headers[k.toLowerCase()]=v, end:b=>{ out.code=resp.statusCode; out.body=b; } };
  await h(req, resp); try{ out.json=JSON.parse(out.body); }catch(e){} return out; }

// 1. no key: the button stays hidden
let h=load({}); let r=await call(h,'GET','/api/render'); ok('no key: not configured', r.json && r.json.ok===false && r.json.reason==='not-configured', r.json);
r=await call(h,'POST','/api/render',view); ok('no key: post refused', r.code===503, r);
// 2. configured: status, submit, poll, fetch
h=load({ FAL_KEY:'k-test', RENDER_SECRET:'s', RENDER_DAILY_PER_VISITOR:'2', RENDER_DAILY_TOTAL:'3', RENDER_MONTHLY_BUDGET:'0.40' });
r=await call(h,'GET','/api/render'); ok('status ok', r.json.ok===true && r.json.model==='nano-banana-pro' && r.json.left===2 && r.json.sharedLimits===false, r.json);
falCalls=[]; r=await call(h,'POST','/api/render',view,{origin:'https://ridgeline.test'});
const sub=falCalls[0]; ok('submits to nano banana pro', r.code===200 && sub && sub.url==='https://queue.fal.run/fal-ai/nano-banana-pro/edit' && sub.auth==='Key k-test', {r:r.json, sub:sub&&sub.url});
ok('sends render, outline and depth', sub && sub.body.image_urls.length===3 && sub.body.image_urls[0]===IMG && sub.body.image_urls[1]===PNG && sub.body.aspect_ratio==='16:9' && sub.body.resolution==='2K', sub&&Object.keys(sub.body));
ok('prompt keeps the scene', sub && /Do not add, remove or rearrange/.test(sub.body.prompt) && /^Turn this 3D render/.test(sub.body.prompt) && /great room on the main level/.test(sub.body.prompt), sub&&sub.body.prompt.slice(0,80));
const job=r.json.job; ok('signed ticket', typeof job==='string' && job.split('.').length===2 && r.json.left===1, r.json);
r=await call(h,'GET','/api/render?job='+encodeURIComponent(job)); ok('poll: working', r.json.status==='working', r.json);
ok('poll uses owner/app path', falCalls.some(c=>c.url==='https://queue.fal.run/fal-ai/nano-banana-pro/requests/req-123/status'), falCalls.map(c=>c.url));
falState.done=true; r=await call(h,'GET','/api/render?job='+encodeURIComponent(job)); ok('poll: done with photo', r.json.status==='done' && r.json.image==='https://v3.fal.media/files/photo.jpg' && r.json.w===2048, r.json);
r=await call(h,'GET','/api/render?get=1&job='+encodeURIComponent(job)); ok('hands over the photo', r.code===200 && r.headers['content-type']==='image/jpeg' && r.body.length===5000, {code:r.code, ct:r.headers['content-type']});
r=await call(h,'GET','/api/render?job='+encodeURIComponent(job.replace(/.$/, c=>c==='A'?'B':'A'))); ok('forged ticket refused', r.code===400, r.json);
// a prompt of your own from the environment, with the scene filled in
h=load({ FAL_KEY:'k', RENDER_PROMPT:'Make it a photo. Scene: {scene}. Again: {scene}' }); falCalls=[]; r=await call(h,'POST','/api/render',view);
ok('own prompt from RENDER_PROMPT', r.code===200 && falCalls[0].body.prompt==='Make it a photo. Scene: '+view.scene+'. Again: '+view.scene, falCalls[0]&&falCalls[0].body.prompt);
h=load({ FAL_KEY:'k-test', RENDER_SECRET:'s', RENDER_DAILY_PER_VISITOR:'2', RENDER_DAILY_TOTAL:'3', RENDER_MONTHLY_BUDGET:'0.40' });
await call(h,'POST','/api/render',view);
// 3. limits: 2 per visitor, 3 a day, $0.40 a month at $0.15 each
r=await call(h,'POST','/api/render',view); ok('second render allowed', r.code===200, r.json);
r=await call(h,'POST','/api/render',view); ok('visitor limit', r.code===429 && /daily limit/.test(r.json.error), r.json);
r=await call(h,'POST','/api/render',view,{'x-real-ip':'198.51.100.7'}); ok('monthly budget', r.code===429 && /paused/.test(r.json.error), r.json);
r=await call(h,'GET','/api/render',null,{'x-real-ip':'198.51.100.7'}); ok('status shows the pause', r.json.ok===true && /paused/.test(r.json.paused||''), r.json);
h=load({ FAL_KEY:'k', RENDER_DAILY_PER_VISITOR:'9', RENDER_DAILY_TOTAL:'1', RENDER_MONTHLY_BUDGET:'100' });
await call(h,'POST','/api/render',view); r=await call(h,'POST','/api/render',view,{'x-real-ip':'198.51.100.8'}); ok('daily total', r.code===429 && /today/.test(r.json.error), r.json);
// 4. refusals
h=load({ FAL_KEY:'k' });
r=await call(h,'POST','/api/render',view,{origin:'https://evil.example'}); ok('other sites refused', r.code===403, r.json);
r=await call(h,'POST','/api/render',Object.assign({},view,{image:'https://example.com/x.jpg'})); ok('only image data accepted', r.code===400, r.json);
r=await call(h,'POST','/api/render',Object.assign({},view,{w:20})); ok('bad size refused', r.code===400, r.json);
r=await call(h,'POST','/api/render',Object.assign({},view,{scene:'x'.repeat(5000)+'<script>'}));
ok('scene trimmed', r.code===200 && falCalls.at(-1).body.prompt.length<2200 && !/<script>/.test(falCalls.at(-1).body.prompt), falCalls.at(-1).body.prompt.length);
falState.reject=true; r=await call(h,'POST','/api/render',view); ok('service error passed on', r.code===422 && /too many images/.test(r.json.error), r.json); falState.reject=false;
// 5. the other models get the inputs their APIs expect
for(const [m, want] of [['seedream', b=>b.image_urls.length===3 && b.image_size.width===2560 && b.image_size.height===1440],
  ['seedream-5-lite', b=>b.image_urls.length===3 && b.image_size.width===2560 && b.image_size.height===1440 && /Do not add/.test(b.prompt)],
  ['flux-2-pro', b=>b.image_urls.length===3 && b.image_size.width===1536 && b.output_format==='jpeg'],
  ['flux-depth', b=>b.image_url===IMG && b.control_lora_image_url===IMG && b.control_lora_strength>0 && !/Do not add/.test(b.prompt)],
  ['nano-banana-2', b=>b.image_urls.length===3 && b.aspect_ratio==='16:9']]){
  h=load({ FAL_KEY:'k', RENDER_MODEL:m, RENDER_DAILY_PER_VISITOR:'99', RENDER_MONTHLY_BUDGET:'99' }); falCalls=[]; r=await call(h,'POST','/api/render',view);
  ok('model '+m, r.code===200 && r.json.model===m && falCalls[0] && want(falCalls[0].body), falCalls[0]&&falCalls[0].body&&Object.keys(falCalls[0].body)); }
console.log(JSON.stringify(res,null,1)); console.log(fails?`${fails} FAILED`:'ALL OK');
