export type AppMode = "scroll" | "explore";
export type ExploreVisionMode = "night" | "day";
export type LocationId =
  | "infinity-pool"
  | "private-villas"
  | "nature-walks"
  | "mountain-views"
  | "reception"
  | "romance-zones"
  | null;

type Listener = () => void;

interface AppState {
  mode: AppMode;
  exploreVisionMode: ExploreVisionMode;
  reducedMotion: boolean;
  fallbackMode: boolean;
  hoveredLocation: LocationId;
  audioEnabled: boolean;
  explorePromptVisible: boolean;
}

let state: AppState = {
  mode: "scroll",
  exploreVisionMode: "night",
  reducedMotion: false,
  fallbackMode: false,
  hoveredLocation: null,
  audioEnabled: true,
  explorePromptVisible: false,
};

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function getAppState(): Readonly<AppState> {
  return state;
}

export function subscribeAppState(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAppMode(mode: AppMode): void {
  if (state.mode === mode) return;
  state = { ...state, mode };
  notify();
}

export function setExploreVisionMode(
  exploreVisionMode: ExploreVisionMode
): void {
  if (state.exploreVisionMode === exploreVisionMode) return;
  state = { ...state, exploreVisionMode };
  notify();
}

export function setReducedMotion(reduced: boolean): void {
  if (state.reducedMotion === reduced) return;
  state = { ...state, reducedMotion: reduced };
  notify();
}

export function setFallbackMode(fallback: boolean): void {
  if (state.fallbackMode === fallback) return;
  state = { ...state, fallbackMode: fallback };
  notify();
}

export function setHoveredLocation(id: LocationId): void {
  if (state.hoveredLocation === id) return;
  state = { ...state, hoveredLocation: id };
  notify();
}

export function setAudioEnabled(enabled: boolean): void {
  if (state.audioEnabled === enabled) return;
  state = { ...state, audioEnabled: enabled };
  notify();
}

export function setExplorePromptVisible(visible: boolean): void {
  if (state.explorePromptVisible === visible) return;
  state = { ...state, explorePromptVisible: visible };
  notify();
}

export function enterExploreMode(): void {
  state = {
    ...state,
    mode: "explore",
    exploreVisionMode: "night",
    explorePromptVisible: false,
  };
  notify();
}
