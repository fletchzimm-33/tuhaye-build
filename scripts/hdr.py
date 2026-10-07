# minimal Radiance .hdr (RGBE, new-style RLE) reader/writer
import numpy as np
def read(path):
    f=open(path,'rb'); hdr=b''
    while True:
        line=f.readline()
        if line.strip()==b'': break
        hdr+=line
    dims=f.readline().split(); H=int(dims[1]); W=int(dims[3]); data=f.read(); out=np.zeros((H,W,4),np.uint8); p=0
    for y in range(H):
        if data[p]==2 and data[p+1]==2:
            p+=4
            for c in range(4):
                x=0
                while x<W:
                    n=data[p]; p+=1
                    if n>128: n-=128; out[y,x:x+n,c]=data[p]; p+=1
                    else: out[y,x:x+n,c]=np.frombuffer(data[p:p+n],np.uint8); p+=n
                    x+=n
        else:
            out[y]=np.frombuffer(data[p:p+W*4],np.uint8).reshape(W,4); p+=W*4
    e=out[...,3].astype(np.int32); scale=np.where(e>0, np.ldexp(1.0, e-136), 0.0)
    return out[...,:3].astype(np.float64)*scale[...,None]
def write(path, img):
    H,W,_=img.shape; m=img.max(axis=2); e=np.zeros((H,W),np.int32); mant=np.zeros((H,W))
    nz=m>1e-32; mant[nz],e[nz]=np.frexp(m[nz]); rgbe=np.zeros((H,W,4),np.uint8)
    sc=np.where(nz, mant*256.0/np.where(nz,m,1), 0)
    rgbe[...,:3]=np.clip(img*sc[...,None],0,255).astype(np.uint8); rgbe[...,3]=np.where(nz,e+128,0).astype(np.uint8)
    with open(path,'wb') as f:
        f.write(b'#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n'+('-Y %d +X %d\n'%(H,W)).encode()); f.write(rgbe.tobytes())
