import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const TRUST_LINES = [
  "Board-certified physicians review every case",
  "Prescriptions filled by licensed pharmacy partners",
  "HIPAA-aligned records · Secure checkout",
] as const;

export function TrustBridgeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = lineRefs.current.filter(Boolean) as HTMLParagraphElement[];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || lines.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(lines, { opacity: 0, y: 18 });
      gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-zone="bridge"
      className="trust-bridge px-5 py-10 md:px-8 md:py-12"
      aria-label="Why patients trust TIDL"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="trust-bridge-eyebrow text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "rgba(35,31,32,0.45)", fontFamily: "var(--font-sans)" }}
        >
          Physician-guided care you can trust
        </p>
        <p
          className="trust-bridge-lead mt-3 leading-[1.2] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.25rem, 3.2vw, 1.75rem)",
            fontWeight: 700,
            color: "#231f20",
          }}
        >
          Not a supplement order.{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400, color: "#f3c300" }}>
            A real medical pathway.
          </span>
        </p>
        <div className="trust-bridge-lines mx-auto mt-5 max-w-xl space-y-2">
          {TRUST_LINES.map((line, i) => (
            <p
              key={line}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="trust-bridge-line text-[0.8125rem] leading-relaxed sm:text-[0.875rem]"
              style={{ color: "rgba(35,31,32,0.62)", fontFamily: "var(--font-sans)" }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
