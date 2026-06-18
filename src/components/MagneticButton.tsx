import { useEffect, useRef, type PropsWithChildren, type CSSProperties } from "react";

export function MagneticButton({
  children,
  className = "",
  style,
  as = "button",
  href,
  onClick,
}: PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
}>) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: Event) => {
      const ev = e as globalThis.MouseEvent;
      const r = el.getBoundingClientRect();
      const x = ev.clientX - r.left - r.width / 2;
      const y = ev.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px) scale(1.04)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0) scale(1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const cls = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide will-change-transform transition-[box-shadow,background] duration-300 ${className}`;
  if (as === "a") {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} onClick={onClick} className={cls} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}
