// Renders a set of views to tests/out for eyeballing. Args: tag [fast] [WxH] [comma-separated shots] [js to eval]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Paths are relative to this repo. Point PLAYWRIGHT at a Playwright install and CHROMIUM at a browser binary if they are not the defaults.
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'..'), OUT=path.join(HERE,'out');
const APP=path.join(ROOT,'src','app.html'), THREE=path.join(HERE,'vendor','three-r128.min.js');
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const CHROMIUM=process.env.CHROMIUM || undefined;
fs.mkdirSync(OUT,{recursive:true}); process.chdir(OUT); // wrapped pages and screenshots land in tests/out
// usage: node look2.mjs tag [fast] [WxH] [shots]
const tag=process.argv[2]||'v', fast=process.argv[3]==='fast', [VW,VH]=(process.argv[4]||'1000x700').split('x').map(Number), only=process.argv[5]?process.argv[5].split(','):null;
let body = fs.readFileSync(APP,'utf8');
const hook = `window.__t={eval:c=>eval(c), items, byId, select, setMode, dimsOf, mk, buildItem, placeAll, applyLights:()=>applyLights(), S, Q, PH, pipe, applyQuality, idle:()=>!refining&&!needs&&!(Q.photo&&PROBE.want), PROBE, n:()=>pipe.n, orbitSet:o=>{Object.assign(OG,o);Object.assign(orbit,o);dirty();}, walkSet:o=>{Object.assign(WG,o);Object.assign(walk,o);wk.started=true;dirty();}, sit:id=>{ const e=midEye(byId(id)); sitAt(e); setMode('walk'); }, info:()=>({gl2:renderer.capabilities.isWebGL2, ok:PHOTO_OK, photo:Q.photo, last:PH.last})};\n`;
body = body.replace('requestAnimationFrame(loop);\n})();', hook+'requestAnimationFrame(loop);\n})();');
fs.writeFileSync('wrapped_look2.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const three = fs.readFileSync(THREE);
const browser = await chromium.launch({ executablePath: CHROMIUM, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport:{width:VW,height:VH}, deviceScaleFactor:1 })).newPage();
const errs=[]; page.on('pageerror', e=>errs.push('PAGEERR '+e.message)); page.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.text()); });
await page.route('**/three.min.js', r=>r.fulfill({body:three, contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.goto('file://'+process.cwd()+'/wrapped_look2.html'); await page.evaluate(f=>{ localStorage.clear(); localStorage.setItem('tuhaye-focus','theater'); if(f) localStorage.setItem('theater113-quality','fast'); }, fast); await page.reload(); await page.waitForTimeout(1200);
console.log(JSON.stringify(await page.evaluate(()=>__t.info())));
const tag2=tag+(fast?'-fast':''); let n=0;
const settle=async()=>{ await page.waitForTimeout(250); const t0=Date.now(); while(Date.now()-t0<60000){ if(await page.evaluate(()=>__t.idle())) break; await page.waitForTimeout(200); } };
const shot=async nm=>{ n++; if(only && !only.includes(nm)) return; await settle(); await page.screenshot({path:`P-${tag2}-${nm}.png`}); };
await page.evaluate(()=>{ const add=(t,x,z,r,o)=>{ const it=__t.mk(t,x,z,r,o||{}); __t.items().push(it); __t.buildItem(it); };
  add('rug',8.7,-7.5,0,{w:144,d:108}); add('sconce',0.22,-6,90); add('sconce',0.22,-11,90); add('plant',1.2,-1.4,0); __t.placeAll(); });
await page.evaluate(()=>{ document.querySelector('.lane').style.display='none'; });
if(process.argv[6]) await page.evaluate(c=>__t.eval(c), process.argv[6]);
await page.evaluate(()=>__t.orbitSet({theta:2.6, phi:.85, r:46, tx:14, ty:1, tz:-12})); await shot('overview');
await page.evaluate(()=>__t.setMode('walk')); await page.evaluate(()=>__t.walkSet({x:3.2,z:-18.4,y:5.33,yaw:Math.atan2(-(8.7-3.2),-(-10+18.4)),pitch:-.32})); await shot('walk-sofa');
await page.evaluate(()=>__t.walkSet({x:3.4,z:-23.2,y:5.33,yaw:Math.atan2(-(9.5-3.4),-(-23.6+23.2)),pitch:-.12})); await shot('walk-bar');
await page.evaluate(()=>__t.walkSet({x:8.6,z:-16.8,y:5.33,yaw:Math.PI,pitch:-.08})); await shot('walk-tv');
await page.evaluate(()=>__t.walkSet({x:20,z:-14,y:5.33,yaw:Math.atan2(-(25-20),-(-3+14)),pitch:-.12})); await shot('walk-golf');
const sec=await page.evaluate(()=>__t.items().find(i=>i.type==='sectional').id); await page.evaluate(id=>__t.sit(id), sec); await shot('seat');
await page.evaluate(()=>{ __t.S.light='movie'; __t.applyLights(); }); await shot('movie');
await page.evaluate(()=>{ __t.S.light='dim'; __t.applyLights(); }); await page.evaluate(()=>__t.walkSet({x:6.5,z:-8.5,y:5.33,yaw:Math.PI/2,pitch:-.05})); await shot('dim-sconce');
await page.evaluate(()=>{ __t.S.light='bright'; __t.applyLights(); __t.setMode('plan'); }); await shot('plan');
console.log(JSON.stringify(await page.evaluate(()=>__t.info())));
console.log(errs.slice(0,20).join('\n')||'no errors'); await browser.close();

