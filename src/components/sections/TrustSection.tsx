import { useEffect, useRef } from "react";
import { observeSectionVisibility } from "@/lib/section-performance";

const TRUST_ITEMS = [
  { icon: "🩺", label: "Physician reviewed" },
  { icon: "⚕️", label: "Licensed providers" },
  { icon: "🔒", label: "Secure checkout" },
  { icon: "🏥", label: "HIPAA compliant" },
  { icon: "📦", label: "Nationwide cold shipping" },
  { icon: "💳", label: "HSA / FSA accepted" },
  { icon: "🔐", label: "Private & encrypted" },
  { icon: "💊", label: "Licensed pharmacy partners" },
] as const;

export function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  const track = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    return observeSectionVisibility(
      section,
      () => section.classList.remove("trust--paused"),
      () => section.classList.add("trust--paused"),
    );
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-surface py-3" aria-label="Trust indicators">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20"
        style={{ background: "linear-gradient(to right, var(--color-surface, #f5f5f3), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20"
        style={{ background: "linear-gradient(to left, var(--color-surface, #f5f5f3), transparent)" }}
      />

      <div className="trust-track flex w-max gap-0" style={{ animation: "trustMarquee 32s linear infinite" }}>
        {track.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 px-5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/55"
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
            <span className="mx-3 text-ink/20">·</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes trustMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .trust--paused .trust-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-track {
            animation: none !important;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
            row-gap: 0.25rem;
          }
        }
      `}</style>
    </section>
  );
}
