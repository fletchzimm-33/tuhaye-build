# Tests

Browser tests that drive the page in Chromium with Playwright. They load `../src/app.html` with a few test hooks injected,
serve three.js from `vendor/three-r128.min.js` (so no network is needed), and write wrapped pages and screenshots to `out/`.
Each test links `out/tex` and `out/models` to the repo's own folders, so the wrapped pages find the scanned textures and models.

```sh
cd tests
npm install                     # installs Playwright
npx playwright install chromium # or set CHROMIUM=/path/to/chromium
node drag-and-walls.mjs light 393 780
node touch.mjs light 393 852 quick
node saved-layouts.mjs local    # and: cloud
node default-layout.mjs
node graphics-modes.mjs light   # and: dark
node house.mjs                  # the whole house: stairs, walls, doorways, furniture on both levels
node edit-lock.mjs              # furniture stays put until Edit furniture is on
node screenshots.mjs look       # renders views to out/
node photos.mjs                 # Render this view and the Photos library, against a stand-in image service (add 393 for phone size)
node render-api.mjs             # api/render.js with fal.ai and the limits store stood in (no browser)
node bakeoff-views.mjs final    # exports the bake-off views and their guide images to ../bakeoff/views/
```

Each prints what it checked and ends with `no errors` when the page logged no errors. Set `PLAYWRIGHT` to a Playwright
module path to use an existing install. They run on software rendering, so the photo-real mode is slow but works.
