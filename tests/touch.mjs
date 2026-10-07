// Touch (phone): select then drag, rotate handle, sheet swipes, flick inertia. Args: light 393 852 quick
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Paths are relative to this repo. Point PLAYWRIGHT at a Playwright install and CHROMIUM at a browser binary if they are not the defaults.
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'..'), OUT=path.join(HERE,'out');
const APP=path.join(ROOT,'src','app.html'), THREE=path.join(HERE,'vendor','three-r128.min.js');
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const CHROMIUM=process.env.CHROMIUM || undefined;
fs.mkdirSync(OUT,{recursive:true}); process.chdir(OUT); for(const d of ['tex','models']) try{ fs.symlinkSync('../../'+d, d); }catch(e){} // the scanned textures and models, beside the wrapped pages // wrapped pages and screenshots land in tests/out
let body = fs.readFileSync(APP,'utf8');
const hook = `window.__t={PRESETS, items, byId, select, dimsOf, st:()=>({mode, selId, OG:{...OG}, orbit:{...orbit}}), w2s:(x,y,z)=>{ applyCamera(); _v.set(x,y,z).project(camera); const r=canvas.getBoundingClientRect(); return {x:r.left+(_v.x+1)/2*r.width, y:r.top+(1-_v.y)/2*r.height}; }, info:()=>renderer.info.render.calls};\n`;
body = body.replace('requestAnimationFrame(loop);\n})();', hook+'requestAnimationFrame(loop);\n})();');
fs.writeFileSync('wrapped6.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui;background:#fafafa}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const three = fs.readFileSync(THREE);
const [scheme, vw, vh, full] = [process.argv[2]||'light', +(process.argv[3]||393), +(process.argv[4]||852), process.argv[5]!=='quick'];
const browser = await chromium.launch({ executablePath: CHROMIUM, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'] });
const ctx = await browser.newContext({ viewport:{width:vw,height:vh}, deviceScaleFactor:1, colorScheme:scheme, hasTouch:true, isMobile:true });
const page = await ctx.newPage(); const errs=[];
page.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text()); }); page.on('pageerror', e=>errs.push('pageerror: '+e.message));
await page.route('**/three.min.js', r=>r.fulfill({body:three, contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.route('https://fonts.gstatic.com/**', r=>r.abort());
await page.goto('file://'+process.cwd()+'/wrapped6.html'); await page.evaluate(()=>{ localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('tuhaye-focus','theater'); sessionStorage.setItem('tuhaye-edit','1'); }); await page.reload(); await page.waitForTimeout(1200);
const tag=`${scheme}-${vw}x${vh}`; let n=0; const log=(...a)=>console.log(tag,...a);
const shot=async name=>{ await page.waitForTimeout(500); await page.screenshot({path:`m-${tag}-${String(n++).padStart(2,'0')}-${name}.png`}); };
// touch helper: drag path with synthetic touch pointer events on an element (default canvas)
const touch = (pts, sel='#c', delay=16) => page.evaluate(async ([pts,sel,delay])=>{ const el=document.querySelector(sel); const ev=(t,p)=>el.dispatchEvent(new PointerEvent(t,{pointerId:21,pointerType:'touch',clientX:p[0],clientY:p[1],bubbles:true,isPrimary:true,button:0}));
  ev('pointerdown',pts[0]); for(let i=1;i<pts.length;i++){ await new Promise(r=>setTimeout(r,delay)); ev('pointermove',pts[i]); } ev('pointerup',pts[pts.length-1]); }, [pts,sel,delay]);
const line=(x0,y0,x1,y1,k=12)=>Array.from({length:k+1},(_,i)=>[x0+(x1-x0)*i/k, y0+(y1-y0)*i/k]);
await shot('home');
const ids = await page.evaluate(()=>{ const its=__t.items(); const f=t=>its.find(i=>i.type===t)?.id; return {sec:f('sectional'), tv:f('tv'), ott:f('ottoman')}; });
const secPos=()=>page.evaluate(id=>{ const it=__t.byId(id); return {x:it.x, z:it.z, rot:it.rot, s:__t.w2s(it.x, it.h*.9, it.z-it.d*.3)}; }, ids.sec);
let s0=await secPos(); const th0=(await page.evaluate(()=>__t.st().OG)).theta;
await touch(line(s0.s.x, s0.s.y, s0.s.x+90, s0.s.y+10)); await page.waitForTimeout(700);
let s1=await secPos(); const th1=(await page.evaluate(()=>__t.st().OG)).theta;
log('swipe on unselected sofa → sofa moved?', Math.hypot(s1.x-s0.x,s1.z-s0.z).toFixed(2), ' camera turned?', (th1-th0).toFixed(3));
// tap sofa to select
s1=await secPos(); await touch([[s1.s.x,s1.s.y]]); await page.waitForTimeout(800);
log('selected:', await page.evaluate(()=>__t.st().selId)===ids.sec);
await shot('selected-compact');
// drag selected sofa
s1=await secPos(); await touch(line(s1.s.x, s1.s.y, s1.s.x-40, s1.s.y-25)); await page.waitForTimeout(400);
let s2=await secPos(); log('drag selected sofa moved ft:', Math.hypot(s2.x-s1.x,s2.z-s1.z).toFixed(2));
// rotate handle
const hb = await page.locator('#rotH').boundingBox(); log('rotate handle visible:', !!hb);
if(hb){ const cx=hb.x+22, cy=hb.y+22; const cs=await page.evaluate(()=>{ const t=document.getElementById('rotH'); return null; });
  const st=await page.evaluate(()=>({})); const center=await page.evaluate(id=>{ const it=__t.byId(id); return __t.w2s(it.x, it.h/2, it.z); }, ids.sec);
  const r=Math.hypot(cx-center.x, cy-center.y), a0=Math.atan2(cy-center.y, cx-center.x); const pts=[]; for(let i=0;i<=12;i++){ const a=a0-(Math.PI/4)*i/12; pts.push([center.x+r*Math.cos(a), center.y+r*Math.sin(a)]); }
  const r0=(await secPos()).rot; await touch(pts,'#rotH'); await page.waitForTimeout(500); log('rotate by handle: rot', r0, '->', (await secPos()).rot, '(expect ≈ +45 from a 45° counter-clockwise drag)'); }
await shot('rotated');
// swipe up on sheet head → expand
let head = await page.locator('#sItem .sh-head').boundingBox(); await touch(line(head.x+60, head.y+20, head.x+60, head.y-50, 6), '#sItem .sh-head'); await page.waitForTimeout(800);
log('expanded after swipe up:', await page.evaluate(()=>!document.getElementById('sItem').classList.contains('compact')));
await shot('expanded');
head = await page.locator('#sItem .sh-head').boundingBox(); await touch(line(head.x+60, head.y+20, head.x+60, head.y+140, 6), '#sItem .sh-head'); await page.waitForTimeout(500);
log('closed after swipe down:', await page.evaluate(()=>document.getElementById('sItem').hidden));
if(!(await page.evaluate(()=>document.getElementById('sItem').hidden))) await page.click('#sItem [data-act=close]');
// inertia: fast flick on empty area
const thA=(await page.evaluate(()=>__t.st().OG)).theta; await touch(line(60, vh*0.25, 200, vh*0.25, 5), '#c', 8); const thB=(await page.evaluate(()=>__t.st().OG)).theta; await page.waitForTimeout(500); const thC=(await page.evaluate(()=>__t.st().OG)).theta;
log('flick: theta at release', (thB-thA).toFixed(3), ' after coasting', (thC-thA).toFixed(3));
await page.click('#fitBtn'); await page.waitForTimeout(900); await shot('fit');
if(full){
  await page.click('#tAdd'); await shot('add-sheet'); await page.click('#sAdd [data-act=close]');
  await page.click('#tRoom'); await shot('room-sheet'); await page.click('#sRoom [data-act=close]');
  await page.click('#tLayout'); await shot('layout-sheet'); await page.click('#sLayout [data-act=close]');
  await page.click('#views button[data-mode=walk]'); await page.waitForTimeout(900); await shot('walk');
  const tvp=await page.evaluate(id=>{ const it=__t.byId(id); const D=__t.dimsOf(it); return __t.w2s(it.x, it.elev+D.h/2, it.z); }, ids.tv); await touch([[tvp.x,tvp.y]]); await page.waitForTimeout(700); await shot('walk-tv-selected');
  await page.click('#sItem [data-act=close]');
  await page.click('#views button[data-mode=plan]'); await page.waitForTimeout(900); await shot('plan');
}
log('draw calls', await page.evaluate(()=>__t.info()));
log(errs.length? errs.join('\n') : 'no errors');
await browser.close();
