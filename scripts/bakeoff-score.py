#!/usr/bin/env python3
"""Scores the bake-off: how well each AI photo lines up with the 3D view it was made from.

  python3 scripts/bakeoff-score.py            reads bakeoff/views/<view>/ and bakeoff/results/<engine>/<view>.(jpg|png|webp)
                                              writes bakeoff/scores.json and bakeoff/sheets/<view>.jpg, prints a table

For every photo, at 512 px wide:
  line match    share of the 3D outline (lines.png) that has an edge in the photo within 2 px. Walls, windows, beams and
                furniture that stayed put keep this high; a moved window or a re-shaped sofa drops it.
  pieces kept   furniture covering at least 1% of the frame whose own outline still matches at least 35%.
  wall clutter  share of bare wall and ceiling (from ids.png, away from any outline) that the photo fills with strong edges:
                added windows, shelves, art or lamps that are not in the scene.
  reframed      whether a small shift or zoom of the photo lines up much better than none (the model moved the camera).
The same line-match measure runs in the page after each render (photoMatch in src/app.html).
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEWS, RESULTS, OUT = (os.path.join(ROOT, 'bakeoff', d) for d in ('views', 'results', ''))
W = 512
SHELL = {(120, 120, 120): 'wall', (80, 50, 50): 'floor', (120, 120, 80): 'ceiling'}


def gray(path, w, h):
    return np.asarray(Image.open(path).convert('L').resize((w, h), Image.LANCZOS), dtype=np.float32)


def sobel(g):
    p = np.pad(g, 1, mode='edge')
    gx = (p[:-2, 2:] + 2 * p[1:-1, 2:] + p[2:, 2:]) - (p[:-2, :-2] + 2 * p[1:-1, :-2] + p[2:, :-2])
    gy = (p[2:, :-2] + 2 * p[2:, 1:-1] + p[2:, 2:]) - (p[:-2, :-2] + 2 * p[:-2, 1:-1] + p[:-2, 2:])
    return np.hypot(gx, gy)


def dilate(m, r):
    out = m.copy()
    p = np.pad(m, r)
    h, w = m.shape
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= p[r + dy:r + dy + h, r + dx:r + dx + w]
    return out


def edges(g):
    mag = sobel(g)
    return mag >= max(24.0, float(np.percentile(mag, 85)))


def shift_scale(m, s, dx, dy):
    """the mask as seen through a camera zoomed by s and shifted by (dx, dy) pixels (nearest neighbour)"""
    h, w = m.shape
    ys, xs = np.mgrid[0:h, 0:w]
    sx = np.clip(((xs - w / 2 - dx) / s + w / 2).round().astype(int), 0, w - 1)
    sy = np.clip(((ys - h / 2 - dy) / s + h / 2).round().astype(int), 0, h - 1)
    return m[sy, sx]


def score(view_dir, photo):
    meta = json.load(open(os.path.join(view_dir, 'view.json')))
    H = round(W * meta['h'] / meta['w'])
    lines = gray(os.path.join(view_dir, 'lines.png'), W, H) < 200
    ids = np.asarray(Image.open(os.path.join(view_dir, 'ids.png')).convert('RGB').resize((W, H), Image.NEAREST), dtype=np.int32)
    out = edges(gray(photo, W, H))
    near = dilate(out, 2)
    n = int(lines.sum())
    match = float((lines & near).sum() / n) if n else 0.0
    # reframing: does a small shift or zoom line up clearly better?
    best = (match, 1.0, 0, 0)
    for s in (0.96, 0.98, 1.0, 1.02, 1.04):
        for dx in range(-12, 13, 4):
            for dy in range(-12, 13, 4):
                if s == 1.0 and dx == 0 and dy == 0:
                    continue
                m = float((lines & dilate(shift_scale(out, s, dx, dy), 2)).sum() / n) if n else 0
                if m > best[0]:
                    best = (m, s, dx, dy)
    # pieces
    pieces = []
    for it in meta['items']:
        if it['share'] < 0.01:
            continue
        c = tuple(int(it['color'][i:i + 2], 16) for i in (1, 3, 5))
        mask = np.all(ids == c, axis=2)
        if mask.sum() < 30:
            continue
        own = lines & dilate(mask, 2)
        k = int(own.sum())
        r = float((own & near).sum() / k) if k else 1.0
        pieces.append({'id': it['id'], 'desc': it['desc'], 'share': it['share'], 'match': round(r, 3), 'kept': r >= 0.35})
    # clutter on bare wall and ceiling
    bare = np.zeros((H, W), bool)
    for c, k in SHELL.items():
        if k != 'floor':
            bare |= np.all(ids == c, axis=2)
    bare &= ~dilate(lines, 6)
    clutter = float((out & bare).sum() / bare.sum()) if bare.sum() > 500 else None
    return {
        'match': round(match, 3),
        'pieces_kept': sum(p['kept'] for p in pieces), 'pieces': len(pieces),
        'lost': [p['desc'] for p in pieces if not p['kept']],
        'wall_clutter': None if clutter is None else round(clutter, 3),
        'reframed': best[0] - match > 0.08,
        'best_shift': {'match': round(best[0], 3), 'zoom': best[1], 'dx': best[2], 'dy': best[3]},
        'piece_detail': pieces,
    }


def sheet(view, view_dir, engines):
    """the 3D view next to each engine's photo, for looking at"""
    tiles = [('3D view', os.path.join(view_dir, 'beauty.jpg'))]
    for e in engines:
        p = find(e, view)
        if p:
            tiles.append((e, p))
    tw, th = 480, 270
    from PIL import ImageDraw
    img = Image.new('RGB', (tw * min(3, len(tiles)), (th + 22) * ((len(tiles) + 2) // 3)), 'white')
    d = ImageDraw.Draw(img)
    for k, (label, p) in enumerate(tiles):
        x, y = (k % 3) * tw, (k // 3) * (th + 22)
        img.paste(Image.open(p).convert('RGB').resize((tw, th), Image.LANCZOS), (x, y + 22))
        d.text((x + 6, y + 5), label, fill=(20, 20, 20))
    os.makedirs(os.path.join(OUT, 'sheets'), exist_ok=True)
    img.save(os.path.join(OUT, 'sheets', view + '.jpg'), quality=84)


def find(engine, view):
    for ext in ('jpg', 'jpeg', 'png', 'webp'):
        p = os.path.join(RESULTS, engine, f'{view}.{ext}')
        if os.path.exists(p):
            return p
    return None


def main():
    views = sorted(d for d in os.listdir(VIEWS) if os.path.isdir(os.path.join(VIEWS, d)))
    engines = sorted(d for d in os.listdir(RESULTS) if os.path.isdir(os.path.join(RESULTS, d))) if os.path.isdir(RESULTS) else []
    if len(sys.argv) > 1:
        engines = [e for e in engines if e in sys.argv[1:]]
    scores = {}
    for e in engines:
        scores[e] = {}
        for v in views:
            p = find(e, v)
            if p:
                scores[e][v] = score(os.path.join(VIEWS, v), p)
    for v in views:
        sheet(v, os.path.join(VIEWS, v), engines)
    json.dump(scores, open(os.path.join(OUT, 'scores.json'), 'w'), indent=1)
    print(f"{'engine':24} {'views':>5} {'line match':>10} {'pieces kept':>11} {'wall clutter':>12} {'reframed':>8}")
    for e, s in scores.items():
        if not s:
            continue
        vals = list(s.values())
        kept = sum(x['pieces_kept'] for x in vals), sum(x['pieces'] for x in vals)
        cl = [x['wall_clutter'] for x in vals if x['wall_clutter'] is not None]
        print(f"{e:24} {len(vals):5} {np.mean([x['match'] for x in vals]):10.3f} {kept[0]:5}/{kept[1]:<5} {np.mean(cl) if cl else float('nan'):12.3f} {sum(x['reframed'] for x in vals):8}")
    # the 3D render itself, as the ceiling for line match
    base = [score(os.path.join(VIEWS, v), os.path.join(VIEWS, v, 'beauty.jpg'))['match'] for v in views]
    print(f"{'(3D render itself)':24} {len(base):5} {np.mean(base):10.3f}")


if __name__ == '__main__':
    main()
