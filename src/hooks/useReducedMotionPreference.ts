"use client";

import { useEffect } from "react";
import { setReducedMotion } from "@/store/app-store";

export function useReducedMotionPreference(): boolean {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return false;
}
