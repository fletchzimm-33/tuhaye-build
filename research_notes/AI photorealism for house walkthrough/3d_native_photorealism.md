# 3D-native routes to photorealism for the Ridgeline Residence walkthrough (as of 9 Oct 2026)

Scope: options that make the 3D scene itself more photoreal (not image post-processing) for a three.js r128, single-page, static-on-Vercel, desktop and mobile walkthrough with drag-and-drop furniture (JSON layouts: type, x, z, rot, w, d, h, color).

Method note: several primary sites (worldlabs.ai, docs.worldlabs.ai, sparkjs.dev, radiancefields.com, invideo.io, buttondown.com, api.cdnjs.com) were unreachable from the research environment (DNS or proxy refusal). For those, figures come from search-result excerpts or third-party pages and are flagged. Library version and compatibility facts were checked directly against the npm registry on 2026-10-09, and three.js r186 features were checked by listing and reading files in the published `three@0.186.1` npm tarball. These are primary evidence.

## 1. Gaussian splatting and AI "world models": can a splat of each room be the photoreal backdrop with editable mesh furniture composited in, and which three.js renderers work with r128?

### Takeaway
Technically yes, but none of the maintained splat renderers work with r128. Spark (World Labs, MIT) needs three.js >= r180 and still runs on the ordinary WebGLRenderer. three.js's own new `GaussianSplat` (r186) needs WebGPURenderer. The older GaussianSplats3D and Luma libraries need r157/r160+ and are no longer maintained. Splats carry baked lighting and do not receive real-time shadows, so editable mesh furniture will not match them exactly without extra work (shadow-catcher proxies, light matching). On the AI-world side, World Labs Marble is the only shipped product that exports web-usable splats and meshes. Genie 3 exports video only. Tencent HY-World 2.0 is open source but early.

### Cited Findings
**three.js splat renderers (primary: npm registry, checked 2026-10-09)**
- Spark `@sparkjsdev/spark` latest is 2.3.1, published 2026-10-01. Its peerDependency is `three >= 0.180.0` (r180). The README quick-start uses a plain `THREE.WebGLRenderer` with `SparkRenderer` and `SplatMesh` — [npm registry: @sparkjsdev/spark](https://registry.npmjs.org/@sparkjsdev/spark); [GitHub sparkjsdev/spark](https://github.com/sparkjsdev/spark)
- Spark features (README): it "Integrates with THREE.js rendering pipeline to fuse splat and mesh-based objects", targets "98%+ WebGL2 support", "Renders fast even on low-powered mobile devices", sorts multiple splat objects correctly, and supports .PLY (including compressed), .SPZ, .SPLAT, .KSPLAT and .SOG. Splats can be transformed, recolored, displaced and skeletally animated in real time. License MIT; "Built by World Labs" — [GitHub sparkjsdev/spark](https://github.com/sparkjsdev/spark)
- Spark's own docs disagree on the version floor: an LoD page (marked work-in-progress) says "Requires Three.js r179 or later" for extended splat encoding. A third-party profile says r180+ — [Spark LoD docs (search excerpt; site unreachable)](https://sparkjs.dev/docs/new-spark-renderer/); [radiancefields.com Spark profile (search excerpt)](https://radiancefields.com/platforms/spark). The npm peerDependency (>=0.180.0) is authoritative.
- Spark performance guidance gives rule-of-thumb splat budgets for 60+ fps: iPhone 1–3 million, Android phones 1–2 million, Quest 3 at most 1 million. It notes around 1 million splats "becomes a bottleneck on some systems". Spark 2.x has LoD trees and paged streaming, with a shared GPU "splat page table" defaulting to 16M splats — [Spark performance docs (search excerpt; site unreachable)](https://sparkjs.dev/docs/performance/)
- three.js r186 (`three@0.186.1`, published 2026-09-24) ships a native `examples/jsm/objects/GaussianSplat.js`, plus `GaussianSplatPLYLoader`, `KSPLATLoader`, `SPLATLoader` and a `GLTFGaussianSplatLoaderExtension` for `KHR_gaussian_splatting`. The class doc says: "this class can only be used with WebGPURenderer. The `forceWebGL` fallback of WebGPURenderer is supported, but WebGLRenderer is not." It sorts on the GPU (CountingSort) — [npm tarball three-0.186.1.tgz, file examples/jsm/objects/GaussianSplat.js](https://registry.npmjs.org/three/-/three-0.186.1.tgz); [npm: three](https://www.npmjs.com/package/three)
- GaussianSplats3D (mkkellogg) latest is 0.4.7, published 2025-01-25, with peer `three >= 0.160.0`. An index reports the last push in Feb 2025 and 71 open issues. It can render a user-supplied three.js scene alongside splats via a `threeScene` parameter — [npm registry](https://registry.npmjs.org/@mkkellogg/gaussian-splats-3d); [ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fmkkellogg%2FGaussianSplats3D); [GitHub](https://github.com/mkkellogg/GaussianSplats3D)
- Luma `@lumaai/luma-web` latest is 0.2.2, published 2024-03-06, with peer `three ^0.157.0`. It is WebGL-only — [npm registry](https://registry.npmjs.org/@lumaai/luma-web). A guide notes that since Dream Machine became Luma's flagship, capture users are moving to "actively developed alternatives" — [radiancefields.com (search excerpt)](https://radiancefields.com/luma-ai-alternatives)
- PlayCanvas (not three.js) claimed in June 2026 that a 24-million-Gaussian scan streamed to a browser at "a solid 60 fps" using a compute-based WebGPU renderer with automatic LoD streaming. The device was not specified — [CGWorld (search excerpt)](https://cgworld.jp/flashnews/01-202606-SuperSplat.html)

**World Labs Marble (shipped product)**
- Marble launched publicly on 12 Nov 2025. It accepts text, single images, multiple images (with prompts mapping images to front/back/left/right), video, and coarse 3D layouts — [World Labs blog (search excerpt; site unreachable)](https://www.worldlabs.ai/blog/marble-world-model); [The Batch / DeepLearning.AI](https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool)
- Chisel is an experimental mode for when "exact sizes and positions of objects matter". Users block out structure with boxes and planes, or import existing 3D assets, then a text prompt sets the style — [The Batch](https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool)
- Exports (third-party summaries; the official docs page was unreachable): Gaussian splats as .spz or .ply at about 2M splats (full) or 500k (lightweight, for real-time use). There is also a 100k–200k-triangle collider mesh (GLB) and, on Pro, a high-quality textured GLB mesh, plus 360 panoramas — [therundown.ai](https://www.therundown.ai/tools/marble); [radiancefields.com World Labs (search excerpt)](https://radiancefields.com/platforms/world-labs); [Marble export docs (title only)](https://docs.worldlabs.ai/marble/export/gaussian-splat/index)
- Pricing (third-party, may be stale): Free $0 (no export); Standard $20/mo (SPZ/PLY splats, panoramas, low-res collider mesh; 12 multi-image/video/3D-layout outputs); Pro $35/mo (high-quality textured GLB and commercial rights); Max $95/mo. API: $1.00 per 1,250 credits, with a marble-1.1 world at 1,500 credits (about $1.20), a draft world at 150 credits (about $0.12), and a mesh export at 3,500 credits (about $2.80) — [therundown.ai](https://www.therundown.ai/tools/marble); [The Batch](https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool)
- Vendor risk: AMD signed an agreement (26–28 Sep 2026) to acquire World Labs for about $8.2B in stock, expected to close by the end of 2026. Fei-Fei Li is to become AMD EVP and Chief Scientist. One commentary notes that the announcements say nothing about Marble or World API continuity — [ITPro](https://www.itpro.com/business/acquisition/amd-to-acquire-another-ai-software-firm-world-labs); [CRN Asia](https://www.crnasia.com/news/2026/components-and-peripherals/amd-to-acquire-world-labs-for-us-8); [beri.net commentary](https://www.beri.net/article/amd-world-labs-acquisition-marble-world-api-continuity-world-model-hardware-lock-in)

**Other world models and capture apps**
- Google Genie 3 / Project Genie: rolled out on 29 Jan 2026 to Google AI Ultra subscribers in the US only. Export is short video clips only. Sessions are limited to 60 seconds and there is input lag. A May 2026 update added grounding from Street View. It is a "research-stage prototype" — [YourStory](https://yourstory.com/ai-story/google-deepmind-project-genie-launch); [technews.tw](https://technews.tw/2026/01/30/google-rolls-out-project-genie-access-to-google-ai-ultra-subscribers-in-the-us/); [heise](https://heise.de/-11300433)
- Tencent HY-World 2.0: technical report and partial code released 16 Apr 2026. World-generation inference code and WorldStereo 2.0 weights followed on 18 May 2026, and a "HY World 2.1" update is listed for July 2026. It exports mesh, 3DGS and point cloud. The license is listed as "Other", and web access requires an application — [GitHub Tencent-Hunyuan/HY-World-2.0](https://github.com/Tencent-Hunyuan/HY-World-2.0); [Gigazine](https://gigazine.net/gsc_news/en/20260417-tencent-hy-world-2); [BrightCoding blog](https://blog.brightcoding.dev/2026/09/16/tencent-hunyuanhy-world-20-open-3d-world-generation-from-text-images-and-video). Its predecessor, HunyuanWorld 1.0, generated a 360° panorama proxy and turned it into a layered mesh exportable to game engines — [aiwiki HY-World 2](https://aiwiki.ai/wiki/hy_world_2)
- Niantic Spatial Scaniverse: open SPZ format, cloud processing, USDZ export of splats from Scaniverse web — [Scaniverse release notes](https://www.nianticspatial.com/capture/scaniverse-release-notes); [radiancefields (search excerpt)](https://radiancefields.com/scaniverse-adds-usdz-export-to-splats). Polycam has supported 3DGS since Sept 2023 on iOS, Android and web — [radiancefields (search excerpt)](https://radiancefields.com/luma-ai-alternatives)

**File sizes and compression**
- SPZ is about 90% smaller than PLY (example: about 25 MB vs 250 MB for a "fairly rich scene"), at roughly 64 bytes per splat vs about 236 for PLY. SPZ 4 (2026) supports "tens of millions of points" — [Niantic Spatial SPZ4 blog](https://nianticspatial.com/blog/spz4); [Scaniverse SPZ](https://scaniverse.com/spz)
- PlayCanvas SOG is "15–20× smaller than PLY" (lossy). A streamed SOG variant handles tens of millions of Gaussians — [PlayCanvas splat formats](https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/). An academic encoder (KISS-GS, research) reached about 3.9 MB for a 256k-primitive scene — [arXiv 2608.26948](https://arxiv.org/pdf/2608.26948)
- `@playcanvas/splat-transform` (format-conversion CLI) is at 3.10.1, published 2026-10-09 — [npm registry](https://registry.npmjs.org/@playcanvas/splat-transform)

**Compositing, relighting and shadows (mostly research)**
- Relightable-splat research reports shadows that are "not as crisp as… a mesh-based representation" (GS^3) and blurry, alpha-blended visibility (Rng) — [GS^3 arXiv 2410.11419](https://arxiv.org/pdf/2410.11419); [Rng arXiv 2409.19702](https://arxiv.org/html/2409.19702v3)
- A 2026 paper lists "inaccurate shadows, lacking native support for reflection or refraction" as limits of rasterized splatting — [arXiv 2603.23637](https://www.alphaxiv.org/abs/2603.23637)
- Production practice in virtual production re-introduces the background as a low-poly mesh composited with splats, which shows the mesh-proxy approach — [arXiv 2605.09024](https://arxiv.org/pdf/2605.09024)

### Inferences
- Shortest path to splats in this project: upgrade three.js to >= r180, keep WebGLRenderer, and add Spark. This keeps WebGL2 for older phones and avoids the WebGPU rewrite. The native r186 `GaussianSplat` is only attractive if the project also moves to WebGPURenderer.
- For drag-and-drop to work, the backdrop splat must be an empty room. Any furniture baked into a scan or generation can't be moved. Scans of a real, furnished house, or Marble generations with furniture, would need empty-room capture or prompting.
- Furniture lit by three.js lights won't automatically pick up the splat's baked lighting. Practical mitigations: (a) light the meshes with an environment map or probe captured from the same room render; (b) cast furniture shadows onto invisible "shadow-catcher" planes (floor and walls from the CAD model) drawn over the splat; (c) occlude using the CAD mesh depth. No turnkey Spark example for this was verified (sparkjs.dev unreachable).
- Size and performance budget: a whole house at about 1–3M splats fits the stated iPhone budget. That is about 25–64 MB as SPZ at about 64 B/splat, and less as SOG. Per-room loading or LoD streaming (Spark 2.x) is advisable on mobile.
- AI world models fit poorly with a "to-scale, CAD-accurate" brief. Marble or HY-World output won't match the house's real dimensions unless driven from a layout (Chisel). Even then, metric accuracy is unverified. Use them for mood or landscape backdrops (mountain views through windows) rather than the interior shell.
- Marble now carries acquisition-related continuity risk. Spark being MIT-licensed and on npm reduces lock-in for the renderer itself.

### Gaps
- Could not open official World Labs docs or pricing (DNS blocked), so the Marble export sizes, splat counts and prices above are third-party figures and need verification.
- No measured iPhone/Android fps benchmarks for Spark or three.js `GaussianSplat` with mixed mesh content were found. Only rule-of-thumb budgets exist.
- No source verified how Spark handles depth between splats and opaque meshes (depth test/write order, transparency), and no shadow-catcher example was found.
- Metric (to-scale) accuracy of Marble Chisel outputs is undocumented.
- HY-World 2.0 license terms and web-export quality were not verified.

## 2. Can splats be generated from the existing CAD-accurate 3D model (render many views, optionally AI-enhance, then train splats)? Tools, time, cost

### Takeaway
Yes, and this is the most robust splat route for this project: render a few hundred views per room of the empty, to-scale house (with Cycles GI) using known camera poses, then train with an open-source trainer (Brush, gsplat) or Postshot. Several Blender add-ons automate capture. Per-view AI enhancement before training risks multi-view inconsistency. Research (Difix3D+, SyncFix, FixingGS) shows diffusion enhancement works best when distilled back iteratively or applied jointly across views.

### Cited Findings
- The Blender "Splats" extension renders camera sets on a Fibonacci sphere with frustum culling. It exports per-frame PLY point clouds and OpenCV-format camera parameters (ready for 3DGS training) — [Blender Extensions: Splats](https://extensions.blender.org/add-ons/splats/)
- Lightcraft's documented workflow: place cameras along a path, render about 320 EEVEE frames, run COLMAP (in Autoshot) for sparse points, then train. They claim the splat "can retain all the original lighting and reflections" of the Blender scene (vendor claim) — [Lightcraft docs](https://docs.lightcraft.pro/tutorials/blender-workflows/gaussian-splat-from-blender)
- SplatGen (Blender add-on, commercial) skips structure-from-motion by back-projecting rendered pixels with known poses and metric depth, has a multi-camera coverage check, and its Pro tier trains inside Blender with PLY or SOG export (vendor claims) — [Superhive: SplatGen](https://superhivemarket.com/products/splatgen)
- Brush is Apache-2.0 and free. It is built on WebGPU and Burn, with no CUDA dependency, and trains on Windows, macOS, Linux, Android and in the browser — [PlayCanvas recommended tools](https://developer.playcanvas.com/user-manual/gaussian-splatting/creating/recommended-tools); [radiancefields Brush (search excerpt)](https://radiancefields.com/platforms/brush). gsplat is an open-source CUDA training library — [arXiv 2409.06765](https://arxiv.org/pdf/2409.06765)
- Postshot 1.0 (Aug 2025) has a free tier with unlimited training. Indie is €17/mo (no watermark, PLY export) and Studio is €39/mo. It requires a CUDA GPU. A later directory listing claims everything is free, which conflicts — [3DVF](https://3dvf.com/en/gaussian-splatting-postshot-is-finally-out-of-beta-try-it-out-now/); [radiancefields (search excerpt)](https://radiancefields.com/postshot-launches-v1-0-out-of-beta)
- Training time reference points vary widely: one Postshot user reported about 8 h for an outdoor alley scene. Another tool (Reconstrura) reported 13 min 35 s on an RTX 4090 for a published run. Neither is a standard benchmark — [media-and-learning.eu](https://media-and-learning.eu/subject/higher-education/gaussian-splatting-rapid-3d-with-ai-tools/); [radiancefields Reconstrura (search excerpt)](https://radiancefields.com/platforms/reconstrura)
- Difix3D+ (NVIDIA et al., CVPR 2025, research) is a single-step diffusion model that removes artifacts from rendered novel views. The cleaned views are distilled back into the 3DGS/NeRF iteratively to keep multi-view consistency, with about 2× FID improvement reported — [arXiv 2503.01774](https://arxiv.org/html/2503.01774v1)
- SyncFix (2026, research) notes that Difix3D+ "processes each view separately, leading to inconsistent geometry across views" and refines views jointly instead. FixingGS reports a higher multi-view consistency metric (TSED 0.4673 vs 0.4408 for Difix3D on DL3DV, 3-view) — [SyncFix arXiv 2604.11797](https://www.alphaxiv.org/abs/2604.11797.md); [FixingGS arXiv 2509.18759](https://arxiv.org/html/2509.18759v1)

### Inferences
- Compared with baking lightmaps from the same Blender scene (Section 5), a CAD-derived splat adds view-dependent effects (glossy floor reflections, glass highlights via spherical harmonics) and photographic micro-detail. The costs are fuzzier edges, larger downloads (tens of MB vs a few MB of lightmaps) and no per-object editability. It is "baked GI that also bakes reflections".
- Rough effort estimate (inference, not sourced): about 200–400 Cycles renders per room × 6–10 rooms. Rendering takes hours to overnight on one consumer GPU, and training takes from minutes to a few hours per room on an RTX-class GPU with Brush or gsplat. Software can be free (Brush, Blender) and the main cost is GPU time. Cloud GPU rental would be on the order of tens of dollars, but no sourced rate was gathered here.
- Because the source is synthetic, camera poses are exact, so COLMAP can be skipped (SplatGen, Splats extension). That removes a common failure point for plain white walls, which are low-texture and hard for COLMAP.
- AI enhancement of the training views (for example, img2img to add realism) should either be applied consistently (same seed/model, low strength, possibly video-diffusion based) or done after an initial splat, Difix3D+-style. Otherwise inconsistent per-view hallucinations become floaters or blur.
- Furniture must be removed from the renders (empty shell) so that drag-and-drop meshes can be composited, as in Section 1.

### Gaps
- No archviz-specific benchmark (interior quality, file size or fps) for CAD-rendered-to-splat pipelines was found.
- No sourced per-room training time or cloud GPU cost for this exact pipeline.
- No production tool was found that does "AI-enhance rendered views then train splats" with consistency guarantees. Difix3D+, SyncFix and FixingGS are research code.

## 3. AI-generated 3D furniture to replace procedural boxes, and scanned or library furniture: quality, PBR, poly counts, licensing, price

### Takeaway
Image-to-3D generators produce textured PBR GLBs in seconds to minutes. Hosted services (Meshy, Tripo, Rodin, Hunyuan3D 3.x) cost roughly $0.10–$1.50 per model. Open weights are available as TRELLIS.2 (MIT, 4B parameters, Dec 2025) and Hunyuan3D 2.1 (custom license excluding the EU, UK and South Korea). Raw outputs are heavy (hundreds of thousands to 1M+ faces) and must be decimated and normalized to the JSON w/d/h dimensions. For a small furniture catalogue, CC0 libraries (Poly Haven) and AI generation from product photos are both viable. Sketchfab's free library is in flux because of the Fab migration.

### Cited Findings
**Open models (research or open-weight releases)**
- Microsoft TRELLIS.2: 4B-parameter image-to-3D model, Dec 2025 (arXiv 2512.14692), MIT license for code and model. Output is GLB with PBR (base color, roughness, metallic, opacity), with alpha stored but not wired by default. On an H100 it takes about 3 s at 512³, about 17 s at 1024³ and about 60 s at 1536³. It needs an NVIDIA GPU with >= 24 GB and is tested on Linux. The example export decimates to 1,000,000 faces with 4096 textures. It is image-to-3D only, with no text input, plus a separate texturing pipeline for existing shapes — [GitHub microsoft/TRELLIS.2](https://github.com/microsoft/TRELLIS.2); [ComfyUI Wiki](https://comfyui-wiki.com/en/news/2025-12-18-microsoft-trellis2-3d-generation)
- Tencent Hunyuan3D 2.1 is described by Tencent as "fully open-source, production-ready PBR". The Hunyuan3D 2.0/2.1 community license excludes the EU, UK and South Korea from its territory — [Hunyuan3D-2.1 LICENSE (mirror)](https://gitserver.onethingai.com/ai-models/Hunyuan3D-2.1/raw/branch/main/LICENSE); [Hunyuan3D-2 LICENSE on Hugging Face](https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE); [CGWorld](https://cgworld.jp/flashnews/01-202506-Hunyuan3D21.html)
- Hunyuan3D 3.0 is reported at 1,536³ voxel geometry and is offered via partner APIs (for example ComfyUI Partner Nodes). No open weights or license were confirmed — [layer.ai](https://www.layer.ai/models/tencent-hunyuan3d-3-0); [comfyui.org](https://comfyui.org/zh/hunyuan-3d-30-in-comfyui-state-of)

**Hosted services (shipped products) — models and parameters as exposed in the Higgsfield `generate_3d` catalog (queried live 2026-10-09)**
- Meshy 7 image-to-3D: target polycount 100–300,000 (default 30,000), quad or triangle topology, optional PBR, "ultra_mode". Meshy 6 text-to-3D, Meshy 5 Remesh and Meshy 5 Retexture (keeps the original UVs, optional PBR) are also listed — Higgsfield MCP `models_explore(type:'3d')` (tool output, no public URL)
- Tripo H3.1 image or multiview (2–4 views) to 3D: face limit 1,000–2,000,000, PBR on by default, optional quad mesh, `auto_size` to "Scale the model to real-world dimensions" — Higgsfield MCP `models_explore` (tool output)
- Hunyuan3D v3 image or multiview to 3D: face count 40,000–1,500,000 (default 500,000), optional PBR, "LowPoly" mode with quad option. Hunyuan3D v3.1 text-to-3D (PBR in pro mode only). Meta SAM 3 3D lifts a single object from a photo to a textured GLB — Higgsfield MCP `models_explore` (tool output)

**Pricing (third-party, 2026; sources conflict)**
- Meshy Pro $20/mo for 1,000 credits, with a textured model costing 20 credits (about $0.40/model). Tripo Professional is about $15.90/mo for 3,000 credits, with an HD-textured image model costing 40 credits (about $0.21/model) — [Sloyd price comparison](https://www.sloyd.ai/blog/3d-ai-price-comparison)
- API comparison: Tripo and Meshy about $0.10 (cheapest) and $0.25 (mid). Rodin about $0.50 (cheapest) and $1.50+ (mid) — [3D AI Studio API comparison](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026)
- Meshy plans: Free (100 credits/mo), Pro $20/mo ($16 annual, 1,000 credits), Studio $60/mo (4,000 credits) — [StackSheriff](https://stacksheriff.com/ai-tools/meshy-ai-pricing/)
- Rodin (Hyper3D) Gen-2: Creator $30/mo, Business $120/mo (needed for API). Gen-2 download costs about 40 credits. A reseller charges $0.80 per request. Limits are up to 1M raw or 200k quad faces. 4K PBR reportedly needs a "HighPack" upgrade — [Dupple Rodin review](https://dupple.com/reviews/rodin-ai); [EmpirioLabs](https://empiriolabs.ai/models/hyper3d-gen2); [Runware docs](https://runware.ai/docs/models/hyper3d-rodin-gen-2/guides/topology-and-polygon-budget)

**Libraries of real or scanned furniture**
- Poly Haven: all assets are CC0, usable "for absolutely any purpose, including commercial", with over 520 models reported — [Poly Haven FAQ](https://polyhaven.com/faq); [Cinevva guide](https://app.cinevva.com/guides/free-textures-hdris-materials)
- Sketchfab is migrating to Epic's Fab. CC0, CC BY-SA, CC BY-NC and CC BY-ND models could not migrate under those licenses (Fab offered CC BY only), and free downloads on Sketchfab are being phased out "with plenty of notice". The Download API keeps working until Fab APIs exist — [Sketchfab blog](https://sketchfab.com/blogs/community/sketchfab-update-what-you-need-to-know-now-that-fabs-live/); [Fabbaloo](https://www.fabbaloo.com/news/epic-games-phases-out-sketchfab-in-2025-launches-unified-fab-marketplace); [80.lv](https://80.lv/articles/historians-are-concerned-about-epic-games-sketchfab-to-fab-migration/)

### Inferences
- Recommended workflow for this project: (1) pick a reference photo per furniture type, ideally a clean product shot or an AI-generated product image of a mountain-modern piece. (2) Use Tripo H3.1 multiview with `auto_size` or Meshy 7 at a target of about 10k–30k triangles. (3) Normalize each GLB's bounding box to the JSON w/d/h, then compress with Draco or Meshopt and KTX2. (4) Drive the JSON `color` field by tinting the base color, or by authoring a neutral albedo plus a material-ID mask. At about $0.20–$0.80 per piece and about 20–40 furniture types, the generation budget is about $5–$30 plus cleanup time (inference from the per-model prices above).
- Under the default 30k-triangle remesh, a 30-piece room is about 1M triangles, which is manageable on mobile with instancing and LoD. Raw TRELLIS.2 or Hunyuan outputs (500k–1M faces) are not usable on phones without decimation.
- Better 3D furniture matters most for the "AI image enhancement" route as well: img2img models keep silhouettes and materials better when the input geometry is plausible.
- Licensing: TRELLIS.2 (MIT) is the cleanest self-hosted option. Avoid Hunyuan3D open weights if the owner or users are in the EU, UK or South Korea. For hosted services, check each provider's commercial-use terms per plan (not verified here).

### Gaps
- No independent 2026 quality benchmark specific to furniture (straight edges, thin legs, fabric) across Meshy 7, Tripo H3.1, Rodin Gen-2.5, Hunyuan3D 3.x and TRELLIS.2 was found. Vendor comparisons exist but are biased.
- Commercial-license terms for Meshy, Tripo and Rodin outputs per tier were not verified on official pages.
- Higgsfield's per-model credit cost was not checked (generation was not run).
- IKEA, Wayfair and other retailer glTF availability and licensing were not researched. Objaverse per-object licensing was not verified in this session.

## 4. AI-generated or library PBR materials for walls, floors and stone

### Takeaway
For architectural surfaces, CC0 scanned libraries (Poly Haven, ambientCG) remain the best quality-to-cost option, and the project already uses photo-scanned textures. AI tools (Substance 3D Sampler's AI Image-to-Material and its Firefly Text-to-Texture beta; Meshy Retexture for meshes) mainly help create bespoke materials from a reference photo, such as the owner's actual stone or wood. The larger realism gain for existing textures comes from lighting (Section 5), not from new textures.

### Cited Findings
- Poly Haven textures, HDRIs and models are CC0 and allow commercial use. Attribution is requested, not required — [Poly Haven FAQ](https://polyhaven.com/faq)
- ambientCG is described as public domain with 2,000+ materials and 400+ HDRIs (third-party guide; the official license page was not opened) — [Cinevva guide](https://app.cinevva.com/guides/free-textures-hdris-materials)
- Substance 3D Sampler 4.2 added AI Image-to-Material, which creates base color, roughness, normal, displacement and metallic from one image, with material-type presets (stone, leather, metal and others). It requires the Substance 3D Collection subscription — [Adobe Sampler 4.2 release notes](https://helpx.adobe.com/substance-3d-sampler/release-notes/version-4-2.html); [Adobe Image to Material](https://helpx.adobe.com/substance-3d-sampler/filters/tools/image-to-material.html)
- Sampler's generative features (Text-to-Texture, Text-to-Pattern, Image-to-Texture) are Firefly-powered betas producing 4 variations per generation — [Adobe Sampler generative workflows](https://helpx.adobe.com/substance-3d-sampler/features-and-workflows/generative-workflows.html)
- Meshy 5 Retexture re-textures an existing model from a text or style image, can reuse the original UVs, and can output PBR maps — Higgsfield MCP `models_explore(type:'3d')` (tool output)

### Inferences
- Use AI material generation for photographs of the actual site materials (local stone, reclaimed wood) to make tiling PBR sets. Keep CC0 scans for generic surfaces.
- Pair materials with correct UV scale (to-scale model) and roughness variation. Glossy floors only read as real with good reflections (SSR or a reflection probe), which depends on the renderer upgrade.

### Gaps
- No 2026 sources on newer generative material models (research or products) were found. The newest Adobe documentation found dates from 2023–2024.
- ambientCG's license was not verified on its official site.

## 5. Rendering upgrades without AI: baked GI or lightmaps, probes, real-time GI (SSGI/SSR/GTAO), path tracing, and the WebGPU renderer. What upgrading from r128 involves

### Takeaway
The biggest non-AI gain for a static house is baked GI: Blender Cycles lightmaps on the shell, plus a baked irradiance probe grid so movable furniture picks up the bounce light. three.js r186 now ships `LightProbeGrid`, including a WebGLRenderer version (`LightProbeGridWebGL`, L2 SH, GPU-baked), and `ProgressiveLightMap`. The WebGPU/TSL stack in r184–r186 adds SSGI, SSR, GTAO, TRAA and denoise nodes. three-gpu-pathtracer is now WebGPU-only (v0.0.25+, three >= r185). All of these require leaving r128: this is 58 releases of breaking changes, chiefly the removal of the global `three.min.js` build (r161) and `examples/js` (r148), the move to ES modules with import maps, color management (r152) and physical light units (r155).

### Cited Findings
**What r186 contains (primary: npm tarball `three@0.186.1`, published 2026-09-24)**
- Files present: `examples/jsm/tsl/display/SSGINode.js`, `SSRNode.js`, `GTAONode.js`, `TRAANode.js`, `DenoiseNode.js`, `RecurrentDenoiseNode.js`, `SSAONode.js`, `BilateralBlurNode.js`. Also `examples/jsm/lighting/LightProbeGrid.js` and `LightProbeGridWebGL.js`, `examples/jsm/misc/ProgressiveLightMap.js` and `ProgressiveLightMapGPU.js`, and the legacy `postprocessing/GTAOPass.js` and `SSRPass.js` for WebGLRenderer — [npm tarball three-0.186.1.tgz](https://registry.npmjs.org/three/-/three-0.186.1.tgz)
- `SSGINode` doc: "Screen Space Global Illumination" based on SSRT3 / SSILVB (visibility bitmask). Samples per pixel = sliceCount × stepCount × 2. Presets with temporal filtering: Low 1×12, Medium 2×8, High 3×16 — [three-0.186.1 SSGINode.js](https://registry.npmjs.org/three/-/three-0.186.1.tgz). Its import is `three/webgpu` (WebGPURenderer/TSL only).
- `LightProbeGridWebGL` doc: "A 3D grid of L2 Spherical Harmonic irradiance probes that provides position-dependent diffuse global illumination… can only be used with WebGLRenderer. For WebGPURenderer, use LightProbeGrid… Baking is fully GPU-resident… with zero CPU readback." — [three-0.186.1 LightProbeGridWebGL.js](https://registry.npmjs.org/three/-/three-0.186.1.tgz)
- r183 renamed `PostProcessing` to `RenderPipeline` for WebGPURenderer — [Cinevva news on r183](https://app.cinevva.com/news/2026-03-18-threejs-r183-render-pipeline). Releases: r183 (20 Feb 2026), r184 (16 Apr 2026), r185 (1 Jul 2026), r186 (24 Sep 2026). r183 added clearcoat support for RectAreaLight. r184 added a `WEBGL_multi_draw` fallback and a "NodeMaterial compatibility layer" for WebGLRenderer — [three.js GitHub releases](https://github.com/mrdoob/three.js/releases)
- A newsletter archive headline mentions "Three.js r184 with SSGI, 3x faster…" (teaser only). The SSGI example was reworked in Sept 2025 (PRs #31867 and #31890) — [Sensei Notes archive (search excerpt)](https://buttondown.com/wawasensei/archive); [three.js PR 31867](https://github.com/mrdoob/three.js/pull/31867); [PR 31890](https://github.com/mrdoob/three.js/pull/31890)
- Known SSGI issue: its AO darkens floors relative to the background when combined with distance fog — [three.js forum](https://discourse.threejs.org/t/how-to-combine-webgpu-ssgi-fog/92877)

**Path tracing**
- three-gpu-pathtracer 0.0.27 (2026-10-08) has peer `three >= 0.185.0` and `three-mesh-bvh >= 0.9.15`. The README says it uses "WebGPU compute shaders" with `WebGPUPathTracer` from `three-gpu-pathtracer/webgpu`, and lists "The project requires WebGPU." The peer floor history: 0.0.23 (Jun 2024) three >= 0.151, 0.0.24 (Feb 2026) three >= 0.180, 0.0.25 (Sep 2026) three >= 0.185 — [npm registry three-gpu-pathtracer](https://registry.npmjs.org/three-gpu-pathtracer); [GitHub](https://github.com/gkjohnson/three-gpu-pathtracer)
- It supports only MeshStandardMaterial and MeshPhysicalMaterial. Spot, directional and point lights need MIS, while area lights are demoed. It has a BlurredEnvMapGenerator, denoising and upscaling demos, and an "Interior Scene w/ Equirect Rendering" demo — [GitHub](https://github.com/gkjohnson/three-gpu-pathtracer)

**Baked lightmaps**
- Common web archviz workflow: a second UV set, a Cycles bake (combined or diffuse), PNG/JPG (or KTX2), then `MeshStandardMaterial.lightMap`. One developer reported "much higher FPS on mobile" and smaller files after batch-baking for three.js — [svilenkovic.com](https://www.svilenkovic.com/3d/how-to-bake-lighting-for-web); [three.js forum batch-bake script](https://discourse.threejs.org/t/made-a-blender-script-for-batch-baking-lightmaps-to-optimize-models-for-threejs/82346)
- Needle's guidance: 10–50 texels per unit and 128–512 samples with denoising. Baking only suits static geometry and lights — [Needle Engine lightmapping docs](https://engine.needle.tools/docs/blender/lightmapping)
- A common pitfall is lightmaps looking low-contrast, which is a color-management mismatch with Blender's view transform — [Blender Artists](https://blenderartists.org/t/blender-making-lightmap-for-threejs-need-some-help/1258380)

**r128 to r18x migration (official migration guide)**
- r136: ES-module imports require an import map. PMREMGenerator switched to half-float targets. r141: `Geometry` removed. r148: "The `examples/js` directory has been removed." r150: `physicallyCorrectLights` became `useLegacyLights = false`, and "aoMap and lightMap no longer use uv2" (use `.channel`). r152: `outputEncoding` became `outputColorSpace` (sRGB default), `sRGBEncoding` became `SRGBColorSpace`, and `uv2` became `uv1`. r153: EffectComposer defaults to HalfFloat. r155: `useLegacyLights` defaults to false (new light intensities and decay), and tone mapping moves to `OutputPass`. r156: SSAOPass needs a prior RenderPass. r161: "build files `build/three.js` and `build/three.min.js` have been removed". r163: WebGL 1 removed. r181: PMREM and indirect specular changed. r182: `PCFSoftShadowMap` deprecated (PCFShadowMap is now soft). Maintainers advise upgrading in steps of about 10 releases — [three.js Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)
- After r155, legacy ambient, hemisphere, directional and lightmap intensities are restored by multiplying by π, but users report it doesn't exactly reproduce the old look — [three.js forum r155 lighting](https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733?page=2); [forum: washed-out after upgrade](https://discourse.threejs.org/t/updated-three-js-from-r143-to-r164-now-my-scene-looks-washed-out-why/66135)
- Secondary sources say r182 made WebGPURenderer the recommended renderer with WebGL kept as fallback (not confirmed in release notes) — [youngju.dev](https://www.youngju.dev/blog/culture/2026-05-16-webgpu-webgl-2026-three-js-r3f-babylon-playcanvas-tres-needle-native-webgpu-wgsl-deep-dive)
- WebGPU shipped in Safari 26 on iOS, iPadOS and macOS (Sept 2025) and is in Chrome on Android. Guides still advise a WebGL2 fallback for older devices — [AppDeveloperMagazine](https://appdevelopermagazine.com/webgpu-in-ios-26/); [Cinevva WebGPU vs WebGL](https://app.cinevva.com/guides/webgpu-vs-webgl-games)

### Inferences
- Staged plan (inference):
  - Stage A (no AI, biggest realism per effort): migrate r128 to r18x on WebGLRenderer via ES modules and an import map from jsDelivr or unpkg. Bake the static shell's GI in Blender Cycles into lightmaps. Bake a `LightProbeGridWebGL` so dragged furniture is lit consistently with the bake. Keep the existing SSAO, bloom, ACES and accumulation, and add GTAOPass and SSRPass for floors.
  - Stage B (optional): move to WebGPURenderer for SSGI, SSR, GTAO and TRAA nodes (with forceWebGL fallback) and for native splats. On WebGPU-capable desktops, offer a "photo mode" that runs three-gpu-pathtracer when the camera is still. That replaces the current jitter accumulation with true path-traced GI and soft shadows.
- Static lightmaps can't react to furniture moved by the user, for example sofa contact shadows on the floor. Combine them with real-time contact shadows (shadow maps plus GTAO). Movable objects also do not bounce light, a limitation shared with splat backdrops.
- Effort: migration is likely days to weeks for a single-file app with a custom HDR pipeline. The main risks are the color-space and light-unit changes and porting custom shader chunks. This is an inference; no project-specific estimate is sourced.
- cdnjs: a cdnjs page for three.js 0.180.0 appeared in search results, but which r18x versions cdnjs hosts could not be confirmed (API blocked). jsDelivr and unpkg mirror npm (Spark's README uses jsDelivr for three@0.180.0).

### Gaps
- No fps numbers for SSGINode, LightProbeGrid or three-gpu-pathtracer on phones were found.
- No sourced information on DDGI (dynamic diffuse GI) in three.js. LightProbeGrid is a static-bake grid, and it was not verified whether it can be re-baked incrementally at runtime when furniture moves.
- Whether three-gpu-pathtracer 0.0.24 (Feb 2026) still had a WebGL path was not verified. 0.0.23 (2024) was the WebGL-era release.
- No direct visual-gain comparisons (r128 vs r186 WebGPU) were found.

## 6. Cloud or pixel-streaming route (UE5 Lumen, Unity HDRP, Omniverse): cost per user-hour, latency, how drag-and-drop would work

### Takeaway
Pixel streaming gives UE5-Lumen photorealism on any phone, but it changes the economics and architecture: about $0.50–$1/hr self-hosted on AWS, about $1.50–$2.80/hr on Vagon, and about €9/hr on Arcware (reported by a competitor). It needs one GPU per concurrent user and adds 50–150 ms of input latency. Drag-and-drop works by sending browser UI events over the WebRTC data channel to Unreal, which moves the actors. That is feasible, but it gives up the static Vercel deployment and offline phone rendering.

### Cited Findings
- Vagon Streams per-minute pricing: T4 Starter about $0.025/min, Pro about $0.035/min, A10G and L4 tiers about $0.036–$0.047/min (about $1.50–$2.82 per streamed hour) — [Vagon Streams pricing](https://vagon.io/streams/pricing); [Vagon blog comparison](https://vagon.io/blog/best-pixel-streaming-platforms)
- Arcware: Lite €10/mo plus about €0.15/streaming minute (about €9/hr). Core €89/mo with a lower per-minute rate (from a Vagon competitor blog, unverified) — [Vagon blog](https://vagon.io/blog/best-pixel-streaming-platforms)
- Eagle 3D Streaming Core: $29/mo for 300 minutes, then $0.10/min — [Eagle 3D pricing](https://www.eagle3dstreaming.com/pricing). Streampixel: €99/mo for 2 concurrent users with unlimited minutes — [Streampixel](https://www.streampixel.io/)
- Self-hosting on AWS: g4dn.xlarge about $0.526/hr and g5.xlarge about $1.006/hr on demand, with about one concurrent user per instance — [StraySpark 2026 guide](https://www.strayspark.studio/blog/pixel-streaming-ue5-cloud-gaming-demo); [The Gabmeister](https://thegabmeister.com/p/unreal-pixel-stream-aws/)
- Latency: about 50–100 ms round trip on a well-tuned deployment near the user. Another source says 50–150 ms over local rendering — [StraySpark](https://www.strayspark.studio/blog/pixel-streaming-ue5-cloud-gaming-demo); [Eagle 3D performance guide](https://www.eagle3dstreaming.com/blog/performance-optimization-for-pixel-streaming-the-complete-guide)
- Pixel Streaming 2 sends input messages over a WebRTC data channel (PixelStreaming2Input plugin). Best practice is to draw the cursor in the browser so it is not part of the encoded video — [Epic PixelStreaming2Input API](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/PixelStreaming2Input); [Vagon troubleshooting guide](https://vagon.io/blog/pixel-streaming-troubleshooting-guide-for-touch-websocket-and-ui-issues)

### Inferences
- Drag-and-drop design for streaming: keep the furniture palette and layout JSON in the browser, and send `{type,x,z,rot,w,d,h,color}` messages over the data channel. Unreal spawns or moves actors, and Lumen updates GI dynamically, which neither lightmaps nor splats can do. Picking and drag gestures would need raycasts on the server, or a lightweight client-side floor-plane mapping.
- Cost example (inference): 1,000 visitor-sessions × 10 min is about 167 GPU-hours, roughly $85–$470/month depending on provider. That excludes idle warm instances and engineering time, compared with near-zero for the current static site.
- This route also means rebuilding the house in Unreal (Datasmith from Blender or CAD). It is a separate engine project rather than an upgrade of the three.js page.

### Gaps
- NVIDIA Omniverse (Kit App Streaming), CloudXR, Unity Render Streaming and PureWeb were not researched in this session. No costs or latency figures for them.
- No official Epic latency figure for Pixel Streaming 2 was found. Arcware pricing was not verified on Arcware's own site.

## 7. Which 3D-native routes combine well with AI image enhancement, and overall feasibility comparison

### Takeaway
Every 3D-native improvement that produces physically plausible lighting, correct materials and clean geometry also gives AI image or video enhancers a better input. The main documented AI-plus-3D synergy, in research, is diffusion-enhanced novel views distilled back into splats (Difix3D+ and successors), which produces consistent 3D rather than per-frame hallucination. For real-time editable furniture, the practical ranking is: (1) baked-GI shell plus probe grid plus AI-generated PBR furniture on three.js r18x. (2) Optionally replace the shell with a CAD-rendered splat via Spark. (3) Path-traced still "photo mode" on WebGPU. (4) Pixel streaming only if budget and latency are acceptable. AI world models (Marble, Genie, HY-World) suit exterior or landscape backdrops more than the to-scale interior.

### Cited Findings
- Difix3D+ can also act as a "real-time post-processing enhancer" at inference and improves FID about 2× while maintaining 3D consistency (research, CVPR 2025) — [arXiv 2503.01774](https://arxiv.org/html/2503.01774v1)
- Per-view independent diffusion refinement causes cross-view inconsistency, while joint refinement (SyncFix) or continuous distillation (FixingGS) improves it (research, 2025–2026) — [SyncFix](https://www.alphaxiv.org/abs/2604.11797.md); [FixingGS](https://arxiv.org/html/2509.18759v1)
- Marble's Chisel mode takes a coarse 3D layout (boxes and planes, or imported assets) plus a text prompt to style a world. This is a shipped "3D-structure-in, photoreal-world-out" product — [The Batch](https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool)
- Image-to-3D services can convert AI-generated product images into GLBs, and Meshy Retexture can re-texture meshes from a style image while keeping the UVs — Higgsfield MCP `generate_3d` / `models_explore` (tool output)

### Inferences
Feasibility matrix (inference, synthesized from sections 1–6):

| Route | Realism gain | Keeps real-time drag-and-drop | Mobile | Requires leaving r128 | Effort | Recurring cost | Status |
|---|---|---|---|---|---|---|---|
| Baked Cycles lightmaps + LightProbeGridWebGL | High for shell | Yes (furniture lit by probes) | Excellent | Yes (r18x WebGL) | Medium | None | Shipped |
| AI-generated PBR furniture (Tripo, Meshy, TRELLIS.2) | High for furniture | Yes | Good if decimated | No (GLTFLoader works on r128) | Low–Medium | About $0.2–0.8/model, one-off | Shipped |
| CC0 / AI PBR materials | Medium | Yes | Excellent | No | Low | None, or Adobe subscription | Shipped |
| CAD-rendered splat shell via Spark | Very high (incl. reflections) | Yes, with compositing caveats (shadows, light match) | OK at 1–3M splats | Yes (r180+) | Medium–High | None (self-trained) | Tools shipped; pipeline DIY |
| Marble AI world as backdrop | High but not to scale | Yes (same caveats) | OK (500k splat export) | Yes (r180+) | Low | $20–35/mo or about $1.20/world | Shipped (vendor in acquisition) |
| WebGPU + SSGI, SSR, GTAO, TRAA | Medium–High, dynamic | Yes, fully dynamic | Limited (iOS 26+ / new Android) | Yes (r184+, WebGPURenderer) | High | None | Shipped (addons) |
| three-gpu-pathtracer photo mode | Very high (stills) | Yes (re-converges after edits) | Poor | Yes (r185+, WebGPU) | Medium | None | Shipped (v0.0.x) |
| UE5 Lumen pixel streaming | Very high, dynamic GI | Yes, via data channel | Excellent (video) | N/A (separate engine) | Very high | About $0.5–9/user-hour | Shipped |
| Genie 3 / Project Genie | N/A | No (video only) | N/A | N/A | N/A | Ultra subscription | Prototype, US only |

- Combination with AI image enhancement: a lightmapped or path-traced frame with real materials, plus depth and normal buffers, is a stronger conditioning input for img2img/ControlNet-style enhancement than the current SSAO raster, because there are fewer lighting errors for the model to "fix". Video-consistent enhancement is easier when the base render is already temporally stable (TRAA, accumulation). This is inference; no benchmark was sourced.
- The furniture JSON (w, d, h, color) maps cleanly onto AI-generated GLBs normalized to bounding boxes. This is the lowest-risk, highest-visibility upgrade and is independent of the renderer decision.

### Gaps
- No quantitative study comparing AI-enhancement quality as a function of input render quality (raster vs baked GI vs path-traced) was found.
- No published end-to-end case study of a web archviz configurator combining splat shells with editable mesh furniture was found.
