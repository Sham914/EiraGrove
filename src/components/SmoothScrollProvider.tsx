"use client";

import { useRef } from "react";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { sectionsConfig } from "@/config/sections.config";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useCinematicScroll(containerRef);

  const sectionHeight = 125;

  return (
    <div ref={containerRef} className="relative">
      <div
        className="pointer-events-none"
        style={{ height: `${sectionsConfig.length * sectionHeight}vh` }}
        aria-hidden
      />
      <div className="fixed inset-0 z-0">{children}</div>
    </div>
  );
}
