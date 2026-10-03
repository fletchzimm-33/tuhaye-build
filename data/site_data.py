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
 dict(n='hall',    r=(27.43,50.6,89.4,95.97), t=10.8, th=1.3, k='flat'),
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
 dict(n='entry',      ax='x', a0=50.6, a1=55.6, b=(58.6,66.4), y0=11.42, y1=14.42, nr=6, ext=True),
 dict(n='spa',        ax='z', a0=66.4, a1=68.9, b=(5.0,12.5), y0=-0.5, y1=-2.0, nr=3, ext=True),
]
# ---- decks (main level, y=MAIN-1/12) and terraces (lower)
DECKS=[
 dict(n='Primary Deck', y=MAIN-1/12, poly=[(2.62,11.7),(11.0,11.7),(11.0,29.3),(2.62,29.3)], rail='WNS'),
 dict(n='View Deck', y=MAIN-1/12, poly=[(-4.4,46.2),(14.03,46.2),(14.03,64.9),(13.0,64.9),(13.0,70.3),(18.03,70.3),(18.03,87.03),(26.99,87.03),(26.99,100.53),(9.2,100.53),(9.2,70.75),(-4.4,70.75)], rail='auto'),
 dict(n='Sitting Terrace', y=MAIN-1/12, poly=[(41.0,33.6),(54.5,33.6),(54.5,58.51),(45.99,58.51),(45.99,46.96),(41.0,46.96)], k='pavers', rail='N'),
 dict(n='Covered Entry', y=MAIN-1/12, poly=[(41.0,58.51),(50.6,58.51),(50.6,66.52),(41.0,66.52)], k='pavers', rail=''),
 dict(n='Dog Run', y=MAIN+2.0, poly=[(38.6,112.52),(56.01,112.52),(56.01,117.5),(38.6,117.5)], k='concrete', rail='WS'),
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
PLANTERS=[ dict(r=(-3.7,0.5,46.5,89.3), y=-0.6), dict(r=(55.0,61.6,30.6,57.6), y=81.9-66.5-.4, wall=81.9-66.5, lvl='T') ]
# stone piers / columns that hold up the decks and roofs: rect, y0, y1
PIERS=[
 dict(r=(0.5,4.4,65.8,69.5), y0=-2.0, y1=MAIN-0.2),
 dict(r=(7.6,11.6,83.9,91.1), y0=-2.0, y1=MAIN-0.2),
 dict(r=(7.0,11.0,27.0,29.0), y0=-0.5, y1=MAIN-0.2),
 dict(r=(69.5,71.6,87.6,88.4), y0=MAIN+2.5, y1=MAIN+15.0),
]
POSTS=[ # steel / timber posts: (X,Z,y0,y1,size)
 (2.9,12.0,-0.5,MAIN-0.25,0.5),(2.9,29.0,-0.5,MAIN-0.25,0.5),
 (-4.1,46.5,-0.6,MAIN-0.25,0.5),(-4.1,70.4,-2.0,MAIN-0.25,0.5),
 (9.5,100.2,-1.5,MAIN-0.25,0.5),(26.7,100.2,-1.5,MAIN-0.25,0.5),
 (9.5,87.6,MAIN,MAIN+9.5,0.5),(26.7,87.6,MAIN,MAIN+9.5,0.5),(9.5,100.2,MAIN,MAIN+9.5,0.5),
 (52.7,58.8,MAIN+2.9,MAIN+11.2,0.5),(52.7,66.2,MAIN+2.9,MAIN+11.2,0.5),
]
SPA=dict(r=(2.0,10.6,72.9,82.0), top=-0.5)
FIRETABLE=dict(r=(0.3,4.6,55.0,61.0), y=MAIN-1/12, h=1.5)
BBQ=dict(r=(9.3,10.5,84.8,90.2), y=MAIN-1/12, h=3.0)
# terrain control points (X,Z,y) ; grade around the house (from the elevation sheets' grade lines)
TERRAIN=[
 (-40,-40,-8),(-40,20,-7),(-40,70,-7),(-40,120,-7),(-40,170,-7),
 (-12,-10,-4),(-12,30,-3.5),(-12,70,-3.5),(-12,105,-3.5),(-8,128,-3),
 (5,-8,-2),(13,-6,-0.4),(15,-6,0.5),(20,-6,3.5),(25,-6,4.7),(30,-6,5.7),(33,-6,8.0),(35,-6,9.5),(38,-6,10.4),(44,-4,11.4),
 (43,10,12.6),(43,25,12.8),(46,30,12.9),(52,6,12.4),(58,20,13.4),(62,40,14.2),(64,58,14.4),(66,60,13.8),(82,40,14.2),(84,10,14.8),(80,-20,15.5),(110,40,17.5),(108,70,17.5),
 (62,82,13.6),(80,80,13.7),(100,84,13.8),(106,92,19.0),(106,104,21.0),(106,116,22.5),(112,96,20.0),(112,112,23.0),(118,124,24.0),
 (92,124,17.5),(85,124,15.0),(80,123,13.2),(75,123,11.8),(70,123,10.3),(60,123,7.8),(48,123,4.2),(40,123,2.5),(25,123,-0.6),(12,122,-1.2),
 (0,112,-2.0),(0,100,-2.4),(-4,60,-3.0),(-4,20,-2.8),(4,2,-1.0),
 (150,40,19),(150,100,24),(150,160,18),(60,170,4),(0,170,-5),(140,-40,16),(60,-40,10),(10,-40,-5),
]
# auto court (asphalt) in front of the garage, and the drive that leaves it to the north (sheet A2.1)
DRIVE=[(57.0,90.6),(57.0,57.6),(61.0,56.4),(68.0,53.6),(74.0,49.0),(78.0,41.0),(77.6,25.0),(73.0,0.0),(70.5,-40.0),(89.0,-40.0),(91.5,0.0),(96.0,25.0),(97.2,40.0),(95.6,50.0),(96.6,56.8),(102.6,80.7),(103.4,88.6),(91.6,88.6),(91.6,90.6)]
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
