"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation";


import { verifyEmail } from '@/features/auth/api/auth.api';




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
    <section>VerifyEmailPage</section>
  )
}

export default VerifyEmailPage