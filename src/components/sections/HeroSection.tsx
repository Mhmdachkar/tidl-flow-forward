import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { createTiltQuickTo } from "@/lib/gsap-tilt";
import { useQuizModal } from "@/providers/quiz-modal-provider";
import {
  canUseHoverParallax,
  createScrollGate,
  observeSectionVisibility,
  rafThrottle,
} from "@/lib/section-performance";

import product2 from "@/assets/product 2 3d white.png";
import product3 from "@/assets/product 3 3d pink.png";
import product4 from "@/assets/product 4 3d.png";
import product5 from "@/assets/product 5 3d.png";

const styles = `
/* ── TIDL Brand Tokens ──────────────────────────────────────
   Knockout  #231f20   primary dark (near-black)
   Resolve   #ffffff   white
   Cool Mist #c4c6c7   light gray
   Recover   #e07b0a   aggressive amber-orange accent
   ────────────────────────────────────────────────────────── */

.tidl-hero { font-family: 'Archivo', system-ui, sans-serif; background: #FAFAF7; color: #231f20; }
.tidl-hero * { box-sizing: border-box; }
.tidl-main-grid, .tidl-quick-grid { perspective: 1400px; perspective-origin: 50% 30%; }
.tidl-tilt { transform-style: preserve-3d; }
.tidl-tilt-inner { transform-style: preserve-3d; }
.tidl-glare { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; mix-blend-mode: screen; background: radial-gradient(320px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.22), transparent 55%); transition: opacity .35s ease; z-index: 4; }
.tidl-card-cream .tidl-glare { mix-blend-mode: overlay; background: radial-gradient(320px circle at var(--gx, 50%) var(--gy, 50%), rgba(224, 123, 10,0.45), transparent 55%); }
.tidl-card:hover .tidl-glare { opacity: 1; }
.tidl-quick .tidl-glare { background: radial-gradient(160px circle at var(--gx, 50%) var(--gy, 50%), rgba(224, 123, 10,0.35), transparent 60%); mix-blend-mode: multiply; }
.tidl-gsap-init { opacity: 0; }
/* Archivo Narrow Bold: official TIDL primary headline font */
.tidl-fraunces { font-family: 'Archivo Narrow', sans-serif; font-weight: 400; letter-spacing: -0.01em; line-height: 1.08; }
/* Josefin Sans: closest free match to Blair ITC (geometric all-caps secondary) */
.tidl-label { font-family: 'Josefin Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }

.tidl-announce { width: 100%; background: #e07b0a; color: #231f20; text-align: center; padding: 10px 16px; font-size: 13px; font-weight: 700; font-family: 'Archivo', sans-serif; letter-spacing: 0.04em; border: none; cursor: pointer; transition: filter .2s ease; }
.tidl-announce:hover { filter: brightness(0.93); }

.tidl-container { max-width: 1280px; margin: 0 auto; padding: 24px 20px 20px; }
@media (min-width: 640px) { .tidl-container { padding: 32px 24px 28px; } }

.tidl-headline-row { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; justify-items: center; margin-bottom: 20px; text-align: center; }
@media (min-width: 900px) { .tidl-headline-row { grid-template-columns: 1fr; gap: 32px; margin-bottom: 48px; } }
/* Archivo Narrow Bold: official brand headline */
.tidl-headline { font-size: clamp(1.85rem, 6.2vw, 3.35rem); margin: 0 auto; max-width: 18ch; color: #231f20; font-family: 'Archivo Narrow', sans-serif; font-weight: 800; letter-spacing: -0.025em; line-height: 1.02; }
.tidl-headline-line { display: block; }
/* em: brand gold accent */
.tidl-word { display: inline-block; }
.tidl-headline em { font-style: normal; font-weight: 800; color: inherit; }
.tidl-headline-accent { color: #e07b0a; font-weight: 800; }
.tidl-sub { margin-top: 18px; font-size: 15px; color: #6b6a6b; max-width: 540px; font-family: 'Archivo', sans-serif; font-weight: 400; letter-spacing: 0.01em; }

.tidl-main-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; align-items: stretch; }
@media (min-width: 640px) { .tidl-main-grid { gap: 14px; margin-bottom: 16px; } }
@media (min-width: 900px) { .tidl-main-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; } }

.tidl-card { position: relative; border-radius: 1.25rem; overflow: hidden; cursor: pointer; border: 1px solid transparent; box-shadow: 0 4px 20px rgba(17,17,17,0.06); transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease; text-align: left; padding: 0; display: block; width: 100%; font: inherit; isolation: isolate; min-width: 0; height: 100%; min-height: clamp(12.5rem, 48vw, 15.5rem); }
@media (min-width: 640px) { .tidl-card { min-height: clamp(14rem, 36vw, 17rem); } }
@media (min-width: 900px) { .tidl-card { border-radius: 1.5rem; min-height: clamp(18rem, 28vw, 22rem); } }
.tidl-card:hover { transform: translateY(-8px) scale(1.01); border-color: rgba(224, 123, 10,0.45); box-shadow: 0 32px 70px rgba(17,17,17,0.22); }
.tidl-card-inner { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr; min-height: inherit; height: 100%; }
@media (min-width: 900px) { .tidl-card-inner { grid-template-columns: 1.1fr 1fr; min-height: clamp(18rem, 28vw, 22rem); } }
.tidl-card-content { position: relative; padding: 14px 12px 10px; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; flex: 1; }
@media (min-width: 640px) { .tidl-card-content { padding: 16px 16px 12px; } }
@media (min-width: 900px) { .tidl-card-content { padding: 22px 24px 20px 28px; } }
.tidl-card-img { position: relative; overflow: visible; display: flex; align-items: flex-end; justify-content: center; padding: 6px 8px 8px; min-height: clamp(6.5rem, 26vw, 8.5rem); z-index: 3; flex: 1; }
@media (min-width: 640px) { .tidl-card-img { padding: 8px 12px 12px; min-height: clamp(7.5rem, 22vw, 9.5rem); } }
@media (min-width: 900px) { .tidl-card-img { align-items: center; padding: 12px 16px; min-height: clamp(11rem, 18vw, 14rem); } }
.tidl-card-img img { max-height: clamp(6rem, 24vw, 8rem); max-width: 100%; object-fit: contain; transform-origin: center center; transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease; will-change: transform; }
@media (min-width: 640px) { .tidl-card-img img { max-height: clamp(7rem, 20vw, 9.5rem); } }
@media (min-width: 900px) { .tidl-card-img img { max-height: clamp(11rem, 16vw, 15rem); } }

/* Dark card uses Knockout #231f20: official TIDL primary dark */
.tidl-card-dark { background: #231f20; color: #ffffff; }
.tidl-card-dark .tidl-card-headline { color: #ffffff; transition: text-shadow 0.5s ease; }
.tidl-card-dark .tidl-label { color: #e07b0a; transition: letter-spacing .4s ease, filter .3s ease; }
.tidl-card-dark .tidl-card-cta { color: #e07b0a; }
.tidl-card-dark .tidl-sweep { position: absolute; inset: -50%; width: 200%; height: 200%; background: linear-gradient(105deg, transparent 46%, rgba(224, 123, 10,0.30) 49%, rgba(224, 123, 10,0.65) 50%, rgba(224, 123, 10,0.30) 51%, transparent 54%); transform: translateX(-120%) translateY(-20%); transition: transform 1.1s cubic-bezier(0.22,1,0.36,1); z-index: 1; pointer-events: none; }
.tidl-card-dark:hover .tidl-sweep { transform: translateX(20%) translateY(-20%); }
.tidl-card-dark .tidl-scan { position: absolute; left: 0; right: 0; top: -20%; height: 3px; background: linear-gradient(90deg, transparent 5%, rgba(224, 123, 10,0.9) 30%, rgba(255,255,255,0.85) 50%, rgba(224, 123, 10,0.9) 70%, transparent 95%); box-shadow: 0 0 18px rgba(224, 123, 10,0.7), 0 0 45px rgba(224, 123, 10,0.35), 0 10px 40px rgba(224, 123, 10,0.15); opacity: 0; z-index: 4; pointer-events: none; }
.tidl-card-dark:hover .tidl-scan { animation: tidlScan 1.6s cubic-bezier(0.22,1,0.36,1) infinite; }
.tidl-card-dark .tidl-inner-light { position: absolute; inset: 0; background: radial-gradient(500px circle at 30% 60%, rgba(224, 123, 10,0.16), transparent 60%); opacity: 0; transition: opacity 0.7s ease; z-index: 1; pointer-events: none; }
.tidl-card-dark:hover .tidl-inner-light { opacity: 1; }
.tidl-card-dark::after { content: ""; position: absolute; left: 32px; right: 32px; bottom: 26px; height: 2px; background: #e07b0a; box-shadow: 0 0 14px rgba(224, 123, 10,0.7), 0 0 35px rgba(224, 123, 10,0.3); transform: scaleX(0); transform-origin: left center; transition: transform 0.7s cubic-bezier(0.77,0,0.18,1); z-index: 3; }
.tidl-card-dark:hover::after { transform: scaleX(1); }
.tidl-card-dark::before { content: ""; position: absolute; top: 0; left: 0; width: 260px; height: 260px; background: radial-gradient(circle at 0% 0%, rgba(224, 123, 10,0.55), transparent 60%); opacity: 0; transition: opacity 0.6s ease; z-index: 1; pointer-events: none; }
.tidl-card-dark:hover::before { opacity: 1; }
.tidl-card-dark .tidl-aura { position: absolute; inset: -1px; border-radius: 1.5rem; opacity: 0; transition: opacity 0.5s ease; box-shadow: inset 0 0 40px rgba(224, 123, 10,0.10), 0 0 0 1px rgba(224, 123, 10,0.25), 0 0 50px rgba(224, 123, 10,0.18), 0 0 100px rgba(224, 123, 10,0.08); z-index: 0; pointer-events: none; }
.tidl-card-dark:hover .tidl-aura { opacity: 1; }
.tidl-card-dark:hover .tidl-label { letter-spacing: 0.24em; filter: brightness(1.25); }
.tidl-card-dark:hover .tidl-card-headline { text-shadow: 0 0 30px rgba(224, 123, 10,0.30), 0 0 70px rgba(224, 123, 10,0.12); }
.tidl-card-dark:hover .tidl-card-img img { filter: drop-shadow(0 24px 36px rgba(224, 123, 10,0.22)); }
.tidl-card-dark .tidl-card-cta svg { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
.tidl-card-dark:hover .tidl-card-cta svg { transform: translateX(10px); }

/* Cream card uses Resolve #ffffff with Cool Mist border: official brand */
.tidl-card-cream { background: #f5f4f0; color: #231f20; }
.tidl-card-cream .tidl-label { color: #231f20; transition: letter-spacing .4s ease; }
.tidl-card-cream .tidl-card-cta { color: #231f20; }
.tidl-card-cream:hover { box-shadow: inset 3px 0 0 rgba(224, 123, 10,0.55), 0 32px 70px rgba(224, 123, 10,0.22), 0 4px 20px rgba(35,31,32,0.10); }
.tidl-card-cream .tidl-sweep { position: absolute; inset: -50%; width: 200%; height: 200%; background: linear-gradient(115deg, transparent 44%, rgba(224, 123, 10,0.22) 48%, rgba(35,31,32,0.08) 50%, rgba(224, 123, 10,0.22) 52%, transparent 56%); transform: translateX(-130%) translateY(10%); transition: transform 1.2s cubic-bezier(0.22,1,0.36,1); z-index: 1; pointer-events: none; }
.tidl-card-cream:hover .tidl-sweep { transform: translateX(30%) translateY(10%); }
.tidl-card-cream .tidl-inner-light { position: absolute; inset: 0; background: radial-gradient(450px circle at 70% 40%, rgba(224, 123, 10,0.14), transparent 55%); opacity: 0; transition: opacity 0.7s ease; z-index: 1; pointer-events: none; }
.tidl-card-cream:hover .tidl-inner-light { opacity: 1; }
.tidl-card-cream::before { content: ""; position: absolute; top: 0; right: 0; width: 240px; height: 240px; background: radial-gradient(circle at 100% 0%, rgba(224, 123, 10,0.18), transparent 60%); opacity: 0; transition: opacity 0.6s ease; z-index: 1; pointer-events: none; }
.tidl-card-cream:hover::before { opacity: 1; }
.tidl-card-cream .tidl-aura { position: absolute; inset: -1px; border-radius: 1.5rem; opacity: 0; transition: opacity 0.5s ease; box-shadow: inset 0 0 40px rgba(224, 123, 10,0.08), 0 0 0 1px rgba(224, 123, 10,0.22), 0 0 50px rgba(224, 123, 10,0.14), 0 0 100px rgba(35,31,32,0.06); z-index: 0; pointer-events: none; }
.tidl-card-cream:hover .tidl-aura { opacity: 1; }
.tidl-card-cream:hover .tidl-label { letter-spacing: 0.26em; }
.tidl-card-cream .tidl-card-headline { transition: color 0.4s ease; }
.tidl-card-cream:hover .tidl-card-img img { filter: drop-shadow(0 22px 34px rgba(35,31,32,0.14)); }
.tidl-card-cream .tidl-card-cta svg { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
.tidl-card-cream:hover .tidl-card-cta svg { transform: translateX(10px); }

/* Archivo Narrow Bold: official TIDL headline font for cards */
.tidl-card-headline { font-family: 'Archivo Narrow', sans-serif; font-weight: 700; font-size: clamp(0.95rem, 3.8vw, 2.5rem); line-height: 1.05; letter-spacing: -0.01em; margin: 6px 0 0; max-width: none; }
@media (min-width: 640px) { .tidl-card-headline { font-size: clamp(1.1rem, 2.8vw, 2rem); margin: 8px 0 0; } }
@media (min-width: 900px) { .tidl-card-headline { font-size: clamp(1.45rem, 2.6vw, 2.1rem); margin: 12px 0 0; max-width: 320px; } }
.tidl-card-cta { font-size: 10px; font-weight: 700; font-family: 'Archivo', sans-serif; letter-spacing: 0.04em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; line-height: 1.2; will-change: transform, opacity; }
@media (min-width: 640px) { .tidl-card-cta { font-size: 11px; margin-top: 10px; gap: 5px; } }
@media (min-width: 900px) { .tidl-card-cta { font-size: 12px; letter-spacing: 0.06em; gap: 6px; margin-top: 16px; } }
.tidl-card-dark .tidl-label,
.tidl-card-cream .tidl-label { font-size: 9px; letter-spacing: 0.12em; }
@media (min-width: 640px) { .tidl-card-dark .tidl-label, .tidl-card-cream .tidl-label { font-size: 10px; letter-spacing: 0.15em; } }
@media (min-width: 900px) { .tidl-card-dark .tidl-label, .tidl-card-cream .tidl-label { font-size: 11px; letter-spacing: 0.18em; } }

/* mobile: horizontal swipe row */
.tidl-quick-grid { display: flex; flex-direction: row; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; scrollbar-width: none; gap: 12px; padding-bottom: 6px; }
.tidl-quick-grid::-webkit-scrollbar { display: none; }
/* desktop: 4-col grid */
@media (min-width: 900px) { .tidl-quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; overflow: visible; } }

.tidl-quick { position: relative; background: #FFFFFF; border: 1px solid #E8E8E3; border-radius: 1.1rem; padding: 20px 16px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; overflow: hidden; isolation: isolate; transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.35s ease; flex: 0 0 46vw; max-width: 200px; min-width: 148px; min-height: 10rem; font: inherit; text-align: center; scroll-snap-align: start; }
.tidl-quick:hover { transform: translateY(-4px); border-color: #e07b0a; background: #FFFDF5; box-shadow: 0 14px 30px rgba(17,17,17,0.10); overflow: visible; z-index: 4; }
@media (min-width: 640px) { .tidl-quick { min-height: 10.5rem; padding: 22px 18px 18px; } }
@media (min-width: 900px) { .tidl-quick { flex: unset; max-width: none; min-width: 0; min-height: 9rem; flex-direction: row; align-items: center; justify-content: space-between; border-radius: 1.2rem; padding: 26px 28px; gap: 16px; text-align: left; scroll-snap-align: unset; } }
.tidl-quick::before { content: ""; position: absolute; left: 0; bottom: 0; height: 2px; width: 100%; background: linear-gradient(90deg, #e07b0a, #2d4a3e); transform: scaleX(0); transform-origin: left center; transition: transform 0.5s cubic-bezier(0.77,0,0.18,1); z-index: 2; }
.tidl-quick:hover::before { transform: scaleX(1); }
.tidl-quick::after { content: ""; position: absolute; inset: 0; background: radial-gradient(180px circle at 85% 50%, rgba(224, 123, 10,0.18), transparent 60%); opacity: 0; transition: opacity 0.4s ease; z-index: 0; pointer-events: none; }
.tidl-quick:hover::after { opacity: 1; }
.tidl-quick-label { position: relative; z-index: 2; font-size: 13px; font-weight: 700; font-family: 'Archivo', sans-serif; letter-spacing: 0.01em; line-height: 1.3; color: #231f20; transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), color 0.3s ease; }
@media (min-width: 640px) { .tidl-quick-label { font-size: 14px; } }
@media (min-width: 900px) { .tidl-quick-label { font-size: 16px; line-height: 1.35; } }
.tidl-quick:hover .tidl-quick-label { transform: translateX(4px); }
.tidl-quick-media { position: relative; z-index: 5; display: flex; align-items: center; justify-content: center; gap: 0; flex-shrink: 0; overflow: visible; }
@media (min-width: 900px) { .tidl-quick-media { gap: 14px; } }
.tidl-quick-img { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: visible; z-index: 5; }
@media (min-width: 640px) { .tidl-quick-img { width: 76px; height: 76px; } }
@media (min-width: 900px) { .tidl-quick-img { width: 84px; height: 84px; } }
.tidl-quick-img img { max-width: 100%; max-height: 100%; object-fit: contain; transform-origin: center center; transition: filter 0.45s ease; will-change: transform; }
.tidl-quick-arrow { display: none; position: relative; z-index: 2; color: #999; transition: color .3s ease, transform .35s cubic-bezier(0.22,1,0.36,1); }
@media (min-width: 900px) { .tidl-quick-arrow { display: block; } }
.tidl-quick:hover .tidl-quick-arrow { color: #e07b0a; transform: translateX(6px); }

@keyframes tidlScan {
  0% { top: -20%; opacity: 0; }
  8% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 120%; opacity: 0; }
}
@keyframes tidlPulse {
  0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tidl-anim { opacity: 1; animation: none; }
  .tidl-card, .tidl-quick, .tidl-card-img img, .tidl-quick-img img { transition: none; }
  .tidl-card:hover, .tidl-quick:hover { transform: none; }
  .tidl-card:hover .tidl-card-img img { transform: scale(2) rotate(10deg) translateY(-6px); }
  .tidl-quick:hover .tidl-quick-img img { transform: scale(2) rotate(12deg); }
}
`;

export function HeroSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const { openModal } = useQuizModal();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".tidl-tilt"));
    const headline = root.querySelector<HTMLElement>(".tidl-headline");
    const sectionActive = { current: true };
    const scrollGate = createScrollGate();
    const hoverParallax = canUseHoverParallax();
    const cleanups: Array<() => void> = [];

    const visibilityCleanup = observeSectionVisibility(
      root,
      () => { sectionActive.current = true; },
      () => { sectionActive.current = false; },
    );
    cleanups.push(visibilityCleanup, scrollGate.dispose);

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([...cards, headline].filter(Boolean) as HTMLElement[], { clearProps: "all", opacity: 1 });
        return;
      }

      const words = root.querySelectorAll<HTMLElement>(".tidl-word");
      const mainCards = cards.filter((c) => c.classList.contains("tidl-card"));
      const quickCards = cards.filter((c) => c.classList.contains("tidl-quick"));
      const darkCard = mainCards.find((c) => c.classList.contains("tidl-card-dark"));
      const creamCard = mainCards.find((c) => c.classList.contains("tidl-card-cream"));

      gsap.set(words, { yPercent: 110, opacity: 0, rotateX: -60, transformOrigin: "0% 100%" });
      if (darkCard) {
        gsap.set(darkCard, { opacity: 0, xPercent: -120, rotateY: 18, transformOrigin: "100% 50%" });
      }
      if (creamCard) {
        gsap.set(creamCard, { opacity: 0, xPercent: 120, rotateY: -18, transformOrigin: "0% 50%" });
      }
      gsap.set(quickCards, { opacity: 0, filter: "blur(10px)", transformOrigin: "50% 50%" });
      quickCards.forEach((card, index) => {
        const pattern = index % 3;
        if (pattern === 0) {
          gsap.set(card, { x: -72, y: 0, scale: 1, rotate: -4 });
        } else if (pattern === 1) {
          gsap.set(card, { x: 72, y: 0, scale: 1, rotate: 4 });
        } else {
          gsap.set(card, { x: 0, y: 48, scale: 0.72, rotate: 0 });
        }
      });

      const cardCtas = root.querySelectorAll<HTMLElement>(".tidl-card-cta");
      gsap.set(cardCtas, { opacity: 0, y: 16, scale: 0.82, transformOrigin: "50% 100%" });

      const entranceCards = [darkCard, creamCard].filter(Boolean) as HTMLElement[];
      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      const wordDur = isMobile ? 0.85 : 1.4;
      const cardDur = isMobile ? 1.1 : 2.0;
      const quickDur = isMobile ? 0.9 : 1.4;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(words, { yPercent: 0, opacity: 1, rotateX: 0, duration: wordDur, stagger: isMobile ? 0.06 : 0.1 })
        .to(entranceCards, { opacity: 1, xPercent: 0, rotateY: 0, duration: cardDur, ease: "expo.out", stagger: 0.18 }, "-=0.4")
        .fromTo(entranceCards, { scale: 1.03 }, { scale: 1, duration: isMobile ? 0.7 : 1.0, ease: "elastic.out(1, 0.6)" }, "-=0.6")
        .to(cardCtas, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(2.2)", stagger: 0.12 }, "-=0.45");

      quickCards.forEach((card, index) => {
        const pattern = index % 3;
        const ease = pattern === 2 ? "back.out(1.5)" : "power3.out";
        const duration = pattern === 2 ? quickDur * 1.05 : quickDur;
        tl.to(
          card,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration,
            ease,
          },
          `-=${index === 0 ? 0.55 : 0.48 - index * 0.06}`,
        );
      });

      // ── Scroll-out: hero content drifts up + fades as user scrolls away ──────
      const container = root.querySelector<HTMLElement>(".tidl-container");
      if (container) {
        gsap.to(container, {
          opacity: 0,
          y: -60,
          scale: 0.97,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "bottom 72%",
            end: "bottom 8%",
            scrub: 2.4,
          },
        });
      }

      if (!hoverParallax) return;

      cards.forEach((card) => {
        const inner = card.querySelector<HTMLElement>(".tidl-tilt-inner");
        const glare = card.querySelector<HTMLElement>(".tidl-glare");
        const img = card.querySelector<HTMLElement>(".tidl-card-img img, .tidl-quick-img img");
        const isQuick = card.classList.contains("tidl-quick");
        const isMainCard = card.classList.contains("tidl-card");
        const maxRot = isQuick ? 8 : 14;
        const baseRotate = isQuick ? 12 : 14;
        const baseScale = 2;
        const rotateRange = isQuick ? 16 : 18;

        const tiltEl = inner ?? card;
        const tilt = createTiltQuickTo(tiltEl);
        const useProductHover = Boolean(img && (isMainCard || isQuick));
        const imgRotate = useProductHover ? gsap.quickTo(img!, "rotation", { duration: 0.55, ease: "power3.out" }) : null;
        const imgLift = useProductHover && isMainCard ? gsap.quickTo(img!, "y", { duration: 0.55, ease: "power3.out" }) : null;
        const imgScale = useProductHover ? gsap.quickTo(img!, "scale", { duration: 0.55, ease: "power3.out" }) : null;

        const resetTilt = () => {
          tilt.reset();
          if (imgRotate && imgScale) {
            imgRotate(0);
            imgScale(1);
          }
          if (imgLift) imgLift(0);
        };

        const onMove = rafThrottle((e: MouseEvent) => {
          if (!sectionActive.current || scrollGate.isScrolling()) return;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          const dx = px - 0.5;
          const dy = py - 0.5;
          tilt.rotateY(dx * maxRot);
          if (imgRotate && imgScale) {
            imgRotate(baseRotate + dx * rotateRange);
            imgScale(baseScale);
            if (imgLift) imgLift(-10 + dy * 8);
          }
          if (glare) {
            glare.style.setProperty("--gx", `${px * 100}%`);
            glare.style.setProperty("--gy", `${py * 100}%`);
          }
        });

        const onEnter = () => {
          if (!sectionActive.current) return;
          if (imgRotate && imgScale) {
            imgRotate(baseRotate);
            imgScale(baseScale);
            if (imgLift) imgLift(-10);
          }
          card.addEventListener("mousemove", onMove, { passive: true });
        };

        const onOut = () => {
          card.removeEventListener("mousemove", onMove);
          resetTilt();
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onOut);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onOut);
        });
      });
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section className="tidl-hero" ref={rootRef} data-nav-zone="hero">
      <style>{styles}</style>

      <div className="tidl-container">
        <div className="tidl-headline-row">
          <div>
            <h1 className="tidl-headline tidl-fraunces">
              <span className="tidl-headline-line">
                <span className="tidl-word">The</span>{" "}
                <span className="tidl-word">longevity</span>{" "}
                <span className="tidl-word">care</span>
              </span>
              <span className="tidl-headline-line">
                <span className="tidl-word">you</span>{" "}
                <span className="tidl-word tidl-headline-accent">deserve.</span>
              </span>
            </h1>
          </div>
        </div>

        <div className="tidl-main-grid">
          {/* Dark card */}
          <button type="button" className="tidl-card tidl-card-dark tidl-tilt" onClick={openModal}>
            <span className="tidl-sweep" aria-hidden="true" />
            <span className="tidl-scan" aria-hidden="true" />
            <span className="tidl-aura" aria-hidden="true" />
            <span className="tidl-inner-light" aria-hidden="true" />
            <span className="tidl-glare" aria-hidden="true" />
            <div className="tidl-card-inner tidl-tilt-inner">
              <div className="tidl-card-content">
                <span className="tidl-label">Metabolic &amp; Weight</span>
                <div>
                  <h2 className="tidl-card-headline">Start your longevity journey</h2>
                  <span className="tidl-card-cta">Find your physician match <ArrowRight size={16} /></span>
                </div>
              </div>
              <div className="tidl-card-img">
                <img src={product5} alt="TIDL injectable therapy" loading="lazy" decoding="async" />
              </div>
            </div>
          </button>

          {/* Cream card */}
          <button type="button" className="tidl-card tidl-card-cream tidl-tilt" onClick={openModal}>
            <span className="tidl-sweep" aria-hidden="true" />
            <span className="tidl-aura" aria-hidden="true" />
            <span className="tidl-inner-light" aria-hidden="true" />
            <span className="tidl-glare" aria-hidden="true" />
            <div className="tidl-card-inner tidl-tilt-inner">
              <div className="tidl-card-content">
                <span className="tidl-label">Hormone &amp; Longevity</span>
                <div>
                  <h2 className="tidl-card-headline">See what's possible for you</h2>
                  <span className="tidl-card-cta">Explore treatment tracks <ArrowRight size={16} /></span>
                </div>
              </div>
              <div className="tidl-card-img">
                <img src={product4} alt="TIDL hormone pen" loading="lazy" decoding="async" />
              </div>
            </div>
          </button>
        </div>

        <div className="tidl-quick-grid">
          {([
            { label: "Weight Loss",     img: product2 },
            { label: "Hormonal Health", img: product3 },
            { label: "Longevity",       img: product4 },
            { label: "Performance",     img: product5 },
          ] as const).map((c) => (
            <button key={c.label} type="button" className="tidl-quick tidl-tilt" onClick={openModal}>
              <span className="tidl-glare" aria-hidden="true" />
              <span className="tidl-quick-label">{c.label}</span>
              <span className="tidl-quick-media">
                <span className="tidl-quick-img">
                  <img src={c.img} alt="" loading="lazy" decoding="async" />
                </span>
                <ArrowRight size={16} className="tidl-quick-arrow" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
