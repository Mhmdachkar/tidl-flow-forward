import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SignupForm } from "@/components/auth/SignupForm";

const signupSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: (search) => signupSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Create Account — TIDL" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { redirect: redirectTo } = Route.useSearch();
  return <SignupForm redirectTo={redirectTo ?? "/account"} />;
}
