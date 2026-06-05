"use client";

import { useEffect, useState } from "react";
import {
  getScrollProgress,
  subscribeScrollProgress,
} from "@/utils/scroll-store";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getScrollProgress());
    return subscribeScrollProgress(setProgress);
  }, []);

  return progress;
}
