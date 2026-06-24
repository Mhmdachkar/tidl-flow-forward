import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { LoginForm } from "@/components/auth/LoginForm";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Sign In · TIDL" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  return <LoginForm redirectTo={redirectTo ?? "/account"} />;
}
