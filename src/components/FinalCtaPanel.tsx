"use client";

import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site.config";
import { useAppState } from "@/hooks/useAppState";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { enterExploreMode } from "@/store/app-store";
import { MessageCircle, Compass } from "lucide-react";
import { smoothstep } from "@/utils/math";

export function FinalCtaPanel() {
  const { mode } = useAppState();
  const progress = useScrollProgress();
  const explorePromptVisible = smoothstep(0.9, 0.97, progress) > 0.1;

  if (mode === "explore") return null;

  return (
    <AnimatePresence>
      {explorePromptVisible && (
        <motion.div
          className="pointer-events-auto fixed inset-x-0 bottom-0 z-30 flex flex-col items-center px-6 pb-10 md:pb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body mb-2 text-xs uppercase tracking-luxury text-grove-gold">
            {siteConfig.cta.explore}
          </p>
          <h2 className="font-display mb-2 text-center text-3xl font-light text-grove-cream md:text-4xl">
            {siteConfig.cta.reserveHeadline}
          </h2>
          <p className="font-body mb-4 max-w-md text-center text-sm text-grove-cream/60">
            {siteConfig.cta.reserveSubheadline}
          </p>
          <div className="mb-8 inline-block rounded-full border border-grove-gold/30 bg-grove-gold/10 px-4 py-1.5 text-xs tracking-[0.2em] text-grove-gold uppercase">
            Coming Soon
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <WhatsAppCta />
            <ExploreCta />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhatsAppCta() {
  const { whatsapp, cta } = siteConfig;
  const href = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-3 rounded-full border border-grove-gold bg-grove-gold/10 px-8 py-4 font-body text-sm uppercase tracking-luxury text-grove-cream backdrop-blur-md transition-all duration-500 hover:bg-grove-gold/20"
    >
      <MessageCircle className="h-5 w-5 text-grove-gold" strokeWidth={1.5} />
      {cta.primary}
    </a>
  );
}

function ExploreCta() {
  return (
    <button
      type="button"
      onClick={() => enterExploreMode()}
      className="inline-flex items-center justify-center gap-3 rounded-full border border-grove-cream/20 bg-grove-charcoal/60 px-8 py-4 font-body text-sm uppercase tracking-luxury text-grove-cream/90 backdrop-blur-md transition-all duration-500 hover:border-grove-gold/40 hover:text-grove-cream"
    >
      <Compass className="h-5 w-5 text-grove-gold" strokeWidth={1.5} />
      {siteConfig.cta.secondary}
    </button>
  );
}
