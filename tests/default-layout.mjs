// Which layout opens first: newest saved default, unsaved drafts kept, offline fallback, Make default.
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
const hook = `window.__t={items, S, Cloud, DEFAULT_LAYOUT};\n`;
body = body.replace('requestAnimationFrame(loop);\n})();', hook+'requestAnimationFrame(loop);\n})();');
const D = JSON.parse(fs.readFileSync(path.join(HERE,'fixtures','default.json'),'utf8'));
// fake db with several collections and document listeners; seed comes from window.__seed (set per scenario before load)
const fake = `<script>(function(){ const seed=JSON.parse(localStorage.getItem('__seed')||'{}'); const cols={};
  const C=name=>{ if(cols[name]) return cols[name]; const store=new Map(Object.entries(seed[name]||{})), subs=[], dsubs={}; let n=0;
    const snapDoc=id=>({id, exists:store.has(id), data:()=>store.has(id)?JSON.parse(JSON.stringify(store.get(id))):undefined, metadata:{fromCache:false,hasPendingWrites:false}});
    const snap=()=>{ const docs=[...store.keys()].map(snapDoc).sort((a,b)=>(b.data().updatedAt||0)-(a.data().updatedAt||0)); return {docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{fromCache:false,hasPendingWrites:false}}; };
    const notify=id=>setTimeout(()=>{ subs.forEach(f=>f(snap())); (dsubs[id]||[]).forEach(f=>f(snapDoc(id))); },5);
    const col={ store, orderBy(){return col}, limit(){return col}, onSnapshot(f){ subs.push(f); setTimeout(()=>f(snap()),30); return ()=>{}; },
      doc(id){ id=id||('c'+(++n)); return { id, onSnapshot(f){ (dsubs[id]=dsubs[id]||[]).push(f); setTimeout(()=>f(snapDoc(id)),10); return ()=>{}; }, async set(v){ store.set(id, JSON.parse(JSON.stringify(v))); notify(id); }, async update(v){ store.set(id, Object.assign(store.get(id)||{}, v)); notify(id); }, async delete(){ store.delete(id); notify(id); } }; } };
    return cols[name]=col; };
  window.__cols=cols; if(seed.__nocloud) return; window.claude={ use:async name=> name==='db'?{collection:C}: name==='user'?{id:async()=>'u_test', can:async()=>true}:null }; })();</script>`;
fs.writeFileSync('wrapped9.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style>${fake}</head><body>${body}</body></html>`);
const three = fs.readFileSync(THREE);
const browser = await chromium.launch({ executablePath: CHROMIUM, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport:{width:393,height:852}, hasTouch:true, isMobile:true })).newPage();
const errs=[]; page.on('pageerror', e=>errs.push('pageerror '+e.message)); page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
await page.route('**/three.min.js', r=>r.fulfill({body:three, contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.goto('file://'+process.cwd()+'/wrapped9.html'); await page.waitForTimeout(300);
const fl = {name:D.name, items:D.items, fin:D.fin, count:D.items.length, thumb:null, createdAt:1, updatedAt:D.updatedAt};
const other = {name:'Recliner plan', items:D.items.slice(0,5), fin:{floor:2,wall:3,ceil:0}, count:5, thumb:null, createdAt:2, updatedAt:D.updatedAt+500};
const state = async()=>page.evaluate(()=>({cur:__t.S.cur, n:__t.items().length, fin:__t.S.fin, boot:!!__t.S.boot}));
const run = async(name, seed, store, check)=>{ await page.evaluate(([s,st])=>{ localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('__seed', JSON.stringify(s)); if(st) localStorage.setItem('theater113-walkthrough-v1', JSON.stringify(st)); }, [seed, store]);
  await page.reload(); await page.waitForTimeout(1500); const st=await state(); console.log(name.padEnd(34), JSON.stringify(st.cur), 'items', st.n, check(st)?'PASS':'FAIL'); return st; };
await run('A cloud has same copy', {layouts:{[D.id]:fl}}, null, s=>s.cur.id===D.id && s.cur.where==='cloud' && !s.cur.dirty && s.n===14);
await run('B cloud has newer copy', {layouts:{[D.id]:{...fl, items:[...D.items, {...D.items[4], id:99, x:20}], count:15, updatedAt:D.updatedAt+999}}}, null, s=>s.cur.id===D.id && s.n===15);
await run('C default points elsewhere', {layouts:{[D.id]:fl, x2:other}, meta:{default:{id:'x2'}}}, null, s=>s.cur.id==='x2' && s.n===5 && s.fin.wall===3);
await run('D unsaved draft is kept', {layouts:{[D.id]:fl}}, {v:3, items:D.items.slice(0,3), cur:{id:null,where:null,name:'My draft',dirty:true}, fin:{floor:1,wall:1,ceil:0}, light:'dim'}, s=>s.cur.name==='My draft' && s.cur.dirty && s.n===3);
await run('E clean other layout → default', {layouts:{[D.id]:fl, x2:other}}, {v:3, items:other.items, cur:{id:'x2',where:'cloud',name:'Recliner plan',dirty:false}, fin:other.fin, light:'bright'}, s=>s.cur.id===D.id && s.n===14);
await run('F no cloud → embedded copy', {__nocloud:true}, null, s=>s.cur.id===null && s.cur.name===D.name && s.n===14 && !s.cur.dirty);
await run('G default deleted → embedded', {layouts:{x2:other}}, null, s=>s.cur.id===null && s.cur.name===D.name && s.n===14);
// H: make another layout the default from the sheet, then reload
await run('H setup', {layouts:{[D.id]:fl, x2:other}}, null, s=>s.cur.id===D.id);
await page.click('#tLayout'); await page.waitForTimeout(400);
const badge0 = await page.evaluate(()=>[...document.querySelectorAll('.sv')].map(c=>c.querySelector('b').textContent+':'+(c.querySelector('.stat.def')?'default':'')+(c.querySelector('[data-act=def]')?'btn':'')));
console.log('H cards before', JSON.stringify(badge0));
await page.evaluate(()=>{ const c=[...document.querySelectorAll('.sv')].find(c=>c.querySelector('b').textContent==='Recliner plan'); c.querySelector('[data-act=def]').click(); }); await page.waitForTimeout(400);
const badge1 = await page.evaluate(()=>[...document.querySelectorAll('.sv')].map(c=>c.querySelector('b').textContent+':'+(c.querySelector('.stat.def')?'default':'')+(c.querySelector('[data-act=def]')?'btn':'')));
const meta = await page.evaluate(()=>window.__cols.meta && JSON.stringify([...window.__cols.meta.store.entries()]));
console.log('H cards after', JSON.stringify(badge1), 'meta', meta, badge1.some(x=>x==='Recliner plan:default')&&meta.includes('x2')?'PASS':'FAIL');
await page.waitForTimeout(2500); await page.screenshot({path:'d9-layouts.png'});
console.log(errs.join('\n')||'no errors'); await browser.close();
