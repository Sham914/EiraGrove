# Heightmap Creation Plan

Context: available reference assets — architectural walkthrough video and extracted `video-frames`; project briefs in `PROJECT_BIBLE.md`, `RESORT_ANALYSIS.md`, and `TERRAIN_RECONSTRUCTION_PLAN.md`. The repository already contains a heightmap loader and sampling API. This document evaluates options for producing an accurate terrain heightmap for Eira Grove and recommends a pragmatic path.

Evaluated approaches

1) Manual grayscale heightmap creation

- Accuracy: High for designer-directed details (terraces, retaining walls, pool plateau) when an experienced terrain artist sculpts pixel-by-pixel. Fine control over features, but global proportions must be measured from frames.
- Effort: Moderate to high — requires time to translate frames into proportions and to hand-paint contours at appropriate resolution (2–4 hours to block, 1–2 days to refine depending on fidelity).
- Required tools: Photoshop/GIMP/Affinity (grayscale painting), Krita, or an image editor supporting high-bit-depth exports; optionally a heightmap baking utility for smoothing.
- Compatibility: Excellent — outputs a standard grayscale PNG which maps directly into the existing `heightmap` loader. No additional code changes required.
- Notes: Best for explicit terrace edges and pool pad; requires careful mapping of world extents (use `heightmap-metadata.json`).

2) Blender terrain sculpting workflow

- Accuracy: Very high — sculpt in Blender using reference images, place primitives for walls/pads, and produce an exported heightmap or mesh. Allows correct 3D relationships and terraces with physical offsets.
- Effort: Moderate to high — learning curve if team unfamiliar with Blender sculpting; estimated 1–3 days to block out + refine. Offers precise control and the ability to bake normal maps and masks for vegetation.
- Required tools: Blender (free), optionally Blender addons (ANT Landscape, Sculpt tools), and an image editor for post-processing. Export pipeline: bake displacement to 16-bit PNG heightmap.
- Compatibility: Excellent — bake to grayscale heightmap that the loader ingests; also produces a Blender mesh export for reference/LOD if desired.
- Notes: Preferred when you want both an authored mesh and a heightmap; ideal for terraces and retaining walls because you can position exact planes and bake the resulting displacement.

3) AI-generated terrain from reference images

- Accuracy: Variable. AI methods (image-to-height, stable diffusion geodata models, terrain-from-image CNNs) can generate plausible forms but often lack precise scale and may invent features inconsistent with the walkthrough. Good for fast prototyping and background massing, poor for critical terraces and built elements.
- Effort: Low to moderate — quick to iterate (minutes to hours) but requires curation and manual corrections. Additional work needed to scale and align output to world units.
- Required tools: AI services / local models (e.g., MiDaS, DPT for depth estimation; Stable Diffusion depth-to-image pipelines; commercial photogrammetry SaaS), Python tooling to convert depth to heightmap, image editors for cleanup.
- Compatibility: Medium — output must be normalized, rescaled, and likely heavily edited before being usable by the loader. Risk of artifacts and inconsistent elevation ranges.
- Notes: Use as auxiliary input (background massing), not as the authoritative heightmap for terrace accuracy.

4) Hybrid workflow (recommended)

- Accuracy: Very high when combined correctly — use Blender sculpting for critical built platforms (reception terrace, pool pad, foundation pads, and retaining walls) and supplement with AI-derived coarse massing or manual painting for surrounding slopes.
- Effort: Moderate — splits work into focused tasks: quick photogrammetry/AI massing + targeted Blender sculpting + minor manual touch-ups. Estimated 1–3 days depending on fidelity targets.
- Required tools: Blender (sculpt + bake), image editor for masks and cleanup, optional AI depth tools (MiDaS) for quick base, and the existing screenshot/frame set for reference. Use Blender to bake a 16-bit PNG heightmap matching `heightmapConfig.worldSize` and `heightRange`.
- Compatibility: Excellent — final output is a high-bit-depth grayscale PNG and optional masks (vegetation mask, terrace mask) that plug directly into the loader and vegetation pipelines.
- Notes: This approach balances speed and control — AI and photogrammetry speed the rough massing while Blender ensures correct terraces and built geometry.

Comparison summary

- Fastest → Slowest: AI-generated (fast) → Manual paint (moderate) → Blender (moderate to slow) → Hybrid (balanced timeline but more steps).
- Most accurate for built terraces and pool: Blender or Hybrid > Manual paint > AI-only.
- Best fit for current project constraints (need precise terraces, pool, and building alignment while minimizing code changes): Hybrid workflow.

Recommendation

Choose the Hybrid workflow: use AI or depth-estimation to create a coarse base elevation from frames for the overall mountain silhouette, then import that into Blender and sculpt/add precise terraces, retaining walls, pool plateau, and building foundation flats. Bake a 16-bit PNG heightmap at the desired resolution (2048 or 4096 px) with a matching `heightmap-metadata.json` that sets `worldSize` and `heightRange` to match `terrainConfig` units. Also export vegetation masks and a terrace mask to assist deterministic vegetation placement and blending.

Suggested execution steps

1. Extract key reference frames (done) and pick 6–10 orthographic or near-orthographic frames covering entrance, reception, pool, and ridge.
2. Run a depth-estimation pass (MiDaS/DPT or an online depth API) on selected frames to generate coarse depth maps and merge them into a base DEM (digital elevation model) in image editor or Blender.
3. Import the DEM into Blender as a displacement plane or use ANT Landscape to generate a mesh; scale to `heightmapConfig.worldSize` and align origin to `heightmapConfig.origin`.
4. Sculpt precise terraces, carve retaining walls, and place flat pads for buildings and pool. Use snapping and boolean meshes to ensure flatness where needed.
5. Bake displacement to a 16-bit grayscale PNG heightmap and export additional masks (vegetation, terrace, pool pad).
6. Add files to `src/assets/heightmaps/` and populate `heightmap-metadata.json` with `worldSize`, `origin`, and `heightRange` (min/max meters).
7. Load the heightmap in-app (call `loadHeightmap()` in `SceneEnvironment` or `Terrain`) and run visual smoke tests. Tweak building `position` and `yOffset` values as necessary.

Risks & mitigations

- Risk: DEM alignment errors cause building offsets — mitigate by aligning reference frames with a simple Blender proxy scene early and iterating on alignment.
- Risk: Low-resolution bake creates terracing artifacts — mitigate by baking at 16-bit and 2048–4096 px, then smoothing selectively.
- Risk: Time investment — set a minimum viable fidelity target (e.g., 2048 PNG with correct pool/pad geometry) and iterate higher-fidelity assets later.

If you approve, I will produce a concise checklist for the hybrid workflow and then (optionally) implement the in-app `loadHeightmap()` call to read the final heightmap when you add it to the repo.
