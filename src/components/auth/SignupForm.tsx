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
import { signupSchema, type SignupFormValues } from "@/lib/auth-schema";
import { useAuth } from "@/providers/auth-provider";

interface SignupFormProps {
  redirectTo?: string;
  defaultValues?: Partial<SignupFormValues>;
}

const INPUT_CLASS =
  "h-12 rounded-xl border-border bg-background transition-shadow focus-visible:border-[#C9A200]/60 focus-visible:ring-2 focus-visible:ring-[#C9A200]/20";

export function SignupForm({ redirectTo = "/account", defaultValues }: SignupFormProps) {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      password: defaultValues?.password ?? "",
      confirmPassword: defaultValues?.confirmPassword ?? "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    const result = await signup({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });

    if (result.error) {
      form.setError("root", { message: result.error });
      return;
    }

    void navigate({ to: redirectTo });
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Save your progress, track physician review, and manage your treatment."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            search={{ redirect: redirectTo }}
            className="font-medium text-foreground underline underline-offset-2 hover:text-[#C9A200] transition-colors"
          >
            Sign in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">First name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="given-name" placeholder="Jane" className={INPUT_CLASS} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">Last name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="family-name" placeholder="Smith" className={INPUT_CLASS} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    className={INPUT_CLASS}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 000-0000"
                    className={INPUT_CLASS}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Security</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className={INPUT_CLASS}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={INPUT_CLASS}
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
            {form.formState.isSubmitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            By creating an account you agree to TIDL&apos;s{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
              terms of service
            </span>{" "}
            and{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
              privacy policy
            </span>
            .
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}
