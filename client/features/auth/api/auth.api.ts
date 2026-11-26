import { apiRequest } from "@/lib/api";
import { ForgotPasswordPayload, ForgotPasswordResponse, GetCurrentUserResponse, LoginRequest, LoginUserResponse, LogoutResponse, RegisterPayload, RegisterResponse, ResendVerificationPayload, ResendVerificationResponse, ResetPasswordPayload, ResetPasswordResponse, VerifyEmailResponse } from "@/types/auth.types";





export function loginUser(data: LoginRequest): Promise<LoginUserResponse> {
  return apiRequest<LoginUserResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export function registerUser(data: RegisterPayload): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function verifyEmail(
  token: string
): Promise<VerifyEmailResponse> {
  return apiRequest<VerifyEmailResponse>(`/auth/verify-email/${encodeURIComponent(token)}`, {
    method: "GET",
    cache: "no-store"
  })
}

export function resendVerificationEmail(
  payload: ResendVerificationPayload
): Promise<ResendVerificationResponse> {
  return apiRequest<ResendVerificationResponse>(`/auth/resend-verification`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>(`/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function resetPassword(
  token: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  return apiRequest<ResendVerificationResponse>(`/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout(): Promise<LogoutResponse> {
  return apiRequest<LogoutResponse>(`/auth/logout`, {
    method: "POST"
  })
}

export function getCurrentUser(): Promise<GetCurrentUserResponse> {
  return apiRequest<GetCurrentUserResponse>("/auth/me", {
    method: "GET"
  })
}
