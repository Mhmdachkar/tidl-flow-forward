/** TIDL brand tokens: match Hero / Showcase / Assessment sections. */
export const TIDL_BRAND = {
  ink: "#231f20",
  inkMuted: "#6b6a6b",
  accent: "#e07b0a",
  accentDeep: "#b85c00",
  accentBright: "#f09012",
  accentRgb: "224, 123, 10",
  bg: "#FAFAF7",
  bgSoft: "#f5f4f0",
  surface: "#ffffff",
} as const;

/** Mobile-first spacing / layout tokens (mirrors :root in styles.css). */
export const TIDL_LAYOUT = {
  sectionPx: "var(--section-px)",
  sectionPy: "var(--section-py)",
  contentMaxWide: "var(--content-max-wide)",
  contentMaxNarrow: "var(--content-max-narrow)",
  touchMin: "var(--touch-min)",
  ctaMinHeight: "var(--cta-min-height)",
} as const;

/** Embedded typography for Doctor → Footer (wins over Tailwind layer order). */
export const TIDL_BRAND_STYLES = `
.tidl-brand-section {
  --tidl-ink: ${TIDL_BRAND.ink};
  --tidl-ink-muted: ${TIDL_BRAND.inkMuted};
  --tidl-accent: ${TIDL_BRAND.accent};
  --tidl-bg: ${TIDL_BRAND.bg};
  --tidl-section-px: var(--section-px, 1.25rem);
  --tidl-section-py: var(--section-py, 2.5rem);
  --tidl-body-size: 1rem;
  color: var(--tidl-ink);
}

.tidl-brand-section h1,
.tidl-brand-section h2,
.tidl-brand-section h3,
.tidl-brand-section h4,
.tidl-brand-section h5,
.tidl-brand-section h6,
.tidl-brand-section .font-display,
.tidl-brand-section .tidl-display {
  font-family: 'Archivo Narrow', sans-serif !important;
}

.tidl-brand-section .tidl-eyebrow,
.tidl-brand-section .tidl-label,
.tidl-brand-section .font-blair {
  font-family: 'Josefin Sans', sans-serif !important;
}

.tidl-brand-section .uppercase {
  font-family: 'Josefin Sans', sans-serif;
}

.tidl-brand-section p,
.tidl-brand-section li,
.tidl-brand-section .tidl-body {
  font-family: 'Archivo', system-ui, sans-serif;
  font-size: var(--tidl-body-size);
}
`;
