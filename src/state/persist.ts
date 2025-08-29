import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { STORAGE_KEY } from "@/constants";


export function loadState(): RootState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as RootState;
  } catch {
    return undefined;
  }
}

export function persistState(state: RootState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export const createPersistMiddleware = (wait = 300): Middleware<{}, RootState> => {
  let t: number | undefined;
  return (store) => (next) => (action) => {
    const res = next(action);
    if (typeof window !== "undefined") {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        persistState(store.getState());
      }, wait);
    }
    return res;
  };
};
