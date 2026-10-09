# Render to photoreal image: APIs, architecture AI tools, pricing, latency and integration for Ridgeline Residence (as of 9 Oct 2026)

How these notes were made: all findings come from web-search result pages retrieved on 2026-10-09. Direct page fetches (WebFetch/curl) to ai.google.dev, platform.openai.com, bfl.ai and fal.ai were blocked by this session's network egress policy, so no primary page was opened in full. Figures attributed to official pages (Google, OpenAI, Vercel, Stability, fal model pages, Clarity, Krea) come from search-engine extracts of those pages, not from reading them directly. Prices in this market changed several times in 2026, sometimes within weeks (see the Gemini model churn below). **Re-check every number on the live vendor page before budgeting.**

---

## 1. General-purpose image editing models with API access: structure preservation, control maps, multi-image input, resolution, latency, price

### Takeaway
None of the frontier "instruction editing" models (Google Nano Banana family, OpenAI gpt-image-2, FLUX.2/Kontext, Seedream 4.5/5.0, Qwen-Image-Edit) accepts ControlNet-style depth, canny or segmentation maps as a native conditioning input. All of them take one or more reference images plus a prompt. They often keep the composition, but they don't guarantee it. The best cheap-and-fast candidates per image are Nano Banana 2.1 (about $0.034 at 1K, GA on 6 Oct 2026), Seedream 4.5 (about $0.04), Qwen-Image-Edit-2511 (about $0.03/MP) and FLUX.2 [pro] (about $0.03–0.09 depending on inputs). The premium tier is Nano Banana Pro ($0.134 at 1K/2K, $0.24 at 4K) and gpt-image-2 at high quality (about $0.17–0.21 plus input tokens). Midjourney has no official API.

### Cited Findings

**Google Gemini image models ("Nano Banana")**
- **Nano Banana Pro (Gemini 3 Pro Image, `gemini-3-pro-image`)**: $0.134 per image at 1K or 2K output (1,120 output tokens) and $0.24 at 4K (2,000 tokens). Batch: $0.067 (1K/2K) and $0.12 (4K). Image output is billed at $120 per 1M tokens. — [Gemini Developer API pricing (official, via search extract, 2026-10-09)](https://ai.google.dev/gemini-api/docs/pricing)
- Gemini 3 Pro Image consumes 560 tokens per *input* image. — [Google Cloud model doc](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro-image)
- Nano Banana Pro accepts up to 14 input/reference images and outputs up to 4K. `image_size` is set to "1K", "2K" or "4K", and the "K" must be uppercase. — [diskd-ai Gemini API reference (third-party)](https://github.com/diskd-ai/gemini-api/blob/main/references/image-generation.md)
- **Nano Banana Pro latency (third-party, varies widely)**:
  - A median of 61 s and a P90 of 252 s across 617 production requests at 4K with reference images. — [dev.to benchmark](https://dev.to/super_lewis/nano-banana-21-vs-nano-banana-pro-same-prompts-real-latency-data-and-when-pro-is-worth-it-je0)
  - A median of 19.2 s in a 60-image OpenRouter test. — same search result set ([dev.to](https://dev.to/super_lewis/nano-banana-21-vs-nano-banana-pro-same-prompts-real-latency-data-and-when-pro-is-worth-it-je0))
  - About 30–40 s at 2K and 50–70 s at 4K with low thinking, rising to 80–120 s at 4K with high thinking. Setting `thinking_level` to "low" reportedly cuts time by 20–30%. — [Apiyi speed guide](https://help.apiyi.com/en/nano-banana-pro-speed-optimization-guide-en.html); [aifreeapi speed guide](https://www.aifreeapi.com/en/posts/nano-banana-pro-speed-optimization)
- **Nano Banana 2.1 (`gemini-nano-banana-2.1`)**: stable/GA release on **6 Oct 2026**. Price is about $30/1M output tokens, which works out to about $0.0336 (1K), $0.0504 (2K) and $0.0756 (4K) per image, with Batch at half that. Input is reportedly $1.50/1M tokens, about three times Nano Banana 2's rate. No free API tier. — [OrcaRouter (2026-10)](https://www.orcarouter.ai/blog/nano-banana-2-1-release-date); [Tech-Insider](https://tech-insider.org/nano-banana-2-1-launches-halves-image-price-2026/). These are secondary sources and not yet confirmed on Google's pricing page.
- Nano Banana 2.1 latency: P50 end-to-end of 16.42 s for the best provider on OpenRouter. — [OpenRouter model page](https://openrouter.ai/google/gemini-nano-banana-2.1). Another launch-day write-up reports an 18.88 s median and 42.85% availability (not independently verified).
- **Nano Banana 2 (Gemini 3.1 Flash Image, `gemini-3.1-flash-image`)**: $0.045 (0.5K), $0.067 (1K), $0.101 (2K) and $0.151 (4K) per image, with Batch at about half. — [Gemini API pricing (official, via search extract)](https://ai.google.dev/gemini-api/docs/pricing). **Deprecated in the 6 Oct 2026 changelog with migration to `gemini-nano-banana-2.1`.** — [Gemini API changelog](https://ai.google.dev/gemini-api/docs/changelog). Mixed-news reports an **Oct 29, 2026 shutdown** (154 days after its May 28, 2026 release, on 23 days' notice). — [Mixed-news](https://mixed-news.com/en/google-gemini-3-1-flash-image-shutdown-154-days-23-days-notice/). This conflicts with Google's deprecations page, which says "no shutdown date announced" — [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations) — and with Vertex docs listing "May 28, 2027 or later" — [Vertex model doc](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image).
- **Gemini 3.1 Flash-Lite Image (`gemini-3.1-flash-lite-image`)**: image output at $30/1M tokens, about $0.034 per 1K image. Released June 30, 2026. Listed as the replacement for 2.5 Flash Image. — [Google Cloud Agent Platform pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing); [OpenRouter](https://openrouter.ai/google/gemini-3.1-flash-lite-image)
- **Original Nano Banana (Gemini 2.5 Flash Image)**: $0.039/image. Its retirement was moved from Oct 2, 2026 to **Mar 15, 2027** (release notes dated Sept 14, 2026). — [Google Cloud release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes). Firebase docs still say Oct 2, 2026. — [Firebase models page](https://firebase.google.com/docs/ai-logic/models)
- In a 1024×1024 cold-start test by an API reseller, Nano Banana 2 averaged 1.8 s and the original Nano Banana 2.6 s. This is a vendor-run test and conflicts sharply with the 16–19 s OpenRouter figures. — [AnyCap](https://anycap.ai/page/en-US/blog/best-ai-image-generator-api-developers-2026)

**OpenAI gpt-image-2 (and older models)**
- The official pricing page lists gpt-image-2 image tokens at **$4.00/1M input, $1.00 cached and $15.00 output**, with text input at $2.50/1M. It also lists a "gpt-image-2.5-sunburst" row at $8/$2/$30. — [OpenAI pricing (via search extract)](https://developers.openai.com/api/docs/pricing). **These figures conflict** with the ChatGPT Enterprise rate card and a WaveSpeed summary, both of which give gpt-image-2 at **$8 input, $2 cached and $30 output per 1M**. — [OpenAI rate card](https://help.openai.com/en/articles/20001415); [WaveSpeed](https://wavespeed.ai/blog/posts/gpt-image-2-pricing-2026/)
- Per-image estimates (reprints of OpenAI examples, checked Sept 6, 2026):
  - 1024×1024: $0.006 low, $0.053 medium, $0.211 high
  - 1024×1536 or 1536×1024: $0.005 low, $0.041 medium, $0.165 high
  - Input images and prompt text are billed on top of these. — [aifreeapi (Sept 6, 2026)](https://www.aifreeapi.com/en/posts/openai-image-generation-api-pricing); [aireiter](https://aireiter.com/blog/gpt-image-2-api-pricing)
- gpt-image-2 processes every input at high fidelity. Sending the `input_fidelity` parameter is ignored or returns 400 depending on the source, so omit it. A large reference image costs the same input tokens regardless of output size. — [Kulfiy](https://www.kulfiy.com/gpt-image-2-input-fidelity-why-you-should-leave-it-out/); [OpenAI edit reference](https://developers.openai.com/api/reference/python/resources/images/methods/edit)
- Resolution limits per fal's spec: max edge 4000 px, edges in multiples of 16, aspect ratio of at most 3:1, and at most 8,294,400 total pixels. Output above 2560×1440 is flagged experimental/beta. — [fal: What is GPT Image 2](https://fal.ai/learn/tools/what-is-gpt-image-2). One gateway doc says up to 16 input images per edit call. — [Apiyi docs](https://docs.apiyi.com/en/api-capabilities/gpt-image-2/overview)
- Latency: gpt-image-2 (medium) averaged 8.2 s with a P95 of 14.5 s in a 1024² cold-start test. — [AnyCap](https://anycap.ai/page/en-US/blog/best-ai-image-generator-api-developers-2026). OpenAI has published no official generation time.
- gpt-image-1-mini costs $0.005–0.052 per image depending on quality and size, and is marked deprecated. — [OpenAI model page](https://developers.openai.com/api/docs/models/gpt-image-1-mini)

**Black Forest Labs FLUX.2 / FLUX.1 Kontext**
- FLUX.2 [pro] combines up to **10 reference images** and outputs up to **4 MP** at any aspect ratio. — [BFL FLUX.2 launch blog](https://bfl.ai/blog/flux-2). fal lets you reference images in the prompt with `@image1`, `@image2`. — [fal FLUX.2](https://fal.ai/flux-2)
- FLUX.2 pricing is per megapixel:
  - **[pro]**: $0.03 for the first output MP, $0.015 for each additional MP, plus $0.015 per input MP — [OpenRouter FLUX.2 Pro](https://openrouter.ai/black-forest-labs/flux.2-pro)
  - **[max]**: $0.07 for the first MP, $0.03 for each additional, plus $0.03 per input MP — [OpenRouter FLUX.2 Max](https://openrouter.ai/black-forest-labs/flux.2-max)
  - **[flex]**: $0.06/MP for input and output — [OpenRouter FLUX.2 Flex](https://openrouter.ai/black-forest-labs/flux.2-flex)
  - These are reseller listings and were not confirmed on bfl.ai.
- FLUX.1 Kontext [pro] costs $0.04 per image and [max] $0.08 (flat credit pricing). — [Puter FLUX pricing (Sept 2026)](https://developer.puter.com/tutorials/flux-api-pricing/)
- Latency estimates vary widely: FLUX.2 Pro at 15–30 s in one guide and 3–8 s in another, and FLUX.2 at about 2.0 s in a prompt-adherence benchmark. — summarized from [WaveSpeed guide](https://wavespeed.ai/blog/posts/complete-guide-ai-image-apis-2026/), [Atlas Cloud](https://www.atlascloud.ai/blog/tips/best-ai-image-generation-models-2026) and [ModelsLab latency](https://modelslab.com/ai-api-latency-comparison). Several of these are vendor blogs.

**ByteDance Seedream 4.5 / 5.0**
- Seedream 4.5 costs **$0.04/image** on fal for both edit and text-to-image, and the edit endpoint takes **up to 10 reference images**. Output goes up to about 4 MP (2048×2048 headline; per-dimension range 1920–4096 px). — [fal Seedream 4.5 edit](https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit); [fal Seedream 4.5 t2i](https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/text-to-image). BytePlus official is also about $0.04, and resellers charge $0.03–0.038. — [Pixazo](https://www.pixazo.ai/models/seedream); [EvoLink](https://evolink.ai/blog/seedream-pricing-guide-2026)
- **Seedream 5.0 Pro** (launched about July 8, 2026): $0.045 per image up to 2.36 MP and $0.09 above that. The first reference image is free and each additional one costs $0.003. Reference limit is 10 or 14 depending on source. Resolution tiers are 1K/2K, with up to 3K on some hosts. — [OpenRouter Seedream 5.0 Pro](https://openrouter.ai/bytedance-seed/seedream-5-0-pro); [AIML API](https://aimlapi.com/models/seedream-5-0-pro); [Atlas Cloud](https://www.atlascloud.ai/blog/ai-updates/seedream-5-0-pro-price). PiAPI quotes higher prices: $0.068 at 1K and $0.136 at 2K. — [PiAPI](https://piapi.ai/blogs/seedream-5-pro-api-guide)
- Latency: Seedream 5 averaged 2.4 s (P95 4.1 s) at 1024² in a reseller test, and Seedream 5.0 Lite about 2 s at 2048². — [AnyCap](https://anycap.ai/page/en-US/blog/best-ai-image-generator-api-developers-2026); [Atlas Cloud](https://www.atlascloud.ai/blog/tips/best-ai-image-generation-models-2026)

**Alibaba Qwen-Image-Edit**
- Qwen-Image-Edit-2511, Edit Plus (2509) and the original Edit model all cost **$0.03/MP** on fal. The LoRA variant costs $0.035/MP. — [fal Qwen-Image-Edit-2511](https://fal.ai/models/fal-ai/qwen-image-edit-2511); [fal Edit Plus](https://fal.ai/models/fal-ai/qwen-image-edit-plus)
- "Qwen Image 3" edit on fal costs $0.04 at 1K and $0.075 at 2K per image. — [fal Qwen Image 3 edit](https://fal.ai/models/alibaba/qwen-image-3/edit)
- No hosted depth ControlNet variant of Qwen-Image-Edit was found on fal or Replicate (see Gaps).

**Ideogram, Stability AI, Midjourney**
- **Ideogram API** (separate credit balance, no subscription needed): Ideogram 4.0 costs $0.03 (Turbo), $0.06 (Default) and $0.10 (Quality) per image, covering generate, edit, remix and reframe. — [eesel (2026)](https://www.eesel.ai/blog/ideogram-pricing); [Kie.ai](https://kie.ai/blog/ideogram-v4-pricing). No control-map input was found.
- **Stability AI API**: the **Structure** and **Sketch** control services cost 5 credits each (credit = $0.01, so about $0.05/call). Stable Image Core costs 3 credits and Ultra 8 credits. — [Stability pricing page](https://platform.stability.ai/pricing) (the snapshot may be dated); [Puter (June 2026)](https://developer.puter.com/tutorials/stability-ai-api-pricing/). Structure control is the one general-purpose vendor endpoint found that is explicitly built to preserve an input image's structure.
- **Midjourney**: still **no official public API** as of Aug–Sept 2026. Third-party "Midjourney APIs" automate user accounts against the terms of service and risk bans. — [GitHub issue (late Sept 2026)](https://github.com/rtorcato/brand-kit/issues/39); [Unifically (Aug 18, 2026)](https://unifically.com/blogs/midjourney-api); [Apiframe](https://apiframe.ai/blog/best-midjourney-apis)

**Higgsfield (owner already has an account)**
- Higgsfield launched a pay-as-you-go developer API on **Sept 16, 2026**. It covers 50+ image, video and audio models, is funded from a prepaid USD balance with a $5 minimum top-up, bills each image model per image, and offers an estimate endpoint. Failed generations are refunded. — [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-api); [cloud.higgsfield.ai](https://cloud.higgsfield.ai/); [Bitroot guide (Sept 21, 2026)](https://bitroot.org/blog/2026-09-21-higgsfield-api-guide-how-to-integrate-50-models-fo/); [MindStudio](https://www.mindstudio.ai/blog/higgsfield-api-pricing-pay-per-use)
- Listed API image prices: Ideogram 4.0 at $0.03/image, Recraft 4.1 at $0.035 and Grok Imagine 2.0 from $0.04. "Marketing Studio Image" is quoted anywhere from about $0.006 to $0.016 depending on snapshot. — [open.higgsfield.ai pricing](https://open.higgsfield.ai/pricing); [Apiframe guide](https://apiframe.ai/guides/higgsfield-api-guide)
- In Higgsfield's *web credits* (not the API), Nano Banana Pro costs 2 credits at 1K (about $0.15) and 4 credits at 4K (about $0.30), and FLUX.2 Pro 1 credit at 1K (about $0.08). — [BudgetPixel price index (Sept 2026)](https://budgetpixel.com/data/ai-generation-price-index/nano-banana-pro)
- Relight is a Higgsfield web product that uses "generative AI and depth-mapping technology". No documented relight or upscale *API* endpoint or price was found. — [Higgsfield Relight blog](https://higgsfield.ai/blog/Relight-Director-Style-Cinematic-Lighting); [Higgsfield API docs](https://docs.higgsfield.ai/docs/api-reference/overview)

**Benchmarks**
- Artificial Analysis image-editing arena (mirror scraped Sept 2, 2026):
  1. MAI-Image-2.6-Preview (Microsoft), 1286
  2. MAI-Image-2.5-Pro, 1272
  3. Reve 2.1, 1261
  4. GPT Image 2 (high), 1257
  5. MAI-Image-2.5, 1257
  - Nano Banana 2 scores 1251, GPT Image 1.5 (high) 1251 and Nano Banana Pro 1247. HunyuanImage 3.0 Instruct leads the open-weights models at 1222.
  - Sources: [benchmarklist mirror](https://benchmarklist.com/arenas/artificial_analysis_image_editing/); [Artificial Analysis editing leaderboard](https://artificialanalysis.ai/image/leaderboard/editing); [247wallst](https://247wallst.com/cards/msft-xpost-01m0ww8hz1mtxqzdr3sdzntw6z)
  - A separate "AA-Image-Editing v2.0" board on a different scale lists GPT Image 2.5 Sunburst (max) first at 1183, with Qwen-Image-2.1 as the open-weights leader. — [AA v2.0](https://artificialanalysis.ai/image/leaderboard/editing)

**Structure preservation, which is the key issue for drag-and-drop furniture**
- Autodesk APS tested Flux+ControlNet, Nano Banana and Qwen on 3D viewer scenes. Its conclusion: "without ControlNet, you're handing the model a flat screenshot and a text prompt, which produces something visually appealing but structurally unreliable." Flux and Qwen outputs closely matched the original staircase and hallway layouts, while Nano Banana's structural fidelity was rated "variable, depending on scene complexity" because it is "image + prompt only, no depth-map guidance". The test is qualitative, with no published metrics. — [Autodesk APS blog](https://aps.autodesk.com/blog/do-you-still-need-controlnet-testing-next-gen-models-viewer-scenes)
- Even with an image input, Nano Banana "approximates your geometry rather than measuring it". Practitioners lock geometry with prompts such as "keep the exact same camera angle, framing, geometry, proportions, and window/door placement". — [Meltflex](https://www.meltflexai.com/blog/nano-banana-architecture-prompts); [Renderdrop/RebusFarm](https://rebusfarm.net/news/renderdrop-nano-banana-pro-for-architectural-visualization)
- An open-source Blender add-on sends depth/mist passes to Nano Banana to keep camera and scene geometry. This shows that a depth map can be passed to Nano Banana as an extra reference image, as a hybrid approach. — [Kovname/nano-banana-render](https://github.com/Kovname/nano-banana-render)

### Inferences
- For "furniture must stay exactly where it was placed", the strongest guarantee comes from a **depth-conditioned diffusion pipeline** (ControlNet or Control-LoRA depth plus canny/line art; see section 2). The instruction-editing models are the better "look" engines but need guardrails. A practical hybrid is to send the RGB screenshot plus the exported depth or line-art image as a second reference to Nano Banana 2.1, Seedream or FLUX.2, with geometry-locking prompt text. Then run an automatic check (for example, edge overlay or IoU of the exported object-ID mask against a segmentation of the output) and fall back to the ControlNet path, or retry, when drift exceeds a threshold.
- The exported object-ID mask is most useful for **post-hoc verification and region-locked inpainting**, since no frontier editing API takes it as a conditioning map.
- For an interactive "Make it photoreal" button, Nano Banana Pro at 4K (median of about 61 s and P90 of about 252 s in one benchmark) is too slow for a synchronous call and close to Vercel Hobby's 300 s function cap. 1K/2K output from Nano Banana 2.1, Seedream or gpt-image-2 at medium (about 2–20 s) fits better.
- Google's 2026 image-model churn (2.5 Flash Image → 3.1 Flash Image → 2.1 within months, with short deprecation notice) argues for keeping the model ID in server-side config and abstracting the provider, for example by going through fal, Runware or OpenRouter.

### Gaps
- I could not open the official ai.google.dev, OpenAI, BFL or fal pages directly because egress was blocked. The Nano Banana 2.1 price comes only from secondary sources.
- The gpt-image-2 token-rate conflict ($4/$15 vs $8/$30 per 1M) is unresolved, and per-image costs could differ by about 2×.
- No official latency figures exist for any of these models. The latency numbers come from vendors or third parties, use mixed methods, and in the Nano Banana case differ by an order of magnitude.
- I found no evidence of whether FLUX.2, Seedream or gpt-image-2 respond well to a depth map passed as a plain reference image. Nobody has published a quantitative geometry-drift benchmark for render-to-photo.
- I did not research API availability or pricing for Microsoft MAI-Image and Reve, which top the editing arena.
- I did not research SeedEdit as a separate product. Seedream 4.x/5.x now covers editing.

---

## 2. Hosted inference platforms with ControlNet/depth-conditioned pipelines (fal.ai, Replicate, Together, Runware, Modal/self-hosting): price per image, cold start and latency

### Takeaway
fal.ai has the most turnkey depth-conditioned FLUX endpoints:
- Control-LoRA Depth: $0.04/MP
- Depth with LoRAs (img2img): $0.035/MP
- "FLUX General" with multiple ControlNets and IP-Adapter: $0.075/MP

Runware is the cheapest at volume, with ControlNet preprocessors at fractions of a cent, FLUX.2 [pro] at $0.045 and FLUX.2 [klein] 9B at $0.00078/image. Together hosts FLUX.2 and FLUX.1 Canny [pro]. Replicate and Modal bill GPU-seconds. Replicate public models don't bill cold starts, and Modal is about 40% cheaper per GPU-second. Self-hosting FLUX.1 [dev] commercially needs a BFL license, while FLUX.2 [klein] 4B is Apache 2.0.

### Cited Findings
- **fal.ai depth/ControlNet endpoints**:
  - FLUX.1 [dev] Control LoRA Depth: **$0.04/MP** — [fal](https://fal.ai/models/fal-ai/flux-control-lora-depth)
  - FLUX.1 [dev] Depth with LoRAs (image-to-image): **$0.035/MP** — [fal](https://fal.ai/models/fal-ai/flux-lora-depth)
  - FLUX.1 [dev] General (ControlNets, LoRA and IP-Adapter combined): **$0.075/MP** — [fal](https://fal.ai/models/fal-ai/flux-general)
  - A canny variant also exists. — [fal canny](https://fal.ai/models/fal-ai/flux-lora-canny)
- fal reportedly rounds billing up to the next whole megapixel, so a 1024×1024 image (1.05 MP) may bill as 2 MP. An aggregator instead lists Control-LoRA Depth at $0.042/image, so this is unverified. — [Aident](https://aident.ai/blog/fal-ai-image-pricing-per-image-vs-megapixel)
- fal publishes no latency for its depth endpoints. An academic benchmark (RTX A6000, 1024², 25 steps) measured FLUX ControlNet (depth) at about **26.0 s/image**, against about 24.9 s for base FLUX. This is not fal's serving latency, which runs on faster GPUs. — figure surfaced via search from arXiv control-method papers ([FreeControl 2511.05219](https://arxiv.org/pdf/2511.05219) / [RelaCtrl 2502.14377](https://arxiv.org/pdf/2502.14377); the summary did not say which). A general guide says FLUX takes "typically 10–30 seconds". — [theneuralbase](https://theneuralbase.com/flux/learn/advanced/fal-ai-for-flux-inference/)
- **BFL's own control models**: FLUX.1 Canny [pro] costs $0.05/run on EachLabs, $0.0625 on Segmind and is hosted by Together. FLUX.1 Depth [pro] is accessible via the BFL API, but no USD price was found. — [EachLabs](https://www.eachlabs.ai/black-forest-labs/flux-canny/flux-canny-pro); [Segmind](https://www.segmind.com/models/flux-canny-pro/pricing); [Together](https://www.together.ai/models/flux-1-canny-pro)
- **Runware**:
  - Canny ControlNet preprocessor: $0.0006/run — [Runware](https://runware.ai/models/controlnet-preprocess-canny)
  - Segmentation preprocessor: from $0.0013/run, about 5 s — [Runware docs](https://runware.ai/docs/models/controlnet-preprocess-seg)
  - FLUX.2 [pro]: $0.045 (1536×1024)
  - FLUX.2 [max]: $0.10
  - Nano Banana Pro: $0.138 (1376×768)
  - FLUX.2 [klein] 9B: $0.00078 (1024², "sub-second latency")
  - Sources for the model prices: [Runware SOTA collection](https://runware.ai/collections/sota-models); [Runware best image models](https://runware.ai/collections/best-image-models)
  - Runware publishes its own FLUX.1-dev ControlNet-Union-Pro-2.0 weights. — [Hugging Face](https://huggingface.co/Runware/FLUX.1-dev-ControlNet-Union-Pro-2.0)
  - Serverless cost scales with GPU time. — [Runware pricing docs](https://runware.ai/docs/platform/pricing)
- **Together AI**:
  - FLUX.2 [pro]: $0.03/image
  - FLUX.2 [dev]: $0.0154
  - FLUX.2 [flex]: $0.03
  - FLUX.2 [max]: $0.07/MP
  - Kontext [pro]: $0.04/MP; [max]: $0.08/MP
  - Some prices are marked "+ (varies)" because they pass through the provider's charge.
  - Sources: [Together FLUX.2 pro](https://www.together.ai/models/flux-2-pro); [Together pricing](https://www.together.ai/pricing); [Together docs](https://docs.together.ai/docs/serverless/models)
- **Replicate**: per-second GPU rates are T4 $0.000225, L40S $0.000975, A100-80GB $0.0014 and H100 $0.001525. Public models bill only active processing time (**cold starts are free**). Private deployments bill setup, idle and active time. Popular FLUX models use per-output pricing, for example about $0.04 for FLUX 1.1 Pro and about $0.025 for FLUX Dev. — [Spheron (2026)](https://www.spheron.network/blog/replicate-pricing-2026-per-second-cost/)
- **Modal**: L40S $0.000542/s, H100 $0.001097/s, A100-80GB $0.000694/s, A10 $0.000306/s and L4 $0.000222/s. Billing stops when containers scale to zero. The headline rates assume no region pinning and preemptible defaults. — [Spheron Modal pricing (2026)](https://www.spheron.network/blog/modal-gpu-pricing-2026-per-second-billing/); [Beam on Modal pricing](https://www.beam.cloud/blog/modal-pricing-explained)
- Interior ControlNet practice:
  - Depth Anything V2 gives sharper interior boundaries than MiDaS.
  - Mirrors and glass confuse depth *estimators*.
  - Depth conditioning scale of about 0.65–0.75 is suggested for interiors.
  - Source: [theneuralbase interior guide](https://theneuralbase.com/controlnet/learn/intermediate/interior-design-visualization/) (practitioner guidance, not a standard)
- **Licensing for self-hosting**: FLUX.2 [dev] and the [klein] 9B models use the FLUX.2-dev **Non-Commercial** License, and commercial serving needs a BFL agreement. FLUX.2 [klein] 4B (distilled and base) is **Apache 2.0**. — [BFL flux2 repo](https://github.com/black-forest-labs/flux2); [HF FLUX.2-klein-4B](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B); [BFL klein blog](https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence). API-hosted klein endpoints reportedly include commercial output rights. — [Flowith FAQ](https://flowith.io/blog/flux-2-pro-dev-faq-licensing-lora-fine-tuning-api-rate-limits-self-hosting/)

### Inferences
- This project's renderer exports exact depth and line art, so the depth-estimator weaknesses (mirrors, glass, MiDaS blur) don't apply. Feeding *ground-truth* depth from three.js into a depth ControlNet should give the tightest furniture placement of any option. This is a key advantage over tools that estimate depth from a screenshot.
- Rough compute-only cost for self-hosting FLUX depth on Modal L40S is about 25 s × $0.000542 ≈ **$0.014/image** (my arithmetic, assuming A6000-class timing). That excludes cold starts and idle time and needs a commercial FLUX license, or an Apache-licensed model such as FLUX.2 [klein] 4B or SDXL-class ControlNets. Self-hosting only beats fal or Runware at high, steady volume.
- A low-latency "preview while dragging" mode could plausibly use Runware's sub-second FLUX.2 [klein] tier, followed by a slower high-quality render on demand. The klein + depth combination is unverified.

### Gaps
- No published cold-start durations were found for fal, Replicate or Modal, and there are no measured end-to-end latencies for fal's depth endpoints.
- No hosted FLUX.2 or Qwen-Image depth ControlNet endpoint with a price was found. Every confirmed hosted depth endpoint is FLUX.1 [dev]-based.
- Commercial output rights for FLUX.1 [dev] endpoints served through fal or Replicate were not confirmed. The FLUX.1 [dev] license terms on hosted use need checking.
- Runware's price for a FLUX depth-ControlNet generation was not found, only the preprocessor prices.

---

## 3. Architecture/interior-specific AI render tools: which have public APIs a web app can call?

### Takeaway
Almost all architecture-specific AI renderers are consumer or plugin apps with no public API:
- Chaos Veras / AI Enhancer
- Enscape AI
- D5 AI
- SketchUp AI Render (formerly Diffusion)
- Archicad AI Visualizer
- ArkoAI
- LookX

**mnml.ai** is the only one with a self-serve, published-price API (about $0.10 per generation, commercial rights included). **Rendair** offers its API to partners only. **ReRender AI** reportedly has an API, but pricing is unverified. **PromeAI** sources conflict. **Krea** has a public pay-per-job API, but it is a general tool, not architecture-specific.

### Cited Findings
- **Chaos Veras / AI Enhancer / AI Upscaler**: these are end-user features inside V-Ray, Corona and Enscape, paid with Chaos Credits. Veras sends "camera view and geometry snapshot" to the cloud. Veras 3.0 added image-to-video. No public developer API was found. — [Chaos AI visualization](https://www.chaos.com/ai-visualization); [Chaos Veras 3.0 press release](https://www.chaos.com/press/chaos-unveils-several-new-ai-tools-led-by-veras-30-with-image-to-video-generator-for-aec); [Digital Production (May 29, 2026)](https://digitalproduction.com/2026/05/29/chaos-puts-veras-everywhere/)
- **Enscape**: an SDK exists for embedding Enscape's real-time renderer, but it is not an AI generation API. — [Enscape SDK](https://www.chaos.com/enscape/sdk)
- **D5 Render**: no API. A forum thread requesting a Python/scripting API shows it is still only a user request. — [D5 forum](https://forum.d5render.com/t/python-scripting-console-api-access-in-d5-render/74188)
- **SketchUp AI Render (formerly Diffusion)**: built into SketchUp Pro/Studio with no public API. — [MyArchitectAI](https://www.myarchitectai.com/blog/sketchup-ai-rendering)
- **Archicad AI Visualizer**: runs inside Archicad on Studio/Collaborate plans, with no external API mentioned. — [Graphisoft](https://www.graphisoft.com/solutions/innovation/archicad-ai-visualizer); [Graphisoft community](https://community.graphisoft.com/t5/Visualization/Enhancing-Conceptual-Design-with-Archicad-28-s-built-in-AI/ta-p/631160)
- **mnml.ai API** (separate site mnmlai.dev): 1 credit = 1 generation. Packs are 500 for $49, 1,000 for $99, 2,500 for $249 and 5,000 for $499, with tiers up to 50,000 credits. That is about **$0.10/generation**, and every pack includes commercial usage rights. The consumer plans are separate (Lite $29/mo for 1,000 credits). — [mnml.ai API pricing](https://mnmlai.dev/pricing); [mnml.ai API](https://mnmlai.dev/); [mnml.ai consumer pricing](https://mnml.ai/pricing)
- **Rendair**: "API access is reserved for official partners… requires a formal request and review", with no published price. — [Rendair FAQ](https://rendair.ai/faq/api-access-and-partnership-requests)
- **ReRender AI**: reviews say it has a "documented API", and one listing says API access starts at $45/mo. Neither claim is verified. — [RenderShop review](https://rendershop.ai/rerender-ai-review); [ToolMage](https://www.toolmage.com/en/tool/rerender-ai/); [ReRender](https://rerenderai.com/)
- **ArkoAI**: plugin subscriptions only, from about $39/mo, with no API found. — [Arko pricing](https://arko.ai/pricing)
- **LookX**: from $20/mo. Sources conflict on whether an API exists. — [4now](https://4now.ai/tools/lookx-ai); [ToolsForHumans](https://www.toolsforhumans.ai/ai-tools/lookx-ai)
- **PromeAI**: most sources say there is no developer API, but a minority claim one exists. — [AiSuperSmart Q&A](https://www.aisupersmart.com/Question-Answer/question/does-promeai-offer-an-api/); [SourceForge](https://sourceforge.net/software/product/PromeAI/)
- **Krea**: a public API billed in dollars per successful job from a prepaid balance, with failed jobs not charged. Enhancement prices are Topaz $0.10, Topaz Generative $0.27 and Topaz Bloom $0.51 per upscaled image. Krea Realtime is tied to app plans, with no API price found. — [Krea API](https://www.krea.ai/features/api)

### Inferences
- In practice, the "architecture AI" category is a set of wrappers around the same base models (SD/FLUX/Nano Banana-class) plus tuned prompts and presets. For a custom three.js app, calling a general API directly (fal, Gemini or BFL) gives more control, a lower cost and the ability to send exact depth maps. mnml.ai is the only drop-in "architecture-tuned" API, at about 2–3× the per-image cost of Seedream or Nano Banana 2.1.
- Chaos Veras's approach (a camera view plus a geometry snapshot) is conceptually what the Ridgeline app can do itself with its depth and line-art exports.

### Gaps
- I did not research whether Interior AI (interiorai.com) offers an API.
- No official API documentation was confirmed for ReRender AI, LookX or PromeAI. Contact the vendors before relying on them.
- I did not test mnml.ai's API for its control inputs (whether it accepts depth or line art, or only an image) or its latency.

---

## 4. Upscalers and relighting tools for a final pass (Magnific, Topaz, Clarity, Krea, IC-Light, Higgsfield relight/upscale)

### Takeaway
For a cheap, faithful upscale, use Clarity's own API ($0.005–0.03/MP) or Topaz via fal ($0.08 per started 24 MP of output). Magnific/Freepik is more expensive and its pricing varies per job. For relighting, IC-Light V2 on fal costs $0.10/MP and Bria Fibo Relight on fal $0.04/image. Higgsfield Relight exists in the web app, but no API endpoint was found. Generative ("creative") upscalers can invent detail and may alter furniture, so use precision or non-generative modes.

### Cited Findings
- **Topaz**:
  - On fal: $0.08 per started 24 MP of output (≤24 MP is $0.08, 24–48 MP is $0.16) — [fal Topaz precision](https://fal.ai/models/topaz/upscale/image/precision)
  - Topaz's own API bills on output resolution, at 1 credit = 24 MP per its developer docs (the marketing page says 32 MP). Plans run $0.12/credit on Starter and $0.10/credit on Developer ($50/mo for 500 credits). — [Topaz developer pricing](https://developer.topazlabs.com/getting-started/model-pricing); [Topaz API](https://www.topazlabs.com/api)
- **Clarity AI** official API rates: Clarity Upscaler $0.005/MP, Clarity Pro Upscaler $0.03/MP and Crystal Upscaler $0.016/MP. — [Clarity AI pricing](https://clarityai.co/pricing). The Replicate community build costs about $0.015/run. — [Replicate](https://replicate.com/philz1337x/clarity-pro-upscaler)
- **Magnific (Freepik rebranded its AI platform as Magnific in April 2026)**:
  - The API runs on prepaid credits. The Precision upscaler reportedly costs 90 credits per 2K image (live page, Sept 26, 2026), and cost scales with resolution and factor. — [Oakgen](https://oakgen.ai/blog/magnific-ai-freepik-rebrand-pricing)
  - Third-party estimates put a 4× upscale at about €0.20 and larger jobs at about $0.32.
  - The old pay-per-use API plan was being discontinued on June 30. — [Freepik API pricing](https://www.freepik.com/api/pricing)
- **IC-Light V2 relighting**: $0.10/MP on fal, versus $0.20/image on WaveSpeed. — [fal IC-Light V2](https://fal.ai/models/fal-ai/iclight-v2). **Bria Fibo Edit Relight**: $0.04/image on fal. — [fal Bria relight](https://fal.ai/models/bria/fibo-edit/relight)
- **Krea enhancement API**: Topaz $0.10, Topaz Generative $0.27, Topaz Bloom $0.51 per image. — [Krea API](https://www.krea.ai/features/api)
- **Higgsfield**: Relight uses "generative AI and depth-mapping technology". The Upscale changelog entries focus on video (ByteDance Upscale to 4K/60 fps). No relight or upscale API endpoint or price was documented. — [Higgsfield Relight](https://higgsfield.ai/blog/Relight-Director-Style-Cinematic-Lighting); [Higgsfield changelog](https://higgsfield.ai/creator-hub/changelog)
- Ideogram's API also has an Upscale endpoint at $0.06. — [UsagePricing](https://www.usagepricing.com/blueprint/ideogram)

### Inferences
- Generate at 1K–2K, where latency and cost are low, and upscale only when the user downloads or shares an image. This keeps the upscale cost off most renders.
- Nano Banana 2.1 at 4K costs about $0.076, which is close to "1K generation + Topaz upscale" (about $0.034 + $0.08). Native 4K may give more coherent detail, but at a much higher latency (no 2.1-specific 4K latency was found).
- Relighting (IC-Light or Bria) could provide time-of-day variants (dawn or dusk on the mountain views) from one photoreal base. It needs a structure check, because relighting models can shift edges.

### Gaps
- No faithfulness comparison of these upscalers on architectural interiors was found.
- Higgsfield's relight/upscale API status and price are unconfirmed. They may be reachable only through the MCP tools in the owner's account, not through a web-callable API.

---

## 5. Integration concerns for a static Vercel site: secret keys, abuse and rate limits, caching, content-policy refusals, licensing

### Takeaway
All provider calls must go through a Vercel Function proxy. Vercel's **4.5 MB request/response body limit** means the screenshot, depth and mask PNGs should be uploaded directly to storage (Vercel Blob or the provider's storage) and passed by URL. **maxDuration** is 300 s on Hobby and up to 800 s on Pro (1,800 s in beta), so slow models such as Nano Banana Pro 4K need an async queue-and-poll pattern. On licensing:
- Hosted APIs generally grant commercial output use. mnml.ai says so explicitly.
- Open-weight FLUX.2 [dev], klein 9B and Qwen-Image-2.1 are non-commercial or research-only for self-hosting.
- Gemini images carry an invisible SynthID watermark.

### Cited Findings
- **Vercel limits**:
  - Max request or response body for a Vercel Function is **4.5 MB**. Oversized requests return 413 `FUNCTION_PAYLOAD_TOO_LARGE` at the platform layer, and the limit can't be changed. Vercel recommends uploading large files directly to storage. — [Vercel Functions limits](https://vercel.com/docs/functions/limitations); [Vercel KB on bypassing the body limit](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions)
  - **maxDuration** is 300 s (default and max) on Hobby. Pro defaults to 300 s, allows up to 800 s at GA, and allows 1,800 s in beta with Fluid compute. Exceeding the limit returns 504 `FUNCTION_INVOCATION_TIMEOUT`. — [Vercel Functions limits](https://vercel.com/docs/functions/limitations); [Vercel changelog: functions up to 30 minutes](https://vercel.com/changelog/vercel-functions-can-now-run-up-to-30-minutes)
- **Provider account mechanics that affect abuse exposure**:
  - Higgsfield API: prepaid balance, requests pause at zero instead of overdrawing — [MindStudio](https://www.mindstudio.ai/blog/higgsfield-api-pricing-pay-per-use)
  - Krea: prepaid balance, failed jobs not charged — [Krea API](https://www.krea.ai/features/api)
  - Stability: prepaid credits that expire after one year — [SaaSCRMReview](https://saascrmreview.com/stable-diffusion-review/)
  - No free API tier for Nano Banana 2.1 or Gemini 3 Pro Image — [OrcaRouter](https://www.orcarouter.ai/blog/nano-banana-2-1-release-date); [pixmind](https://www.pixmind.io/posts/nano-banana-pro-pricing-guide-2026)
- **Licensing and outputs**:
  - mnml.ai API packs include "commercial usage rights" — [mnmlai.dev pricing](https://mnmlai.dev/pricing)
  - FLUX.2 [dev] is released under a Non-Commercial License. Its model card says outputs may be used commercially, but other sources say commercial use needs the BFL API or a license, so sources conflict. — [HF FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev); [BFL flux2 repo](https://github.com/black-forest-labs/flux2)
  - FLUX.2 [klein] 4B is Apache 2.0 — [HF klein 4B](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)
  - Original Qwen-Image was Apache 2.0 (Aug 4, 2025). **Qwen-Image-2.1 (Sept 20, 2026) is under a Research License**, and commercial use needs a separate license, with output rights unclear. — [Traictory (Sept 21, 2026)](https://traictory.com/news/2026-09-21-qwen-image-2-1); [Qwen-Image issue #98](https://github.com/QwenLM/Qwen-Image/issues/98)
- **Watermarking**: Gemini-generated images carry an invisible SynthID watermark. In the Gemini apps they also carry a visible watermark. A public SynthID detector exists. — [Gemini Apps Help](https://support.google.com/gemini/answer/16722517?hl=en&co=GENIE.Platform%3DDesktop); [Google DeepMind SynthID](https://deepmind.google/models/synthid/)
- **Gemini model-lifecycle risk**: Nano Banana 2 (3.1 Flash Image) was deprecated about four months after release, with a reported shutdown 23 days after notice. — [Mixed-news](https://mixed-news.com/en/google-gemini-3-1-flash-image-shutdown-154-days-23-days-notice/); [Gemini changelog](https://ai.google.dev/gemini-api/docs/changelog)

### Inferences
These are engineering recommendations, not sourced facts.
- **Proxy flow**:
  1. The browser exports RGB, depth, line art and the ID mask, as compressed JPEG/PNG at 1–2K.
  2. It uploads them to Vercel Blob with a client-upload token, or to the provider's storage via a signed URL.
  3. It POSTs a small JSON body (camera, layout hash, blob URLs and style preset) to `/api/render`.
  4. The function holds the API key in an environment variable, submits an async job to the provider (fal and Replicate queues and webhooks fit well), and returns a job ID.
  5. The browser polls `/api/render/:id`.
  6. The finished image is copied into Vercel Blob, since provider result URLs may be temporary.
- **Cache key**: hash the canonical layout (furniture IDs, transforms rounded to about 1 cm and 1°), the quantized camera pose, the style preset, the model ID and the prompt version. Check Blob or KV before calling the provider. Cache hits are free and instant. A walkthrough with preset "hero" camera views will get high hit rates, while free-orbit views will get few.
- **Abuse controls**:
  - Per-IP and per-session rate limits, for example with a KV/Redis token bucket
  - A monthly spend cap enforced server-side
  - A Turnstile- or hCaptcha-style check before the first render
  - Disallow arbitrary user prompts (use fixed style presets) to limit both cost and content-policy exposure
  - Prefer providers with prepaid balances (Higgsfield, Krea, Stability, fal credits) so a leaked key or a bot can't create an unbounded bill
- **Content-policy refusals**: architectural interiors with no people or brands are low-risk for refusals. The main residual risks are prompts that name brands or real people, and models' safety filters occasionally blocking benign images. Keep a fallback model in the server config.
- Abstract the provider behind a single `/api/render` contract, because Gemini model IDs changed three times in 2026.

### Gaps
- No source quantified content-policy refusal rates for architecture or interior images on any provider. This is unsourced and should be tested empirically.
- I did not check Vercel function pricing (GB-hours or Active CPU under Fluid compute) or whether Hobby's terms permit commercial use. If the site is commercial, confirm Vercel plan terms.
- I did not research Google's, OpenAI's or ByteDance's API terms on output ownership and commercial use.
- I did not research whether SynthID or C2PA metadata is applied to *API* outputs, as opposed to Gemini app outputs, for each vendor.

---

## 6. Rough monthly cost scenarios: 1,000 and 50,000 "Make it photoreal" renders per month

### Takeaway
At 1,000 renders a month, every mainstream option costs about **$30–$250/month**, so cost hardly matters and the choice should be made on quality and structure preservation. At 50,000 renders a month, costs spread out:
- About **$1,500–$2,900/month** for the efficient tier: Qwen-Image-Edit, Seedream 4.5/5.0, Nano Banana 2.1, and FLUX depth on fal
- About **$7,000–$12,000+** for the premium tier: Nano Banana Pro, and gpt-image-2 at high quality
- Under **$1,000** in compute for self-hosted or Runware-klein pipelines, with licensing and engineering caveats

Caching and on-demand-only upscaling are the main levers for cutting cost.

### Cited Findings (unit prices used; see sections 1–4 for sources)
- Nano Banana 2.1: $0.0336 (1K) and $0.0504 (2K) — [OrcaRouter](https://www.orcarouter.ai/blog/nano-banana-2-1-release-date). Input reportedly $1.50/1M tokens — [OrcaRouter](https://www.orcarouter.ai/blog/nano-banana-2-1-release-date). Flash-class input images use about 1,120 tokens each — [Google Cloud 3.1 Flash Image doc](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-image)
- Nano Banana Pro: $0.134 (1K/2K) and $0.24 (4K). Batch is half price — [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Seedream 4.5: $0.04 — [fal](https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit). Seedream 5.0 Pro: $0.045 plus $0.003 for each extra reference — [OpenRouter](https://openrouter.ai/bytedance-seed/seedream-5-0-pro)
- Qwen-Image-Edit-2511: $0.03/MP — [fal](https://fal.ai/models/fal-ai/qwen-image-edit-2511)
- FLUX.1 [dev] Control-LoRA Depth: $0.04/MP — [fal](https://fal.ai/models/fal-ai/flux-control-lora-depth). FLUX General (multi-ControlNet): $0.075/MP — [fal](https://fal.ai/models/fal-ai/flux-general)
- FLUX.2 [pro]: $0.03 for the first output MP plus $0.015 per input MP — [OpenRouter](https://openrouter.ai/black-forest-labs/flux.2-pro)
- gpt-image-2: $0.041 (medium, 1536×1024) and $0.165 (high, 1536×1024), excluding input tokens — [aifreeapi](https://www.aifreeapi.com/en/posts/openai-image-generation-api-pricing)
- Stability Structure: about $0.05 — [Stability](https://platform.stability.ai/pricing)
- mnml.ai API: about $0.10/generation — [mnmlai.dev](https://mnmlai.dev/pricing)
- Runware FLUX.2 [klein] 9B: $0.00078 — [Runware](https://runware.ai/collections/best-image-models)
- Modal L40S: $0.000542/s — [Spheron](https://www.spheron.network/blog/modal-gpu-pricing-2026-per-second-billing/)
- Topaz on fal: $0.08 per image up to 24 MP — [fal](https://fal.ai/models/topaz/upscale/image/precision). Clarity Upscaler: $0.005/MP — [Clarity](https://clarityai.co/pricing)

### Inferences (my arithmetic; one output image per render at about 1 MP / 1K unless noted; inputs are the screenshot plus a depth or line-art map plus up to 2 material reference photos)

| Pipeline | Est. $/render | 1,000/mo | 50,000/mo | Notes |
|---|---|---|---|---|
| Qwen-Image-Edit-2511 (fal), 1 MP | ~$0.03 | ~$30 | ~$1,500 | No depth control; check the license/output terms of the specific Qwen version |
| Seedream 4.5 (fal/BytePlus) | ~$0.04 | ~$40 | ~$2,000 | Up to 10 refs, ~4 MP; fast (~2–4 s, vendor test) |
| Nano Banana 2.1, 1K (+~4 input images ≈ $0.007) | ~$0.040 | ~$40 | ~$2,000 | Price from secondary sources; ~16–19 s P50 on OpenRouter |
| Nano Banana 2.1, 2K | ~$0.057 | ~$57 | ~$2,850 | |
| FLUX.1 [dev] Control-LoRA Depth (fal) | $0.04–0.08 | $40–80 | $2,000–4,000 | Range reflects the MP-rounding uncertainty; strongest geometry lock |
| FLUX General multi-ControlNet (depth + canny) | $0.075–0.15 | $75–150 | $3,750–7,500 | |
| Seedream 5.0 Pro (3 extra refs) | ~$0.054 | ~$54 | ~$2,700 | |
| Stability Structure | ~$0.05 | ~$50 | ~$2,500 | The pricing snapshot may be dated |
| FLUX.2 [pro] (BFL), 1 MP out + 2–4 MP in | $0.06–0.09 | $60–90 | $3,000–4,500 | Together lists $0.03/image + "varies" |
| gpt-image-2 medium (+ input tokens) | ~$0.05–0.07 | ~$50–70 | ~$2,500–3,500 | Could be about half if the $4/$15 token rates apply |
| mnml.ai API | ~$0.10 | ~$99 | ~$5,000 | Architecture-tuned; commercial rights included |
| Nano Banana Pro 2K | ~$0.14 | ~$140 | ~$7,000 | 4K: ~$0.24, so ~$245 or ~$12,200 |
| gpt-image-2 high (+ inputs) | ~$0.18–0.21 | ~$180–210 | ~$9,000–10,500 | Same token-rate caveat |
| Self-hosted FLUX depth on Modal L40S (~25 s/img) | ~$0.014 compute | ~$14 + cold-start pain | ~$700 + idle/ops | Needs a BFL commercial license, or an Apache model (FLUX.2 klein 4B) |
| Runware FLUX.2 [klein] 9B (preview tier) | ~$0.0008 | <$1 | ~$39 | Sub-second; quality and structure fidelity not verified |
| **Add-on:** Topaz upscale on every render | +$0.08 | +$80 | +$4,000 | Only on download (e.g. 10%): +$8 / +$400 |
| **Add-on:** Clarity Upscaler to ~4 MP | +~$0.02 | +$20 | +$1,000 | |

- **Caching**: a 30% cache hit rate cuts every row by about 30%. This is a guess, not measured. Fixed "hero" camera presets would raise the hit rate considerably.
- **Batch APIs**: Gemini Batch at half price isn't usable for an interactive button. It suits pre-rendering a fixed gallery of hero views overnight, for example 20 hero views × 5 style presets at Nano Banana Pro 4K batch $0.12, which comes to about $12.
- **Recommended shape** (inference):
  - Default interactive render: a depth-conditioned FLUX path on fal, or Nano Banana 2.1/Seedream with the depth map as a second reference plus an automatic structure check
  - "Premium/hero" option: Nano Banana Pro
  - Final pass on demand: Topaz or Clarity upscale
  - Budget at 50,000/month: roughly **$2,000–3,500/month all-in** for the efficient path

### Gaps
- The input-token prices for Nano Banana Pro and gpt-image-2 reference images aren't confirmed. Estimates assume a few thousand input tokens per render.
- Vercel function, Blob storage and bandwidth costs are not included, and neither are failed or retried generations (which matter if a structure check triggers re-rolls).
- Real-world re-roll rates, meaning how often a render must be regenerated because furniture moved, are unknown. They could multiply effective cost by 1.2–2× (guess) and must be measured in a pilot.
