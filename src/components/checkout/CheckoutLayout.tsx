import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

interface CheckoutLayoutProps {
  children: ReactNode;
  summary: ReactNode;
}

export function CheckoutLayout({ children, summary }: CheckoutLayoutProps) {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← TIDL
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <ShieldCheck className="h-4 w-4 text-clinical" />
            Secure checkout
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-6 lg:py-12">
        <div>{children}</div>
        <aside className="lg:sticky lg:top-8 lg:self-start">{summary}</aside>
      </div>
    </div>
  );
}
