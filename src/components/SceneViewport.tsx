"use client";

import { Suspense, lazy } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const ExperienceCanvas = lazy(() =>
  import("@/scenes/ExperienceCanvas").then((m) => ({
    default: m.ExperienceCanvas,
  }))
);

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-grove-night">
      <div className="font-display text-sm tracking-luxury text-grove-gold/60">
        Loading experience…
      </div>
    </div>
  );
}

export function SceneViewport() {
  const progress = useScrollProgress();

  return (
    <Suspense fallback={<CanvasFallback />}>
      <ExperienceCanvas scrollProgress={progress} />
    </Suspense>
  );
}
