"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollProgress } from "@/utils/scroll-store";
import { getAppState, subscribeAppState } from "@/store/app-store";

gsap.registerPlugin(ScrollTrigger);

export function useCinematicScroll(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        if (getAppState().mode === "scroll") {
          setScrollProgress(self.progress);
        }
      },
    });

    const unsubApp = subscribeAppState(() => {
      if (getAppState().mode === "explore") {
        lenis.stop();
        trigger.disable();
      } else {
        lenis.start();
        trigger.enable();
      }
    });

    ScrollTrigger.refresh();
    setScrollProgress(0);

    return () => {
      unsubApp();
      trigger.kill();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [containerRef]);

  return lenisRef;
}
