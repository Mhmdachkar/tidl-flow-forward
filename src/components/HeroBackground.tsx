import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Fully procedural hero environment — no images.
 * Five layered systems: clinical foundation, breathing waves,
 * telemetry particles, scientific grid, soft energy fields.
 */
export function HeroBackground() {
  const waveRef = useRef<SVGSVGElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  /* ───────── wave system ───────── */
  useEffect(() => {
    const svg = waveRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGPathElement>("path");
    paths.forEach((p, i) => {
      gsap.to(p, {
        attr: { d: p.dataset.alt! },
        duration: 9 + i * 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(p, {
        x: i % 2 ? -40 : 40,
        duration: 18 + i * 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  /* ───────── energy fields drift ───────── */
  useEffect(() => {
    const el = fieldsRef.current;
    if (!el) return;
    const blobs = el.querySelectorAll<HTMLElement>(".eblob");
    blobs.forEach((b, i) => {
      gsap.to(b, {
        x: i % 2 ? 60 : -60,
        y: i % 3 ? 40 : -40,
        scale: 1.08,
        duration: 14 + i * 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  /* ───────── telemetry particles ───────── */
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize(); };
    window.addEventListener("resize", onResize);

    const N = 70;
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.10,
      r: 0.6 + Math.random() * 1.4,
      a: 0.02 + Math.random() * 0.06,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      // faint connecting lines
      for (let i = 0; i < N; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < N; j++) {
          const q = parts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 13000) {
            const alpha = (1 - d2 / 13000) * 0.05;
            ctx.strokeStyle = `rgba(40,60,100,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        ctx.fillStyle = `rgba(40,60,100,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Layer 1 — clinical foundation */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 20% 10%, #ffffff 0%, transparent 60%), radial-gradient(900px 600px at 85% 30%, #f4f7fb 0%, transparent 65%), linear-gradient(180deg, #fcfcfc 0%, #f7f8f9 100%)",
        }}
      />

      {/* Layer 5 — soft energy fields */}
      <div ref={fieldsRef} className="absolute inset-0">
        <div
          className="eblob absolute h-[42vw] w-[42vw] rounded-full blur-[100px] will-change-transform"
          style={{ left: "-8%", top: "10%", background: "radial-gradient(closest-side, rgba(234,244,255,0.9), transparent 70%)" }}
        />
        <div
          className="eblob absolute h-[36vw] w-[36vw] rounded-full blur-[110px] will-change-transform"
          style={{ right: "-6%", top: "20%", background: "radial-gradient(closest-side, rgba(245,228,184,0.55), transparent 70%)" }}
        />
        <div
          className="eblob absolute h-[30vw] w-[30vw] rounded-full blur-[120px] will-change-transform"
          style={{ left: "40%", bottom: "-10%", background: "radial-gradient(closest-side, rgba(232,185,73,0.18), transparent 70%)" }}
        />
      </div>

      {/* Layer 4 — scientific grid (very faint) */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />

      {/* Layer 2 — breathing wave system */}
      <svg
        ref={waveRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="wgrad-a" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(40,80,140,0.0)" />
            <stop offset="50%" stopColor="rgba(40,80,140,0.18)" />
            <stop offset="100%" stopColor="rgba(40,80,140,0.0)" />
          </linearGradient>
          <linearGradient id="wgrad-b" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(232,185,73,0.0)" />
            <stop offset="50%" stopColor="rgba(232,185,73,0.22)" />
            <stop offset="100%" stopColor="rgba(232,185,73,0.0)" />
          </linearGradient>
          <linearGradient id="wgrad-c" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(94,155,107,0.0)" />
            <stop offset="50%" stopColor="rgba(94,155,107,0.14)" />
            <stop offset="100%" stopColor="rgba(94,155,107,0.0)" />
          </linearGradient>
        </defs>

        <path
          d="M0,520 C300,420 600,640 900,520 C1200,400 1400,560 1600,500 L1600,900 L0,900 Z"
          data-alt="M0,540 C300,480 600,580 900,460 C1200,360 1400,600 1600,540 L1600,900 L0,900 Z"
          fill="url(#wgrad-a)"
        />
        <path
          d="M0,620 C260,540 580,720 900,620 C1220,520 1380,680 1600,640 L1600,900 L0,900 Z"
          data-alt="M0,640 C260,580 580,660 900,580 C1220,500 1380,720 1600,660 L1600,900 L0,900 Z"
          fill="url(#wgrad-b)"
        />
        <path
          d="M0,720 C300,660 640,800 940,720 C1240,640 1400,760 1600,740 L1600,900 L0,900 Z"
          data-alt="M0,740 C300,700 640,760 940,680 C1240,600 1400,800 1600,760 L1600,900 L0,900 Z"
          fill="url(#wgrad-c)"
        />
      </svg>

      {/* Layer 3 — telemetry particle system */}
      <canvas ref={particleRef} className="absolute inset-0 h-full w-full" />

      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </div>
  );
}
