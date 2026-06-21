import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

import footerLogo from "@/assets/tidl_logo.png";

function TidlWordmark() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    if (!section || !wordmark) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(wordmark, { x: cx * 28, y: cy * 18, rotateX: -cy * 6, rotateY: cx * 8, duration: 1.1, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(wordmark, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1.4, ease: "power3.out" });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex min-h-[36vh] items-center justify-center overflow-hidden [perspective:1200px] sm:min-h-screen"
      style={{ background: "#111111" }}
    >
      <div
        ref={wordmarkRef}
        className="wordmark max-w-[100vw] px-4 font-sans text-center font-black select-none will-change-transform"
        style={{ color: "#F3C300", fontSize: "clamp(6rem, 38vw, 50rem)", letterSpacing: "-0.05em", lineHeight: 0.8 }}
      >
        {"tidl".split("").map((char, i) => (
          <span key={i} className="wordmark-letter">{char}</span>
        ))}
      </div>
      <div className="absolute bottom-5 right-5 flex items-center gap-4 sm:bottom-8 sm:right-8">
        <a href="#" aria-label="Instagram" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
        </a>
        <a href="#" aria-label="X / Twitter" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25H8.08l4.261 5.635L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
        </a>
        <a href="#" aria-label="TikTok" className="social-icon text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.6 2.89 2.89 0 0 1-2.87-2.89c0-1.6 1.29-2.9 2.88-2.9.3 0 .58.05.86.12V8.8a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68c3.5 0 6.34-2.84 6.34-6.34v-5.8a8.2 8.2 0 0 0 4.76 1.5v-3.4a5 5 0 0 1-.01-.69Z"/></svg>
        </a>
      </div>
    </div>
  );
}

export function FooterSection() {
  const learnLinks = ["Labs", "Weight Loss", "Sexual Health", "Testosterone", "Hair Regrowth", "Mental Health", "Drug Comparisons", "Drugs & Medications", "About the Company"];
  const toolLinks = ["BMI Calculator", "Low Testosterone Calculator", "TDEE Calculator", "Calorie Deficit Calculator", "Protein Calculator", "Water Intake Calculator"];
  const popularLinks = [
    { label: "GLP-1 Injections" }, { label: "Sildenafil" }, { label: "Cialis®" },
    { label: "Tadalafil", sub: "Generic for Cialis®" }, { label: "Minaxidil Solution" },
    { label: "Finasteride Pills" }, { label: "Topical Finasteride" },
    { label: "Sertraline for PE" }, { label: "Sertraline", sub: "Generic for Zoloft®" },
    { label: "Escitalopram", sub: "Generic for Lexapro®" },
  ];
  const tidlLinks = [
    { label: "About Us" }, { label: "Good Health", sub: "(It's our blog)" }, { label: "How It Works" },
    { label: "Clinical Excellence" }, { label: "Innovation" }, { label: "Quality & Safety" },
    { label: "TIDL Benefits" }, { label: "Editorial Standards" }, { label: "FAQs" }, { label: "Investors" },
  ];
  const careersLinks = [{ label: "Professionals" }, { label: "Providers" }];
  const connectLinks = [{ label: "Customer Help Center" }, { label: "Press Center" }];

  return (
    <footer style={{ background: "#ffffff" }}>
      <div className="text-white px-5 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10" style={{ background: "#111111", borderRadius: "2rem 2rem 0 0" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-7 sm:gap-4 sm:mb-10">
            <img src={footerLogo} alt="TIDL" className="h-8 object-contain brightness-0 invert sm:h-10" draggable={false} />
            <div className="h-7 w-px bg-white/15 sm:h-8" />
            <p className="text-xs text-white/50 max-w-xs sm:text-sm">A clinical operating system for longevity.</p>
          </div>
          <div className="mb-7 h-px w-full sm:mb-10" style={{ background: "linear-gradient(90deg, #F3C300, rgba(243,195,0,0.15), transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="footer-card col-span-2 sm:col-span-1 flex flex-col gap-6 p-5 sm:gap-8 sm:p-6" style={{ background: "rgba(243,195,0,0.07)", borderRadius: "1.25rem", border: "1px solid rgba(243,195,0,0.25)" }}>
            <div>
              <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: "#F3C300" }}>Get started today</p>
              <p className="font-display text-2xl font-black leading-tight">Total care.<br />Totally different.</p>
              <div className="mt-4 flex items-center gap-3">
                <a href="/quiz" className="btn-primary inline-flex items-center gap-2 text-sm">
                  Start Assessment →
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"/></svg>
              </a>
              <a href="#" aria-label="X / Twitter" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25H8.08l4.261 5.635L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
              </a>
              <a href="#" aria-label="TikTok" className="social-icon" style={{ color: "#F3C300" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.6 2.89 2.89 0 0 1-2.87-2.89c0-1.6 1.29-2.9 2.88-2.9.3 0 .58.05.86.12V8.8a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0 0 12.68c3.5 0 6.34-2.84 6.34-6.34v-5.8a8.2 8.2 0 0 0 4.76 1.5v-3.4a5 5 0 0 1-.01-.69Z"/></svg>
              </a>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Learn</p>
            <ul className="space-y-2.5 mb-8">
              {learnLinks.map((l) => (<li key={l}><a href="#" className="footer-link text-sm text-white/80">{l}</a></li>))}
            </ul>
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Tools</p>
            <ul className="space-y-2.5">
              {toolLinks.map((l) => (<li key={l}><a href="#" className="footer-link text-sm text-white/80">{l}</a></li>))}
            </ul>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Popular</p>
            <ul className="space-y-2.5">
              {popularLinks.map((l) => (
                <li key={l.label}>
                  <a href="#" className="footer-link text-sm text-white/80 leading-tight">{l.label}</a>
                  {l.sub && <p className="text-xs text-white/35 mt-0.5">{l.sub}</p>}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>TIDL</p>
            <ul className="space-y-2.5 mb-8">
              {tidlLinks.map((l) => (
                <li key={l.label}>
                  <a href="#" className="footer-link text-sm text-white/80 leading-tight">{l.label}</a>
                  {l.sub && <p className="text-xs text-white/35 mt-0.5">{l.sub}</p>}
                </li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Careers</p>
            <ul className="space-y-2.5 mb-8">
              {careersLinks.map((l) => (<li key={l.label}><a href="#" className="footer-link text-sm text-white/80">{l.label}</a></li>))}
            </ul>
            <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#F3C300" }}>Connect</p>
            <ul className="space-y-2.5">
              {connectLinks.map((l) => (<li key={l.label}><a href="#" className="footer-link text-sm text-white/80">{l.label}</a></li>))}
            </ul>
          </div>
        </div>
      </div>

      <TidlWordmark />
    </footer>
  );
}
