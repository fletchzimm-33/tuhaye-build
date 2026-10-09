#!/usr/bin/env python3
"""Adds a photo to the Featured section of the Photos panel (photos/index.json), next to the 3D view it was made from.

  python3 scripts/add-featured-photo.py bakeoff/views/01-great-room path/to/photo.png --model "Grok Image 2.0" [--title "Great room"]

Copies the photo and the view's 3D picture into photos/ as JPEGs, and records the view (so "Go to this view" works), the room,
the light, the model and how well the photo lines up with the 3D outline (the same measure the page uses after a render).
"""
import argparse, datetime, json, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
OUT = os.path.join(ROOT, 'photos')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('view'), ap.add_argument('photo')
    ap.add_argument('--model', required=True), ap.add_argument('--title'), ap.add_argument('--id')
    a = ap.parse_args()
    meta = json.load(open(os.path.join(a.view, 'view.json')))
    where = meta.get('where', {})
    title = a.title or (where.get('room') or where.get('level') or meta['name']).replace(' / ', ' and ')
    pid = a.id or re.sub(r'[^a-z0-9]+', '-', f"{meta['name']}-{a.model}".lower()).strip('-')
    os.makedirs(OUT, exist_ok=True)
    Image.open(a.photo).convert('RGB').save(os.path.join(OUT, pid + '.jpg'), quality=90, optimize=True)
    Image.open(os.path.join(a.view, 'beauty.jpg')).convert('RGB').save(os.path.join(OUT, pid + '-3d.jpg'), quality=86, optimize=True)
    match = None
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location('score', os.path.join(ROOT, 'scripts', 'bakeoff-score.py'))
        score = importlib.util.module_from_spec(spec); spec.loader.exec_module(score)
        match = score.score(a.view, a.photo)['match']
    except Exception as e:  # scoring is a nice-to-have
        print('not scored:', e)
    w, h = Image.open(a.photo).size
    idx_path = os.path.join(OUT, 'index.json')
    idx = json.load(open(idx_path)) if os.path.exists(idx_path) else []
    idx = [p for p in idx if p['id'] != pid]
    idx.append({'id': pid, 'title': title, 'level': where.get('level', ''), 'light': meta.get('light', ''), 'model': a.model,
                'created': datetime.date.today().isoformat(), 'photo': pid + '.jpg', 'render': pid + '-3d.jpg', 'w': w, 'h': h,
                'match': match, 'view': meta['view']})
    json.dump(idx, open(idx_path, 'w'), indent=1)
    print(f'added {pid}: {title}, {a.model}, line match {match}')


if __name__ == '__main__':
    main()
