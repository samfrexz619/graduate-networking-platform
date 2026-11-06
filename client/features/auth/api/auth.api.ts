import { apiRequest } from "@/lib/api";
import { LoginRequest } from "@/types/auth.types";


export function login(data: LoginRequest) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}