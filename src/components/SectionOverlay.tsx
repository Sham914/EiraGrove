"use client";

import { motion } from "framer-motion";
import type { SectionConfig } from "@/config/sections.config";
import { getSectionProgress } from "@/config/sections.config";

interface SectionOverlayProps {
  section: SectionConfig;
  globalProgress: number;
}

export function SectionOverlay({
  section,
  globalProgress,
}: SectionOverlayProps) {
  const localProgress = getSectionProgress(globalProgress, section);
  const isActive =
    globalProgress >= section.scrollStart &&
    globalProgress < section.scrollEnd;

  const fadeIn = Math.min(1, localProgress * 3);
  const fadeOut = Math.min(1, (1 - localProgress) * 3);
  const opacity = isActive ? Math.min(fadeIn, fadeOut) : 0;

  if (opacity <= 0.01) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity }}
      initial={false}
    >
      {section.subheadline && (
        <p className="font-body mb-4 text-xs uppercase tracking-luxury text-grove-gold/80 md:text-sm">
          {section.subheadline}
        </p>
      )}
      {section.headline && (
        <h2 className="font-display mb-6 max-w-3xl text-4xl font-light leading-tight text-grove-cream md:text-6xl lg:text-7xl">
          {section.headline}
        </h2>
      )}
      {section.body && (
        <p className="font-body max-w-lg text-sm leading-relaxed text-grove-cream/70 md:text-base">
          {section.body}
        </p>
      )}
    </motion.div>
  );
}
