"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader, Mail } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '@/components/ui/CustomInput';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../schemas/auth.schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { forgotPassword } from '../api/auth.api';
import { toast } from '@/components/ui/toast';
import { cn } from 'cn';



interface ForgotPasswordProps {

}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      console.log(data);
      const res = await forgotPassword(data);
      toast.add({
        type: "success",
        description: res.message
      });
      setShowForgotPassword(true);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message
        });
      } else {
        toast.add({
          type: "error",
          description: "Unable to send reset link."
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='w-full max-w-110 mx-auto h-full'>
      <div className='w-full hidden lg:flex justify-between items-center'>
        <p className='text-13'>New to OrbitGrad?</p>
        <Link href="/auth/auth" className='font-semibold text-primary text-14'>Back to Login</Link>
      </div>
      <div className='w-full h-full flex items-center'>
        {!showForgotPassword ? (<div className='mt-6'>
          <div>
            <h2 className='text-4xl font-bold'>Forgot your password?</h2>
            <p className='text-14 mt-2'>No worries. Enter the email address associated with your OrbitGrad account and we'll send you instructions to reset your password.</p>
          </div>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className='mt-6'>
            <FieldGroup>
              <FieldSet>
                <Field className='gap-1.5'>
                  <FieldLabel htmlFor='email'>
                    Email
                  </FieldLabel>
                  <CustomInput
                    {...register("email")}
                    inputId='email'
                    autoComplete='email'
                    placeholder="example@dev.com"
                    type='email'
                    error={!!errors.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <FieldError id='email-error' className='text-error text-14'>
                      <small className='text-error'>{errors.email.message}</small>
                    </FieldError>
                  )}
                </Field>
                <Field orientation={'horizontal'}>
                  <Button type='submit' disabled={isLoading} className="text-white h-11 border-none cursor-pointer rounded-lg flex w-full">
                    {isLoading && <Loader className="animate-spin" />}
                    <span>{isLoading ? "Signing in..." : "Send reset link"}</span>
                  </Button>
                </Field>
              </FieldSet>
            </FieldGroup>
          </form>
          <Link href="/auth/login" className='flex mt-6 justify-center text-xs font-semibold text-primary'>
            ←  Back to login
          </Link>
        </div>) :
          (
            <section className='mt-6'>
              <div className='size-14 rounded-2xl grid place-items-center text-primary bg-[#EEF2FF]'>
                <Mail />
              </div>
              <h2 className='text-[33px] font-bold mt-2'>Check your inbox.</h2>
              <p>If an account exists for the email address you provided, we'll send you a password reset link. Please check your inbox and spam folder.</p>
              <Link href="/auth/login"
                type='submit' className={cn("text-white mt-6 h-11 border-none cursor-pointer rounded-lg bg-primary hover:bg-primary/90 transition-all duration-300 ease-in flex justify-center items-center w-full")}>
                Return to Login
              </Link>
              <p className='mt-6 text-13 text-[#64748B]'>Request received. Please check your inbox and spam folder.</p>
            </section>
          )
        }
      </div>
    </section>
  );
}

export default ForgotPassword;
