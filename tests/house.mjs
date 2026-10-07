// Whole-house checks: walking up the stairs between levels, walls that stop you, doorways and sliders that let you through,
// placing and dragging furniture on the main level, hanging a TV on a house wall, and the level picker hiding the main level.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'..'), OUT=path.join(HERE,'out');
const APP=path.join(ROOT,'src','app.html'), THREE=path.join(HERE,'vendor','three-r128.min.js');
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
fs.mkdirSync(OUT,{recursive:true}); process.chdir(OUT); for(const d of ['tex','models']) try{ fs.symlinkSync('../../'+d, d); }catch(e){} // the scanned textures and models, beside the wrapped pages
let body=fs.readFileSync(APP,'utf8');
body=body.replace('requestAnimationFrame(loop);\n})();', `window.__t={eval:c=>eval(c)};\nrequestAnimationFrame(loop);\n})();`);
fs.writeFileSync('wrapped_ht.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const browser=await chromium.launch({ executablePath:process.env.CHROMIUM||undefined, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'] });
const page=await (await browser.newContext({ viewport:{width:1100,height:760}, deviceScaleFactor:1 })).newPage();
const errs=[]; page.on('pageerror', e=>errs.push('PAGEERR '+e.message)); page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
await page.route('**/three.min.js', r=>r.fulfill({body:fs.readFileSync(THREE), contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.goto('file://'+process.cwd()+'/wrapped_ht.html'); await page.evaluate(()=>{ localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('theater113-quality','fast'); }); await page.reload();
await page.waitForFunction(()=>window.__t, null, {timeout:120000});
const E=c=>page.evaluate(c=>__t.eval(c), c);
const res={}; let fails=0; const ok=(name,cond,info)=>{ res[name]=cond?'ok':'FAIL '+JSON.stringify(info??''); if(!cond) fails++; };
// 1. walking from the lower stair hall up both flights to the main stair hall
let r=await E(`setMode('walk'); Object.assign(WG,{x:sX(37.6),z:sZ(44.4)}); wk.feet=0; const out=[]; const step=(dx,dz,n)=>{ for(let i=0;i<n;i++){ moveGoal(dx,dz); } out.push([+(WG.x+HO[0]).toFixed(2),+(WG.z+HO[1]).toFixed(2),+wk.feet.toFixed(2)]); };
  step(-.3,0,40); step(0,-.3,20); step(.3,0,40); step(.3,0,10); JSON.stringify(out)`);
r=JSON.parse(r); ok('stairs up to main', r[3][2]>11.4, r);
// 2. walls block walking: from the great room try to walk west through the wall north of the slider (at Z 47.5)
r=JSON.parse(await E(`Object.assign(WG,{x:sX(20),z:sZ(48.5)}); wk.feet=YM; for(let i=0;i<60;i++) moveGoal(-.3,0); JSON.stringify([WG.x+HO[0],wk.feet])`));
ok('wall blocks', r[0]>14.4, r);
// 3. ...but the slider lets you out to the deck
r=JSON.parse(await E(`Object.assign(WG,{x:sX(20),z:sZ(57)}); wk.feet=YM; for(let i=0;i<60;i++) moveGoal(-.3,0); JSON.stringify([WG.x+HO[0],wk.feet])`));
ok('slider to deck', r[0]<10 && Math.abs(r[1]-(11.5-1/12))<.01, r);
// 4. the theater doorway: from the hall into the theater
r=JSON.parse(await E(`Object.assign(WG,{x:sX(36),z:sZ(90.2)}); wk.feet=0; for(let i=0;i<40;i++) moveGoal(.3,0); JSON.stringify([WG.x+HO[0],wk.feet, inPoly(WG.x,WG.z,POLY)])`));
ok('into theater', r[2]===true, r);
// 5. place a sofa on the main level (plan view) and a TV on a great room wall
await E(`setMode('orbit'); setFocus('main'); setMode('plan'); Object.assign(plan,{cx:sX(30),cz:sZ(56),vh:60}); Object.assign(PG,plan); applyCamera();`);
const scr=async (X,Z,Y)=>JSON.parse(await E(`_v.set(sX(${X}),${Y},sZ(${Z})).project(camera); const rc=canvas.getBoundingClientRect(); JSON.stringify([rc.left+(_v.x+1)/2*rc.width, rc.top+(1-_v.y)/2*rc.height])`));
let [px,py]=await scr(30,56,11.5);
r=JSON.parse(await E(`placing=['sofa',{},'Sofa']; doPlace(${px},${py}); const it=items()[items().length-1]; JSON.stringify({t:it.type,X:it.x+HO[0],Z:it.z+HO[1],fy:it.fy})`));
ok('sofa on main floor', r.t==='sofa' && Math.abs(r.fy-11.5)<.01 && Math.abs(r.X-30)<.6, r);
// drag it 6 ft east via dragTo
r=JSON.parse(await E(`const it=items()[items().length-1]; const g={id:it.id,type:'drag',py:YM+1,ox:0,oz:0}; const [a,b]=[${px},${py}]; _v.set(sX(36),YM+1,sZ(56)).project(camera); const rc=canvas.getBoundingClientRect(); dragTo(g, rc.left+(_v.x+1)/2*rc.width, rc.top+(1-_v.y)/2*rc.height); JSON.stringify({X:it.x+HO[0],Z:it.z+HO[1]})`));
ok('drag on main floor', Math.abs(r.X-36)<.7, r);
// drag beyond the east wall: should stop inside
r=JSON.parse(await E(`const it=items()[items().length-1]; const g={id:it.id,type:'drag',py:YM+1,ox:0,oz:0}; _v.set(sX(60),YM+1,sZ(52)).project(camera); const rc=canvas.getBoundingClientRect(); dragTo(g, rc.left+(_v.x+1)/2*rc.width, rc.top+(1-_v.y)/2*rc.height); JSON.stringify({X:it.x+HO[0],Z:it.z+HO[1]})`));
ok('drag stops at wall', r.X<45.6, r);
// TV on a wall: use the floor-pick fallback near the great room north wall (Z 46.96 face)
[px,py]=await scr(30,47.6,11.5);
r=JSON.parse(await E(`placing=['tv',{},'TV']; doPlace(${px},${py}); const it=items()[items().length-1]; JSON.stringify({t:it.type,X:it.x+HO[0],Z:it.z+HO[1],fy:it.fy,rot:it.rot,elev:it.elev})`));
ok('tv on great room wall', r.t==='tv' && Math.abs(r.fy-11.5)<.01 && Math.abs(r.Z-46.51)<.4 && Math.abs(r.rot)<1, r);
// 6. lower level theater items untouched, and hidden flags: switch to Lower: main items hidden
r=JSON.parse(await E(`setFocus('lower'); const it=items()[items().length-1]; JSON.stringify([groups.get(it.id).visible, items().filter(i=>!i.fy).length])`));
ok('main items hidden on lower', r[0]===false && r[1]>5, r);
// 7. theater mode still works: room polygon and a sectional sits in it
r=JSON.parse(await E(`setFocus('theater'); setMode('orbit'); JSON.stringify([POLY.length, items().some(i=>i.type==='sectional'||i.type==='row4')])`));
ok('theater intact', r[0]>8 && r[1], r);
console.log(JSON.stringify(res,null,1)); console.log(errs.slice(0,10).join('\n')||'no errors'); console.log(fails?`${fails} FAILED`:'ALL OK');
await browser.close();
