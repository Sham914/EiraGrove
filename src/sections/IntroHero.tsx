"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { smoothstep } from "@/utils/math";

export function IntroHero() {
  const progress = useScrollProgress();
  const opacity = 1 - smoothstep(0, 0.08, progress);

  if (opacity <= 0.01) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity }}
    >
      <p className="font-body mb-6 text-xs uppercase tracking-luxury text-grove-gold md:text-sm">
        {siteConfig.location}
      </p>
      <h1 className="font-display text-5xl font-light tracking-wide text-grove-cream md:text-8xl">
        {siteConfig.name}
      </h1>
      <p className="font-body mt-6 max-w-md text-center text-sm text-grove-cream/60 md:text-base">
        {siteConfig.tagline}
      </p>
      <div className="absolute bottom-12 animate-pulse">
        <ChevronDown className="h-6 w-6 text-grove-gold/50" strokeWidth={1} />
      </div>
    </motion.div>
  );
}
