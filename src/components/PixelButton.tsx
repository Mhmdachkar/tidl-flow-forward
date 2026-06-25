import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * PixelButton: a button whose label materialises out of a swarm
 * of "water pixels" that gather, settle, and then resolve into
 * a real interactive button.
 *
 * The particles are rendered on a canvas. Their target positions
 * are sampled from an offscreen rendering of the label text, so
 * the swarm literally _is_ the button label.
 */
export function PixelButton({
  label,
  onClick,
  variant = "primary",
  className = "",
}: {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = host.clientWidth;
    const H = host.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Sample target points from the label text.
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const octx = off.getContext("2d")!;
    octx.fillStyle = "#000";
    octx.textBaseline = "middle";
    octx.textAlign = "center";
    const fontSize = Math.round(H * 0.42);
    octx.font = `600 ${fontSize}px "Fraunces", Georgia, serif`;
    octx.fillText(label, W / 2, H / 2 + 1);
    const img = octx.getImageData(0, 0, W, H).data;

    const step = 3; // sampling density
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const a = img[(y * W + x) * 4 + 3];
        if (a > 128) targets.push({ x, y });
      }
    }

    type P = { x: number; y: number; tx: number; ty: number; a: number; r: number };
    const accent = variant === "primary" ? "20, 40, 80" : "60, 80, 110";

    const particles: P[] = targets.map((t) => ({
      x: W / 2 + (Math.random() - 0.5) * W * 1.6,
      y: H / 2 + (Math.random() - 0.5) * H * 6 + (Math.random() < 0.5 ? -120 : 120),
      tx: t.x,
      ty: t.y,
      a: 0,
      r: Math.random() * 1.2 + 0.6,
    }));

    let raf = 0;
    let progress = { v: 0 };
    let running = false;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const p = progress.v;
      for (let i = 0; i < particles.length; i++) {
        const part = particles[i];
        // ease toward target
        const ex = part.x + (part.tx - part.x) * p;
        const ey = part.y + (part.ty - part.y) * p;
        // water-like ripple offset that fades out as we settle
        const ripple = (1 - p) * 6;
        const ox = Math.sin((ey + i) * 0.06 + p * 6) * ripple;
        const oy = Math.cos((ex - i) * 0.05 + p * 5) * ripple;
        const alpha = Math.min(1, p * 1.6) * (0.5 + part.r * 0.4);
        ctx.fillStyle = `rgba(${accent}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(ex + ox, ey + oy, part.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const tween = gsap.to(progress, {
      v: 1,
      duration: 2.2,
      ease: "expo.inOut",
      paused: true,
      onStart: () => {
        running = true;
        draw();
      },
      onComplete: () => {
        running = false;
        cancelAnimationFrame(raf);
        // fade canvas, reveal real button
        gsap.to(canvas, { opacity: 0, duration: 0.5, ease: "power2.out" });
        setRevealed(true);
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: host,
      start: "top 82%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      trigger.kill();
      tween.kill();
      cancelAnimationFrame(raf);
    };
  }, [label, variant]);

  const btnClass = variant === "primary" ? "btn-primary" : "btn-ghost";

  return (
    <div ref={hostRef} className={`relative inline-block h-[52px] min-w-[220px] ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 1 }}
      />
      <button
        onClick={onClick}
        className={`${btnClass} absolute inset-0 w-full transition-opacity duration-500`}
        style={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? "auto" : "none",
        }}
      >
        {label}
      </button>
    </div>
  );
}
