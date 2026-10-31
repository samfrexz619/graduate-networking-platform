import React from "react";
import AuthBanner from "@/features/auth/components/AuthBanner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background flex justify-between">
      <section className="w-165 bg-[F8FAFC] h-full p-14">
        <AuthBanner />
      </section>
      <section className="flex-1 bg-white p-16">
        {children}
      </section>
    </main>
  );
}