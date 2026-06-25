import { useEffect, useState } from "react";
import { getScrollPosition, hasLenis } from "@/lib/lenis-store";
import {
  DEFAULT_NAV_ZONE,
  getNavTheme,
  resolveNavZoneAtPoint,
  type NavSectionTheme,
  type NavZone,
} from "@/lib/nav-section-themes";

interface NavSectionThemeState {
  zone: NavZone;
  theme: NavSectionTheme;
  scrollY: number;
  isPinned: boolean;
}

export function useNavSectionTheme(
  enabled: boolean,
  headerHeight: number,
): NavSectionThemeState {
  const [state, setState] = useState<NavSectionThemeState>(() => {
    const scrollY = getScrollPosition();
    const zone = DEFAULT_NAV_ZONE;
    return {
      zone,
      theme: getNavTheme(zone),
      scrollY,
      isPinned: enabled ? scrollY > 8 : true,
    };
  });

  useEffect(() => {
    if (!enabled) {
      const scrollY = getScrollPosition();
      setState({
        zone: DEFAULT_NAV_ZONE,
        theme: getNavTheme(DEFAULT_NAV_ZONE),
        scrollY,
        isPinned: scrollY > 48,
      });
      return;
    }

    let frame = 0;
    let pendingScrollY = getScrollPosition();
    let pendingHeight = headerHeight;

    const apply = (scrollY: number, height: number) => {
      const probeY = Math.max(height, 48) + 2;
      const zone = resolveNavZoneAtPoint(probeY);
      setState({
        zone,
        theme: getNavTheme(zone),
        scrollY,
        isPinned: scrollY > 8,
      });
    };

    const schedule = (scrollY: number, height = pendingHeight) => {
      pendingScrollY = scrollY;
      pendingHeight = height;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply(pendingScrollY, pendingHeight);
      });
    };

    const onNativeScroll = () => {
      if (hasLenis()) return;
      schedule(window.scrollY);
    };

    const onLenisScroll = (event: Event) => {
      const detail = (event as CustomEvent<{ scroll: number }>).detail;
      if (typeof detail?.scroll === "number") schedule(detail.scroll);
    };

    const onResize = () => schedule(getScrollPosition(), headerHeight);

    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("tidl:lenis-scroll", onLenisScroll);
    window.addEventListener("resize", onResize);

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => schedule(getScrollPosition(), headerHeight))
        : null;
    observer?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-nav-zone"],
    });

    schedule(getScrollPosition(), headerHeight);

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("tidl:lenis-scroll", onLenisScroll);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, headerHeight]);

  return state;
}
