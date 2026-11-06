import { z } from "zod";


export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters."),

  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const roles = ["student", "recruiter", "graduate", "mentor"] as const;

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must be less than 50 characters."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must be less than 50 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters."),
  confirmPassword: z
    .string()
    .min(1, "Confirm password is required")
    .min(6, "Confirm password must be the same as the password."),
  role: z.enum(roles, {
    error: "Please select a valid role.",
  }),
  termsConditions: z.boolean().refine(accepted => accepted, {
    message: "You must accept the Terms of Service and Privacy Policy.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>;