"use client";


import { getCurrentUser } from "@/features/auth/api/auth.api";
import { useQuery } from "@tanstack/react-query";



export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  })
}