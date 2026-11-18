"use client";
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';

interface Props {

}

const VerifyEmailPending: React.FC<Props> = (props) => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [disabled, setIsDisabled] = useState(false);

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

        <Button type='submit' className={cn("text-white h-11 border-none cursor-pointer rounded-lg bg-primary/60! flex w-full",)}>
          Resend available in 24 hours
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
      </section>
    </section>
  );
}

export default VerifyEmailPending;
