"use client";

import { useEffect, useState } from "react";
import {
  getAppState,
  subscribeAppState,
  type AppMode,
  type LocationId,
} from "@/store/app-store";

export function useAppState() {
  const [appState, setAppState] = useState(getAppState);

  useEffect(() => subscribeAppState(() => setAppState(getAppState())), []);

  return appState;
}

export function useAppMode(): AppMode {
  return useAppState().mode;
}

export function useReducedMotion(): boolean {
  return useAppState().reducedMotion;
}

export function useHoveredLocation(): LocationId {
  return useAppState().hoveredLocation;
}
