# Eira Grove

A premium cinematic 3D website for **Eira Grove**, an upcoming luxury resort in Kakkadampoyil. Visitors travel through the resort via scroll-controlled camera progression.

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

## Architecture

```
src/
├── app/              # Next.js app router
├── components/       # UI shell (scroll, overlays, CTA)
├── config/           # Editable site, section, camera, environment data
├── hooks/            # Lenis + GSAP scroll integration
├── scenes/           # Modular R3F 3D scenes
├── sections/         # HTML overlay sections
└── utils/            # Camera rail sampling, math, scroll store
```

## Configuration

All content and camera paths are config-driven — no hardcoded copy in components.

| File | Purpose |
|------|---------|
| `config/site.config.ts` | Brand, location, WhatsApp booking |
| `config/sections.config.ts` | Section scroll ranges and copy |
| `config/camera-rail.config.ts` | Editable camera keyframes |
| `config/environment.config.ts` | Sky phases, resort markers |

## Camera Rail

Edit keyframes in `config/camera-rail.config.ts`. Each keyframe defines:

- `progress` (0–1 scroll position)
- `position` / `lookAt` (camera pose)
- `fov`

The camera interpolates smoothly between keyframes with eased blending.

## Performance

- Canvas uses `dpr={[1, 1.5]}` for mobile-friendly rendering
- Scene elements fade in/out by scroll range to reduce draw calls
- Lazy-loaded 3D canvas with SSR disabled

## Future Upgrades

Replace placeholder geometry in `scenes/` with GLTF assets. Camera rail and section config remain unchanged.
