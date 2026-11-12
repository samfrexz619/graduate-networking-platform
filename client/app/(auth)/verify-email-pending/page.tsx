import React from 'react';

interface Props {

}

const VerifyEmailPendingPage: React.FC<Props> = (props) => {
  return (
    <div>

    </div>
  );
}

export default VerifyEmailPendingPage;

/*
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPendingPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="size-8 text-primary" />
      </div>

      <h1 className="text-2xl font-bold">
        Check your inbox
      </h1>

      <p className="mt-3 text-sm leading-6 text-secondary-text">
        We've sent a verification link to{" "}
        <span className="font-semibold text-foreground">
          {email || "your email address"}
        </span>.
        Please verify your email address to activate your OrbitGrad account.
      </p>

      <p className="mt-3 text-sm text-secondary-text">
        The verification link expires in 24 hours.
      </p>

      <Link
        href="/login"
        className="mt-6 font-semibold text-primary hover:underline"
      >
        Back to login
      </Link>
    </section>
  );
}
*/