// Mouse: dragging, wall-mounted TV staying on its wall, pinch zoom, placing on walls. Args: light|dark width height
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Paths are relative to this repo. Point PLAYWRIGHT at a Playwright install and CHROMIUM at a browser binary if they are not the defaults.
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'..'), OUT=path.join(HERE,'out');
const APP=path.join(ROOT,'src','app.html'), THREE=path.join(HERE,'vendor','three-r128.min.js');
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const CHROMIUM=process.env.CHROMIUM || undefined;
fs.mkdirSync(OUT,{recursive:true}); process.chdir(OUT); // wrapped pages and screenshots land in tests/out
let body = fs.readFileSync(APP,'utf8');
const hook = `window.__t={PRESETS, items, byId, select, setMode, dimsOf, rowLayout, mk, buildItem, placeAll, orbitSet:o=>{Object.assign(OG,o);Object.assign(orbit,o);dirty();}, st:()=>({mode, selId, orbit:{...orbit}, OG:{...OG}, walk:{...walk}, WG:{...WG}, plan:{...plan}}), w2s:(x,y,z)=>{ applyCamera(); _v.set(x,y,z).project(camera); const r=canvas.getBoundingClientRect(); return {x:r.left+(_v.x+1)/2*r.width, y:r.top+(1-_v.y)/2*r.height}; }, P:()=>P, EDGES:()=>EDGES};\n`;
body = body.replace('requestAnimationFrame(loop);\n})();', hook+'requestAnimationFrame(loop);\n})();');
if(!body.includes('window.__t=')) throw new Error('hook not inserted');
fs.writeFileSync('wrapped.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui;background:#fafafa}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const three = fs.readFileSync(THREE);
const scheme = process.argv[2] || 'light', vw=+(process.argv[3]||393), vh=+(process.argv[4]||780);
const browser = await chromium.launch({ executablePath: CHROMIUM, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport:{width:vw,height:vh}, deviceScaleFactor:1, colorScheme:scheme });
const page = await ctx.newPage();
const errs=[]; page.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text()); }); page.on('pageerror', e=>errs.push('pageerror: '+e.message));
await page.route('**/three.min.js', r=>r.fulfill({body:three, contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.route('https://fonts.gstatic.com/**', r=>r.abort());
// seed old v1 save with a TV pushed behind the alcove wall (reproduces the reported bug)
await page.goto('file://'+process.cwd()+'/wrapped.html');
await page.evaluate(()=>{ localStorage.setItem('tuhaye-focus','theater'); const its=__t.PRESETS.A.make().map(i=>({...i})); const tv=its.find(i=>i.type==='tv'); tv.z=5.2; tv.x=7.5; tv.diag=115; delete tv.shape; localStorage.setItem('theater113-walkthrough-v1', JSON.stringify({v:1, slot:'A', layouts:{A:its, B:[], C:[]}, fin:{floor:0,wall:1,ceil:0}, light:'bright'})); });
await page.reload(); await page.waitForTimeout(1200);
const tag=`${scheme}-${vw}`; let n=0;
const shot=async name=>{ await page.waitForTimeout(450); await page.screenshot({path:`t-${tag}-${String(n++).padStart(2,'0')}-${name}.png`}); };
const log=(...a)=>console.log(...a);
const tvAfter = await page.evaluate(()=>{ const t=__t.items().find(i=>i.type==='tv'); return {x:t.x, z:t.z, rot:t.rot, elev:t.elev}; });
log('TV after load (expect z≈1.69, rot 180):', JSON.stringify(tvAfter));
await shot('orbit');
const ids = await page.evaluate(()=>{ const its=__t.items(); const f=t=>its.find(i=>i.type===t)?.id; return {sec:f('sectional'), tv:f('tv'), ott:f('ottoman'), counter:f('counter42')}; });
// --- drag ottoman with mouse in orbit: check it follows the cursor
let o0 = await page.evaluate(id=>{ const it=__t.byId(id); return __t.w2s(it.x, it.h, it.z); }, ids.ott);
await page.mouse.move(o0.x, o0.y); await page.mouse.down();
for(let i=1;i<=10;i++) await page.mouse.move(o0.x+i*6, o0.y-i*4);
await page.mouse.up(); await page.waitForTimeout(200);
let o1 = await page.evaluate(id=>{ const it=__t.byId(id); return __t.w2s(it.x, it.h, it.z); }, ids.ott);
log('ottoman follow error px:', Math.round(o1.x-(o0.x+60)), Math.round(o1.y-(o0.y-40)));
await shot('dragged-ottoman');
// --- walk mode, select TV and drag it sideways along the wall
await page.click('#views button[data-mode=walk]'); await page.waitForTimeout(600);
await page.evaluate(()=>{ __t.setMode('walk'); });
// put camera looking at TV: sit on sectional
await page.evaluate(id=>__t.select(id), ids.sec); await page.click('#iQuick [data-act=sit]'); await page.waitForTimeout(900);
await shot('sit-sectional');
let t0 = await page.evaluate(id=>{ const it=__t.byId(id); const D=__t.dimsOf(it); return __t.w2s(it.x, it.elev+D.h/2, it.z+0.1); }, ids.tv);
await page.mouse.move(t0.x, t0.y); await page.mouse.down();
for(let i=1;i<=12;i++) await page.mouse.move(t0.x-i*8, t0.y-i*2);
await shot('dragging-tv');
await page.mouse.up(); await page.waitForTimeout(200);
const tvD = await page.evaluate(id=>{ const t=__t.byId(id); return {x:+t.x.toFixed(2), z:+t.z.toFixed(3), rot:t.rot, elev:+t.elev.toFixed(2)}; }, ids.tv);
log('TV after wall drag (z should stay ≈1.69):', JSON.stringify(tvD));
await shot('tv-dragged');
// --- pinch in walk (synthetic touch)
const pinch = async (cx,cy,d0,d1,steps=8)=>{ await page.evaluate(([cx,cy,d0,d1,steps])=>{ const c=document.getElementById('c'); const ev=(t,id,x,y)=>c.dispatchEvent(new PointerEvent(t,{pointerId:id,pointerType:'touch',clientX:x,clientY:y,bubbles:true,isPrimary:id===11,button:0}));
  ev('pointerdown',11,cx-d0/2,cy); ev('pointerdown',12,cx+d0/2,cy); for(let i=1;i<=steps;i++){ const d=d0+(d1-d0)*i/steps; ev('pointermove',11,cx-d/2,cy); ev('pointermove',12,cx+d/2,cy); } ev('pointerup',11,cx-d1/2,cy); ev('pointerup',12,cx+d1/2,cy); },[cx,cy,d0,d1,steps]); };
await page.evaluate(()=>__t.select(null));
const w0 = await page.evaluate(()=>__t.st().WG);
await pinch(vw/2, vh/2, 80, 260); await page.waitForTimeout(600);
const w1 = await page.evaluate(()=>__t.st().WG);
log('walk pinch-out moved ft:', Math.hypot(w1.x-w0.x, w1.z-w0.z).toFixed(2), 'z', w0.z.toFixed(2),'->',w1.z.toFixed(2));
await shot('walk-pinched-in');
await pinch(vw/2, vh/2, 260, 80); await page.waitForTimeout(600);
const w2 = await page.evaluate(()=>__t.st().WG);
log('walk pinch-in back ft:', Math.hypot(w2.x-w1.x, w2.z-w1.z).toFixed(2));
// --- orbit pinch anchored at a point
await page.click('#views button[data-mode=orbit]'); await page.waitForTimeout(700);
const anchorPt = await page.evaluate(id=>{ const it=__t.byId(id); return {w:{x:it.x,y:it.h,z:it.z}, s:__t.w2s(it.x,it.h,it.z)}; }, ids.counter);
const r0=(await page.evaluate(()=>__t.st().OG)).r;
await pinch(anchorPt.s.x, anchorPt.s.y, 80, 240); await page.waitForTimeout(900);
const after = await page.evaluate(([w])=>({s:__t.w2s(w.x,w.y,w.z), r:__t.st().orbit.r}), [anchorPt.w]);
log('orbit pinch r', r0.toFixed(1),'->',after.r.toFixed(1), ' anchor drift px', Math.round(after.s.x-anchorPt.s.x), Math.round(after.s.y-anchorPt.s.y));
await shot('orbit-pinched');
await page.click('#views button[data-mode=orbit]'); await page.waitForTimeout(700); // recenter
// --- couch shapes via inspector
await page.evaluate(id=>__t.select(id), ids.sec); await page.waitForTimeout(200);
await shot('compact-inspector');
if(await page.isVisible('#iQuick [data-act=more]')) await page.click('#iQuick [data-act=more]'); await page.waitForTimeout(700);
for(const s of ['L','U','curved','straight','chaise']){ await page.click(`#iBody [data-k=shape][data-v="${s}"]`); await shot('shape-'+s); }
await page.click('#iBody [data-k=arms][data-v=rolled]'); await page.click('#iBody [data-k=uph][data-v=leather]'); await shot('rolled-leather');
await page.click('#iBody [data-act=nudge][data-v=r]'); await page.click('#iBody [data-act=step][data-v="1"]'); await page.click('#iBody [data-act=nudge][data-v=u]');
await page.click('#sItem [data-act=close]');
// --- add L-shaped bar by tap-to-place
await page.click('#tAdd'); await page.click('#addBody .cat:has-text("L-shaped bar")'); await page.waitForTimeout(200);
await shot('placing-banner');
await page.waitForTimeout(900); const spot = await page.evaluate(()=>__t.w2s(5.0,0,-25.5)); await page.mouse.click(spot.x, spot.y); await page.waitForTimeout(300);
await shot('placed-Lbar');
// --- add bar ledge on a wall (tap the east wall)
await page.click('#sItem [data-act=close]');
await page.click('#views button[data-mode=orbit]'); await page.click('#tAdd'); await page.click('#addBody .cat:has-text("Bar ledge")');
await page.waitForTimeout(900); const wpt = await page.evaluate(()=>__t.w2s(__t.P().W-0.01, 4, -12)); log('wall tap at', JSON.stringify(wpt), await page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.id||document.elementFromPoint(x,y)?.className, [wpt.x,wpt.y])); await page.mouse.click(wpt.x, wpt.y); await page.waitForTimeout(300);
const ledge = await page.evaluate(()=>{ const l=__t.items().find(i=>i.type==='ledge'); return l?{x:+l.x.toFixed(2),z:+l.z.toFixed(2),rot:l.rot,elev:+(l.elev*12).toFixed(1)}:null; });
log('ledge placed:', JSON.stringify(ledge));
await shot('placed-ledge');
// --- recliner rows: 6 seats curved
await page.click('#sItem [data-act=close]');
await page.click('#views button[data-mode=orbit]'); await page.click('#tAdd'); await page.click('#addBody .cat:has-text("Curved row of 4")');
await page.waitForTimeout(900); const rpt = await page.evaluate(()=>__t.w2s(8.7,0,-4)); await page.mouse.click(rpt.x, rpt.y); await page.waitForTimeout(300);
if(await page.isVisible('#iQuick [data-act=more]') && await page.evaluate(()=>document.getElementById('sItem').classList.contains('compact'))) await page.click('#iQuick [data-act=more]');
await page.click('#iBody [data-k=n][data-v="6"]'); await shot('row6-curved');
// --- plan view drag of the TV along its wall
await page.click('#sItem [data-act=close]');
await page.click('#views button[data-mode=plan]'); await page.waitForTimeout(700);
await shot('plan');
// tap counter in plan to see guides
await page.waitForTimeout(900); const cpt = await page.evaluate(id=>{ const it=__t.byId(id); return __t.w2s(it.x, 4, it.z); }, ids.counter); await page.mouse.click(cpt.x, cpt.y); await shot('plan-counter-selected');
log('final items:', JSON.stringify(await page.evaluate(()=>__t.items().map(i=>[i.type,+i.x.toFixed(1),+i.z.toFixed(1),i.shape||'']))));
console.log(tag, errs.length? errs.join('\n') : 'no errors');
await browser.close();
