"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { sectionsConfig } from "@/config/sections.config";

export function ScrollProgressBar() {
  const progress = useScrollProgress();
  const activeIndex = sectionsConfig.findIndex(
    (s) => progress >= s.scrollStart && progress < s.scrollEnd
  );

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex">
      {sectionsConfig.map((section, i) => (
        <div
          key={section.id}
          className={`h-8 w-px transition-all duration-500 ${
            i === activeIndex
              ? "bg-grove-gold"
              : i < activeIndex
                ? "bg-grove-gold/40"
                : "bg-grove-cream/15"
          }`}
          title={section.label}
        />
      ))}
    </div>
  );
}
