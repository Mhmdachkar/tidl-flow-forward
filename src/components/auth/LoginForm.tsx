import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/auth-schema";
import { useAuth } from "@/providers/auth-provider";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/account" }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values);
    if (result.error) {
      form.setError("root", { message: result.error });
      return;
    }
    void navigate({ to: redirectTo });
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to view your orders, treatment status, and physician updates."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            search={{ redirect: redirectTo }}
            className="font-medium text-foreground underline underline-offset-2 hover:text-[#b85c00] transition-colors"
          >
            Create one
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-xl border-border bg-background transition-shadow focus-visible:border-[#b85c00]/60 focus-visible:ring-2 focus-visible:ring-[#b85c00]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-border bg-background transition-shadow focus-visible:border-[#b85c00]/60 focus-visible:ring-2 focus-visible:ring-[#b85c00]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="btn-primary w-full justify-center py-3.5 text-sm disabled:pointer-events-none disabled:opacity-60"
          >
            {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </Form>
    </AuthLayout>
  );
}
