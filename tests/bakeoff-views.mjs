// Exports the bake-off views: for each camera below, the Photo-real picture plus the depth, outline and object-mask images that
// "Render this view" sends to an image model, and a JSON file with the pieces in view. Args: [list | preview | final] [long side px] [comma-separated view names]
//   list     prints Layout 1's furniture with plan coordinates and rooms (to aim the cameras)
//   preview  Fast quality, small, beauty only, to check the framing
//   final    Photo-real, all passes, into ../bakeoff/views/<name>/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'..'), OUT=path.join(HERE,'out'), DEST=path.join(ROOT,'bakeoff','views');
const APP=path.join(ROOT,'src','app.html'), THREE=path.join(HERE,'vendor','three-r128.min.js');
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const what=process.argv[2]||'final', LONG=+(process.argv[3]||(what==='preview'?768:1536)), only=process.argv[4]?process.argv[4].split(','):null;
fs.mkdirSync(OUT,{recursive:true}); process.chdir(OUT); for(const d of ['tex','models']) try{ fs.symlinkSync('../../'+d, d); }catch(e){}
let body=fs.readFileSync(APP,'utf8');
body=body.replace('requestAnimationFrame(loop);\n})();', `window.__t={eval:c=>eval(c), idle:()=>!refining&&!needs&&!(Q.photo&&PROBE.want)};\nrequestAnimationFrame(loop);\n})();`);
fs.writeFileSync('wrapped_bakeoff.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const browser=await chromium.launch({ executablePath:process.env.CHROMIUM||undefined, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'] });
const page=await (await browser.newContext({ viewport:{width:1280,height:720}, deviceScaleFactor:1 })).newPage();
const errs=[]; page.on('pageerror', e=>errs.push('PAGEERR '+e.message)); page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
await page.route(/^https?:/, r=>r.abort()); // nothing else from the network (registered first: later routes win)
await page.route('**/three.min.js', r=>r.fulfill({body:fs.readFileSync(THREE), contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.goto('file://'+process.cwd()+'/wrapped_bakeoff.html', {waitUntil:'domcontentloaded', timeout:120000});
await page.evaluate(f=>{ localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('theater113-quality', f?'fast':'photo'); }, what!=='final'); await page.reload({waitUntil:'domcontentloaded', timeout:120000});
await page.waitForFunction(()=>window.__t, null, {timeout:120000});
const E=c=>page.evaluate(c=>__t.eval(c), c);
const settle=async()=>{ await page.waitForTimeout(400); const t0=Date.now(); while(Date.now()-t0<90000){ if(await page.evaluate(()=>__t.idle())) break; await page.waitForTimeout(250); } };
await page.waitForTimeout(1500);

if(what==='list'){
  console.log(await E(`JSON.stringify(items().map(it=>{ const M=fyOf(it)>=YM-1, r=roomAt(M?HL.M:HL.L,it.x,it.z); return [it.id,it.type,itemName(it),M?'M':'L',+(it.x+HO[0]).toFixed(1),+(it.z+HO[1]).toFixed(1),it.rot,r?r.n:'-']; }))`).then(s=>JSON.parse(s).map(r=>r.join('  ')).join('\n')));
  console.log(await E(`JSON.stringify(['M','L'].map(k=>HL[k].rooms.map(r=>{ const b=r.bb; return [k,r.n,r.f,+(b.x0+HO[0]).toFixed(1),+(b.x1+HO[0]).toFixed(1),+(b.z0+HO[1]).toFixed(1),+(b.z1+HO[1]).toFixed(1)]; })))`).then(s=>JSON.parse(s).flat().map(r=>r.join('  ')).join('\n')));
  await browser.close(); process.exit(0);
}

// Cameras in plan feet (X east of grid A, Z south of grid 1), looking at (tX, tZ). Walk views stand at eye height.
const VIEWS=[
  {name:'01-great-room', focus:'main', walk:[37,64.5, 22,50, -.12]},
  {name:'02-dining', focus:'main', walk:[19.5,88, 30,72, -.14]},
  {name:'03-kitchen', focus:'main', walk:[21,70, 40,82, -.12]},
  {name:'04-primary-bedroom', focus:'main', walk:[32,25.5, 19,13, -.14]},
  {name:'05-bedroom-2', focus:'main', walk:[26,103, 18,116, -.14]},
  {name:'06-rec-room', focus:'lower', walk:[37,63.5, 23,51, -.12]},
  {name:'07-bedroom-4', focus:'lower', walk:[20,71, 32,84, -.14]},
  {name:'08-theater', focus:'theater', theater:true},
  {name:'09-main-level-3d', focus:'main', orbit:{theta:-.75, phi:.82, r:62}},
  {name:'10-exterior', focus:'house', orbit:{theta:-.8, phi:1.08, r:118}, light:'dim'},
];
fs.mkdirSync(DEST,{recursive:true});
for(const v of VIEWS){ if(only&&!only.includes(v.name)) continue;
  await E(`S.light=${JSON.stringify(v.light||'bright')}; setFocus(${JSON.stringify(v.focus)}); applyLights(); 1`);
  if(v.walk){ const [X,Z,tX,tZ,pitch]=v.walk;
    await E(`setMode('walk'); wk.feet=${v.focus==='main'?'YM':'0'}; wk.seated=false; wk.eye=null; const x=sX(${X}), z=sZ(${Z}); Object.assign(WG,{x,z,y:wk.feet+64/12,yaw:Math.atan2(-(sX(${tX})-x),-(sZ(${tZ})-z)),pitch:${pitch}}); Object.assign(walk,WG); wk.started=true; syncEnv(); dirty(); 1`); }
  else if(v.theater){ await E(`setMode('walk',true); 1`); }
  else { await E(`setMode('orbit',true); Object.assign(OG,${JSON.stringify(v.orbit)}); Object.assign(orbit,OG); dirty(); 1`); }
  await settle();
  if(what==='preview'){ await page.screenshot({path:path.join(OUT,`BO-${v.name}.png`)}); console.log('preview', v.name); continue; }
  const t0=Date.now(), cap=JSON.parse(await E(`JSON.stringify(captureView({long:${LONG}}))`)), dir=path.join(DEST,v.name); fs.mkdirSync(dir,{recursive:true});
  for(const k of ['beauty','depth','lines','ids']){ const [,ext,b64]=cap[k].match(/^data:image\/(\w+);base64,(.*)$/); fs.writeFileSync(path.join(dir,`${k}.${ext==='jpeg'?'jpg':ext}`), Buffer.from(b64,'base64')); delete cap[k]; }
  fs.writeFileSync(path.join(dir,'view.json'), JSON.stringify(Object.assign({name:v.name, camera:v}, cap), null, 1));
  console.log(v.name, `${cap.w}x${cap.h}`, cap.ar, `${((Date.now()-t0)/1000).toFixed(0)}s`, cap.where.room||cap.where.level, cap.items.slice(0,6).map(i=>i.desc).join(', '));
}
console.log(errs.slice(0,20).join('\n')||'no errors'); await browser.close();
