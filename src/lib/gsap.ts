import gsap from "gsap";
import ScrollTriggerImport from "gsap/ScrollTrigger";

type ScrollTriggerPlugin = typeof import("gsap/ScrollTrigger").ScrollTrigger;

function resolveScrollTrigger(mod: unknown): ScrollTriggerPlugin {
  if (typeof mod === "function") {
    return mod as ScrollTriggerPlugin;
  }

  if (mod && typeof mod === "object") {
    const candidate =
      (mod as { default?: unknown }).default ??
      (mod as { ScrollTrigger?: unknown }).ScrollTrigger;

    if (typeof candidate === "function") {
      return candidate as ScrollTriggerPlugin;
    }
  }

  throw new Error("Failed to resolve gsap/ScrollTrigger");
}

const ScrollTrigger = resolveScrollTrigger(ScrollTriggerImport);

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
