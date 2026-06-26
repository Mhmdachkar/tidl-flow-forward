import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerFromQuiz } from "@/lib/auth-storage";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/checkout-schema";
import { clearQuizState } from "@/lib/quiz-storage";
import { createOrder } from "@/lib/order-storage";
import { useAuth } from "@/providers/auth-provider";
import type { CheckoutFormData } from "@/types/order";
import type { QuizFormData } from "@/types/quiz";

interface CheckoutFormProps {
  quiz: QuizFormData;
  defaultValues: CheckoutFormValues;
}

export function CheckoutForm({ quiz, defaultValues }: CheckoutFormProps) {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    let userId = user?.id;

    if (!userId) {
      const registered = registerFromQuiz({
        firstName: values.shipping.firstName,
        lastName: values.shipping.lastName,
        email: quiz.email,
        phone: values.shipping.phone || quiz.phone,
        password: quiz.password,
      });
      userId = registered.user.id;
      refresh();
    }

    const checkoutData: CheckoutFormData = {
      shipping: values.shipping,
      paymentMethod: values.paymentMethod,
      cardNumber: values.cardNumber,
      cardExpiry: values.cardExpiry,
      cardCvc: values.cardCvc,
      cardName: values.cardName,
      agreeTerms: values.agreeTerms,
    };

    const order = createOrder({
      userId,
      quiz,
      checkout: checkoutData,
    });

    clearQuizState();
    void navigate({ to: "/confirmation", search: { orderId: order.id } });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_0_0_1px_rgba(224, 123, 10,0.08)]">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#e07b0a] to-transparent opacity-60" />
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e07b0a] shadow-[0_0_8px_rgba(224, 123, 10,0.7)]" />
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Treatment</p>
            </div>
            <h1 className="mt-3 font-display text-3xl font-medium sm:text-4xl">Complete your order</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A licensed physician will review your information before prescribing treatment.
              Treatment eligibility is determined by a physician.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b85c00] to-[#e07b0a] text-xs font-semibold text-white shadow-[0_2px_8px_rgba(224, 123, 10,0.35)]">
              1
            </span>
            <div>
              <h2 className="text-lg font-medium">Shipping</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Medication ships in temperature-controlled packaging when applicable.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="shipping.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="given-name" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="family-name" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shipping.addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street address</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="address-line1" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shipping.addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="address-line2" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="shipping.city"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="address-level2" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="address-level1"
                      className="h-12 rounded-xl uppercase"
                      maxLength={2}
                      onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="postal-code" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shipping.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" autoComplete="tel" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b85c00] to-[#e07b0a] text-xs font-semibold text-white shadow-[0_2px_8px_rgba(224, 123, 10,0.35)]">
              2
            </span>
            <div>
              <h2 className="text-lg font-medium">Payment</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Your information is securely encrypted.
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment method</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "card", label: "Credit / Debit" },
                    { id: "hsa_fsa", label: "HSA / FSA" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => field.onChange(option.id)}
                      className={`min-h-[56px] rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                        field.value === option.id
                          ? "border-[#b85c00] bg-gradient-to-br from-[rgba(224, 123, 10,0.07)] to-[rgba(224, 123, 10,0.03)] text-foreground shadow-[0_0_0_1px_rgba(224, 123, 10,0.4),0_2px_12px_-4px_rgba(224, 123, 10,0.20)]"
                          : "border-border bg-surface/70 text-muted-foreground hover:border-[#b85c00]/40 hover:bg-surface"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name on card</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="cc-name" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="h-12 rounded-xl"
                    placeholder="4242 4242 4242 4242"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="cardExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="cc-exp" className="h-12 rounded-xl" placeholder="MM/YY" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardCvc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security code</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="numeric" autoComplete="cc-csc" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-surface-2/80">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#e07b0a] to-transparent opacity-50" />
          <div className="p-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e07b0a] shadow-[0_0_6px_rgba(224, 123, 10,0.6)]" />
              <h2 className="text-base font-medium">What happens next</h2>
            </div>
            <ol className="mt-5 space-y-3">
              {[
                "Your assessment is received.",
                "A physician reviews your information.",
                "A prescription is issued if medically appropriate.",
                "A licensed pharmacy prepares your medication.",
                "Your order ships with tracking updates.",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b85c00] to-[#e07b0a] text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  className="mt-1"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-sm font-normal leading-relaxed">
                  I agree to the terms, privacy policy, and medical disclaimer. I understand
                  treatment is not guaranteed and requires physician approval.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="btn-primary w-full justify-center py-4 text-sm disabled:pointer-events-none disabled:opacity-60 lg:w-auto lg:px-10"
        >
          {form.formState.isSubmitting ? "Submitting…" : "Submit for physician review"}
        </button>
      </form>
    </Form>
  );
}
