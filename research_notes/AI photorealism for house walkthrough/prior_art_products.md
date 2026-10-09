# Prior Art: Products Combining Drag-and-Drop Room/Furniture Planning with Photoreal or AI Rendering (as of Oct 2026)

> **Method note for the report writer:** Research was done on 2026-10-09. Direct page fetches (WebFetch and curl) failed for almost every vendor domain because of DNS/proxy 403 errors in this environment. Every finding below therefore comes from search-engine result extracts, not full-page reads. Several summaries pooled more than one source, so where the exact originating URL could not be pinned down, the claim cites the group of URLs and says so. Many pricing pages are third-party aggregators (xpay.sh, toolradar, capterra and others) or competitor blogs (GenRoom, First Chair, Morphed, Getstageflow, Bellavirtual). Treat their numbers as indicative. Older sources (2021–2024) are flagged.

---

## 1. Room planners and interior design apps with a 3D editor plus photoreal or AI rendering: output type, layout fidelity, render time, price

### Takeaway
Two families exist, and they are almost cleanly split:
- **3D-editor planners** (Coohom/Kujiale, Homestyler, Planner 5D, Floorplanner, RoomSketcher, HomeByMe, Foyr Neo). In these, a live real-time 3D view is used for editing. Photorealism comes from a separate cloud "Render" button that outputs stills, 360° panoramas or video. Renders are metered by credits or tier, and the 3D scene stays the source of truth.
- **Photo-in/AI-out "restyle" tools** (RoomGPT, Interior AI, ReimagineHome, Spacely, Collov, Wayfair Muse/Decorify). These return an AI image in about 15–60 s for cents per image, but they often change architecture, scale and furniture, and they have no editable scene behind them.

Since 2025–26 the 3D planners have been adding AI layers on top of the 3D scene: Homestyler AI Render/Spark, Coohom AIHom, and Planner 5D's AI Designer.

### Cited Findings

**Coohom (Manycore Tech, international brand of Kujiale)**
- Workflow: you draw a floor plan, drag furniture from a large catalog, adjust materials and lighting, then render photorealistic images or 360° virtual tours. In 2026 it layers on AI floor-plan generation from sketches, AI furniture suggestions and AI-assisted photoreal rendering. The source is a competitor review. — [GenRoom Coohom review](https://genroom.io/blog/coohom-review-best-alternatives)
- Render time is reported inconsistently: the Coohom site is cited as advertising a "2 Mins Average render time" with 4K output, a Japanese guide says 4K in 1–2 minutes, and other reviews give "1–5 minutes depending on complexity" or "under a minute". Rendering is in the cloud, so no workstation is needed. Which figure comes from which review was not individually verified. — [formas.ai](https://www.formas.ai/articles/coohom); [note.com guide (JP)](https://note.com/jasonjiang/n/n51bc497eb186?hl=en); [meltflexai](https://www.meltflexai.com/blog/coohom-ai-interior-design-review); [genroom](https://genroom.io/blog/coohom-review-best-alternatives)
- AI redesign tool "AIHom" is reported at about 20 s per redesign from a real photo. Coohom marketing (reproduced on G2) claims whole-house designs in 5 minutes and AI kitchen layouts in under 1 minute. — [G2 Coohom](https://www.g2.com/products/coohom/reviews); [meltflexai](https://www.meltflexai.com/blog/coohom-ai-interior-design-review)
- Pricing (2026, third-party): Basic is free with a watermark and no high-res export; Pro is about $29/mo; Elite is about $69/mo (one source says $60/seat); Enterprise is custom. Capterra shows "from $9.90/user/mo", probably a promo or regional price. — [Capterra pricing](https://www.capterra.com/p/192882/Coohom/pricing/); [softwarefinder](https://softwarefinder.com/design-software/coohom); [aitoolsbakery](https://aitoolsbakery.com/blog/coohom-vs-planner-5d/)
- Quality perception: renders can look "clean but CGI", "technically flawless" but with "the slightly synthetic feel of ray-traced 3D" (competitor review). — [GenRoom](https://genroom.io/blog/coohom-review-best-alternatives)
- A 2026 expert review says top-setting photorealism is "competent but not category-leading", and that designers still export to D5, Twinmotion or Enscape for final renders. It names a steeper learning curve as the weak spot. G2 lists 4.5/5 from 133 reviews. One user reports SketchUp export/import problems. — [aitoolsbakery 2026 review](https://aitoolsbakery.com/?p=7514); [G2 compare page](https://www.g2.com/compare/coohom-vs-octave-aspect-pressure-vessel-pv-elite); [GetApp reviews](https://www.getapp.com/emerging-technology-software/a/coohom/reviews/)
- Kujiale (China) uses an in-house "Qizhen" engine tied to "ExaCloud" cloud rendering and claims "second-level/10-second-level" photoreal rendering. 36Kr says the engine reached v3.5 with "real-time rendering in the cloud". These are marketing/encyclopedia sources, and no ray-tracing technical detail was found. — [Baidu Baike: Kujiale](https://baike.baidu.com/en/item/Kujiale/17974); [36Kr on SpatialVerse](https://eu.36kr.com/en/p/3045483903601545)
- Manycore also runs SpatialVerse, which generates synthetic indoor datasets with RTX rendering aligned to NVIDIA Isaac Sim/OpenUSD, and it open-sourced SpatialLM. This shows its large structured 3D interior corpus is a strategic asset. — [36Kr](https://eu.36kr.com/en/p/3045483903601545); [Yahoo Finance](https://finance.yahoo.com/news/manycore-tech-makes-spatiallm-open-081300704.html)

**Homestyler (also a Manycore/Easyhome-family product; ownership not re-verified here)**
- Free plan: unlimited 1K renders and 3 AI credits in total. 4K renders are bought per image with coins. — [TechRadar review](https://www.techradar.com/reviews/homestyler)
- Homestyler's own help forum gives AI Render generation time as about 1 minute and 30 AI credits per 2K AI image. Aggregators claim "seconds" or "30 s". — [Homestyler forum: What is AI Render?](https://www.homestyler.com/forum/view/2034610232517189633); [toolworthy](https://www.toolworthy.ai/en/tool/homestyler)
- Cloud rendering goes up to 4K, and one reviewer made a custom 4K bedroom render "in minutes". — [TechRadar](https://www.techradar.com/reviews/homestyler)
- V6.0 AI tools listed on Homestyler's forum: AI Planner, AI Stager, AI Planter, AI Render, AI Painter, AI Moodboard. A third-party site dates v6.0 "AI Studio" to April 2026, which is not confirmed officially. — [Homestyler forum v6](https://www.homestyler.com/forum/view/2038859050736881666); [stork.ai](https://www.stork.ai/en/homestyler)
- **Spark** (official blog, 22 Jul 2026) is a conversational AI design agent that "brings conversation, AI generation, and editable 3D design together." Results stay editable, so users can keep changing layouts, furniture and materials after generation. This is a direct example of "AI generates into the editable 3D scene" rather than into pixels. — [Homestyler blog: Meet Spark](https://resources.homestyler.com/2026/07/22/meet-spark-homestylers-ai-interior-design-agent-for-editable-3d-design/)
- Pricing is inconsistent between the homestyler.com and homestyler.ai domains. homestyler.ai (May 2026 capture): Starter $29/mo ($19 annual), Pro $99/mo ($69 annual), Expert $299/mo ($199 annual). homestyler.com: Individual Pro includes 75 renders each of 2K and 4K per month. — [xpay homestyler.ai](https://www.xpay.sh/saas-pricing/homestyler-ai/); [xpay homestyler](https://www.xpay.sh/saas-pricing/homestyler/); [aitoolsatlas](https://aitoolsatlas.ai/tools/homestyler/pricing)

**Planner 5D**
- Render workflow: choose photo quality, aspect ratio, angle/zoom and sunlight, then render. Its showcase example is a 4K bedroom render. — [Unite.ai review](https://www.unite.ai/planner-5d-review/)
- Its "AI Designer" generates furnished layouts from input or photos. This is layout AI, not image generation. — [zplatform listing](https://zplatform.ai/ai-tools/planner-5d/); [Planner 5D AI page](https://planner5d.com/pt/html-ai)
- Pricing (May 2026 snapshot and others): Premium is $19.99/mo or $59.99/yr (one listing says $4.99/mo) and includes the AI Designer, an 8,000+ item catalog and **5 renders/month**. Professional is $49.99/mo ($33.33/mo annual) with **unlimited 4K renders and 360° panoramas**. — [xpay Planner 5D](https://www.xpay.sh/saas-pricing/planner-5d/); [getpulsesignal](https://getpulsesignal.com/pricing/planner5d)
- Cons: rendering is slow on older devices, the free tier has a watermark, and it "can slow down with more complex projects". — [Unite.ai](https://www.unite.ai/planner-5d-review/)

**Floorplanner** (official pricing page)
- Free tier: 1 floor, 1 design, SD export with watermark. Render upgrades are paid per project in credits: 2 credits removes the watermark, 5 for HD (1920×1080), 10 for 4K, 20 for 8K. — [floorplanner.com/pricing](https://floorplanner.com/pricing)
- Third-party listings mention $5/mo "plus" and $29/mo "pro" tiers (unverified on the official page). Visualization is rated "basic". — [capterra.ca](https://www.capterra.ca/reviews/164017/floorplanner); [fitgap](https://us.fitgap.com/products/floorplanner)

**RoomSketcher**
- Pro is $144/user/yr ($12/mo annual, May 2026 snapshot) and includes Live 3D, **3D Photos and 360 Views**. Team is $420/yr ($35/mo). — [GetApp](https://www.getapp.com/construction-software/a/roomsketcher/pricing/); [xpay](https://www.xpay.sh/agent-ready-index/roomsketcher/)
- A reviewer says "most professional outputs are metered through credits". — [illustrarch review](https://illustrarch.com/articles/design-softwares/111920-roomsketcher-review.html)

**HomeByMe (Dassault Systèmes)**
- Free: about 2 projects and 5 "realistic images". Essentials: unlimited Full HD, 5×4K/month, 10×360°/month. Pro: unlimited FHD/4K/top-view, 10×360°, plus 60 s FHD and 20 s 4K video per month. Packs of 360° images are sold in units of 1, 2 or 10. Current prices are unclear ("sales-led"), and older figures (€14.99 pack, €24.99/mo) are dated. — [fitgap](https://us.fitgap.com/products/021346/homebyme); [unanswered.io](https://unanswered.io/guide/is-homebyme-free-pricing-breakdown); [TopTenReviews (older)](https://www.toptenreviews.com/homebyme-review)

**Foyr Neo**
- Claims photorealistic 4K renders "in under 10 minutes" in the browser (vendor claim). — [yespress Foyr profile](https://yespress.io/foyr)
- Pricing conflicts across sources: $22/$55/$99 per month with 30/180/240 render credits (12K only on Premium); "from $29/mo" (Mar 2026); $33/mo billed yearly (Jun 2026); pay-as-you-go $0.99/credit. — [spendbase](https://test.spendbase.co/?p=35113); [datadrivenaec](https://datadrivenaec.com/tools/foyr-neo); [aigearbase](https://aigearbase.com/tool/foyr-neo); [omr](https://omr.com/en/reviews/product/foyr-neo/pricing)

**Photo-in/AI-out restyle tools**
- **RoomGPT**: 15–30 s per design, but it "often adds or removes windows, doors, and structural elements". It cannot preserve specific items (a sofa you want to keep "may not survive") and has no post-generation edit mode. Source is a competitor. — [First Chair RoomGPT alternatives](https://www.firstchair.app/blog/roomgpt-alternatives); [First Chair review](https://www.firstchair.app/blog/roomgpt-review)
- RoomGPT pricing: 1 free design, then credit packs of about $9/30, $19/100, $29/200 (another source gives $9/25, $19/100, $49/300), which works out to about $0.15–0.30 per design. — [toolradar](https://toolradar.com/tools/roomgpt/pricing); [Krea RoomGPT review](https://www.krea.ai/blog/roomgpt-review-and-alternatives-in-2026); [GenRoom vs RoomGPT](https://genroom.io/vi/genroom-vs-roomgpt)
- **Spacely AI**: sometimes "corrects" odd shapes and angled walls into rectangles. Furniture can render too large or too small, especially from wide-angle photos. A Q1 2026 Auto Furnish update improved style matching. Source is a competitor. — [Morphed Spacely review](https://morphed.app/blog/spacely-ai-interior-design)
- **Interior AI**: pricing conflicts. One tracker gives $39/mo or $390/yr Pro with no free plan; the same site elsewhere gives $29/mo and a $299/mo team plan; a July 2026 review says the free tier was dropped and plans start at about $49–99/mo. — [toolradar](https://toolradar.com/tools/interior-ai/pricing); [rework 2026 roundup](https://resources.rework.com/tools/ai-tools/best-ai-interior-design-tools-2026)
- **ReimagineHome**: Agency plan $99/mo for 900 credits, and the free tier gives 5 full-quality designs (June 2026 review). — [aihomedesign](https://aihomedesign.com/blog/?p=13065); [toolchase](https://toolchase.com/tool/reimagine-home/)
- **Collov AI**: browser-based, about 30 s per result, with "Chat Edit" natural-language refinement (swap furniture style, lighting, flooring). Plans run $19–$127/mo, and NAR sponsored content cites "as low as $0.17/image". No public evidence of a true-3D furniture pipeline. — [theaireport](https://www.theaireport.ai/tooldatabase/collov-ai); [NAR (sponsored)](https://www.nar.realtor/news/styled-staged-sold/rethinking-virtual-staging-for-todays-real-estate-agents); [Inman 2025](https://www.inman.com/2025/06/09/how-ai-virtual-staging-is-changing-real-estate-marketing/)
- **Wayfair Decorify (2023) to Muse (early 2025)**: Decorify took an uploaded room photo, offered 8 styles and returned shoppable redesigns (175,000+ designs curated). Muse replaced it with text-driven, "no uploads needed" generative inspiration in a Pinterest-like feed, with "Explore this Muse" and shop-similar links. Neither is a placement tool. — [Furniture Today](https://www.furnituretoday.com/e-commerce/wayfair-retools-its-consumer-ideation-experience-replacing-decorify-with-muse); [Retail Dive](https://www.retaildive.com/news/wayfair-generative-ai-imagery-irl-purchases/739874); [Chief Marketer](https://chiefmarketer.com/wayfair-launches-generative-ai-powered-inspiration-tool-for-shoppers)
- **Magicplan**: AR scan produces an instant basic 3D model you can rotate in-app, and is rated "basic 3D" for visual quality. — [Magicplan help](https://help.magicplan.app/create-and-view-3d-models-in-the-magicplan-app); [remodelai roundup](https://www.remodelai.io/blog/best-free-ai-3d-floor-plan-apps)
- **Houzz**: listed among AR try-before-you-buy apps (free; Houzz Pro paid). No 2025–26 details on "View in My Room" were found. — [savedelete 2026 roundup](https://savedelete.com/article/interior-design-apps-to-guide-your-design-overhaul/)
- **Rayon** (Paris, browser floor-plan tool): raised a €10M Series A on 29 Sep 2026 (Partech) to bring 3D and AI into the browser. Its V4 is due by end of 2026. Current AI features are a plan vectorizer and blocks-from-photos, and it is not an image generator. — [tech.eu](https://tech.eu/2026/09/29/rayon-raises-eur10m-series-a-to-expand-ai-powered-interior-design-platform/); [The Next Web](https://thenextweb.com/news/rayon-10m-series-a-partech-interior-design-ai); [Rendair guide](https://rendair.ai/blog/tools-top-ai-tools-for-interior-designers-in-2026-a-professionals-guide)

### Inferences
- Across all mature 3D planners, the UX is: **edit in a fast real-time 3D view, then press Render to get a cloud-generated still, 360° panorama or video in about 1–10 minutes**. Photorealism is never the live editing view. 360° panoramas and 4K are the standard upsell tiers (Planner 5D Pro, HomeByMe Essentials/Pro, RoomSketcher Pro, Coohom).
- In the 3D planners, the "realistic" output respects the placed furniture by construction, because it is rendered from the same scene graph. This is inferred from the workflow descriptions and not explicitly verified for Coohom's or Homestyler's AI-render modes. In the photo-in AI tools, furniture and even walls and windows are not reliably preserved.
- The 2026 direction (Homestyler Spark, Coohom AI, Planner 5D AI Designer) is to use AI to **write into the editable 3D scene**, choosing layouts and furniture, rather than to replace the renderer with a diffusion model. That keeps drag-and-drop editability intact.
- Price anchors useful for Ridgeline: AI restyle images cost about $0.15–$1 each. Cloud path-traced renders in consumer planners are bundled into $12–$50/mo tiers or cost about 5–20 credits per HD–8K image (Floorplanner).

### Gaps
- No primary technical docs were found on whether Coohom AIHom or Homestyler AI Render uses the 3D scene's depth/segmentation as conditioning (a ControlNet-style approach) or works from the rendered image only. Official help pages could not be fetched.
- No 2025–26 details were found for **Roomstyler**, **Houzz View in My Room** or **Arcadium**. "Arcadium" returned nothing relevant and may be a misremembered name.
- Official pricing pages (coohom.com, homestyler.com, planner5d.com, home.by.me, foyr.com) could not be fetched directly, so prices are from aggregators and conflict.
- No Reddit (r/InteriorDesign) threads surfaced in search, so user sentiment here comes from G2/GetApp and editorial/competitor reviews only.

---

## 2. IKEA Kreativ: capture, furniture erasing, placing 3D products realistically

### Takeaway
IKEA Kreativ (Ingka Group, technology from Geomagical Labs, acquired April 2020) is a **photo-based mixed-reality compositor**, not a live 3D world. It captures a wide-angle "interactive replica" from a series of photos (LiDAR on iPhone if available). It estimates room layout/geometry, lighting and materials, erases real furniture with layout-aware per-plane inpainting, and composites real 3D IKEA product models into the photo with matching perspective and lighting. The output is described as a largely static, wide-angle interactive image. The only engineering detail public is from 2022 (the ISMAR-Adjunct paper and workshop). No 2025–26 updates were found.

### Cited Findings
- Ingka acquired Geomagical Labs, "a leading US-based development company of 3D and visual AI solutions", in April 2020 and runs it as an independent subsidiary. — [Ingka newsroom](https://www.ingka.com/newsroom/ingka-group-acquires-geomagical-labs/)
- Launched June 2022, US iOS first, with Android and web to follow. The "Scene Scanner" in the IKEA app creates "editable and lifelike 3D replicas" of a room. Users can "erase" existing furniture, position IKEA furnishings, swap alternatives and design the room. Free in-app and on the web (for example in Australia and Canada). — [TechCrunch 2022](https://techcrunch.com/2022/06/22/ikea-rolls-out-an-ai-powered-interactive-design-experience-for-shoppers/); [Ingka newsroom](https://www.ingka.com/newsroom/ikea-launches-new-ai-powered-experience-empowering-customers-to-create-lifelike-room-designs/); [IKEA CA](https://www.ikea.com/ca/en/newsroom/corporate-news/ikea-canada-launches-new-ai-powered-digital-experience-called-ikea-kreativ-pubf6d0f5d0/) *(2022, older source)*
- Capture: on iPhone the Scene Scanner uses LiDAR when available ("pull in additional spatial detail"). In the browser or on non-LiDAR devices, users upload a series of photos that are "automatically processed and assembled into a wide-angle, interactive replica of the space, with accurate dimensions and perspective." — [Engadget](https://www.engadget.com/ikea-ar-app-lets-you-preview-its-furniture-in-your-own-house-130004284.html); [IKEA US newsroom](https://www.ikea.com/us/en/newsroom/corporate-news/ikea-launches-new-ai-powered-digital-experience-empowering-customers-to-create-lifelike-room-designs-pub58c94890/) *(2022)*
- IKEA says its neural networks are trained to recognize indoor objects and geometry, and that "stereo vision algorithms" let the system see in 3D. Scene analysis covers "the 3D geometry of the scene, the objects in the scene, the lighting in the scene, and the materials in the scene." — [IKEA US newsroom](https://www.ikea.com/us/en/newsroom/corporate-news/ikea-launches-new-ai-powered-digital-experience-empowering-customers-to-create-lifelike-room-designs-pub58c94890/); [VentureBeat](https://venturebeat.com/ai/ikea-launches-first-ai-powered-design-experience-no-swedish-meatballs-included) *(2022)*
- On lighting and erasing, an IKEA executive said that because the system blends virtual objects with real photos, the team needs "a much better understanding of the lighting inside a room" and must "estimate the geometry and imagery hidden behind furniture." — [VentureBeat](https://venturebeat.com/ai/ikea-launches-first-ai-powered-design-experience-no-swedish-meatballs-included) *(2022)*
- UX: click a real item (sofa, rug) and it is erased and replaced with extended wall and floor. One outlet notes Kreativ "produces a static image of the space" rather than a navigable 3D world. Attribution between the two outlets was not individually verified. — [Gizmodo](https://gizmodo.com/ikea-vr-ar-design-tool-iphone-android-browser-furniture-1849093201); [New Atlas](https://newatlas.com/around-the-home/ikea-kreativ-ai-room-design-app/)
- **Engineering paper:** "Layout Aware Inpainting for Automated Furniture Removal in Indoor Scenes", by P. Kulshreshtha, K.-N. Lianos, B. Pugh and S. Jiddi (all Geomagical Labs), arXiv 2210.15796, 27 Oct 2022, ISMAR-Adjunct 2022.
  - It detects and erases furniture from a wide-angle room photo, using instance segmentation plus room layout estimation to produce a "geometrically consistent empty version of a room".
  - Practical components are **per-plane inpainting, automatic rectification and texture refinement**.
  - It demonstrates removing real furniture and placing virtual furniture.
  - It notes that naive large-mask inpainting causes geometric inconsistencies in background structures.
  - — [arXiv PDF](https://arxiv.org/pdf/2210.15796); [paperswithcode](https://www.paperswithcode.com/paper/layout-aware-inpainting-for-automated)
- Geomagical's ISMAR 2022 workshop covered room layout estimation, image inpainting, **shadow removal** and "removal of associated lighting effects (e.g. shadows, interreflections)", meaning the shadows a removed object cast on the floor and walls must also be erased. — [Geomagical ISMAR 2022 page](https://www.geomagical.com/ismar2022-workshop.html)
- For contrast, Matterport's later paper "An Empty Room is All We Want" (arXiv 2405.03682, 2024) uses fine-tuned Stable Diffusion with extra context and better blending. It produces geometrically plausible empty-room inpaints *without* explicit room-layout estimation. Matterport affiliation is per the search extract; the page could not be fetched. — [arXiv 2405.03682](https://arxiv.org/abs/2405.03682v1); [ar5iv](https://ar5iv.labs.arxiv.org/html/2405.03682)

### Inferences
- Kreativ's realism trick is to **keep the real photo as the background**: walls, floors and light are real pixels. It then renders only the inserted products as 3D, with estimated lighting and layout-derived ground planes for contact shadows and occlusion. The photo supplies the photorealism, and the 3D layer supplies editability and to-scale placement.
- For Ridgeline the house appears to be a design, so presumably there are no real photos. If high-quality renders or AI-generated stills of each empty room are produced once, the Kreativ pattern can be reused. Treat each room's baked photoreal panorama or still as the "photo", keep depth/layout for it, and composite three.js-rendered furniture on top with matched lighting and contact shadows. This is an inference, not a documented product.
- The paper's lesson that per-plane, layout-aware inpainting beats generic inpainting suggests that conditioning any AI step on known planar geometry, which Ridgeline has exactly, reduces warping.

### Gaps
- No public IKEA/Ingka/Geomagical engineering posts on the **product-compositing** side were found: lighting estimation model, shadow rendering, occlusion of virtual furniture by real objects, or renderer used.
- No patents were located in the time available.
- No 2025–26 updates (for example generative-AI room design inside Kreativ, or usage numbers) were found.
- The Geomagical and IKEA newsroom pages could not be fetched, so these are search extracts.

---

## 3. Real-time archviz tools with AI features: keeping 3D editability while adding AI realism

### Takeaway
Professional archviz tools uniformly keep the 3D model as the editable source of truth and real-time view (Enscape, D5, Lumion, Twinmotion). They apply AI as an **image post-process on a rendered still**, not in the live viewport. The variants are:
- (a) Constrained "enhancers" that target entourage, materials and lighting and claim to leave geometry intact (Chaos AI Enhancer, D5 AI Enhancer).
- (b) Diffusion "reimaginers" with a geometry-fidelity slider, used for early concept exploration (Chaos Veras, SketchUp Diffusion/AI Render, Archicad AI Visualizer).
- (c) AI upscalers and denoisers for speed (Lumion 2025, Chaos AI Upscaler).

The vendor-recommended workflow is to explore with Veras-style tools early, fix the model, render a controlled baseline, then enhance the final approved still.

### Cited Findings
- **Chaos (Enscape/V-Ray/Corona + Veras)**: the recommended sequence is "Model and frame in CAD/BIM, render a controlled Enscape baseline, explore selected concepts in Veras, resolve the model, use AI Enhancer on the approved final image". "Enhancement works best when the architecture, camera, light, and material intent are already resolved." — [LumionVietnam guide, Aug 2026](https://lumionvietnam.com/2026/08/14/enscape-veras-ai-enhancer-workflow/)
- The Chaos AI Enhancer "will render a scene based on the current settings, upload it to Chaos Cloud, and then use AI to enhance the people and vegetation". This is a still-image cloud post-process. — [Chaos blog](https://blog.chaos.com/how-to-enhance-enscape-visuals-with-veras-and-chaos-ai-enhancer)
- Chaos claims the enhancer improves entourage "while keeping the actual architectural geometry exactly the same", and "without changing the architecture, furniture, and other important aspects of your renders". This is a vendor claim. — [Chaos AI archviz guide](https://blog.chaos.com/guide-ai-archviz); [Chaos credits page](https://www.chaos.com/get-more)
- Veras offers a Compose panel (extra prompts such as "keep the grass mostly green") and **Geometry and Material Override sliders** that set how far the AI departs from the model. Higher settings let the AI alter geometry because it infers structure from a flat image. Veras 3.0 adds image-to-short-video (weather, day to night, moving people and cars). — [Chaos blog](https://blog.chaos.com/how-to-enhance-enscape-visuals-with-veras-and-chaos-ai-enhancer); [Chaos Enscape+Veras workflow](https://blog.chaos.com/ai-architectural-visualization-workflow-enscape-veras); [Krea guide](https://www.krea.ai/blog/best-ai-photorealistic-architectural-renders)
- One reviewer says the AI Enhancer mainly focuses on people and vegetation, while Veras "can enhance and/or change everything" but "does not handle the people as well". The exact originating URL among the search results was not pinned down. — [cadscene](https://cadscene.com/enscape-ai-rendering); [ArchDaily/Chaos](https://www.archdaily.com/catalog/en/products/38381/how-to-enhance-your-design-workflow-with-enscape-and-ai-chaos)
- Credits (reseller table, 27 May 2026): AI Enhancer full enhancement costs 20 credits per image, object enhancement 15, and AI Upscaler 20. Enscape Premium includes 765 or 500 credits/month (Chaos pages conflict). Credits are shared across Veras, the Upscaler, the Enhancer and cloud rendering. — [NTI Chaos credits](https://www.nti-group.com/uk/products/other-products/chaos/credits/); [Chaos Enscape Premium](https://www.chaos.com/enscape-select-your-plan-enscape-premium); [Chaos press](https://www.chaos.com/press/chaos-strengthens-end-to-end-architectural-design-and-visualization-workflow)
- Veras was added to every Enscape plan in May 2026. The AI Enhancer debuted in Enscape in 2024 and is now in Corona and V-Ray 7 for 3ds Max. — [Digital Production, 29 May 2026](https://digitalproduction.com/2026/05/29/chaos-puts-veras-everywhere/); [Digital Engineering 24/7](https://www.digitalengineering247.com/article/chaos-debuts-several-ai-tools); [ArchitectureLab](https://www.architecturelab.net/chaos-expands-ai-capabilities-for-aec-with-veras-three-zero-and-workflow-driven-visualization-tools/)
- **D5 Render**:
  - The AI Enhancer (v2.8, mid-2024, beta) makes lighting, materials, characters, vehicles and vegetation more realistic. It works only on images from Render History, up to 4K, and supports selected areas with weak, normal or strong intensity. — [AEC Magazine](https://aecmag.com/visualisation/d5-render-2-8-introduces-ai-enhancer/); [CG Channel 2024](https://www.cgchannel.com/2024/07/dimension-5-techs-releases-d5-render-2-8/)
  - v2.11 (July 2025) added an AI Agent (support bot and Smart Planting). Its enhancer controls were reportedly split into enhancement weight and texture intensity so strong enhancement alters textures less. — [CG Channel 2025](https://www.cgchannel.com/2025/07/dimension-5-releases-d5-render-11/); [lilys.ai (ES)](https://lilys.ai/es/notes/d5-render-20260202/d5-render-2-11-ai-rendering-explained)
  - v3.0 (Jan 2026) added AI PBR material generation, AI Scene Match, asset recommendation and Image-to-3D. — [iRendering, Feb 2026](https://irendering.net/d5-render-3-0-ai-%ec%8b%9c%eb%8c%80-ai%ea%b0%80-archviz-%ec%9b%8c%ed%81%ac%ed%94%8c%eb%a1%9c%ec%9a%b0%eb%a5%bc-%ec%96%b4%eb%96%bb%ea%b2%8c-%ec%9e%ac%ec%a0%95%ec%9d%98%ed%95%98%eb%8a%94%ea%b0%80/); [yespress D5](https://yespress.io/d5.md)
  - Pricing: Pro $30/mo or $360/yr, with a free non-commercial Community edition. — [renderahouse](https://www.renderahouse.com/blog/ai-alternatives-to-enscape-and-lumion)
- **Lumion 2025**: an AI upscaler renders at half the target resolution and upscales up to 8K. The vendor claims up to 5x faster ray-traced renders, at some loss of fine texture in low-contrast areas. Lumion Pro is Windows-only and about $1,999/yr. — [Rendair Twinmotion vs Lumion](https://rendair.ai/blog/twinmotion-vs-lumion-which-rendering-software-is-best-in-2026); [myarchitectai](https://www.myarchitectai.com/blog/lumion-vs-twinmotion); [designdrafter](https://designdrafter.com/ai-architectural-rendering-software-in-2026/)
- **Twinmotion**: the path tracer is used for high-quality stills (Windows only, at least 8 GB VRAM). Native AI was absent or "planned for 2026" per one source, and another claims a 2026 AI denoiser (unverified). — [myarchitectai D5 vs Twinmotion](https://www.myarchitectai.com/blog/d5-render-vs-twinmotion); [formas.ai Twinmotion](https://www.formas.ai/articles/twinmotion)
- **SketchUp Diffusion**, now rebranded "AI Render", produces a render from the model viewport "in seconds". It is credit-limited, its material accuracy is "hit or miss", and it is best for concept work. It graduated from Labs to a license-included feature. — [myarchitectai review](https://www.myarchitectai.com/blog/sketchup-diffusion-review); [justnecessary field test](https://justnecessary.substack.com/p/ai-rendering-for-sketchup-2026-an-52a)
- **Archicad AI Visualizer** is Stable Diffusion based and "often alters your original geometry", so it suits early concept work. A reported $29/mo is unverified. — [myarchitectai Archicad AI tools](https://www.myarchitectai.com/blog/archicad-ai-tools)
- Krea's own guide admits it "will not automatically preserve exact geometry unless the workflow is set up carefully". — [Krea blog](https://www.krea.ai/blog/best-ai-photorealistic-architectural-renders)

### Inferences
- No professional tool runs diffusion in the live viewport. AI is applied to **stills only** (and short clips from stills in Veras 3.0). Editability is preserved because AI output is a disposable derivative of a 3D camera view.
- The industry has converged on two user-facing controls that Ridgeline could copy:
  1. A **fidelity/override slider**, which maps to denoise strength or ControlNet weight.
  2. A **region/target selector** ("enhance people/plants only", "selected area").

  Both exist to stop the AI changing the furniture the user placed.
- AI enhancement is priced at roughly 15–20 credits per image within plans that bundle a few hundred to about 765 credits/month. Assuming the bundled credits all go to enhancement, that is about 25–50 enhanced stills per month per seat. This is an inference from the credit tables; Chaos notes that output "may vary".

### Gaps
- No Autodesk/Revit 2026 native AI visualizer details were found.
- No independent geometry-fidelity tests of the Chaos or D5 enhancers were found, and no r/archviz threads surfaced.
- AI Enhancer turnaround (seconds versus minutes per image) was not found in an official source.

---

## 4. Virtual staging companies: 3D-based versus pure AI, and keeping furniture consistent and to scale

### Takeaway
The market splits into three segments:
- **Human or 3D-artist services** (BoxBrownie about $24–30/image; roOomy about $49–69/image with 2–3 day turnaround; Styldod about $16–23).
- **Hybrid "drag real 3D models onto your photo" tools** (Apply Design about $7/image, with a cloud engine adding shadows and reflections).
- **Pure generative AI** (Virtual Staging AI about $0.25–1/image in about 10–20 s; Collov about 30 s).

Pure-AI tools are widely reported to get scale wrong (sofas about 20% too big, floating rugs, chairs merging into walls) and to be inconsistent across camera angles, because they edit each photo independently without a 3D room model. 3D-based workflows are the answer when scale and multi-view consistency matter.

### Cited Findings
- BoxBrownie: 2D virtual staging is $30/image on the pricing page while the homepage shows $24. Item removal costs $5 or $10, day-to-dusk $5, and a 360° staged image $60. — [Getstageflow BoxBrownie review](https://getstageflow.com/blog/boxbrownie-review); [Bella Virtual](https://www.bellavirtual.com/blogs/news/boxbrownie-virtual-staging); [Pixel Shouters](https://www.pixelshouters.com/boxbrownie-review-2026-pricing/)
- Styldod is reported at $23/photo, or $16 for orders of 8 or more. — [Bella Virtual 2026 comparison](https://www.bellavirtual.com/blogs/news/best-virtual-staging-companies-2026)
- Virtual Staging AI is about $1/image with results in about 15 s (2026 review). Its own Dec 2023 blog says $18 for 6 photos, as low as $0.25/photo, with about 20 s turnaround. — [fast.io 2026](https://fast.io/resources/best-virtual-staging-ai-2026/); [Virtual Staging AI blog (2023)](https://www.virtualstagingai.app/blog/best-virtual-staging-company)
- roOomy costs from $49/image (basic) or $69 with add-ons, revisions $20, turnaround 2–3 days. It differentiates on 3D and AR, letting buyers see virtual furniture overlaid in the real home via phone. — [PhotoUp roOomy review](https://www.photoup.net/learn/rooomy-virtual-staging-review)
- Apply Design (YC S22):
  - Users drag furniture from a library of realistic 3D models onto an uploaded room photo and rotate, scale and move them. The "cloud engine" then renders the result, "casting shadows and reflections". The system "analyzes the room's dimensions and lighting".
  - A "Custom 3D Models" service turns a photo of a specific real piece into a placeable 3D model rendered "with matching lighting, shadows, and perspective".
  - About $7/image (one competitor says $20), and turnaround is reported at 1–15 min.
  - — [Apply Design custom 3D models](https://www.applydesign.io/custom-3d-models); [PhotoUp Apply Design review](https://photoup.net/learn/applydesign-virtual-staging-review); [Apply Design blog](https://applydesign.io/post/how-to-add-furniture-to-a-photo-a-comprehensive-guide)
- AI failure modes: "furniture scale & placement is a frequent problem for AI tools", with "oversized sofas, floating rugs and blocked doorways". Another source cites "furniture 20% too large, rugs that float above the floor, chairs merging into walls". — [Getstageflow software comparison](https://getstageflow.com/best-virtual-staging-software); [Bella Virtual AI vs human](https://www.bellavirtual.com/blogs/news/ai-virtual-staging-vs-human-designers)
- AI staging "edits the photo you already have, so it inherits whatever geometry the picture gives it". It "doesn't analyze the room's physical dimensions or build a 3D model of the space", and "AI models generate each image independently, and may miss that it's the same room". — [Vizcraft](https://vizcraft.ai/blog/posts/ai-virtual-staging); [VirtualStaging.com](https://virtualstaging.com/blog/when-not-to-use-virtual-staging-ai/); [Imagen](https://imagen-ai.com/valuable-tips/virtual-furniture-staging/)
- One vendor claims it can stage up to 4 angles per room by building a "3D spatial map" so furniture stays consistent across views (unverified vendor claim). — [search extract; vendor not pinned down among Getstageflow/Meltflex/Bella Virtual pages](https://getstageflow.com/blog/virtual-staging-companies)
- CGI gives "precise control over materials, shadows, and brand-accurate detail", and the strongest results often combine CGI and AI. — [Imagen guide](https://imagen-ai.com/valuable-tips/virtual-furniture-staging/)
- NAR guidance is that virtually staged listing photos should be clearly labeled. — [NAR](https://www.nar.realtor/news/styled-staged-sold/rethinking-virtual-staging-for-todays-real-estate-agents)

### Inferences
- The price and quality gradient maps directly onto how much true 3D is involved. Pure-AI work costs about $1 and takes seconds but is inconsistent. Hybrid "real 3D models composited into a photo" costs about $7 and takes minutes. 3D-artist services cost $25–70 and take hours to days.
- Ridgeline already has true 3D and exact dimensions, which is the expensive part for staging companies. Its consistency advantage disappears if a generative step is allowed to redraw furniture.
- Apply Design's "drag 3D models onto a fixed photoreal background, then cloud-render shadows and reflections" is the closest commercial analogue to "keep drag-and-drop, add photorealism".

### Gaps
- No technical documentation on Apply Design's or roOomy's renderer (path tracer vs rasterizer, lighting estimation) was found.
- The vendor behind the "3D spatial map, 4 angles" claim was not pinned down.
- No independent study measures furniture-scale error rates of AI staging tools.

---

## 5. Real estate and homebuilder interactive tours with furniture placement: delivering photoreal plus interactivity

### Takeaway
Production real-estate products deliver photorealism in three ways:
- (1) **Captured imagery** (Matterport panoramas/meshes; Zillow SkyTour Gaussian splats from drone footage).
- (2) **Pre-rendered or path-traced panoramas and stills** (homebuilder visualizers such as Zonda Envision).
- (3) **Unreal Engine pixel streaming** for fully interactive photoreal configurators (Away Digital Home, Zaha Hadid configurator, Arcware apartments).

AI is used mainly for **defurnishing** (Matterport Project Genesis: segmentation plus inpainting plus mesh repair). AI-driven refurnishing is announced but not documented as shipped. CoStar now owns Matterport (closed Feb 2025) and agreed in May 2026 to buy Zonda, with the stated aim of combining Envision visualization with Matterport digital twins.

### Cited Findings
- Matterport Project Genesis combines its ML with generative AI for interior design, starting with defurnishing. The stated aims go beyond that to redesigning, virtually furnishing and restyling spaces. — [Matterport blog](https://matterport.com/blog/all-we-want-is-an-empty-room-how-emptying-your-digital-twin-unlocks-design); [Geo Week News, Sep 2025](https://www.geoweeknews.com/news/sometimes-a-quick-look-is-all-you-need)
- Defurnish uses semantic segmentation to identify furnishings and obstructions, erases them, then "fills in the missing geometry and textures using image inpainting and mesh repair". — [Geo Week News, Sep 2025](https://www.geoweeknews.com/news/sometimes-a-quick-look-is-all-you-need)
- Matterport's Winter 2025 release can present a 3D tour fully unfurnished by default, including defurnished 2D property photos. — [Matterport Winter 2025 release](https://matterport.com/en-gb/blog/matterports-winter-2025-release-productivity-multiplied)
- Matterport has partnered with VRPM for virtual staging of 3D models and opened its platform to third-party tools. Styldod and roOomy are named for Matterport staging. — [Matterport/VRPM news](https://matterport.com/news/matterport-announces-virtual-staging-partnership-vrpm-commercial-and-residential-real-estate); [HousingWire](https://www.housingwire.com/articles/virtual-staging-companies-apps/)
- CoStar's acquisition of Matterport completed in Feb/Mar 2025. One source says July 2024, which conflicts and is likely wrong. — [Virginia Business](https://virginiabusiness.com/?p=170559); [vectorshift](https://vectorshift.ai/research/deals/costar-matterport-2025)
- CoStar agreed to acquire Zonda for about $800M (May 29, 2026), planning to combine Zonda's Envision visualization and merchandising with Matterport's spatial platform. Closing status is unknown. — [RISMedia](https://www.rismedia.com/2026/05/29/costar-group-to-acquire-zonda-in-800-million-deal/); [BusinessWire](https://www.businesswire.com/news/home/20260529978168/en/)
- Zonda Envision is a new-home "fully immersive online design center": buyers pick finishes from 225+ manufacturer brands, see structural and floor-plan modifications, and preview them in an integrated visualizer, with 3D/2D floor-plan renderings and virtual tours (UTour integration). No evidence of free furniture placement was found. — [Zonda visualization](https://zondahome.com/digital-solutions/visualization/); [Zonda digital solutions](https://zondahome.com/digital-solutions/)
- Zillow SkyTour (July 2025) is an interactive drone-style exterior 3D tour built with **Gaussian splatting** from drone footage. It is limited to Showcase listings (Zillow Media Experts premium package) and its pipeline is undisclosed. Realtor.com launched a competing "FlyAround" later in 2025. — [Zillow press release](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features); [Radiance Fields](https://radiancefields.com/zillow-adds-gaussian-splatting-support-with-skytour-unveiling); [Inman Nov 2025](https://www.inman.com/2025/11/25/zillows-skytour-uses-complex-3d-tech-to-simplify-home-search/); [GeekWire](https://www.geekwire.com/2025/zillow-uses-drone-imagery-for-new-exterior-3d-tour-feature/)
- Unreal Engine pixel streaming examples:
  - Away Digital Home: buyers walk a photoreal model of an unbuilt home and pick elevations, plans, materials and products, with each change tracked. The case study is about 4 years old.
  - Zaha Hadid Architects' residential configurator uses ray tracing, hosted on AWS or Eagle 3D Streaming (2021).
  - Arcware's interactive apartment lets users swap materials and furniture, with day/night and live pricing.
  - — [Unreal spotlight: home building](https://www.unrealengine.com/en-US/spotlights/shaping-the-future-of-home-building-and-real-estate-sales-with-unreal-engine); [Unreal spotlight: ZHA](https://www.unrealengine.com/en-US/spotlights/personalizing-property-with-zaha-hadid-architects-real-time-configurator); [Arcware real estate](https://www.arcware.com/industry/real-estate)
- Vendor claim: for UE5 scenes with Lumen and Nanite, "pixel streaming is currently the only practical way to deliver it to a browser without specialized hardware". Embeds work via iframe from cloud GPUs. — [Eagle 3D Streaming](https://eagle3dstreaming.com/blog/high-fidelity-3d-streaming-for-the-web-how-to-embed-interactive-unreal-engine-experiences-without-losing-your-brand); [Vagon](https://vagon.io/blog/best-3d-product-configurator-software)

### Inferences
- Interactive, photoreal, drag-to-place in a browser is achieved commercially either by pixel streaming (expensive per-user GPU time, and not a static page) or by compositing editable 3D over captured or pre-rendered photoreal imagery (the Matterport, Kreativ and Apply Design pattern). Gaussian splats are now in production for *viewing* (Zillow SkyTour) but no product with furniture editing inside splats was found.
- For a static three.js site, the realistic analogues are:
  - (a) baked lightmaps or pre-rendered per-room 360° panoramas as the photoreal layer, with three.js furniture composited on top;
  - (b) an on-demand "photo mode" still.

  Pixel streaming conflicts with the static-hosting constraint.

### Gaps
- No technical write-up on Zonda Envision's renderer (pre-rendered layer compositing versus real-time) was found.
- No evidence was found that Matterport has shipped AI *furnishing* (as opposed to defurnishing) as of Oct 2026.
- No homebuilder product combining free furniture drag-and-drop with photoreal output was confirmed beyond the Arcware and Away demos. A Diakrit "Furnish" help article appeared in search but could not be read.

---

## 6. Common UX patterns and lessons (preview-then-render, panoramas, queues, consistency complaints, cost, satisfaction)

### Takeaway
The dominant, proven pattern is **edit in fast real-time 3D, then press "Render" for a metered cloud still or 360° panorama, which takes about 20 s to 10 min**. AI is added either as a constrained post-process with a fidelity slider (pro tools) or as a separate "inspire/restyle" mode whose output is not expected to match the plan (consumer AI apps). The most common complaints are:
- AI changing walls, windows or furniture.
- Wrong scale.
- Inconsistency between views.
- A "clean but CGI" look from path-traced planners.
- Learning curves.
- Credit or tier metering of high-res and 360° outputs.

### Cited Findings
- **Preview then render, metered**:
  - Floorplanner charges 5/10/20 credits for HD/4K/8K per project. — [floorplanner.com/pricing](https://floorplanner.com/pricing)
  - Planner 5D Premium includes 5 renders/month, with unlimited 4K and 360° on Pro. — [xpay](https://www.xpay.sh/saas-pricing/planner-5d/)
  - Homestyler free gives unlimited 1K renders, with 4K paid per image and AI images at 30 credits per 2K. — [TechRadar](https://www.techradar.com/reviews/homestyler); [Homestyler forum](https://www.homestyler.com/forum/view/2034610232517189633)
  - Foyr gives 30–240 render credits/month. — [spendbase](https://test.spendbase.co/?p=35113)
- **360° panoramas as a premium output**: Planner 5D Pro, HomeByMe (10×360°/month on paid tiers), RoomSketcher Pro "360 Views", Coohom 360° tours, and BoxBrownie 360° staging at $60 versus $24–30 for a still. — [xpay Planner 5D](https://www.xpay.sh/saas-pricing/planner-5d/); [fitgap HomeByMe](https://us.fitgap.com/products/021346/homebyme); [GetApp RoomSketcher](https://www.getapp.com/construction-software/a/roomsketcher/pricing/); [GenRoom on Coohom](https://genroom.io/blog/coohom-review-best-alternatives); [Getstageflow](https://getstageflow.com/blog/boxbrownie-review)
- **Render times observed**:

  | Product | Reported time | Source |
  |---|---|---|
  | Kujiale | "10-second" (marketing) | [Baidu Baike](https://baike.baidu.com/en/item/Kujiale/17974) |
  | Coohom | ~1–5 min, "2 min average" for 4K | [formas.ai](https://www.formas.ai/articles/coohom) |
  | Homestyler AI Render | ~1 min | [Homestyler forum](https://www.homestyler.com/forum/view/2034610232517189633) |
  | Foyr | <10 min for 4K | [yespress](https://yespress.io/foyr) |
  | RoomGPT | 15–30 s | [First Chair](https://www.firstchair.app/blog/roomgpt-alternatives) |
  | Virtual Staging AI | ~15 s | [fast.io](https://fast.io/resources/best-virtual-staging-ai-2026/) |
  | Collov | ~30 s | [theaireport](https://www.theaireport.ai/tooldatabase/collov-ai) |
  | roOomy (human) | 2–3 days | [PhotoUp](https://www.photoup.net/learn/rooomy-virtual-staging-review) |

- **Consistency and fidelity complaints**:
  - RoomGPT adds or removes windows and doors and cannot keep chosen items. — [First Chair](https://www.firstchair.app/blog/roomgpt-review)
  - Spacely straightens odd geometry and mis-scales furniture. — [Morphed](https://morphed.app/blog/spacely-ai-interior-design)
  - AI staging shows oversized sofas, floating rugs and inconsistency across angles. — [Getstageflow](https://getstageflow.com/best-virtual-staging-software); [VirtualStaging.com](https://virtualstaging.com/blog/when-not-to-use-virtual-staging-ai/)
  - Archicad AI Visualizer alters geometry. — [myarchitectai](https://www.myarchitectai.com/blog/archicad-ai-tools)
  - SketchUp AI Render material accuracy is "hit or miss". — [myarchitectai](https://www.myarchitectai.com/blog/sketchup-diffusion-review)
- **Vendor mitigations**:
  - Geometry and Material Override sliders and Compose prompts (Veras). — [Chaos blog](https://blog.chaos.com/how-to-enhance-enscape-visuals-with-veras-and-chaos-ai-enhancer)
  - Selected-area enhancement with weak/normal/strong intensity, later split into weight and texture intensity (D5). — [AEC Magazine](https://aecmag.com/visualisation/d5-render-2-8-introduces-ai-enhancer/); [lilys.ai](https://lilys.ai/es/notes/d5-render-20260202/d5-render-2-11-ai-rendering-explained)
  - Entourage-only enhancement (Chaos). — [Chaos guide](https://blog.chaos.com/guide-ai-archviz)
  - Natural-language "Chat Edit" refinement (Collov). — [theaireport](https://www.theaireport.ai/tooldatabase/collov-ai)
  - AI that outputs an editable 3D scene rather than pixels (Homestyler Spark). — [Homestyler blog](https://resources.homestyler.com/2026/07/22/meet-spark-homestylers-ai-interior-design-agent-for-editable-3d-design/)
- **Satisfaction and quality signals**:
  - Coohom: G2 4.5/5 (133 reviews), with praise for fast cloud rendering on low-spec devices and complaints about learning curve, bugs and delays. Professionals still export to D5, Twinmotion or Enscape for final renders. — [G2 compare](https://www.g2.com/compare/coohom-vs-octave-aspect-pressure-vessel-pv-elite); [subscribed.fyi](https://subscribed.fyi/coohom/reviews/); [aitoolsbakery](https://aitoolsbakery.com/?p=7514)
  - Path-traced planner output can look "clean but CGI". — [GenRoom](https://genroom.io/blog/coohom-review-best-alternatives)
  - Wayfair reports 175,000+ Decorify designs, but replaced Decorify with text-based Muse in 2025. — [Furniture Today](https://www.furnituretoday.com/e-commerce/wayfair-retools-its-consumer-ideation-experience-replacing-decorify-with-muse)
- **Cost anchors**:

  | Category | Cost per image | Sources |
  |---|---|---|
  | AI restyle/staging | ~$0.15–$1 | [Krea](https://www.krea.ai/blog/roomgpt-review-and-alternatives-in-2026); [fast.io](https://fast.io/resources/best-virtual-staging-ai-2026/) |
  | Hybrid 3D-on-photo | ~$7 | [PhotoUp](https://photoup.net/learn/applydesign-virtual-staging-review) |
  | Human/3D staging | $16–69 | [Bella Virtual](https://www.bellavirtual.com/blogs/news/best-virtual-staging-companies-2026); [PhotoUp roOomy](https://www.photoup.net/learn/rooomy-virtual-staging-review) |
  | Pro AI enhancement | 15–20 Chaos credits | [NTI](https://www.nti-group.com/uk/products/other-products/chaos/credits/) |

### Inferences
- The lesson most relevant to Ridgeline is that **no surveyed product makes the live, walkable, drag-and-drop view itself AI-generated**. Every successful product keeps a deterministic 3D scene for interaction and produces photoreal output as a derived artifact. That artifact is either a cloud render, a baked or captured image layer, or a constrained AI pass on a still.
- A practical UX copied from the market would be:
  1. A live three.js editing view, improved with baked lighting and better materials.
  2. A "Photo mode / Render this view" button that sends the current camera's color, depth, normals and segmentation to an AI or path-trace backend and returns a still in roughly 10–60 s.
  3. A fidelity slider and "keep my furniture" guarantee (AI touches materials, lighting and entourage, not object positions).
  4. Optional pre-rendered 360° panoramas per room as the shareable "hero" output.
  5. Clear labeling that AI stills are illustrative.
- Multi-view consistency is the unsolved problem across AI staging. Stitching AI images into a walkthrough would likely produce exactly the cross-angle drift that staging users complain about, unless each image is strongly conditioned on the same 3D geometry and materials.

### Gaps
- No Reddit or YouTube user-sentiment data could be retrieved (search returned no Reddit threads, and pages could not be fetched).
- No product publicly documents a "render queue" UI in detail.
- No data on conversion or satisfaction uplift from photoreal versus real-time views was found beyond vendor claims (for example Collov's internal engagement analysis).
- No product was found that offers an AI-stitched, walkable photoreal tour with editable furniture. This absence is a finding in itself, but it may reflect search limits.
