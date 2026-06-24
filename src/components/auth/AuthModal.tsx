import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth } from "@/providers/auth-provider";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import {
  loginSchema,
  signupSchema,
  type LoginFormValues,
  type SignupFormValues,
} from "@/lib/auth-schema";

const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-border bg-white px-4 text-[15px] text-foreground transition-shadow placeholder:text-muted-foreground/60 focus:border-[#C9A200]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A200]/20";

const FIELD_ERROR = "mt-1.5 text-[12px] font-medium text-red-500";

export function AuthModal() {
  const { isOpen, mode, redirectTo, openModal, setMode, closeModal } = useAuthModal();
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock page scroll + pause Lenis while open
  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      lockPageScroll();
      return () => unlockPageScroll();
    }
  }, [isOpen, mounted]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Reset forms + scroll when opening or switching mode
  useEffect(() => {
    if (isOpen) {
      loginForm.clearErrors();
      signupForm.clearErrors();
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

  const onLogin = async (values: LoginFormValues) => {
    const result = await login(values);
    if (result.error) {
      loginForm.setError("root", { message: result.error });
      return;
    }
    closeModal();
    void navigate({ to: redirectTo });
  };

  const onSignup = async (values: SignupFormValues) => {
    const result = await signup({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
    if (result.error) {
      signupForm.setError("root", { message: result.error });
      return;
    }
    closeModal();
    void navigate({ to: redirectTo });
  };

  if (!mounted) return null;

  const isLogin = mode === "login";

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          transition: "opacity 0.35s ease",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[3px]"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Slide-in panel from the right */}
      <div
        className="fixed inset-y-0 right-0 z-[91] flex"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        aria-modal="true"
        role="dialog"
        aria-label={isLogin ? "Login" : "Create account"}
      >
        <div
          style={{
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
          }}
          className="relative flex h-full w-screen flex-col bg-white shadow-[-12px_0_70px_rgba(0,0,0,0.2)] sm:w-[460px] lg:w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative flex shrink-0 items-center justify-center border-b border-border/50 px-6 py-5">
            <button
              type="button"
              onClick={closeModal}
              className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white text-foreground/50 transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <span className="text-[15px] font-semibold text-foreground">
              {isLogin ? "Login" : "Create account"}
            </span>
          </div>

          {/* Scrollable body */}
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-7 py-8 sm:px-9"
          >
            <h2 className="text-[26px] font-semibold tracking-tight text-foreground">
              {isLogin ? "Welcome back" : "Let's get started"}
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
              {isLogin
                ? "Sign in to view your orders, treatment status, and physician updates."
                : "Create an account to save your progress and manage your treatment."}
            </p>

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="mt-7 space-y-4">
                <div>
                  <input
                    {...loginForm.register("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    className={INPUT_CLASS}
                  />
                  {loginForm.formState.errors.email && (
                    <p className={FIELD_ERROR}>{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...loginForm.register("password")}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    className={INPUT_CLASS}
                  />
                  {loginForm.formState.errors.password && (
                    <p className={FIELD_ERROR}>{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[13px] font-medium text-[#B28B00] transition-colors hover:text-[#C9A200]"
                  >
                    Forgot your password?
                  </button>
                </div>

                {loginForm.formState.errors.root && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                    {loginForm.formState.errors.root.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full rounded-xl bg-[#1A1816] py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-85 disabled:pointer-events-none disabled:opacity-60"
                >
                  {loginForm.formState.isSubmitting ? "Signing in…" : "Log in"}
                </button>

                <p className="pt-1 text-center text-[13px] text-muted-foreground">
                  First time here?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-semibold text-[#B28B00] transition-colors hover:text-[#C9A200]"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="mt-7 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      {...signupForm.register("firstName")}
                      autoComplete="given-name"
                      placeholder="First name"
                      className={INPUT_CLASS}
                    />
                    {signupForm.formState.errors.firstName && (
                      <p className={FIELD_ERROR}>{signupForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...signupForm.register("lastName")}
                      autoComplete="family-name"
                      placeholder="Last name"
                      className={INPUT_CLASS}
                    />
                    {signupForm.formState.errors.lastName && (
                      <p className={FIELD_ERROR}>{signupForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    {...signupForm.register("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    className={INPUT_CLASS}
                  />
                  {signupForm.formState.errors.email && (
                    <p className={FIELD_ERROR}>{signupForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...signupForm.register("phone")}
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone"
                    className={INPUT_CLASS}
                  />
                  {signupForm.formState.errors.phone && (
                    <p className={FIELD_ERROR}>{signupForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...signupForm.register("password")}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password (min. 8 characters)"
                    className={INPUT_CLASS}
                  />
                  {signupForm.formState.errors.password && (
                    <p className={FIELD_ERROR}>{signupForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...signupForm.register("confirmPassword")}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    className={INPUT_CLASS}
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className={FIELD_ERROR}>{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {signupForm.formState.errors.root && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                    {signupForm.formState.errors.root.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={signupForm.formState.isSubmitting}
                  className="w-full rounded-xl bg-[#1A1816] py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-85 disabled:pointer-events-none disabled:opacity-60"
                >
                  {signupForm.formState.isSubmitting ? "Creating account…" : "Create account"}
                </button>

                <p className="pt-1 text-center text-[13px] text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-[#B28B00] transition-colors hover:text-[#C9A200]"
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}

            {/* Divider */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[12px] text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social (visual only) */}
            <div className="space-y-2.5">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white py-3.5 text-[14px] font-medium text-foreground transition-colors hover:bg-surface"
              >
                <GoogleGlyph />
                Continue with Google
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white py-3.5 text-[14px] font-medium text-foreground transition-colors hover:bg-surface"
              >
                <AppleGlyph />
                Continue with Apple
              </button>
            </div>

            {/* Promo card */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF9E0] to-[#FBF2C9] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6D00]">
                Get the most out of your care
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5C4A12]">
                Track your treatment, message your care team, and manage refills. all in one secure place.
              </p>
            </div>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
              Secure &amp; private · Physician reviewed
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.2a5.3 5.3 0 0 1-2.3 3.48v2.88h3.72c2.18-2 3.44-4.96 3.44-8.37Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.1 0 5.7-1.03 7.62-2.78l-3.72-2.88c-1.03.7-2.36 1.1-3.9 1.1-3 0-5.55-2.02-6.46-4.74H1.7v2.98A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.54 14.7a7.2 7.2 0 0 1 0-4.6V7.12H1.7a12 12 0 0 0 0 9.76l3.84-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.69 0 3.2.58 4.4 1.72l3.3-3.3C17.7 1.2 15.1 0 12 0A12 12 0 0 0 1.7 7.12l3.84 2.98C6.45 7.38 9 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.78c.02 2.45 2.15 3.27 2.17 3.28-.02.06-.34 1.16-1.12 2.3-.67.98-1.37 1.96-2.47 1.98-1.08.02-1.43-.64-2.66-.64-1.24 0-1.62.62-2.64.66-1.06.04-1.87-1.06-2.55-2.04-1.38-2-2.44-5.66-1.02-8.13.7-1.23 1.96-2 3.33-2.02 1.04-.02 2.02.7 2.66.7.63 0 1.83-.86 3.08-.74.53.02 2 .21 2.95 1.6-.08.05-1.76 1.03-1.74 3.07M14.4 4.5c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.82-.46 2.38-1.14" />
    </svg>
  );
}
