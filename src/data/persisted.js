import { useSyncExternalStore } from "react";

// Tiny localStorage-backed store; same API shape as useState (supports functional updates).
// Swapped for Supabase queries later without touching the screens.
export function createPersistedStore(key, initial) {
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
  return {
    get,
    set,
    reset: () => set(initial),
    use: () => [useSyncExternalStore(subscribe, get), set],
  };
}
