"use client";

import { useEffect, useState } from "react";
import {
  getSectionByProgress,
  getSectionProgress,
  type SectionConfig,
} from "@/config/sections.config";
import { useScrollProgress } from "./useScrollProgress";

export function useActiveSection(): {
  section: SectionConfig;
  sectionProgress: number;
  globalProgress: number;
} {
  const globalProgress = useScrollProgress();
  const [section, setSection] = useState<SectionConfig>(() =>
    getSectionByProgress(0)
  );
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const active = getSectionByProgress(globalProgress);
    setSection(active);
    setSectionProgress(getSectionProgress(globalProgress, active));
  }, [globalProgress]);

  return { section, sectionProgress, globalProgress };
}
