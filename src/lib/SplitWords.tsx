import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function SplitWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  trigger = "scroll",
  duration = 1.6,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  trigger?: "scroll" | "immediate";
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".w");
    const base = { yPercent: 110, opacity: 0 };
    const to = { yPercent: 0, opacity: 1, duration, ease: "expo.out", stagger: 0.09, delay };
    if (trigger === "immediate") {
      gsap.fromTo(words, base, to);
    } else {
      gsap.fromTo(words, base, {
        ...to,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    }
  }, [delay, trigger, duration]);

  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <span className={`w inline-block will-change-transform ${wordClassName}`}>{w}</span>
        </span>
      ))}
    </span>
  );
}
