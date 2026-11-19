"use client";
import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from '../api/auth.api';
import { toast } from '@/components/ui/toast';

interface Props {

}

const VerifyEmailPending: React.FC<Props> = (props) => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendVerification = async () => {
    if (!email || isResending || resendCooldown > 0) {
      return;
    }
    try {
      setIsResending(true);

      const res = await resendVerificationEmail({ email });
      toast.add({
        type: "success",
        description: res.message
      });

      setResendCooldown(60);
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message
        });
      } else {
        toast.add({
          type: "error",
          description: "Unable to resend verification email."
        });
      }

    } finally {
      setIsResending(false);
    }
  }

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const timer = setTimeout(() => {
      setResendCooldown(prev => prev - 1)
    }, 1000);

    return () => clearTimeout(timer);

  }, [resendCooldown])

  return (
    <section>
      <div className='w-full hidden lg:flex justify-between items-center'>
        <p className='text-13'>New to OrbitGrad?</p>
        <Link href="/auth/login" className='font-semibold text-primary text-14'>Back to login</Link>
      </div>

      <section className='pt-20 w-full md:w-113 mx-auto space-y-3'>
        <div className='size-14 rounded-2xl grid place-items-center text-primary bg-[#EEF2FF]'>
          <Mail />
        </div>
        <h2 className='text-[33px] font-bold'>Verify your email address.</h2>
        <p>We've sent a verification link to your email address. Please verify your email to activate your OrbitGrad account.</p>

        <div className='w-full bg-[#F8FAFC] h-12.25 pl-3 rounded-lg flex items-center'>
          <p className='font-semibold text-14'>
            {email || "example@test.com"}
          </p>
        </div>

        <Button
          disabled={isResending || resendCooldown > 0}
          onClick={handleResendVerification}
          type='submit' className={cn("text-white h-11 border-none cursor-pointer rounded-lg bg-primary/60! flex w-full",)}>
          {isResending
            ? "Sending..."
            : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend verification email"}
        </Button>
        <p className="mt-5 text-sm text-secondary-text">
          The verification link expires in 24 hours.
        </p>

        <Link
          href="/auth/login"
          className="mt-6 font-semibold text-14 text-primary flex justify-center hover:underline"
        >
          Back to login
        </Link>

        <p className='text-13 mt-6 text-[#64748B]'>Request received. Please check your inbox and spam folder.</p>
      </section>
    </section>
  );
}

export default VerifyEmailPending;
