import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/components/MagneticButton";

import voxel from "@/assets/kling_20260617_作品_REFERENCE__2212_0.mp4";

export function VoxelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const pin = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: true,
      onEnter: () => video.play().catch(() => {}),
      onEnterBack: () => video.play().catch(() => {}),
    });

    gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, ease: "expo.out",
      scrollTrigger: { trigger: section, start: "+=110% top", end: "+=70%", scrub: 1 },
    });

    return () => { pin.kill(); };
  }, []);

  return (
    <section id="science" ref={sectionRef} className="relative h-[100svh] overflow-hidden bg-[#0d1117]">
      <video
        ref={videoRef}
        src={voxel}
        muted
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/0" />

      <div ref={contentRef} className="absolute inset-x-0 bottom-0 z-20 px-6 pb-16">
        <div className="mx-auto max-w-5xl text-center text-white">
          <span className="pill-tag mb-6 !bg-white/10 !border-white/20 !text-white/85">
            <span className="dot !bg-[#F9DC6B]" /> Voxel-level diagnostics
          </span>
          <h2 className="font-display text-[clamp(2rem,5.6vw,4.8rem)] leading-[1.02]">
            We rebuild you, <span className="italic text-gradient-clinical">one voxel at a time.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            High-resolution imaging, continuous biomarkers and lifestyle data are fused into a living model of your physiology — the substrate for every TIDL decision.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <MagneticButton className="btn-primary">Explore the science</MagneticButton>
            <MagneticButton className="btn-ghost !bg-white/8 !text-white !border-white/25">Read the methodology</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
