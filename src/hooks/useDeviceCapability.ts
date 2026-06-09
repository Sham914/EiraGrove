"use client";

import { useEffect, useState } from "react";

export type QualityTier = "high" | "medium" | "low";

export interface DeviceCapabilities {
  tier: QualityTier;
  treeCount: number;
  grassCount: number;
  bushCount: number;
  birdCount: number;
  cloudCount: number;
  terrainSegments: number;
  enableShadows: boolean;
  dpr: [number, number];
}

const CAPABILITIES: Record<QualityTier, Omit<DeviceCapabilities, "tier">> = {
  high: {
    treeCount: 120,
    grassCount: 800,
    bushCount: 60,
    birdCount: 12,
    cloudCount: 8,
    terrainSegments: 64,
    enableShadows: false,
    dpr: [1, 1.5],
  },
  medium: {
    treeCount: 70,
    grassCount: 400,
    bushCount: 35,
    birdCount: 8,
    cloudCount: 5,
    terrainSegments: 48,
    enableShadows: false,
    dpr: [1, 1.25],
  },
  low: {
    treeCount: 35,
    grassCount: 150,
    bushCount: 18,
    birdCount: 4,
    cloudCount: 3,
    terrainSegments: 32,
    enableShadows: false,
    dpr: [0.75, 1],
  },
};

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    /Mobi|Android/i.test(navigator.userAgent);
  const lowMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (isMobile) return lowMemory && lowMemory <= 4 ? "low" : "medium";
  return "high";
}

export function useDeviceCapability(): DeviceCapabilities {
  const [tier, setTier] = useState<QualityTier>("medium");

  useEffect(() => {
    setTier(detectTier());
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setTier(detectTier());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return { tier, ...CAPABILITIES[tier] };
}
