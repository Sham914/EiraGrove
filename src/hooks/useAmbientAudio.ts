"use client";

import { useEffect } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useAppState } from "@/hooks/useAppState";
import { getAmbientEngine } from "@/audio/AmbientAudioEngine";
import { setExplorePromptVisible } from "@/store/app-store";
import { smoothstep } from "@/utils/math";

export function useAmbientAudio() {
  const progress = useScrollProgress();
  const { audioEnabled, mode } = useAppState();

  useEffect(() => {
    const engine = getAmbientEngine();
    const startAudio = () => {
      engine.start().then(() => engine.setEnabled(audioEnabled));
    };

    window.addEventListener("pointerdown", startAudio, { once: true });
    return () => window.removeEventListener("pointerdown", startAudio);
  }, [audioEnabled]);

  useEffect(() => {
    const engine = getAmbientEngine();
    engine.setEnabled(audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    getAmbientEngine().updateMix(mode === "explore" ? 0.85 : progress);
  }, [progress, mode]);

  useEffect(() => {
    const shouldShow = smoothstep(0.9, 0.97, progress) > 0.1;
    setExplorePromptVisible(shouldShow);
  }, [progress]);
}
