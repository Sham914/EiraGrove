"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useAppState";
import { cinematicMoments } from "@/config/interactions.config";

export function CinematicMomentOverlay() {
  const progress = useScrollProgress();
  const reducedMotion = useReducedMotion();
  const shownRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<number | null>(null);
  const [active, setActive] = useState<{
    id: string;
    title: string;
    subtitle: string;
  } | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!active) return;

    const currentMoment = cinematicMoments.find((moment) => moment.id === active.id);
    if (
      !currentMoment ||
      progress < currentMoment.progressStart ||
      progress >= currentMoment.progressEnd
    ) {
      setActive(null);
      return;
    }

    for (const moment of cinematicMoments) {
      if (shownRef.current.has(moment.id)) continue;
      if (
        progress >= moment.progressStart &&
        progress < moment.progressStart + 0.04
      ) {
        shownRef.current.add(moment.id);
        setActive({
          id: moment.id,
          title: moment.title,
          subtitle: moment.subtitle,
        });
        timeoutRef.current = window.setTimeout(() => setActive(null), 2800);
        return;
      }
    }
  }, [progress, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={active.id}
          className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="px-6 text-center">
            <motion.p
              className="font-body mb-4 text-xs uppercase tracking-luxury text-grove-gold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {active.subtitle}
            </motion.p>
            <motion.h2
              className="font-display text-4xl font-light text-grove-cream md:text-6xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1 }}
            >
              {active.title}
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
