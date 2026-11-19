"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from "next/navigation";

import CustomInput from '@/components/ui/CustomInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { cn } from 'cn';


import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { ResetPasswordData, resetPasswordSchema } from '@/features/auth/schemas/auth.schema';
import { toast } from '@/components/ui/toast';
import { resetPassword } from '@/features/auth/api/auth.api';



interface Props {

}

const ResetPasswordPage: React.FC<Props> = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams<{ token: string }>();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      toast.add({
        type: "error",
        description: "Invalid password reset link."
      })
      return;
    }
    setIsLoading(true);

    try {
      await resetPassword(token, {
        password: data.password
      });
      toast.add({
        type: "success",
        description: "Password reset successfully."
      });

      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message
        });
      } else {
        toast.add({
          type: "error",
          description: "Unable to reset your password. Please try again."
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='w-full max-w-160 mx-auto'>
      <div className='w-full hidden lg:flex justify-between items-center'>
        <p className='text-13'>New to OrbitGrad?</p>
        <Link href="/auth/login" className='font-semibold text-primary text-14'>Back to login</Link>
      </div>
      <div className='pt-20 w-full md:w-110 mx-auto'>
        <h2 className='text-4xl font-bold'>Create a new password.</h2>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className='mt-4'>
          <FieldGroup>
            <FieldSet>
              <FieldDescription className=''>
                Choose a strong password to secure your OrbitGrad account.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='password'>
                    New password
                  </FieldLabel>
                  <CustomInput
                    {...register("password")}
                    inputId='password'
                    placeholder="••••••••••••"
                    autoComplete='new-password'
                    type='password'
                    error={!!errors.password}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {errors.password && (
                    <FieldError id='password-error'>
                      <small className='text-error'>{errors.password.message}</small>
                    </FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor='confirm-password'>
                    Confirm new password
                  </FieldLabel>
                  <CustomInput
                    {...register("confirmPassword")}
                    inputId='confirm-password'
                    placeholder="••••••••••••"
                    autoComplete='new-password'
                    type='password'
                    error={!!errors.confirmPassword}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  />
                  {errors.confirmPassword && (
                    <FieldError id='confirm-password-error'>
                      <small className='text-error'>{errors.confirmPassword.message}</small>
                    </FieldError>
                  )}
                </Field>

                <Field orientation={'horizontal'}>
                  <Button type='submit' disabled={isLoading} className={cn("text-white h-11 border-none cursor-pointer rounded-lg bg-primary flex w-full")}>
                    {isLoading && <Loader className="animate-spin" />}
                    <span>{isLoading ? "◌  Updating password…" : "Reset password"}</span>
                  </Button>
                </Field>
                <Link
                  href="/auth/login"
                  className="block text-primary text-center font-semibold text-sm hover:underline"
                >
                  Back to login
                </Link>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

        </form>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
