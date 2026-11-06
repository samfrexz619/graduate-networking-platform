import React from "react";
import AuthBanner from "@/features/auth/components/AuthBanner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="fixed inset-0 overflow-hidden bg-background flex justify-between">
      <section className="hidden lg:block w-1/2 xl:w-165 h-screen shrink-0 overflow-hidden bg-[#F8FAFC] px-14 py-10">
        <AuthBanner />
      </section>
      <section className="flex-1 h-full min-h-0 overflow-y-auto bg-white p-8 md:p-16">
        {children}
      </section>
    </main>
  );
}