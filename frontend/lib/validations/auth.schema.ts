import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(120, "Full name must not exceed 120 characters"),
    email: z.string().trim().email("Invalid email address"),
    phone: z.preprocess(
      (value) => {
        if (typeof value !== "string") {
          return value;
        }

        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      },
      z
        .string()
        .min(8, "Phone number must be at least 8 characters")
        .max(20, "Phone number must not exceed 20 characters")
        .optional()
    ),
    role: z.enum(["user", "seller"], {
      message: "Role is required",
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormValues = z.output<typeof registerSchema>;
export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormValues = z.output<typeof loginSchema>;
