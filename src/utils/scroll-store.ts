export type ScrollProgressListener = (progress: number) => void;

let globalProgress = 0;
const listeners = new Set<ScrollProgressListener>();

export function getScrollProgress(): number {
  return globalProgress;
}

export function setScrollProgress(progress: number): void {
  globalProgress = Math.min(1, Math.max(0, progress));
  listeners.forEach((listener) => listener(globalProgress));
}

export function subscribeScrollProgress(
  listener: ScrollProgressListener
): () => void {
  listeners.add(listener);
  listener(globalProgress);
  return () => listeners.delete(listener);
}
