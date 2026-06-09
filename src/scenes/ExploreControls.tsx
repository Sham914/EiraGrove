"use client";

import { OrbitControls } from "@react-three/drei";
import { useAppMode, useReducedMotion } from "@/hooks/useAppState";

export function ExploreControls() {
  const mode = useAppMode();
  const reducedMotion = useReducedMotion();

  if (mode !== "explore") return null;

  return (
    <OrbitControls
      makeDefault
      enablePan={!reducedMotion}
      enableZoom
      enableRotate
      minDistance={4}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.15}
      target={[0, 4, -20]}
      enableDamping
      dampingFactor={reducedMotion ? 0.2 : 0.06}
      rotateSpeed={reducedMotion ? 0.4 : 0.35}
      zoomSpeed={0.6}
      panSpeed={0.5}
      touches={{
        ONE: 1,
        TWO: 2,
      }}
    />
  );
}
