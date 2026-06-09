export type AppMode = "scroll" | "explore";
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
  reducedMotion: boolean;
  fallbackMode: boolean;
  hoveredLocation: LocationId;
  audioEnabled: boolean;
  explorePromptVisible: boolean;
}

let state: AppState = {
  mode: "scroll",
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

export function setReducedMotion(reduced: boolean): void {
  state = { ...state, reducedMotion: reduced };
  notify();
}

export function setFallbackMode(fallback: boolean): void {
  state = { ...state, fallbackMode: fallback };
  notify();
}

export function setHoveredLocation(id: LocationId): void {
  if (state.hoveredLocation === id) return;
  state = { ...state, hoveredLocation: id };
  notify();
}

export function setAudioEnabled(enabled: boolean): void {
  state = { ...state, audioEnabled: enabled };
  notify();
}

export function setExplorePromptVisible(visible: boolean): void {
  state = { ...state, explorePromptVisible: visible };
  notify();
}

export function enterExploreMode(): void {
  state = {
    ...state,
    mode: "explore",
    explorePromptVisible: false,
  };
  notify();
}
