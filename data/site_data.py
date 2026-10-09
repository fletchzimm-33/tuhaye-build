# Site, stairs, decks, roofs and ceilings.  House frame feet; y = feet above the lower-level floor (6766'-6").
MAIN=11.5
# ---- ceilings: main-level zones (rect X0,X1,Z0,Z1 ; ceiling y = c + gx*X + gz*Z, relative to the main floor)
CEIL_MAIN=[
 dict(n='primary',   r=(9.0,35.6,-3.0,28.01),  c=10.44, gz=1/12),
 dict(n='vestibule', r=(35.53,41.0,21.5,46.51),c=9.0),
 dict(n='walkin',    r=(22.0,35.6,28.01,46.51),c=9.0),
 dict(n='great',     r=(14.0,46.0,46.51,66.52),c=12.55+40/12, gx=-1/12),
 dict(n='dining',    r=(18.0,47.0,66.52,87.49),c=12.7+40/12, gx=-1/12),
 dict(n='flat',      r=(26.9,50.6,87.49,100.6),c=9.5),
 dict(n='mud',       r=(38.99,56.5,95.97,112.6),c=13.41+118/12, gz=-1/12),
 dict(n='bed2',      r=(9.0,39.0,100.53,117.6),c=10.43+117.5/12, gz=-1/12),
 dict(n='garage',    r=(56.0,92.0,87.0,117.6), c=13.41+118/12, gz=-1/12),
 dict(n='refuse',    r=(91.5,104.1,89.0,112.6),c=11.0),
]
CEIL_LOWER=9.0
# ---- roofs: rect, top surface y_top = t + gx*X + gz*Z (relative to the main floor), thickness th, kind
ROOFS=[
 dict(n='primary', r=(8.5,37.0,-2.6,28.6), t=11.44, gz=1/12, th=1.0, k='metal', fall='N'),
 dict(n='walkin',  r=(20.3,42.6,28.6,44.0), t=10.22, th=1.2, k='flat'),
 dict(n='vest',    r=(35.6,42.6,21.0,28.6), t=10.22, th=1.2, k='flat'),
 dict(n='great',   r=(10.3,47.6,43.6,66.52), t=13.55+40/12, gx=-1/12, th=1.0, k='metal', fall='E'),
 dict(n='dining',  r=(14.4,50.2,66.52,89.4), t=13.7+40/12, gx=-1/12, th=1.0, k='metal', fall='E'),
 dict(n='cdining', r=(8.6,27.43,89.4,100.53), t=10.9, th=1.4, k='flat'),
 dict(n='hall',    r=(27.43,38.99,89.4,100.53), t=10.8, th=1.3, k='flat'),   # over the pantry, hall and closet, up to bedroom #2's roof
 dict(n='powder',  r=(38.99,50.6,89.4,95.51), t=10.8, th=1.3, k='flat'),
 dict(n='bed2',    r=(7.0,39.0,100.53,119.6), t=11.43+117.5/12, gz=-1/12, th=1.0, k='metal', fall='S'),
 dict(n='mud',     r=(38.6,56.0,95.5,116.6), t=14.52+118/12, gz=-1/12, th=1.1, k='metal', fall='S'),
 dict(n='garage',  r=(56.0,92.4,83.0,120.5), t=14.52+118/12, gz=-1/12, th=1.1, k='metal', fall='S'),
 dict(n='refuse',  r=(92.4,107.0,88.6,113.6), t=12.4, th=1.4, k='flat'),
 dict(n='entry',   r=(46.0,57.6,57.4,67.0), t=12.95-46.0/12, gx=1/12, th=0.9, k='metal', fall='W'),
]
# chimneys: rect, top (rel main), cap (mesh box) height
CHIMNEYS=[   # measured on the elevations: stone (or metal) top above the main floor, then a 6" cap band, the spark screen and a lid
 dict(n='primary', r=(21.05,27.7,24.3,29.1),   top=16.0, cap=2.0),
 dict(n='great',   r=(12.56,28.2,65.8,70.2),   top=18.0, cap=2.0),
 dict(n='bed2',    r=(17.2,23.3,100.53,103.8), top=14.0, cap=2.0),
 dict(n='range',   r=(43.0,47.7,78.3,80.9),    top=17.07, cap=1.5, k='metal'),
]
# ---- stairs: runs of steps.  axis 'x' or 'z', from (a0) to (a1) along the axis, across (b0,b1), y0 -> y1, n risers
STAIRS=[
 dict(n='main-lower', ax='x', a0=35.5, a1=26.5, b=(42.49,46.5), y0=0.0,  y1=5.75, nr=10, lvl='lower'),
 dict(n='main-land',  land=(22.48,26.5,37.95,46.5), y=5.75),
 dict(n='main-upper', ax='x', a0=26.5, a1=35.5, b=(37.95,42.05), y0=5.75, y1=11.5, nr=10, lvl='main'),
 dict(n='mud',        ax='x', a0=39.57, a1=43.57, b=(95.97,100.53), y0=11.5, y1=14.0, nr=5, lvl='main'),
 dict(n='entry',      ax='x', a0=51.9, a1=56.9, b=(57.2,65.9), y0=11.42, y1=14.42, nr=6, ext=True, cheeks=(1,)),   # A2.1: up 6 R @ 6", 5 T @ 12" from the covered entry to the auto court; the planter wall bounds the north side
 dict(n='spa',        ax='z', a0=66.4, a1=68.9, b=(5.0,12.5), y0=-0.5, y1=-2.0, nr=3, ext=True),
]
# ---- decks (main level, y=MAIN-1/12) and terraces (lower)
DECKS=[
 dict(n='Primary Deck', y=MAIN-1/12, poly=[(2.62,11.7),(11.0,11.7),(11.0,29.3),(2.62,29.3)], rail='WNS'),
 dict(n='View Deck', y=MAIN-1/12, poly=[(-4.4,46.2),(14.03,46.2),(14.03,64.9),(13.0,64.9),(13.0,70.3),(18.03,70.3),(18.03,87.03),(26.99,87.03),(26.99,100.53),(9.2,100.53),(9.2,70.75),(-4.4,70.75)], rail='auto'),
 dict(n='Sitting Terrace', y=MAIN-1/12, poly=[(41.0,33.6),(51.9,33.6),(51.9,58.51),(45.99,58.51),(45.99,46.96),(41.0,46.96)], k='pavers', rail='N'),
 dict(n='Covered Entry', y=MAIN-1/12, poly=[(41.0,58.51),(51.9,58.51),(51.9,66.0),(41.0,66.0)], k='pavers', rail=''),
 dict(n='Dog Run', y=MAIN+2.0, poly=[(38.6,112.52),(56.01,112.52),(56.01,117.5),(38.6,117.5)], k='concrete', rail='WS', screen=True),
]
TERRACES=[
 dict(n='Mech Terrace', y=0.0, poly=[(7.6,0.4),(24.48,0.4),(24.48,12.0),(11.02,12.0),(11.02,7.3),(7.6,7.3)]),
 dict(n='Bedroom Terrace', y=-0.5, poly=[(-0.4,7.3),(11.02,7.3),(11.02,29.3),(-0.4,29.3)]),
 dict(n='Covered Rec Terrace', y=-0.5, poly=[(0.5,46.5),(14.04,46.5),(14.04,65.8),(0.5,65.8)]),
 dict(n='Terrace Steps', y=-0.5, poly=[(4.4,65.8),(12.56,65.8),(12.56,66.4),(4.4,66.4)]),
 dict(n='Spa Terrace', y=-2.0, poly=[(1.0,68.9),(17.99,68.9),(17.99,96.0),(1.0,96.0)]),
]
# low site walls (stone): rect, top y
SITEWALLS=[
 dict(r=(6.9,7.6,-0.6,7.3), top=-1.6),
 dict(r=(7.6,16.95,-0.6,0.4), top=-1.6),
 dict(r=(-1.1,-0.4,7.3,46.5), top=-1.6),
 dict(r=(-4.4,0.5,45.8,46.5), top=-0.4),
 dict(r=(-4.4,-3.7,46.5,90.0), top=-1.6),
 dict(r=(0.5,1.0,46.5,96.0), top=-0.4),
 dict(r=(-3.7,1.0,89.3,90.0), top=-0.4),
]
PLANTERS=[ dict(r=(-3.7,0.5,46.5,89.3), y=-0.6), dict(r=(51.9,61.7,30.6,57.0), y=81.9-66.5-.4, wall=81.9-66.5, lvl='T') ]
# stone piers / columns that hold up the decks and roofs: rect, y0, y1
PIERS=[
 dict(r=(50.0,54.7,66.0,70.2), y0=11.0, y1=81.9-66.5),   # stone pier at the foot of the entry steps, carrying the entry roof's post (A2.1)
 dict(r=(0.5,4.4,65.8,69.5), y0=-2.0, y1=MAIN-0.2),
 dict(r=(7.6,11.6,83.9,91.1), y0=-2.0, y1=MAIN-0.2),
 dict(r=(7.0,11.0,27.0,29.0), y0=-0.5, y1=MAIN-0.2),
]
POSTS=[ # steel / timber posts: (X,Z,y0,y1,size)
 (2.9,12.0,-0.5,MAIN-0.25,0.5),(2.9,29.0,-0.5,MAIN-0.25,0.5),
 (-4.1,46.5,-0.6,MAIN-0.25,0.5),(-4.1,70.4,-2.0,MAIN-0.25,0.5),
 (9.5,100.2,-1.5,MAIN-0.25,0.5),(26.7,100.2,-1.5,MAIN-0.25,0.5),
 (9.5,87.6,MAIN,MAIN+9.5,0.5),(26.7,87.6,MAIN,MAIN+9.5,0.5),(9.5,100.2,MAIN,MAIN+9.5,0.5),
 (52.6,57.25,81.9-66.5,MAIN+11.2,0.5),(52.6,66.75,81.9-66.5,MAIN+11.2,0.5),   # the entry roof's posts: on the planter wall and on the stone pier beside the steps
]
SPA=dict(r=(2.0,10.6,72.9,82.0), top=-0.5)
FIRETABLE=dict(r=(0.3,4.6,55.0,61.0), y=MAIN-1/12, h=1.5)
BBQ=dict(r=(9.3,10.5,84.8,90.2), y=MAIN-1/12, h=3.0)
# terrain control points (X,Z,y) ; grade around the house (from the elevation sheets' grade lines)
def _profile(pts, step=2.5):
    """points every `step` feet along a grade line read off an elevation, so the ground follows the line instead of bulging between readings"""
    out=[]
    for (x0,z0,y0),(x1,z1,y1) in zip(pts,pts[1:]):
        n=max(1,round(((x1-x0)**2+(z1-z0)**2)**.5/step))
        out+=[(round(x0+(x1-x0)*k/n,2),round(z0+(z1-z0)*k/n,2),round(y0+(y1-y0)*k/n,2)) for k in range(n)]
    return out+[pts[-1]]
# auto court (asphalt) in front of the garage, and the drive that leaves it to the north (sheet A2.1)
DRIVE=[(57.0,90.6),(57.0,57.6),(61.0,56.4),(68.0,53.6),(74.0,49.0),(78.0,41.0),(77.6,25.0),(73.0,0.0),(70.5,-40.0),(89.0,-40.0),(91.5,0.0),(96.0,25.0),(97.2,40.0),(95.6,50.0),(96.6,56.8),(102.6,80.7),(103.4,88.6),(91.6,88.6),(91.6,90.6)]
def _court():
    """a grid of spot heights over the auto court (sheet A2.1): 14.42 where the entry steps arrive, falling gently to 13.85 at the garage apron"""
    poly=DRIVE; out=[]
    def inside(x,z):
        c=False
        for (x0,z0),(x1,z1) in zip(poly,poly[1:]+poly[:1]):
            if (z0>z)!=(z1>z) and x<x0+(z-z0)*(x1-x0)/(z1-z0): c=not c
        return c
    for z in range(58,91,4):
        for x in range(58,104,5):
            if inside(x,z): out.append((x,z,round(14.42-(z-58)/(89-58)*.57,2)))
    return out
TERRAIN=[
 # far field: the lot falls from the east (the drive, ~6790') to the west (~6758')
 (-40,-40,-8),(-40,20,-8),(-40,70,-8.2),(-40,120,-8.5),(-40,170,-8.5),(-25,50,-6.8),(-25,110,-7.6),
 (-12,-10,-5.8),(-12,30,-5.6),(-12,70,-5.8),(-12,105,-7.3),(-8,128,-7.2),
 # west face (A3.2): proposed grade 6762'-0" (4.5 ft below the lower floor) along the terrace walls, falling to ~7 ft below under the bunk-room wing
 *_profile([(-6,0,-4.6),(-6,78,-4.6),(-4,88,-6.3),(-2,96,-6.6),(7,101,-6.8),(7,118.5,-6.8)], 4),(11,104,-6.9),(11,112,-6.9),
 # north face (A3.2 north elevation): -4.4 at the northwest corner, rising east past the primary suite
 (-5,-4,-6.0),(4,4,-3.2), *_profile([(0,-3,-4.4),(10,-2.5,-1.7),(16.5,-2.5,-0.4),(24.5,-2.5,3.5),(30,-2.5,4.6),(35,-2.5,5.6),(37.5,-1,5.7)]),
 # east face of the primary wing (A3.1 obscured east elevation) and north of the sitting terrace (A3.2)
 *_profile([(37.5,2,5.9),(37.5,10,6.6),(37.5,19,7.5),(42.5,26,9.0),(43,31,9.4),(48,31,9.3),(55,29,11.0)]),(52,6,10.8),
 (58,20,13.4),(62,40,14.2),(64,58,14.4),(66,60,13.8),(82,40,14.2),(84,10,14.8),(80,-20,15.5),(110,40,17.5),(108,70,17.5),
 # auto court: graded flat, from the entry steps (14.42) down to the garage apron, just under the 6780'-6" slab
 *_court(), (94,90.5,13.9),(98,90.5,13.9),(102,90.5,13.9),(94,92.5,13.92),(98,92.5,13.92),(102,92.5,13.92),
 # the ground held up behind the angled stone retaining wall (its top steps 15.0 -> 18.0), and east of the garage (A3.1 east elevation)
 *_profile([(99.4,56.0,15.0),(105.4,80.3,18.0)], 3), *_profile([(106.5,58,15.6),(109,80,18.3)], 4),
 *_profile([(106.2,86,17.0),(106.2,92,17.4),(106.2,100,18.8),(106.2,108,20.1),(106.2,116,21.5),(106.2,122,22.1)], 3),
 (115,60,16.8),(115,75,18.3),(115,90,19.4),(115,105,21.4),(115,120,23.0),(126,50,17.5),(126,80,19.5),(126,110,22.5),(126,130,23.5),
 # south face (A3.3): from ~6 ft below the lower floor at the southwest corner up to the auto-court level at the garage
 *_profile([(-1,120,-6.6),(9,120,-5.6),(15,120,-4.0),(20,120,-2.6),(25,120,-1.3),(30,120,0.0),(37.3,120,2.0),(45,120,4.3),(57,120,7.6),(64,120,9.5),(70,120,11.8),(78,120,14.8),(85,120,16.9),(92,121,18.4),(100,121,19.6)]),
 *_profile([(-1,129,-6.4),(25,129,-1.0),(60,130,8.5),(92,130,19.0)], 6),
 (14,31,-0.7),(20,31,-0.6),(23,38,-0.6),(16,39,-0.7),(20,45,-0.6),(8,38,-1.2),   # the landscaped strip west of the office, level with the terraces (A3.2 west elevation)
 (150,40,19),(150,100,24),(150,160,18),(60,170,4),(0,170,-5),(140,-40,16),(60,-40,10),(10,-40,-5),
]
# angled stone retaining wall along the east side of the auto court: (X0,Z0,X1,Z1, thickness, top y at start, top y at end)
RWALLS=[(97.2,56.6,103.2,80.9,1.5,81.5-66.5,84.5-66.5)]

# interior guards and stair rails: (X0,Z0,X1,Z1, y0, y1) — y in lower-floor feet at each end
RAILS=[
 (22.6,46.35,35.5,46.35, MAIN, MAIN),          # main level: guardrail along the stairwell, great-room side
 (35.65,42.1,35.65,46.4, MAIN, MAIN),          # main level: stair hall side of the well
 (26.5,41.95,35.4,41.95, 5.75, MAIN),          # upper flight, open side over the lower flight
 (35.4,46.35,26.5,46.35, 0.0, 5.75),           # lower flight, rec-room side
 (26.5,46.35,22.6,46.35, 5.75, 5.75),          # landing
]
