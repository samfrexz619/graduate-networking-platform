import { RegisterFormData } from "@/features/auth/schemas/auth.schema";


export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type RegisterPayload = Pick<
  RegisterFormData,
  "firstName" | "lastName" | "email" | "password" | "role"
>;

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: RegisterFormData["role"];
  };
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  retryAfterSeconds?: number;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ForgotPasswordPayload extends ResendVerificationPayload { }

export interface ForgotPasswordResponse extends VerifyEmailResponse { }

export interface ResetPasswordResponse extends VerifyEmailResponse { }

export interface ResetPasswordPayload {
  password: string;
}
