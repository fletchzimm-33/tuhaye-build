# Tuhaye house walkthrough

A to-scale 3D model of the whole house, both levels, built from the plan set:

- **A2.1** main level and **A2.2** lower level floor plans (3/16″ = 1′-0″): every wall, door, window, room, stair, deck and terrace.
- **A4.1–A4.4** building sections: ceiling heights, vaulted and sloped ceilings, plate heights, roof slopes.
- **A3.1–A3.3** exterior elevations: roofs (1:12 shed roofs and low-slope roofs), chimneys, siding, stone, window heights and the grade.
- **Theater 113** (with the former Mech #2 opened into it) is the same detailed, adjustable room as before, from sheet 8 at ¼″ = 1′-0″.

Walk through any room, go up and down the stairs, step out onto the decks, move and add furniture on either level, try TV sizes,
floors, wall colors and lighting, and save layouts.

**Live site:** https://tuhaye-build.vercel.app/ (if the address ever changes, update `SITE_URL` in `src/app.html` and `SITE` in `scripts/build-site.py`, then rebuild)

## Using it

- The buttons on the left pick what you see: **Outside** (the whole house and site), **Main**, **Lower**, or just the **Theater**.
- **3D** spins a model, **Walk** puts you inside at eye height, **Plan** is a floor plan with room names.
- The light button switches the theater between Bright, Dim and Movie, and the rest of the house between midday, evening and dusk.
- The house opens furnished the way the plans draw it (beds, sofas, dining, desk, rec room, bar). Those pieces are ordinary furniture: move, change or delete them.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The site. One static page, no build step. three.js r128 loads from cdnjs. |
| `preview.jpg`, `apple-touch-icon.png`, `icon-64.png` | Link preview image (texts, email) and icons. |
| `src/app.html` | The source of the page. It is also the Claude artifact version (a body fragment). |
| `data/` | The house, digitized from the plans: `lower_data.py`, `main_data.py` (walls, openings, rooms), `site_data.py` (ceilings, roofs, chimneys, stairs, decks, terraces, grade), `fixtures_data.py` (kitchen, baths, laundry, built-ins), and `house.js` (the code that builds it). |
| `scripts/build-site.py` | Rebuilds `index.html` from `src/app.html` (adds the page shell, phone viewport, link-preview tags). |
| `tests/` | Browser tests (Playwright). See `tests/README.md`. |

Coordinates in `data/` are feet in the plans' own frame: X east of grid line A, Z south of grid line 1, heights above the lower floor (6766′-6″); the main floor is 11′-6″ above it.

## Making changes

1. To change the house, edit the files in `data/`, then run `python3 data/build_house.py && python3 data/inject.py` (this writes the house into `src/app.html`).
   For anything else, edit `src/app.html` directly (keep the part between `/*<house>*/` and `/*</house>*/` in step with `data/house.js`).
2. Run `python3 scripts/build-site.py` to regenerate `index.html`.
3. Commit; Vercel redeploys on push.

## Deploying on Vercel

Import the repo in Vercel and keep the defaults: framework preset **Other**, no build command, output directory = repo root.
`.vercelignore` keeps `src/`, `data/`, `scripts/` and `tests/` out of the deployment, so only the page and its images are served.

## How saving works on the site

- Layouts saved on the site live in that browser (local storage), so each person's saves stay on their own phone or computer.
- **Layouts → Send link to this layout** puts the whole layout in the link (`#L=…`). Whoever opens it sees that exact layout and can save it.
- The page opens to "Fletchers Layout" (embedded in `src/app.html` as `DEFAULT_LAYOUT`) plus the plan furniture for the rest of the house, unless that browser has unsaved changes.
- Graphics: **Room → Graphics** switches between Photo-real (HDR, ambient occlusion, soft shadows that refine when the view is still) and Fast.
