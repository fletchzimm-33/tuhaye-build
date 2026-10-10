# Make Ridgeline photoreal without freezing its furniture

Yes, the Ridgeline Residence walkthrough can look much more photoreal and keep drag-and-drop furniture, but stitching AI images into a walkable world is the wrong way to get there. The approach that works keeps three.js as the live, editable source of truth and uses AI in two places around it. The first is an on-demand **"Render this view" button**. It sends the engine's exact depth, line-art and object-ID passes for the current camera and layout to a hosted image model, which returns a photoreal still in roughly **3–60 seconds for about $0.03–0.24**. This is the biggest visible jump, and one small Vercel Function (a short serverless script) plus some page code can deliver it in one to two weeks. The second is a set of **one-time, offline upgrades to what the live view draws**: baked lighting, AI-generated furniture models and, later, AI imagery projected onto the empty room shell. These improve every angle on every device at no per-view cost. Literally stitching AI images together fails for a structural reason. Each generation is a fresh interpretation, so the same floor, sofa and window come out differently from view to view. Furniture painted into the pixels is frozen there, and a still is only correct from the exact camera position it was made at. Views stay consistent only when AI output is written into shared 3D and then re-rendered. The market agrees: none of the products surveyed makes the live, editable view AI-generated. Chaos Veras, Homestyler, Coohom and IKEA Kreativ all keep a deterministic 3D scene and derive their photoreal output from it. Live AI restyling of the canvas costs about **$36 per viewer-hour**, works from colour pixels only and cannot guarantee geometry. Unreal pixel streaming costs about **$0.50–9 per user-hour** and means rebuilding the house in another engine. Both break the free static-hosting model, so neither is recommended now. Ridgeline's decisive advantage is that it already knows the exact geometry and camera pose. It can steer the AI with that ground truth and automatically reject any output that moves a wall or a sofa, which consumer AI-staging tools cannot do. Most prices below come from secondary or reseller sources (marked †) in a market that repriced several times in 2026, so re-check them before budgeting.

## Stitched AI images disagree, so they cannot carry a walkthrough

"Stitching" here means generating a photoreal AI image for each viewpoint and blending between them. It runs into four problems at once.

**First, consistency.** Each image the model generates is an independent guess. Sharing seeds or style between images aligns the *style*, not the content. One such trick, StyleAligned, even causes "severe text controllability degradation" on FLUX ([arXiv 2409.04750](https://arxiv.org/pdf/2409.04750)). The indoor-texturing literature reports that generating each view separately produces "severe cross-view inconsistencies and conspicuous seams" ([RoomPainter, CVPR 2025](https://arxiv.org/html/2412.16778v2)). Staging vendors see the same thing in production: AI tools "generate each image independently, and may miss that it's the same room" ([VirtualStaging.com](https://virtualstaging.com/blog/when-not-to-use-virtual-staging-ai/)).

**Second, viewpoint.** An image is only geometrically right from the pose it was rendered at. Orbit slightly and parallax (how near and far objects shift against each other as you move) breaks. Staging guides warn that "even a 3-degree offset can ruin the perspective" ([virtualstaging.art](https://www.virtualstaging.art/articles/how-to-virtually-stage-a-room)).

**Third, editability.** Anything painted into an AI image is frozen. Drag the sofa and its AI-painted twin and shadow stay behind as a ghost.

**Fourth, latency.** Hosted image models answer in seconds to a minute. Walk mode needs a new frame about every 16 ms. The fastest streaming video-diffusion research reaches about 58–64 frames per second only on **four H100 datacenter GPUs** ([StreamDiffusionV2](https://arxiv.org/html/2511.07399v2)).

What stitching *can* do is narrower but still valuable. The table separates the versions that survive contact with drag-and-drop from those that don't.

| Stitching technique | What it gives Ridgeline | Where it breaks |
|---|---|---|
| Independent AI stills per view, cross-faded | Beautiful individual frames | Materials, décor and even windows change between views. Furniture is frozen into the pixels. |
| One 360° panorama per room, generated from the engine's depth | A seamless "photo sphere" with correct geometry from one point | Parallax is wrong as soon as you step away from the capture point |
| An AI keyframe reprojected (re-warped) with engine depth to nearby camera positions | Small moves around an AI frame without regenerating | Areas that were hidden in the keyframe still need generating. No shipping product does this yet. |
| AI images projected onto the static shell's textures | AI-quality walls and floors from every angle, with live furniture untouched | Lighting and furniture shadows get baked in unless the source images are empty and evenly lit. Seams appear at view boundaries. |
| AI views turned into a Gaussian splat (a cloud of millions of tiny coloured blobs) | A photographic shell with real reflections | Inconsistencies between views become floating junk ("floaters") unless the views are refined together. Large downloads. |

The pattern in that table is the core technical insight: **generate once into shared 3D, then render many times**. RoomTex works this way. It builds a room panorama from a depth image of the whole room mesh, using SDXL with a depth ControlNet (an add-on that forces the image to follow a depth map). It then reprojects that panorama into perspective views, so every view shares the same materials ([RoomTex](https://github.com/qwang666/RoomTex-)).

Ridgeline can do one better. It knows the exact depth and camera for every view, so it can warp an existing AI view into an overlapping new view and use the warped image as the starting point for the next generation. That is exact information that consistency metrics such as MEt3R have to estimate with a 3D reconstruction network ([MEt3R, CVPR 2025](https://arxiv.org/abs/2501.06336)).

The product landscape confirms the split. Chaos Veras "uses the actual 3D geometry and camera views from Enscape" to produce AI stills alongside the live viewport. Since version 4 it runs on Google's Nano Banana Pro image model ([Chaos](https://www.chaos.com/press/veras-ai-architecture-enscape-vray-corona)). Homestyler's AI Render takes about **one minute and 30 credits per 2K image** ([Homestyler forum](https://www.homestyler.com/forum/view/2034610232517189633)). Its July 2026 Spark agent writes AI suggestions *into* the editable 3D scene rather than into pixels ([Homestyler](https://resources.homestyler.com/2026/07/22/meet-spark-homestylers-ai-interior-design-agent-for-editable-3d-design/)).

IKEA Kreativ works the other way round. It keeps a real photo as the background and composites 3D products with "realistic size, perspective, occlusion and lighting" ([VentureBeat](https://venturebeat.com/ai/ikea-launches-first-ai-powered-design-experience-no-swedish-meatballs-included)). Apply Design charges about **$7 per image** to render user-dragged 3D models onto a fixed room photo with cast shadows and reflections ([PhotoUp](https://photoup.net/learn/applydesign-virtual-staging-review)).

The complaints cluster in pure-AI staging, which has no 3D model behind it. Users report furniture "20% too large, rugs that float above the floor" ([Bella Virtual](https://www.bellavirtual.com/blogs/news/ai-virtual-staging-vs-human-designers)), and RoomGPT "often adds or removes windows, doors, and structural elements" ([First Chair](https://www.firstchair.app/blog/roomgpt-review)). Ridgeline already owns the expensive part these companies try to reconstruct: true, to-scale 3D. Letting a generator freely redraw the scene would throw that advantage away.

## Nine routes sort into image-space, scene-space and server-side families

The options differ mainly in *where* AI or extra computing power touches the picture:

- **Image-space:** a 2D image derived from one camera view.
- **Scene-space:** the textures, lights and models the live renderer draws.
- **Server-side:** a remote GPU that renders the scene and streams it as video.

The table compares them for Ridgeline specifically. The effort figures are my own estimates for one developer working with Claude, not sourced numbers.

| Route | Family | Realism vs today | Drag-and-drop | Latency | Recurring cost | Effort (est.) | Main risk |
|---|---|---|---|---|---|---|---|
| A. "Render this view" AI still (depth + line + ID conditioned) | Image | Highest, for that frame | Full; re-render after changes | ~3–60 s | ~$0.03–0.24 per still† | 1–2 weeks | Hallucinated or shifted objects |
| B. AI "photo spots" / 360° panoramas with live furniture composited | Image | Very high at the spot, none between spots | Full, live | Instant after a one-time bake | One-time only | 2–4 weeks | Furniture lighting mismatch; no parallax |
| C. AI imagery projected and baked onto the static shell | Scene | Moderate–high for walls and floors | Full, live | Real-time | None after bake | 3–6 weeks | Baked-in lighting, seams |
| D. Live AI video restyle of the canvas | Image | High but unstable | Live, but AI may redraw furniture | ~100 ms + network | ~$36–72 per viewer-hour† | Prototype in days | Flicker, drift, cost |
| E1. Baked GI lightmaps + light-probe grid (needs a three.js upgrade) | Scene | High for shell, moderate for furniture | Full | Real-time | None | 2–4 weeks | Migrating off r128 |
| E2. AI-generated furniture models (GLB) | Scene | High for furniture | Full | Real-time | ~$0.10–1.50 per model, once† | 1–2 weeks | Triangle counts, licences |
| E3. Gaussian-splat shell rendered from the CAD model | Scene | Very high, including reflections | Full, with compositing caveats | Real-time | None | 4–8 weeks | Light mismatch with furniture, download size |
| E4. Path-traced "photo mode" in the browser | Scene | Very high, stills only | Full | Seconds to minutes to converge | None | 2–4 weeks after upgrade | WebGPU-only, weak on phones |
| F. Unreal Engine pixel streaming | Server | Very high, dynamic | Full, over a data channel | 50–150 ms input lag | ~$0.50–9 per user-hour† | Months (rebuild) | Cost; gives up static hosting |

### Image-space AI gives the biggest jump, but only for frozen moments

**Route A** gives the most realism per dollar and per day of work. It is the subject of the next section.

**Route B** is the Kreativ pattern, using AI-made "photos" in place of real ones. At fixed camera nodes in each room, generate a furniture-free photoreal plate (a fixed background image) or panorama. Show it as the background. Then render the room shell meshes with `colorWrite = false`, so they write only depth: live furniture is then correctly hidden behind walls and islands. Add three things on top:

- `ShadowMaterial` "shadow catcher" planes, so dragged furniture casts soft shadows onto the plate;
- a reflection environment built from the same plate, so the furniture picks up matching light;
- slight grain on the live layer, so it matches the plate's photographic noise.

The tell-tale signs of fakery are well documented: missing contact shadows, shadows softer or sharper than the light source, and shadows that don't fall away from the windows ([virtualstaging.art](https://www.virtualstaging.art/blog-posts/adobevirtualstaging)). Research harmonisers address exactly these. ZeroComp drives a diffusion model with the inserted object's depth, normal and albedo maps ([arXiv 2410.08168](https://arxiv.org/pdf/2410.08168)). SpotLight takes a basic shadow map and progressively blends it into the background ([arXiv 2411.18665](https://arxiv.org/html/2411.18665v3)). Either could become an optional final pass.

Two costs are specific to Ridgeline:

- **Plates multiply with lighting presets.** Each node needs a plate per lighting preset (midday, evening and dusk for the house; Bright, Dim and Movie for the theater).
- **Panorama seams need care.** Seams in 360° panoramas are best fixed with circular (wrap-around) padding in the model's VAE decoder, the component that turns the model's internal representation back into pixels ([Diffusion360](https://ar5iv.labs.arxiv.org/html/2311.13141)).

Blockade Labs' Skybox AI exports up to 8K with HDRI and depth. Its control input is a style "remix" rather than an exact geometry lock, so it suits the mountain backdrop seen through the windows better than the interior ([Blockade API](https://api-documentation.blockadelabs.com/api/skybox-exports.html)).

**Route D**, live restyling, is technically reachable today. Decart's realtime API restyles a WebRTC video stream at **$0.01–0.02 per second at 720p**, which works out to $36–72 per hour for each viewer streaming at the same time ([Decart pricing†](https://docs.platform.decart.ai/getting-started/pricing.md)). A three.js canvas can produce such a stream with `canvas.captureStream()`. Independent measurements of MirageLSD, the company's first live model, found about **20 fps at 768×432 and ~100 ms end-to-end latency**. The same reporting says that without the company's countermeasures, accumulated errors "seriously degrade" quality after roughly 30 seconds ([The Decoder](https://the-decoder.com/decart-launches-miragelsd-an-ai-model-that-transforms-live-video-feeds-in-real-time)).

These services see only colour pixels, so nothing guarantees a lamp or chair stays put. Daydream's hosted StreamDiffusion can take depth ControlNets and claims 15–25 fps, but it is a vendor claim with no published pricing ([BusinessWire](https://www.businesswire.com/news/home/20251106860538/en/Daydream-Launches-Scope-and-Expands-StreamDiffusion-with-SDXL-Support-Advancing-the-Open-Source-Real-Time-AI-Video-Ecosystem)).

NVIDIA's DLSS 5 shows what the right design looks like. It runs a one-step diffusion pass on the engine's rendered frame, guided by motion vectors, in about **8 ms per 4K frame on an RTX 5090**. However, it ships only inside native games ([Neowin](https://www.neowin.net/news/unofficial-dlss-5-exposes-unexpected-limitation-on-nvidias-own-rtx-5090-gpus/)).

Running diffusion on the visitor's own device is out of reach for now. SD-Turbo in the browser takes about a second per image on an RTX 4090 ([Microsoft](https://opensource.microsoft.com/blog/2024/02/29/onnx-runtime-web-unleashes-generative-ai-in-the-browser-using-webgpu/)). A browser build of SD 1.5 takes 25–50 s on Intel Iris Xe laptop graphics ([Hugging Face model card](https://huggingface.co/Zhare-AI/sd-1-5-webgpu)). Phones are further behind still.

### Scene-space upgrades improve every angle and keep drag-and-drop native

**Route E2: furniture models.** The weakest element in today's live view is the furniture: mostly procedural boxes, with only five glTF models. Hosted image-to-3D services now return textured PBR models for roughly **$0.10–0.25 (Tripo, Meshy) to $0.50–1.50 (Rodin) per model** through their APIs ([3D AI Studio†](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026)). Subscription plans work out to about $0.21–0.40 per model ([Sloyd†](https://www.sloyd.ai/blog/3d-ai-price-comparison)). These models load with the r128 GLTFLoader already in `models/` and fit the existing `scripts/pack-models.mjs` compression step, so this upgrade does **not** require leaving r128. Each model's bounding box should be scaled to the layout JSON's `w/d/h`. The `color` field can be honoured by tinting the base colour.

Licensing shapes the choice of generator:

- Microsoft's TRELLIS.2 is MIT-licensed, but needs a GPU with at least 24 GB of memory ([GitHub](https://github.com/microsoft/TRELLIS.2)).
- Tencent's Hunyuan3D 2.x licence excludes the EU, UK and South Korea ([Hugging Face](https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE)).

**Route E1: baked lighting.** This is the biggest non-AI gain for a static house. Blender Cycles can bake global illumination (light bouncing between surfaces) into lightmap textures for the fixed shell. A grid of light probes then lights movable furniture consistently with that bake. three.js r186 ships `LightProbeGridWebGL`, which bakes these probes on the GPU for the existing WebGLRenderer ([three@0.186.1 package](https://registry.npmjs.org/three/-/three-0.186.1.tgz)). Practitioners also report "much higher FPS on mobile" after baking ([svilenkovic.com](https://www.svilenkovic.com/3d/how-to-bake-lighting-for-web)).

The price is leaving r128, which crosses several breaking changes ([three.js Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)):

| Release | Breaking change |
|---|---|
| r148 | The `examples/js` scripts are removed |
| r152 | Colour management changes |
| r155 | Light intensities move to physical units |
| r161 | The single-file `three.min.js` build that the page loads from cdnjs is removed |

Maintainers advise upgrading in steps of about ten releases. Ridgeline's custom HDR, ambient-occlusion and lamp-light-field shaders all need porting. A newer three.js also isn't confirmed on cdnjs, but jsDelivr and unpkg mirror npm.

Baking has limits. Lightmaps cannot react to moved furniture, so keep shadow maps and SSAO for contact shadows. Keep the custom lamp light field for movable lamps. Expect one lightmap set per lighting preset.

**Route C: projected AI shell textures.** Here, AI imagery is baked into the shell's textures. Render the empty shell from several cameras, generate photoreal views under depth and line control with a lighting-neutral prompt, and project them back into the shell's UV textures. The result is static, compressed textures with zero runtime cost. The danger is that 2D diffusion bakes in lighting: Paint3D's whole contribution is an extra stage that removes those baked effects ([CVPR 2024](https://arxiv.org/html/2312.13913v2)). The fully optimised alternative, SceneTex, takes about **20 hours per scene on an RTX A6000** ([arXiv 2311.17261](https://arxiv.org/pdf/2311.17261)). A semi-manual tool such as StableProjectorz, which projects depth-guided images onto a model through inpaint masks, is the realistic path for one house ([CGPress](https://cgpress.org/archives/stable-projectorz-an-ai-tool-for-3d-texture-generation.html)). No published pipeline does exactly this for an interior, so treat it as an experiment. Run it after E1, so the bake supplies the lighting and the AI supplies material detail.

**Route E3: a Gaussian-splat shell.** Render a few hundred views of the empty shell per room. The camera poses are exact, so the usual step of estimating camera positions from photos (COLMAP) is unnecessary. Then train a splat with the free, Apache-licensed Brush trainer ([PlayCanvas](https://developer.playcanvas.com/user-manual/gaussian-splatting/creating/recommended-tools)).

Version requirements decide how this fits:

- **Spark**, World Labs' MIT-licensed splat renderer, needs three.js **r180 or newer** but keeps the ordinary WebGLRenderer ([npm](https://registry.npmjs.org/@sparkjsdev/spark)).
- **three.js r186's own `GaussianSplat`** works only with the new WebGPURenderer.

Spark's guidance is 1–3 million splats for 60 fps on iPhones ([Spark docs†](https://sparkjs.dev/docs/performance/)). Even compressed formats leave a whole-house splat at tens of megabytes. SOG files are 15–20× smaller than raw PLY ([PlayCanvas](https://developer.playcanvas.com/user-manual/gaussian-splatting/formats/)), compared with a few megabytes of lightmaps. Splats carry baked lighting and do not receive real-time shadows, so furniture needs shadow catchers. Zillow's SkyTour uses splats for viewing only ([Radiance Fields](https://radiancefields.com/zillow-adds-gaussian-splatting-support-with-skytour-unveiling)); no product was found that edits furniture inside one.

**Route E4: path tracing.** three-gpu-pathtracer 0.0.27 now requires WebGPU and three.js r185 or newer ([npm](https://registry.npmjs.org/three-gpu-pathtracer)). That makes it a desktop "photo mode" that would replace today's jitter-and-average refinement with true global illumination. It is not a phone feature.

### Server-side rendering buys live photorealism by giving up the static site

**Route F, pixel streaming**, runs Unreal Engine 5 with Lumen (its real-time global-illumination system) on a cloud GPU and streams video to any phone. Drag-and-drop works by sending `{type, x, z, rot…}` messages over a WebRTC data channel. Costs are about **$1.50–2.82 per streamed hour on Vagon** ([Vagon](https://vagon.io/streams/pricing)) or about $0.53 per hour self-hosted on an AWS g4dn instance ([StraySpark](https://www.strayspark.studio/blog/pixel-streaming-ue5-cloud-gaming-demo)). Input lag is 50–150 ms ([Eagle 3D Streaming](https://www.eagle3dstreaming.com/blog/performance-optimization-for-pixel-streaming-the-complete-guide)). Each concurrent visitor needs roughly one GPU, and the house must be rebuilt in Unreal.

**AI "world models"** don't fit a brief that must stay true to the plans. Genie 3 exports video only. World Labs' Marble has a "Chisel" mode that takes a box layout ([The Batch](https://www.deeplearning.ai/the-batch/world-labs-makes-its-marble-generative-world-model-public-adds-chisel-editing-tool)), but its metric accuracy is undocumented. AMD has also agreed to acquire World Labs for about $8.2 billion, with no stated commitment to Marble ([ITPro](https://www.itpro.com/business/acquisition/amd-to-acquire-another-ai-software-firm-world-labs)).

## Exact G-buffers let Ridgeline steer and check every AI frame

G-buffers are the per-pixel data a renderer produces alongside the final image: depth, surface direction, object IDs and so on. Ridgeline produces them exactly, while most archviz AI users have to estimate them from a screenshot. That difference is what makes route A trustworthy.

### Steer with ground truth, not a screenshot

Practitioner settings for keeping walls, windows and furniture in place are consistent across sources:

| Setting | Value |
|---|---|
| Depth ControlNet strength | 0.7–0.85, released at about 70% of the sampling steps |
| Line-art/edge control strength | 0.5–0.7 |
| Optional normal-map control strength | 0.3–0.5 |
| Separate low-denoise refinement passes | about 0.45 (materials) and 0.30 (lighting), with both controls still attached |

One archviz guide says running depth at full strength to the end "makes the render look stiff and CGI-like". It also says trying to fix geometry, materials and lighting in one pass is the most common reason these workflows fail ([ArchiGen AI†](https://archigenai.com/comfyui-second-pass-keep-depth-canny-controls-architects-2026.html)). Going below about 0.5 depth strength "sometimes causes spatial collapse" in interiors ([theneuralbase](https://theneuralbase.com/controlnet/learn/intermediate/interior-design-visualization/)). Depth alone is not enough either: plain depth ControlNet "often yields 'empty' rooms" ([LooseControl, SIGGRAPH 2024](https://dl.acm.org/doi/fullHtml/10.1145/3641519.3657525)). That is why the engine's line pass and object-ID pass matter. Fast one-step "Turbo" models can't use a low-denoise trick at all, because single-step image-to-image needs strength 1.0, so all structure must come from the ControlNet ([Diffusers docs](https://huggingface.co/docs/diffusers/main/en/using-diffusers/sdxl_turbo.md)).

The frontier "instruction editors" are the best-looking models: Nano Banana, Seedream, gpt-image-2 and FLUX.2. None of them accepts control maps natively. You can pass the depth or line image as an extra reference picture alongside a "keep the exact camera, geometry and window placement" prompt; an open-source Blender add-on does this with Nano Banana ([GitHub](https://github.com/Kovname/nano-banana-render)). Autodesk's tests on viewer scenes concluded that without ControlNet you get "something visually appealing but structurally unreliable". FLUX and Qwen held layouts, while Nano Banana's fidelity was "variable" ([Autodesk APS](https://aps.autodesk.com/blog/do-you-still-need-controlnet-testing-next-gen-models-viewer-scenes)). One Gemini user watched the model delete an object and add a window that did not exist ([Google AI forum](https://discuss.ai.google.dev/t/is-it-possible-to-disable-decoration-from-gemini-api-image-to-image-generation/170940)).

The prompt should be built automatically from the layout JSON and finishes (for example "charcoal velvet sofa, walnut dining table, wide oak plank floor"). Include an object only if it covers more than 1% of the frame, the rule RoomPainter uses ([RoomPainter](https://arxiv.org/pdf/2412.16778)). Real dimensions in the prompt also keep floorboard and tile scale honest.

### Check every output automatically before showing it

Because the engine knows the truth, every AI still can pass through an automatic quality gate, and a still that fails is retried or replaced. The gate makes three comparisons:

1. **Depth:** estimate depth on the output and compare it with the rendered depth after scale alignment.
2. **Lines:** measure what share of the rendered line pass has a matching edge in the output within a few pixels. This catches moved window mullions and added windows.
3. **Objects:** segment the output and compare it against the ID pass. This catches new objects on bare wall and missing furniture.

On failure, retry with stronger control, or fall back per object: where the overlap for one piece of furniture drops, blend the raster render back in for that piece only, using the ID mask. No published benchmark validates these thresholds. This is a proposed design to tune in the Phase 0 bake-off. It is also the feature that most separates Ridgeline from RoomGPT-class tools.

### Engine choices, latency and price

| Engine for "Render this view" | Price per still | Typical latency | Uses engine depth? |
|---|---|---|---|
| FLUX.1 [dev] Control-LoRA Depth on fal ([fal](https://fal.ai/models/fal-ai/flux-control-lora-depth)) | $0.04/MP; may bill a 1024² image as 2 MP ([Aident†](https://aident.ai/blog/fal-ai-image-pricing-per-image-vs-megapixel)) | ~3–26 s, depending on GPU (no fal figure published) | Yes, natively |
| FLUX General, depth + canny multi-ControlNet ([fal](https://fal.ai/models/fal-ai/flux-general)) | $0.075/MP | Similar | Yes |
| Nano Banana 2.1 ([OrcaRouter†](https://www.orcarouter.ai/blog/nano-banana-2-1-release-date)) | ~$0.034 (1K), ~$0.050 (2K) | P50 ~16 s ([OpenRouter](https://openrouter.ai/google/gemini-nano-banana-2.1)) | Only as a reference image |
| Seedream 4.5 ([fal](https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit)) / 5.0 | $0.04 / ~$0.045† | ~2–4 s (reseller test, [AnyCap†](https://anycap.ai/page/en-US/blog/best-ai-image-generator-api-developers-2026)) | Reference only |
| gpt-image-2, medium quality ([aifreeapi†](https://www.aifreeapi.com/en/posts/openai-image-generation-api-pricing)) | ~$0.04–0.05 + input tokens | ~8 s average, P95 ~15 s† | Reference only |
| Nano Banana Pro ([Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)) | $0.134 (1K/2K), $0.24 (4K); batch half price | 19 s median, up to 61 s median / 252 s P90 at 4K ([dev.to†](https://dev.to/super_lewis/nano-banana-21-vs-nano-banana-pro-same-prompts-real-latency-data-and-when-pro-is-worth-it-je0)) | Reference only |
| Stability Structure ([Stability](https://platform.stability.ai/pricing)) | ~$0.05 | Not published | Structure taken from the input image |
| Upscale on download: Topaz via fal / Clarity | $0.08 per ≤24 MP ([fal](https://fal.ai/models/topaz/upscale/image/precision)) / $0.005 per MP ([Clarity](https://clarityai.co/pricing)) | Seconds | Not applicable |

At these unit prices, **1,000 renders a month costs about $30–250** with any mainstream engine, so pick on quality, not price. At 50,000 a month the spread matters: about **$1,500–2,900** on the efficient tier (Nano Banana 2.1, Seedream, Qwen, FLUX depth) versus **$7,000–12,000+** on Nano Banana Pro or gpt-image-2 at high quality. Those figures are my arithmetic from the cited unit prices and exclude retries.

Pre-rendering a hero gallery overnight is cheap. Twenty views × five style presets with Nano Banana Pro at 4K in batch mode ($0.12 each) is about $12. The gpt-image-2 token rates conflict between OpenAI's own pages ($4/$15 vs $8/$30 per million tokens), so its true cost could differ by about 2× ([OpenAI](https://developers.openai.com/api/docs/pricing); [WaveSpeed†](https://wavespeed.ai/blog/posts/gpt-image-2-pricing-2026/)). For a sub-second "draft while you wait" tier, FLUX.2 [klein] claims edits under 0.5 s ([BFL](https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence)) at $0.00078 per image on Runware ([Runware†](https://runware.ai/collections/best-image-models)). How well it holds structure is unverified.

### Wiring it into `src/app.html` and Vercel

On the client, most of what's needed already exists in `src/app.html`:

- **The base image.** `photoThumb(cam, TW, TH)` already renders an offscreen, eight-pass Photo-real frame at any size and returns a JPEG.
- **Depth.** The Photo-real pipeline's `beauty` render target already carries a `DepthTexture`. A depth pass is one full-screen shader that converts it to a normalised greyscale image with near objects white. That matches the Depth-Anything-style maps FLUX Depth was trained on.
- **Object IDs.** Every furniture mesh is tagged with `userData.itemId`. An ID pass is one re-render with a flat colour per item, plus class colours for wall, floor, ceiling and window. Using the ADE20K colour palette would let a segmentation ControlNet read the pass directly ([sd-controlnet-seg](https://cnb.cool/ai-models/lllyasviel/sd-controlnet-seg)).
- **Lines.** A line pass can come from `THREE.EdgesGeometry` (already used for the selection box) or from a shader that finds depth and normal discontinuities.
- **Change detection.** `camSigChanged()` and the `sceneVer` counter bumped by `dirty()` already tell the renderer when the view or scene changed. The same signals can cancel stale AI requests and form the cache key.
- **Panorama capture.** `probeCapture()`, with its `CubeCamera`, is the template for capturing room panoramas in Phase 3.

The server side is new, because the site has no functions today. Vercel deploys files in a top-level `api/` folder as Functions even with the "Other" preset and no build step. `.vercelignore` doesn't exclude that folder, so the minimal backend is two small files: one to submit a render job and one to poll its status, with provider keys held in environment variables.

Vercel caps request and response bodies at **4.5 MB**. Function time is capped at **300 s on the free Hobby plan and 800 s on Pro** ([Vercel](https://vercel.com/docs/functions/limitations)). So the browser should upload its 1–2K passes directly to Vercel Blob storage and send only URLs. The Function submits an asynchronous job to the provider's queue. The page polls, and the finished image is copied into Blob because provider result URLs can expire.

Cache every result under a key built from the layout (positions rounded to about 1 cm and 1°), the quantised camera pose, the style preset, the model ID and the prompt version. Hero views and shared `#L=` links will then often load from cache for free.

A public button that spends money needs guardrails:

- a rate limit per visitor;
- a server-enforced monthly spending cap;
- a bot check before the first render;
- fixed style presets in place of free-text prompts;
- a prepaid provider balance, so a leaked key cannot run up an unbounded bill.

In the interface, add a "Render photoreal" control to the dock, then cross-fade the result over the canvas. Label it "AI-enhanced, illustrative". Copy two controls from Veras and DLSS 5: a fidelity slider (mapped to control strength) and a blend slider between raster and AI. Offer "Download 4K" as the only trigger for upscaling. AI stills are rendered in the cloud, so phones get exactly the same quality as desktops. That is an advantage none of the scene-space routes share.

### Where the Higgsfield account fits

Through Claude, the owner's Higgsfield connection can generate images from reference images, upscale, relight, convert an image into a 3D GLB model, and build 3D scenes. This makes it a strong workbench for Phase 0 bake-offs, hero images, panoramas and AI furniture. Per the catalogue queried through the workspace on 9 October 2026, its image-to-3D models include Meshy 7, Tripo H3.1 (with an option to scale models to real-world size) and Hunyuan3D v3.

Those tools act on the owner's account from Claude, though, not from a visitor's browser. A public button needs a server-side API key. Higgsfield launched a pay-as-you-go developer API on 16 September 2026. It covers 50+ models, uses a prepaid balance with a $5 minimum top-up, and refunds failed generations ([Higgsfield](https://higgsfield.ai/blog/higgsfield-api)). That makes it a reasonable production candidate if it exposes the engine the bake-off picks. No relight or upscale API endpoint is documented ([Higgsfield API docs](https://docs.higgsfield.ai/docs/api-reference/overview)), and no depth-ControlNet endpoint was confirmed there. The 3D scene-builder tools were not evaluated in this research.

## A four-phase plan banks the certain wins first

| Phase | Scope | Effort (est.) | Out-of-pocket cost | What visitors get |
|---|---|---|---|---|
| 0. Bake-off | Export beauty, depth, line and ID passes for about 10 hero views. Run three engines (FLUX depth on fal, Nano Banana 2.1 or Pro with depth as a reference via Higgsfield, Seedream). Score them with the quality gate. | 1–3 days | Under ~$25 | Nothing yet; a data-backed engine choice |
| 1. Render this view | Dock button, `api/` Functions, Blob cache, quality gate, rate limits, upscale on download, pre-rendered hero gallery | 1–2 weeks | ~$40–150/month per 1,000 renders† | A photoreal still of any view and layout in seconds |
| 2. Better live scene | (a) AI furniture GLBs normalised to the layout JSON, on r128. (b) three.js upgrade, Cycles lightmaps per lighting preset, light-probe grid. | (a) 1–2 weeks; (b) 2–4 weeks | ~$5–30 for models; $0 to run | A walkthrough that looks better from every angle, plus better AI input |
| 3. Photo spots | Furniture-free AI panoramas at fixed room nodes, live furniture composited with shadow catchers. Optionally project the plates onto shell textures. | 2–4 weeks | Tens of dollars, one-time | "Step into a photo" moments where furniture still drags |
| 4. Watch list | Spark splat shell, WebGPU path-traced photo mode, a metered "Live AI" toggle | As justified | Varies | Only if Phases 1–3 leave a clear gap |

**Phase 0** comes first because the deciding unknowns can only be measured on Ridgeline's own frames. Nobody has published a hallucination rate for any of these models on interiors. Whether instruction editors respect a depth map passed as a reference picture is also untested.

**Phase 1** follows because it gives the largest visible jump for the least code. It reuses existing render paths, and its cost scales only with use.

**Phase 2** improves what visitors see all the time. Its two parts are independent:

- **AI furniture** is low-risk and needs no engine migration, so do it early.
- **The three.js upgrade with baked lighting** is the riskiest engineering in the plan. Its regressions are confined to the renderer, though. The Playwright tests in `tests/`, especially `graphics-modes.mjs` and `screenshots.mjs`, give it a safety net.

Better live frames also make better AI input, so Phase 2 raises Phase 1's quality at no extra cost per render.

**Phase 3** is the closest thing to the "stitched" experience the question imagines: photographic rooms in which you can still drag the sofa. It comes last because it depends on furniture-free plates and on the lighting decisions made in Phase 2.

As a decision rule:

- If the goal is **shareable images** of the house and its layouts, stop after Phase 1.
- If the goal is a **walkthrough that feels real** while you move, Phase 2 matters more than any AI.
- If the goal is a **showpiece at a few signature spots**, add Phase 3.

## Geometry drift, model churn and licensing outrank cost as risks

**Geometry drift.** The central risk is the AI quietly changing the design: a window added, a mullion moved, a lamp dropped or a sofa restyled. For a plan-accurate house that might be shown to a builder or buyer, that is worse than looking less real. The quality gate, low-denoise staging and the "illustrative" label are the mitigations. Keep the 3D view as the record. The NAR's guidance that virtually staged images should be clearly labelled is a sensible norm to adopt ([NAR](https://www.nar.realtor/news/styled-staged-sold/rethinking-virtual-staging-for-todays-real-estate-agents)).

**Model churn.** Google deprecated Nano Banana 2 about four months after release. One outlet reported a shutdown on 23 days' notice, while Google's own deprecations page listed no shutdown date ([Gemini changelog](https://ai.google.dev/gemini-api/docs/changelog); [Mixed-news†](https://mixed-news.com/en/google-gemini-3-1-flash-image-shutdown-154-days-23-days-notice/); [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations)). Keep the model ID in server configuration behind one `api/render` contract, with a fallback engine.

**Latency variance.** The same Nano Banana Pro call that takes about 19 s in one test has a 252 s P90 at 4K in another. Use asynchronous jobs, client-side timeouts and 1–2K defaults.

**Licensing.** This is easy to get wrong on a public site:

- FLUX.2 [dev] and [klein] 9B are non-commercial for self-hosting, while [klein] 4B is Apache 2.0 ([BFL](https://github.com/black-forest-labs/flux2); [Hugging Face](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)).
- Qwen-Image-2.1 moved to a research licence ([Traictory†](https://traictory.com/news/2026-09-21-qwen-image-2-1)).
- Krea's realtime model is CC BY-NC-SA ([GitHub](https://github.com/krea-ai/realtime-video)), and Stable Virtual Camera outputs are non-commercial ([GitHub](https://github.com/Stability-AI/stable-virtual-camera)).
- Gemini images carry an invisible SynthID watermark ([Google DeepMind](https://deepmind.google/models/synthid/)).
- Commercial output rights for FLUX.1 [dev] endpoints served by fal were not confirmed and must be checked if FLUX depth wins the bake-off.

**Engineering and vendor risk.** The three.js migration can subtly change the look; users report scenes looking "washed out" after jumping from r143 to r164 ([three.js forum](https://discourse.threejs.org/t/updated-three-js-from-r143-to-r164-now-my-scene-looks-washed-out-why/66135)). World Labs' pending acquisition clouds Marble's future, although Spark itself is MIT-licensed on npm.

**Cost abuse.** The cost risk is abuse, not ordinary use. A static page with an unauthenticated button that spends money is an invitation to bots, so rate limits, a spending cap and a prepaid balance are requirements, not refinements.

**Open evidence gaps.** Three measurements are still missing, and the bake-off should fill them: hallucination rates on interiors, how well each engine respects a depth map passed as a reference, and real retry rates. Retries could multiply effective cost by an unmeasured factor.

## Conclusion

The research reframes the question. The useful question is not how to make the walkthrough an AI image. It is how to make AI a **renderer of stills** and an **asset factory** for the live scene, while the engine stays in charge of geometry. In that arrangement Ridgeline's existing investment becomes the moat: a to-scale model, exact camera and depth, and furniture tagged by ID. Consumer AI tools must guess geometry and cannot check their own output. Ridgeline can supply the geometry and check every frame. The same passes that steer a still today are what the next generation of real-time neural renderers consumes. DLSS 5 already takes the engine frame plus buffers, and streaming video diffusion is closing in on interactive frame rates. So building G-buffer export and automatic verification now is forward-compatible work, not a stopgap.

The less obvious finding is that the cheapest realism per dollar is probably not generative at all. Plausible bounce light and real furniture geometry fix exactly the "clean but CGI" look that also limits how good any AI pass on top of it can be. That argues for running Phase 2 alongside the AI button, not after it. It also argues against spending on live AI video until those cheaper fixes have been exhausted.
