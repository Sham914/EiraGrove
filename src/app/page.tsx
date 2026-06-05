"use client";

import dynamic from "next/dynamic";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { AllSections } from "@/sections";
import { IntroHero } from "@/sections/IntroHero";
import { CtaPanel } from "@/sections/CtaPanel";

const SceneViewport = dynamic(
  () =>
    import("@/components/SceneViewport").then((m) => ({
      default: m.SceneViewport,
    })),
  { ssr: false }
);

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-grove-night">
      <SmoothScrollProvider>
        <SceneViewport />
        <div className="pointer-events-none fixed inset-0 z-10">
          <IntroHero />
          <AllSections />
          <CtaPanel />
        </div>
        <ScrollProgressBar />
      </SmoothScrollProvider>
    </main>
  );
}
