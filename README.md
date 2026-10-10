# Ridgeline Residence

An interactive, to-scale 3D walkthrough of a mountain-modern home, both levels, built from its architectural plan set. "Ridgeline Residence" is a placeholder project name (set as `PROJECT` in `data/house.js`, plus the page title, loading screen and welcome panel in `src/app.html`, and `scripts/build-site.py`).

It is built from:

- **A2.1** main level and **A2.2** lower level floor plans (3/16″ = 1′-0″): every wall, door, window, room, stair, deck and terrace.
- **A4.1–A4.4** building sections: ceiling heights, vaulted and sloped ceilings, plate heights, roof slopes.
- **A3.1–A3.3** exterior elevations: roofs (1:12 shed roofs and low-slope roofs), chimneys, siding, stone, window heights and the grade.
- **The theater** (with the former mechanical room opened into it) is a detailed, adjustable room from its enlarged plan at ¼″ = 1′-0″.

Walk through any room, go up and down the stairs, step out onto the decks, move and add furniture on either level, try TV sizes,
floors, wall colors and lighting, and save layouts.

**Live site:** https://ridgeline-residence-3d-walkthrough.vercel.app/ (if the address ever changes, update `SITE_URL` in `src/app.html` and `SITE` in `scripts/build-site.py`, then rebuild)

## Using it

- The control card at the top left picks the **View** (**3D** spins the model, **Walk** puts you inside at eye height, **Plan** is the floor plan with room names) and the **Level** (**Exterior**, **Main level**, **Lower level** or the **Theater**). On a phone the same controls sit in two rows across the top.
- The dock along the bottom has **Add**, **Layouts**, **Finishes** (the theater's floor, walls, ceiling and size), the light button (midday, evening and dusk outside; Bright, Dim and Movie in the theater), **Photos** and **Undo**.
- The house opens furnished with "Layout 1" (the furnished theater plus furniture in every room). Those pieces are ordinary furniture: move, change or delete them.
- **Add** also has lighting (ring chandelier, globe, linear and drum pendants, table and floor lamps, sconces) and décor (plants, flowers, art in several styles, books, bowls, rugs). Lamps, vases and books set on a table, dresser or counter sit on top of it and move with it. Pendants hang from whatever ceiling is above them, and in Photo-real quality the lamps really light the room, most visibly in the evening and at dusk.
- **Photos → Render this view** turns what you see (3D or Walk) into a photograph of the same room with the furniture where you put it, in about half a minute. Photos stay in that browser; open one to compare it with the 3D view, go back to that view, download or delete it. See [Render this view](#render-this-view) for switching it on.
- Furniture is locked so looking around never moves anything. Tap **Edit furniture** to move, add or delete pieces, and **Done editing** to lock them again.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The site. One static page, no build step. three.js r128 loads from cdnjs. |
| `preview.jpg`, `apple-touch-icon.png`, `icon-64.png` | Link preview image (texts, email) and icons. |
| `src/app.html` | The source of the page. It is also the Claude artifact version (a body fragment). |
| `data/` | The house, digitized from the plans: `lower_data.py`, `main_data.py` (walls, openings, rooms), `site_data.py` (ceilings, roofs, chimneys, stairs, decks, terraces, grade), `fixtures_data.py` (kitchen, baths, laundry, built-ins), and `house.js` (the code that builds it). |
| `tex/` | Photo-scanned materials (floors, wood, stone, siding, decking, pavers, lawn, fabric, leather, tile). The page starts with its own drawn textures and swaps these in once they arrive. |
| `models/` | Scanned furniture and décor (curved velvet sofa, velvet accent chair, pouf, potted plant, vase of flowers) as compressed glTF, plus the three.js r128 glTF loader. Fetched only when a layout uses them. |
| `scripts/build-site.py` | Rebuilds `index.html` from `src/app.html` (adds the page shell, phone viewport, link-preview tags). |
| `scripts/fetch-assets.sh`, `scripts/build-textures.py`, `scripts/pack-models.mjs` | Download the scanned sources, then rebuild `tex/` and `models/` from them. |
| `api/render.js` | The server side of **Render this view** (a Vercel Function): holds the image service key, checks the limits, starts the job and hands back the finished photo. |
| `photos/` | Featured photos for the Photos panel (`index.json` lists them), added with `scripts/add-featured-photo.py`. |
| `bakeoff/`, `scripts/bakeoff-score.py`, `tests/bakeoff-views.mjs` | The image-model bake-off: ten views of the house with their guide images, and the script that scores how well each model's photos line up with them. |
| `tests/` | Browser tests (Playwright) and a test of `api/render.js`. See `tests/README.md`. |

Coordinates in `data/` are feet in the plans' own frame: X east of grid line A, Z south of grid line 1, heights above the lower floor (6766′-6″); the main floor is 11′-6″ above it.

## Making changes

1. To change the house, edit the files in `data/`, then run `python3 data/build_house.py && python3 data/inject.py` (this writes the house into `src/app.html`).
   For anything else, edit `src/app.html` directly (keep the part between `/*<house>*/` and `/*</house>*/` in step with `data/house.js`).
2. Run `python3 scripts/build-site.py` to regenerate `index.html`.
3. Commit; Vercel redeploys on push.

## Deploying on Vercel

Import the repo in Vercel and keep the defaults: framework preset **Other**, no build command, output directory = repo root.
`.vercelignore` keeps `src/`, `data/`, `scripts/`, `tests/` and the research and bake-off folders out of the deployment, so only the page, its images and `api/` are served.

## Render this view

**Photos → Render this view** captures the current view three ways: the Photo-real picture, an outline drawing of the exact geometry, and a depth map (`captureView` in `src/app.html`). It posts them with a short description of the room (its name, the light, the floor and the main pieces in view) to `api/render.js`. That function sends them to an image model with instructions to keep the camera, walls, windows and every piece of furniture exactly where they are, and only make the materials and light real. The page polls until the photo is ready, saves it in the browser (IndexedDB) and checks how well its edges line up with the outline drawing. A photo whose edges match less than half of the outline is marked as possibly not matching the 3D view.

The button stays hidden until the site has a key. To switch it on, in Vercel → Project → Settings → Environment Variables:

| Variable | What it is |
| --- | --- |
| `FAL_KEY` | API key from [fal.ai](https://fal.ai) (pay as you go). Required. |
| `RENDER_MODEL` | `nano-banana-pro` (default, about $0.15 a photo at 2K), `nano-banana-2`, `grok` (xAI Grok Imagine at 2K; Grok kept the furniture most exactly in the bake-off), `seedream` (Seedream 4.5, about $0.04), `seedream-5-lite` (Seedream 5.0 Lite, about $0.04; the Seedream family made the most photographic bake-off photo), `flux-2-pro` or `flux-depth`. |
| `RENDER_SECRET` | Any long random string. Signs job tickets and hashes visitor addresses. |
| `RENDER_PROMPT` | Optional. Your own instruction for the image model instead of the built-in one (in `api/render.js`), with `{scene}` where the room description goes. Change it and redeploy to try a different wording without touching the code. |
| `RENDER_DAILY_PER_VISITOR` | Photos per visitor per day (default 5). |
| `RENDER_DAILY_TOTAL` | Photos per day across everyone (default 100). |
| `RENDER_MONTHLY_BUDGET` | US dollars a month; rendering pauses once the estimated spend reaches it (default 20). |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | An Upstash Redis database (Vercel → Storage → Marketplace, free tier), so the limits hold across Vercel's servers. Without one they are counted per server instance, which is much looser. |

Then redeploy. Also set a spending limit or a prepaid balance on the fal.ai account itself as the last line of defence.

**Featured photos.** The Photos panel also has a Featured section that every visitor sees: photos shipped with the site in `photos/`, listed in `photos/index.json`, each next to the 3D view it was made from (so the compare slider and Go to this view work). Add one with `python3 scripts/add-featured-photo.py bakeoff/views/<view> <photo file> --model "<model name>"`, then rebuild and commit. These work without any image service key. Which model is the default should follow the bake-off (`bakeoff/`).

## How saving works on the site

- Layouts saved on the site live in that browser (local storage), so each person's saves stay on their own phone or computer.
- **Layouts → Send link to this layout** puts the whole layout in the link (`#L=…`). Whoever opens it sees that exact layout and can save it.
- The page opens to "Layout 1" (embedded in `src/app.html` as `DEFAULT_LAYOUT`: the furnished theater plus the furniture for the rest of the house), unless that browser has unsaved changes.
- Picture quality: **Finishes → Picture quality** switches between Photo-real (HDR, ambient occlusion, soft shadows that refine when the view is still) and Fast.

## Credits

The scanned materials and models are free assets; the CC-BY ones need this credit wherever the site is shown.

- **Wood, tile and plaster:** ambientCG Wood049, Tiles074 and PaintedPlaster017 (CC0), via the Open3D downloads.
- **Gravel and stone grain:** Poly Haven "Rocky Trail" (CC0), via PlayCanvas.
- **Lawn:** "Dark grass" from OpenGameArt, via the three.js examples.
- **Fabric:** Khronos glTF sample model SheenChair, © 2020 Wayfair LLC (CC0). **Velvet:** GlamVelvetSofa, © 2021 Wayfair LLC (CC-BY 4.0). **Leather:** SheenWoodLeatherSofa, © 2024 Darmstadt Graphics Group GmbH (CC-BY 4.0).
- **Models:** GlamVelvetSofa, © 2021 Wayfair LLC (CC-BY 4.0); SheenChair, © 2020 Wayfair LLC (CC0); SpecularSilkPouf, © 2023 Wayfair LLC (CC-BY 4.0); DiffuseTransmissionPlant, © 2024 Darmstadt Graphics Group GmbH (CC-BY 4.0); GlassVaseFlowers (CC0). All from the [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets).
- Licenses: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

