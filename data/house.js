/* =====================================================================================================================
   The whole house, from sheets A2.1 (main) and A2.2 (lower) at 3/16" = 1'-0", heights from sections A4.1–A4.4 and
   elevations A3.1–A3.3. Measured in the house frame (X east of grid A, Z south of grid 1, feet); the theater keeps its
   own origin, so scene x = X − 39.0 and z = Z − 116.58. y is feet above the lower-level floor (6766'-6"); the main level
   is 11.5 above it, the mudroom, laundry and garage 2.5 above that.
   ===================================================================================================================== */
const HOUSE=/*HOUSE*/{};
const HO=HOUSE.off, YM=HOUSE.main, sX=X=>X-HO[0], sZ=Z=>Z-HO[1], CUT=10; // lower walls are cut at 10′ (the top of the theater walls)
let CUTM=null; // while set, main-level walls are built cut off at this height (the dollhouse view of the main level)
/* ---------- exterior and house textures (same procedural approach as the furniture: colour map plus a normal map from height) ---------- */
function boardsCanvas(S, rows, seed, o){ const [c,g]=cnv(S,S), r=RNG(seed), ph=S/rows;
  const board=(x0,len,y0,sd)=>{ const q=RNG(sd), v=(o.lo+q()*(o.hi-o.lo))|0; g.save(); g.beginPath(); g.rect(x0,y0,len,ph); g.clip(); g.fillStyle=`rgb(${v},${v},${v})`; g.fillRect(x0,y0,len,ph);
    const n=10+(q()*10|0); for(let k=0;k<n;k++){ const yy=y0+q()*ph, a=o.grain*(.4+q()), f=.003+q()*.01, p0=q()*6.28, amp=.5+q()*2.5; g.strokeStyle=`rgba(30,22,14,${a})`; g.lineWidth=.6+q()*1.6; g.beginPath(); for(let xx=x0;xx<=x0+len;xx+=12){ const y=yy+Math.sin(xx*f+p0)*amp; xx===x0?g.moveTo(xx,y):g.lineTo(xx,y); } g.stroke(); }
    if(q()<o.knots){ const kx=x0+len*(.15+q()*.7), ky=y0+ph*(.3+q()*.4); for(let k=4;k>0;k--){ g.fillStyle=`rgba(40,26,14,${.1+.1*(4-k)})`; g.beginPath(); g.ellipse(kx,ky,k*3,k*1.6,0,0,6.29); g.fill(); } }
    g.fillStyle=`rgba(0,0,0,${o.joint})`; g.fillRect(x0,y0,2,ph); g.restore(); };
  for(let row=0;row<rows;row++){ const y0=row*ph; let x=r()*S, tot=0; const list=[]; while(tot<S){ let len=(o.lmin+r()*(o.lmax-o.lmin))*S; if(tot+len>S-S*.08) len=S-tot; list.push([x+tot,len,(r()*1e9)|0]); tot+=len; }
    list.forEach(([x0,len,sd])=>{ const xs=((x0%S)+S)%S; board(xs,len,y0,sd); board(xs-S,len,y0,sd); });
    g.fillStyle=`rgba(0,0,0,${o.gap})`; g.fillRect(0,y0+ph-o.gw,S,o.gw); g.fillStyle='rgba(255,255,255,.08)'; g.fillRect(0,y0,S,1); }
  return c; }
function texStoneWall(){ const S=1024, ppi=S/72, r=RNG(211), [c,g]=cnv(S,S), h=new Float32Array(S*S), pal=[[168,154,134],[143,134,118],[181,166,142],[125,116,104],[156,143,122],[194,180,156],[110,102,92],[150,141,130],[172,160,148]];
  const mot=hMix(hNoise(S,212,24),hNoise(S,213,6),.5); g.fillStyle='rgb(58,54,50)'; g.fillRect(0,0,S,S);
  const stone=(x0,y0,w,hh)=>{ const q=pal[(r()*pal.length)|0], k=.85+r()*.3, ht=.55+r()*.45, gap=2+r()*2.5;
    for(const ox of [0,-S]){ const xa=Math.max(0,Math.round(x0+ox+gap)), xb=Math.min(S,Math.round(x0+ox+w-gap)), ya=Math.round(y0+gap), yb=Math.min(S,Math.round(y0+hh-gap)); if(xb<=xa||yb<=ya) continue;
      g.fillStyle=`rgb(${q[0]*k|0},${q[1]*k|0},${q[2]*k|0})`; g.fillRect(xa,ya,xb-xa,yb-ya);
      for(let y=ya;y<yb;y++) for(let x=xa;x<xb;x++){ const e=Math.min(x-xa,xb-1-x,y-ya,yb-1-y), bev=Math.min(1,e/7); h[y*S+x]=ht*(.55+.45*bev)+mot[y*S+x]*.35; } } };
  let y=0; while(y<S-ppi*1.2){ let rh=(1.6+r()*r()*6.5)*ppi; if(y+rh>S-ppi*1.6) rh=S-y; let x=r()*S*.3, tot=0; while(tot<S){ let w=(8+r()*26)*ppi; if(tot+w>S-ppi*4) w=S-tot; stone(x+tot,y,w,rh); tot+=w; } y+=rh; }
  const im=g.getImageData(0,0,S,S), d=im.data; for(let i=0;i<S*S;i++){ const m=.78+mot[i]*.38; d[i*4]*=m; d[i*4+1]*=m; d[i*4+2]*=m; } g.putImageData(im,0,0);
  const t=tex(c,true); return {t, n:nmap(h,S,3.2)}; }
function texSeam(){ const S=512, [c,g]=cnv(S,S), r=RNG(221), pan=S/4, h=new Float32Array(S*S); g.fillStyle='#cfcfcf'; g.fillRect(0,0,S,S);
  for(let i=0;i<260;i++){ const v=(190+r()*50)|0; g.fillStyle=`rgba(${v},${v},${v},.25)`; g.fillRect(r()*S,0,1+r()*3,S); }
  for(let x=0;x<S;x++){ const p=(x%pan)/pan, rib=Math.exp(-Math.pow((p-.5)*pan/3.2,2)), cup=.15*Math.sin(p*Math.PI); for(let y=0;y<S;y++) h[y*S+x]=rib+cup; }
  for(let k=0;k<4;k++){ const x=k*pan+pan/2; g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(x-2,0,1.5,S); g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(x+1,0,2,S); }
  return {t:tex(c,true), n:nmap(h,S,5)}; }
function texPavers(){ const S=1024, ppf=S/8, r=RNG(231), [c,g]=cnv(S,S), h=new Float32Array(S*S).fill(.2); g.fillStyle='rgb(92,88,82)'; g.fillRect(0,0,S,S); const mot=hNoise(S,232,40);
  for(let row=0;row<4;row++){ const y0=row*2*ppf; let x=r()*ppf, tot=0; while(tot<S){ let w=(r()<.5?2:3)*ppf; if(tot+w>S-ppf) w=S-tot; const v=168+r()*40, tint=r()*10;
      for(const ox of [0,-S]){ const xa=Math.max(0,Math.round(x+tot+ox+3)), xb=Math.min(S,Math.round(x+tot+ox+w-3)), ya=y0+3, yb=y0+2*ppf-3; if(xb<=xa) continue; g.fillStyle=`rgb(${v+tint|0},${v+tint*.6|0},${v-6|0})`; g.fillRect(xa,ya,xb-xa,yb-ya); for(let yy=ya;yy<yb;yy++) for(let xx=xa;xx<xb;xx++) h[yy*S+xx]=.9+mot[yy*S+xx]*.25; }
      tot+=w; } }
  const im=g.getImageData(0,0,S,S), d=im.data; for(let i=0;i<S*S;i++){ const m=.86+mot[i]*.26; d[i*4]*=m; d[i*4+1]*=m; d[i*4+2]*=m; } g.putImageData(im,0,0); return {t:tex(c,true), n:nmap(h,S,2)}; }
function texGrass(){ const S=512, r=RNG(241), [c,g]=cnv(S,S), mot=hMix(hNoise(S,242,96),hNoise(S,243,20),.6), im=g.createImageData(S,S), d=im.data;
  for(let i=0;i<S*S;i++){ const m=mot[i]; d[i*4]=92+m*38; d[i*4+1]=100+m*36; d[i*4+2]=62+m*22; d[i*4+3]=255; } g.putImageData(im,0,0);
  for(let i=0;i<14000;i++){ const x=r()*S, y=r()*S, l=3+r()*6, v=r(); g.strokeStyle=v<.5?`rgba(52,66,34,.5)`:`rgba(170,168,110,.35)`; g.lineWidth=1; g.beginPath(); g.moveTo(x,y); g.lineTo(x+(r()-.5)*2,y-l); g.stroke(); }
  const t=tex(c,true); return {t, n:nmap(hFromCanvas(c),S,2.5)}; }
function texGravel(){ const S=256, r=RNG(251), [c,g]=cnv(S,S); g.fillStyle='#8c8a85'; g.fillRect(0,0,S,S); for(let i=0;i<9000;i++){ const v=(70+r()*120)|0, z=1+r()*2.6; g.fillStyle=`rgba(${v},${v-4},${v-8},.85)`; g.beginPath(); g.arc(r()*S,r()*S,z,0,6.29); g.fill(); } return {t:tex(c,true), n:nmap(hFromCanvas(c),S,3)}; }
function texGarageDoor(){ const S=512, [c,g]=cnv(S,S), r=RNG(261); for(let k=0;k<4;k++){ const y0=k*S/4; g.fillStyle='#d8d8d8'; g.fillRect(0,y0,S,S/4); for(let i=0;i<90;i++){ const v=(150+r()*60)|0; g.strokeStyle=`rgba(${v},${v},${v},.35)`; g.beginPath(); const yy=y0+r()*S/4; g.moveTo(0,yy); g.lineTo(S,yy+(r()-.5)*4); g.stroke(); } g.fillStyle='rgba(0,0,0,.6)'; g.fillRect(0,y0+S/4-4,S,4); }
  return {t:tex(c,true), n:nmap(hFromCanvas(c),S,3)}; }
const HT=(()=>{ const sid=boardsCanvas(1024,10,201,{lo:150,hi:200,grain:.16,knots:.18,joint:.55,gap:.8,gw:6,lmin:.6,lmax:1}), dek=boardsCanvas(1024,17,202,{lo:150,hi:205,grain:.12,knots:.05,joint:.6,gap:.92,gw:7,lmin:.4,lmax:1}),
    sof=boardsCanvas(1024,13,203,{lo:165,hi:215,grain:.14,knots:.1,joint:.5,gap:.6,gw:4,lmin:.5,lmax:1});
  const mk=(c,sx,sy,k)=>{ const t=tex(c,true); t.repeat.set(1/sx,1/sy); return {t, n:nmap(hFromCanvas(c),c.width,k,t.repeat)}; };
  const o={ siding:mk(sid,8,7.708,3), deck:mk(dek,8,7.8,3), soffit:mk(sof,8,7.85,2.5) };
  o.vsiding={t:o.siding.t.clone(), n:o.siding.n.clone()}; [o.vsiding.t,o.vsiding.n].forEach(t=>{ t.center.set(.5,.5); t.rotation=Math.PI/2; t.needsUpdate=true; });
  const rep=(x,s)=>{ x.t.repeat.set(1/s,1/s); x.n.repeat.set(1/s,1/s); return x; };
  o.stone=rep(texStoneWall(),6); o.seamZ=rep(texSeam(),5.333); o.seamX={t:o.seamZ.t.clone(), n:o.seamZ.n.clone()}; [o.seamX.t,o.seamX.n].forEach(t=>{ t.center.set(.5,.5); t.rotation=Math.PI/2; t.needsUpdate=true; });
  o.pavers=rep(texPavers(),8); o.grass=rep(texGrass(),14); o.gravel=rep(texGravel(),4); o.gdoor=rep(texGarageDoor(),8);
  return o; })();
const HM=(()=>{ const std=(o,t,env,p)=>{ const m=(p&&p.cc)?new THREE.MeshPhysicalMaterial(o):new THREE.MeshStandardMaterial(o); if(p&&p.cc){ m.clearcoat=p.cc; m.clearcoatRoughness=p.ccr||.3; }
    if(t){ m.map=t.t; m.normalMap=t.n; m.normalScale=new THREE.Vector2((p&&p.ns)||1,(p&&p.ns)||1); } m.userData.env=env; return unify(m); };
  floorTex('wood_floor'); floorTex('tile'); const wf=TX.wood_floor.clone(), wn=TXN.wood_floor.clone(); wf.needsUpdate=wn.needsUpdate=true; wf.rotation=wn.rotation=Math.PI/2;
  const o={
    paint: std({color:col('#eceae5'), roughness:.9},{t:WHITE_T(),n:TXN.paint},.45,{ns:.06}),
    ceil:  std({color:col('#f2f1ed'), roughness:.95},null,.35),
    siding:std({color:col('#8b7f72'), roughness:.82},HT.siding,.4,{ns:.9}),
    vsiding:std({color:col('#7f7468'), roughness:.82},HT.vsiding,.4,{ns:.9}),
    stone: std({color:0xffffff, roughness:.92},HT.stone,.3,{ns:1}),
    roofZ: std({color:col('#45423f'), roughness:.42, metalness:.55},HT.seamZ,1.1,{ns:.5}),
    roofX: std({color:col('#45423f'), roughness:.42, metalness:.55},HT.seamX,1.1,{ns:.5}),
    ballast:std({color:col('#9b9893'), roughness:1},HT.gravel,.2,{ns:.8}),
    fascia:std({color:col('#3b3936'), roughness:.5, metalness:.45},null,.9),
    soffit:std({color:col('#b07a52'), roughness:.7},HT.soffit,.45,{ns:.6}),
    beam:  std({color:col('#a8774f'), roughness:.6},{t:TX.wood,n:TXN.wood},.5,{ns:.35}),
    frame: std({color:col('#2c2a28'), roughness:.38, metalness:.55},null,1),
    trim:  M.trim,
    door:  M.door,
    wood:  std({color:col('#c49a6c'), roughness:.5},{t:wf,n:wn},.6,{cc:.4,ccr:.22,ns:.55}),
    tile:  std({color:col('#d9d6cf'), roughness:.32},{t:TX.tile,n:TXN.tile},.8,{cc:.5,ccr:.1,ns:.6}),
    concrete:std({color:col('#a6a39e'), roughness:.55},{t:TX.concrete,n:TXN.concrete},.5,{cc:.4,ccr:.25,ns:.4}),
    deck:  std({color:col('#8a7462'), roughness:.7},HT.deck,.35,{ns:.9}),
    pavers:std({color:0xffffff, roughness:.85},HT.pavers,.3,{ns:.8}),
    grass: std({color:0xffffff, roughness:1},HT.grass,.15,{ns:.7}),
    drive: std({color:col('#5c5b57'), roughness:.86},{t:TX.concrete,n:TXN.concrete},.25,{ns:.7}),
    garage:std({color:col('#7a6b5d'), roughness:.6},HT.gdoor,.5,{ns:.6}),
    steel: std({color:col('#26282b'), roughness:.45, metalness:.7},null,1),
    cable: std({color:col('#9a9ea3'), roughness:.3, metalness:.9},null,1.2),
    rail:  std({color:col('#3a2f26'), roughness:.55},{t:TX.wood,n:TXN.wood},.5,{ns:.3}),
    water: std({color:col('#2f6f78'), roughness:.06, metalness:.1},null,1.4),
    spa:   std({color:col('#4a4440'), roughness:.6},null,.5),
    soil:  std({color:col('#3b2f25'), roughness:1},null,.1),
    shrub: std({color:col('#3f5a2e'), roughness:.9},null,.2),
    fire:  new THREE.MeshBasicMaterial({color:col('#ffb35c'), toneMapped:false}),
    firebox:std({color:col('#141414'), roughness:.9},null,.2),
    glass: new THREE.MeshPhysicalMaterial({color:col('#b9c9d3'), roughness:.04, metalness:0, transparent:true, opacity:.2, depthWrite:false, side:THREE.DoubleSide, clearcoat:1, clearcoatRoughness:.02}),
    mesh:  new THREE.MeshStandardMaterial({color:col('#2a2a2a'), map:TX.net, roughness:.6, metalness:.5, transparent:true, opacity:.9, side:THREE.DoubleSide, depthWrite:false}),
    cap:   M.cap,
  };
  o.glass.userData.env=1.6; o.glass.userData.noShadow=true; o.mesh.userData.env=.5; o.mesh.userData.noShadow=true; o.cable.userData.noShadow=true; unify(o.glass); unify(o.mesh); // quarter-inch cables cast no useful shadow, only aliased lines
  return o; })();
function WHITE_T(){ return whiteFor(TXN.paint.repeat); }
const HMAT_LIST=Object.values(HM).filter(m=>m&&m.isMaterial&&m!==M.trim&&m!==M.door&&m!==M.cap);

/* ---------- triangle buckets: every surface lands in a per-material list and is merged into one mesh per material ---------- */
function Bk(){ return new Map(); }
function bkGet(B,m){ let k=B.get(m); if(!k){ k={p:[],n:[]}; B.set(m,k); } return k; }
function quad(B,m,a,b,c,d){ if(!m) return; const k=bkGet(B,m), ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2], vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];
  let nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx; const l=Math.hypot(nx,ny,nz); if(l<1e-9) return; nx/=l; ny/=l; nz/=l;
  k.p.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2],a[0],a[1],a[2],c[0],c[1],c[2],d[0],d[1],d[2]); for(let i=0;i<6;i++) k.n.push(nx,ny,nz); }
function tri(B,m,a,b,c,up){ if(!m) return; const k=bkGet(B,m), ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2], vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
  let nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx; const l=Math.hypot(nx,ny,nz); if(l<1e-9) return; nx/=l; ny/=l; nz/=l;
  if(up!=null && ny*up<0){ const t=b; b=c; c=t; nx=-nx; ny=-ny; nz=-nz; } k.p.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]); for(let i=0;i<3;i++) k.n.push(nx,ny,nz); }
/* an axis-aligned box; faces: object of material per side (px,nx,py,ny,pz,nz) or one material for all */
function hbox(B,m,x0,y0,z0,x1,y1,z1){ const f=(m&&m.isMaterial)?{px:m,nx:m,py:m,ny:m,pz:m,nz:m}:m;
  quad(B,f.px,[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]); quad(B,f.nx,[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]);
  quad(B,f.pz,[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]); quad(B,f.nz,[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]);
  quad(B,f.py,[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]); quad(B,f.ny,[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]); }
/* polygon (x,z pairs, scene coords) at height y(x,z); up=1 faces up, -1 down */
function hpoly(B,m,pts,yf,up){ if(!m||pts.length<3) return; const v2=pts.map(([x,z])=>new THREE.Vector2(x,z)); let tris; try{ tris=THREE.ShapeUtils.triangulateShape(v2,[]); }catch(e){ return; }
  const Y=typeof yf==='function'?yf:()=>yf; tris.forEach(([a,b,c])=>tri(B,m,[pts[a][0],Y(pts[a][0],pts[a][1]),pts[a][1]],[pts[b][0],Y(pts[b][0],pts[b][1]),pts[b][1]],[pts[c][0],Y(pts[c][0],pts[c][1]),pts[c][1]],up)); }
function flush(B, group, opts={}){ B.forEach((k,m)=>{ if(!k.p.length) return; const pos=new Float32Array(k.p), nor=new Float32Array(k.n), uv=new Float32Array(pos.length/3*2);
    for(let i=0;i<pos.length/3;i++){ const x=pos[i*3], y=pos[i*3+1], z=pos[i*3+2], nx=nor[i*3], ny=nor[i*3+1], nz=nor[i*3+2], ax=Math.abs(nx), ay=Math.abs(ny), az=Math.abs(nz);
      if(ay>=ax&&ay>=az){ uv[i*2]=x; uv[i*2+1]=ny>0?-z:z; } else if(ax>=az){ uv[i*2]=nx>0?-z:z; uv[i*2+1]=y; } else { uv[i*2]=nz>0?x:-x; uv[i*2+1]=y; } }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('normal',new THREE.BufferAttribute(nor,3)); g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.computeBoundingSphere();
    const mesh=new THREE.Mesh(g,m); mesh.receiveShadow=true; mesh.castShadow=!m.userData.noShadow && opts.cast!==false; if(m.transparent) mesh.renderOrder=3; mesh.raycast=opts.pick?THREE.Mesh.prototype.raycast:()=>{}; group.add(mesh); }); B.clear(); }

/* ---------- house data in scene coordinates ---------- */
const HL={ L:{ y:0, key:'L' }, M:{ y:YM, key:'M' } };
['L','M'].forEach(k=>{ const src=HOUSE[k], L=HL[k];
  L.walls=src.W.map(w=>({x0:sX(w[0]),z0:sZ(w[1]),x1:sX(w[2]),z1:sZ(w[3]),k:w[4],o:w[5]||{}}));
  L.opens=src.O.map(o=>({t:o[0],x0:sX(o[1]),z0:sZ(o[2]),x1:sX(o[3]),z1:sZ(o[4]),o:o[5]||{}}));
  L.rooms=src.R.map(r=>({n:r.n,u:r.u,f:r.f,dy:r.dy||0,p:r.p.map(([x,z])=>[sX(x),sZ(z)])})); L.rooms.forEach(r=>{ r.bb=bboxOf(r.p); }); });
HL.M.rooms.push({n:'Stairwell',u:'',f:null,dy:0,nf:true,p:[[sX(22.48),sZ(37.96)],[sX(35.53),sZ(37.96)],[sX(35.53),sZ(46.51)],[sX(22.48),sZ(46.51)]]}); HL.M.rooms[HL.M.rooms.length-1].bb=bboxOf(HL.M.rooms[HL.M.rooms.length-1].p);
HL.L.rooms.forEach(r=>{ if(r.n==='Stair'||(r.n==='Closet'&&r.u==='119')) r.nc=true; });
const CEILZ=HOUSE.M.ceil.map(z=>({x0:sX(z.r[0]),x1:sX(z.r[1]),z0:sZ(z.r[2]),z1:sZ(z.r[3]),n:z.n, f:(x,z2)=>YM+z.c+(z.gx||0)*(x+HO[0])+(z.gz||0)*(z2+HO[1])}));
{ const mud=CEILZ.find(z=>z.n==='mud'); if(mud&&CEILZ.some(z=>z.n==='flat')){ CEILZ.splice(CEILZ.indexOf(mud),1); CEILZ.splice(CEILZ.findIndex(z=>z.n==='flat'),0,mud); } } // the mudroom, laundry and the stair up to them share the sloped ceiling under the garage roof
function inRect(r,x,z,e=0){ return x>=r.x0-e&&x<=r.x1+e&&z>=r.z0-e&&z<=r.z1+e; }
function roomAt(L,x,z){ for(const r of L.rooms){ if(x<r.bb.x0||x>r.bb.x1||z<r.bb.z0||z>r.bb.z1) continue; if(inPoly(x,z,r.p)) return r; } return null; }
function ceilMain(x,z){ for(const c of CEILZ) if(inRect(c,x,z)) return c.f(x,z); return YM+9; }
function ceilAtL(L,x,z){ if(L.key==='L'){ const r=roomAt(L,x,z); return r?(r.nc?null:HOUSE.L.ceil):null; } const r=roomAt(L,x,z); return r?ceilMain(x,z):null; }
function openAt(L,x,z){ for(const o of L.opens) if(inRect(o,x,z,.01)) return o; return null; }
function wallAt(L,x,z){ for(const w of L.walls) if(inRect(w,x,z,.01)) return w; return null; }
const ROOFS=HOUSE.roofs.map(r=>({x0:sX(r.r[0]),x1:sX(r.r[1]),z0:sZ(r.r[2]),z1:sZ(r.r[3]),n:r.n,k:r.k,th:r.th,fall:r.fall, top:(x,z)=>YM+r.t+(r.gx||0)*(x+HO[0])+(r.gz||0)*(z+HO[1])}));
function roofAt(x,z){ let best=null; for(const r of ROOFS) if(inRect(r,x,z)){ const t=r.top(x,z); if(!best||t>best.t) best={r,t}; } return best; }
/* lower walls under a point? (decides where the stone wainscot runs up to the main floor) */
function lowerSolid(x,z){ if(wallAt(HL.L,x,z)) return true; const o=openAt(HL.L,x,z); if(o) return true; return shellAt(x,z); }
let SHELL=[]; function shellAt(x,z){ return SHELL.some(r=>inRect(r,x,z,.02)); }

/* ---------- walls ---------- */
const CIRC=/hall|stair|vestibule|lobby|landing/i;
function extMat(L,w){ const e=w&&w.o&&w.o.ext; if(w&&(w.k==='c'||w.k==='p')&&!e) return HM.stone; return e==='stone'?HM.stone:e==='vsiding'?HM.vsiding:HM.siding; }
/* what a wall face looks onto decides its finish: a room gets paint, the outside gets siding or stone */
function sideMat(L,px,pz,ext){ if(roomAt(L,px,pz)) return HM.paint; if(openAt(L,px,pz)) return HM.paint; if(wallAt(L,px,pz)) return ext; /* against another wall: hidden, except where that wall stops lower */ if(L.key==='L'&&POLY.length&&inPoly(px,pz,POLY)) return HM.paint; return ext; }
function topFor(L,x,z,bx,bz,half){ // wall top: lower walls are cut at CUT; main walls reach the higher ceiling on either side, and on up to the underside of the roof over them (no gap under the eaves)
  if(L.key==='L') return CUT; let t=null; for(const s of [-1,1]){ const c=ceilAtL(L,x+bx*s*(half+.15),z+bz*s*(half+.15)); if(c!=null&&(t==null||c>t)) t=c; }
  for(const s of [-1,0,1]){ const rf=roofAt(x+bx*s*half*.9,z+bz*s*half*.9); if(rf){ const u=rf.t-rf.r.th+.02; if(t==null||u>t) t=u; } }
  if(t==null) t=YM+9; return CUTM!=null?Math.min(t,CUTM):t; }
function quadF(B,m,a,b,c,d,dir){ const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2], vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2], nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx;
  if(nx*dir[0]+ny*dir[1]+nz*dir[2]<0) quad(B,m,a,d,c,b); else quad(B,m,a,b,c,d); }
/* one wall piece: rect x0..x1 × z0..z1 from y0 up to topF(x,z) (sampled every foot along its length) */
function prism(B,L,x0,z0,x1,z1,y0,topF,ext,opt={}){
  const ax=(x1-x0)>=(z1-z0), a0=ax?x0:z0, a1=ax?x1:z1, b0=ax?z0:x0, b1=ax?z1:x1, bm=(b0+b1)/2, len=a1-a0; if(len<.005) return;
  const V=(a,y,b)=>ax?[a,y,b]:[b,y,a], S=[], T=[]; let A=[]; for(let i=0,k=Math.max(1,Math.ceil(len/1.0));i<=k;i++) A.push(a0+len*i/k);
  if(!opt.face&&len>.2){ const mt=(a,sg)=>{ const bf=sg<0?b0:b1; return sideMat(L,...(ax?[a,bf+sg*.3]:[bf+sg*.3,a]),ext); }; // pieces also break exactly where a face's finish changes (paint beside a room, siding outside)
    for(const sg of [-1,1]){ let pa=a0+.025, pm=mt(pa,sg); for(let a=a0+.075;a<a1;a+=.05){ const cm=mt(a,sg); if(cm!==pm){ let lo=pa, hi=a; for(let j=0;j<6;j++){ const md=(lo+hi)/2; if(mt(md,sg)===pm) lo=md; else hi=md; } A.push((lo+hi)/2); pm=cm; } pa=a; } }
    if(L.key==='M'&&typeof topF==='function') [...ROOFS,...CEILZ].forEach(r=>(ax?[r.x0,r.x1]:[r.z0,r.z1]).forEach(v=>{ if(v>a0+.002&&v<a1-.002) A.push(v-.0005,v+.0005); })); // the top steps right at a roof's or ceiling's edge
    A=[...new Set(A.map(v=>Math.round(v*1e5)/1e5))].sort((x,y)=>x-y); }
  for(const a of A){ S.push(a); const t=typeof topF==='function'?topF(...(ax?[a,bm]:[bm,a])):topF; T.push(Math.max(y0+.01,t)); }
  const n=S.length-1, nb=ax?[0,0,1]:[1,0,0];
  for(let i=0;i<n;i++){ const a=S[i], b=S[i+1], am=(a+b)/2, ta=T[i], tb=T[i+1];
    for(const sg of [-1,1]){ const bf=sg<0?b0:b1, p=ax?[am,bf+sg*.3]:[bf+sg*.3,am], m=opt.face?opt.face(sg,p):sideMat(L,p[0],p[1],ext), dir=[nb[0]*sg,0,nb[2]*sg];
      const band=opt.band&&m===ext?opt.band(sg,am):null;
      const zn=m===HM.paint&&L.key==='M'&&!opt.face&&roomAt(L,p[0],p[1])?(zoneAt(p[0],p[1])||{f:()=>YM+9}):null, cs=zn?[a,b].map(q=>zn.f(...(ax?[q,bf+sg*.3]:[bf+sg*.3,q]))):null; // that room's ceiling
      if(cs&&(ta>cs[0]+.03||tb>cs[1]+.03)){ const ca=Math.max(y0,Math.min(ta,cs[0])), cb=Math.max(y0,Math.min(tb,cs[1]));
        quadF(B,m,V(a,y0,bf),V(b,y0,bf),V(b,cb,bf),V(a,ca,bf),dir); quadF(B,ext,V(a,ca,bf),V(b,cb,bf),V(b,tb,bf),V(a,ta,bf),dir); }
      else if(band&&band.y>y0&&band.y<Math.min(ta,tb)){ quadF(B,band.m,V(a,y0,bf),V(b,y0,bf),V(b,band.y,bf),V(a,band.y,bf),dir); quadF(B,m,V(a,band.y,bf),V(b,band.y,bf),V(b,tb,bf),V(a,ta,bf),dir); }
      else quadF(B,m,V(a,y0,bf),V(b,y0,bf),V(b,tb,bf),V(a,ta,bf),dir);
      if(opt.base&&m===HM.paint){ const r=roomAt(L,p[0],p[1]); if(r&&!r.nf) baseRun(ax,a,b,bf,sg,L.y+r.dy); } }
    if(opt.cap!==null) quadF(B,opt.cap||HM.cap,V(a,ta,b0),V(b,tb,b0),V(b,tb,b1),V(a,ta,b1),[0,1,0]);
    if(opt.bot) quadF(B,opt.bot,V(a,y0,b0),V(b,y0,b0),V(b,y0,b1),V(a,y0,b1),[0,-1,0]); }
  for(const [ae,te,sg] of [[a0,T[0],-1],[a1,T[n],1]]){ if(opt.noEnds) break; const p=ax?[ae+sg*.2,bm]:[bm,ae+sg*.2], m=opt.face?opt.face(0,p):sideMat(L,p[0],p[1],ext), dir=ax?[sg,0,0]:[0,0,sg];
    const R=opt.ends?opt.ends(p):null, k=!R&&wallAt(L,p[0],p[1])?Math.min(.004,(b1-b0)/4):-.004; // tucked a hair inside the faces where another wall continues it (else it flickers through as a dashed line); a hair proud at a jamb or a free end, so no slit opens at the corner
    const c=m===HM.paint&&L.key==='M'&&!opt.face&&roomAt(L,p[0],p[1])?ceilMain(p[0],p[1]):null; // painted only up to that room's ceiling
    const q=(lo,hi,mm)=>{ if(hi>lo+.01) quadF(B,mm,V(ae,lo,b0+k),V(ae,lo,b1-k),V(ae,hi,b1-k),V(ae,hi,b0+k),dir); };
    (R||[[y0,te]]).forEach(([lo,hi])=>{ lo=Math.max(lo,y0); hi=Math.min(hi,te); if(c!=null&&hi>c+.03){ q(lo,Math.min(hi,c),m); q(Math.max(lo,c),hi,ext); } else q(lo,hi,m); }); } }
/* painted baseboards along interior faces */
let BASE_B=null;
function baseRun(ax,a,b,bf,sg,y){ if(!BASE_B) return; const t=.05, h=.33, o=bf+sg*t;
  if(ax) hbox(BASE_B,M.base,a,y,Math.min(bf,o),b,y+h,Math.max(bf,o)); else hbox(BASE_B,M.base,Math.min(bf,o),y,a,Math.max(bf,o),y+h,b); }
function floorY(L,x,z){ const r=roomAt(L,x,z); return L.y+(r?r.dy:0); }
function buildWalls(L,B){ const main=L.key==='M';
  L.walls.forEach(w=>{ if(w.k==='fp'||w.k==='p'||w.k==='g'||w.k==='v') return; const ext=extMat(L,w), y0=main?CUT:L.y, half=Math.min(w.x1-w.x0,w.z1-w.z0)/2, ax=(w.x1-w.x0)>=(w.z1-w.z0);
    const topF=(x,z)=>topFor(L,x,z,ax?0:1,ax?1:0,half);
    const band=!main?(w.o.wain?()=>({y:L.y+w.o.wain,m:HM.stone}):null):(sg,am)=>{ const p=ax?[am,(sg<0?w.z0:w.z1)-sg*.1]:[(sg<0?w.x0:w.x1)-sg*.1,am], q=ax?[am,(sg<0?w.z1:w.z0)-sg*.3]:[(sg<0?w.x1:w.x0)-sg*.3,am]; // q: the room on the far side
        const r=roomAt(L,q[0],q[1]); if(w.o.wain) return {y:YM+w.o.wain,m:HM.stone}; if(!lowerSolid(p[0],p[1])) return {y:YM,m:ext};
        const lw=wallAt(HL.L,p[0],p[1]); return {y:YM+(r?r.dy:0), m:lw?extMat(HL.L,lw):shellAt(p[0],p[1])?HM.stone:ext}; }; // the floor band matches the wall below it
    const ends=p=>{ const o=openAt(L,p[0],p[1]); return o?voidsOf(L,o).v:null; };
    prism(B,L,w.x0,w.z0,w.x1,w.z1,y0,topF,ext,{band, base:true, bot:main?HM.soffit:null, ends}); });
  L.walls.forEach(w=>{ const yb=main?(YM+(roomAt(L,(w.x0+w.x1)/2,(w.z0+w.z1)/2+2)||{dy:0}).dy):L.y;
    if(w.k==='g') glassWall(B,w,yb+.0,yb+(w.o.h||7.5));
    if(w.k==='p'){ let top=w.o.top!=null?w.o.top-6766.5:yb+9; if(CUTM!=null) top=Math.min(top,CUTM); const em=extMat(L,w); prism(B,L,w.x0,w.z0,w.x1,w.z1,main?CUT:L.y,top,em,{face:(sg,p)=>roomAt(L,p[0],p[1])?HM.paint:em, cap:null}); /* painted where it faces into a room */ hbox(B,HM.fascia,w.x0-.15,top,w.z0-.15,w.x1+.15,top+.25,w.z1+.15); }
    if(w.k==='v'){ hbox(B,{px:HM.stone,nx:HM.stone,pz:HM.stone,nz:HM.stone,py:HM.cap,ny:null},w.x0,L.y,w.z0,w.x1,L.y+9,w.z1); firebox(B,{x0:sX(22.8),x1:sX(27.7),z:w.z0,dir:-1,ax:'x',y:L.y+1.6,h:1.1}); } // the linear fireplace, TV above
    if(w.k==='fp') fireplace(B,L,w); }); }
function glassWall(B,w,y0,y1){ const ax=(w.x1-w.x0)>=(w.z1-w.z0), m=(w.x0+w.x1)/2, n=(w.z0+w.z1)/2;
  if(ax) hbox(B,HM.glass,w.x0,y0,n-.02,w.x1,y1,n+.02); else hbox(B,HM.glass,m-.02,y0,w.z0,m+.02,y1,w.z1);
  if(ax) hbox(B,HM.frame,w.x0,y1-.04,n-.04,w.x1,y1+.04,n+.04); else hbox(B,HM.frame,m-.04,y1-.04,w.z0,m+.04,y1+.04,w.z1); }
function firebox(B,f){ const d=.02*f.dir; if(f.ax==='x'){ quadF(B,HM.firebox,[f.x0,f.y,f.z+d],[f.x1,f.y,f.z+d],[f.x1,f.y+f.h,f.z+d],[f.x0,f.y+f.h,f.z+d],[0,0,f.dir]); quadF(B,HM.fire,[f.x0+.15,f.y+.08,f.z+d*2],[f.x1-.15,f.y+.08,f.z+d*2],[f.x1-.15,f.y+.3,f.z+d*2],[f.x0+.15,f.y+.3,f.z+d*2],[0,0,f.dir]); }
  else { quadF(B,HM.firebox,[f.x+d,f.y,f.z0],[f.x+d,f.y,f.z1],[f.x+d,f.y+f.h,f.z1],[f.x+d,f.y+f.h,f.z0],[f.dir,0,0]); quadF(B,HM.fire,[f.x+d*2,f.y+.08,f.z0+.15],[f.x+d*2,f.y+.08,f.z1-.15],[f.x+d*2,f.y+.3,f.z1-.15],[f.x+d*2,f.y+.3,f.z0+.15],[f.dir,0,0]); } }
function fireplace(B,L,w){ const cx=(w.x0+w.x1)/2, cz=(w.z0+w.z1)/2, top=CUTM!=null?Math.min(CUTM,ceilMain(cx,cz)+.02):ceilMain(cx,cz)+.02, y0=L.y, face=w.o.face;
  hbox(B,{px:HM.stone,nx:HM.stone,pz:HM.stone,nz:HM.stone,py:HM.cap,ny:null},w.x0,y0,w.z0,w.x1,top,w.z1);
  const fy=y0+1.5, fh=1.4;
  if(w.o.three){ const x0=w.x1-4.2, x1=w.x1-.4; firebox(B,{ax:'x',x0,x1,z:w.z0,dir:-1,y:fy,h:fh}); firebox(B,{ax:'x',x0,x1,z:w.z1,dir:1,y:fy,h:fh}); firebox(B,{ax:'z',z0:w.z0+.4,z1:w.z1-.4,x:w.x1,dir:1,y:fy,h:fh}); hbox(B,HM.stone,w.x0-.1,y0+1.2,w.z0-.25,w.x1+.25,y0+1.5,w.z1+.25); return; }
  const fw=Math.min(4.2,(face==='N'||face==='S'?w.x1-w.x0:w.z1-w.z0)-1.2);
  if(face==='N'||face==='S'){ const x0=cx-fw/2, x1=cx+fw/2, z=face==='N'?w.z0:w.z1, dir=face==='N'?-1:1; firebox(B,{ax:'x',x0,x1,z,dir,y:fy,h:fh}); hbox(B,HM.stone,Math.max(w.x0,x0-1),y0,Math.min(z,z+dir*1.2),Math.min(w.x1,x1+1),y0+1.25,Math.max(z,z+dir*1.2)); }
  else { const z0=cz-fw/2, z1=cz+fw/2, x=face==='W'?w.x0:w.x1, dir=face==='W'?-1:1; firebox(B,{ax:'z',z0,z1,x,dir,y:fy,h:fh}); } }

/* lower walls outside the main level's footprint rise past the lower ceiling to whatever covers them (a deck or a roof), so no gap opens between */
function lowerUps(B){ const L=HL.L, DK=HOUSE.decks.map(d=>({p:d.poly.map(([X,Z])=>[sX(X),sZ(Z)]),y:d.y})), mainAt=(x,z)=>roomAt(HL.M,x,z)||wallAt(HL.M,x,z)||openAt(HL.M,x,z);
  const cover=(x,z)=>{ let t=1e9; for(const d of DK) if(inPoly(x,z,d.p)&&d.y-1>CUT+.05) t=Math.min(t,d.y-1); for(const r of ROOFS) if(inRect(r,x,z)){ const u=r.top(x,z)-r.th+.02; if(u>CUT+.05) t=Math.min(t,u); } return t<1e8?t:null; }; // the nearest cover above
  [...L.walls.filter(w=>w.k==='w'||w.k==='c'),...L.opens].forEach(w=>{ const ax=(w.x1-w.x0)>=(w.z1-w.z0), half=Math.min(w.x1-w.x0,w.z1-w.z0)/2, a0=ax?w.x0:w.z0, a1=ax?w.x1:w.z1, bm=ax?(w.z0+w.z1)/2:(w.x0+w.x1)/2;
    const ext=extMat(L,w.k?w:(wallAt(L,ax?w.x0-.05:bm,ax?bm:w.z0-.05)||wallAt(L,ax?w.x1+.05:bm,ax?bm:w.z1+.05))), n=Math.max(1,Math.ceil(a1-a0)), P=(a,o)=>ax?[a,bm+o]:[bm+o,a];
    const top=a=>{ const pts=[P(a,0),P(a,-(half+.3)),P(a,half+.3)]; if(pts.some(p=>mainAt(...p))) return null; let t=null; pts.forEach(p=>{ const c=cover(...p); if(c!=null&&(t==null||c<t)) t=c; }); return t!=null&&t>CUT+.05?t:null; };
    let s0=null; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*Math.min(i+.5,n)/n, on=i<n&&top(a)!=null; if(on&&s0==null) s0=a0+(a1-a0)*i/n; if(!on&&s0!=null){ const s1=a0+(a1-a0)*i/n; prism(B,L,...(ax?[s0,w.z0,s1,w.z1]:[w.x0,s0,w.x1,s1]),CUT,(x,z)=>{ const t=top(ax?x:z); return t==null?CUT:t; },ext,{face:()=>ext}); s0=null; } } }); }

/* ---------- openings: the solid wall above and below each void, then the frame, glass or door that fills it ---------- */
const DOORISH=new Set(['door','door2','pocket','barn','barn2','pass','slide','pivot','bifold','gdoor','garage']);
const PASSABLE=new Set(['door','door2','pocket','barn','barn2','pass','slide','pivot']);
let LEAVES=[]; // door leaves and other meshes that keep their own UVs; merged per material when a group is finished
function voidsOf(L,o){ const t=o.t, oo=o.o, dy=Math.max(...[-1,1].map(s=>{ const ax=(o.x1-o.x0)>=(o.z1-o.z0), p=ax?[(o.x0+o.x1)/2,(s<0?o.z0:o.z1)+s*.4]:[(s<0?o.x0:o.x1)+s*.4,(o.z0+o.z1)/2], r=roomAt(L,p[0],p[1]); return r?r.dy:0; })), fl=L.y+dy;
  if(t==='win'){ const sill=oo.sill!=null?oo.sill:2.0, head=oo.head!=null?oo.head:8.0; return {fl, v:[[fl+sill,CUTM!=null?Math.min(fl+head,CUTM-.05):fl+head]]}; }
  const h=oo.h||(t==='garage'?8.5:t==='slide'?8:t==='gdoor'?7.3:7.0), v=[[fl,fl+h]]; if(oo.tr&&(CUTM==null||fl+oo.tr[0]<CUTM-.2)) v.push([fl+oo.tr[0],CUTM!=null?Math.min(fl+oo.tr[1],CUTM):fl+oo.tr[1]]); return {fl, v}; }
function buildOpenings(L,B){ const main=L.key==='M';
  const plain=w=>w&&(w.k==='w'||w.k==='c')?w:null; // the wall an opening sits in (not a pier or fireplace beside it)
  L.opens.forEach(o=>{ const ax=(o.x1-o.x0)>=(o.z1-o.z0), half=Math.min(o.x1-o.x0,o.z1-o.z0)/2, wref=plain(wallAt(L,ax?o.x0-.05:(o.x0+o.x1)/2,ax?(o.z0+o.z1)/2:o.z0-.05))||plain(wallAt(L,ax?o.x1+.05:(o.x0+o.x1)/2,ax?(o.z0+o.z1)/2:o.z1+.05));
    const ext=extMat(L,wref), y0=main?CUT:L.y, {fl,v}=voidsOf(L,o), topF=(x,z)=>topFor(L,x,z,ax?0:1,ax?1:0,half);
    const e=.03, r=ax?[o.x0-e,o.z0,o.x1+e,o.z1]:[o.x0,o.z0-e,o.x1,o.z1+e]; // overlaps the walls beside it a little, so no hairline crack opens at the joint
    let cur=y0; v.forEach(([lo,hi])=>{ if(lo>cur+.01) prism(B,L,...r,cur,lo,ext,{noEnds:true, base:o.t==='win', cap:HM.trim}); cur=hi; });
    prism(B,L,...r,cur,topF,ext,{noEnds:true, bot:HM.paint});
    if(DOORISH.has(o.t)) hpoly(B,o.t==='garage'?HM.concrete:HM.wood,[[o.x0,o.z0],[o.x1,o.z0],[o.x1,o.z1],[o.x0,o.z1]],fl+.005,1);
    fillOpening(B,L,o,v,ax,fl); }); }
function fillOpening(B,L,o,v,ax,fl){ const a0=ax?o.x0:o.z0, a1=ax?o.x1:o.z1, b0=ax?o.z0:o.x0, b1=ax?o.z1:o.x1, bm=(b0+b1)/2, len=a1-a0, th=b1-b0;
  const BX=(aa0,y0,bb0,aa1,y1,bb1,m)=>ax?hbox(B,m,aa0,y0,bb0,aa1,y1,bb1):hbox(B,m,bb0,y0,aa0,bb1,y1,aa1);
  const sides=[-1,1].map(s=>{ const p=ax?[(a0+a1)/2,(s<0?b0:b1)+s*.4]:[(s<0?b0:b1)+s*.4,(a0+a1)/2]; return {s, room:roomAt(L,p[0],p[1])}; });
  const glazing=(y0,y1,panes,bOff)=>{ const fw=.16, fd=Math.min(.3,th*.6), bc=bm+(bOff||0); BX(a0,y0,bc-fd/2,a1,y0+fw,bc+fd/2,HM.frame); BX(a0,y1-fw,bc-fd/2,a1,y1,bc+fd/2,HM.frame); BX(a0,y0,bc-fd/2,a0+fw,y1,bc+fd/2,HM.frame); BX(a1-fw,y0,bc-fd/2,a1,y1,bc+fd/2,HM.frame);
    for(let k=1;k<panes;k++){ const am=a0+len*k/panes; BX(am-.07,y0,bc-fd/2+.02,am+.07,y1,bc+fd/2-.02,HM.frame); } BX(a0+fw,y0+fw,bc-.015,a1-fw,y1-fw,bc+.015,HM.glass); };
  const casing=(y1)=>sides.forEach(({s,room})=>{ if(!room) return; const bf=s<0?b0:b1, t=.06, w=.29, bb0=Math.min(bf,bf+s*t), bb1=Math.max(bf,bf+s*t); BX(a0-w,fl,bb0,a0,y1+w,bb1,HM.trim); BX(a1,fl,bb0,a1+w,y1+w,bb1,HM.trim); BX(a0-w,y1,bb0,a1+w,y1+w,bb1,HM.trim); });
  const t=o.t, [lo,hi]=v[0];
  if(t==='win'){ const panes=len>9?Math.round(len/3):len>4.6?2:1; glazing(lo,hi,panes,(sides.find(x=>!x.room)||{s:0}).s*th*.15); return; }
  if(t==='slide'){ glazing(lo,hi,Math.max(2,Math.round(len/4)),0); if(v[1]) glazing(v[1][0],v[1][1],Math.max(1,Math.round(len/6)),0); return; }
  if(t==='gdoor'){ BX(a0,lo,bm-.02,a1,hi,bm+.02,HM.glass); BX(a0,hi-.05,bm-.03,a1,hi,bm+.03,HM.frame); return; }
  if(t==='garage'){ const s=(sides.find(x=>!x.room)||{s:-1}).s; BX(a0,lo,bm+s*th*.3-.08,a1,hi,bm+s*th*.3+.08,HM.garage); return; }
  if(t==='bifold'){ casing(hi); const n=len>4.5?4:2; for(let k=0;k<n;k++){ const p0=a0+len*k/n+.02, p1=a0+len*(k+1)/n-.02; leaf(p0,p1,lo,hi-.02,bm-.06,bm+.06); } return; }
  if(t==='pass'||t==='pocket'){ casing(hi); return; }
  if(t==='barn'||t==='barn2'){ const s=o.o.side||1, bf=s<0?b0:b1, n=t==='barn2'?2:1, w=len/n; BX(a0-w*.9,hi+.15,Math.min(bf+s*.04,bf+s*.12),a1+w*.9,hi+.3,Math.max(bf+s*.04,bf+s*.12),HM.steel);
    for(let k=0;k<n;k++){ const side=n===2?(k?1:-1):1, p0=side<0?a0-w+.05:a1-.05, p1=p0+w+.1; leaf(Math.min(p0,p1),Math.max(p0,p1),lo,hi+.1,Math.min(bf+s*.12,bf+s*.28),Math.max(bf+s*.12,bf+s*.28),'barn'); } return; }
  if(t==='pivot'){ const w=len-.2, piv=a0+w*.3, ang=sides.some(x=>!x.room)?0:1.15, c=Math.cos(ang), s=Math.sin(ang), g=new THREE.Mesh(rboxG(w,hi-lo-.04,.22,.03), mat('wood','#4e3424')); g.castShadow=g.receiveShadow=true; // shut when it opens to the outside
    const along=-(w*.5-w*.3)*c, out=(w*.5-w*.3)*s, sx=!ang?(ax?[(a0+a1)/2,bm]:[bm,(a0+a1)/2]):ax?[piv+along,bm+out]:[bm+out,piv+along]; g.position.set(sx[0],lo+(hi-lo)/2,sx[1]); g.rotation.y=(ax?0:Math.PI/2)+(ax?-ang:ang); LEAVES.push(g);
    BX(a0,hi-.02,b0,a1,hi+.12,b1,HM.frame); return; }
  // swinging doors: shown open, swung into the room that is not a hallway (or the smaller room); a door to the outside is shown shut
  casing(hi); const rooms=sides.filter(x=>x.room); let into=o.o.swing!=null?o.o.swing:1;
  if(rooms.length===1) into=rooms[0].s; else if(rooms.length===2){ const [A,Bb]=rooms, ca=CIRC.test(A.room.n), cb=CIRC.test(Bb.room.n); if(ca!==cb) into=ca?Bb.s:A.s; else into=polyArea(A.room.p)<polyArea(Bb.room.p)?A.s:Bb.s; }
  const pair=t==='door2'||o.o.pair, lw=(pair?len/2:len)-.04, glassD=!!o.o.glass; let leaves=pair?[[a0,1],[a1,-1]]:[[o.o.hinge===1?a1:a0,o.o.hinge===1?-1:1]];
  const shut=rooms.length<2;
  if(!shut){ const fits=(inS,lv)=>lv.every(([hp,dA])=>{ const c=Math.cos(1.45), s=Math.sin(1.45), bf=inS<0?b0:b1; for(let k=.3;k<=lw+.01;k+=.3){ const a=hp+dA*k*c, b=bf+inS*k*s, P=ax?[a,b]:[b,a]; if(!roomAt(L,P[0],P[1])||wallAt(L,P[0],P[1])) return false; } return true; });
    const flip=lv=>lv.map(([hp,dA])=>[hp===a0?a1:a0,-dA]), ok=[[into,leaves],[into,flip(leaves)],[-into,leaves],[-into,flip(leaves)]].find(([i,lv])=>fits(i,lv)); if(ok){ into=ok[0]; leaves=ok[1]; } }
  leaves.forEach(([hp,dirA])=>{ const ang=shut?0:1.45, c=Math.cos(ang), s=Math.sin(ang), bf=shut?bm:into<0?b0:b1, ca=hp+dirA*lw/2*c, cb=bf+into*lw/2*s, g=new THREE.Mesh(boxG(lw,hi-lo-.03,.15), glassD?HM.glass:M.door);
    g.position.set(ax?ca:cb, lo+(hi-lo-.03)/2, ax?cb:ca); g.rotation.y=(ax?0:-Math.PI/2)+(ax?-dirA*into*ang:dirA*into*ang); g.castShadow=!glassD; g.receiveShadow=true; LEAVES.push(g); });
  function leaf(p0,p1,y0,y1,q0,q1,kind){ const g=new THREE.Mesh(boxG(p1-p0,y1-y0,q1-q0), kind==='barn'?mat('wood','#6b4a33'):M.door); g.position.set(ax?(p0+p1)/2:(q0+q1)/2,(y0+y1)/2,ax?(q0+q1)/2:(p0+p1)/2); if(!ax) g.rotation.y=Math.PI/2; g.castShadow=g.receiveShadow=true; LEAVES.push(g); } }

/* ---------- floors and ceilings ---------- */
const FLOORM=f=>({wood:HM.wood,tile:HM.tile,concrete:HM.concrete,carpet:HM.wood}[f]||HM.wood);
function buildFloors(L,B){ L.rooms.forEach(r=>{ if(r.nf) return; hpoly(B,FLOORM(r.f),r.p,L.y+r.dy,1);
    if(L.key==='M') hpoly(B,HM.soffit,r.p,r.dy>0?YM+r.dy-1:CUT,-1);
    else if(!r.nc) hpoly(B,HM.ceil,r.p,HOUSE.L.ceil,-1); });
  if(L.key==='M') mainCeilings(B); }
function zoneAt(x,z){ for(const c of CEILZ) if(inRect(c,x,z)) return c; return null; }
function mainCeilings(B){ const ZX=[], ZZ=[]; CEILZ.forEach(c=>{ ZX.push(c.x0,c.x1); ZZ.push(c.z0,c.z1); });
  HL.M.rooms.forEach(r=>{ const X=[...new Set([...ZX,...r.p.map(p=>p[0])].map(v=>Math.round(v*1e4)/1e4))].filter(v=>v>=r.bb.x0-1e-4&&v<=r.bb.x1+1e-4).sort((a,b)=>a-b),
      Z=[...new Set([...ZZ,...r.p.map(p=>p[1])].map(v=>Math.round(v*1e4)/1e4))].filter(v=>v>=r.bb.z0-1e-4&&v<=r.bb.z1+1e-4).sort((a,b)=>a-b);
    for(let i=0;i<X.length-1;i++) for(let j=0;j<Z.length-1;j++){ const x0=X[i], x1=X[i+1], z0=Z[j], z1=Z[j+1], cx=(x0+x1)/2, cz=(z0+z1)/2; if(x1-x0<1e-3||z1-z0<1e-3||!inPoly(cx,cz,r.p)) continue;
      const zn=zoneAt(cx,cz), f=zn?zn.f:()=>YM+9; quadF(B,HM.ceil,[x0,f(x0,z0),z0],[x1,f(x1,z0),z0],[x1,f(x1,z1),z1],[x0,f(x0,z1),z1],[0,-1,0]);
      [[x0,z0,x0,z1,-1,0],[x1,z0,x1,z1,1,0],[x0,z0,x1,z0,0,-1],[x0,z1,x1,z1,0,1]].forEach(([ea,eb,fa,fb,dx,dz])=>{ const px=(ea+fa)/2+dx*.06, pz=(eb+fb)/2+dz*.06; if(!roomAt(HL.M,px,pz)) return;
        const zn2=zoneAt(px,pz); if(!zn2||zn2===zn) return; const g=zn2.f; const ha=f(ea,eb), hb=f(fa,fb), ga=g(ea,eb), gb=g(fa,fb); if(ga<ha+.04&&gb<hb+.04) return;
        quadF(B,HM.ceil,[ea,ha,eb],[fa,hb,fb],[fa,Math.max(gb,hb),fb],[ea,Math.max(ga,ha),eb],[dx,0,dz]);
        const up=(x,z,g0)=>{ const rf=roofAt(x+dx*.06,z+dz*.06); return Math.max(g0,rf?rf.t-rf.r.th+.02:g0); }; // seen from outside above the lower roof
        quadF(B,HM.siding,[ea,ha,eb],[fa,hb,fb],[fa,Math.max(up(fa,fb,gb),hb),fb],[ea,Math.max(up(ea,eb,ga),ha),eb],[-dx,0,-dz]); }); } }); }

/* ---------- roofs, beams, chimneys ---------- */
function buildRoofs(B){ ROOFS.forEach(r=>{ const c=[[r.x0,r.z0],[r.x1,r.z0],[r.x1,r.z1],[r.x0,r.z1]], T=c.map(([x,z])=>r.top(x,z)), Bo=T.map(t=>t-r.th+.02), V=(i,y)=>[c[i][0],y,c[i][1]];
    const top=r.k==='flat'?HM.ballast:(r.fall==='E'||r.fall==='W')?HM.roofX:HM.roofZ;
    quadF(B,top,V(0,T[0]),V(1,T[1]),V(2,T[2]),V(3,T[3]),[0,1,0]); quadF(B,HM.soffit,V(0,Bo[0]),V(1,Bo[1]),V(2,Bo[2]),V(3,Bo[3]),[0,-1,0]);
    /* edge fascia, a foot at a time, left off wherever the edge tucks under a taller roof or against a taller room (it would only flicker against that wall) */
    const tucked=(x,z,t)=>ROOFS.some(o=>o!==r&&inRect(o,x,z)&&o.top(x,z)>t-.05)||(!!roomAt(HL.M,x,z)&&ceilMain(x,z)>t-r.th+.05);
    [[0,1,0,-1],[1,2,1,0],[2,3,0,1],[3,0,-1,0]].forEach(([i,j,dx,dz])=>{ const a=c[i], b=c[j], n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1]))), P=t=>[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
      for(let k=0;k<n;k++){ const p0=P(k/n), p1=P((k+1)/n), m=P((k+.5)/n); if(tucked(m[0]+dx*.3, m[1]+dz*.3, r.top(m[0],m[1]))){
          /* tucked under a higher roof over a room: close the slot between this roof and the one above it, so the space over the ceiling never shows */
          const qx=m[0]+dx*.3, qz=m[1]+dz*.3, o=roomAt(HL.M,qx,qz)?ROOFS.filter(o=>o!==r&&inRect(o,qx,qz)).sort((a,b)=>b.top(qx,qz)-a.top(qx,qz))[0]:null;
          if(o){ const u0=o.top(p0[0],p0[1])-o.th+.02, u1=o.top(p1[0],p1[1])-o.th+.02, t0=r.top(p0[0],p0[1]), t1=r.top(p1[0],p1[1]); if(u0>t0+.05||u1>t1+.05) quadF(B,HM.siding,[p0[0],t0,p0[1]],[p1[0],t1,p1[1]],[p1[0],Math.max(u1,t1),p1[1]],[p0[0],Math.max(u0,t0),p0[1]],[-dx,0,-dz]); }
          continue; }
        const y0=r.top(p0[0],p0[1]), y1=r.top(p1[0],p1[1]); quadF(B,HM.fascia,[p0[0],y0-r.th+.02,p0[1]],[p1[0],y1-r.th+.02,p1[1]],[p1[0],y1+.05,p1[1]],[p0[0],y0+.05,p0[1]],[dx,0,dz]);
        if(r.k==='flat'){ const ox=dx*.25, oz=dz*.25; quadF(B,HM.fascia,[p0[0]-ox,y0+.05,p0[1]-oz],[p1[0]-ox,y1+.05,p1[1]-oz],[p1[0],y1+.05,p1[1]],[p0[0],y0+.05,p0[1]],[0,1,0]); } } });
    if(r.n==='great'||r.n==='dining') for(let X=15;X<=46;X+=6){ const x=sX(X); if(x<r.x0+.3||x>r.x1-.3) continue; const y=r.top(x,r.z0)-r.th; hbox(B,HM.beam,x-.22,y-.9,r.z0+.2,x+.22,y+.01,r.z1-.2); }
    if(r.k==='metal'){ const fallX=r.fall==='E'||r.fall==='W'; // timber outlookers under the low eave
      const eave=r.fall==='N'?r.z0:r.fall==='S'?r.z1:r.fall==='E'?r.x1:r.x0; if(fallX) for(let z=r.z0+2;z<r.z1-1;z+=4){ const x=eave, y=r.top(x,z)-r.th; hbox(B,HM.beam,Math.min(x,x+(r.fall==='E'?-3:3)),y-.55,z-.17,Math.max(x,x+(r.fall==='E'?-3:3)),y+.01,z+.17); }
      else for(let x=r.x0+2;x<r.x1-1;x+=4){ const z=eave, y=r.top(x,z)-r.th; hbox(B,HM.beam,x-.17,y-.55,Math.min(z,z+(r.fall==='N'?3:-3)),x+.17,y+.01,Math.max(z,z+(r.fall==='N'?3:-3))); } } });
  HOUSE.chim.forEach(ch=>{ const x0=sX(ch.r[0]), x1=sX(ch.r[1]), z0=sZ(ch.r[2]), z1=sZ(ch.r[3]), top=YM+ch.top, sm=ch.k==='metal'?HM.roofZ:HM.stone;
    /* built on a 1 ft grid: each cell starts just under the roof it rises from (or at the main floor where it stands outside), so it never shows inside a room */
    const nx=Math.max(1,Math.round(x1-x0)), nz=Math.max(1,Math.round(z1-z0)), dx=(x1-x0)/nx, dz=(z1-z0)/nz, base=(cx,cz)=>{ const rf=roofAt(cx,cz); if(roomAt(HL.M,cx,cz)||wallAt(HL.M,cx,cz)) return rf?rf.t-.3:YM+9; return YM; };
    for(let i=0;i<nx;i++) for(let j=0;j<nz;j++){ const a0=x0+i*dx, a1=a0+dx, b0=z0+j*dz, b1=b0+dz, y0=base((a0+a1)/2,(b0+b1)/2);
      if(i===0) quadF(B,sm,[a0,y0,b0],[a0,y0,b1],[a0,top,b1],[a0,top,b0],[-1,0,0]); if(i===nx-1) quadF(B,sm,[a1,y0,b0],[a1,y0,b1],[a1,top,b1],[a1,top,b0],[1,0,0]);
      if(j===0) quadF(B,sm,[a0,y0,b0],[a1,y0,b0],[a1,top,b0],[a0,top,b0],[0,0,-1]); if(j===nz-1) quadF(B,sm,[a0,y0,b1],[a1,y0,b1],[a1,top,b1],[a0,top,b1],[0,0,1]); }
    hbox(B,HM.fascia,x0-.2,top,z0-.2,x1+.2,top+.5,z1+.2); const inset=.35; hbox(B,HM.mesh,x0+inset,top+.5,z0+inset,x1-inset,top+.5+ch.cap,z1-inset); hbox(B,HM.fascia,x0+inset-.15,top+.5+ch.cap,z0+inset-.15,x1-inset+.15,top+.8+ch.cap,z1-inset+.15); }); }
/* ---------- stairs ---------- */
function buildStairs(pick){ (HOUSE.rails||[]).forEach(([X0,Z0,X1,Z1,y0,y1])=>{ const B=pick({lvl:Math.max(y0,y1)>=YM-.1&&Math.min(y0,y1)>=YM-.1?'main':'lower'}); rail(B,sX(X0),sZ(Z0),sX(X1),sZ(Z1),y0,y1); });
  HOUSE.stairs.forEach(s=>{ const B=pick(s);
    if(s.land){ const [X0,X1,Z0,Z1]=s.land; hbox(B,{px:HM.paint,nx:HM.paint,pz:HM.paint,nz:HM.paint,py:HM.wood,ny:HM.paint},sX(X0),s.y-.7,sZ(Z0),sX(X1),s.y,sZ(Z1)); return; }
    const ax=s.ax==='x', A=v=>ax?sX(v):sZ(v), Bv=v=>ax?sZ(v):sX(v), a0=A(s.a0), a1=A(s.a1), b0=Bv(s.b[0]), b1=Bv(s.b[1]), n=s.nr, d=(a1-a0)/(n-1), rise=(s.y1-s.y0)/n, open=s.n.startsWith('main');
    const box=(p0,p1,y0,y1,m)=>{ const lo=Math.min(p0,p1), hi=Math.max(p0,p1); ax?hbox(B,m,lo,y0,b0,hi,y1,b1):hbox(B,m,b0,y0,lo,b1,y1,hi); };
    for(let i=0;i<n-1;i++){ const p0=a0+i*d, p1=p0+d, y=s.y0+(i+1)*rise; if(open) box(p0,p1+Math.sign(d)*.08,y-.15,y,{px:HM.wood,nx:HM.wood,pz:HM.wood,nz:HM.wood,py:HM.wood,ny:HM.wood});
      else box(p0,p1,Math.min(s.y0,s.y1)-(s.ext?.5:0),y,s.ext?(s.n==='spa'?HM.pavers:{px:HM.stone,nx:HM.stone,pz:HM.stone,nz:HM.stone,py:HM.pavers,ny:null}):{px:HM.paint,nx:HM.paint,pz:HM.paint,nz:HM.paint,py:HM.wood,ny:null}); }
    if(!open&&s.y1>s.y0){ const yT=s.y0+(n-1)*rise; if(s.y1-yT>.01){ const sg=Math.sign(d), m=s.ext?(s.n==='spa'?HM.pavers:HM.stone):HM.paint, P=(a,y,b)=>ax?[a,y,b]:[b,y,a]; // the riser up to the floor at the top
        quadF(B,m,P(a1,yT,b0),P(a1,yT,b1),P(a1,s.y1,b1),P(a1,s.y1,b0),ax?[-sg,0,0]:[0,0,-sg]); } }
    if(open){ const lo=Math.min(s.y0,s.y1); [b0+.02,b1-.12].forEach(bb=>{ const yA=s.y0-.9, yB=s.y1-.9; const P=(a,y,b)=>ax?[a,y,b]:[b,y,a];
        quadF(B,HM.steel,P(a0,s.y0,bb),P(a1,s.y1,bb),P(a1,yB,bb),P(a0,yA,bb),ax?[0,0,-1]:[-1,0,0]); quadF(B,HM.steel,P(a0,s.y0,bb+.1),P(a1,s.y1,bb+.1),P(a1,yB,bb+.1),P(a0,yA,bb+.1),ax?[0,0,1]:[1,0,0]);
        quadF(B,HM.steel,P(a0,s.y0,bb),P(a1,s.y1,bb),P(a1,s.y1,bb+.1),P(a0,s.y0,bb+.1),[0,1,0]); quadF(B,HM.steel,P(a0,yA,bb),P(a1,yB,bb),P(a1,yB,bb+.1),P(a0,yA,bb+.1),[0,-1,0]); });
      if(s.n==='main-upper'){ const P=(a,y,b)=>ax?[a,y,b]:[b,y,a]; quadF(B,HM.paint,P(a0,s.y0-.75,b0),P(a1,s.y1-.75,b0),P(a1,s.y1-.75,b1),P(a0,s.y0-.75,b1),[0,-1,0]); } } }); }
/* ---------- guardrails: posts, cap rail and horizontal cables ---------- */
function rail(B,x0,z0,x1,z1,y0,y1){ const len=Math.hypot(x1-x0,z1-z0); if(len<.3) return; const n=Math.max(1,Math.ceil(len/5)), H=3.5, dx=(x1-x0)/len, dz=(z1-z0)/len, yAt=t=>y0+(y1-y0)*t;
  for(let i=0;i<=n;i++){ const t=i/n, x=x0+(x1-x0)*t, z=z0+(z1-z0)*t, y=yAt(t); hbox(B,HM.steel,x-.09,y,z-.09,x+.09,y+H,z+.09); }
  const P=(t,y,o)=>[x0+(x1-x0)*t-dz*o, y, z0+(z1-z0)*t+dx*o];
  [[-.12,.12]].forEach(()=>{ quadF(B,HM.rail,P(0,yAt(0)+H+.12,-.13),P(1,yAt(1)+H+.12,-.13),P(1,yAt(1)+H+.12,.13),P(0,yAt(0)+H+.12,.13),[0,1,0]);
    for(const o of [-.13,.13]) quadF(B,HM.rail,P(0,yAt(0)+H,o),P(1,yAt(1)+H,o),P(1,yAt(1)+H+.12,o),P(0,yAt(0)+H+.12,o),[-dz*Math.sign(o),0,dx*Math.sign(o)]); });
  for(let k=1;k<=9;k++){ const h=k*H/10.5; quadF(B,HM.cable,P(0,yAt(0)+h,0),P(1,yAt(1)+h,0),P(1,yAt(1)+h+.03,0),P(0,yAt(0)+h+.03,0),[-dz,0,dx]); quadF(B,HM.cable,P(0,yAt(0)+h,0),P(1,yAt(1)+h,0),P(1,yAt(1)+h+.03,0),P(0,yAt(0)+h+.03,0),[dz,0,-dx]); } }

/* ---------- decks, terraces and the site ---------- */
function buildDecks(B){ HOUSE.decks.forEach(d=>{ const p=d.poly.map(([X,Z])=>[sX(X),sZ(Z)]), m=d.k==='pavers'?HM.pavers:d.k==='concrete'?HM.concrete:HM.deck; hpoly(B,m,p,d.y,1); hpoly(B,HM.soffit,p,d.y-1,-1);
    p.forEach((a,i)=>{ const b=p[(i+1)%p.length], dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz), nx=dz/l, nz=-dx/l, mx=(a[0]+b[0])/2, mz=(a[1]+b[1])/2, out=inPoly(mx+nx*.1,mz+nz*.1,p)?-1:1;
      quadF(B,HM.fascia,[a[0],d.y-1,a[1]],[b[0],d.y-1,b[1]],[b[0],d.y+.02,b[1]],[a[0],d.y+.02,a[1]],[nx*out,0,nz*out]);
      const px=mx+nx*out*.6, pz=mz+nz*out*.6, against=roomAt(HL.M,px,pz)||wallAt(HL.M,px,pz)||openAt(HL.M,px,pz)||HOUSE.chim.some(c=>inRect({x0:sX(c.r[0]),x1:sX(c.r[1]),z0:sZ(c.r[2]),z1:sZ(c.r[3])},px,pz,.3));
      const want=d.rail==='auto'?!against:[...(d.rail||'')].some(ch=>({W:dx===0&&nx*out<0,E:dx===0&&nx*out>0,N:dz===0&&nz*out<0,S:dz===0&&nz*out>0})[ch]);
      if(want){ const ix=-nx*out*.15, iz=-nz*out*.15; if(d.screen){ const p0=[a[0]+ix,a[1]+iz], p1=[b[0]+ix,b[1]+iz]; quadF(B,HM.roofZ,[p0[0],d.y,p0[1]],[p1[0],d.y,p1[1]],[p1[0],d.y+4,p1[1]],[p0[0],d.y+4,p0[1]],[nx*out,0,nz*out]); quadF(B,HM.roofZ,[p0[0],d.y,p0[1]],[p1[0],d.y,p1[1]],[p1[0],d.y+4,p1[1]],[p0[0],d.y+4,p0[1]],[-nx*out,0,-nz*out]); hbox(B,HM.fascia,Math.min(p0[0],p1[0])-.08,d.y+4,Math.min(p0[1],p1[1])-.08,Math.max(p0[0],p1[0])+.08,d.y+4.15,Math.max(p0[1],p1[1])+.08); }
        else rail(B,a[0]+ix,a[1]+iz,b[0]+ix,b[1]+iz,d.y,d.y); } }); }); }
function buildSite(Bl,Bm){ const P=a=>a.map(([X,Z])=>[sX(X),sZ(Z)]), R=r=>({x0:sX(r[0]),x1:sX(r[1]),z0:sZ(r[2]),z1:sZ(r[3])});
  HOUSE.ter.forEach(t=>{ const p=P(t.poly); hpoly(Bl,HM.pavers,p,t.y,1); p.forEach((a,i)=>{ const b=p[(i+1)%p.length], dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz), nx=dz/l, nz=-dx/l, mx=(a[0]+b[0])/2, mz=(a[1]+b[1])/2, out=inPoly(mx+nx*.1,mz+nz*.1,p)?-1:1;
    quadF(Bl,HM.stone,[a[0],t.y-3,a[1]],[b[0],t.y-3,b[1]],[b[0],t.y,b[1]],[a[0],t.y,a[1]],[nx*out,0,nz*out]); }); });
  HOUSE.swall.forEach(w=>{ const r=R(w.r); hbox(Bl,{px:HM.stone,nx:HM.stone,pz:HM.stone,nz:HM.stone,py:HM.fascia,ny:null},r.x0,w.top-4,r.z0,r.x1,w.top,r.z1); });
  HOUSE.plant.forEach(pl=>{ const r=R(pl.r); if(pl.wall!=null) hbox(Bm,{px:HM.stone,nx:HM.stone,pz:HM.stone,nz:HM.stone,py:HM.fascia,ny:null},r.x0,YM-1,r.z0,r.x1,pl.wall,r.z1); hbox(pl.wall!=null?Bm:Bl,{py:HM.soil,px:null,nx:null,pz:null,nz:null,ny:null},r.x0+(pl.wall!=null?.6:0),pl.y-1,r.z0+(pl.wall!=null?.6:0),r.x1-(pl.wall!=null?.6:0),pl.y,r.z1-(pl.wall!=null?.6:0)); const q=RNG(77); for(let z=r.z0+1.2;z<r.z1-1;z+=2.2+q()*1.5){ const s=.9+q()*.8, g=new THREE.Mesh(icoG(1),HM.shrub); g.position.set((r.x0+r.x1)/2+(q()-.5)*1.5,pl.y+s*.55,z); g.scale.set(s,.8*s,s); g.castShadow=g.receiveShadow=true; LEAVES.push(g); } });
  HOUSE.piers.forEach(p=>{ const r=R(p.r); hbox(Bm,HM.stone,r.x0,p.y0,r.z0,r.x1,p.y1,r.z1); });
  (HOUSE.rwalls||[]).forEach(([X0,Z0,X1,Z1,th,t0,t1])=>{ const a=[sX(X0),sZ(Z0)], b=[sX(X1),sZ(Z1)], dx=b[0]-a[0], dz=b[1]-a[1], l=Math.hypot(dx,dz), nx=-dz/l*th/2, nz=dx/l*th/2, y0=Math.min(grade(...a),grade(...b))-3;
    const A0=[a[0]+nx,a[1]+nz], A1=[a[0]-nx,a[1]-nz], B0=[b[0]+nx,b[1]+nz], B1=[b[0]-nx,b[1]-nz];
    quadF(Bm,HM.stone,[A0[0],y0,A0[1]],[B0[0],y0,B0[1]],[B0[0],t1,B0[1]],[A0[0],t0,A0[1]],[nx,0,nz]); quadF(Bm,HM.stone,[A1[0],y0,A1[1]],[B1[0],y0,B1[1]],[B1[0],t1,B1[1]],[A1[0],t0,A1[1]],[-nx,0,-nz]);
    quadF(Bm,HM.fascia,[A0[0],t0,A0[1]],[B0[0],t1,B0[1]],[B1[0],t1,B1[1]],[A1[0],t0,A1[1]],[0,1,0]); [[A0,A1,a,-1],[B0,B1,b,1]].forEach(([P,Q,c,sg])=>quadF(Bm,HM.stone,[P[0],y0,P[1]],[Q[0],y0,Q[1]],[Q[0],sg<0?t0:t1,Q[1]],[P[0],sg<0?t0:t1,P[1]],[dx*sg,0,dz*sg])); });
  HOUSE.posts.forEach(([X,Z,y0,y1,s])=>hbox(Bm,HM.steel,sX(X)-s/2,y0,sZ(Z)-s/2,sX(X)+s/2,y1,sZ(Z)+s/2));
  { const r=R(HOUSE.spa.r), t=HOUSE.spa.top; hbox(Bl,{px:HM.spa,nx:HM.spa,pz:HM.spa,nz:HM.spa,py:null,ny:null},r.x0,-2.5,r.z0,r.x1,t,r.z1); hbox(Bl,HM.spa,r.x0,t,r.z0,r.x1,t+.08,r.z0+.5); hbox(Bl,HM.spa,r.x0,t,r.z1-.5,r.x1,t+.08,r.z1); hbox(Bl,HM.spa,r.x0,t,r.z0,r.x0+.5,t+.08,r.z1); hbox(Bl,HM.spa,r.x1-.5,t,r.z0,r.x1,t+.08,r.z1); hpoly(Bl,HM.water,[[r.x0+.5,r.z0+.5],[r.x1-.5,r.z0+.5],[r.x1-.5,r.z1-.5],[r.x0+.5,r.z1-.5]],t-.25,1); }
  { const f=HOUSE.fire, r=R(f.r); hbox(Bm,HM.stone,r.x0,f.y,r.z0,r.x1,f.y+f.h,r.z1); hbox(Bm,HM.ballast,r.x0+.6,f.y+f.h,r.z0+.6,r.x1-.6,f.y+f.h+.05,r.z1-.6); hbox(Bm,HM.fire,(r.x0+r.x1)/2-.06,f.y+f.h+.05,r.z0+1.2,(r.x0+r.x1)/2+.06,f.y+f.h+.3,r.z1-1.2); }
  { const b=HOUSE.bbq, r=R(b.r); hbox(Bm,HM.stone,r.x0,b.y,r.z0,r.x1,b.y+b.h,r.z1); hbox(Bm,HM.fascia,r.x0-.1,b.y+b.h,r.z0-.1,r.x1+.1,b.y+b.h+.12,r.z1+.1); hbox(Bm,HM.steel,r.x0+.1,b.y+b.h+.12,r.z0+1.4,r.x1-.1,b.y+b.h+.75,r.z1-1.4); } }
let LAWN=null; // the grass is walkable wherever the house, terraces and walls are not
function onLawn(x,z){ const L=LAWN; if(!L||x<L.X0||z<L.Z0||x>L.X1||z>L.Z1) return false; const u=Math.floor((x-L.X0)*L.PX), v=Math.floor((z-L.Z0)*L.PX); if(u<0||v<0||u>=L.W||v>=L.H) return false; const i=(v*L.W+u)*4; return L.img[i]<128&&!(L.img[i+2]>128&&grade(x,z)>YM-3); }
/* terrain: grade sampled from the elevation sheets, smoothed between points, cut away wherever the house, terraces or driveway sit */
const TPTS=HOUSE.terrain.map(([X,Z,y])=>[sX(X),sZ(Z),y]);
function grade(x,z){ let s=0, w=0; for(const [px,pz,py] of TPTS){ const d2=(x-px)*(x-px)+(z-pz)*(z-pz)+1; const k=1/(d2*d2); s+=py*k; w+=k; } return s/w; }
function buildTerrain(group){ const X0=sX(-60), X1=sX(175), Z0=sZ(-60), Z1=sZ(185), C=1.25, nx=Math.ceil((X1-X0)/C), nz=Math.ceil((Z1-Z0)/C), PX=2, W=Math.ceil((X1-X0)*PX), H=Math.ceil((Z1-Z0)*PX);
  const [cv,g]=cnv(W,H), path=(pts)=>{ g.beginPath(); pts.forEach(([x,z],i)=>{ const u=(x-X0)*PX, v=(z-Z0)*PX; i?g.lineTo(u,v):g.moveTo(u,v); }); g.closePath(); g.fill(); }, rect=r=>path([[r.x0,r.z0],[r.x1,r.z0],[r.x1,r.z1],[r.x0,r.z1]]);
  g.fillStyle='#000'; g.fillRect(0,0,W,H); g.fillStyle='#0f0'; path(HOUSE.drive.map(([X,Z])=>[sX(X),sZ(Z)]));
  g.fillStyle='#00f'; HL.M.rooms.forEach(r=>path(r.p)); HL.M.walls.forEach(rect); HL.M.opens.forEach(rect); // the main level: cuts the ground only where the ground comes up near its floor
  g.fillStyle='#f00'; HL.L.rooms.forEach(r=>path(r.p)); HL.L.walls.forEach(rect); HL.L.opens.forEach(rect); if(POLY.length) path(POLY); SHELL.forEach(rect);
  HOUSE.ter.forEach(t=>path(t.poly.map(([X,Z])=>[sX(X),sZ(Z)]))); HOUSE.swall.forEach(w=>rect({x0:sX(w.r[0]),x1:sX(w.r[1]),z0:sZ(w.r[2]),z1:sZ(w.r[3])})); HOUSE.plant.forEach(w=>rect({x0:sX(w.r[0]),x1:sX(w.r[1]),z0:sZ(w.r[2]),z1:sZ(w.r[3])}));
  HOUSE.stairs.filter(s=>s.ext).forEach(s=>{ const ax=s.ax==='x'; rect(ax?{x0:sX(Math.min(s.a0,s.a1)),x1:sX(Math.max(s.a0,s.a1)),z0:sZ(s.b[0]),z1:sZ(s.b[1])}:{x0:sX(s.b[0]),x1:sX(s.b[1]),z0:sZ(Math.min(s.a0,s.a1)),z1:sZ(Math.max(s.a0,s.a1))}); });
  HOUSE.decks.filter(d=>/Covered Entry|Dog Run|Sitting/.test(d.n)).forEach(d=>path(d.poly.map(([X,Z])=>[sX(X),sZ(Z)])));
  const img=g.getImageData(0,0,W,H).data; LAWN={X0,Z0,X1,Z1,PX,W,H,img}; const cls0=(x,z)=>{ const u=Math.floor((x-X0)*PX), v=Math.floor((z-Z0)*PX); if(u<0||v<0||u>=W||v>=H) return 0; const i=(v*W+u)*4; return img[i]>128||(img[i+2]>128&&grade(x,z)>YM-3)?2:img[i+1]>128?1:0; };
  const hgt=new Float32Array((nx+1)*(nz+1)); for(let j=0;j<=nz;j++) for(let i=0;i<=nx;i++) hgt[j*(nx+1)+i]=grade(X0+i*C,Z0+j*C);
  /* grass under the drive stays (the drive sits just above it). A cell that straddles the house edge is drawn in sixteenths, leaving out the
     pieces over the house, so the slope never pokes through a wall into a room where the ground outside is higher than the floor inside */
  const Bg=Bk(), SUB=4; for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){ const x=X0+i*C, z=Z0+j*C, h=(a,b)=>hgt[(j+b)*(nx+1)+i+a], inHouse=(u,v)=>cls0(x+u*C,z+v*C)===2;
    const k=[[.5,.5],[0,0],[1,0],[1,1],[0,1]].filter(([u,v])=>inHouse(u,v)).length;
    if(k===0){ quadF(Bg,HM.grass,[x,h(0,1),z+C],[x+C,h(1,1),z+C],[x+C,h(1,0),z],[x,h(0,0),z],[0,1,0]); continue; } if(k===5) continue;
    const hb=(u,v)=>h(0,0)*(1-u)*(1-v)+h(1,0)*u*(1-v)+h(0,1)*(1-u)*v+h(1,1)*u*v;
    for(let a=0;a<SUB;a++) for(let b=0;b<SUB;b++){ const u0=a/SUB, u1=(a+1)/SUB, v0=b/SUB, v1=(b+1)/SUB; if(inHouse((u0+u1)/2,(v0+v1)/2)) continue;
      quadF(Bg,HM.grass,[x+u0*C,hb(u0,v1),z+v1*C],[x+u1*C,hb(u1,v1),z+v1*C],[x+u1*C,hb(u1,v0),z+v0*C],[x+u0*C,hb(u0,v0),z+v0*C],[0,1,0]); } }
  const dp=HOUSE.drive.map(([X,Z])=>[sX(X),sZ(Z)]), v2=dp.map(([x,z])=>new THREE.Vector2(x,z)); THREE.ShapeUtils.triangulateShape(v2,[]).forEach(([a,b,c])=>{ const sub=(A,Bq,Cq,d)=>{ const l=Math.max(Math.hypot(A[0]-Bq[0],A[1]-Bq[1]),Math.hypot(Bq[0]-Cq[0],Bq[1]-Cq[1]),Math.hypot(Cq[0]-A[0],Cq[1]-A[1]));
      if(l>3&&d<9){ const m=(P,Q)=>[(P[0]+Q[0])/2,(P[1]+Q[1])/2], ab=m(A,Bq), bc=m(Bq,Cq), ca=m(Cq,A); sub(A,ab,ca,d+1); sub(ab,Bq,bc,d+1); sub(ca,bc,Cq,d+1); sub(ab,bc,ca,d+1); return; }
      const Y=p=>[p[0],grade(p[0],p[1])+.08,p[1]]; tri(Bg,HM.drive,Y(A),Y(Bq),Y(Cq),1); }; sub(dp[a],dp[b],dp[c],0); });
  { const F=12, FX0=sX(-480), FX1=sX(560), FZ0=sZ(-480), FZ1=sZ(600); for(let x=FX0;x<FX1;x+=F) for(let z=FZ0;z<FZ1;z+=F){ if(x+F>X0&&x<X1&&z+F>Z0&&z<Z1){ // trim the coarse cells that overlap the detailed patch
        const xa=Math.max(x,X0), xb=Math.min(x+F,X1), za=Math.max(z,Z0), zb=Math.min(z+F,Z1); [[x,xa,z,z+F],[xb,x+F,z,z+F],[xa,xb,z,za],[xa,xb,zb,z+F]].forEach(([a0,a1,b0,b1])=>{ if(a1-a0<1e-3||b1-b0<1e-3) return; quadF(Bg,HM.grass,[a0,grade(a0,b1),b1],[a1,grade(a1,b1),b1],[a1,grade(a1,b0),b0],[a0,grade(a0,b0),b0],[0,1,0]); }); continue; }
      quadF(Bg,HM.grass,[x,grade(x,z+F),z+F],[x+F,grade(x+F,z+F),z+F],[x+F,grade(x+F,z),z],[x,grade(x,z),z],[0,1,0]); } }
  flush(Bg,group,{cast:false}); }

/* ---------- assembly: one group per level so the view can peel the house apart ---------- */
const houseG=new THREE.Group(); scene.add(houseG);
const HG={ L:new THREE.Group(), SL:new THREE.Group(), FL:new THREE.Group(), shell:new THREE.Group(), M:new THREE.Group(), FM:new THREE.Group(), MW:new THREE.Group(), MWc:new THREE.Group(), shellUp:new THREE.Group(), R:new THREE.Group(), T:new THREE.Group() };
Object.values(HG).forEach(g=>houseG.add(g));
function finishGroup(B,g){ flush(B,g); if(!LEAVES.length) return; const by=new Map(); LEAVES.forEach(o=>{ o.updateMatrixWorld(true); let l=by.get(o.material); if(!l){ l=[]; by.set(o.material,l); } l.push(o); });
  by.forEach((list,m)=>{ const mesh=new THREE.Mesh(mergeMeshes(list), m); mesh.castShadow=!m.userData.noShadow; mesh.receiveShadow=true; mesh.raycast=()=>{}; if(m.transparent) mesh.renderOrder=3; g.add(mesh); list.forEach(o=>{ if(o.geometry&&!geoCacheHas(o.geometry)) o.geometry.dispose(); }); }); LEAVES=[]; }
function geoCacheHas(g){ for(const v of geoCache.values()) if(v===g) return true; return false; }
let HOUSE_LABELS=[];
function labelPoint(p){ const bb=bboxOf(p); let best=[bb.cx,bb.cz], bd=-1; const step=Math.max(.5,Math.min(bb.w,bb.d)/12);
  for(let x=bb.x0+step/2;x<bb.x1;x+=step) for(let z=bb.z0+step/2;z<bb.z1;z+=step){ if(!inPoly(x,z,p)) continue; let d=1e9; for(let i=0;i<p.length;i++){ const a=p[i], b=p[(i+1)%p.length], dx=b[0]-a[0], dz=b[1]-a[1], l2=dx*dx+dz*dz||1, t=clamp(((x-a[0])*dx+(z-a[1])*dz)/l2,0,1); d=Math.min(d,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)); } d-=Math.hypot(x-bb.cx,z-bb.cz)*.08; if(d>bd){ bd=d; best=[x,z]; } }
  return best; }
function buildHouse(){ Object.values(HG).forEach(g=>{ if(g===HG.shell||g===HG.shellUp) return; g.traverse(o=>{ if(o.geometry&&!geoCacheHas(o.geometry)) o.geometry.dispose(); }); g.clear(); });
  const Bl=Bk(), Bsl=Bk(), Bm=Bk(), Br=Bk(), Bt=Bk();
  BASE_B=Bk(); buildWalls(HL.L,Bl); buildOpenings(HL.L,Bl); flush(BASE_B,HG.L); flush(Bl,HG.L,{pick:true}); buildFloors(HL.L,Bl); finishGroup(Bl,HG.L);
  { const Bw=Bk(); BASE_B=Bk(); buildWalls(HL.M,Bw); buildOpenings(HL.M,Bw); flush(BASE_B,HG.M); BASE_B=null; lowerUps(Bw); flush(Bw,HG.MW,{pick:true}); finishGroup(Bw,HG.MW);
    CUTM=YM+8.6; const Bc=Bk(); buildWalls(HL.M,Bc); buildOpenings(HL.M,Bc); flush(Bc,HG.MWc,{pick:true}); finishGroup(Bc,HG.MWc); CUTM=null; }
  buildFloors(HL.M,Bm);
  buildDecks(Bm); buildSite(Bsl,Bm); buildStairs(s=>s.n==='entry'?Bt:s.n==='spa'?Bsl:s.lvl==='main'?Bm:Bl);
  finishGroup(Bm,HG.M); flush(Bl,HG.L); finishGroup(Bsl,HG.SL);
  buildRoofs(Br); flush(Br,HG.R); flush(Bt,HG.T); buildTerrain(HG.T); buildFixtures();
  clearLabels('house'); HOUSE_LABELS=[]; ['L','M'].forEach(k=>[...HL[k].rooms].sort((a,b)=>polyArea(b.p)-polyArea(a.p)).forEach(r=>{ if(r.nf||/^(Closet|Linen|Coats|WC|Refuse|Stair|Vestibule)$/.test(r.n)&&!r.u) return; const [x,z]=labelPoint(r.p), L=addLabel('house', r.n, new THREE.Vector3(x,HL[k].y+r.dy,z), 'room', ['plan']); L.lvl=k; HOUSE_LABELS.push(L); }));
  houseG.updateMatrixWorld(true); applyFocusVisibility(); }
/* the theater's own outside walls, rebuilt with the room so they follow its dimensions; the theater draws the inside faces */
function buildShell(){ [HG.shell,HG.shellUp].forEach(g=>{ g.traverse(o=>{ if(o.geometry) o.geometry.dispose(); }); g.clear(); }); SHELL=[]; if(!POLY.length) return;
  const B=Bk(), Bu=Bk(), top=P.ceil, west=EDGES.find(e=>Math.abs(e.a[0])<1e-6&&Math.abs(e.b[0])<1e-6), gaps=west?doorsOf(P).map(d=>[d.z0,d.z0+DOOR_W]).sort((a,b)=>a[0]-b[0]):[];
  const face=(sg,p)=>{ if(sg===0) return inPoly(p[0],p[1],POLY)?null:roomAt(HL.L,p[0],p[1])||(west&&Math.abs(p[0]-west.a[0])<1.5&&gaps.some(([g0,g1])=>p[1]>g0-.5&&p[1]<g1+.5))?HM.paint:HM.stone; /* ends: painted only at a doorway or inside a room */
    if(inPoly(p[0],p[1],POLY)) return null; return roomAt(HL.L,p[0],p[1])?HM.paint:HM.stone; };
  const thick=e=>{ if(e===west) return .43; const mx=(e.a[0]+e.b[0])/2-e.n[0]*.8, mz=(e.a[1]+e.b[1])/2-e.n[1]*.8; return roomAt(HL.L,mx,mz)?.5:1.0; };
  const piece=(x0,z0,x1,z1,y0,y1,opt)=>{ prism(B,HL.L,x0,z0,x1,z1,y0,y1,HM.stone,Object.assign({face},opt||{})); };
  EDGES.forEach(e=>{ const t=thick(e), ox=-e.n[0]*t, oz=-e.n[1]*t, xs=[e.a[0],e.b[0],e.a[0]+ox,e.b[0]+ox], zs=[e.a[1],e.b[1],e.a[1]+oz,e.b[1]+oz], r={x0:Math.min(...xs),x1:Math.max(...xs),z0:Math.min(...zs),z1:Math.max(...zs)}; SHELL.push(r);
    if(e===west){ let z=r.z0; gaps.forEach(([g0,g1])=>{ if(g0>z) piece(r.x0,z,r.x1,g0,0,top); piece(r.x0,g0,r.x1,g1,DOOR_H,top,{bot:HM.paint}); hpoly(B,HM.wood,[[r.x0,g0],[r.x1,g0],[r.x1,g1],[r.x0,g1]],.005,1); z=g1; }); if(z<r.z1) piece(r.x0,z,r.x1,r.z1,0,top); }
    else piece(r.x0,r.z0,r.x1,r.z1,0,top); });
  POLY.forEach((v,i)=>{ const ein=EDGES.find(e=>e.b===v), eout=EDGES.find(e=>e.a===v); if(!ein||!eout) return; const ti=thick(ein), to=thick(eout), c=[v[0]-(ein.n[0]*ti+eout.n[0]*to), v[1]-(ein.n[1]*ti+eout.n[1]*to)];
    if(inPoly(v[0]+(ein.n[0]-eout.n[0])*.05, v[1]+(ein.n[1]-eout.n[1])*.05, POLY)) return; /* only outside corners need filling */ const r={x0:Math.min(v[0],c[0]),x1:Math.max(v[0],c[0]),z0:Math.min(v[1],c[1]),z1:Math.max(v[1],c[1])}; if(r.x1-r.x0<.01||r.z1-r.z0<.01) return; SHELL.push(r); piece(r.x0,r.z0,r.x1,r.z1,0,top); });
  { const x0=sX(40.2), x1=sX(42.6), z=SHELL.reduce((m,r)=>r.x0<=x0+.1&&r.x1>=x1-.1&&r.z1>sZ(117)?Math.max(m,r.z1):m,-1e9); if(z>-1e8){ const y0=4.9, y1=9.25, f=.16, zz=z+.02;
      quadF(B,HM.firebox,[x0,y0,zz],[x1,y0,zz],[x1,y1,zz],[x0,y1,zz],[0,0,1]); quadF(B,HM.glass,[x0,y0,zz+.03],[x1,y0,zz+.03],[x1,y1,zz+.03],[x0,y1,zz+.03],[0,0,1]);
      [[x0,y0,x0+f,y1],[x1-f,y0,x1,y1],[x0,y0,x1,y0+f],[x0,y1-f,x1,y1],[(x0+x1)/2-.06,y0,(x0+x1)/2+.06,y1]].forEach(([a,b,c,d])=>hbox(B,HM.frame,a,b,zz,c,d,zz+.12)); hbox(B,HM.beam,x0-.6,y1+.05,zz,x1+.6,y1+.75,zz+.5); } } // egress window 43b, timber lintel
  /* above the theater ceiling, wherever the main level does not sit on it, the stone walls rise (corners and ends too) to a cap, or to the deck over them */
  const DK=HOUSE.decks.map(d=>({p:d.poly.map(([X,Z])=>[sX(X),sZ(Z)]),y:d.y})), under=(x,z)=>roomAt(HL.M,x,z)||wallAt(HL.M,x,z)||openAt(HL.M,x,z), capY=YM+2;
  SHELL.forEach(r=>{ const ax=(r.x1-r.x0)>=(r.z1-r.z0), a0=ax?r.x0:r.z0, a1=ax?r.x1:r.z1, b0=ax?r.z0:r.x0, b1=ax?r.z1:r.x1, n=Math.max(1,Math.ceil(a1-a0));
    const upTop=a=>{ const pts=[.5,.02,.98].map(f=>{ const b=b0+(b1-b0)*f; return ax?[a,b]:[b,a]; }); if(pts.some(p=>under(...p))) return null; const ds=pts.map(p=>DK.find(d=>inPoly(p[0],p[1],d.p))); return ds.every(d=>d)?Math.min(...ds.map(d=>d.y-1)):capY; };
    let s0=null; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*Math.min(i+.5,n)/n, on=i<n&&upTop(a)!=null; if(on&&s0==null) s0=a0+(a1-a0)*i/n;
      if(!on&&s0!=null){ const s1=a0+(a1-a0)*i/n; prism(Bu,HL.L,...(ax?[s0,r.z0,s1,r.z1]:[r.x0,s0,r.x1,s1]),top,(x,z)=>{ const t=upTop(ax?x:z); return t==null?top:t; },HM.stone,{face:(sg,p)=>sg!==0&&inPoly(p[0],p[1],POLY)?null:HM.stone, cap:null}); s0=null; } } });
  /* and the top of the theater wherever nothing of the main level or a deck sits over it (the strip south of the dog run) is capped */
  { const all=[...POLY,...SHELL.flatMap(r=>[[r.x0,r.z0],[r.x1,r.z1]])], bb=bboxOf(all), y=capY, inBB=(v,a,b)=>v>=a-1e-6&&v<=b+1e-6;
    const open=(x,z)=>(inPoly(x,z,POLY)||SHELL.some(r=>inRect(r,x,z)))&&!under(x,z)&&!DK.some(d=>inPoly(x,z,d.p));
    /* cells on a grid made from every edge nearby (theater, shell, decks, main-level rooms and walls), so the cap meets them exactly */
    const ex=[], ez=[]; all.forEach(([x,z])=>{ ex.push(x); ez.push(z); }); DK.forEach(d=>d.p.forEach(([x,z])=>{ ex.push(x); ez.push(z); }));
    ['rooms','walls','opens'].forEach(k=>HL.M[k].forEach(o=>{ if(o.p) o.p.forEach(([x,z])=>{ ex.push(x); ez.push(z); }); else { ex.push(o.x0,o.x1); ez.push(o.z0,o.z1); } }));
    const G=(a,lo,hi)=>[...new Set(a.filter(v=>inBB(v,lo,hi)).concat([lo,hi]).map(v=>Math.round(v*1e4)/1e4))].sort((p,q)=>p-q), X=G(ex,bb.x0,bb.x1), Z=G(ez,bb.z0,bb.z1);
    for(let j=0;j<Z.length-1;j++){ const z0=Z[j], z1=Z[j+1]; if(z1-z0<1e-4) continue; let x0=null; for(let i=0;i<X.length;i++){ const on=i<X.length-1&&X[i+1]-X[i]>1e-4&&open((X[i]+X[i+1])/2,(z0+z1)/2);
        if(on&&x0==null) x0=X[i]; if(!on&&x0!=null){ quadF(Bu,HM.fascia,[x0,y,z0],[X[i],y,z0],[X[i],y,z1],[x0,y,z1],[0,1,0]); x0=null; } } } }
  flush(B,HG.shell,{pick:true}); flush(Bu,HG.shellUp); }

/* ---------- which parts show: the whole house, one level, or the theater on its own ---------- */
const FOCI=[['house','Outside'],['main','Main'],['lower','Lower'],['theater','Theater']];
const FOCUS_KEY='tuhaye-focus';
let FOCUS=(()=>{ try{ const f=localStorage.getItem(FOCUS_KEY); if(FOCI.some(x=>x[0]===f)) return f; }catch(e){} return 'house'; })();
/* time of day outside the theater: the light button cycles midday, evening and dusk (the theater keeps Bright, Dim and Movie) */
const DAYS={ bright:{label:'Midday', dir:[.5,.64,.58], sun:'#fff3e0', ph:2.8, fast:1.75, h:[.62,.66], sky:['#3e79c6','#b3cbe0','#a9a493'], hs:'#d9e2ea', hg:'#d6d1c8', exp:1.05, env:['#3f74c4','#a9c6e6','#e8eef2','#8d8a7c','#4a4a40'], disc:[.62,.2,18]},
  dim:{label:'Evening', dir:[.78,.3,.55], sun:'#ffc98f', ph:2.4, fast:1.5, h:[.42,.5], sky:['#4f73b0','#e8c39a','#8f8775'], hs:'#c9cfe0', hg:'#a89a86', exp:1.1, env:['#4a6aa8','#d9b48c','#f0d3ac','#7a6f60','#3d3a33'], disc:[.75,.38,14]},
  movie:{label:'Dusk', dir:[.82,.1,.5], sun:'#ff9a62', ph:1.1, fast:.8, h:[.2,.3], sky:['#1e2c55','#d4876a','#4f4a46'], hs:'#7f8db5', hg:'#5e5650', exp:1.25, env:['#1c2850','#9a6f86','#e59a6d','#4a4440','#24221f'], disc:[.8,.47,9]} };
const dayOf=()=>DAYS[S.light]||DAYS.bright;
const SKY_R=420, sky=(()=>{ const g=new THREE.SphereGeometry(SKY_R,32,16);
  g.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*3),3)); const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true, side:THREE.BackSide, fog:false})); m.raycast=()=>{}; m.renderOrder=-5; m.frustumCulled=false; m.onBeforeRender=(r,s,cam)=>{ m.position.copy(cam.position); m.updateMatrixWorld(); }; m.castShadow=m.receiveShadow=false; scene.add(m); return m; })();
let SKY_PAINTED=null;
function paintSky(){ const D=dayOf(); if(SKY_PAINTED===D) return; SKY_PAINTED=D; const [top,hor,low]=D.sky.map(col), tmp=new THREE.Color(), g=sky.geometry, p=g.attributes.position, c=g.attributes.color, sd=new THREE.Vector3(...D.dir).normalize(), glow=col(D.sun);
  for(let i=0;i<p.count;i++){ const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)).normalize(), y=v.y; if(y>=0) tmp.copy(hor).lerp(top,Math.pow(y,.6)); else tmp.copy(hor).lerp(low,Math.min(1,-y*4));
    const a=Math.max(0,v.dot(sd)); tmp.lerp(glow,Math.pow(a,12)*.55); c.setXYZ(i,tmp.r,tmp.g,tmp.b); } c.needsUpdate=true; }
function levelsShown(){ const walkAll=mode==='walk'; return { R:walkAll||FOCUS==='house', M:walkAll||FOCUS==='house'||FOCUS==='main', T:walkAll||FOCUS==='house'||FOCUS==='main' }; }
function applyFocusVisibility(){ const v=levelsShown(); HG.R.visible=v.R; HG.M.visible=v.M; HG.FM.visible=v.M; HG.MW.visible=v.M&&v.R; HG.MWc.visible=v.M&&!v.R; HG.shellUp.visible=v.M; HG.T.visible=v.T; sky.visible=mode!=='plan'&&v.R;
  LABELS.forEach(L=>{ if(L.group==='room') L.hidden=FOCUS!=='theater'; });
  if(typeof groups!=='undefined'){ groups.forEach((g,id)=>{ const it=byId(id); if(it) g.visible=itemShown(it); }); if(selId&&byId(selId)&&!itemShown(byId(selId))) select(null); }
  HOUSE_LABELS.forEach(L=>{ L.hidden=L.lvl==='L'?(v.M&&mode==='plan'&&FOCUS!=='lower'&&FOCUS!=='theater'):!v.M||(mode==='plan'&&v.R); }); dirty(true); }
function focusPts(){ const pts=[], add=(p,y0,y1)=>p.forEach(([x,z])=>{ pts.push(new THREE.Vector3(x,y0,z), new THREE.Vector3(x,y1,z)); });
  if(FOCUS==='theater'){ add(POLY,0,P.ceil); return pts; }
  if(FOCUS==='lower'){ HL.L.rooms.forEach(r=>add(r.p,0,CUT)); add(POLY,0,CUT); HOUSE.ter.forEach(t=>add(t.poly.map(([X,Z])=>[sX(X),sZ(Z)]),t.y,t.y)); return pts; }
  HL.M.rooms.forEach(r=>add(r.p,YM,FOCUS==='main'?YM+11:YM+15)); HOUSE.decks.forEach(d=>add(d.poly.map(([X,Z])=>[sX(X),sZ(Z)]),d.y,d.y)); if(FOCUS==='house') ROOFS.forEach(r=>add([[r.x0,r.z0],[r.x1,r.z1]],0,r.top(r.x0,r.z0)));
  return pts; }
function focusBB(){ const pts=focusPts(); let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9; pts.forEach(p=>{ x0=Math.min(x0,p.x); x1=Math.max(x1,p.x); z0=Math.min(z0,p.z); z1=Math.max(z1,p.z); }); return {x0,x1,z0,z1,cx:(x0+x1)/2,cz:(z0+z1)/2,w:x1-x0,d:z1-z0,pts}; }
/* the light and reflections follow where you are: the theater keeps its own lighting presets, everywhere else is daylight */
let ENVK=null;
function envKey(){ if(mode==='walk') return (walk.y<CUT&&POLY.length&&inPoly(walk.x,walk.z,POLY))?'theater':'house'; return FOCUS==='theater'?'theater':'house'; }
function placeSun(){ if((ENVK||envKey())==='theater'){ const bb=bboxOf(POLY); sun.position.set(bb.cx-7, 60, bb.cz+9); sun.target.position.set(bb.cx,0,bb.cz); const sc=sun.shadow.camera, R=Math.max(bb.w,bb.d)/2+4; sc.left=-R; sc.right=R; sc.top=R; sc.bottom=-R; sc.near=10; sc.far=120; sc.updateProjectionMatrix(); return; }
  const c=new THREE.Vector3(sX(50),8,sZ(58)); sun.position.copy(c).addScaledVector(new THREE.Vector3(...dayOf().dir).normalize(),160); sun.target.position.copy(c); const sc=sun.shadow.camera, R=92; sc.left=-R; sc.right=R; sc.top=R; sc.bottom=-R; sc.near=40; sc.far=320; sc.updateProjectionMatrix(); }
function syncEnv(force){ const k=envKey(); if(k===ENVK&&!force) return false; ENVK=k; placeSun(); PROBE.want=k==='theater'; applyLights(); return true; }
const SKY_ENV={};
function skyEnv(){ const D=dayOf(); if(SKY_ENV[D.label]) return SKY_ENV[D.label]; const W=512,H=256, [c,g]=cnv(W,H), gr=g.createLinearGradient(0,0,0,H), e=D.env; gr.addColorStop(0,e[0]); gr.addColorStop(.42,e[1]); gr.addColorStop(.5,e[2]); gr.addColorStop(.53,e[3]); gr.addColorStop(1,e[4]); g.fillStyle=gr; g.fillRect(0,0,W,H);
  const sx=W*D.disc[0], sy=H*D.disc[1], rg=g.createRadialGradient(sx,sy,1,sx,sy,40); rg.addColorStop(0,'rgba(255,250,235,1)'); rg.addColorStop(.3,'rgba(255,240,210,.5)'); rg.addColorStop(1,'rgba(255,240,210,0)'); g.fillStyle=rg; g.fillRect(0,0,W,H);
  const d=g.getImageData(0,0,W,H).data, a=new Uint16Array(W*H*4), lin=v=>{ v/=255; return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4); }, one=THREE.DataUtils.toHalfFloat(1);
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=(y*W+x)*4, o=((H-1-y)*W+x)*4, boost=(Math.hypot(x-sx,y-sy)<6)?D.disc[2]:1; a[o]=THREE.DataUtils.toHalfFloat(lin(d[i])*boost); a[o+1]=THREE.DataUtils.toHalfFloat(lin(d[i+1])*boost); a[o+2]=THREE.DataUtils.toHalfFloat(lin(d[i+2])*boost); a[o+3]=one; }
  const t=new THREE.DataTexture(a,W,H,THREE.RGBAFormat,THREE.HalfFloatType); t.mapping=THREE.EquirectangularReflectionMapping; t.minFilter=t.magFilter=THREE.LinearFilter; t.needsUpdate=true;
  const pm=new THREE.PMREMGenerator(renderer); SKY_ENV[D.label]=pm.fromEquirectangular(t).texture; pm.dispose(); t.dispose(); return SKY_ENV[D.label]; }

/* ---------- walking anywhere: every floor, stair, deck and doorway knows its height ---------- */
const WALK=[];
const rectP=(x0,z0,x1,z1)=>[[x0,z0],[x1,z0],[x1,z1],[x0,z1]];
function buildWalk(){ WALK.length=0; const add=(p,y,o)=>WALK.push(Object.assign({p,y,bb:bboxOf(p)},o||{}));
  ['L','M'].forEach(k=>{ const L=HL[k]; L.rooms.forEach(r=>{ if(!r.nf&&r.n!=='Stair') add(r.p,L.y+r.dy); });
    L.opens.forEach(o=>{ if(PASSABLE.has(o.t)) add(rectP(o.x0,o.z0,o.x1,o.z1),voidsOf(L,o).fl); }); });
  if(POLY.length){ add(POLY,0,{theater:true}); doorsOf(P).forEach(d=>add(rectP(-.5,d.z0,.02,d.z0+DOOR_W),0)); }
  HOUSE.stairs.forEach(s=>{ if(s.land){ const [X0,X1,Z0,Z1]=s.land; add(rectP(sX(X0),sZ(Z0),sX(X1),sZ(Z1)),s.y); return; }
    const ax=s.ax==='x', A=v=>ax?sX(v):sZ(v), Bv=v=>ax?sZ(v):sX(v), a0=A(s.a0), a1=A(s.a1), b0=Bv(s.b[0]), b1=Bv(s.b[1]), lo=Math.min(a0,a1), hi=Math.max(a0,a1);
    add(ax?rectP(lo-.25,b0,hi+.25,b1):rectP(b0,lo-.25,b1,hi+.25),0,{ramp:{ax,a0,a1,y0:s.y0,y1:s.y1}}); }); // a little past each end so the step onto the floor is seamless
  HOUSE.decks.forEach(d=>add(d.poly.map(([X,Z])=>[sX(X),sZ(Z)]),d.y)); HOUSE.ter.forEach(t=>add(t.poly.map(([X,Z])=>[sX(X),sZ(Z)]),t.y));
  add(HOUSE.drive.map(([X,Z])=>[sX(X),sZ(Z)]),0,{grade:true}); add(rectP(sX(55.6),sZ(58.6),sX(62),sZ(83.5)),0,{grade:true}); }
function regionY(r,x,z){ if(r.ramp){ const q=r.ramp, t=clamp(((q.ax?x:z)-q.a0)/(q.a1-q.a0),0,1); return q.y0+(q.y1-q.y0)*t; } return r.grade?grade(x,z)+.06:r.y; }
/* the floor under a point, near the height you are walking at (stairs win over the room they sit in) */
function floorAt(x,z,feet){ let best=null, ramp=false; if(onLawn(x,z)){ const y=grade(x,z)+.03; if(Math.abs(y-feet)<=1.35) best=y; } for(const r of WALK){ if(x<r.bb.x0||x>r.bb.x1||z<r.bb.z0||z>r.bb.z1||!inPoly(x,z,r.p)) continue; const y=regionY(r,x,z); if(Math.abs(y-feet)>1.35) continue;
    if(r.ramp&&!ramp){ best=y; ramp=true; continue; } if(ramp&&!r.ramp) continue; if(best==null||Math.abs(y-feet)<Math.abs(best-feet)) best=y; } return best; }
const WALK_STARTS={ house:{X:68,Z:75,tX:47,tZ:62}, main:{X:38.2,Z:62.3,tX:20,tZ:55}, lower:{X:37.6,Z:46.0,tX:24,tZ:60} };
function houseWalkStart(f){ const s=WALK_STARTS[f], x=sX(s.X), z=sZ(s.Z); let feet=f==='house'?grade(x,z)+.06:f==='main'?YM:0; const fl=floorAt(x,z,feet); if(fl!=null) feet=fl; return {x,z,feet,yaw:Math.atan2(-(sX(s.tX)-x),-(sZ(s.tZ)-z))}; }
/* level picker + title */
function levelArea(k){ return Math.round(HL[k].rooms.filter(r=>!r.nf&&!/Garage|Refuse/.test(r.n)).reduce((a,r)=>a+polyArea(r.p),0)+(k==='L'&&POLY.length?polyArea(POLY):0)); }
const PROJECT='Ridgeline Residence';
function updateTitle(){ const sub=$('#sub'), fmt=n=>n.toLocaleString('en-US'), aM=levelArea('M'), aL=levelArea('L'), aT=Math.round(polyArea(POLY));
  if(FOCUS==='theater') sub.innerHTML=`Theater · ${ftin(P.W)} × ${ftin(P.thD+P.mD)}<span class="wide"> · ${ftShort(P.ceil)} ceiling, golf bay and wet bar</span>`;
  else if(FOCUS==='main') sub.innerHTML=`Main level · ${fmt(aM)} ft²<span class="wide"> · ceilings vaulted to ${ftShort(15)}, 3-car garage</span>`;
  else if(FOCUS==='lower') sub.innerHTML=`Lower level · ${fmt(aL)} ft²<span class="wide"> · 9′ ceilings, theater, guest rooms</span>`;
  else sub.innerHTML=`${fmt(aM+aL)} ft² · two levels<span class="wide"> · drawn to scale from the architectural plans</span>`;
  const fa={house:`${fmt(aM+aL)} ft²`, main:`${fmt(aM)} ft²`, lower:`${fmt(aL)} ft²`, theater:`${fmt(aT)} ft²`}; Object.entries(fa).forEach(([k,v])=>{ const el=$('#fa-'+k); if(el) el.textContent=v; }); }
function setFocus(f){ if(!FOCI.some(x=>x[0]===f)) return; FOCUS=f; try{ localStorage.setItem(FOCUS_KEY,f); }catch(e){}
  document.querySelectorAll('#floors button').forEach(b=>{ b.classList.toggle('on',b.dataset.f===f); b.setAttribute('aria-selected',b.dataset.f===f); }); updateTitle(); applyFocusVisibility(); syncEnv();
  inert=null; if(mode==='orbit') fitOrbit(true); else if(mode==='plan'){ fitPlan(); planFitted=FOCUS; } if(mode==='walk'){ startWalk(); wk.started=true; } else wk.started=false; dirty(true); } // Walk after picking a level starts on that level

/* ---------- built-in fixtures (plumbing, kitchen, laundry, built-ins), modelled like the furniture: local space, footprint centred, front faces +z ---------- */
let MIRROR=null, TUBIN=null;
const ceramic=()=>mat('stone','#f3f2ee');
function bToilet(it){ const g=new THREE.Group(), c=ceramic(), w=it.w, d=it.d, met=mat('metal','#c9ccd0');
  add(g, rboxG(w*.9,1.1,.6,.08,.01), c, 0,1.93,-d/2+.32); add(g, rboxG(w*.96,.08,.66,.03), c, 0,2.52,-d/2+.33);
  const ped=add(g, cylG(.3,.38,1.0,28), c, 0,.5,-.15); ped.scale.set(1,1,1.35);
  const bowl=add(g, sphG(.5), c, 0,1.1,.12); bowl.scale.set(w*.68,.62,d*.42);
  const seat=add(g, torusG(.5,.08), mat('plain','#f0f0ec'), 0,1.44,.12); seat.rotation.x=Math.PI/2; seat.scale.set(w*.66,d*.4,1);
  add(g, boxG(.22,.03,.05), met, -w*.28,2.22,-d/2+.63); return g; }
function bVanity(it){ const g=new THREE.Group(), {w,d,h}=it, body=mat('wood',it.color), dark=mat('plain','#111113'), met=mat('metal','#b9bcc0'), top=topMat(it.top||'quartz'), th=.13, tk=.33, bh=h-th-tk;
  if(!MIRROR){ MIRROR=unify(new THREE.MeshStandardMaterial({color:col('#e3e9ec'), metalness:1, roughness:.035})); MIRROR.userData.env=1.6; }
  add(g, boxG(w-.04,tk,d-.25), dark, 0,tk/2,-.12); add(g, boxG(w,bh,d), body, 0,tk+bh/2,0);
  cabinetFace(g,-w/2,w/2,-d/2,d/2,[0,1],tk,bh,dark,met,body); add(g, rboxG(w+.04,th,d+.04,.02), top, 0,h-th/2,0); add(g, boxG(w,.33,.06), top, 0,h+.16,-d/2+.03);
  const sinks=it.sinks||[w/2], mw=Math.min(2.6,w/sinks.length-.5);
  sinks.forEach(o=>{ const x=-w/2+o; add(g, rboxG(1.4,.02,1.0,.009), ceramic(), x,h+.006,.08,false); add(g, rboxG(1.22,.025,.84,.008), mat('plain','#cfcfca'), x,h+.012,.08,false);
    add(g, cylG(.035,.04,.62,12), met, x,h+.31,-d/2+.24); const sp=add(g, cylG(.024,.024,.42,10), met, x,h+.6,-d/2+.42); sp.rotation.x=Math.PI/2;
    add(g, boxG(mw+.08,3.08,.05), mat('metal','#2a2b2e'), x,h+2.55,-d/2+.025,false); add(g, boxG(mw,3.0,.02), MIRROR, x,h+2.55,-d/2+.06,false); });
  return g; }
function bTub(it){ const g=new THREE.Group(), {w,d,h}=it, c=ceramic(), met=mat('metal','#b9bcc0');
  if(!TUBIN){ TUBIN=unify(new THREE.MeshPhysicalMaterial({color:col('#f1f0ec'), roughness:.25, clearcoat:.8, clearcoatRoughness:.06, side:THREE.BackSide})); TUBIN.userData.env=1; }
  if(it.style==='deck'){ const deck=mat('stone','#d6d0c4'); add(g, boxG(w,h,d), deck, 0,h/2,0); add(g, rboxG(w-.7,.04,d-.75,.25,.0), mat('plain','#ecebe6'), 0,h+.005,.06,false);
    add(g, cylG(.04,.05,.55,12), met, 0,h+.27,-d/2+.22); const sp=add(g, cylG(.03,.03,.45,10), met, 0,h+.52,-d/2+.42); sp.rotation.x=Math.PI/2; return g; }
  const o=add(g, cylG(.5,.44,h,48,true), c, 0,h/2,0); o.scale.set(w,1,d); const r=add(g, torusG(.5,.035), c, 0,h,0); r.rotation.x=Math.PI/2; r.scale.set(w*.985,d*.985,1);
  const i=add(g, cylG(.47,.36,h-.15,48,true), TUBIN, 0,h/2+.07,0,false); i.scale.set(w,1,d); const b=add(g, cylG(.36,.36,.02,40), c, 0,.16,0,false); b.scale.set(w,1,d);
  add(g, cylG(.035,.035,3.0,10), met, w/2+.35,1.5,0); const sp=add(g, cylG(.03,.03,.5,10), met, w/2+.15,2.98,0); sp.rotation.z=Math.PI/2; return g; }
function bRange(it){ const g=new THREE.Group(), {w,d,h}=it, st=mat('metal','#c4c7cb'), dark=mat('plain','#111113'), iron=mat('plain','#1c1c1d');
  add(g, boxG(w,h-.08,d), st, 0,(h-.08)/2,0); add(g, boxG(w,.06,d), dark, 0,h-.05,0);
  for(let i=0;i<3;i++) for(let j=0;j<2;j++){ const x=-w/2+w*(i+.5)/3, z=-d/2+.15+(d-.3)*(j+.5)/2; add(g, boxG(w/3-.1,.05,(d-.3)/2-.08), iron, x,h-.01,z); add(g, cylG(.11,.12,.04,16), iron, x,h+.02,z); }
  const n=w>3.4?2:1; for(let k=0;k<n;k++){ const ow=w/n-.12, x=-w/2+w*(k+.5)/n; add(g, boxG(ow,h*.62,.05), st, x,h*.4,d/2+.01); add(g, boxG(ow*.74,h*.3,.02), M.glass, x,h*.44,d/2+.045,false); const hb=add(g, cylG(.03,.03,ow*.8,10), st, x,h*.76,d/2+.13); hb.rotation.z=Math.PI/2; }
  for(let i=0;i<6;i++){ const k=add(g, cylG(.065,.065,.07,14), dark, -w/2+w*(i+.5)/6,h*.88,d/2+.04); k.rotation.x=Math.PI/2; }
  const hy=5.6, top=Math.max(hy+1.3,(it.hoodTop||8.6)); add(g, boxG(w+.2,.9,d*.95), st, 0,hy+.45,-d*.02); add(g, boxG(w*.5,top-hy-.9,d*.5), st, 0,hy+.9+(top-hy-.9)/2,-d*.22); return g; }
function bFridge48(it){ const g=new THREE.Group(), {w,d,h}=it, st=mat('metal','#c4c7cb'), dark=mat('plain','#111113');
  add(g, boxG(w,h,d-.08), st, 0,h/2,-.04); add(g, boxG(w-.04,h-.04,.04), dark, 0,h/2,d/2-.08,false);
  const fh=h*.3, uh=h-fh-.45; [[-1,1]].forEach(()=>{}); add(g, boxG(w/2-.02,uh,.06), st, -w/4,fh+.3+uh/2,d/2-.04); add(g, boxG(w/2-.02,uh,.06), st, w/4,fh+.3+uh/2,d/2-.04); add(g, boxG(w-.02,fh,.06), st, 0,.3+fh/2,d/2-.04);
  [-.06,.06].forEach(o=>add(g, cylG(.03,.03,uh*.7,10), st, o,fh+.3+uh/2,d/2+.1)); const hb=add(g, cylG(.03,.03,w*.6,10), st, 0,.3+fh-.25,d/2+.1); hb.rotation.z=Math.PI/2;
  add(g, boxG(w,.3,d-.1), dark, 0,.15,-.05); return g; }
function bWasher(it){ const g=new THREE.Group(), {w,d}=it, wh=mat('plain','#eeeeec'), dark=mat('plain','#17181a'), met=mat('metal','#b9bcc0'), units=it.stack?2:1, uh=3.1;
  for(let k=0;k<units;k++){ const y0=k*uh; add(g, rboxG(w,uh-.04,d,.05), wh, 0,y0+uh/2,0); add(g, boxG(w-.1,.42,.02), dark, 0,y0+uh-.3,d/2+.005,false);
    const ring=add(g, torusG(.62,.07), met, 0,y0+1.35,d/2+.04); ring.scale.set(1,1,.6); const gl=add(g, cylG(.58,.58,.04,32), dark, 0,y0+1.35,d/2+.01); gl.rotation.x=Math.PI/2;
    add(g, cylG(.08,.08,.05,16), met, w*.3,y0+uh-.3,d/2+.03).rotation.x=Math.PI/2; } return g; }
function bSlab(it){ const g=new THREE.Group(); add(g, rboxG(it.w,it.h,it.d,.02), topMat(it.top||'quartz'), 0,it.h/2,0); return g; }
function bSBench(it){ const g=new THREE.Group(); add(g, boxG(it.w,it.h,it.d), mat('stone','#d6d0c4'), 0,it.h/2,0); return g; }
function bLockers(it){ const g=new THREE.Group(), {w,d,h}=it, body=mat('wood',it.color), dark=mat('plain','#111113'), met=mat('metal','#b9bcc0'), seat=mat('wood','#b8956a'), n=it.n||5, t=.06;
  add(g, boxG(w,1.25,d), body, 0,.625,0); add(g, boxG(w+.04,.12,d+.04), seat, 0,1.31,0); add(g, boxG(w,h-1.37,t), body, 0,1.37+(h-1.37)/2,-d/2+t/2);
  for(let i=0;i<=n;i++){ const x=-w/2+t/2+(w-t)*i/n; add(g, boxG(t,h-1.37,d*.85), body, x,1.37+(h-1.37)/2,-d/2+d*.425); }
  add(g, boxG(w,t,d*.85), body, 0,6.0,-d/2+d*.425); add(g, boxG(w,t,d*.85), body, 0,h-t/2,-d/2+d*.425);
  for(let i=0;i<n;i++){ const x=-w/2+(w)*(i+.5)/n; add(g, boxG(w/n-.12,h-6.1,.05), body, x,6.05+(h-6.1)/2,-d/2+d*.85); [-.25,.25].forEach(o=>add(g, cylG(.03,.03,.25,8), met, x+o,4.9,-d/2+.2).rotation.x=Math.PI/2); }
  return g; }
function bTallCab(it){ const g=new THREE.Group(), {w,d,h}=it, body=mat('wood',it.color), dark=mat('plain','#111113'), met=mat('metal','#b9bcc0'), st=mat('metal','#c4c7cb');
  add(g, boxG(w,h,d-.05), body, 0,h/2,-.025); const n=Math.max(2,Math.round(w/2)), cw=w/n;
  for(let i=0;i<n;i++){ const x=-w/2+cw*(i+.5); [[.35,3.0],[3.08,6.6],[6.68,h-.05]].forEach(([a,b])=>{ add(g, boxG(cw-.05,b-a,.04), body, x,(a+b)/2,d/2-.01); }); add(g, cylG(.025,.025,.9,8), met, x+cw/2-.18,3.7,d/2+.07); }
  add(g, boxG(w,.33,.04), dark, 0,.165,d/2-.02);
  (it.ovens||[]).forEach(o=>{ const x=-w/2+o; [[2.9,4.75],[4.9,6.75]].forEach(([a,b])=>{ add(g, boxG(2.5,b-a,.08), st, x,(a+b)/2,d/2+.02); add(g, boxG(2.0,(b-a)*.5,.02), dark, x,(a+b)/2-.05,d/2+.07,false); const hb=add(g, cylG(.03,.03,2.0,10), st, x,b-.18,d/2+.16); hb.rotation.z=Math.PI/2; }); });
  (it.wine||[]).forEach(o=>{ const x=-w/2+o; add(g, boxG(2.0,2.7,.06), st, x,1.75,d/2+.02); add(g, boxG(1.8,2.5,.02), M.glass, x,1.75,d/2+.06,false); add(g, boxG(1.8,2.4,.02), M.fridgeIn, x,1.75,d/2-.1,false); });
  return g; }
function bBunk(it){ const g=new THREE.Group(), {w,d,h}=it, wood=mat('wood',it.color), dark=mat('plain','#111113'), met=mat('metal','#b9bcc0'), mat1=mat('fabric','#ecebe6'), duv=mat('fabric','#5e6b7c'), pil=mat('fabric','#e3ddd0');
  add(g, boxG(w,1.35,d), wood, 0,.675,0); for(let i=0;i<3;i++){ const x=-w/2+w*(i+.5)/3; add(g, boxG(w/3-.12,.95,.04), wood, x,.62,d/2+.01); add(g, boxG(.5,.05,.04), met, x,1.0,d/2+.05); }
  const bed=(y)=>{ add(g, rboxG(w-.3,.65,d-.4,.12,.03), mat1, 0,y+.33,-.05); add(g, rboxG(w-.25,.12,d-.3,.06,.02), duv, 0,y+.7,.0); [-1,1].forEach(s=>add(g, rboxG(1.8,.45,1.0,.2,.08), pil, -w/2+1.0+s*0, y+.85, s<0?-d/4:d/4)); };
  bed(1.35); add(g, boxG(w,.35,d), wood, 0,4.2,0); bed(4.38);
  add(g, boxG(w,h,.12), wood, 0,h/2,-d/2+.06); [-1,1].forEach(s=>add(g, boxG(.15,h,d), wood, s*(w/2-.075),h/2,0)); add(g, boxG(w*.65,.3,.08), wood, w*.12,5.6,d/2-.04); return g; }
function bSteps(it){ const g=new THREE.Group(), {w,d,h}=it, wood=mat('wood',it.color), n=it.n||4; for(let i=0;i<n;i++){ const y=h*(i+1)/n, dz=d*(n-i)/n; add(g, boxG(w,y,dz), wood, 0,y/2,-d/2+dz/2); } return g; }
/* beds for the catalog: upholstered frame, mattress, duvet and pillows */
function bBed(it){ const g=new THREE.Group(), {w,d,h}=it, fab=mat(kindOf(it),it.color), white=mat('fabric','#ecebe6'), duv=mat('fabric',it.duvet||'#d8d2c6'), pil=mat('fabric','#efece4'), leg=mat('wood','#2a1d14');
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>add(g, boxG(.15,.35,.15), leg, a*(w/2-.15),.175,b*(d/2-.15)));
  add(g, rboxG(w,.6,d,.08,.02), fab, 0,.65,0); add(g, rboxG(w+.15,h-.35,.38,.12,.03), fab, 0,.35+(h-.35)/2,-d/2+.19);
  add(g, rboxG(w-.2,.8,d-.55,.14,.04), white, 0,1.35,.12);
  { const fz=.12+(d-.55)/2+.05, dd=d*.64, dw=w-.1, cz=fz-dd/2; add(g, rboxG(dw,.12,dd,.05,.03), duv, 0,1.81,cz); // duvet over the top, falling over the sides and foot
    [-1,1].forEach(sg=>add(g, rboxG(.06,.62,dd,.03,0), duv, sg*(dw/2-.03),1.56,cz)); add(g, rboxG(dw,.62,.06,.03,0), duv, 0,1.56,fz-.03); } const np=w>4?2:1; for(let i=0;i<np;i++){ const x=np===1?0:(i?.9:-.9)*w/4; add(g, rboxG(Math.min(2.5,w/np-.3),.5,1.1,.22,.1), pil, x,2.0,-d/2+.95); } return g; }
/* the fixtures are part of the house, not the layout: built once into each level's group */
function buildFixtures(){ const tmp={FM:new THREE.Group(), FL:new THREE.Group()};
  (HOUSE.fix||[]).forEach(([type,X,Z,rot,fy,o])=>{ if(!TYPES[type]) return; const it=mk(type,sX(X),sZ(Z),rot,o||{}); it.fy=fy; if(type==='range') it.hoodTop=ceilFor(it.x,it.z,fy)-.02;
    const raw=TYPES[type].build(it); raw.position.set(it.x, fy+(it.elev||0), it.z); raw.rotation.y=rot*DEG; tmp[fy>=YM-1?'FM':'FL'].add(raw); });
  ['FM','FL'].forEach(k=>{ const g=mergeGroup(tmp[k]); g.traverse(m=>{ if(m.isMesh) m.raycast=()=>{}; }); [...g.children].forEach(m=>HG[k].add(m)); tmp[k].traverse(o=>{ if(o.geometry&&!geoCacheHas(o.geometry)) o.geometry.dispose(); }); }); } // one mesh per material per level

/* ---------- the house comes furnished the way the plans draw it; these are ordinary pieces, part of the layout, free to move ---------- */
const FM=YM, FD=YM-1/12;
const HOUSE_FURN=[
 // great room, games alcove
 ['sofa',24.4,51.9,0,FM,{w:96,color:'#c8bda9'}], ['sofa',18.7,58.0,90,FM,{w:84,color:'#c8bda9'}], ['sofa',32.2,57.2,-90,FM,{w:84,color:'#c8bda9'}],
 ['rug',25.4,57.4,0,FM,{w:156,d:120,color:'#bdb19b'}], ['coffee',25.4,57.4,0,FM,{w:54,d:30}], ['side',30.6,52.0,0,FM,{}], ['lamp',30.6,52.0,0,FM,{}],
 ['dining',43.0,52.6,0,FM,{w:42,d:42,color:'#262220'}], ['chair',43.0,50.9,0,FM,{}], ['chair',43.0,54.3,180,FM,{}], ['chair',41.4,52.6,90,FM,{}], ['chair',44.6,52.6,-90,FM,{}],
 // dining and kitchen
 ['dining',24.7,78.1,90,FM,{w:115,d:46}], ...[74.6,77.0,79.3,81.6].flatMap(z=>[['chair',22.3,z,90,FM,{}],['chair',27.1,z,-90,FM,{}]]), ['chair',24.7,73.1,0,FM,{}], ['chair',24.7,83.1,180,FM,{}],
 ...[75.6,77.6,79.6,81.6].map(z=>['stool',34.3,z,90,FM,{}]),
 // primary suite
 ['bed',24.3,16.1,0,FM,{w:80,d:84,color:'#8a8478'}], ['nightstand',19.6,13.3,0,FM,{}], ['nightstand',29.0,13.3,0,FM,{}],
 ['lounge',13.6,14.6,45,FM,{color:'#c8bda9',uph:'fabric'}], ['lounge',13.6,24.2,135,FM,{color:'#c8bda9',uph:'fabric'}], ['side',13.3,19.4,0,FM,{}],
 ['console',19.6,26.7,180,FM,{w:34,d:20,h:20}], ['console',29.15,26.7,180,FM,{w:34,d:20,h:20}],
 // bedroom #2
 ['bed',21.5,113.5,180,FM,{w:80,d:84,color:'#8a8478'}], ['nightstand',17.0,116.2,180,FM,{}], ['nightstand',25.9,116.2,180,FM,{}], ['dresser',13.9,101.9,0,FM,{w:56}], ['lounge',11.3,111.2,90,FM,{color:'#c8bda9',uph:'fabric'}],
 // covered dining (deck)
 ['dining',17.9,94.0,0,FD,{w:96,d:40,color:'#7a5a3e'}], ...[15.6,17.9,20.2].flatMap(x=>[['chair',x,92.4,0,FD,{color:'#3e4045'}],['chair',x,95.6,180,FD,{color:'#3e4045'}]]),
 // lower level: bedroom #3, bedroom #4, office
 ['bed',17.6,16.0,0,0,{w:80,d:84,color:'#8a8478'}], ['nightstand',12.9,13.3,0,0,{}], ['nightstand',22.3,13.3,0,0,{}],
 ['bed',29.6,81.1,-90,0,{w:80,d:84,color:'#8a8478'}], ['nightstand',32.1,76.6,-90,0,{}], ['nightstand',32.1,85.6,-90,0,{}],
 ['desk',28.0,29.4,180,0,{}], ['chair',28.0,31.3,180,0,{color:'#3e4045'}],
 // rec room and bar
 ['sectional',28.0,55.5,0,0,{shape:'L',w:120,d:115,seatD:40,color:'#5e6b7c'}], ['ottoman',25.2,57.8,0,0,{w:60,d:42,color:'#8a5530'}], ['armchair',19.6,57.6,90,0,{}], ['side',21.9,52.5,0,0,{}],
 ['tv',25.25,65.6,180,0,{diag:85,cy:62}],
 ['counter42',38.8,53.8,90,0,{w:89,d:24,over:'back',color:'#262220'}], ...[51.1,53.0,54.9,56.8].map(z=>['stool',37.2,z,90,0,{}]),
];
const theaterPoly=()=>POLY.length?POLY:roomPoly(P);
const isHouseItem=it=>fyOf(it)>.01||!inPoly(it.x,it.z,theaterPoly());
/* a layout with only theater furniture gets the rest of the house from the default layout (Layout 1), or the plan furniture if that has none */
function withHouse(list){ if(list.some(isHouseItem)) return list; let mx=Math.max(idSeq-1,0,...list.map(i=>i.id||0)); const keep=idSeq;
  let add=DEFAULT_LAYOUT.items.filter(isHouseItem).map(it=>JSON.parse(JSON.stringify(it))).filter(it=>TYPES[it.type]).map(normalize).filter(Boolean);
  if(!add.length) add=HOUSE_FURN.map(([t,X,Z,r,fy,o])=>{ if(!TYPES[t]) return null; const it=mk(t,sX(X),sZ(Z),r,o||{}); if(fy) it.fy=fy; return it; }).filter(Boolean);
  add.forEach(it=>it.id=++mx); idSeq=Math.max(keep,mx+1); resnapWallItems(add); return list.concat(add); }
