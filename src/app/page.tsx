"use client";

import dynamic from "next/dynamic";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { AllSections } from "@/sections";
import { IntroHero } from "@/sections/IntroHero";
import { FinalCtaPanel } from "@/components/FinalCtaPanel";
import { LocationInfoPanel } from "@/components/LocationInfoPanel";
import { CinematicMomentOverlay } from "@/components/CinematicMomentOverlay";
import {
  AccessibilityControls,
  ExploreModeBanner,
} from "@/components/AccessibilityControls";
import { WebGLErrorBoundary } from "@/components/WebGLErrorBoundary";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useAppMode } from "@/hooks/useAppState";

const SceneViewport = dynamic(
  () =>
    import("@/components/SceneViewport").then((m) => ({
      default: m.SceneViewport,
    })),
  { ssr: false }
);

function ExperienceShell() {
  useReducedMotionPreference();
  useAmbientAudio();
  const mode = useAppMode();

  return (
    <>
      <WebGLErrorBoundary>
        <SceneViewport />
      </WebGLErrorBoundary>
      <div
        className={`fixed inset-0 z-10 ${mode === "explore" ? "pointer-events-none" : ""}`}
      >
        <IntroHero />
        {mode === "scroll" && <AllSections />}
        <CinematicMomentOverlay />
        <FinalCtaPanel />
        <LocationInfoPanel />
      </div>
      <ExploreModeBanner />
      <AccessibilityControls />
      {mode === "scroll" && <ScrollProgressBar />}
    </>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-grove-night">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grove-night"
      />
      <SmoothScrollProvider>
        <ExperienceShell />
      </SmoothScrollProvider>
    </main>
  );
}
