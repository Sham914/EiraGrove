# Heightmap Implementation Plan

Purpose: replace the current procedural terrain sampler with an optional authored heightmap pipeline that integrates with the existing scene, camera, scroll, building, and pool systems while preserving current APIs and fallbacks.

Summary (non-invasive):
- Keep the `sampleTerrainHeight(x,z)` / `snapToTerrain()` API surface unchanged.
- Add a small heightmap loader/util that exposes `getHeightRaw(x,z)` and `getNormal(x,z)` and a readiness flag.
- When a heightmap is available, `sampleTerrainHeight()` should prefer the heightmap (with optional blending/fade to procedural outside the mapped area). If no heightmap, revert to the existing procedural generator.
- Terrain mesh construction in `Terrain.tsx` will consume the same API and therefore requires minimal edits (create geometry based on heightmap samples instead of procedural samples when available).

---

1) Required new files (suggested)

- `src/assets/heightmaps/eira_grove_heightmap.png` (grayscale PNG or JPG). Preferred: 16-bit or lossless PNG for smoother gradients.
- `src/assets/heightmaps/vegetation_mask.png` (optional) — zone mask to deterministically place vegetation.
- `src/assets/heightmaps/heightmap-metadata.json` — small JSON with coordinate mapping: worldSizeX, worldSizeZ, originX, originZ, maxHeight, minHeight (or verticalScale). Example keys:
  - worldSize: [widthMeters, depthMeters]
  - origin: [centerX, centerZ]
  - heightRange: [minMeters, maxMeters]

- `src/utils/heightmap.ts` — new loader/adapter (see functions below).

2) Required edits (files to change)

- `src/utils/terrain-height.ts`
  - Add a conditional path: when the heightmap is loaded, call `heightmap.getHeightAt(x,z)`/`getNormalAt(x,z)` for raw sampling.
  - Keep building/pool blending logic but ensure it calls a `getHeightRaw()` helper that reads heightmap raw values rather than re-invoking blended `sampleTerrainHeight()` to avoid recursion.
  - Keep existing `sampleTerrainHeightRaw()` semantics but implement it to read directly from heightmap when present.

- `src/scenes/environment/Terrain.tsx`
  - During geometry creation, prefer sampling from the heightmap via the existing `sampleTerrainHeight()` API if ready.
  - If the heightmap is still loading, create a low-res placeholder or fall back to procedural mesh to avoid blocking startup.
  - Consider increasing vertex density near the pool / terraces by using `terrainConfig.segmentWeights` or keep global segments but plan to adjust `capabilities.terrainSegments` for visual fidelity.

- `src/config/resort-layout.config.ts`
  - Add a `heightmap` block with: `url`, `worldSize`, `origin`, `verticalScale`, and `fallbackBlendDistance` to tune blending between heightmap and procedural generator at edges.

- (Optional) `src/scenes/SceneEnvironment.tsx` or a parent loader
  - Preload the heightmap asynchronously and set a global readiness flag (or React context) so `Terrain` can pick it up. Alternatively, `Terrain` loads lazily itself.

3) Heightmap utility API (concept)

- `async loadHeightmap(url, metadata?)` — loads image, reads pixels, creates Float32Array height buffer, sets metadata mapping.
- `getHeightRaw(x,z)` — returns raw height in world meters by mapping x,z to pixel coordinates and sampling (bicubic or bilinear interpolation recommended).
- `getNormalAt(x,z)` — finite-difference or analytic normal from height samples.
- `isReady()` — boolean to know if sampling is available.

4) Integration notes — how this avoids breaking each system

- Camera system
  - The camera uses world-space positions and sometimes blends to a terrain-following path via `sampleTerrainHeight()` for grounded shots.
  - Because the heightmap implementation exposes the same `sampleTerrainHeight(x,z)` behaviour, the camera code (including `CameraController`, camera blending thresholds, and `sampleCameraRail()`) does not need structural changes.
  - Practical step: after importing the heightmap, visually verify the camera's `GROUND_BLEND_END`/`PATH_START` constants; these may need numeric tweaking but not API changes.

- Scroll system
  - Scroll maps to a normalized progress value; the heightmap only affects world geometry and reveals, not the scroll mapping itself.
  - No code changes to the scroll system are required. You may adjust `sections.config` timings if visual pacing changes.

- Building placement
  - Buildings use `snapToTerrain(x,z,yOffset)` to find Y and rotation — keeping `snapToTerrain()` API ensures components keep working.
  - After heightmap integration, `snapToTerrain()` will read heights from the heightmap; some buildings may need small config offsets (per-building `yOffset` or `foundationOffset`) to correct for authoring differences.
  - The existing building pad blending code in `terrain-height.ts` must be reworked so `getHeightRaw()` returns the unblended height for foundation insertion; then `sampleTerrainHeight()` may apply blending (pad smoothing) on top.

- Pool placement
  - Pool placement uses `poolConfig.position` + blending logic in `terrain-height.ts`; with heightmap sampling the code will compute the exact pool pad elevation from the raw heightmap and blend to create a flat pad as before.
  - No API changes required; expected small numeric adjustments to `poolConfig.position` and pad radii after previewing the new terrain.

- `snapToTerrain()`
  - Keep the same function signature. Internally, call `sampleTerrainHeight(x,z)` which, when heightmap present, will sample it.
  - If `snapToTerrain()` previously relied on procedural continuity, add a small smoothing/blend parameter to avoid sharp discontinuities from low-res heightmaps.

5) Migration strategy (step-by-step)

1. Add the heightmap assets and metadata into `src/assets/heightmaps/`.
2. Add `src/utils/heightmap.ts` (loader/adapter) and basic tests to verify pixel→world mapping.
3. Extend `src/config/resort-layout.config.ts` with `heightmap` metadata (url, worldSize, origin, verticalScale, blendDistance).
4. Modify `src/utils/terrain-height.ts` to use `heightmap.getHeightRaw()` when available and to preserve the existing building/pool blending logic by calling a raw sampler for pad heights.
5. Modify `src/scenes/environment/Terrain.tsx` to prefer heightmap-based vertex Y during geometry creation; implement placeholder fallback while loading to avoid runtime blocking.
6. Run the app locally, visually inspect critical points (entrance, reception terrace, pool pad). Record required per-building vertical offsets and minor X/Z nudges in `resort-layout.config.ts`.
7. Tweak camera blend thresholds in `src/scenes/CameraController.tsx` as needed to avoid clipping or floating frames during terrain-following segments.
8. Add a debug visualizer (optional toggle) that renders the heightmap as a wireframe overlay or a shaded plane to validate alignment with frames.

6) Expected code changes (high level)

- New: `src/utils/heightmap.ts` (load, sample, normal)
- New assets: `src/assets/heightmaps/*` and `heightmap-metadata.json`
- Edit: `src/config/resort-layout.config.ts` (add heightmap metadata)
- Edit: `src/utils/terrain-height.ts` (prefer heightmap sampling; use raw sampler for foundation pads)
- Edit: `src/scenes/environment/Terrain.tsx` (prefer heightmap during geometry creation; graceful fallback)
- Minor verification: `src/scenes/CameraController.tsx` may receive tuning changes only (no API edits) as a final pass.

7) Performance & quality risks

- Resolution vs. scale mismatch: low-res heightmaps produce terracing artifacts; use higher resolution (2048+ px) for smooth terraces.
- Memory & load time: large heightmaps (4K+) increase memory and startup time; consider streaming or mipmapping if necessary.
- Edge blending: ensure heightmap edges either cover the full `terrainConfig.size` or implement a `fallbackBlendDistance` so the procedural generator fills outskirts without seams.
- Normal accuracy: compute normals from interpolated height samples to avoid faceted lighting on large triangles.
- Recursion hazard: avoid calling `sampleTerrainHeight()` from inside `sampleTerrainHeightRaw()` in a way that creates recursion; implement a raw sampler that directly reads the height buffer.
- Building/pool misplacement: expect many small per-building offsets after the heightmap replaces the procedural generator; plan a quick calibration pass.

8) Tests & validation

- Visual smoke tests: check the entrance gate, reception terrace, and pool from the camera path stops.
- Data tests: sample known pixel coordinates and verify `getHeightRaw()` returns expected values (unit tests / console checks).
- Runtime tests: run with heightmap missing (simulate failed load) to verify procedural fallback works without errors.

---

If you confirm, I will: (A) add the heightmap loader skeleton and metadata (no production code yet) or (B) prepare the exact changes to `terrain-height.ts` and `Terrain.tsx` as a ready-to-apply patch. Tell me which next step you prefer. No code will be written until you approve the next action.
