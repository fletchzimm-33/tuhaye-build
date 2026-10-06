# LOWER LEVEL (A2.2).  House feet: X east of grid A, Z south of grid 1.  Floor 6766'-6".
# Wall kinds: 'w' framed wall, 'c' concrete foundation wall (outer face -> inner face incl. furring),
#             'r' site/retaining stone wall (opts top=abs elev, bot=abs elev), 'g' glass partition (opts h),
#             'p' stone pier / chimney mass (opts top=abs elev), 'v' stone veneer layer (interior feature wall)
# Openings O: (type, x0,z0,x1,z1, opts) spanning a wall gap.  types: door, door2 (pair), pocket, barn, barn2,
#             bifold, slide (glass multi-slide), win, pass (cased opening), gdoor (glass shower door)
# The theater (113) + former Mech #2 is NOT in here: it is the existing parametric theater module, placed with its
# west wall inner face at X=39.0 and screen wall inner face at Z=116.58.  Its shell walls are generated from it.
FLOOR=6766.5
CEIL=10.0
THEATER=dict(x=39.0, z=116.58)
W=[
 # ---------- north: mech terrace / Mech #1
 (16.95,-0.05,24.92,1.67,'w',dict(ext='stone')),          # solid block under the primary bath north wall (two walls + hatched void)
 (24.92,0.0,35.51,0.84,'c'),            # Mech #1 north foundation wall (retains grade)
 (34.38,0.84,35.51,23.02,'c'),          # east foundation wall, Mech #1 + Bath #3
 (24.48,1.67,25.17,4.25,'w',dict(ext='vsiding')),           # Mech #1 west (exterior, faces mech terrace)
 (24.48,9.5,25.17,12.0,'w',dict(ext='vsiding')),
 # ---------- Bedroom #3
 (11.02,12.0,11.92,12.46,'w',dict(ext='stone')),          # north wall (window 34)
 (14.5,12.0,24.92,12.46,'w',dict(ext='stone')),
 (11.02,12.46,11.69,13.92,'w'),         # west wall (multi-slide 101)
 (11.02,26.08,11.69,28.0,'w'),
 (11.02,27.53,11.92,28.0,'w'),          # south wall (window 35)
 (14.5,27.53,35.5,28.0,'w'),            # bedroom / vestibule south = office north
 # ---------- Bath #3
 (24.92,12.0,34.38,12.46,'w'),          # Mech #1 | Bath #3
 (24.5,12.46,24.92,18.0,'w'),
 (24.92,17.75,28.5,18.0,'w'),           # shower south / closet north
 (28.25,12.46,28.5,13.92,'w'),
 (28.3,13.92,28.45,17.75,'g',dict(h=7.5)),   # shower glass (door swings into bath)
 (26.75,18.0,27.0,23.0,'w'),            # closet | linen
 (24.5,23.0,28.9,23.48,'w'),            # bath south (pocket for door 102 inside)
 (32.0,23.0,34.38,23.48,'w'),
 # ---------- stair hall (concrete north + east)
 (34.38,23.02,41.01,23.86,'c'),
 (35.51,23.86,39.93,24.14,'w'),         # furring
 (35.08,23.86,35.5,24.5,'w'),           # door 103 jambs
 (35.08,27.33,35.5,27.53,'w'),
 (39.93,23.86,41.01,46.5,'c'),
 # ---------- office
 (24.0,28.0,24.43,30.5,'w',dict(ext='vsiding')),            # west (windows 36a/36b)
 (24.0,33.45,24.43,33.55,'w',dict(ext='vsiding')),          # mullion between 36a and 36b
 (24.0,36.5,24.43,37.51,'w',dict(ext='vsiding')),
 (35.08,28.0,35.5,31.17,'w'),           # east (barn doors 104, closet 119)
 (35.08,35.92,35.5,38.67,'w'),
 (35.08,41.42,35.5,42.05,'w'),
 (22.01,37.51,35.5,37.95,'w'),          # office south
 # ---------- stair / closet under upper run
 (22.01,37.95,22.48,38.75,'w'),         # exterior wall west of the landing (stair window 19a between)
 (22.01,45.6,22.48,46.51,'w'),
 (26.4,42.05,35.5,42.49,'w'),           # closet south = lower-run north wall
 # ---------- rec room
 (14.04,46.51,15.5,47.17,'w'),          # north wall west of stair (window 37b)
 (18.5,46.51,22.48,47.17,'w'),
 (14.04,47.17,14.71,50.4,'w'),          # west (multi-slide 107)
 (14.04,65.5,14.71,69.06,'w'),
 (14.71,66.49,15.67,66.92,'w'),         # south wall (rec closet double door, fireplace)
 (20.33,66.49,30.58,66.92,'w'),
 (30.58,66.49,33.09,66.92,'w'),
 (14.71,65.83,33.09,66.49,'v'),         # stacked-stone feature wall with the linear fireplace + TV
 (12.56,65.8,14.04,70.2,'p',dict(top=6778.0)),  # stone mass at the terrace steps
 # ---------- wet bar alcove (east, concrete)
 (39.93,46.5,46.01,47.62,'c'),
 (44.56,47.62,46.01,57.35,'c'),
 (39.93,57.35,46.01,58.5,'c'),
 (39.93,58.5,41.01,66.49,'c'),
 # ---------- linen 108 / bedroom #4
 (30.17,66.92,30.58,71.42,'w'),
 (30.17,71.08,33.09,71.42,'w'),
 (33.0,66.49,33.53,67.4,'w'),           # door 108 jamb
 (33.09,70.58,33.53,71.92,'w'),
 (14.04,69.06,30.58,69.51,'w'),         # bedroom #4 north (closet / chase south)
 (17.99,69.51,18.69,75.75,'w'),         # bedroom #4 west (egress windows 38a/38b)
 (17.99,84.33,18.69,90.8,'w'),
 (17.99,93.33,18.69,100.97,'w'),        # bath #4 / bunk closet west (window 39 between)
 (18.69,87.02,23.23,87.47,'w'),         # bedroom #4 south (pocket door 112)
 (26.1,87.02,33.09,87.47,'w'),
 (33.09,75.17,33.53,94.51,'w'),         # bedroom #4 / bath #4 east = hall west
 # ---------- bath #4 / bunk closet / lobby
 (28.08,91.83,28.5,94.05,'w'),
 (28.15,87.47,28.3,91.83,'g',dict(h=7.5)),   # shower glass + door
 (18.69,94.05,33.53,94.51,'w'),
 (27.0,94.51,27.44,97.4,'w'),           # bunk closet | linen 118
 (27.0,100.1,27.44,100.5,'w'),
 (27.44,96.0,27.94,96.3,'w'),           # linen 118 door jambs
 (31.0,96.0,31.49,96.3,'w'),
 (31.49,94.51,31.95,97.0,'w'),          # lobby west (door 111)
 (31.49,100.2,31.95,100.5,'w'),
 # ---------- hall east / storage (storage opens off the former Mech #2)
 (38.57,66.49,39.0,87.02,'w'),          # hall | storage
 (39.0,66.49,47.02,67.61,'c'),          # storage north
 (45.9,67.61,47.02,87.02,'c'),          # storage east
 # ---------- bunk room / WC / bunk bath
 (13.03,100.5,14.6,100.97,'w'),         # bunk room north (window 40)
 (17.4,100.5,26.7,100.97,'w'),
 (26.7,100.5,27.44,100.97,'w'),
 (31.49,100.5,38.57,100.97,'w'),        # WC north (lobby south, ART wall)
 (13.03,100.97,13.69,101.3,'w',dict(wain=2.0)),        # bunk room west (egress 41a/41b)
 (13.03,109.92,13.69,116.83,'w',dict(wain=2.0)),
 (13.03,116.83,32.5,117.5,'w'),         # south wall (window 42 TEMP)
 (34.5,116.83,38.57,117.5,'w'),
 (31.49,100.97,31.95,105.42,'w'),       # bunk room | WC + bath (barn 114)
 (31.49,108.67,31.95,116.83,'w'),
 (31.95,104.08,32.2,104.42,'w'),        # WC south (pocket 115)
 (34.6,104.08,38.57,104.42,'w'),
 (34.2,109.95,38.57,110.08,'g',dict(h=7.5)),  # wet room glass
]
O=[
 ('door2',24.48,4.25,25.17,9.5,dict(tag='100',h=8,swing=-1)),   # Mech #1 pair, swings out to terrace
 ('win',11.92,12.0,14.5,12.46,dict(tag='34')),
 ('slide',11.02,13.92,11.69,26.08,dict(tag='101',h=8)),          # Bedroom #3 multi-slide to bedroom terrace
 ('win',11.92,27.53,14.5,28.0,dict(tag='35')),
 ('bifold',24.5,18.0,24.92,23.0,dict(h=8)),                      # Bedroom #3 closet
 ('pocket',28.9,23.0,32.0,23.48,dict(tag='102',h=8)),            # Bath #3
 ('door',35.08,24.5,35.5,27.33,dict(tag='103',h=8,swing=-1,hinge=0)),
 ('win',24.0,30.5,24.43,33.45,dict(tag='36a',sill=3.0,head=8.3)),
 ('win',24.0,33.55,24.43,36.5,dict(tag='36b',sill=3.0,head=8.3)),
 ('barn2',35.08,31.17,35.5,35.92,dict(tag='104',h=8,side=1)),    # Office, barn doors on stair-hall side
 ('door',35.08,38.67,35.5,41.42,dict(tag='119',h=7,swing=1,hinge=1)),
 ('win',15.5,46.51,18.5,47.17,dict(tag='37b')),
 ('slide',14.04,50.4,14.71,65.5,dict(tag='107',h=8)),            # Rec room multi-slide to covered rec terrace
 ('door2',15.67,66.49,20.33,66.92,dict(h=8,swing=-1)),          # rec room closet pair
 ('door',33.09,67.4,33.53,70.58,dict(tag='108',h=8,swing=1,hinge=0)),
 ('door',33.09,71.92,33.53,75.17,dict(tag='109',h=8,swing=-1,hinge=0)),
 ('win',17.99,75.75,18.69,80.0,dict(tag='38a')),
 ('win',17.99,80.0,18.69,84.33,dict(tag='38b')),
 ('pocket',23.23,87.02,26.1,87.47,dict(tag='112',h=8)),
 ('win',17.99,90.8,18.69,93.33,dict(tag='39',sill=3.5)),
 ('gdoor',28.15,87.47,28.3,89.5,dict()),
 ('door',27.94,96.0,31.0,96.3,dict(tag='118',h=8,swing=-1,hinge=1)),
 ('pass',27.0,97.4,27.44,100.1,dict(tag='113',h=8)),
 ('door',31.49,97.0,31.95,100.2,dict(tag='111',h=8,swing=-1,hinge=0)),
 ('pass',27.44,100.5,31.49,100.97,dict(h=8)),
 ('win',14.6,100.5,17.4,100.97,dict(tag='40')),
 ('win',13.03,101.3,13.69,105.6,dict(tag='41a')),
 ('win',13.03,105.6,13.69,109.92,dict(tag='41b')),
 ('barn',31.49,105.42,31.95,108.67,dict(tag='114',h=8,side=-1)),
 ('pocket',32.2,104.08,34.6,104.42,dict(tag='115',h=8)),
 ('gdoor',31.95,109.95,34.2,110.08,dict()),
 ('win',32.5,116.83,34.5,117.5,dict(tag='42',sill=4.0)),
 ('win',22.01,38.75,22.48,45.6,dict(tag='19a',sill=6.5,head=10.0)),   # the stair window starts at the landing and runs up through the main level
]
# rooms: name, number, floor finish, polygon (interior faces).  ceil defaults to CEIL.
R=[
 dict(name='Mech #1',num='100',floor='concrete',poly=[(25.17,0.84),(34.38,0.84),(34.38,12.0),(25.17,12.0)]),
 dict(name='Bedroom #3',num='100',floor='wood',poly=[(11.69,12.46),(24.5,12.46),(24.5,23.48),(35.08,23.48),(35.08,27.53),(11.69,27.53)]),
 dict(name='Closet',floor='wood',poly=[(24.92,18.0),(26.75,18.0),(26.75,23.0),(24.92,23.0)]),
 dict(name='Bath #3',num='101',floor='tile',poly=[(24.92,12.46),(34.38,12.46),(34.38,23.0),(27.0,23.0),(27.0,18.0),(24.92,18.0)]),
 dict(name='Office',num='102',floor='wood',poly=[(24.43,28.0),(35.08,28.0),(35.08,37.51),(24.43,37.51)]),
 dict(name='Stair Hall',num='105',floor='wood',poly=[(35.5,24.14),(39.93,24.14),(39.93,46.5),(35.5,46.5)]),
 dict(name='Closet',num='119',floor='wood',poly=[(22.48,37.95),(35.08,37.95),(35.08,42.05),(22.48,42.05)]),
 dict(name='Stair',floor='wood',poly=[(22.48,42.05),(26.4,42.05),(26.4,42.49),(35.5,42.49),(35.5,46.5),(22.48,46.5)]),
 dict(name='Rec Room',num='106',floor='wood',poly=[(14.71,47.17),(22.48,47.17),(22.48,46.5),(39.93,46.5),(39.93,47.62),(44.56,47.62),(44.56,57.35),(39.93,57.35),(39.93,66.49),(33.09,66.49),(33.09,65.83),(14.71,65.83)]),
 dict(name='Closet',floor='wood',poly=[(14.71,66.92),(20.33,66.92),(20.33,69.06),(14.71,69.06)]),
 dict(name='Linen',num='108',floor='wood',poly=[(30.58,66.92),(33.09,66.92),(33.09,71.08),(30.58,71.08)]),
 dict(name='Hall',num='107',floor='wood',poly=[(33.53,66.49),(38.57,66.49),(38.57,100.5),(31.95,100.5),(31.95,94.51),(33.53,94.51)]),
 dict(name='Storage',floor='concrete',poly=[(39.0,67.61),(45.9,67.61),(45.9,87.08),(39.0,87.08)]),
 dict(name='Bedroom #4',num='108',floor='wood',poly=[(18.69,69.51),(30.17,69.51),(30.17,71.42),(33.09,71.42),(33.09,87.02),(18.69,87.02)]),
 dict(name='Bath #4',num='109',floor='tile',poly=[(18.69,87.47),(33.09,87.47),(33.09,94.05),(18.69,94.05)]),
 dict(name='Bunk Closet',num='112',floor='wood',poly=[(18.69,94.51),(27.0,94.51),(27.0,100.5),(18.69,100.5)]),
 dict(name='Linen',num='118',floor='wood',poly=[(27.44,94.51),(31.49,94.51),(31.49,96.0),(27.44,96.0)]),
 dict(name='Vestibule',floor='wood',poly=[(27.44,96.3),(31.49,96.3),(31.49,100.5),(27.44,100.5)]),
 dict(name='Bunk Room',num='110',floor='wood',poly=[(13.69,100.97),(31.49,100.97),(31.49,116.83),(13.69,116.83)]),
 dict(name='WC',floor='tile',poly=[(31.95,100.97),(38.57,100.97),(38.57,104.08),(31.95,104.08)]),
 dict(name='Bunk Bath',num='111',floor='tile',poly=[(31.95,104.42),(38.57,104.42),(38.57,116.83),(31.95,116.83)]),
]
F=[]
