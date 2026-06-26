import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { getAiSearchResult, getAiSearchSuggestions, getCategoryPath, type AiSearchResult } from "@/lib/ai-search";
import { TIDL_BRAND } from "@/lib/tidl-brand";
import { useQuizModal } from "@/providers/quiz-modal-provider";

type AiSearchExperienceProps = {
  initialQuery?: string;
  compact?: boolean;
};

export function AiSearchExperience({ initialQuery = "", compact = false }: AiSearchExperienceProps) {
  const { openModal } = useQuizModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<AiSearchResult | null>(
    initialQuery.trim() ? getAiSearchResult(initialQuery) : null,
  );
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      setResult(getAiSearchResult(initialQuery));
    }
  }, [initialQuery]);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setIsSearching(true);
    window.setTimeout(() => {
      setResult(getAiSearchResult(trimmed));
      setIsSearching(false);
    }, 420);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const suggestions = getAiSearchSuggestions();

  return (
    <div className={compact ? "w-full" : "mx-auto w-full max-w-3xl"}>
      <form onSubmit={onSubmit} className="relative">
        <label htmlFor={compact ? "ai-search-input-compact" : "ai-search-input"} className="sr-only">
          Describe your health goal
        </label>
        <input
          ref={inputRef}
          id={compact ? "ai-search-input-compact" : "ai-search-input"}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your goal. e.g. lose weight with GLP-1 care"
          className="w-full rounded-full border px-5 py-4 pr-14 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 focus:shadow-[0_0_0_4px_rgba(224, 123, 10,0.18)] sm:px-6 sm:py-[1.15rem] sm:text-base"
          style={{
            borderColor: "rgba(35,31,32,0.14)",
            background: TIDL_BRAND.surface,
            color: TIDL_BRAND.ink,
          }}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-40 sm:h-11 sm:w-11"
          style={{ background: TIDL_BRAND.accent, color: TIDL_BRAND.ink }}
          aria-label="Search treatments"
        >
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              runSearch(suggestion);
            }}
            className="rounded-full border px-3.5 py-1.5 text-left text-[12px] transition-colors duration-200 hover:border-[rgba(224, 123, 10,0.55)] sm:text-[13px]"
            style={{
              borderColor: "rgba(35,31,32,0.12)",
              background: "rgba(255,255,255,0.72)",
              color: TIDL_BRAND.inkMuted,
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {isSearching && (
        <p className="mt-8 text-center text-sm" style={{ color: TIDL_BRAND.inkMuted }}>
          Matching your goal to physician-guided care…
        </p>
      )}

      {result && !isSearching && (
        <div
          className="mt-8 overflow-hidden rounded-[1.75rem] border"
          style={{
            borderColor: "rgba(35,31,32,0.1)",
            background: TIDL_BRAND.surface,
            boxShadow: "0 28px 60px -36px rgba(35,31,32,0.35)",
          }}
        >
          <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: "rgba(35,31,32,0.08)" }}>
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(224, 123, 10,0.16)", color: TIDL_BRAND.ink }}
                aria-hidden
              >
                <Sparkles size={16} />
              </span>
              <div>
                <p className="tidl-eyebrow" style={{ color: "rgba(35,31,32,0.45)" }}>
                  Grounded recommendation
                </p>
                <p className="mt-1 text-[15px] leading-relaxed sm:text-base" style={{ color: TIDL_BRAND.ink }}>
                  {result.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:p-6">
            {result.productImage ? (
              <div
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl sm:mx-0"
                style={{ background: TIDL_BRAND.bgSoft }}
              >
                <img
                  src={result.productImage}
                  alt=""
                  className="max-h-24 max-w-[5.5rem] object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}

            <div>
              <p className="tidl-eyebrow" style={{ color: TIDL_BRAND.accent }}>
                {result.goalLabel}
              </p>
              <h3
                className="tidl-display mt-1 text-[clamp(1.35rem,3vw,1.75rem)]"
                style={{ color: TIDL_BRAND.ink }}
              >
                {result.productName}
              </h3>
              <p className="mt-2 text-sm leading-relaxed sm:text-[15px]" style={{ color: TIDL_BRAND.inkMuted }}>
                {result.productDescription}
              </p>
              <p className="mt-3 text-sm font-medium" style={{ color: TIDL_BRAND.ink }}>
                From ${result.startingPrice}/mo if prescribed
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/products/$slug"
                  params={{ slug: result.productSlug }}
                  className="inline-flex min-h-[var(--cta-min-height,48px)] items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-[filter] duration-200 hover:brightness-95"
                  style={{
                    background: TIDL_BRAND.accent,
                    color: TIDL_BRAND.ink,
                    boxShadow: "0 12px 28px rgba(224, 123, 10,0.28)",
                  }}
                >
                  View treatment
                </Link>
                <button
                  type="button"
                  onClick={() => openModal({ goal: result.goalId, product: result.productSlug })}
                  className="inline-flex min-h-[var(--cta-min-height,48px)] items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 hover:bg-black/[0.03]"
                  style={{ borderColor: "rgba(35,31,32,0.14)", color: TIDL_BRAND.ink }}
                >
                  Start assessment
                </button>
                <a
                  href={getCategoryPath(result.categorySlug)}
                  className="inline-flex min-h-[var(--cta-min-height,48px)] items-center justify-center px-1 text-sm font-medium underline-offset-4 hover:underline"
                  style={{ color: TIDL_BRAND.inkMuted }}
                >
                  Explore {result.categoryTitle}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-[11px] leading-relaxed sm:text-xs" style={{ color: "rgba(35,31,32,0.45)" }}>
        Clinical guidance powered by TIDL&apos;s care pathways. Medical questions are always reviewed by a licensed physician, never answered by a bot.
      </p>
    </div>
  );
}
