import { ApiError } from "@/features/auth/utils/ApiError";

const API_BASE_URL = "/api";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit): Promise<T> {

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });

  let data;

  try {
    data = await res.json();

  } catch (error) {
    throw new ApiError("The server returned an invalid response.", res.status);
  }


  if (!res.ok) {
    if (res.status === 401 && endpoint !== "/auth/login") {
      if (typeof window !== undefined) {
        window.dispatchEvent(new Event("session-expired"))
      }
    }
    throw new ApiError(
      data?.message || "Something went wrong",
      res.status
    )
  }

  return data as T;
}