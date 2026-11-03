
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}