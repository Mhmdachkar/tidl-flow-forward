export type NavThemeVariant = "light" | "dark";

export interface NavSectionTheme {
  headerBg: string;
  navBg: string;
  variant: NavThemeVariant;
  shadow?: string;
}

export const NAV_THEMES = {
  hero: {
    headerBg: "#FAFAF7",
    navBg: "#FAFAF7",
    variant: "light",
  },
  showcase: {
    headerBg: "#eeede8",
    navBg: "#f5f4f0",
    variant: "light",
  },
  bridge: {
    headerBg: "#e2e2e2",
    navBg: "#e2e2e2",
    variant: "light",
  },
  assessment: {
    headerBg: "#231f20",
    navBg: "#231f20",
    variant: "dark",
    shadow: "0 4px 20px -4px rgba(0,0,0,0.45)",
  },
  doctor: {
    headerBg: "#e2e2e2",
    navBg: "#e2e2e2",
    variant: "light",
  },
  "care-journey": {
    headerBg: "#ffffff",
    navBg: "#ffffff",
    variant: "light",
  },
  discover: {
    headerBg: "#e8eaef",
    navBg: "#e8eaef",
    variant: "light",
  },
  reviews: {
    headerBg: "#FAFAF7",
    navBg: "#FAFAF7",
    variant: "light",
  },
  education: {
    headerBg: "#e2e2e2",
    navBg: "#e2e2e2",
    variant: "light",
  },
  faq: {
    headerBg: "#FAFAF7",
    navBg: "#FAFAF7",
    variant: "light",
  },
  cta: {
    headerBg: "#e2e2e2",
    navBg: "#e2e2e2",
    variant: "light",
  },
  footer: {
    headerBg: "#111111",
    navBg: "#111111",
    variant: "dark",
    shadow: "0 4px 20px -4px rgba(0,0,0,0.45)",
  },
} as const satisfies Record<string, NavSectionTheme>;

export type NavZone = keyof typeof NAV_THEMES;

export const DEFAULT_NAV_ZONE: NavZone = "hero";

export function getNavTheme(zone: string): NavSectionTheme {
  if (zone in NAV_THEMES) {
    return NAV_THEMES[zone as NavZone];
  }
  return NAV_THEMES[DEFAULT_NAV_ZONE];
}

export function resolveNavZoneAtPoint(y: number): NavZone {
  const zones = document.querySelectorAll<HTMLElement>("[data-nav-zone]");
  if (zones.length === 0) return DEFAULT_NAV_ZONE;

  for (const el of zones) {
    const rect = el.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) {
      const zone = el.dataset.navZone;
      if (zone && zone in NAV_THEMES) return zone as NavZone;
    }
  }

  let closest: { zone: NavZone; distance: number } | null = null;
  for (const el of zones) {
    const zone = el.dataset.navZone;
    if (!zone || !(zone in NAV_THEMES)) continue;
    const rect = el.getBoundingClientRect();
    const distance =
      y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
    if (!closest || distance < closest.distance) {
      closest = { zone: zone as NavZone, distance };
    }
  }

  return closest?.zone ?? DEFAULT_NAV_ZONE;
}
