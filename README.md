# Eira Grove

A premium cinematic 3D website for **Eira Grove**, an upcoming luxury resort in Kakkadampoyil. Visitors travel through a living stylized resort environment via scroll-controlled camera progression.

## Tech Stack

- Next.js 15 · React · TypeScript · Tailwind CSS
- GSAP · ScrollTrigger · Lenis smooth scroll
- React Three Fiber · Three.js · Drei
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 2 — Living Resort Environment

The 3D world is a **high-fidelity stylized recreation** inspired by the architectural walkthrough video (not a 1:1 clone).

### 8-Scene Scroll Journey

| Scene | Scroll   | Experience                    |
|-------|----------|-------------------------------|
| 1     |0–12.5%   | Mountain reveal through mist  |
| 2     |12.5–25%  | Approach toward entrance gate |
| 3     |25–37.5%  | Reception pavilion            |
| 4     |37.5–50%  | Landscape pathways & gazebo   |
| 5     |50–62.5%  | Private hillside cottages     |
| 6     |62.5–75%  | Infinity pool reveal          |
| 7     |75–87.5%  | Luxury stilt villas           |
| 8     |87.5–100% | Aerial masterplan (night)     |

### Environment Systems

- **Terrain** — Procedural hillside with terraced slope
- **Vegetation** — Instanced trees, bamboo, bushes (LOD by device)
- **Architecture** — Gate, reception, gazebo, cottages, villas, signage
- **Water** — Custom infinity pool shader (ripples, fresnel, underwater glow)
- **Day cycle** — Morning → golden hour → sunset → night via scroll
- **Life** — Clouds, bird flocks, wind-animated grass & trees, atmospheric fog

## Architecture

```
src/
├── app/                    # Next.js app router
├── components/             # Scroll shell, overlays, CTA
├── config/
│   ├── site.config.ts      # Brand, WhatsApp
│   ├── sections.config.ts  # 8 scenes + copy
│   ├── camera-rail.config.ts
│   ├── environment.config.ts  # Day cycle phases
│   └── resort-layout.config.ts  # Buildings, paths, vegetation zones
├── hooks/
│   ├── useCinematicScroll.ts
│   └── useDeviceCapability.ts  # LOD tiers (high/medium/low)
├── scenes/
│   ├── architecture/       # Modular building components
│   ├── environment/      # Terrain, vegetation, clouds, birds
│   ├── water/              # Infinity pool + shader
│   ├── lighting/           # Dynamic day cycle
│   └── shaders/            # Pool water GLSL
├── sections/               # HTML overlays
└── utils/                  # Camera rail, day cycle, terrain height
```

## Configuration

All layout and camera data is config-driven:

| File                     | Edit to change                                    |
|--------------------------|---------------------------------------------------|
| `resort-layout.config.ts`| Building positions, paths, pool, vegetation zones |
| `camera-rail.config.ts`  | Camera keyframes along the journey                |
| `environment.config.ts`  | Day/night lighting phases                         |
| `sections.config.ts`     | Section scroll ranges and headlines               |

## Performance

- **LOD tiers** — Tree/grass/cloud counts scale by device (`useDeviceCapability`)
- **Lazy loading** — Clouds and birds load asynchronously
- **Instancing** — Vegetation and grass use `InstancedMesh`
- **DPR scaling** — `[1, 1.5]` desktop · `[0.75, 1]` mobile low tier

## Future Upgrades

Replace stylized geometry in `scenes/architecture/` with GLTF assets from `src/assets/`. Camera rail and resort layout config remain unchanged.
