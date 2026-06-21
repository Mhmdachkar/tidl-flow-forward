import { z } from "zod";

const shippingSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  addressLine1: z.string().min(1, "Please enter your street address."),
  addressLine2: z.string(),
  city: z.string().min(1, "Please enter your city."),
  state: z.string().min(2, "Please enter your state.").max(2, "Use 2-letter state code."),
  zip: z
    .string()
    .min(5, "Please enter a valid ZIP code.")
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code."),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number.")
    .regex(/^[\d\s()+-]+$/, "Please enter a valid phone number."),
});

export const checkoutSchema = z
  .object({
    shipping: shippingSchema,
    paymentMethod: z.enum(["card", "hsa_fsa"]),
    cardNumber: z.string(),
    cardExpiry: z.string(),
    cardCvc: z.string(),
    cardName: z.string(),
    agreeTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to continue.",
    }),
  })
  .superRefine((data, ctx) => {
    const digits = data.cardNumber.replace(/\s/g, "");
    if (digits.length < 15 || digits.length > 16 || !/^\d+$/.test(digits)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid card number.",
        path: ["cardNumber"],
      });
    }

    if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use MM/YY format.",
        path: ["cardExpiry"],
      });
    }

    if (!/^\d{3,4}$/.test(data.cardCvc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid security code.",
        path: ["cardCvc"],
      });
    }

    if (!data.cardName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter the name on your card.",
        path: ["cardName"],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
