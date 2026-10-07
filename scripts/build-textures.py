# Builds the photo textures in tex/ from scanned CC0/CC-BY sources (see README "Credits").
#   python3 scripts/build-textures.py SRC_DIR      (SRC_DIR holds the downloads listed in scripts/fetch-assets.sh)
# Tinted textures (wood, fabric, leather, boards) are grayscale with a set mean, so the colour pickers still work.
# Normal maps are OpenGL style (green up) for textures loaded with flipY, like the procedural ones they replace.
import sys, os, numpy as np
from PIL import Image
SRC=sys.argv[1]; OUT=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'tex'); os.makedirs(OUT,exist_ok=True)
R=np.random.default_rng(7)
def load(p, mode='RGB'): return np.asarray(Image.open(os.path.join(SRC,p)).convert(mode)).astype(np.float32)/255.
def lum(a): return a[...,0]*.2126+a[...,1]*.7152+a[...,2]*.0722
def resize(a, w, h): 
    if a.ndim==2: return np.asarray(Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8)).resize((w,h),Image.LANCZOS)).astype(np.float32)/255.
    return np.asarray(Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8)).resize((w,h),Image.LANCZOS)).astype(np.float32)/255.
def nrm_dx_to_vec(a): v=a*2-1; v[...,1]*=-1; return v          # DirectX normal map -> vectors with +y = image up
def nrm_gl_to_vec(a): return a*2-1
def vec_to_img(v): v=v/np.linalg.norm(v,axis=-1,keepdims=True); return (np.clip(v*.5+.5,0,1)*255+.5).astype(np.uint8)
def save_gray(a, name, mean=None, sd=None, q=84):
    a=a.copy()
    if mean is not None:
        m, s=a.mean(), a.std(); a=(a-m)/(s+1e-6)*(sd if sd else s)+mean
    Image.fromarray((np.clip(a,0,1)*255+.5).astype(np.uint8),'L').save(os.path.join(OUT,name),quality=q,optimize=True,progressive=True); return a
def save_rgb(a, name, q=84): Image.fromarray((np.clip(a,0,1)*255+.5).astype(np.uint8)).save(os.path.join(OUT,name),quality=q,optimize=True,progressive=True)
def save_nrm(v, name, q=86): Image.fromarray(vec_to_img(v)).save(os.path.join(OUT,name),quality=q,optimize=True)
def wrap(a, ys, xs): return a[np.ix_(ys % a.shape[0], xs % a.shape[1])]
def height_normals(h, k):   # normals from a height field, wrapping at the edges (+y = image up)
    dx=(np.roll(h,-1,1)-np.roll(h,1,1))*k; dy=(np.roll(h,-1,0)-np.roll(h,1,0))*k
    return np.dstack([-dx, dy, np.ones_like(h)])
def combine(detail, groove, kd=1.0):  # detail normal vectors + groove normals from height
    v=np.dstack([detail[...,0]*kd+groove[...,0], detail[...,1]*kd+groove[...,1], np.ones(detail.shape[:2])]); return v

# ---------- scanned oak (ambientCG Wood049): 2048 px is about 1 m of board face ----------
oakC=load('o3d/WoodTexture/Wood049_Color.jpg'); oakN=nrm_dx_to_vec(load('o3d/WoodTexture/Wood049_NormalDX.jpg'))
oakL=lum(oakC)
def oak_at(ppf):  # oak luminance + normal resampled to ppf pixels per foot
    n=int(round(2048*ppf/(3.2808*624/624)/ (2048/3.2808)))  # pixels for the whole 1 m sample
    n=max(64,int(round(3.2808*ppf)))
    L=resize(oakL,n,n); N=np.dstack([resize(oakN[...,i]*.5+.5,n,n)*2-1 for i in range(3)]); return L, N

# 1. furniture wood: the oak sample itself (tileable), 1024 px = 3.28 ft
L=resize(oakL,1024,1024); save_gray(L,'wood.jpg',mean=.80,sd=.085)
N=np.dstack([resize(oakN[...,i]*.5+.5,1024,1024)*2-1 for i in range(3)]); N[...,:2]*=1.3; save_nrm(N,'wood_n.jpg')

# 2. boards: rows of planks cut from the oak scan, each with its own tone, joints and a small bevel
def boards(S, ft_w, ft_h, rows, lmin, lmax, gap_px, mean, sd, tone, name, src_ppf=None, vgap=None, end_joint=True, bevel=3, ns=1.0, joint=.18, nsize=None):
    ppf=S/ft_w; L0,N0=oak_at(src_ppf or ppf); H=int(round(S*ft_h/ft_w)); ph=H/rows
    alb=np.zeros((H,S),np.float32); det=np.zeros((H,S,3),np.float32); det[...,2]=1; hgt=np.zeros((H,S),np.float32)
    for row in range(rows):
        y0=int(round(row*ph)); y1=int(round((row+1)*ph)); x=R.uniform(0,S); tot=0.
        while tot<S-1:
            ln=R.uniform(lmin,lmax)*ppf
            if S-(tot+ln)<lmin*ppf*.8: ln=S-tot   # no slivers at the end of a row
            xa=x+tot; xs=np.arange(int(round(xa)), int(round(xa+ln))); ys=np.arange(y0, y1-(vgap if vgap is not None else gap_px))
            if len(xs)<2 or len(ys)<2: tot+=ln; continue
            sy=int(R.integers(0,L0.shape[0])); sx=int(R.integers(0,L0.shape[1])); flip=R.random()<.5
            cl=wrap(L0, ys-ys[0]+sy, (xs-xs[0])[::-1 if flip else 1]+sx); cn=wrap(N0, ys-ys[0]+sy, (xs-xs[0])[::-1 if flip else 1]+sx).copy()
            if flip: cn[...,0]*=-1
            t=1+R.normal(0,tone); cl=(cl-cl.mean())*R.uniform(.85,1.15)+cl.mean()*t
            # bevel: distance to the board edge
            yy=(ys-ys[0])[:,None]; xx=(xs-xs[0])[None,:]; e=np.minimum(np.minimum(yy, len(ys)-1-yy), np.minimum(xx, len(xs)-1-xx) if end_joint else 99)
            bev=np.clip(e/bevel,0,1)
            alb[np.ix_(ys % H, xs % S)]=cl*(.82+.18*bev); det[np.ix_(ys % H, xs % S)]=cn; hgt[np.ix_(ys % H, xs % S)]=bev
            tot+=ln
    g=height_normals(hgt, 1.2); v=combine(det,g,kd=ns)
    a=alb.copy(); m=hgt>0; a[m]=(a[m]-a[m].mean())/(a[m].std()+1e-6)*sd+mean; a[~m]=mean*joint
    if nsize: v=np.dstack([resize(np.clip(v[...,i]/np.linalg.norm(v,axis=-1)*.5+.5,0,1),nsize,int(round(nsize*H/S)))*2-1 for i in range(3)])
    save_gray(a,name+'.jpg'); save_nrm(v,name+'_n.jpg'); return a

# floors: 8 ft tile, 20 rows of 4.8" planks, 2 to 7 ft long (main level, lower level and the theater's hardwood)
boards(2048, 8, 8, 20, 2.0, 7.0, 1, .84, .065, .1, 'floor', bevel=2, joint=.5, nsize=1024)
# siding: 8 ft x 7.708 ft, 10 courses of 9.25" boards; deck: 17 rows over 7.8 ft; soffit: 13 rows over 7.85 ft
boards(1024, 8, 7.708, 10, 4.8, 8.0, 5, .69, .07, .06, 'siding', bevel=4)
boards(1024, 8, 7.8, 17, 3.0, 8.0, 6, .69, .075, .08, 'deck', bevel=3)
boards(1024, 8, 7.85, 13, 4.0, 8.0, 3, .75, .07, .05, 'soffit', bevel=3)
print('wood done')

def detail(img, n, sx, sy, w, h):   # a crop of a luminance image, wrapping
    return wrap(img, np.arange(h)+sy, np.arange(w)+sx)
# ---------- stone veneer: stacked ledgestone (6 ft tile), each stone's face from a scanned rock surface (Poly Haven rocky_trail, ambientCG Bricks076A) ----------
trail=lum(load('misc/rocky_trail.jpg')); plas=lum(load('o3d/PaintedPlasterTexture/PaintedPlaster017_Color.jpg'))[:, 2048:]
def z(a): return (a-a.mean())/(a.std()+1e-6)
rock=z(resize(plas,1024,512))*.7+z(np.tile(resize(trail,512,512),(1,2)))*.45   # stone grain: plaster mottle with a little fine aggregate
def ledgestone(S=1024):
    ppi=S/72; pal=np.array([[168,154,134],[143,134,118],[181,166,142],[125,116,104],[156,143,122],[194,180,156],[110,102,92],[150,141,130],[172,160,148]],np.float32)/255.
    col=np.zeros((S,S,3),np.float32)+np.array([58,54,50])/255.; h=np.zeros((S,S),np.float32)
    y=0.
    while y<S-ppi*1.2:
        rh=(1.6+R.random()*R.random()*6.5)*ppi
        if y+rh>S-ppi*1.6: rh=S-y
        x=R.random()*S*.3; tot=0.
        while tot<S:
            w=(8+R.random()*26)*ppi
            if tot+w>S-ppi*4: w=S-tot
            q=pal[R.integers(0,len(pal))]*(.85+R.random()*.3); ht=.55+R.random()*.45; gap=2+R.random()*2.5
            xa=int(round(x+tot+gap)); xb=int(round(x+tot+w-gap)); ya=int(round(y+gap)); yb=min(S,int(round(y+rh-gap)))
            if xb>xa and yb>ya:
                xs=np.arange(xa,xb); ys=np.arange(ya,yb); d=detail(rock,0,int(R.integers(0,1024)),int(R.integers(0,512)),len(xs),len(ys))
                d=(d-d.mean())/(d.std()+1e-6)
                yy=(ys-ya)[:,None]; xx=(xs-xa)[None,:]; e=np.minimum(np.minimum(yy,len(ys)-1-yy),np.minimum(xx,len(xs)-1-xx)); bev=np.clip(e/7,0,1)
                shade=(.86+.14*bev)*(1+d*.16)
                col[np.ix_(ys%S,xs%S)]=q[None,None,:]*shade[...,None]; h[np.ix_(ys%S,xs%S)]=ht*(.55+.45*bev)+d*.05
            tot+=w
        y+=rh
    return col, h
c,h=ledgestone(); save_rgb(c,'stone.jpg'); save_nrm(height_normals(h,3.2),'stone_n.jpg')
# ---------- pavers: 2 x 2 and 2 x 3 ft stone slabs (8 ft tile), honed stone faces from the same scans ----------
def pavers(S=1024):
    ppf=S/8; col=np.zeros((S,S,3),np.float32)+np.array([92,88,82])/255.; h=np.zeros((S,S),np.float32)+.2
    for row in range(4):
        y0=row*2*ppf; x=R.random()*ppf; tot=0.
        while tot<S:
            w=(2 if R.random()<.5 else 3)*ppf
            if tot+w>S-ppf: w=S-tot
            v=(168+R.random()*40)/255.; tint=R.random()*10/255.; base=np.array([v+tint,v+tint*.6,v-6/255.])
            xs=np.arange(int(round(x+tot+3)),int(round(x+tot+w-3))); ys=np.arange(int(y0+3),int(y0+2*ppf-3))
            d=detail(rock,0,int(R.integers(0,1024)),int(R.integers(0,512)),len(xs),len(ys)); d=(d-d.mean())/(d.std()+1e-6)
            col[np.ix_(ys%S,xs%S)]=base[None,None,:]*(1+d[...,None]*.07); h[np.ix_(ys%S,xs%S)]=.9+d*.03
            tot+=w
    return col,h
c,h=pavers(); save_rgb(c,'pavers.jpg'); save_nrm(height_normals(h,2.5),'pavers_n.jpg')
# ---------- lawn (opengameart "dark grass", via three.js examples), roof ballast (Poly Haven rocky_trail) ----------
g=load('misc/grass3.jpg'); g=resize(g,1024,1024); gl=lum(g)[...,None]; g=(g*.62+gl*.38)*np.array([.93,1.0,.8])*.84; save_rgb(g,'grass.jpg');  # a less saturated, drier mountain lawn
save_nrm(height_normals(resize(lum(g),512,512),2.0),'grass_n.jpg',q=82)
t=resize(load('misc/rocky_trail.jpg'),512,512); tl=lum(t)[...,None]; t=t*.45+tl*.55; save_rgb(t,'gravel.jpg'); save_nrm(height_normals(lum(t),3),'gravel_n.jpg')
# ---------- concrete: the mottle of ambientCG PaintedPlaster017, grayscale ----------
pl=load('o3d/PaintedPlasterTexture/PaintedPlaster017_Color.jpg'); cl=resize(lum(pl)[:,2048:],1024,1024)
save_gray(cl,'concrete.jpg',mean=.87,sd=.045)
pn=nrm_dx_to_vec(load('o3d/PaintedPlasterTexture/PaintedPlaster017_NormalDX.jpg')[:,2048:])
pn=np.dstack([resize(pn[...,i]*.5+.5,512,512)*2-1 for i in range(3)]); save_nrm(pn,'plaster_n.jpg')
# ---------- upholstery weave (SheenChair, CC0) and leather (SheenWoodLeatherSofa, Wayfair CC-BY 4.0) ----------
fa=lum(load('src2/chair_fabric_albedo.png')); save_gray(resize(fa,512,512),'fabric.jpg',mean=.82,sd=.06)
fn=nrm_gl_to_vec(load('src2/chair_fabric_normal.png')); fn=np.dstack([resize(fn[...,i]*.5+.5,512,512)*2-1 for i in range(3)]); save_nrm(fn,'fabric_n.jpg')
la=lum(load('src2/Brown_BaseColor.webp')); save_gray(la,'leather.jpg',mean=.9,sd=.035)
ln_=nrm_gl_to_vec(load('src2/Brown_Normal.webp')); save_nrm(ln_,'leather_n.jpg')
vn=nrm_gl_to_vec(load('src2/GlamVelvetSofa_normal.png')); vn=np.dstack([resize(vn[...,i]*.5+.5,512,512)*2-1 for i in range(3)]); save_nrm(vn,'velvet_n.jpg')
# ---------- stone tile: honed marble squares (ambientCG Tiles074's light tiles), 3 x 3 per 6 ft ----------
tc=load('o3d/TilesTexture/Tiles074_Color.jpg'); tL=lum(tc); cells=[]
for i in range(8):
    for j in range(8):
        cell=tL[i*256+12:(i+1)*256-12, j*256+12:(j+1)*256-12]
        if cell.mean()>.45: cells.append(cell)
S=1024; tw=S//3; til=np.zeros((S,S),np.float32); th=np.zeros((S,S),np.float32)
for i in range(3):
    for j in range(3):
        c=cells[int(R.integers(0,len(cells)))]; c=np.rot90(c,int(R.integers(0,4))); c=resize(c,tw-4,tw-4); c=(c-c.mean())/(c.std()+1e-6)*.035+.93*(.97+R.random()*.03)
        til[i*tw+2:i*tw+2+tw-4, j*tw+2:j*tw+2+tw-4]=c; th[i*tw+2:i*tw+2+tw-4, j*tw+2:j*tw+2+tw-4]=1
til[th==0]=.55; save_gray(til[:S,:S],'tile.jpg'); save_nrm(height_normals(th[:S,:S],1.5),'tile_n.jpg')
print('all done')
# ---------- sky: Poly Haven "noon grass" (CC0, via Filament's third_party/environments) ----------
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import hdr
sky=hdr.read(os.path.join(SRC,'hdr/noon_grass_2k.hdr'))
H2=sky.shape[0]; up=sky[:H2//2]; lumu=up[...,0]*.2126+up[...,1]*.7152+up[...,2]*.0722; ref=np.percentile(lumu,60)
def srgb(x): x=np.clip(x,0,1); return np.where(x<=.0031308, x*12.92, 1.055*np.power(x,1/2.4)-.055)
vis=sky/ref*.42; vis=vis/(1+vis*.35)              # soft shoulder so the bright sky near the sun does not clip to white
save_rgb(resize(srgb(vis),2048,1024),'sky.jpg',q=86)
env=np.minimum(sky/ref*.5, 6.0)                    # the sun itself is left out: the scene's own sun light and disc stand in for it
env=np.dstack([resize(np.clip(env[...,i]/6,0,1),512,256)*6 for i in range(3)])
# stored in a PNG as (value / 6) ^ (1/3) per channel, which keeps dark and bright parts usable in 8 bits; decoded in the page
Image.fromarray((np.power(np.clip(env/6,0,1),1/3)*255+.5).astype(np.uint8),'RGB').save(os.path.join(OUT,'env.png'),optimize=True)
print('sky done')
