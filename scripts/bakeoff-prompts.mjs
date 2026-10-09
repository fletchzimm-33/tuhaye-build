// Writes bakeoff/prompts.json: for each view, the scene description the page would send (capScene in src/app.html) and the full
// instruction the server wraps it in (INSTRUCT in api/render.js), so the bake-off tests exactly what "Render this view" sends.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'), VIEWS=path.join(ROOT,'bakeoff','views');
const { INSTRUCT }=createRequire(import.meta.url)(path.join(ROOT,'api','render.js'));
// same wording as capScene in src/app.html
function capScene(c){ const w=c.where, v=c.view, house=v.focus!=='theater';
  const place=!house?'a home theater with a large screen, theater seating and dark acoustic walls'
    : v.mode==='orbit'?(v.focus==='house'?'the exterior of a mountain-modern house with stacked stone, cedar siding and dark standing-seam metal roofs on a sloping mountain site':`a cutaway view looking down into the ${w.level} of a mountain-modern house`)
    : `the ${w.room?w.room.toLowerCase().replace(/ \/ /g,' and '):'interior'} on the ${w.level} of a mountain-modern house, with mountain views through the windows`;
  const light=house?{Midday:'bright midday daylight',Evening:'warm low evening sun, lamps on',Dusk:'dusk, deep blue sky outside, warm interior lamps glowing'}[c.light]
    :{Bright:'bright, even lighting',Dim:'dimmed lights',Movie:'dark movie lighting lit by the glowing screen'}[c.light];
  const floor={wood:'wide-plank oak floors',tile:'large stone tile floors',concrete:'polished concrete floor'}[w.floor];
  const big=capCount(c.items.filter(i=>i.share>=.01).map(i=>i.desc.replace(/^(\w+) paint /,'$1 '))).slice(0,10);
  return [place, light, floor, big.length?'furnished with '+big.join(', '):''].filter(Boolean).join('; '); }
function capCount(list){ const n=new Map(); list.forEach(d=>n.set(d,(n.get(d)||0)+1)); const W=['','','two','three','four','five','six'];
  return [...n].map(([d,k])=>k<2?d:`${W[k]||'several'} ${d.replace(/(s|x|ch|sh)$/,'$1e')}s`); }
const out={};
for(const v of fs.readdirSync(VIEWS).sort()){ const f=path.join(VIEWS,v,'view.json'); if(!fs.existsSync(f)) continue; const c=JSON.parse(fs.readFileSync(f,'utf8')), scene=capScene(c);
  out[v]={ aspect:c.ar, scene, prompt:INSTRUCT(scene) }; }
fs.writeFileSync(path.join(ROOT,'bakeoff','prompts.json'), JSON.stringify(out,null,1));
for(const [v,p] of Object.entries(out)) console.log(v.padEnd(20), p.aspect, p.scene);
