# Theater 113 walkthrough

A to-scale 3D model of Theater 113 and the former Mech #2, built from sheet 8 of the plans (¼″ = 1′-0″).
Walk through the room, move furniture, try TV sizes, floors, wall colors and lighting, and save layouts.

**Live site:** https://tuhaye-build.vercel.app/ (if the address ever changes, update `SITE_URL` in `src/app.html` and `SITE` in `scripts/build-site.py`, then rebuild)

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The site. One static page, no build step. three.js r128 loads from cdnjs. |
| `preview.jpg`, `apple-touch-icon.png`, `icon-64.png` | Link preview image (texts, email) and icons. |
| `src/app.html` | The source of the page. It is also the Claude artifact version (a body fragment). |
| `scripts/build-site.py` | Rebuilds `index.html` from `src/app.html` (adds the page shell, phone viewport, link-preview tags). |
| `tests/` | Browser tests (Playwright). See `tests/README.md`. |

## Deploying on Vercel

Import the repo in Vercel and keep the defaults: framework preset **Other**, no build command, output directory = repo root.
`.vercelignore` keeps `src/`, `scripts/` and `tests/` out of the deployment, so only the page and its images are served.

## Making changes

1. Edit `src/app.html`.
2. Run `python3 scripts/build-site.py` to regenerate `index.html`.
3. Commit both; Vercel redeploys on push.

## How saving works on the site

- Layouts saved on the site live in that browser (local storage), so each person's saves stay on their own phone or computer.
- **Layouts → Send link to this layout** puts the whole layout in the link (`#L=…`). Whoever opens it sees that exact layout and can save it.
- The page opens to "Fletchers Layout" (embedded in `src/app.html` as `DEFAULT_LAYOUT`), unless that browser has unsaved changes.
- Graphics: **Room → Graphics** switches between Photo-real (HDR, ambient occlusion, soft shadows that refine when the view is still) and Fast.
