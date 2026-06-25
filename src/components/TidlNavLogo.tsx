import tidlNavLogoLight from "@/assets/tidl-nav-logo-light.png";
import tidlNavLogoDark from "@/assets/tidl-nav-logo-dark.png";

interface TidlNavLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: "tidl-nav-logo--sm",
  md: "tidl-nav-logo--md",
  lg: "tidl-nav-logo--lg",
} as const;

export function TidlNavLogo({ variant = "light", size = "md", className = "" }: TidlNavLogoProps) {
  return (
    <span
      className={`tidl-nav-logo tidl-nav-logo--${variant} ${SIZE_CLASS[size]} ${className}`.trim()}
      aria-hidden
    >
      <img
        src={variant === "dark" ? tidlNavLogoDark : tidlNavLogoLight}
        alt=""
        className="tidl-nav-logo__img"
        draggable={false}
      />
    </span>
  );
}
