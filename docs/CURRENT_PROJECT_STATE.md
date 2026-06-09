# Current Project State

Source materials reviewed: `docs/PROJECT_BIBLE.md`, `docs/RESORT_ANALYSIS.md`, `docs/TERRAIN_RECONSTRUCTION_PLAN.md`, and the `video-frames` reference images.

This document summarizes the current codebase (what exists now), highlights fidelity gaps relative to the brief, and lists the smallest, highest-impact changes required to move the implementation closer to the cinematic vision. No new architecture is proposed — only concrete edits and assets that integrate with the existing code.

---

## A. What exists today (implementation inventory)

- Platform: Next.js + TypeScript app scaffold under `src/`.
- Scene orchestration: `src/scenes/SceneEnvironment.tsx` composes lighting, terrain, vegetation, architecture, water, particles, and camera controller.
- Procedural terrain: `src/scenes/environment/Terrain.tsx` creates a `PlaneGeometry` and uses `src/utils/terrain-height.ts` (`sampleTerrainHeight`, `snapToTerrain`, `getTerrainNormal`) to sculpt vertex Y values at runtime.
- Terrain configuration: `src/config/resort-layout.config.ts` contains `terrainConfig`, `buildingsConfig`, `pathsConfig`, `poolConfig`, and `mountainBackdropConfig` as the canonical spatial data for placements.
- Camera rail: `src/config/camera-rail.config.ts` defines camera keyframes; `src/utils/camera-rail.ts` exposes `sampleCameraRail()` that resolves keyframes to world positions; `src/scenes/CameraController.tsx` drives camera lerping and a secondary walk-path blending between keyframes and a sampled walk path.
- Walk-path utilities: `src/utils/terrain-path.ts` (used by CameraController) provides a resort walk path used for terrain-following camera segments.
- Scroll choreography: `src/components/SmoothScrollProvider.tsx` + `src/hooks/useCinematicScroll.ts` (hook used to map DOM scroll to a normalized progress value) drive `scrollProgress` fed into `SceneViewport` and the scene. `src/utils/scroll-store.ts` and `src/hooks/useScrollProgress.ts` provide an observable scroll progress API consumed throughout overlays and audio hooks.
- Sections and overlays: `src/config/sections.config.ts` defines the 8 narrative sections; `src/components/SectionOverlay.tsx` and the sections index render textual overlays tied to progress ranges.
- Resort placement: `src/scenes/architecture/ResortArchitecture.tsx` iterates `buildingsConfig` and places modular building components (`EntranceGate`, `ReceptionPavilion`, `PrivateCottage`, `LuxuryVilla`, etc.). `FoundationPad` primitives and `snapToTerrain()` ground the buildings to the procedural terrain.
- Water: `src/scenes/water/InfinityPoolWater.tsx` contains a custom pool shader material and places the pool using `poolConfig.position` and `snapToTerrain()`; pool shader uniforms update in `useFrame` for animated surface.
- Vegetation & Life systems: multiple components exist (e.g., `Vegetation`, `GrassPatches`, `CloudLayer`, `BirdFlock`, `Fireflies`), with `useDeviceCapability()` controlling LOD tiers.
- Audio: procedural ambient engine at `src/audio/AmbientAudioEngine.ts` is wired to `useAmbientAudio()` and responds to `scrollProgress` and mode.
- Explore mode: `OrbitControls` via `ExploreControls.tsx` toggled by `app-store` state for free exploration after the guided experience.

Files of highest relevance:
- `src/scenes/environment/Terrain.tsx`
- `src/utils/terrain-height.ts`
- `src/config/resort-layout.config.ts`
- `src/config/camera-rail.config.ts`
- `src/scenes/CameraController.tsx`
- `src/components/SmoothScrollProvider.tsx` and `src/hooks/useCinematicScroll.ts`
- `src/scenes/water/InfinityPoolWater.tsx`
- `src/scenes/architecture/ResortArchitecture.tsx`

---

## B. Fidelity gaps vs. the `PROJECT_BIBLE` and `RESORT_ANALYSIS`

1. **Terrain fidelity**: The project currently uses a procedural height function (`sampleTerrainHeight`) to shape a plane. The Bible requires reconstructing terrain from the walkthrough (sculpted heightmap / Blender mesh), not a generic procedural slope.
2. **Authored assets**: Buildings are assembled from procedural primitives and small modular components — there are no GLTF/GLB model assets in `src/assets/` (only `.gitkeep`). Video frames indicate more specific massing and detail that primitives cannot convey.
3. **Camera precision**: Camera keyframes exist and provide a good scaffold, but are hand-approximated values. The video shows exact framing and hold lengths that require numeric refinement and hold/slow zones in the timeline.
4. **Scroll timing & holds**: The mapping from scroll progress to camera keyframes is linear with smoothing; the cinematic brief needs explicit eased holds and tension points (e.g., compressed approach, slow reveal at the pool) that are currently implemented only as soft interpolations rather than timeline holds.
5. **Resort layout calibration**: `buildingsConfig` positions are present but likely need adjustment to align with a real heightmap and terrace footprints. Right now snapping to procedural heights masks misalignment risks.
6. **Vegetation as spatial element**: Vegetation components exist, but their placement is density-driven and LOD-driven rather than author-driven to hide/reveal architecture and paths as in the frames.

---

## C. Smallest, Highest-Impact Changes (prioritized)

Below are minimal changes to get the project materially closer to the vision while changing as little code structure as possible.

1. Replace procedural terrain plane with an authored heightmap import (Minimal edits: medium effort)

  - Why: reproduces terraces, retaining wall relationships, and exact pool plateau geometry.
  - Files to touch: `src/scenes/environment/Terrain.tsx`, `src/utils/terrain-height.ts`.
  - Minimal approach: support an optional heightmap input image (greyscale) and a fallback to existing procedural function. Add a small adapter that samples the heightmap in `sampleTerrainHeight()` when available and blends with the procedural generator for off-site areas. This preserves the rest of the code that calls `snapToTerrain()`.

2. Calibrate camera keyframes to the video and add hold segments (Low-to-medium effort)

  - Why: precise framing + hold timing creates cinematic moments; current keyframes need timing and easing adjustments to match the video beats.
  - Files to touch: `src/config/camera-rail.config.ts`, `src/utils/camera-rail.ts`, `src/scenes/CameraController.tsx`.
  - Minimal approach: add optional per-keyframe timing/dwell parameters (e.g., `holdBefore`, `holdAfter`, or `easeIn/out`) and implement timeline easing in `sampleCameraRail()` and CameraController interpolation. Update numeric coordinates using measurements from frames (or approximate by eye) — this is data work, not architecture change.

3. Make the scroll→timeline mapping explicit and add cinematic hold curves (Low effort)

  - Why: the scroll should behave like a film edit timeline with sections that pause/hold for a fraction of scroll distance to let reveals land.
  - Files to touch: `src/components/SmoothScrollProvider.tsx`, `src/hooks/useCinematicScroll.ts`, `src/config/sections.config.ts`.
  - Minimal approach: implement a non-linear mapping layer (e.g., piecewise easing) that maps raw scroll progress to `sceneProgress` used by the camera. Add config-driven hold ranges for the cinematic moments defined in `sections.config.ts` or a new `cinematicMoments` table.

4. Align building footprints to heightmap terraces and tighten `buildingsConfig` (Low effort)

  - Why: ensures buildings sit correctly on the authored terrain and that foundation pads don't intersect retaining walls.
  - Files to touch: `src/config/resort-layout.config.ts`, `src/scenes/architecture/ResortArchitecture.tsx`, `src/utils/terrain-height.ts` (for blending).
  - Minimal approach: once heightmap is in place, run a small calibration pass to nudge `buildingsConfig` X/Z positions and optionally add a per-building vertical offset in the config so foundations vertically snap cleanly.

5. Use vegetation placement masks to control conceal/reveal (Low effort)

  - Why: to replicate the bamboo corridors and dense planting that stage the reveals.
  - Files to touch: `src/scenes/environment/Vegetation.tsx` (or equivalent), `src/config/resort-layout.config.ts` (add vegetation zone masks).
  - Minimal approach: add configuration for vegetation zones (already present) but make placement deterministic by sampling the heightmap and a zone mask, rather than purely random instancing.

6. Asset pipeline: incremental GLTF replacements (Low effort per asset)

  - Why: maintain the existing component API while progressively swapping primitive components for authored GLTFs.
  - Files to touch: `src/scenes/architecture/*` components and `src/assets/` placement.
  - Minimal approach: keep current component props/shape, but inside components load a GLTF when available and fall back to primitives otherwise. This avoids big refactors and allows staged quality improvements.

---

## D. Risks / Notes

- Heightmap resolution and coordinate mapping must match the world units used throughout (camera, paths, pools). Choose a consistent scale and document it in `resort-layout.config.ts`.
- Introducing a heightmap will reveal any latent misalignment in `buildingsConfig` and `pathsConfig` — plan a short calibration pass after importing.
- Camera calibration depends on either manual eyeballing against frames or extracting camera parameters from the source video (if originals are available). Numeric accuracy requires either photogrammetry or manual keyframe tuning.

---

## E. Next non-code steps (if you want me to continue)

1. Load a high-resolution heightmap extracted from the video footage or sculpt one quickly in Blender from the frames and commit it to `src/assets/heightmaps/` so I can adapt `sampleTerrainHeight()` to sample it.
2. Produce a camera keyframe tuning pass (a list of refined values for `camera-rail.config.ts`) derived from frame sampling.
3. Create a `vegetation-mask.png` or simple per-zone masks to deterministically place bamboo and forest bands.

If you'd like, I can carry out steps 1–3 in small, iterative edits (one change at a time) and run the app to verify behavior. No code edits have been made in this step.

---

Prepared from direct inspection of the repository and reference frames — ready to produce the first change (heightmap support) when you confirm.

