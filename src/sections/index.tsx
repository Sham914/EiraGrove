"use client";

import { SectionOverlay } from "@/components/SectionOverlay";
import { sectionsConfig } from "@/config/sections.config";
import type { SectionConfig } from "@/config/sections.config";
import { useScrollProgress } from "@/hooks/useScrollProgress";

function SectionLayer({ section }: { section: SectionConfig }) {
  const progress = useScrollProgress();
  return <SectionOverlay section={section} globalProgress={progress} />;
}

export function MountainRevealSection() {
  return <SectionLayer section={sectionsConfig[0]} />;
}

export function ApproachEntranceSection() {
  return <SectionLayer section={sectionsConfig[1]} />;
}

export function ReceptionSection() {
  return <SectionLayer section={sectionsConfig[2]} />;
}

export function LandscapePathwaysSection() {
  return <SectionLayer section={sectionsConfig[3]} />;
}

export function PrivateCottagesSection() {
  return <SectionLayer section={sectionsConfig[4]} />;
}

export function InfinityPoolSection() {
  return <SectionLayer section={sectionsConfig[5]} />;
}

export function LuxuryVillaSection() {
  return <SectionLayer section={sectionsConfig[6]} />;
}

export function AerialMasterplanSection() {
  return <SectionLayer section={sectionsConfig[7]} />;
}

export function AllSections() {
  return (
    <>
      {sectionsConfig.map((section) => (
        <SectionLayer key={section.id} section={section} />
      ))}
    </>
  );
}
