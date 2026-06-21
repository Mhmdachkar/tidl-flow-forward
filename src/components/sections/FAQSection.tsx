import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    id: 0,
    q: "How does the prescription process work?",
    a: "You complete a secure medical assessment. A licensed physician reviews your information and determines whether treatment is appropriate. If prescribed, a licensed pharmacy prepares your medication and ships it directly to your door. You are never charged for medication you are not prescribed.",
  },
  {
    id: 1,
    q: "Is approval guaranteed?",
    a: "No. Treatment eligibility is determined by a licensed physician based on your medical history and assessment. TIDL never guarantees prescriptions. If a physician determines treatment is not appropriate for you, you will be informed and not charged for medication.",
  },
  {
    id: 2,
    q: "Who reviews my assessment?",
    a: "Every assessment is reviewed by a board-certified physician — not an algorithm, not AI, not a chatbot. Medical questions are escalated to the physician team. No automated system makes prescription decisions.",
  },
  {
    id: 3,
    q: "How long does physician review take?",
    a: "Most assessments are reviewed within 24 hours. Once approved, your prescription is sent directly to our licensed pharmacy network for preparation and dispatch.",
  },
  {
    id: 4,
    q: "Where is my medication prepared?",
    a: "All medication is prepared by licensed pharmacy partners — never a third-party warehouse. Compounded treatments are produced in USP 797 and USP 795 compliant facilities under sterile conditions.",
  },
  {
    id: 5,
    q: "How does shipping work?",
    a: "Once your prescription is ready, your medication ships within 48–72 hours. Temperature-sensitive treatments are sealed with validated cold-pack insulation. All orders ship in discreet outer packaging with no medical branding visible on the outside. Live tracking is available in your account.",
  },
  {
    id: 6,
    q: "What states are supported?",
    a: "TIDL's physician network is licensed across 50 U.S. states. State-specific treatment availability may vary. Your eligibility for specific treatments is confirmed during the physician review process.",
  },
  {
    id: 7,
    q: "Is my health information private?",
    a: "Yes. TIDL is fully HIPAA-compliant. Your medical information is stored securely within our clinical platform and is never sold, shared with advertisers, or used for marketing purposes. Medical signals are strictly protected and never sent to advertising platforms.",
  },
  {
    id: 8,
    q: "Does HSA or FSA cover TIDL treatments?",
    a: "Many prescription treatments may be eligible for HSA or FSA payment. TIDL supports HSA and FSA cards at checkout. Check with your benefits provider to confirm eligibility for your specific plan.",
  },
  {
    id: 9,
    q: "What happens after my first order?",
    a: "You receive a welcome message and, when your order ships, a how-to guide for safe use of your treatment. Your care team is available for follow-up, refill coordination, and any questions. Reorders can be placed through your account or by text.",
  },
] as const;

// ─── Icon: Plus / Minus ────────────────────────────────────────────────────────

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center"
      style={{
        border: "1px solid rgba(22,22,22,0.15)",
        borderRadius: 4,
        color: open ? "#2d4a3e" : "#161616",
        transition: "color 0.3s, border-color 0.3s",
        borderColor: open ? "rgba(45,74,62,0.35)" : "rgba(22,22,22,0.15)",
      }}
      aria-hidden
    >
      {/* horizontal bar always visible */}
      <span
        className="absolute"
        style={{
          width: 10, height: 1.2,
          background: "currentColor",
          borderRadius: 1,
        }}
      />
      {/* vertical bar fades / rotates out when open */}
      <span
        className="absolute transition-all duration-300"
        style={{
          width: 1.2, height: 10,
          background: "currentColor",
          borderRadius: 1,
          transform: open ? "scaleY(0) rotate(90deg)" : "scaleY(1) rotate(0deg)",
          opacity: open ? 0 : 1,
        }}
      />
    </span>
  );
}

// ─── Single FAQ item ──────────────────────────────────────────────────────────

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
  itemRef,
}: {
  item: (typeof FAQS)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  itemRef: (el: HTMLDivElement | null) => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;

    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: el.scrollHeight, opacity: 1, duration: 0.55, ease: "expo.out",
          onComplete: () => { el.style.height = "auto"; } },
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
    }

    if (lineRef.current) {
      gsap.to(lineRef.current, {
        scaleY: isOpen ? 1 : 0,
        duration: isOpen ? 0.55 : 0.35,
        ease: isOpen ? "expo.out" : "power3.in",
      });
    }
  }, [isOpen]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div ref={itemRef} className="will-change-transform">
      <button
        className="group relative w-full text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {/* active left-edge line */}
        <span
          ref={lineRef}
          className="absolute left-0 top-0 w-[2px] origin-top"
          style={{
            height: "100%",
            background: "#2d4a3e",
            transform: "scaleY(0)",
          }}
        />

        <div className="flex items-start gap-5 px-5 py-6">
          {/* ghost number */}
          <span
            aria-hidden
            className="flex-shrink-0 leading-none transition-colors duration-300"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: "clamp(28px, 2.8vw, 40px)",
              color: isOpen ? "#2d4a3e" : "rgba(22,22,22,0.1)",
              letterSpacing: "-0.02em",
              minWidth: 48,
            }}
          >
            {num}
          </span>

          {/* question */}
          <span
            className="flex-1 pt-1 transition-colors duration-200"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: "clamp(16px, 1.6vw, 21px)",
              color: isOpen ? "#161616" : "rgba(22,22,22,0.78)",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {item.q}
          </span>

          {/* icon */}
          <PlusMinusIcon open={isOpen} />
        </div>
      </button>

      {/* answer panel */}
      <div
        ref={answerRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
        aria-hidden={!isOpen}
      >
        <p
          className="px-5 pb-7 pl-[calc(1.25rem+48px+1.25rem)]"
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(22,22,22,0.62)",
            maxWidth: 680,
          }}
        >
          {item.a}
        </p>
      </div>

      {/* hairline separator */}
      <div className="mx-5" style={{ height: 1, background: "rgba(22,22,22,0.08)" }} />
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FAQSection() {
  const rootRef   = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const headRef   = useRef<HTMLDivElement | null>(null);
  const itemEls   = useRef<(HTMLDivElement | null)[]>([]);

  const [openId, setOpenId] = useState<number | null>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ── cursor spotlight ──────────────────────────────────────────────
      const cur = cursorRef.current;
      if (cur) {
        const qx = gsap.quickTo(cur, "x", { duration: 0.9, ease: "power3.out" });
        const qy = gsap.quickTo(cur, "y", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = root.getBoundingClientRect();
          qx(e.clientX - r.left - 220);
          qy(e.clientY - r.top  - 220);
        };
        root.addEventListener("mousemove", onMove);
      }

      if (reduced) return;

      // ── headline word reveal ──────────────────────────────────────────
      const words = headRef.current?.querySelectorAll<HTMLElement>(".fq-w");
      if (words?.length) {
        gsap.set(words, { yPercent: 115, opacity: 0 });
        gsap.to(words, {
          yPercent: 0, opacity: 1,
          duration: 1.0, ease: "expo.out",
          stagger: 0.055,
          scrollTrigger: { trigger: headRef.current, start: "top 82%" },
        });
      }

      // ── eyebrow line grow ─────────────────────────────────────────────
      const eLine = root.querySelector<HTMLElement>(".fq-eyebrow-line");
      if (eLine) {
        gsap.set(eLine, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(eLine, {
          scaleX: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: eLine, start: "top 90%" },
        });
      }

      // ── FAQ items stagger from alternating directions ──────────────────
      itemEls.current.forEach((el, i) => {
        if (!el) return;
        const fromLeft = i % 2 === 0;
        gsap.set(el, { x: fromLeft ? -60 : 60, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          onEnter: () => {
            gsap.to(el, {
              x: 0, opacity: 1,
              duration: 0.9, delay: (i % 3) * 0.04,
              ease: "expo.out",
            });
          },
        });
      });

      // ── closing statement reveal ──────────────────────────────────────
      const closing = root.querySelector<HTMLElement>(".fq-closing");
      if (closing) {
        gsap.set(closing, { opacity: 0, y: 40 });
        gsap.to(closing, {
          opacity: 1, y: 0, duration: 1.0, ease: "expo.out",
          scrollTrigger: { trigger: closing, start: "top 88%" },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  function handleToggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function Word({ text }: { text: string }) {
    return (
      <>
        {text.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
            <span className="fq-w inline-block">{w}</span>
          </span>
        ))}
      </>
    );
  }

  return (
    <section
      ref={rootRef}
      aria-label="Frequently asked questions"
      className="relative overflow-hidden"
      style={{ background: "#f6f3ec", color: "#161616", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* cursor spotlight */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{
          width: 440, height: 440,
          background: "radial-gradient(circle, rgba(45,74,62,0.06) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #161616 1px, transparent 1px), linear-gradient(to bottom, #161616 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1360px] px-8 pt-24 pb-28 sm:px-10 lg:px-16">

        {/* ── header ─────────────────────────────────────────────────── */}
        <div className="mb-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.6fr]">

          {/* left — sticky headline */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* eyebrow */}
            <div className="mb-10 flex items-center gap-4">
              <span
                className="fq-eyebrow-line h-px w-10 flex-shrink-0"
                style={{ background: "#2d4a3e" }}
              />
              <span
                className="text-[11px] font-medium uppercase"
                style={{ letterSpacing: "0.32em", color: "#2d4a3e" }}
              >
                §06 — Questions
              </span>
            </div>

            <div ref={headRef}>
              <h2
                className="leading-[0.9]"
                style={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: "clamp(42px, 5.5vw, 80px)",
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                }}
              >
                <span className="block overflow-hidden pb-[0.05em]">
                  <Word text="Everything" />
                </span>
                <span className="block overflow-hidden pb-[0.05em] italic" style={{ color: "#2d4a3e" }}>
                  <Word text="you need" />
                </span>
                <span className="block overflow-hidden pb-[0.05em]">
                  <Word text="to know." />
                </span>
              </h2>
            </div>

            {/* sub copy */}
            <p
              className="mt-8 max-w-xs"
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(22,22,22,0.55)",
              }}
            >
              Prescription treatment involves real physicians and licensed pharmacies.
              Here is what to expect at every step.
            </p>

            {/* contact line */}
            <div
              className="mt-10 flex items-center gap-4 pt-8"
              style={{ borderTop: "1px solid rgba(22,22,22,0.1)" }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center"
                style={{
                  border: "1px solid rgba(45,74,62,0.3)",
                  borderRadius: 4,
                  background: "rgba(45,74,62,0.05)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M2 4.5C2 3.4 2.9 2.5 4 2.5h6c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-5z"
                    stroke="#2d4a3e" strokeWidth="1.1" fill="none"
                  />
                  <path d="M2 5l5 3.5L12 5" stroke="#2d4a3e" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium" style={{ color: "#161616" }}>
                  Still have questions?
                </p>
                <p className="text-[11px]" style={{ color: "rgba(22,22,22,0.5)" }}>
                  Medical questions go to a physician — never a bot.
                </p>
              </div>
            </div>
          </div>

          {/* right — accordion */}
          <div
            className="overflow-hidden"
            style={{
              border: "1px solid rgba(22,22,22,0.1)",
              borderRadius: 8,
              background: "rgba(250,249,246,0.7)",
            }}
          >
            {/* top hairline accent */}
            <div style={{ height: 2, background: "#2d4a3e" }} />

            {/* count label */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid rgba(22,22,22,0.08)" }}
            >
              <span
                className="text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.28em", color: "rgba(22,22,22,0.4)" }}
              >
                {FAQS.length} questions
              </span>
              <span
                className="text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.28em", color: "#2d4a3e" }}
              >
                TIDL · Clinical FAQ
              </span>
            </div>

            {/* FAQ items */}
            {FAQS.map((item, i) => (
              <FAQItem
                key={item.id}
                item={item}
                index={i}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
                itemRef={(el) => { itemEls.current[i] = el; }}
              />
            ))}

            {/* bottom disclaimer */}
            <div
              className="px-5 py-4"
              style={{ borderTop: "1px solid rgba(22,22,22,0.08)" }}
            >
              <p
                className="text-[11px]"
                style={{ color: "rgba(22,22,22,0.4)", lineHeight: 1.6 }}
              >
                Treatment eligibility is determined solely by a licensed physician.
                Nothing on this page constitutes medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* ── closing statement ───────────────────────────────────────── */}
        <div className="fq-closing mt-4">
          <div className="h-px" style={{ background: "rgba(22,22,22,0.1)" }} />

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: "clamp(22px, 2.8vw, 38px)",
                color: "#161616",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: 680,
              }}
            >
              Every treatment plan is reviewed by a real doctor.{" "}
              <span className="italic" style={{ color: "#2d4a3e" }}>
                Every order is filled by a real pharmacy.
              </span>
            </p>

            <div className="flex flex-col gap-3 lg:items-end lg:pb-1">
              {[
                "Physician reviewed",
                "Licensed pharmacy",
                "HIPAA compliant",
                "50 states",
              ].map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2.5 text-[11px] font-medium uppercase"
                  style={{ letterSpacing: "0.2em", color: "rgba(22,22,22,0.5)" }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 5, height: 5,
                      borderRadius: "50%",
                      background: "#2d4a3e",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 h-px" style={{ background: "rgba(22,22,22,0.1)" }} />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <span
              className="text-[10px] font-medium uppercase"
              style={{ letterSpacing: "0.28em", color: "rgba(22,22,22,0.35)" }}
            >
              TIDL · FAQ
            </span>
            <span
              className="text-[10px] font-medium uppercase"
              style={{ letterSpacing: "0.28em", color: "rgba(22,22,22,0.35)" }}
            >
              End of §06
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
