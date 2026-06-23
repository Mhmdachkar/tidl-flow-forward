import { gsap } from "@/lib/gsap";

/** GSAP quickTo helper — single-axis tilt avoids rotateX/rotateY reset warnings. */
export function createTiltQuickTo(
  element: Element,
  duration = 0.35,
  ease: string = "power2.out",
) {
  const rotateY = gsap.quickTo(element, "rotateY", { duration, ease });

  return {
    rotateY,
    /** @deprecated Use rotateY only — kept for call-site compatibility */
    rotateX: (_value: number) => undefined,
    reset() {
      rotateY(0);
    },
  };
}

export function createAxisQuickTo(
  element: Element,
  prop: "x" | "y" | "z",
  duration = 0.5,
  ease: string = "power3.out",
) {
  return gsap.quickTo(element, prop, { duration, ease });
}
