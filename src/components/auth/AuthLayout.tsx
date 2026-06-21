import { Link } from "@tanstack/react-router";
import { ShieldCheck, Lock } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background px-4 py-10 sm:px-6">
      {/* Subtle gold radial glow behind card */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/4 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(243,195,0,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_4px_40px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(243,195,0,0.08)]">
          {/* Gold accent stripe at top */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F3C300] to-transparent opacity-70" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F3C300] shadow-[0_0_8px_rgba(243,195,0,0.7)]" />
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                TIDL Account
              </p>
            </div>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

            <div className="mt-8">{children}</div>
          </div>

          {/* Trust strip at bottom of card */}
          <div className="border-t border-border/60 bg-surface-2/60 px-6 py-3 sm:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
              {[
                { icon: ShieldCheck, label: "Secure & encrypted" },
                { icon: Lock, label: "HIPAA-aligned" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-[#C9A200]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
