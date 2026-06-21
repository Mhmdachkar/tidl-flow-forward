import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email.").email("Please enter a valid email."),
  password: z.string().min(1, "Please enter your password."),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name."),
    lastName: z.string().min(1, "Please enter your last name."),
    email: z.string().min(1, "Please enter your email.").email("Please enter a valid email."),
    phone: z
      .string()
      .min(10, "Please enter a valid phone number.")
      .regex(/^[\d\s()+-]+$/, "Please enter a valid phone number."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must be 72 characters or fewer."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
