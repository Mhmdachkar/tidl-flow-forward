import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AccountLayout } from "@/components/account/AccountLayout";
import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Your Account · TIDL" }],
  }),
  component: AccountRoute,
});

function AccountRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({
        to: "/login",
        search: { redirect: "/account" },
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-muted-foreground">
        Loading account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  );
}
