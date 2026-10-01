# Tests

Browser tests that drive the page in Chromium with Playwright. They load `../src/app.html` with a few test hooks injected,
serve three.js from `vendor/three-r128.min.js` (so no network is needed), and write wrapped pages and screenshots to `out/`.

```sh
cd tests
npm install                     # installs Playwright
npx playwright install chromium # or set CHROMIUM=/path/to/chromium
node drag-and-walls.mjs light 393 780
node touch.mjs light 393 852 quick
node saved-layouts.mjs local    # and: cloud
node default-layout.mjs
node graphics-modes.mjs light   # and: dark
node screenshots.mjs look       # renders views to out/
```

Each prints what it checked and ends with `no errors` when the page logged no errors. Set `PLAYWRIGHT` to a Playwright
module path to use an existing install. They run on software rendering, so the photo-real mode is slow but works.
