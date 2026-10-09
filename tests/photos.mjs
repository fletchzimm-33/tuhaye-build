// "Render this view" and the Photos library, end to end against a stand-in for api/render.js: the page captures the view and posts the
// picture, outline and depth images; the stand-in checks them, says "working" once, then returns a photo. Then the photo opens in the viewer,
// compares against the 3D view, takes you back to the view, survives a reload (IndexedDB), and deletes.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'..'), OUT=path.join(HERE,'out');
const APP=path.join(ROOT,'src','app.html'), THREE=path.join(HERE,'vendor','three-r128.min.js');
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
fs.mkdirSync(OUT,{recursive:true}); process.chdir(OUT); for(const d of ['tex','models','photos']) try{ fs.symlinkSync('../../'+d, d); }catch(e){}
let body=fs.readFileSync(APP,'utf8');
body=body.replace('requestAnimationFrame(loop);\n})();', `window.__t={eval:c=>eval(c)};\nrequestAnimationFrame(loop);\n})();`);
fs.writeFileSync('wrapped_photos.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
// a plain static server, so the page runs over http like the real site
const types={'.html':'text/html','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.glb':'model/gltf-binary','.json':'application/json'};
const server=http.createServer((req,res)=>{ const f=path.join(OUT, decodeURIComponent(req.url.split('?')[0])); fs.readFile(f,(e,b)=>{ if(e){ res.statusCode=404; return res.end(); } res.setHeader('Content-Type', types[path.extname(f)]||'application/octet-stream'); res.end(b); }); });
await new Promise(r=>server.listen(0,'127.0.0.1',r)); const BASE=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({ executablePath:process.env.CHROMIUM||undefined, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const ctx=await browser.newContext({ viewport:+process.argv[2]===393?{width:393,height:852}:{width:1200,height:760}, deviceScaleFactor:1 }), page=await ctx.newPage();
const errs=[]; page.on('pageerror', e=>errs.push('PAGEERR '+e.message)); page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r=>r.abort());
await page.route('**/three.min.js', r=>r.fulfill({body:fs.readFileSync(THREE), contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
const api={ posts:[], polls:0, bad:[] };
await page.route('**/api/render**', async r=>{ const req=r.request(), u=new URL(req.url());
  if(req.method()==='POST'){ const b=JSON.parse(req.postData()||'{}'); api.posts.push({w:b.w, h:b.h, aspect:b.aspect, scene:b.scene, sizes:['image','lines','depth'].map(k=>(b[k]||'').length)});
    for(const k of ['image','lines','depth']) if(!/^data:image\/(jpeg|png);base64,/.test(b[k]||'')) api.bad.push(k);
    return r.fulfill({json:{job:'T1.sig', model:'test', left:4}}); }
  if(u.searchParams.get('job')){ api.polls++; return r.fulfill({json: api.polls<2?{status:'working'}:{status:'done', image:BASE+'/tex/wood.jpg'}}); }
  return r.fulfill({json:{ok:true, model:'test', left:5}}); });
await page.goto(BASE+'/wrapped_photos.html', {waitUntil:'domcontentloaded', timeout:120000});
await page.evaluate(()=>{ localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('theater113-quality','fast'); });
await page.reload({waitUntil:'domcontentloaded', timeout:120000}); await page.waitForFunction(()=>window.__t, null, {timeout:120000});
const TAG=+process.argv[2]===393?'phone':'desk';
const E=c=>page.evaluate(c=>__t.eval(c), c);
const res={}; let fails=0; const ok=(name,cond,info)=>{ res[name]=cond?'ok':'FAIL '+JSON.stringify(info??''); if(!cond) fails++; };
// a small, quick capture (software rendering is slow); the real button uses 1536 px and 24 refinement passes
await E(`const _cv=captureView; captureView=o=>_cv(Object.assign({},o,{long:640, passes:2})); 1`);
await E(`setFocus('main'); setMode('walk'); wk.feet=YM; const x=sX(37), z=sZ(64.5); Object.assign(WG,{x,z,y:YM+64/12,yaw:Math.atan2(-(sX(22)-x),-(sZ(50)-z)),pitch:-.12}); Object.assign(walk,WG); wk.started=true; syncEnv(); dirty(); 1`);
await page.waitForTimeout(1500);
ok('dock has Photos', await page.isVisible('#tPhotos'));
await page.click('#tPhotos'); await page.waitForSelector('#sPhotos:not([hidden])');
await page.waitForFunction(()=>!document.querySelector('#pRender').disabled, null, {timeout:15000}).catch(()=>{});
ok('render button ready', !(await page.$eval('#pRender', b=>b.disabled)), await page.textContent('#photoBody'));
ok('daily count shown', /5 left today/.test(await page.textContent('#photoBody')), await page.textContent('#photoBody'));
// featured photos ship with the site (photos/index.json): everyone sees them, they compare and go to their view, and cannot be deleted
await page.waitForSelector('.pcard.feat', {timeout:10000}).catch(()=>{});
const feat=JSON.parse(await E(`JSON.stringify(PL.featured.map(p=>({id:p.id, room:p.where.room, model:p.model, mode:p.view&&p.view.mode})))`));
ok('featured photo listed', feat.length>=1 && feat[0].room && feat[0].model && feat[0].mode, feat);
ok('featured card shown', (await page.$$('.pcard.feat')).length===feat.length && /Featured/.test(await page.textContent('#photoBody')), await page.textContent('#photoBody'));
await page.click('.pcard.feat'); await page.waitForSelector('#pview:not([hidden])');
await page.waitForFunction(()=>document.querySelector('#pvA').naturalWidth>0 && document.querySelector('#pvB').naturalWidth>0, null, {timeout:10000}).catch(()=>{});
ok('featured viewer loads both pictures', await page.$eval('#pvA', i=>i.naturalWidth>0) && await page.$eval('#pvB', i=>i.naturalWidth>0) && await page.isVisible('#pvCmpL'));
ok('featured cannot be deleted', await page.isHidden('#pvDel') && await page.isVisible('#pvDl') && /made with/.test(await page.textContent('#pvM')), await page.textContent('#pvM'));
await page.screenshot({path:`P-photos-${TAG}-featured.png`});
await page.click('#pvX');
await page.click('#pRender');
await page.waitForFunction(()=>document.querySelector('.pcard:not(.pending):not(.feat)'), null, {timeout:240000}).catch(()=>{});
ok('posted view images', api.posts.length===1 && !api.bad.length && api.posts[0].sizes.every(n=>n>1000), {posts:api.posts, bad:api.bad});
ok('post size under limit', api.posts.length && api.posts[0].sizes.reduce((a,b)=>a+b,0)<4.2e6, api.posts[0]&&api.posts[0].sizes);
ok('scene described', api.posts.length && /great room/i.test(api.posts[0].scene) && /main level/.test(api.posts[0].scene), api.posts[0]&&api.posts[0].scene);
ok('aspect follows the screen', api.posts.length && (TAG==='phone'?['9:16','2:3']:['16:9','3:2']).includes(api.posts[0].aspect), api.posts[0]&&api.posts[0].aspect);
ok('photo card done', await page.$('.pcard:not(.pending):not(.feat)')!==null, await page.innerHTML('#photoBody'));
await page.screenshot({path:`P-photos-${TAG}-sheet.png`});
const rec=JSON.parse(await E(`JSON.stringify(PL.list.map(p=>({status:p.status, hasPhoto:p.photo instanceof Blob, hasRender:p.render instanceof Blob, match:p.match, room:p.where&&p.where.room, items:p.items.length})))`));
const lum=await E(`(async()=>{ const p=PL.list[0], im=await imgOf(p.render), c=document.createElement('canvas'); c.width=64; c.height=36; const g=c.getContext('2d'); g.drawImage(im,0,0,64,36); const d=g.getImageData(0,0,64,36).data; let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2]; return s/(d.length/4)/3; })()`);
ok('3D picture is not black', lum>25, lum);
ok('record saved with photo and 3D picture', rec.length===1 && rec[0].status==='done' && rec[0].hasPhoto && rec[0].hasRender && rec[0].items>0, rec);
// viewer: compare, go to the view
await page.click('.pcard:not(.feat)'); await page.waitForSelector('#pview:not([hidden])');
ok('viewer shows both', await page.isVisible('#pvB') && await page.isVisible('#pvCmpL') && await page.isVisible('#pvDl'));
await page.$eval('#pvCmp', el=>{ el.value=30; el.dispatchEvent(new Event('input')); });
ok('compare clips photo', /inset\(0px 0px 0px 70%\)|inset\(0 0 0 70%\)/.test(await page.$eval('#pvB', el=>el.style.clipPath)), await page.$eval('#pvB', el=>el.style.clipPath));
await page.screenshot({path:`P-photos-${TAG}-viewer.png`});
const st=await page.$eval('#pvStage', el=>[el.offsetWidth, el.offsetHeight]); ok('viewer stage sized', st[0]>200 && st[1]>100, st);
await E(`setMode('orbit'); 1`); await page.waitForTimeout(300);
await page.click('#pvGo'); await page.waitForTimeout(400);
const back=JSON.parse(await E(`JSON.stringify({mode, focus:FOCUS, x:+(WG.x+HO[0]).toFixed(1), z:+(WG.z+HO[1]).toFixed(1), viewer:$('#pview').hidden})`));
ok('go to this view', back.mode==='walk' && back.focus==='main' && Math.abs(back.x-37)<.2 && Math.abs(back.z-64.5)<.2 && back.viewer, back);
// survives a reload
await page.reload({waitUntil:'domcontentloaded', timeout:120000}); await page.waitForFunction(()=>window.__t, null, {timeout:120000}); await page.waitForTimeout(800);
await page.click('#tPhotos'); await page.waitForSelector('.pcard:not(.feat)', {timeout:10000}).catch(()=>{});
ok('kept after reload', (await page.$$('.pcard:not(.feat)')).length===1);
// delete takes two taps
await page.click('.pcard:not(.feat)'); await page.click('#pvDel'); ok('delete arms first', await page.isVisible('#pview') && /again/.test(await page.textContent('#pvDel')));
await page.click('#pvDel'); await page.waitForTimeout(300); ok('deleted', (await page.$$('.pcard:not(.feat)')).length===0 && await page.isHidden('#pview'));
// plan view can't render
await E(`setMode('plan'); renderPhotos(); 1`); ok('plan view explains', await page.$eval('#pRender', b=>b.disabled) && /Switch to 3D or Walk/.test(await page.textContent('#photoBody')));
console.log(JSON.stringify(res,null,1)); console.log(errs.slice(0,10).join('\n')||'no errors'); console.log(fails?`${fails} FAILED`:'ALL OK');
await browser.close(); server.close();
