import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { TIDL_BRAND } from "@/lib/tidl-brand";

import faqVisual from "@/assets/ChatGPT Image Jun 24, 2026, 04_09_35 AM.png";

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
    a: "Every assessment is reviewed by a board-certified physician, not an algorithm, not AI, not a chatbot. Medical questions are escalated to the physician team. No automated system makes prescription decisions.",
  },
  {
    id: 3,
    q: "How long does physician review take?",
    a: "Most assessments are reviewed within 24 hours. Once approved, your prescription is sent directly to our licensed pharmacy network for preparation and dispatch.",
  },
  {
    id: 4,
    q: "Where is my medication prepared?",
    a: "All medication is prepared by licensed pharmacy partners, never a third-party warehouse. Compounded treatments are produced in USP 797 and USP 795 compliant facilities under sterile conditions.",
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
    <span className="tidl-touch-target flex-shrink-0" aria-hidden>
      <span
        className="relative flex h-7 w-7 items-center justify-center"
        style={{
          border: "1px solid rgba(35,31,32,0.15)",
          borderRadius: 4,
          color: open ? TIDL_BRAND.accent : TIDL_BRAND.ink,
          transition: "color 0.3s, border-color 0.3s",
          borderColor: open ? "rgba(243,195,0,0.35)" : "rgba(35,31,32,0.15)",
        }}
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
            background: TIDL_BRAND.accent,
            transform: "scaleY(0)",
          }}
        />

        <div className="flex items-start gap-5 px-5 py-6">
          {/* ghost number */}
          <span
            aria-hidden
            className="flex-shrink-0 font-display text-[clamp(28px,2.8vw,40px)] font-bold leading-none tracking-[-0.02em]"
            style={{
              color: isOpen ? TIDL_BRAND.accent : "rgba(35,31,32,0.1)",
              minWidth: 48,
            }}
          >
            {num}
          </span>

          {/* question */}
          <span
            className="tidl-body flex-1 pt-1 text-[clamp(16px,1.6vw,21px)] font-semibold leading-[1.25] tracking-[-0.01em] transition-colors duration-200"
            style={{ color: isOpen ? TIDL_BRAND.ink : "rgba(35,31,32,0.78)" }}
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
          className="tidl-body px-5 pb-7 pl-5 text-base leading-[1.65] sm:pl-[calc(1.25rem+48px+1.25rem)]"
          style={{ color: "rgba(35,31,32,0.62)", maxWidth: 680 }}
        >
          {item.a}
        </p>
      </div>

      {/* hairline separator */}
      <div className="mx-5" style={{ height: 1, background: "rgba(35,31,32,0.08)" }} />
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FAQSection() {
  const rootRef   = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const headRef   = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const visualImgRef = useRef<HTMLImageElement | null>(null);
  const itemEls   = useRef<(HTMLDivElement | null)[]>([]);

  const [openId, setOpenId] = useState<number | null>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ── cursor spotlight: desktop only ──────────────────────────────
      const cur = cursorRef.current;
      const isTouch = window.matchMedia("(max-width: 1023px)").matches;
      if (cur && !isTouch) {
        const qx = gsap.quickTo(cur, "x", { duration: 0.9, ease: "power3.out" });
        const qy = gsap.quickTo(cur, "y", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = root.getBoundingClientRect();
          qx(e.clientX - r.left - 220);
          qy(e.clientY - r.top  - 220);
        };
        root.addEventListener("mousemove", onMove);
      }

      // ── headline word reveal ──────────────────────────────────────────
      const head = headRef.current;
      const words = head?.querySelectorAll<HTMLElement>(".fq-w");
      if (words?.length) {
        const revealHeadline = () => {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: "expo.out",
            stagger: 0.055,
            overwrite: "auto",
          });
        };

        if (reduced) {
          gsap.set(words, { yPercent: 0, opacity: 1 });
        } else {
          gsap.set(words, { yPercent: 115, opacity: 0 });
          if (head) {
            ScrollTrigger.create({
              trigger: head,
              start: "top 88%",
              once: true,
              onEnter: revealHeadline,
            });
            if (head.getBoundingClientRect().top < window.innerHeight * 0.88) {
              revealHeadline();
            }
          }
        }
      }

      const visual = visualRef.current;
      const visualImg = visualImgRef.current;
      if (visual) {
        if (reduced) {
          gsap.set(visual, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
          if (visualImg) gsap.set(visualImg, { yPercent: 0, scale: 1 });
        } else {
          gsap.set(visual, { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.75 });
          if (visualImg) {
            gsap.set(visualImg, {
              yPercent: -10,
              scale: 1.08,
              transformOrigin: "center top",
              force3D: true,
            });
          }

          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: visual,
              start: "top 95%",
              end: "top 12%",
              scrub: 3.4,
              invalidateOnRefresh: true,
            },
          });
          reveal.to(visual, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, ease: "none" }, 0);
          if (visualImg) {
            reveal.to(visualImg, { yPercent: 0, scale: 1, ease: "none", force3D: true }, 0);
          }

          if (visual.getBoundingClientRect().top < window.innerHeight * 0.95) {
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }
        }
      }

      if (reduced) return;

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

    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

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
      id="faqs"
      ref={rootRef}
      data-nav-zone="faq"
      aria-label="Frequently asked questions"
      className="tidl-brand-section relative overflow-hidden"
      style={{ background: TIDL_BRAND.bg, color: TIDL_BRAND.ink }}
    >
      {/* cursor spotlight */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{
          width: 440, height: 440,
          background: "radial-gradient(circle, rgba(243,195,0,0.06) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20 lg:px-16 lg:pt-24 lg:pb-28">

        {/* ── header ─────────────────────────────────────────────────── */}
        <div className="mb-10 grid grid-cols-1 gap-8 lg:mb-16 lg:gap-16 lg:grid-cols-[1fr_1.6fr]">

          {/* left: sticky headline */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div ref={headRef}>
              <h2 className="tidl-display text-[clamp(42px,5.5vw,80px)] tracking-[-0.025em]">
                <span className="block overflow-hidden pb-[0.05em]">
                  <Word text="Everything" />
                </span>
                <span className="block overflow-hidden pb-[0.05em] italic" style={{ color: TIDL_BRAND.accent }}>
                  <Word text="you need" />
                </span>
                <span className="block overflow-hidden pb-[0.05em]">
                  <Word text="to know." />
                </span>
              </h2>
            </div>
            <div
              ref={visualRef}
              className="fq-visual mt-8 -ml-3 w-full max-w-[min(100%,26rem)] sm:-ml-4 lg:-ml-5"
              style={{
                border: "1px solid rgba(35,31,32,0.08)",
                borderRadius: "2rem",
                boxShadow: "0 24px 48px -28px rgba(35,31,32,0.35)",
                overflow: "hidden",
                willChange: "clip-path, opacity",
              }}
            >
              <img
                ref={visualImgRef}
                src={faqVisual}
                alt=""
                className="fq-visual-img block h-auto w-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* right: accordion */}
          <div
            className="overflow-hidden"
            style={{
              border: "1px solid rgba(35,31,32,0.1)",
              borderRadius: 8,
              background: "rgba(250,249,246,0.7)",
            }}
          >
            {/* top hairline accent */}
            <div style={{ height: 2, background: TIDL_BRAND.accent }} />

            {/* count label */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid rgba(35,31,32,0.08)" }}
            >
              <span
                className="text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.28em", color: "rgba(35,31,32,0.4)" }}
              >
                {FAQS.length} questions
              </span>
              <span
                className="text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.28em", color: TIDL_BRAND.accent }}
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
              style={{ borderTop: "1px solid rgba(35,31,32,0.08)" }}
            >
              <p
                className="text-[11px]"
                style={{ color: "rgba(35,31,32,0.4)", lineHeight: 1.6 }}
              >
                Treatment eligibility is determined solely by a licensed physician.
                Nothing on this page constitutes medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
