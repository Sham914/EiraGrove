"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/hooks/useAppState";
import { setAppMode, setAudioEnabled, setReducedMotion } from "@/store/app-store";
import { Volume2, VolumeX, Minimize2, Compass } from "lucide-react";

export function AccessibilityControls() {
  const { mode, audioEnabled, reducedMotion } = useAppState();

  return (
    <div className="pointer-events-auto fixed right-4 top-4 z-40 flex flex-col gap-2 md:right-6 md:top-6">
      <ControlButton
        label={audioEnabled ? "Mute ambience" : "Enable ambience"}
        onClick={() => setAudioEnabled(!audioEnabled)}
      >
        {audioEnabled ? (
          <Volume2 className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <VolumeX className="h-4 w-4" strokeWidth={1.5} />
        )}
      </ControlButton>
      <ControlButton
        label={reducedMotion ? "Enable motion" : "Reduce motion"}
        onClick={() => setReducedMotion(!reducedMotion)}
      >
        <Minimize2 className="h-4 w-4" strokeWidth={1.5} />
      </ControlButton>
      {mode === "explore" && (
        <ControlButton
          label="Return to journey"
          onClick={() => setAppMode("scroll")}
        >
          <Compass className="h-4 w-4" strokeWidth={1.5} />
        </ControlButton>
      )}
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-grove-cream/10 bg-grove-charcoal/70 text-grove-cream/70 backdrop-blur-md transition-colors hover:border-grove-gold/30 hover:text-grove-gold"
    >
      {children}
    </button>
  );
}

export function ExploreModeBanner() {
  const { mode } = useAppState();

  return (
    <AnimatePresence>
      {mode === "explore" && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-20 z-20 text-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs uppercase tracking-luxury text-grove-gold/80">
            Free Explore — drag to look · scroll to zoom
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
