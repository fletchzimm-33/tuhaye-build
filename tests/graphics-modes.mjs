// Photo-real and Fast graphics switching, thumbnails, light and dark themes. Args: light|dark
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
body = body.replace('requestAnimationFrame(loop);\n})();', `const __po=photoOverlay; photoOverlay=function(c){ const gl=renderer.getContext(), W=gl.drawingBufferWidth, H=gl.drawingBufferHeight, pts=[]; for(let i=1;i<8;i++) for(let j=1;j<8;j++) pts.push([Math.floor(W*i/8),Math.floor(H*j/8)]);
    const grab=()=>pts.map(([x,y])=>{ const px=new Uint8Array(4); gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); return px.join(','); }); const a=grab(); __po(c); const b=grab(); window.__overlayChanged=a.filter((v,i)=>v!==b[i]).length/a.length; };
window.__t={select, Q, tm:()=>renderer.toneMapping, env:()=>scene.environment===canvasEnv?'studio':'probe', idle:()=>!refining&&!needs&&!(Q.photo&&PROBE.want), n:()=>pipe.n, items, setMode, snap:()=>snapThumb()};\nrequestAnimationFrame(loop);\n})();`);
fs.writeFileSync('wrapped10.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const three = fs.readFileSync(THREE);
const scheme=process.argv[2]||'light';
const browser = await chromium.launch({ executablePath: CHROMIUM, args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const page = await (await browser.newContext({ viewport:{width:393,height:852}, hasTouch:true, isMobile:true, colorScheme:scheme })).newPage();
const errs=[]; page.on('pageerror', e=>errs.push('pageerror '+e.message)); page.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.text()); });
await page.route('**/three.min.js', r=>r.fulfill({body:three, contentType:'application/javascript'}));
await page.route('https://fonts.googleapis.com/**', r=>r.fulfill({body:'', contentType:'text/css'}));
await page.goto('file://'+process.cwd()+'/wrapped10.html'); await page.evaluate(()=>{ localStorage.clear(); localStorage.setItem('theater113-help-seen','1'); localStorage.setItem('tuhaye-focus','theater'); sessionStorage.setItem('tuhaye-edit','1'); }); await page.reload(); await page.waitForTimeout(1500);
const settle=async()=>{ const t0=Date.now(); while(Date.now()-t0<60000){ if(await page.evaluate(()=>__t.idle())) break; await page.waitForTimeout(200); } };
await settle(); console.log(scheme, 'boot: photo', await page.evaluate(()=>__t.Q.photo), 'toneMapping', await page.evaluate(()=>__t.tm()), 'env', await page.evaluate(()=>__t.env()), 'samples', await page.evaluate(()=>__t.n()));
await page.screenshot({path:`q-${scheme}-0-boot.png`});
const t=await page.evaluate(()=>__t.snap()); console.log('thumbnail', t?t.slice(0,23)+'… '+t.length+' chars':'null'); fs.writeFileSync(`q-${scheme}-thumb.jpg`, Buffer.from((t||'').split(',')[1]||'', 'base64'));
// selecting a piece draws its outline over the picture; it must not wipe the picture (bug seen as a black screen in dark mode)
await page.evaluate(()=>__t.select(__t.items().find(i=>i.type==='ottoman'||i.type==='sectional').id)); await page.waitForTimeout(600); await settle();
const changed=await page.evaluate(()=>window.__overlayChanged); console.log('selection outline repaints', Math.round(changed*100)+'% of sample points', changed<.2?'PASS':'FAIL');
await page.evaluate(()=>__t.select(null)); await page.waitForTimeout(400);
await page.tap('#tRoom'); await page.waitForTimeout(800);
await page.evaluate(()=>document.querySelector('[data-q]').scrollIntoView()); await page.waitForTimeout(300); await page.screenshot({path:`q-${scheme}-1-room.png`});
await page.evaluate(()=>document.querySelector('[data-q=fast]').click()); await page.waitForTimeout(800); await settle();
console.log('after Fast: photo', await page.evaluate(()=>__t.Q.photo), 'toneMapping', await page.evaluate(()=>__t.tm()), 'env', await page.evaluate(()=>__t.env()), 'stored', await page.evaluate(()=>localStorage.getItem('theater113-quality')));
await page.evaluate(()=>document.querySelector('[data-q=photo]').click()); await page.waitForTimeout(800); await settle();
console.log('after Photo: photo', await page.evaluate(()=>__t.Q.photo), 'toneMapping', await page.evaluate(()=>__t.tm()), 'env', await page.evaluate(()=>__t.env()), 'samples', await page.evaluate(()=>__t.n()));
await page.tap('#sRoom [data-act=close]').catch(()=>{}); await page.waitForTimeout(600);
await page.evaluate(()=>__t.setMode('walk')); await settle(); await page.screenshot({path:`q-${scheme}-2-walk.png`});
console.log(errs.slice(0,10).join('\n')||'no errors'); await browser.close();
