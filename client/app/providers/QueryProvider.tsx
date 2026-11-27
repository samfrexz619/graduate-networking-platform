"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
// import {
//   ReactQueryDevtools,
// } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";


export default function QueryProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 6 * 1000,
            retry: 1
          }
        }
      })
  );

  useEffect(() => {
    const handleSessionExpired = () => {
      // Remove cached authenticated data
      queryClient.clear();

      router.replace("/auth/login?sessionExpired=true");
    }
    window.addEventListener("session-expired", handleSessionExpired);

    return () => window.removeEventListener("session-expired", handleSessionExpired)
  }, [queryClient, router])
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}