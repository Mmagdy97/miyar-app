import { useSyncExternalStore } from "react";

// Tiny localStorage-backed store; same API shape as useState (supports functional updates).
// Swapped for Supabase queries later without touching the screens.
export function createPersistedStore(key, initial, view = (x) => x) {
  const listeners = new Set();
  let state;
  try {
    const raw = localStorage.getItem(key);
    state = raw ? JSON.parse(raw) : initial;
  } catch {
    state = initial;
  }
  const emit = () => listeners.forEach((l) => l());
  const set = (next) => {
    state = typeof next === "function" ? next(state) : next;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage full/blocked: keep in-memory only */
    }
    emit();
  };
  const subscribe = (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const get = () => state;
  // Memoised localised view: stable identity per raw state (required by useSyncExternalStore).
  let lastRaw, lastView;
  const getView = () => {
    if (state !== lastRaw) { lastRaw = state; lastView = view(state); }
    return lastView;
  };
  return {
    get: getView,
    set,
    reset: () => set(initial),
    use: () => [useSyncExternalStore(subscribe, getView), set],
  };
}
