# MAIN LEVEL (A2.1).  House feet: X east of grid A, Z south of grid 1.  Floor 6778'-0" (y = 11.5 above lower floor).
# Same conventions as lower_data.py.  Mudroom / laundry / garage floors are at 6780'-6" (+2.5).
FLOOR=6778.0
W=[
 # ---------- primary bath (north wing)
 (17.03,0.0,17.83,0.67,'w'),            # NW corner
 (20.42,0.0,32.17,0.45,'w'),            # north wall (window 14 west of it, 13 east)
 (34.67,0.0,35.53,0.45,'w'),
 (35.07,0.45,35.53,3.33,'w'),           # east wall (window 12)
 (35.07,5.92,35.53,14.75,'w'),
 (17.03,0.67,17.47,0.9,'w'),            # west wall (windows 15a/15b over the tub)
 (17.03,7.67,17.47,12.02,'w'),
 (17.47,8.0,17.75,12.02,'w'),           # shower bench / west lining
 (17.75,7.85,24.58,8.0,'g',dict(h=7.5)),  # shower glass + door
 (24.58,8.0,24.75,12.02,'g',dict(h=7.5)),
 (24.75,8.0,26.58,8.25,'w'),            # linen
 (26.42,8.25,26.58,8.67,'w'),
 (31.32,0.45,31.77,3.3,'w'),            # WC partition (pocket 227)
 (30.58,6.49,35.07,6.77,'w'),           # WC south / ART niche north
 (30.53,6.77,30.97,8.75,'w'),           # ART niche west (door 225)
 (30.53,11.67,30.97,14.5,'w'),
 # ---------- primary bedroom
 (11.0,12.02,11.92,12.46,'w'),          # north wall (window 16)
 (14.5,12.02,30.97,12.46,'w'),
 (11.0,12.46,11.49,13.92,'w'),          # west wall (multi-slide to primary deck)
 (11.0,26.08,11.49,28.01,'w'),
 (11.0,27.56,11.92,28.01,'w'),          # south wall (window 17)
 (14.5,27.56,30.6,28.01,'w'),
 (34.58,27.56,35.53,28.01,'w'),
 (35.07,21.83,35.53,23.42,'w'),         # east wall south of window 11
 (35.53,23.0,36.75,23.42,'w'),          # vestibule north (window 10)
 (39.25,23.0,41.0,23.42,'w'),
 (40.55,23.42,41.0,24.0,'w',dict(ext='vsiding')),           # vestibule east (windows 9a/9b, 8a/8b)
 (40.55,31.5,41.0,38.92,'w',dict(ext='vsiding')),
 (40.55,45.6,41.0,46.4,'w',dict(ext='vsiding')),
 # ---------- walk-in + stair enclosure
 (22.02,28.01,22.49,31.25,'w'),         # walk-in west (window 18)
 (22.02,34.33,22.49,38.75,'w'),
 (22.02,45.6,22.49,46.96,'w'),          # stair west (tall window 19 between)
 (22.49,37.51,35.53,37.96,'w'),         # walk-in south / top of stair well
 (35.07,28.01,35.53,37.96,'w'),         # walk-in east
 (35.53,33.58,36.42,34.0,'w'),          # vestibule south (door 222)
 (39.67,33.58,40.55,34.0,'w'),
 # ---------- great room
 (14.03,46.51,15.5,46.96,'w'),          # north wall (windows 20a/20b)
 (18.83,46.51,22.02,46.96,'w'),
 (14.03,46.96,14.48,50.3,'w'),          # west wall (multi-slide 220 to view deck)
 (14.03,65.5,14.48,66.52,'w'),
 (40.55,46.51,45.99,46.96,'w'),         # games alcove north (window 7)
 (45.53,46.96,45.99,48.0,'w',dict(ext='vsiding')),          # games alcove east (windows 6a/6b)
 (45.53,55.33,45.99,58.51,'w',dict(ext='vsiding')),
 (40.55,58.05,45.99,58.51,'w'),         # games alcove south = covered entry north
 (40.55,58.51,41.0,58.92,'w',dict(ext='stone')),          # entry wall (pivot door 5, sidelights)
 (40.55,66.25,41.0,69.53,'w',dict(ext='stone')),
 # ---------- peninsula fireplace between great room and dining
 (15.7,66.52,27.5,69.53,'fp',dict(face='E',three=True)),  # 3-sided gas fireplace peninsula
 (21.05,24.4,27.7,27.56,'fp',dict(face='N')),            # primary bedroom fireplace
 # ---------- coats / kitchen
 (35.6,66.52,36.8,66.97,'w'),           # coats (door 219)
 (39.75,66.52,40.55,66.97,'w'),
 (35.6,66.97,36.03,69.53,'w'),
 (36.03,69.08,40.55,69.53,'w'),
 (41.0,66.52,44.0,66.97,'w'),           # kitchen north (window 4)
 (46.33,66.52,47.0,66.97,'w'),
 (46.55,66.97,47.0,67.2,'w'),           # kitchen east (windows 3a/3b/3c)
 (46.55,76.25,47.0,87.49,'w'),
 # ---------- dining
 (18.03,69.53,18.46,70.3,'w'),          # dining west (multi-slide 218 to view deck)
 (18.03,84.3,18.46,87.03,'w'),
 (18.03,87.03,18.5,87.49,'w'),          # dining south (multi-slide 217 to covered dining)
 (26.92,87.03,27.43,87.49,'w'),
 # ---------- pantry / powder
 (26.99,87.49,27.43,95.51,'w'),         # pantry west (window 24 to covered dining)
 (27.43,89.31,38.99,89.59,'w'),         # pantry north (wine / ice / ovens built-in in front)
 (38.57,87.03,38.99,89.31,'w'),
 (38.57,89.59,38.99,90.0,'w'),          # pantry east (door 216)
 (38.57,93.2,38.99,95.51,'w'),
 (26.99,95.51,38.99,95.97,'w'),         # pantry south / SW hall north (stair to mudroom open on its north side)
 (43.57,87.49,44.03,91.92,'w'),         # powder west (door 215)
 (43.57,94.8,44.03,95.97,'w'),
 (43.57,87.03,46.5,87.49,'w'),          # powder north (kitchen side)
 (49.93,87.03,50.53,88.0,'w'),
 (49.93,90.08,50.53,95.97,'w'),         # powder east
 (43.57,95.51,56.47,95.97,'w'),         # powder south / mudroom north
 # ---------- SW wing: hall, closet 209, closet #2, bath #2, bedroom #2
 (26.99,95.97,27.25,96.67,'w'),         # hall west (door 210 from covered dining)
 (26.99,99.83,27.43,101.33,'w'),
 (31.48,100.53,31.93,103.0,'w'),        # closet 209 west / closet #2 west (pocket 212)
 (31.48,108.6,31.93,110.97,'w'),
 (31.93,102.52,38.53,102.8,'w'),        # closet 209 south
 (27.43,105.03,31.48,105.31,'w'),       # hall south stub (bath #2 entry 213 below)
 (26.99,104.67,27.43,105.31,'w'),
 (26.99,110.5,27.25,117.05,'w'),        # bath #2 west
 (33.17,110.51,38.53,110.97,'w'),       # bath #2 north (pocket from closet #2)
 (27.25,110.51,29.6,110.97,'w'),
 (33.17,110.97,33.3,117.05,'g',dict(h=7.5)),   # shower glass
 (38.53,100.53,38.99,117.5,'w'),        # bath #2 / laundry party wall (east)
 (9.03,100.53,10.0,100.97,'w'),         # bedroom #2 north (door 214)
 (13.17,100.53,17.25,100.97,'w'),
 (17.25,100.53,23.5,100.97,'w'),        # behind the fireplace
 (23.5,100.53,26.99,100.97,'w'),
 (17.9,100.97,22.7,103.3,'fp',dict(face='S')),            # bedroom #2 fireplace
 (9.03,100.97,9.49,101.4,'w'),          # bedroom #2 west (windows 25a/25b TEMP)
 (9.03,110.25,9.49,113.05,'w'),
 (9.03,113.05,9.5,113.52,'w'),          # sitting jog (window 26)
 (12.5,113.05,13.45,113.52,'w'),
 (13.03,113.52,13.45,114.0,'w'),        # (window 27)
 (13.03,116.58,13.45,117.05,'w'),
 (13.03,117.05,13.9,117.5,'w'),         # south wall (windows 28, 29, 30)
 (16.5,117.05,24.0,117.5,'w'),
 (26.6,117.05,32.5,117.5,'w'),
 (34.58,117.05,38.99,117.5,'w'),
 # ---------- laundry / mudroom
 (38.99,112.08,43.25,112.52,'w'),       # laundry south (window 31 east of it)
 (45.75,112.08,49.0,112.52,'w'),
 (52.25,112.08,56.47,112.52,'w'),       # mudroom south (door 206 to dog run)
 (47.2,100.53,47.65,105.58,'w'),        # laundry / mudroom (door 207 below)
 (47.2,111.83,47.65,112.08,'w'),
 (39.0,100.53,47.65,100.97,'w'),        # laundry north / stair landing south
 (43.08,100.97,43.25,103.24,'w'),       # laundry closet
 (43.08,103.24,47.2,103.52,'w'),
 (53.5,106.0,56.0,106.25,'w'),          # mudroom closet front (bifold)
 # ---------- garage, refuse, toy storage
 (56.01,87.0,56.47,92.5,'w',dict(ext='stone')),           # garage west / mudroom east (stone veneer outside)
 (56.01,92.5,56.47,96.42,'w'),
 (56.01,99.58,56.47,117.05,'w'),
 (56.47,92.08,59.0,92.58,'w',dict(ext='vsiding')),         # garage north (door 203)
 (69.5,88.4,71.6,92.58,'p',dict(top=6792.5)),  # stone pier + steel column between the doors
 (89.6,90.58,91.58,91.08,'w',dict(ext='vsiding')),          # (door 202 east jamb)
 (91.58,89.0,92.0,94.08,'w',dict(ext='vsiding')),           # meter wall
 (92.0,93.5,96.5,94.08,'w',dict(ext='vsiding')),            # refuse north
 (96.5,93.5,96.92,94.17,'w',dict(ext='vsiding')),
 (101.5,93.5,103.35,94.08,'w',dict(ext='vsiding')),
 (91.58,97.33,92.0,98.42,'w'),          # refuse west (door 201)
 (92.0,98.5,95.83,98.92,'w'),           # refuse south
 (95.92,98.5,103.35,98.92,'w'),
 (96.5,97.33,96.92,98.92,'w'),
 (103.35,93.5,104.02,112.5,'w',dict(ext='stone')),        # toy storage east
 (56.47,116.83,58.0,117.5,'w',dict(wain=5.0)),  # garage south (windows 32a/32b, 33)
 (64.2,116.83,66.6,117.5,'w',dict(wain=5.0)),
 (69.0,116.83,77.0,117.5,'w',dict(wain=5.0)),
 (77.0,116.83,92.0,117.5,'w',dict(ext='stone')),
 (92.0,111.9,103.35,112.5,'w',dict(ext='stone')),         # toy storage south (gas meter enclosure outside)
]
O=[
 ('win',17.83,0.0,20.42,0.45,dict(tag='14')),
 ('win',32.17,0.0,34.67,0.45,dict(tag='13')),
 ('win',35.07,3.33,35.53,5.92,dict(tag='12',sill=3.8)),
 ('win',17.03,0.9,17.47,7.67,dict(tag='15')),
 ('gdoor',20.9,7.85,23.5,8.0,dict()),
 ('bifold',26.42,8.67,26.58,12.02,dict(tag='226',h=8)),
 ('pocket',31.32,3.3,31.77,6.49,dict(tag='227',h=8)),
 ('door',30.53,8.75,30.97,11.67,dict(tag='225',h=8,swing=-1,hinge=1)),
 ('win',11.92,12.02,14.5,12.46,dict(tag='16')),
 ('slide',11.0,13.92,11.49,26.08,dict(h=8)),
 ('win',11.92,27.56,14.5,28.01,dict(tag='17')),
 ('pocket',30.6,27.56,34.58,28.01,dict(tag='223',h=8)),
 ('win',35.07,14.75,35.53,21.83,dict(tag='11')),
 ('win',36.75,23.0,39.25,23.42,dict(tag='10')),
 ('win',40.55,24.0,41.0,31.5,dict(tag='9')),
 ('win',40.55,38.92,41.0,40.7,dict(tag='8b')),
 ('door',40.55,40.7,41.0,45.6,dict(tag='8a',h=8,glass=True,swing=1,hinge=0)),
 ('win',22.02,31.25,22.49,34.33,dict(tag='18')),
 ('win',22.02,38.75,22.49,45.6,dict(tag='19',sill=-1.5,head=8.1)),
 ('door',36.42,33.58,39.67,34.0,dict(tag='222',h=8,swing=-1,hinge=0)),
 ('win',15.5,46.51,18.83,46.96,dict(tag='20')),
 ('slide',14.03,50.3,14.48,65.5,dict(tag='220',h=8.0,tr=(9.0,12.54))),
 ('win',42.0,46.51,44.0,46.96,dict(tag='7')),
 ('win',45.53,48.0,45.99,55.33,dict(tag='6')),
 ('pivot',40.55,58.92,41.0,63.6,dict(tag='5',h=9)),
 ('win',40.55,63.6,41.0,66.25,dict(tag='5a',floor=True)),
 ('door',36.8,66.52,39.75,66.97,dict(tag='219',h=8,swing=-1,hinge=1)),
 ('win',44.0,66.52,46.33,66.97,dict(tag='4',sill=3.6)),
 ('win',46.55,67.2,47.0,76.25,dict(tag='3',sill=3.6)),
 ('slide',18.03,70.3,18.46,84.3,dict(tag='218',h=8.0,tr=(9.0,12.04))),
 ('slide',18.5,87.03,26.92,87.49,dict(tag='217',h=8.0)),
 ('win',26.99,89.8,27.43,95.3,dict(tag='24')),
 ('door',38.57,90.0,38.99,93.2,dict(tag='216',h=8,swing=1,hinge=1)),
 ('door',43.57,91.92,44.03,94.8,dict(tag='215',h=8,swing=1,hinge=1)),
 ('win',49.93,88.0,50.53,90.08,dict(tag='1',sill=4.0)),
 ('win',46.5,87.03,49.93,87.49,dict(tag='2',sill=4.0)),
 ('door',26.99,96.67,27.25,99.83,dict(tag='210',h=8,swing=1,hinge=0)),
 ('bifold',31.93,100.53,38.53,100.97,dict(tag='209',h=8)),
 ('pocket',31.48,103.0,31.93,108.6,dict(tag='212',h=8)),
 ('door',26.99,101.33,27.43,104.67,dict(tag='211',h=8,swing=-1,hinge=0)),
 ('pocket',29.6,110.51,33.17,110.97,dict(tag='213',h=8)),
 ('door',10.0,100.53,13.17,100.97,dict(tag='214',h=8,swing=1,hinge=0)),
 ('win',9.03,101.4,9.49,110.25,dict(tag='25')),
 ('win',9.5,113.05,12.5,113.52,dict(tag='26')),
 ('win',13.03,114.0,13.45,116.58,dict(tag='27')),
 ('win',13.9,117.05,16.5,117.5,dict(tag='28')),
 ('win',24.0,117.05,26.6,117.5,dict(tag='29')),
 ('win',32.5,117.05,34.58,117.5,dict(tag='30',sill=4.0)),
 ('win',43.25,112.08,45.75,112.52,dict(tag='31',sill=2.6,head=8.1)),
 ('door',49.0,112.08,52.25,112.52,dict(tag='206',h=8,glass=True,swing=-1,hinge=0)),
 ('door',47.2,105.58,47.65,111.83,dict(tag='207',h=8,swing=1,hinge=1,pair=True)),
 ('door',56.01,96.42,56.47,99.58,dict(tag='204',h=8,swing=1,hinge=0)),
 ('bifold',53.5,106.25,56.0,112.0,dict()),
 ('garage',59.0,92.08,69.5,92.58,dict(tag='203',h=8.5)),
 ('garage',71.6,90.58,89.6,91.08,dict(tag='202',h=8.5)),
 ('door',91.58,94.08,92.0,97.33,dict(tag='201',h=7,swing=1,hinge=0)),
 ('door2',96.92,93.5,101.5,94.08,dict(tag='200',h=7)),
 ('win',58.0,116.83,64.2,117.5,dict(tag='32',sill=4.0,head=8.8)),
 ('win',66.6,116.83,69.0,117.5,dict(tag='33',sill=4.0,head=8.8)),
]
# rooms (interior faces).  fl = floor finish, dy = floor offset above the level (mudroom/laundry/garage +2.5)
R=[
 dict(name='Primary Bath',num='200',floor='tile',poly=[(17.47,0.45),(31.32,0.45),(31.32,6.49),(30.53,6.49),(30.53,12.02),(17.47,12.02)]),
 dict(name='WC',floor='tile',poly=[(31.77,0.45),(35.07,0.45),(35.07,6.49),(31.77,6.49)]),
 dict(name='Primary Bedroom',num='201',floor='wood',poly=[(11.49,12.46),(30.97,12.46),(30.97,6.77),(35.07,6.77),(35.07,23.42),(35.53,23.42),(35.53,27.56),(11.49,27.56)]),
 dict(name='Primary Hall',floor='wood',poly=[(35.53,23.42),(40.55,23.42),(40.55,33.58),(35.53,33.58)]),
 dict(name='Walk-in',num='202',floor='wood',poly=[(22.49,28.01),(35.07,28.01),(35.07,37.51),(22.49,37.51)]),
 dict(name='Stair Hall',floor='wood',poly=[(35.53,34.0),(40.55,34.0),(40.55,46.51),(35.53,46.51)]),
 dict(name='Great Room',num='203',floor='wood',poly=[(14.48,46.96),(22.49,46.96),(22.49,46.51),(40.55,46.51),(40.55,46.96),(45.53,46.96),(45.53,58.05),(41.0,58.05),(41.0,66.52),(15.7,66.52),(15.7,65.2),(14.48,65.2)]),
 dict(name='Dining / Kitchen',num='204',floor='wood',poly=[(18.46,69.53),(27.5,69.53),(27.5,66.52),(35.6,66.52),(35.6,69.53),(41.0,69.53),(41.0,66.97),(46.55,66.97),(46.55,87.03),(43.57,87.03),(43.57,87.49),(38.99,87.49),(38.99,89.31),(27.43,89.31),(27.43,87.49),(18.46,87.49)]),
 dict(name='Coats',floor='wood',poly=[(36.03,66.97),(39.75,66.97),(39.75,69.08),(36.03,69.08)]),
 dict(name='Pantry',num='206',floor='wood',poly=[(27.43,89.59),(38.57,89.59),(38.57,95.51),(27.43,95.51)]),
 dict(name='Powder',num='207',floor='tile',poly=[(44.03,87.49),(49.93,87.49),(49.93,95.51),(44.03,95.51)]),
 dict(name='Hall',floor='wood',poly=[(38.99,87.49),(43.57,87.49),(43.57,100.53),(31.48,100.53),(31.48,105.03),(27.43,105.03),(27.43,95.97),(38.99,95.97)]),
 dict(name='Mudroom',num='208',floor='tile',dy=2.5,poly=[(43.57,95.97),(56.01,95.97),(56.01,112.08),(47.65,112.08),(47.65,100.97),(43.57,100.97)]),
 dict(name='Laundry',num='209',floor='tile',dy=2.5,poly=[(38.99,100.97),(47.2,100.97),(47.2,112.08),(38.99,112.08)]),
 dict(name='Bedroom #2',num='211',floor='wood',poly=[(9.49,100.97),(26.99,100.97),(26.99,105.31),(31.48,105.31),(31.48,110.51),(26.99,110.51),(26.99,117.05),(13.45,117.05),(13.45,113.52),(9.49,113.52)]),
 dict(name='Closet',num='209',floor='wood',poly=[(31.93,100.97),(38.53,100.97),(38.53,102.52),(31.93,102.52)]),
 dict(name='Closet #2',num='210',floor='wood',poly=[(31.93,102.8),(38.53,102.8),(38.53,110.51),(31.93,110.51)]),
 dict(name='Bath #2',num='212',floor='tile',poly=[(27.25,110.97),(38.53,110.97),(38.53,117.05),(27.25,117.05)]),
 dict(name='Garage',num='213',floor='concrete',dy=2.5,poly=[(56.47,92.58),(71.6,92.58),(71.6,91.08),(91.58,91.08),(91.58,98.92),(103.35,98.92),(103.35,111.9),(92.0,111.9),(92.0,116.83),(56.47,116.83)]),
 dict(name='Refuse',floor='concrete',dy=2.5,poly=[(92.0,94.08),(103.35,94.08),(103.35,98.5),(92.0,98.5)]),
]
F=[]
