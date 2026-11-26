"use client";

import { useCurrentUser } from "./useCurrentUser";

export function useAuth() {
  const query = useCurrentUser();

  return {
    user: query.data?.data ?? null,
    isLoading: query.isPending,
    isAuthenticated: !!query.data?.data,
    error: query.error,
  };
}