// Saving, opening, renaming and deleting layouts, on the device and with a fake shared store. Args: local|cloud
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
const hook = `window.__t={items, S, w2s:(x,y,z)=>{ applyCamera(); _v.set(x,y,z).project(camera); const r=canvas.getBoundingClientRect(); return {x:r.left+(_v.x+1)/2*r.width, y:r.top+(1-_v.y)/2*r.height}; }};\n`;
body = body.replace('requestAnimationFrame(loop);\n})();', hook+'requestAnimationFrame(loop);\n})();');
const mode = process.argv[2]||'local';  // local | cloud
// optional fake claude.use('db') to exercise the cloud path in a test
const fake = mode==='cloud' ? `<script>(function(){ const store=new Map(); const subs=[]; const snapOf=()=>{ const docs=[...store.entries()].map(([id,v])=>({id,exists:true,data:()=>JSON.parse(JSON.stringify(v)),metadata:{fromCache:false,hasPendingWrites:false}})).sort((a,b)=>(b.data().updatedAt||0)-(a.data().updatedAt||0)); return {docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{fromCache:false,hasPendingWrites:false}}; };
  const notify=()=>setTimeout(()=>subs.forEach(f=>f(snapOf())),5); let n=0;
  const col={ orderBy(){return col}, limit(){return col}, onSnapshot(f){ subs.push(f); setTimeout(()=>f(snapOf()),20); return ()=>{}; }, doc(id){ id=id||('c'+(++n)); return { id, async set(v){ if(JSON.stringify(v).length>262144) throw {code:'invalid_argument'}; store.set(id, JSON.parse(JSON.stringify(v))); notify(); }, async update(v){ store.set(id, Object.assign(store.get(id)||{}, v)); notify(); }, async delete(){ store.delete(id); notify(); } }; } };
  window.__store=store; window.claude={ use:async name=> name==='db'?{collection:()=>col}: name==='user'?{id:async()=>'u_test', can:async()=>true}:null }; })();</script>` : '';
fs.writeFileSync('wrapped8.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style>${fake}</head><body>${body}</body></html>`);
const three = fs.readFileSync(THREE);
const browser = await chromium.launch({ executablePath: CHROMIUM, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport:{width:393,height:852}, hasTouch:true, isMobile:true })).newPage();
const errs=[]; page.on('pageerror', e=>errs.push('pageerror '+e.message)); page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
await page.route('**/three.min.js', r=>r.fulfill({body:three, contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.goto('file://'+process.cwd()+'/wrapped8.html'); await page.waitForTimeout(600);
// seed an OLD v2 save (three slots; A modified) to test the upgrade path
await page.evaluate(()=>{ const its=__t.items().map(i=>({...i})); its[3].x+=3; localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('tuhaye-focus','theater'); localStorage.setItem('theater113-walkthrough-v1', JSON.stringify({v:2, slot:'A', layouts:{A:its, B:[], C:[]}, fin:{floor:0,wall:1,ceil:0}, light:'bright'})); });
await page.reload(); await page.waitForTimeout(1300);
const openL=async()=>{ if(await page.evaluate(()=>document.getElementById('sLayout').hidden)) await page.click('#tLayout'); await page.waitForTimeout(250); };
const log=(...a)=>console.log(mode, ...a); let n=0; const shot=async nm=>{ await page.waitForTimeout(500); await page.screenshot({path:`sv-${mode}-${n++}-${nm}.png`}); };
log('after upgrade: cur=', JSON.stringify(await page.evaluate(()=>__t.S.cur)), ' local saved=', await page.evaluate(()=>__t.S.local.map(x=>x.name).join(' | ')));
// make a change → save bar should appear
await page.evaluate(()=>{}); const stool=await page.evaluate(()=>{ const it=__t.items().find(i=>i.type==='ottoman'); return __t.w2s(it.x,it.h,it.z); });
await page.mouse.click(stool.x, stool.y); await page.waitForTimeout(300); await page.click('#sItem [data-act=dup]').catch(()=>{}); await page.waitForTimeout(300); await page.click('#sItem [data-act=close]').catch(()=>{});
log('save bar visible after edit:', await page.isVisible('#saveBar'));
await shot('savebar');
// Save as new via the Layouts sheet
await page.click('#tLayout'); await shot('sheet');
if(await page.isVisible('[data-act=asnew]')) await page.click('[data-act=asnew]');
await page.fill('#f-lname', 'Sofa facing screen'); await page.click('[data-act=savenew]'); await page.waitForTimeout(600);
log('after save as new: cur=', JSON.stringify(await page.evaluate(()=>({...__t.S.cur}))), 'saveBar:', await page.isVisible('#saveBar'));
await openL(); await shot('saved-list');
// start new from Recliner example, edit, save as second layout
await page.click('[data-act=new][data-k=B]'); await page.waitForTimeout(400);
log('started new: cur=', JSON.stringify(await page.evaluate(()=>({...__t.S.cur}))), 'items', await page.evaluate(()=>__t.items().length));
await page.evaluate(()=>{ __t.items()[0].x+=1; }); await page.evaluate(()=>{ if(!document.getElementById('sLayout').hidden) document.querySelector('#sLayout [data-act=close]').click(); }); await page.click('#tRoom'); await page.click('[data-fin=wall][data-i="4"]'); await page.click('#sRoom [data-act=close]');
log('dirty after finish change:', await page.evaluate(()=>__t.S.cur.dirty));
await page.click('#saveNow'); await page.waitForTimeout(300); await page.fill('#f-lname','Recliners navy walls'); await page.press('#f-lname','Enter'); await page.waitForTimeout(600);
// open the first one back
await openL(); await page.waitForTimeout(300);
const names = await page.$$eval('.sv b', els=>els.map(e=>e.textContent));
log('saved list:', JSON.stringify(names));
await page.click('.sv:has-text("Sofa facing screen") [data-act=open]'); await page.waitForTimeout(500);
log('reopened: cur=', JSON.stringify(await page.evaluate(()=>({...__t.S.cur}))), 'items', await page.evaluate(()=>__t.items().length), 'wall finish', await page.evaluate(()=>__t.S.fin.wall));
// device layout saved again moves to synced storage (cloud mode)
await openL(); const devOpen=page.locator('.sv:has-text("Layout A") [data-act=open]'); if(await devOpen.count()){ await devOpen.click(); await page.waitForTimeout(400); await page.evaluate(()=>{}); await page.click('#tRoom'); await page.click('[data-ft=wood]'); await page.click('#sRoom [data-act=close]'); await page.click('#saveNow'); await page.waitForTimeout(600); log('device layout re-saved → cur', JSON.stringify(await page.evaluate(()=>({...__t.S.cur}))), 'local left:', await page.evaluate(()=>__t.S.local.map(x=>x.name).join('|'))); }
// rename + delete
await openL(); await page.click('.sv:has-text("Recliners navy walls") [data-act=rename]'); await page.fill('#f-ren','Recliner plan'); await page.click('[data-act=renok]'); await page.waitForTimeout(400);
await page.click('.sv:has-text("Layout B") [data-act=del]').catch(()=>{}); 
const delBtn = page.locator('.sv:has-text("Layout A") [data-act=del]'); if(await delBtn.count()){ await delBtn.click(); await delBtn.click(); await page.waitForTimeout(400); }
log('after rename/delete:', JSON.stringify(await page.$$eval('.sv b', els=>els.map(e=>e.textContent))));
await shot('final-list');
// reload persists
await page.reload(); await page.waitForTimeout(1300);
log('after reload: cur=', JSON.stringify(await page.evaluate(()=>({...__t.S.cur}))), 'list:', JSON.stringify(await page.evaluate(()=>[...(__t.S.local||[]).map(x=>x.name)])));
if(mode==='cloud') log('cloud store docs:', await page.evaluate(()=>window.__store?[...window.__store.values()].map(v=>v.name+' ('+Math.round(JSON.stringify(v).length/1024)+'KB, thumb '+(v.thumb?'yes':'no')+')').join(' | '):'n/a'));
log(errs.length?errs.join('\n'):'no errors'); await browser.close();
