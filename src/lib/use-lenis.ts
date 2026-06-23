import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { markPageScrolling } from "@/lib/section-performance";
import { registerLenis, unregisterLenis } from "@/lib/lenis-store";

export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    registerLenis(lenis);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    let stQueued = false;

    const onLenisScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      markPageScrolling();

      if (!stQueued) {
        stQueued = true;
        requestAnimationFrame(() => {
          ScrollTrigger.update();
          stQueued = false;
        });
      }

      if (bar) {
        const p = scroll / (limit || 1);
        bar.style.transform = `scale3d(${Math.min(1, Math.max(0, p))}, 1, 1)`;
      }

      window.dispatchEvent(
        new CustomEvent("tidl:lenis-scroll", { detail: { scroll, limit } }),
      );
    };
    lenis.on("scroll", onLenisScroll);
    onLenisScroll({ scroll: lenis.scroll, limit: lenis.limit });

    const onScrollLock = (event: Event) => {
      const locked = (event as CustomEvent<{ locked: boolean }>).detail?.locked;
      if (locked) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("tidl:scroll-lock", onScrollLock);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    if (reducedMotion) {
      unregisterLenis(lenis);
      lenis.destroy();
      gsap.ticker.remove(raf);
      return () => {
        window.removeEventListener("tidl:scroll-lock", onScrollLock);
      };
    }

    return () => {
      window.removeEventListener("tidl:scroll-lock", onScrollLock);
      gsap.ticker.remove(raf);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      unregisterLenis(lenis);
      lenis.destroy();
    };
  }, []);
  return lenisRef;
}
