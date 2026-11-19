import { apiRequest } from "@/lib/api";
import { LoginRequest, RegisterPayload, RegisterResponse, ResendVerificationPayload, ResendVerificationResponse, VerifyEmailResponse } from "@/types/auth.types";





export function loginUser(data: LoginRequest) {
  return apiRequest("/auth/login", {
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
