import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LifeBuoy, Package, Pill, Settings } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { NavSection } from "@/components/sections/NavSection";

const NAV_ITEMS = [
  { to: "/account", label: "Home", icon: Home, exact: true },
  { to: "/account/orders", label: "Orders", icon: Package, exact: false },
  { to: "/account/treatment", label: "Treatment", icon: Pill, exact: false },
  { to: "/account/support", label: "Support", icon: LifeBuoy, exact: false },
  { to: "/account/settings", label: "Account", icon: Settings, exact: false },
] as const;

export function AccountLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-svh bg-background pb-24 lg:pb-8">
      {/* Shared site nav: dark mode */}
      <NavSection />

      {/* Page title bar */}
      <div className="border-b border-border/60 bg-background/80 px-4 py-5 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            TIDL Account
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium">
            Good {getGreeting()},{" "}
            <span className="text-[#C9A200]">{user?.firstName}</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-6">
        {/* Desktop sidebar nav */}
        <nav className="hidden lg:block">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                      active
                        ? "bg-surface font-medium text-foreground shadow-[0_0_0_1px_rgba(243,195,0,0.15)] [&_svg]:text-[#C9A200]"
                        : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main>{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-3 text-[11px] transition-colors",
                    active ? "text-[#C9A200]" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
