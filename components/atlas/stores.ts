"use client";

import { useEffect, useSyncExternalStore } from "react";

// Tiny external stores for the atlas: the URL hash (which place is open),
// the places a visitor has explored, and media queries. Using
// useSyncExternalStore keeps server and client renders consistent.

// --- URL hash ---------------------------------------------------------------

const HASH_EVENT = "atlas:hash";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}

export function useHash() {
  return useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );
}

/** Changes the hash without scrolling the page, then notifies subscribers. */
export function setHash(slug: string | null, mode: "push" | "replace") {
  const url = slug
    ? `#${slug}`
    : `${window.location.pathname}${window.location.search}`;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(HASH_EVENT));
}

// --- Explored places ----------------------------------------------------------

const VISITED_KEY = "atlas:visited";
const NONE: string[] = [];
const visitedListeners = new Set<() => void>();
let visitedCache: string[] | null = null;

function loadVisited(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : NONE;
  } catch {
    // Storage can be blocked (private mode, strict settings). Fog still works
    // for this visit; it just won't be remembered.
    return NONE;
  }
}

function getVisited() {
  if (visitedCache === null) visitedCache = loadVisited();
  return visitedCache;
}

function saveVisited(list: string[]) {
  visitedCache = list;
  try {
    if (list.length) localStorage.setItem(VISITED_KEY, JSON.stringify(list));
    else localStorage.removeItem(VISITED_KEY);
  } catch {
    // See loadVisited.
  }
  visitedListeners.forEach((listener) => listener());
}

function subscribeVisited(onChange: () => void) {
  visitedListeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== VISITED_KEY) return;
    visitedCache = null;
    onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    visitedListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useVisited() {
  return useSyncExternalStore(subscribeVisited, getVisited, () => NONE);
}

export function markVisited(slug: string) {
  const current = getVisited();
  if (!current.includes(slug)) saveVisited([...current, slug]);
}

export function resetVisited() {
  saveVisited(NONE);
}

// --- Media queries ------------------------------------------------------------

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// --- Hydration ----------------------------------------------------------------

const noop = () => () => {};

/** False during server render and hydration, true once running in the browser. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

// --- One-time discovery toast -------------------------------------------------

const TOAST_KEY = "atlas:discovered";
let toastDecision: boolean | null = null;

function shouldShowToast() {
  if (toastDecision === null) {
    try {
      toastDecision = sessionStorage.getItem(TOAST_KEY) === null;
      sessionStorage.setItem(TOAST_KEY, "1");
    } catch {
      toastDecision = true;
    }
  }
  return toastDecision;
}

/** After the card has played, don't show it again when returning to the map. */
function retireToast() {
  toastDecision = false;
}

export function useShowDiscovery() {
  const show = useSyncExternalStore(noop, shouldShowToast, () => false);
  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(retireToast, 5000);
    return () => window.clearTimeout(timer);
  }, [show]);
  return show;
}
