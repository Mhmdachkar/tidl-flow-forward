import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    lenis.on("scroll", ScrollTrigger.update);

    // Scroll progress bar — driven by Lenis, not a duplicate window listener
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      if (!bar) return;
      const p = scroll / (limit || 1);
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    lenis.on("scroll", onScroll);
    onScroll({ scroll: lenis.scroll, limit: lenis.limit });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);
  return lenisRef;
}
