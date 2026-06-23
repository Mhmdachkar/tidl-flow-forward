/** Pause expensive section animations when off-screen or while scrolling. */

import { useEffect, useState, type RefObject } from "react";

let pageScrolling = false;
let pageScrollTimer = 0;

export function markPageScrolling() {
  pageScrolling = true;
  document.documentElement.classList.add("tidl-scrolling");
  window.clearTimeout(pageScrollTimer);
  pageScrollTimer = window.setTimeout(() => {
    pageScrolling = false;
    document.documentElement.classList.remove("tidl-scrolling");
  }, 140);
}

export function isPageScrolling() {
  return pageScrolling;
}

export function observeSectionVisibility(
  el: HTMLElement,
  onVisible: () => void,
  onHidden: () => void,
) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) onVisible();
      else onHidden();
    },
    { rootMargin: "100px 0px", threshold: 0.01 },
  );
  observer.observe(el);
  return () => observer.disconnect();
}

export function canUseHoverParallax() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function createScrollGate() {
  const onScroll = () => markPageScrolling();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("tidl:lenis-scroll", onScroll, { passive: true });
  return {
    isScrolling: () => pageScrolling,
    dispose: () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("tidl:lenis-scroll", onScroll);
    },
  };
}

export function rafThrottle<T extends unknown[]>(fn: (...args: T) => void) {
  let scheduled = false;
  let lastArgs: T | null = null;

  return (...args: T) => {
    lastArgs = args;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (lastArgs) fn(...lastArgs);
    });
  };
}

/** Intersection only — no scroll listeners (avoids re-renders during scroll). */
export function useSectionInView(
  ref: RefObject<HTMLElement | null>,
  options?: { rootMargin?: string; threshold?: number },
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        rootMargin: options?.rootMargin ?? "120px 0px",
        threshold: options?.threshold ?? 0.05,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.rootMargin, options?.threshold]);

  return inView;
}

/** Gate Framer Motion loops — pause while off-screen. Scroll pausing uses `html.tidl-scrolling` CSS. */
export function useMotionActive(ref: RefObject<HTMLElement | null>) {
  const inView = useSectionInView(ref);
  return { inView, scrolling: isPageScrolling(), active: inView };
}
