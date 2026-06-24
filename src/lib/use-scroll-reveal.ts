import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Global scroll reveal.
 *
 * Any element with [data-reveal] in the DOM starts hidden (y: 56, opacity: 0)
 * and animates in smoothly once it enters the viewport.
 *
 * Works with lazily-mounted elements via MutationObserver.
 * Honours prefers-reduced-motion.
 */
export function useGlobalScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instances: ScrollTrigger[] = [];

    const setup = (el: HTMLElement) => {
      if (el.dataset.revealReady === "1") return;
      el.dataset.revealReady = "1";

      gsap.set(el, { opacity: 0, y: 56, willChange: "opacity, transform" });

      const reveal = () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "expo.out",
          clearProps: "willChange",
          overwrite: "auto",
        });
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: reveal,
      });
      instances.push(st);

      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        reveal();
      }
    };

    // Elements already in the DOM
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(setup);

    // Catch lazily-mounted elements (Suspense boundaries resolving)
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]")) setup(node);
          node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(setup);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      instances.forEach((st) => st.kill());
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        delete el.dataset.revealReady;
        gsap.set(el, { clearProps: "opacity,y,willChange" });
      });
    };
  }, []);
}
