# Built-in fixtures from the plans (house feet). (type, X, Z, rot, fy, opts)  rot: 0 = front faces south (+Z), 180 north, 90 east, -90 west.
# Sizes in opts are inches (like the furniture catalog); 'sinks'/'sinkAt'/'ovens' are feet from the piece's left end.
M=11.5; MD=14.0   # main floor; mudroom/laundry floor
WOOD='#b8956a'; WALNUT='#5b3d29'; WHITE='#e6e3dc'; NAVY='#2c3a52'
FIX=[
 # --- primary bath / WC
 ('vanity', 26.6, 1.5, 0, M, dict(w=114, d=25, h=34, sinks=[2.0,7.45], color=WOOD)),
 ('tub',    19.33, 4.03, 0, M, dict(w=41, d=79, h=22, style='deck')),
 ('sbench', 18.25, 10.0, 0, M, dict(w=18, d=48, h=18)),
 ('toilet', 33.3, 1.65, 0, M, dict()),
 ('washer', 33.05, 36.2, 180, M, dict(stack=True)),
 # --- kitchen
 ('counter', 42.7, 67.91, 0, M, dict(w=40.8, d=22.6, h=36, top='quartz', color=WHITE)),
 ('counter', 45.475, 71.635, -90, M, dict(w=112, d=25.8, h=36, top='quartz', color=WHITE, sink=True, sinkAt=4.68)),
 ('counter', 45.475, 77.075, -90, M, dict(w=18.6, d=25.8, h=36, top='quartz', color=WHITE)),
 ('range',  45.43, 79.85, -90, M, dict(w=48, d=27, h=36)),
 ('counter', 45.475, 82.425, -90, M, dict(w=13.8, d=25.8, h=36, top='quartz', color=WHITE)),
 ('fridge48', 45.475, 85.015, -90, M, dict(w=48.2, d=25.8, h=84)),
 ('counter', 37.2, 78.2, 90, M, dict(w=115, d=53, h=36, top='quartz', color=WALNUT, over='back', ovd=1.5)),
 ('tallcab', 33.0, 88.4, 180, M, dict(w=133.7, d=21.8, h=96, color=WHITE, ovens=[1.8], wine=[7.8])),
 # --- powder
 ('toilet', 48.75, 88.9, -90, M, dict()),
 ('vanity', 48.93, 93.25, -90, M, dict(w=42, d=24, h=34, sinks=[2.05], color=WALNUT)),
 # --- bath #2
 ('vanity', 29.5, 116.03, 180, M, dict(w=53, d=24.6, h=34, sinks=[3.1], color=WOOD)),
 ('toilet', 33.6, 115.87, 180, M, dict()),
 ('sbench', 36.77, 116.37, 0, M, dict(w=42, d=16, h=18)),
 # --- laundry / mudroom (floor 2'-6" up)
 ('counter', 40.0, 103.79, 90, MD, dict(w=67.6, d=24, h=36, top='quartz', color=WHITE, sink=True, sinkAt=2.2)),
 ('washer', 40.25, 108.3, 90, MD, dict(dryer=True)),
 ('washer', 40.25, 110.75, 90, MD, dict()),
 ('slab',   40.3, 109.34, 90, MD, dict(w=65.8, d=31.2, h=1.5, elev=37.5)),
 ('lockers', 55.0, 103.0, -90, MD, dict(w=72, d=24, h=90, color=WHITE, n=5)),
 # --- lower level: bath #3
 ('toilet', 33.2, 13.95, -90, 0, dict()),
 ('vanity', 33.38, 19.2, -90, 0, dict(w=91, d=24, h=34, sinks=[1.9,5.5], color=WOOD)),
 ('sbench', 26.65, 13.23, 0, 0, dict(w=40, d=18, h=18)),
 # --- bath #4
 ('toilet', 19.95, 92.88, 180, 0, dict()),
 ('vanity', 24.75, 93.05, 180, 0, dict(w=80, d=24, h=34, sinks=[3.5], color=WOOD)),
 ('sbench', 30.79, 93.22, 0, 0, dict(w=55, d=19.8, h=18)),
 # --- bunk bath, WC, bunk room
 ('vanity', 37.6, 107.25, -90, 0, dict(w=66, d=23.6, h=34, sinks=[1.6,3.9], color=WOOD)),
 ('toilet', 37.4, 102.45, -90, 0, dict()),
 ('tub',    34.95, 115.35, 0, 0, dict(w=59, d=37, h=22, style='free')),
 ('bunk',   17.4, 114.2, 180, 0, dict(w=86, d=62.8, h=74, color=WOOD)),
 ('bunk',   27.55, 114.2, 180, 0, dict(w=85, d=62.8, h=74, color=WOOD)),
 ('steps',  22.45, 114.2, 180, 0, dict(w=34.8, d=62.8, h=60, color=WOOD, n=4)),
 ('media',  22.45, 101.97, 0, 0, dict(w=96, d=24, h=24, color='#262220')),
 # --- lower wet bar and built-in dressers
 ('counter', 43.5, 52.53, -90, 0, dict(w=115.8, d=25.3, h=36, top='quartz', color=NAVY, sink=True, sinkAt=4.8)),
 ('console', 18.6, 26.65, 180, 0, dict(w=60, d=21, h=36, color=WOOD)),
 ('console', 21.4, 70.4, 0, 0, dict(w=60, d=21, h=36, color=WOOD)),
]
