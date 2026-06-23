import type Lenis from "lenis";

let activeLenis: Lenis | null = null;

export function registerLenis(instance: Lenis) {
  activeLenis = instance;
}

export function unregisterLenis(instance: Lenis) {
  if (activeLenis === instance) activeLenis = null;
}

export function hasLenis() {
  return activeLenis !== null;
}

export function getScrollPosition() {
  return activeLenis ? activeLenis.scroll : window.scrollY;
}
