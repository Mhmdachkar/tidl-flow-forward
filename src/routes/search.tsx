import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { AiSearchExperience } from "@/components/search/AiSearchExperience";
import { TIDL_BRAND, TIDL_BRAND_STYLES } from "@/lib/tidl-brand";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/search")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Find Your Treatment · TIDL" },
      {
        name: "description",
        content:
          "Describe your health goal and discover physician-guided TIDL treatments grounded in clinical care pathways.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();

  return (
    <div className="tidl-brand-section min-h-svh" style={{ background: TIDL_BRAND.bg, color: TIDL_BRAND.ink }}>
      <style>{TIDL_BRAND_STYLES}</style>

      <header
        className="border-b px-5 py-4 sm:px-8"
        style={{ borderColor: "rgba(35,31,32,0.08)", background: "rgba(250,250,247,0.92)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: TIDL_BRAND.inkMuted }}
          >
            ← Back to home
          </Link>
          <span className="tidl-eyebrow hidden sm:inline" style={{ color: "rgba(35,31,32,0.4)" }}>
            TIDL · Treatment discovery
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 text-center">
          <p className="tidl-eyebrow mb-3" style={{ color: "rgba(35,31,32,0.45)" }}>
            AI-guided discovery
          </p>
          <h1 className="tidl-display text-[clamp(2rem,5vw,3rem)] tracking-[-0.025em]">
            What are you{" "}
            <span className="italic" style={{ color: TIDL_BRAND.accent }}>
              working toward?
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: TIDL_BRAND.inkMuted }}>
            Describe your goal in your own words. We&apos;ll match you to physician-guided care
            paths and treatments, grounded in TIDL&apos;s clinical knowledge, not generic chat.
          </p>
        </div>

        <AiSearchExperience initialQuery={q ?? ""} />
      </main>
    </div>
  );
}
