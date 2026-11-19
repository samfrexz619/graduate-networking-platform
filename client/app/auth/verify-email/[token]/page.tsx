"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation";
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import Link from 'next/link';


import { verifyEmail } from '@/features/auth/api/auth.api';
import { Button } from '@/components/ui/button';




type VerificationStatus = "loading" | "success" | "error";


const VerifyEmailPage: React.FC = () => {

  const { token } = useParams<{ token: string }>();

  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  // Prevent duplicate requests during React Strict Mode effect replay.
  const hasRequested = useRef(false);


  useEffect(() => {
    if (!token || hasRequested.current) {
      return;
    }
    hasRequested.current = true;

    const verify = async () => {
      try {
        const res = await verifyEmail(token);

        setStatus("success");
        setMessage(res.message);
      } catch (error) {
        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your email. Please try again"
        );
      }
    }

    verify();
  }, [token]);

  const handleRetry = () => {
    hasRequested.current = false;

    setStatus("loading");
    setMessage("");

    // Re-trigger the verification request.
    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch(error => {
        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your email"
        );
      })
  }

  return (
    <section className="mx-auto w-full max-w-113 pt-16 space-y-5">
      {status === "loading" && (
        <div className="text-center space-y-4">
          <div className="mx-auto size-16 rounded-2xl bg-primary/10 grid place-items-center">
            <LoaderCircle className="size-8 text-primary animate-spin" />
          </div>

          <h2 className="text-2xl font-bold">
            Verifying your email...
          </h2>

          <p className="text-secondary-text">
            Please wait while we verify your OrbitGrad account.
          </p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center space-y-4">
          <div className="mx-auto size-16 rounded-2xl bg-success/10 grid place-items-center">
            <CheckCircle2 className="size-8 text-success" />
          </div>

          <h2 className="text-2xl font-bold">
            Email verified successfully!
          </h2>

          <p className="text-secondary-text">
            {message}
          </p>

          <p className="text-secondary-text">
            Your OrbitGrad account is now ready. You can sign in
            and start building your professional network.
          </p>

          <Link href="/auth/login" className="block">
            <Button className="w-full h-11 text-white">
              Continue to login
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center space-y-4">
          <div className="mx-auto size-16 rounded-2xl bg-error/10 grid place-items-center">
            <XCircle className="size-8 text-error" />
          </div>

          <h2 className="text-2xl font-bold">
            Verification unsuccessful
          </h2>

          <p className="text-secondary-text">
            {message}
          </p>

          <Button
            onClick={handleRetry}
            className="w-full h-11 text-white"
          >
            Try again
          </Button>

          <Link
            href="/auth/login"
            className="block text-primary font-semibold text-sm hover:underline"
          >
            Back to login
          </Link>
        </div>
      )}
    </section>
  )
}

export default VerifyEmailPage