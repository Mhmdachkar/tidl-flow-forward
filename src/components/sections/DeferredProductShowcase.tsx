import { lazy, Suspense, useRef } from "react";
import { useInView } from "framer-motion";

const ProductShowcaseSection = lazy(() =>
  import("@/components/sections/ProductShowcaseSection").then((m) => ({
    default: m.ProductShowcaseSection,
  })),
);

/** Mount showcase only when user scrolls near — avoids jank on initial page load. */
export function DeferredProductShowcase() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const nearView = useInView(sentinelRef, { margin: "480px 0px", once: true });

  return (
    <div
      ref={sentinelRef}
      data-nav-zone="showcase"
      className="showcase-deferred-sentinel"
      style={{ minHeight: nearView ? undefined : "min(100vh, 900px)" }}
    >
      {nearView ? (
        <Suspense
          fallback={
            <div
              aria-hidden
              className="showcase-shell"
              style={{ minHeight: "min(100vh, 900px)", background: "var(--showcase-bg)" }}
            />
          }
        >
          <ProductShowcaseSection />
        </Suspense>
      ) : null}
    </div>
  );
}
