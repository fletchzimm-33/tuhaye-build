import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import json, importlib, lower_data as L, main_data as Mn, site_data as S, fixtures_data as FX
r2=lambda v: round(v,3) if isinstance(v,float) else v
def R(v):
    if isinstance(v,(list,tuple)): return [R(x) for x in v]
    if isinstance(v,dict): return {k:R(x) for k,x in v.items()}
    return r2(v)
def walls(W): return [R(list(w[:5])+([w[5]] if len(w)>5 else [])) for w in W]
def opens(O): return [R(list(o[:5])+[o[5] if len(o)>5 else {}]) for o in O]
def rooms(Rr): return [R({'n':r['name'],'u':r.get('num',''),'f':r['floor'],'dy':r.get('dy',0),'p':r['poly']}) for r in Rr]
H={'off':[L.THEATER['x'],L.THEATER['z']],'main':S.MAIN,
 'L':{'W':walls(L.W),'O':opens(L.O),'R':rooms(L.R),'ceil':S.CEIL_LOWER},
 'M':{'W':walls(Mn.W),'O':opens(Mn.O),'R':rooms(Mn.R),'ceil':R(S.CEIL_MAIN)},
 'roofs':R(S.ROOFS),'chim':R(S.CHIMNEYS),'stairs':R(S.STAIRS),'decks':R(S.DECKS),'ter':R(S.TERRACES),'swall':R(S.SITEWALLS),
 'plant':R(S.PLANTERS),'piers':R(S.PIERS),'posts':R(S.POSTS),'spa':R(S.SPA),'fire':R(S.FIRETABLE),'bbq':R(S.BBQ),'terrain':R(S.TERRAIN),'drive':R(S.DRIVE),'rwalls':R(S.RWALLS),'rails':R(S.RAILS),'fix':[R(list(f)) for f in FX.FIX]}
js=json.dumps(H,separators=(',',':'))
import os
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'house.json'),'w').write(js); print(len(js),'bytes')
