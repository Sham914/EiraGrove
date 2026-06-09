"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/hooks/useAppState";
import { interactionLocations } from "@/config/interactions.config";

export function LocationInfoPanel() {
  const { hoveredLocation, mode } = useAppState();

  const location = interactionLocations.find((l) => l.id === hoveredLocation);

  const visible = !!location && (mode === "explore" || hoveredLocation);

  return (
    <AnimatePresence>
      {visible && location && (
        <motion.div
          key={location.id}
          className="pointer-events-none fixed left-6 top-1/2 z-30 max-w-xs -translate-y-1/2 md:left-10"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body mb-2 text-xs uppercase tracking-luxury text-grove-gold">
            {location.label}
          </p>
          <h3 className="font-display mb-3 text-2xl font-light text-grove-cream">
            {location.headline}
          </h3>
          <p className="font-body text-sm leading-relaxed text-grove-cream/65">
            {location.description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
