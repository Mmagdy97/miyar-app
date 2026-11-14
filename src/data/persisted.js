import { useSyncExternalStore } from "react";

// Tiny localStorage-backed store; same API shape as useState (supports functional updates).
// Swapped for Supabase queries later without touching the screens.
export function createPersistedStore(key, initial, view = (x) => x, { persist = true, onChange } = {}) {
  const listeners = new Set();
  let state;
  try {
    const raw = persist ? localStorage.getItem(key) : null;
    state = raw ? JSON.parse(raw) : initial;
  } catch {
    state = initial;
  }
  const emit = () => listeners.forEach((l) => l());
  const set = (next) => {
    const prev = state;
    state = typeof next === "function" ? next(state) : next;
    if (onChange && prev !== state) { try { onChange(prev, state); } catch { /* audit must never break a save */ } }
    try {
      if (persist) localStorage.setItem(key, JSON.stringify(state));
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
