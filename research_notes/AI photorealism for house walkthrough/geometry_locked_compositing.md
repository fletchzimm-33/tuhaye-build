# Geometry-locked AI photorealism and "stitching" AI images into an editable 3D scene (as of Oct 2026)

Research note on method and access. The sandbox's egress proxy blocked direct page fetches for arxiv.org, huggingface.co, aps.autodesk.com, archigenai.com, blockadelabs.com and patents.google.com. As a result, many paper details below come from the search engine's summaries of those pages and not from my own reading of the full text. GitHub READMEs could be fetched directly (ArchForge, RoomTex, Stable Virtual Camera, aps-viewer-ai-render). Where a number comes from a secondary summary I say so. Older work (2023) is flagged **[2023]**.

Project framing used for the inferences: Ridgeline Residence runs on three.js r128 as a single static HTML page on Vercel. Furniture is dragged and dropped, with the layout stored as JSON. The engine can emit exact depth, normals, object-ID, UV and line passes and knows the camera intrinsics and extrinsics. So "conditioning maps" never need to be estimated (MiDaS, Depth-Anything). They can be rendered exactly. That is a big advantage over most archviz practitioners, who estimate depth from a screenshot.

---

## Q1. Conditioning for structure fidelity (multi-ControlNet, T2I-Adapter, IP-Adapter, FLUX tools, Kontext-style editing): what keeps walls, windows and furniture in place, and at what strengths?

### Takeaway
Practitioner evidence through 2026 still says that some explicit structural conditioning is needed for geometry fidelity. Use depth for massing and placement, plus an edge or line map for window mullions and furniture outlines. Instruction editors (Kontext, Qwen-Image-Edit, Nano Banana/Gemini) do better than older SD img2img, but they still add or remove objects. Typical working settings:
- Depth ControlNet at about 0.5–0.8 strength, released early (end at about 0.7).
- Canny/lineart at about 0.5–0.8.
- Staged img2img with low denoise (about 0.3–0.45) for material and lighting passes.

### Cited Findings
**Depth and edge settings**
- An archviz ComfyUI guide splits the roles: depth "anchors volume" and Canny "protects selected linework". It diagnoses by symptom: an "outlined" look means Canny is too strong or the edge map is dirty; shifted masses mean depth needs adjusting. — [ArchiGen AI, "ComfyUI Second Pass: Keep Depth and Canny Attached" (2026; read via search summary, page not fetchable)](https://archigenai.com/comfyui-second-pass-keep-depth-canny-controls-architects-2026.html)
- The same practitioner source gives a FLUX exterior workflow:
  - Depth ControlNet at strength 0.8 with end step 0.7.
  - Running depth at 1.0 to the end of sampling "makes the render look stiff and CGI-like". Releasing it at 0.7 lets the last steps refine materials without forcing geometry.
  - Material and lighting passes use low img2img denoise of about 0.45 and about 0.30.
  - Trying to do geometry, materials, site context and lighting in one run is "the most common reason ComfyUI exterior workflows fail".
  - If an upscale includes another denoise pass, keep the Canny and depth ControlNets attached. — [ArchiGen AI second-pass guide](https://archigenai.com/comfyui-second-pass-keep-depth-canny-controls-architects-2026.html); [ArchiGen AI, "ComfyUI Advanced: Exterior Workflows That Actually Work"](https://archigenai.com/comfyui-advanced-tutorial.html)
- ArchForge (ComfyUI custom node, SDXL-first) suggests:
  - Canny ControlNet at strength 0.80, start/end 0.00–0.90.
  - Depth (MiDaS) at strength 0.50, start/end 0.20–0.70.
  - Up to 3 LoRAs.
  - Optional "Perspective Straighten": LSD line detection, vanishing-point search, confidence gate and a camera-rotation homography. It corrects roll and vertical keystone only, not yaw.
  - 8–12 GB VRAM is "a useful starting point".
  - The README says it is "not a replacement for BIM, CAD, technical visualization". — [GitHub jilt/ArchForge](https://github.com/jilt/ArchForge)
- Autodesk's web-viewer sample (closest analogue to a three.js app) uses:
  - Inputs: a viewer screenshot only, with no depth or normals.
  - Model: SD1.5 checkpoint `architecturerealmix_v1repair` with `control_v11p_sd15_canny` at strength 0.8.
  - Canny settings: preprocessor resolution 1472, thresholds 80/250.
  - Sampler: `dpmpp_sde` with the karras scheduler, 20 steps, CFG 7, **denoise 0.95** (output almost fully regenerated). — [GitHub autodesk-platform-services/aps-viewer-ai-render](https://github.com/autodesk-platform-services/aps-viewer-ai-render)

**Do newer models still need ControlNet?**
- Autodesk's follow-up blog ("Do You Still Need ControlNet? Testing Next-Gen Models on Viewer Scenes", João Martins) tested Flux, Qwen and Nano Banana (Gemini). It says that without depth and normal maps from the viewer "the AI hallucinates". Per search snippets, it concludes you still need ControlNet if the output must respect the design's geometry, and that with Flux "the depth map keeps walls, floors, and furniture where they belong". Its comparison table lists "Flux: Yes / Nano Banana: No / Qwen: Yes". I could not confirm what the Yes/No column means because the page was blocked. — [Autodesk APS blog (search snippets only)](https://aps.autodesk.com/blog/do-you-still-need-controlnet-testing-next-gen-models-viewer-scenes)

**FLUX.1 Tools, Kontext and Qwen-Image-Edit**
- FLUX.1 Tools (Black Forest Labs, Nov 2024) include FLUX.1 Depth (structural edits from a depth map plus prompt) and FLUX.1 Canny (edge maps). They come as [dev] open weights, as [pro] on the BFL API, and as smaller Depth-dev-lora and Canny-dev-lora adapters. NVIDIA's listing says the Depth variant is fed depth from Depth-Anything-large and is for non-commercial use (commercial use needs a BFL licence). — [AlternativeTo news, Nov 2024](https://alternativeto.net/news/2024/11/black-forest-labs-launches-flux-1-tools-a-new-suite-of-open-access-models-within-flux-1/); [NVIDIA NIM FLUX.1-dev reference](https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_1-dev); [ComfyUI docs, Flux ControlNet](https://docs.comfy.org/zh/tutorials/flux/flux-1-controlnet)
- Qwen-Image-Edit (2509 and later) has native ControlNet-style conditioning (depth, edge and keypoint maps). A guide recommends a Union LoRA at strength 0.5–0.8 "to preserve generative quality while applying the structural constraint". — [Thunder Compute, Qwen Image ComfyUI (2026)](https://www.thundercompute.com/blog/qwen-image-edit-comfyui)
- A hands-on comparison found that FLUX.1 Kontext "tends to only change what you tell it to", while Qwen-Image-Edit "takes a much freer approach unless you explicitly say not to change something". In an interior test both "preserved the room's structure and window view consistency admirably", but both had spatial-awareness errors, such as a wardrobe placed where it could not physically fit. — [Diffusion Doodles, Qwen Image Edit vs FLUX.1 Kontext vs Nano Banana](https://medium.com/diffusion-doodles/qwen-image-edit-vs-flux-1-kontext-vs-nano-banana-93fba1348a77)
- On GEdit-Bench-EN, FLUX.1 Kontext [dev] scores 6.51 overall, behind Qwen-Image-Edit-2509 and Step1X-Edit v1.1. These are general editing benchmarks, not architectural ones. Licences: Kontext [dev] is non-commercial, while Qwen-Image-Edit is described as Apache 2.0. — [builderai.tools, Instruction Image Editing 2026](https://builderai.tools/blog/ai-image-editing-flux-kontext-qwen-image-edit-step1x)
- A GitHub issue reports a single ControlNet checkpoint for Qwen-Image-2.1 covering Canny, Depth and others. This is unverified against an official Alibaba source. — [mflux issue #841](https://github.com/mflux-community/mflux/issues/841)

**Nano Banana / Gemini image**
- Practitioners report Nano Banana (Gemini 2.5 Flash Image, and later Nano Banana Pro / 2) turning clay or SketchUp/Rhino viewport renders into photoreal images "while maintaining geometric detail". Vendors such as Rendair claim it applies the style "without distorting the geometry". This is marketing or tutorial content, not a benchmark. — [Lilys.ai notes on Nano Banana for architecture](https://lilys.ai/en/notes/nano-banana-20251106/nano-banana-architecture-ai-image-generator); [Rendair AI blog](https://rendair.ai/blog/nano-banana-2-for-architects-now-live-in-rendair-ai); [MyArchitectAI guide](https://www.myarchitectai.com/blog/nano-banana-for-architects)
- A counter-example on the Gemini API forum: the model removed a circled object (a bottle) from a render and added a window that was not there. Google staff suggested prompt and system-instruction tuning. — [Google AI developer forum thread](https://discuss.ai.google.dev/t/is-it-possible-to-disable-decoration-from-gemini-api-image-to-image-generation/170940)

**Multi-modal control weighted by region**
- NVIDIA Cosmos-Transfer1 (Mar 2025, open code and models) has separate control branches for segmentation, depth, edge and blur. A spatiotemporal control map weights each modality differently per pixel and region before the branches are fused. It is explicitly motivated by Sim2Real: depth and segmentation that a CG simulator gives for free make renders more realistic "while preserving scene structure and semantics". Real-time inference was reported only on a GB200 NVL72 rack. — [arXiv 2503.14492](https://arxiv.org/abs/2503.14492v2); [NVIDIA Cosmos-Transfer1 project page](https://research.nvidia.com/labs/cosmos-lab/cosmos-transfer1)

### Inferences
**Inputs**
- Feed the engine's exact z-buffer as depth (normalised per view, near = white), not depth estimated from the beauty pass. FLUX.1 Depth was trained on Depth-Anything-style maps, so match their tonal conventions (inverse-depth look, full contrast range).
- Use a geometric line pass (three.js `EdgesGeometry` or crease and silhouette edges) in place of Canny on a screenshot. It gives clean mullion and furniture edges with no texture noise. That is exactly the "clean the edge input" advice above.

**Settings and staging**
- Recommended starting stack for hero stills of a room:
  1. Depth at 0.7–0.85, end at about 0.7.
  2. Lineart/Canny at 0.5–0.7, end at about 0.8–0.9.
  3. Optional normal map at about 0.3–0.5 for wall and ceiling plane orientation.
  4. A staged second pass with low denoise (0.3–0.45) and both controls still attached.
- Expect to tune per base model. The numbers above come from SDXL and FLUX workflows and are not universal.

**Choice of tool**
- Instruction editors (Kontext, Qwen-Edit, Gemini) are attractive because they take the raw three.js render directly. They should be used with a structural control (Qwen/Flux) or verified automatically (see Q7), because they occasionally add or remove windows and objects.
- Licensing matters for a public site. FLUX [dev] variants and SEVA are non-commercial; Qwen is Apache 2.0.

### Gaps
- I could not fetch the Autodesk "Do you still need ControlNet" post, so its per-model verdicts are unconfirmed.
- I found no controlled study with numbers comparing T2I-Adapter vs ControlNet vs FLUX Depth for interior geometry drift.
- FLUX.2 / FLUX Kontext follow-ups and Gemini 3 image models: I found no archviz-specific geometry evaluation.
- The Black Forest Labs model cards (recommended guidance values for FLUX.1 Depth/Canny) were blocked.

---

## Q2. Masked and regional approaches: enhance the static shell once, inpaint or relight only around a moved piece, and per-object regional prompts from the ID mask

### Takeaway
The building blocks exist and are well proven in research texturing pipelines:
- inpainting restricted to masks,
- per-instance prompts gated by pixel coverage,
- segmentation-conditioned ControlNets.

There is little practitioner literature on "re-inpaint only around a dragged sofa" for interactive apps. It would have to be assembled from these parts.

### Cited Findings
**Masks and segmentation conditioning**
- StableProjectorz uses Depth ControlNet by default and img2img inpaint masking "to project only into selected areas". This is the masked-region idea applied to 3D. — [Styly tutorial on StableProjectorz](https://styly.cc/tips/ai-stablediffusion-stableprojectorz/); [CGPress](https://cgpress.org/archives/stable-projectorz-an-ai-tool-for-3d-texture-generation.html)
- The public segmentation ControlNet (`sd-controlnet-seg`, SD1.5) is conditioned on ADE20K-protocol colour maps. Community code paints each class with a fixed ADE20K RGB palette (for example [120,120,120] for wall). A 3D engine can therefore paint its own object-ID pass in ADE20K colours and skip the segmenter. — [lllyasviel sd-controlnet-seg mirror](https://cnb.cool/ai-models/lllyasviel/sd-controlnet-seg); [HF Space controlnet_seg.py example](https://huggingface.co/spaces/yuan2023/Stable-Diffusion-ControlNet-WebUI/blob/main/diffusion_webui/controlnet/controlnet_seg.py)

**Per-instance prompts (RoomPainter, CVPR 2025)**
- For each view it computes each instance's share of rendered pixels and adds that instance's text to the global prompt if the share exceeds 0.01.
- Furniture instances get their own view-specific prompts in a second "repaint" stage (MVRS), which also handles occlusion. — [RoomPainter arXiv 2412.16778](https://arxiv.org/pdf/2412.16778); [CVPR 2025 open access](https://openaccess.thecvf.com/content/CVPR2025/html/Huang_RoomPainter_View-Integrated_Diffusion_for_Consistent_Indoor_Scene_Texturing_CVPR_2025_paper.html)

**Shell first, then objects (RoomTex, ECCV 2024)**
- RoomTex textures the room shell first from a panorama. It then textures each object iteratively by inpainting over selected views, and removes objects to inpaint the walls, floor and ceiling behind them.
- It supports per-object editing (for example aligning an object's texture to a sketch). — [RoomTex project page](https://qwang666.github.io/RoomTex/); [ECCV 2024 paper](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08662.pdf)

**Regional weighting at the model level**
- Cosmos-Transfer1's per-region control-weight map is a model-level form of "different conditioning strength in different regions". — [arXiv 2503.14492](https://arxiv.org/html/2503.14492v2)
- Very recent work (Jul 2026, "Appearance Pointers: Multimodal Region Control of Diffusion Transformers") targets region-level control in DiT models. I saw only the title and abstract-level search result, so the method is unverified. — [arXiv 2607.19344](https://arxiv.org/pdf/2607.19344)

### Inferences
**Practical "shell once, patch locally" loop for Ridgeline**

*Offline, once per curated viewpoint*
1. Render the room with no furniture (shell only), plus depth, lines and ID.
2. Run the full ControlNet enhancement and save it as the "plate".

*On each furniture drag*
1. Compute the screen-space bounding box of the moved piece's old and new positions, plus a margin for its shadow footprint. Dilate the mask by roughly 32–64 px.
2. Composite (a) the live-rendered furniture over the plate, then (b) optionally send only that crop to an inpainting model. Use depth, lines and ID for the crop and low denoise (about 0.3–0.4) to "harmonise" contact shadows and reflections.
3. Feather-blend the result back.

This keeps the rest of the frame pixel-identical and stable, which avoids "everything shimmers when I move one chair".

**Regional prompts from the ID pass**
- Map each furniture `type`/`color` from the layout JSON to a region prompt ("walnut plank floor", "charcoal velvet sofa"). Then either use a regional-prompting or attention-couple node, or run per-region masked passes.
- RoomPainter's 1% pixel-share rule is a sensible filter for which object prompts to include in each view.

**Cost**
- Latency is the main constraint. Masked inpaint calls on a cloud GPU take seconds, not milliseconds. On a static Vercel site this means an explicit "Render photoreal" button (asynchronous), not something that runs during drag. See the StreamDiffusion numbers in Q6/Q7 for the real-time ceiling.

### Gaps
- I found no published practitioner write-up or benchmark of "re-inpaint only the moved object's region" inside an interactive viewer.
- I could not verify the current status of ComfyUI regional-prompting nodes (Regional Prompter, attention couple) for FLUX or Qwen; none surfaced in searches.

---

## Q3. Layered compositing: an AI background plate plus live 3D furniture (depth occlusion, shadow catchers, light matching). How do IKEA Kreativ-style and virtual-staging products do it, and what looks fake vs real?

### Takeaway
Commercial "furniture-into-photo" systems (IKEA Kreativ) work in three steps:
1. reconstruct metric geometry and wide-angle imagery of the room,
2. use that geometry for occlusion and scale,
3. add learned lighting estimation and furniture erasure.

They have published no compositing details. Research since 2024 (ZeroComp, SpotLight, DiffusionRenderer) shows that a diffusion "neural renderer" can harmonise shading and shadows of an inserted 3D object from its intrinsic passes. The realism killers are well known: missing contact shadows, wrong shadow softness or direction, perspective and scale mismatch, and noise/grain mismatch.

### Cited Findings
**IKEA Kreativ (what is public)**
- Core technology came from Geomagical Labs (acquired by Ingka in April 2020).
- Phone photos plus sensor data go to a cloud pipeline on a "heavily parallelized GPU cluster" that creates "wide-angle imagery with spatial data". It combines ML, computational photography, stereo vision and mixed-reality 3D graphics. Neural networks are trained on indoor objects and geometry. — [VentureBeat](https://venturebeat.com/ai/ikea-launches-first-ai-powered-design-experience-no-swedish-meatballs-included); [Ingka newsroom](https://www.ingka.com/newsroom/ikea-launches-new-ai-powered-experience-empowering-customers-to-create-lifelike-room-designs/)
- IKEA says products appear with "realistic size, perspective, occlusion and lighting". Ingka's Guindi said that harmonising virtual objects with real photos required a "much better understanding of the lighting inside a room". Erasing furniture requires estimating "geometry and imagery hidden behind furniture". — [VentureBeat](https://venturebeat.com/ai/ikea-launches-first-ai-powered-design-experience-no-swedish-meatballs-included); [IKEA US newsroom](https://www.ikea.com/us/en/newsroom/corporate-news/ikea-launches-new-ai-powered-digital-experience-empowering-customers-to-create-lifelike-room-designs-pub58c94890/)
- Related patents: Geomagical Labs US 11,367,250 B2 and continuation US 12,271,994 B2, "Virtual interaction with three-dimensional indoor room imagery" (priority March 2019; '994 granted Apr 2025). I could not read the claim text (blocked), so I cannot confirm they cover occlusion, shadow or lighting methods. — [Google Patents US11367250B2](https://patents.google.com/patent/US11367250); [USPTO Gazette US 12,271,994 B2](https://patentsgazette.uspto.gov/week14/OG/html/1533-2/US12271994-20250408.html)

**Research on harmonising inserted objects**
- ZeroComp (WACV 2025):
  - Inputs: a background image plus intrinsic maps (depth, normals, albedo) of the inserted 3D object.
  - Method: a ControlNet on intrinsics drives Stable Diffusion as the renderer.
  - Needs no scene geometry and no lighting estimate.
  - Trained on synthetic indoor data, it generalises to real images.
  - Limitation: no explicit lighting control. — [arXiv 2410.08168](https://arxiv.org/pdf/2410.08168); [WACV 2025 listing](https://mlanthology.org/wacv/2025/zhang2025wacv-zerocomp)
- SpotLight (2024/25) injects a user-specified shadow into a pretrained diffusion renderer without retraining. The shadow can come from basic shadow mapping in the desired light direction. The method "progressively harmonizes imperfect shadows with the background while relighting the object". Its Figure 1 example is a virtual chair. — [arXiv 2411.18665](https://arxiv.org/html/2411.18665v3)
- DiffusionRenderer (NVIDIA, CVPR 2025 oral) uses video diffusion for inverse rendering (G-buffers from real video) and forward rendering (photoreal images from G-buffers). It enables relighting, material editing and realistic object insertion. — [NVIDIA project page](https://research.nvidia.com/labs/toronto-ai/publication/2025_cvpr_diffusionrenderer); [CVPR 2025 open access](https://openaccess.thecvf.com/content/CVPR2025/html/Liang_Diffusion_Renderer_Neural_Inverse_and_Forward_Rendering_with_Video_Diffusion_CVPR_2025_paper.html)
- LightHarmony3D (March 2026) targets object insertion into 3D Gaussian Splatting scenes for AR/VR and virtual staging. Details were not verified. — [arXiv 2603.29209](https://arxiv.org/html/2603.29209v1)

**What makes staging look fake (vendor blogs, so rules of thumb)**
- Missing or unblended contact shadows make furniture "hover".
- Shadow softness should match the light source. Large windows mean soft, feathered shadows; sharp shadows in diffuse light give it away.
- Shadows must fall away from the visible windows.
- Perspective must match the camera. "Even a 3-degree offset can ruin the perspective."
- Off-scale pieces are a classic error.
- Inserted furniture that is cleaner than the photo (no matching noise or grain) looks pasted. — [virtualstaging.art Photoshop vs AI](https://www.virtualstaging.art/blog-posts/adobevirtualstaging); [virtualstaging.art how-to 2026](https://www.virtualstaging.art/articles/how-to-virtually-stage-a-room); [Imagen AI virtual staging](https://imagen-ai.com/post/virtual-staging-2/); [HomeJab placement best practices](https://homejab.com/virtual-staging-furniture-placement-best-practices/); [Bella Staging limitations (Aug 2026)](https://www.bellavirtual.com/blogs/news/virtual-staging-limitations-what-it-can-and-cannot-do-for-your-listing)

### Inferences
**Ridgeline already has what Kreativ must reconstruct**
- Exact geometry, scale and camera are known. So "plate + live furniture" is mostly a three.js render-order problem, not an AI problem. A suggested r128 setup (from general three.js knowledge, not a cited source):
  - Show the AI plate as a full-screen background (a screen-aligned quad or `scene.background` texture) for a **fixed camera node**.
  - Render the room shell meshes with `colorWrite = false` so they write depth only. Live furniture is then correctly occluded by walls and islands.
  - Put a `ShadowMaterial` floor and wall "shadow catcher" under the furniture so it receives a soft directional or area-approximated shadow that multiplies onto the plate.
  - Add a cheap baked or SSAO contact-shadow blob.
  - Light furniture with an environment map built from the same plate or the room panorama (PMREM), so reflections and fill light match the AI image.
  - Add film grain and slight blur to the live layer to match the plate's noise.
- The plate is only valid at its exact camera pose. Orbiting breaks parallax, so this approach suits "photo spots" (snap-to camera nodes) in the walkthrough, with free 3D navigation kept on plain real-time rendering between them.

**Optional AI harmonisation pass**
- On "Render photoreal", send plate, furniture intrinsics and a basic shadow map to a ZeroComp/SpotLight-style model, or to a masked FLUX/Qwen inpaint (Q2). This adds the inter-reflection and colour-bleed that real-time shading lacks.

**Furniture-free plates are required**
- If the plate was generated with furniture in it, moving that furniture leaves "ghosts" (the AI-painted sofa and its shadow). Generate plates from the empty shell, or keep only fixed built-ins (kitchen, fireplace) in the plate.

### Gaps
- No public IKEA/Geomagical engineering talk, blog or paper describing the lighting-estimation or compositing math was found, and the patent text could not be read.
- Licence and code availability for ZeroComp and SpotLight were not verified (pages blocked).
- I found no product that composites live WebGL furniture over AI-enhanced plates and documents its approach.

---

## Q4. Projecting AI images back onto geometry ("AI texture baking" / projection texturing)

### Takeaway
Scene-level texturing has matured in three generations:
1. Per-view inpaint-and-project [2023]: TEXTure, Text2Tex, DreamSpace.
2. Slow optimization: SceneTex, about 20 h per scene.
3. Faster zero-shot, view-integrated or multi-view-synchronised methods: RoomTex (ECCV 2024), RoomPainter (CVPR 2025), MVPaint (CVPR 2025), plus layout-to-scene multi-view generators such as SpatialGen (2025).

The practical problems for Ridgeline:
- Baked-in view-dependent lighting and shadows (furniture shadows get "painted" on the floor).
- Seams at UV and view boundaries.
- Projection tools mostly built on SD1.5/SDXL-era stacks.

Projecting onto the *static shell only* (walls, floor, ceiling, built-ins), with lighting-neutral prompts, is the version that stays compatible with drag-and-drop.

### Cited Findings
**[2023] Text2Tex (ICCV 2023)**
- Uses a depth-aware inpainting diffusion model to build partial textures across views, with a per-texel generation mask and automatic next-best-view selection.
- Refining with 20 extra views lowered FID from 37.09 to 35.68.
- Without inpainting, depth-to-image alone gave inconsistent appearance across views. — [arXiv 2303.11396](https://arxiv.org/pdf/2303.11396); [ICCV 2023](https://openaccess.thecvf.com/content/ICCV2023/html/Chen_Text2Tex_Text-driven_Texture_Synthesis_via_Diffusion_Models_ICCV_2023_paper.html); [code (fork)](https://github.com/bruinxiong/text2tex)

**[2023] DreamSpace**
- Generates a 360° panorama from the room centre, coarse-to-fine, then propagates it to unseen regions by inpainting.
- "Dual texture alignment" blends style-first and align-first versions using depth edges.
- The authors note that stylisation and exact geometric alignment trade off against each other. — [DreamSpace paper PDF](https://ybbbbt.com/publication/dreamspace/media/DreamSpace.pdf)

**SceneTex (CVPR 2024)**
- Optimises a multi-resolution texture field with VSD and depth ControlNet over 5,000 viewpoints and 30,000 iterations, producing a 4096×4096 texture.
- Takes about **20 hours per scene on one RTX A6000**.
- Later work says it blurs occluded regions and is computationally heavy. — [arXiv 2311.17261](https://arxiv.org/pdf/2311.17261); [RoomPainter critique](https://arxiv.org/pdf/2412.16778)

**RoomTex (ECCV 2024, code Apache-2.0)**
1. Unwraps the room mesh into a panoramic depth map.
2. Generates a room panorama with SDXL + SDXL depth ControlNet as the global style reference.
3. Reprojects it to perspective views.
4. Textures each object by iterative inpainting, refining adornments.

Setup notes:
- Tested on A100/V100.
- Needs a pinned, patched AUTOMATIC1111 web UI.
- No runtime numbers or explicit UV/mesh export are documented in the README. — [GitHub qwang666/RoomTex-](https://github.com/qwang666/RoomTex-); [project page](https://qwang666.github.io/RoomTex/)

**RoomPainter (CVPR 2025)**
- Zero-shot adaptation of a 2D diffusion model.
- Stage 1, Multi-View Integrated Sampling, produces a whole-room texture for global consistency.
- Stage 2, Multi-View Integrated Repaint Sampling, repaints instances and fills occlusions.
- Claims better quality, consistency and "generation efficiency" than per-view inpainting (seams) and optimisation methods. No public code link was found. — [arXiv 2412.16778](https://arxiv.org/html/2412.16778v2)

**MVPaint (CVPR 2025, object-level)**
- Synchronised multi-view generation.
- Spatial-aware 3D inpainting for unseen regions.
- UV refinement with "spatial-aware seam-smoothing" for UV-unwrap discontinuities. — [arXiv 2411.02336](https://arxiv.org/abs/2411.02336v1); [CVPR 2025 poster](https://cvpr.thecvf.com/virtual/2025/poster/33227)

**Paint3D (CVPR 2024)**
- 2D diffusion views bake in "lighting effects" and leave holes. Paint3D adds a second UV-space stage that inpaints and *removes illumination artifacts* to produce "lighting-less" textures that can be relit. — [arXiv 2312.13913](https://arxiv.org/html/2312.13913v2); [CVPR 2024 paper](https://openaccess.thecvf.com/content/CVPR2024/papers/Zeng_Paint3D_Paint_Anything_3D_with_Lighting-Less_Texture_Diffusion_Models_CVPR_2024_paper.pdf)

**FlashTex (Roblox) and CasTex**
- FlashTex lists the main weaknesses of prior text-to-texture work as slow generation, seams, and baked-in lighting that looks wrong under new lighting. Its LightControlNet takes the target lighting as a condition so materials are disentangled and relightable. — [arXiv 2402.13251](https://arxiv.org/pdf/2402.13251); [Roblox publication page](https://about.roblox.com/publications/flashtex-faste-relightable-mesh-texturing)
- Even WACV 2026 PBR texturing (CasTex) "occasionally struggles to fully disentangle the lighting effects", with partially baked highlights; metals are the hardest case. — [CasTex WACV 2026 supplemental](https://openaccess.thecvf.com/content/WACV2026/supplemental/Aliev_CasTex_Cascaded_Text-to-Texture_WACV_2026_supplemental.pdf)

**Seams from UVs**
- Practical seam causes are often the UV layout. Meshy's docs say to generate a clean UV layout before re-texturing. — [Meshy docs, AI texturing](https://docs.meshy.ai/en/webapp/guides/3d-model/ai-texturing)

**StableProjectorz (free desktop tool)**
- Generates depth-conditioned images, "projects" them onto the 3D model, and supports multi-view projection.
- Supports inpaint masks to project only into chosen areas, a style-transfer ControlNet unit, and per-projection HSV/contrast adjustments.
- Can bake AO on top and preserves the original UVs.
- 2024-era docs describe an AUTOMATIC1111 backend. I found no confirmation of SDXL/FLUX support. — [Styly tutorial](https://styly.cc/tips/ai-stablediffusion-stableprojectorz/); [CGPress](https://cgpress.org/archives/stable-projectorz-an-ai-tool-for-3d-texture-generation.html)

**Layout to multi-view to 3D**
- SceneCraft (NeurIPS 2024): text plus a bounding-box layout plus a camera path. It renders layout maps, generates views with a layout-conditioned diffusion model (SceneCraft2D), then distils them into a NeRF or 3DGS. It works for multi-room scenes without panoramas. — [arXiv 2410.09049](https://arxiv.org/html/2410.09049v3); [NeurIPS 2024 poster](https://neurips.cc/virtual/2024/poster/96143)
- SpatialGen (HKUST + Manycore, Sep 2025):
  - Multi-view diffusion conditioned on a 3D semantic layout plus a reference image or text.
  - Generates **RGB + geometry + semantics** from arbitrary viewpoints, using alternating cross-view and cross-modal attention, then reconstructs 3D.
  - Training data: 12,328 scenes and 57,440 rooms, with 4.7M renderings.
  - The authors state data and models are open-sourced. — [SpatialGen arXiv 2509.14981](https://arxiv.org/pdf/2509.14981v2); [Moonlight review](https://www.themoonlight.io/review/spatialgen-layout-guided-3d-indoor-scene-generation)

### Inferences
**Recommended bake for Ridgeline**
1. Remove all movable furniture.
2. Render the empty shell from N cameras (one panorama per room centre, plus a few corner views for surfaces occluded from the centre).
3. Generate photoreal views with depth + line + ID control and a *lighting-neutral* prompt ("overcast diffuse daylight, no strong shadows, no furniture").
4. Back-project into the shell's existing UVs or lightmap UVs. Blend views by the cosine of view angle to the surface normal times distance weight; use the depth test for visibility.
5. Optionally run a UV-space inpaint or seam-smooth pass (MVPaint-style).

**Lighting in the bake**
- Bake shell lighting only (AO and window light). Leave furniture shadows to the real-time layer (shadow catcher, SSAO). This keeps furniture movable without invalidating the bake.
- Any AI view that contains furniture paints furniture shadows and colour bleed onto the floor. Those become wrong as soon as the piece moves. Baked specular reflections (glossy floor, windows) look "painted" when the camera moves; mask or roughen glossy surfaces before projection.

**Asset size**
- Baked textures for walls and floors are static assets that fit a Vercel static site. Rough budget: at 4K per room surface set with KTX2/Basis compression, several MB per room. Real-time cost is unchanged from the current three.js scene, and this is the only approach in this survey that gives AI-quality surfaces from **any** viewpoint while keeping full orbit and drag-and-drop.

**Research tools vs practical tools**
- Research codebases (RoomTex, SceneTex) assume their own mesh and dataset formats and A100-class GPUs. For a single house, a semi-manual StableProjectorz-style or custom Blender/ComfyUI projection is likely more practical than adopting a research repo.

### Gaps
- No per-scene runtime or VRAM numbers were found for RoomTex, RoomPainter or DreamSpace. Only SceneTex's 20 h / A6000 is documented.
- TEXTure [2023] (trimap keep/refine/generate) did not surface in searches, so it is not characterised here.
- Whether RoomPainter and SpatialGen code and weights are actually released, and under what licence, was not verified (project pages and HF blocked).
- No source quantified how badly moving furniture degrades a baked projection; that conclusion above is reasoning, not a cited finding.

---

## Q5. 360° / equirectangular panorama generation per room (from a three.js cubemap plus depth), seam handling, and use as backgrounds or environment maps

### Takeaway
Equirectangular generation is well served:
- Seam fixes: circular blending and padding in the latent and especially in the VAE decoder/encoder.
- Layout and depth control: PanFusion, Top2Pano, RoomTex's panoramic depth plus ControlNet.
- Full products: Skybox AI exports up to 8K, HDRI, depth and experimental GLB; HunyuanWorld 1.0 gives an open panorama with a layered mesh.

The core limitation for Ridgeline: a panorama is correct only from its capture point. It suits room "photo-sphere" stops and environment lighting, not free walking.

### Cited Findings
**Seam handling**
- Diffusion360 blends the left and right edges of the latent with adaptive weights at each denoising step. The authors found that circular blending in the **VAE decoder** matters more than in the latent stage for geometric continuity. — [Diffusion360 arXiv 2311.13141](https://ar5iv.labs.arxiv.org/html/2311.13141)
- 360Anything traces ERP-boundary seams to **zero-padding in the VAE encoder** and fixes them with cyclic padding before encoding. DiT360 treats the horizontal axis as periodic. — [360Anything dataset/paper reference](https://huggingface.co/datasets/tgaiml/360anything); [DiT360 write-up](https://studio.aifilms.ai/blog/dit360-ai-panorama-generation-insta360-research)

**Panorama generators with layout or depth control**
- PanFusion (CVPR 2024) uses Equirectangular-Perspective Projection Attention to keep geometry correct. It is trained mainly on indoor scenes and accepts panorama-level controls such as room layout. — [CVPR 2024 paper](https://openaccess.thecvf.com/content/CVPR2024/papers/Zhang_Taming_Stable_Diffusion_for_Text_to_360_Panorama_Image_Generation_CVPR_2024_paper.pdf); [arXiv 2404.07949](https://arxiv.org/html/2404.07949v1)
- PanoDiffusion does indoor RGB-D 360° outpainting (trained on RGB plus depth). Top2Pano renders coarse colour and depth panoramas from a top-down layout, then refines them with ControlNet. — [PanoDiffusion arXiv 2307.03177](https://arxiv.org/html/2307.03177v7); [Top2Pano summary](https://www.emergentmind.com/topics/top2pano)
- RoomTex already generates the room panorama from a mesh-unwrapped panoramic depth map with SDXL depth ControlNet, which is the same pipeline Ridgeline would use. — [RoomTex GitHub](https://github.com/qwang666/RoomTex-)

**HunyuanWorld 1.0 (Tencent, Jul 2025, open source)**
- Generates a panorama as a "world proxy", then "agentic world layering" into semantic layers, with **mesh export**.
- Model zoo includes PanoDiT and PanoInpaint, with FP8 support.
- A single third-party test saw left and right edges drift, so seams are not fully solved. — [arXiv 2507.21809](https://arxiv.org/html/2507.21809v1); [tech report](https://3d-models.hunyuan.tencent.com/world/HY_World_1_technical_report.pdf); [wiro.ai test](https://wiro.ai/blog/hunyuanworld-text-to-panorama-6-prompt-test/)

**Skybox AI (Blockade Labs)**
- API exports PNG, HDRI (EXR/HDR), depth map (`depth-map-png`), cube map and video at 1K–8K.
- Depth maps are now always generated with each skybox.
- GLB mesh export is "experimental": four density levels, depth scale 3.0–10.0 (default 3.0), built for parallax rather than separate objects.
- The API's `control_model` parameter currently has only the value "remix" (used with `control_image`). Separately, `init_image` + `init_strength` scales the influence of an init image. Sketch mode is a web-app feature.
- A third-party review says Model 4 reached the API in Feb 2026. — [Blockade API: exports](https://api-documentation.blockadelabs.com/api/skybox-exports.html); [API changelog](https://api-documentation.blockadelabs.com/api/changelog.html); [Blockade support: Export 3D models](https://support.blockadelabs.com/hc/en-us/articles/31649281677074-Export-3D-Models-from-Skybox-AI); [Blockade API: skyboxes](https://api-documentation.blockadelabs.com/api/skybox.html); [techbloat review](https://www.techbloat.com/?p=1937009)

### Inferences
**Pipeline for Ridgeline**
1. At each room's centre, capture a `CubeCamera` cubemap of colour, depth and lines (r128 has `CubeCamera` and `WebGLCubeRenderTarget`). Convert it to equirectangular in a shader, at 2:1, for example 4096×2048.
2. Generate with a depth (+line) ControlNet using circular padding in both the VAE encode and decode (the seam lesson from Diffusion360 and 360Anything).
3. Optionally run a seam-centred second pass: roll the panorama 50%, inpaint a vertical strip, roll back.
4. Zenith and nadir (ceiling and floor poles) are poorly handled by ERP diffusion. Inpaint them on cube faces.

**Using the result in three.js**
- (a) As `scene.background` (EquirectangularReflectionMapping) when the camera is at the capture point, with live furniture composited using the shell depth (as in Q3).
- (b) As a PMREM environment map for live-furniture reflections and ambient light.
- (c) Projected onto the room shell from the capture point (a "projected panorama"), giving correct parallax on walls and floor that are visible from the centre. Areas occluded from the centre need extra views (as in Q4).

**Which tool**
- Skybox AI's remix control image is a style/structure hint, not an exact depth lock. For exact alignment with Ridgeline geometry, a self-hosted depth-ControlNet panorama (RoomTex-style) is safer than Skybox AI. Skybox's 8K plus HDRI export is useful for exterior mountain backdrops seen through windows.

### Gaps
- I found no published pipeline that combines a three.js or engine cubemap with exact depth into a seam-free, depth-locked ERP generation with reported fidelity numbers.
- I could not confirm whether Skybox AI's `control_image` accepts an equirectangular depth or line map as a geometry lock.
- PanFusion and Diffusion360 code and VRAM were not verified (GitHub/HF pages not fetched).

---

## Q6. Multi-view consistency: making several AI views of the same room agree

### Takeaway
Shared seeds and style tricks (StyleAligned shared attention, IP-Adapter) align *style*, not *content*. Real cross-view agreement comes from three directions:
- Geometric coupling in the sampler: RoomPainter's integrated sampling, MVPaint's synchronised views, SpatialGen's cross-view attention.
- Camera-conditioned novel-view or video diffusion: Stable Virtual Camera (SEVA), Wan VACE with depth, Cosmos-Transfer.
- The most robust option: generating once into shared 3D (baked textures or a panorama) and re-rendering.

For a known-geometry scene, the "texture once, render many" approach in Q4/Q5 dominates per-view generation for consistency.

### Cited Findings
**Style alignment (StyleAligned, IP-Adapter)**
- StyleAligned (CVPR 2024, Google) shares attention from every image in a batch to the first one, giving a style-consistent set with no training. It works on any attention-based T2I model, and inversion lets a reference image serve as the anchor. — [CVPR 2024 paper](https://openaccess.thecvf.com/content/CVPR2024/papers/Hertz_Style_Aligned_Image_Generation_via_Shared_Attention_CVPR_2024_paper.pdf)
- An e-commerce consistency paper reports that StyleAligned on FLUX causes "severe text controllability degradation", and that IP-Adapter performs "suboptimally in text control and style consistency". — [arXiv 2409.04750](https://arxiv.org/pdf/2409.04750)

**Stable Virtual Camera / SEVA (Stability AI, Mar 2025)**
- Any number of input views and any target cameras.
- Consistent output without 3D distillation; videos up to about 30 s with loop closure.
- 1.3B parameters at 576p; v1.1 fixes foreground objects detaching from the background in v1.0.
- Outputs are under a **non-commercial** licence; native Windows is unsupported.
- Reported +1.5 dB PSNR over CAT3D (secondary summary). — [arXiv 2503.14489](https://arxiv.org/abs/2503.14489); [GitHub Stability-AI/stable-virtual-camera](https://github.com/Stability-AI/stable-virtual-camera); [hyper.ai summary](https://hyper.ai/papers/2503.14489)

**Video diffusion with control**
- Wan 2.1 VACE ComfyUI templates restyle a source video guided by a reference image, with per-frame DepthAnything V2 or Canny control preserving motion and timing. The 14B model gives 720p with higher fidelity (slower, more VRAM); the 1.3B model gives 480p. — [Comfy.org Wan VACE video restyle template](https://comfy.org/workflows/templates_shane_video_restyle-5931e9bdf9db/); [Comfy.org Wan2.1 VACE control video](https://comfy.org/ru/workflows/video_wan_vace_14B_v2v-2652985596d8/)
- Cosmos-Transfer1 conditions video generation on segmentation, depth and edge from a simulator for structure-preserving photorealism (see Q1). — [arXiv 2503.14492](https://arxiv.org/abs/2503.14492v2)

**Multi-view texturing and generation**
- RoomPainter's Multi-View Integrated Sampling addresses the "severe cross-view inconsistencies and conspicuous seams" of per-view inpainting. — [arXiv 2412.16778](https://arxiv.org/html/2412.16778v2)
- MVPaint generates views synchronously, then fixes unseen regions in 3D and UV space. — [arXiv 2411.02336](https://arxiv.org/abs/2411.02336v1)
- SpatialGen alternates cross-view and cross-modal attention, conditioned on the 3D layout, to produce consistent RGB, depth and semantics across arbitrary views. — [arXiv 2509.14981](https://arxiv.org/pdf/2509.14981v2)

**Real-time throughput ceiling**
- StreamDiffusion (ICCV 2025) reaches up to 91.07 fps image generation on one RTX 4090 and lists video-game rendering as a target use.
- StreamDiffusionV2 reports 58.28 FPS (14B) and 64.52 FPS (1.3B) on **four H100s**, with first frame in under 0.5 s.
- These are throughput numbers without ControlNet-conditioned game-engine latency. — [StreamDiffusion ICCV 2025](https://openaccess.thecvf.com/content/ICCV2025/html/Kodaira_StreamDiffusion_A_Pipeline-level_Solution_for_Real-Time_Interactive_Generation_ICCV_2025_paper.html); [StreamDiffusionV2 arXiv 2511.07399](https://arxiv.org/html/2511.07399v2)

### Inferences
**Per-view stills (plates)**
1. Use the *same* seed, prompt, LoRA, reference image (IP-Adapter or Kontext reference) and identical control strengths for all plates of one room.
2. Generate the panorama first and derive perspective plates from it (RoomTex-style), so materials are literally shared.
3. Where views overlap, warp view A into view B using the known depth and camera, and use it as an init or inpaint-context image for B with a low denoise. This uses Ridgeline's exact geometry to do what MEt3R/DUSt3R must estimate.

**Video walkthroughs**
- A camera-path flythrough rendered from three.js, plus exact depth/line videos fed to Wan VACE or Cosmos-Transfer, would give a polished marketing video. It is not interactive and re-generates whenever furniture moves.
- SEVA is non-commercial and 576p, so it is better as a research or prototyping tool than a production path.

**Real-time "AI filter" over the live canvas**
- StreamDiffusion-class approaches are not viable for a static Vercel site without a dedicated GPU streaming backend. They would also flicker or drift between frames unless temporally conditioned.

### Gaps
- I found no study measuring cross-view consistency of FLUX/Qwen ControlNet plates of the same interior with shared seeds vs reference attention.
- MVDiffusion [2023] (depth-conditioned multi-view panorama) did not surface in searches.
- MirageLSD (Decart) and Runway Aleph real-time or video-restyle capabilities could not be verified.
- No source gave VRAM or latency for SEVA inference.

---

## Q7. Known failure modes (hallucinated objects, warped lines and windows, scale change, inconsistent materials, contradictory lighting), mitigations and quality metrics

### Takeaway
Each failure mode is documented across the sources. Because Ridgeline knows the ground-truth geometry, it can **automatically verify** every AI output against the rendered depth, line and ID passes and reject or fix drift. Most consumer tools cannot do this. The main mitigations:
- Staged low-denoise passes.
- Early-released depth.
- Clean geometric line maps.
- Masks that confine changes.
- Furniture-free plates.
- Lighting-neutral bakes.

### Cited Findings
**Hallucinated or removed objects**
- Gemini/Nano Banana removed an object and added a window that did not exist. — [Google AI forum](https://discuss.ai.google.dev/t/is-it-possible-to-disable-decoration-from-gemini-api-image-to-image-generation/170940)
- Without depth and normal conditioning, viewer-scene generation "hallucinates". — [Autodesk APS blog snippets](https://aps.autodesk.com/blog/do-you-still-need-controlnet-testing-next-gen-models-viewer-scenes)
- Qwen-Image-Edit changes things unless told not to; both Qwen and Kontext misplaced a wardrobe where it could not fit. — [Diffusion Doodles comparison](https://medium.com/diffusion-doodles/qwen-image-edit-vs-flux-1-kontext-vs-nano-banana-93fba1348a77)
- Older SketchUp-diffusion-style img2img "resulted in changes to the model/image, making it basically unusable". — [Lilys.ai Nano Banana architecture notes](https://lilys.ai/en/notes/nano-banana-20251106/nano-banana-architecture-ai-image-generator)

**"CGI look" vs drift trade-off**
- Depth at 1.0 to the end looks stiff and CG. Too-strong Canny gives an "outlined" look. One-pass geometry, material and lighting runs fail. — [ArchiGen AI (search summary)](https://archigenai.com/comfyui-second-pass-keep-depth-canny-controls-architects-2026.html)

**Warped verticals and perspective**
- ArchForge adds an automatic vanishing-point-based roll and keystone homography because diffusion outputs drift in perspective. It skips yaw and leaves uncertain images unchanged. — [GitHub jilt/ArchForge](https://github.com/jilt/ArchForge)
- Staging guides warn that a 3° offset ruins perspective. — [virtualstaging.art](https://www.virtualstaging.art/articles/how-to-virtually-stage-a-room)

**Seams and cross-view inconsistency**
- Per-view inpainting causes "severe cross-view inconsistencies and conspicuous seams". — [RoomPainter](https://arxiv.org/html/2412.16778v2)
- Panorama edges drift in HunyuanWorld tests. — [wiro.ai](https://wiro.ai/blog/hunyuanworld-text-to-panorama-6-prompt-test/)
- SEVA v1.0 had foreground detaching from background. — [SEVA GitHub](https://github.com/Stability-AI/stable-virtual-camera)

**Baked or contradictory lighting**
- 2D diffusion views bake in lighting and illumination artifacts. — [Paint3D](https://arxiv.org/html/2312.13913v2)
- Baked lighting is inconsistent under new lighting environments. — [FlashTex](https://arxiv.org/pdf/2402.13251)
- Residual highlights persist even in 2026 PBR methods. — [CasTex WACV 2026 supp.](https://openaccess.thecvf.com/content/WACV2026/supplemental/Aliev_CasTex_Cascaded_Text-to-Texture_WACV_2026_supplemental.pdf)
- Shadow direction and softness mismatches betray composites. — [virtualstaging.art](https://www.virtualstaging.art/blog-posts/adobevirtualstaging)

**Blur and low detail in occluded regions**
- SceneTex blurs occluded areas. — [RoomPainter critique of SceneTex](https://arxiv.org/pdf/2412.16778)

**Metrics**
- MEt3R (CVPR 2025, MPI Informatics, code public):
  - Measures multi-view consistency between generated image pairs with no camera poses or ground truth.
  - Uses DUSt3R to reconstruct and warp one view into the other, then compares feature maps, so it is invariant to view-dependent effects.
  - Used to benchmark novel-view and video generators. — [CVPR 2025 paper](https://openaccess.thecvf.com/content/CVPR2025/papers/Asim_MET3R_Measuring_Multi-View_Consistency_in_Generated_Images_CVPR_2025_paper.pdf); [arXiv 2501.06336](https://arxiv.org/abs/2501.06336)
- Texture papers report FID and KID (for example Text2Tex 37.09 → 35.68 FID with refinement views). — [Text2Tex](https://arxiv.org/pdf/2303.11396)
- A third-party summary reports RoomTex aesthetic score 5.20 vs SceneTex 4.77; this was not checked against the paper. — [RoomTex summary via search](https://arxiv.org/html/2406.02461v1)

### Inferences
**Automatic QA gate for each AI plate or bake view**
1. **Geometry drift:** run a monocular depth estimator (Depth Anything V2) on the AI output and compare to the rendered depth after scale/shift alignment (AbsRel). Reject if it exceeds a threshold.
2. **Line and window fidelity:** compare Canny or line detection on the output to the rendered line pass (Chamfer distance, or the percentage of rendered lines with an output edge within k px). This directly catches moved mullions and added or removed windows.
3. **Object hallucination:** run a segmenter (or an open-vocabulary detector) on the output and compare against the ID pass. Flag new "object" pixels in regions the ID pass marks as wall or floor, and missing objects.
4. **Cross-view consistency:** run MEt3R between overlapping plates, or warp-and-compare with the known depth (cheaper and exact for this scene).
5. **Lighting consistency:** compare shadow direction and soft-light gradient with the engine's sun and window setup. This is likely a manual art-director check; no automated metric was found.

**Scale changes**
- Scale changes are mostly eliminated by exact depth plus lines plus masks. Remaining drift is usually in texture scale (floorboard and tile size). Put the real dimensions in the prompt ("15 cm wide oak planks") or use a texture-scale reference image.

**What preserves editability (summary ranking)**
1. Baked shell textures (Q4) plus live furniture: full orbit, full drag-drop, and AI only on static surfaces. Best editability; quality limited by the real-time furniture shading.
2. Per-node plates or panoramas (Q3/Q5) plus live furniture with shadow catchers: high realism at fixed spots, drag-drop works, no free parallax.
3. Masked per-change AI harmonisation (Q2): highest realism for screenshots, asynchronous (seconds), with a server or API dependency.
4. Full-frame AI re-render or video restyle (Q1/Q6): the most photoreal, but each furniture move needs regeneration, consistency is fragile, and it is not interactive.

### Gaps
- I found no published benchmark of geometry-drift metrics (depth AbsRel or edge Chamfer between control maps and outputs) for archviz ControlNet pipelines. The QA gate above is a proposed design, not documented practice.
- No source quantified the hallucination rate of Kontext, Qwen or Nano Banana on interiors.
- Material consistency across views (the same floor looking different) has no dedicated metric beyond MEt3R and FID-style scores in the sources found.
- Out of scope but adjacent: Gaussian-splat "world" generators (World Labs Marble with the Spark three.js renderer, HunyuanWorld) as another "stitching" route. These pages were blocked here, and another researcher may be covering them.
