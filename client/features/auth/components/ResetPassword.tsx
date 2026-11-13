"use client";

import React, { useState } from 'react';
import CustomInput from '@/components/ui/CustomInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';


import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { ResetPasswordData, resetPasswordSchema } from '../schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { cn } from 'cn';

interface Props {

}

const ResetPassword: React.FC<Props> = (props) => {

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);

    try {

    } catch (error) {

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
                    {...register("password")}
                    inputId='confirm-password'
                    placeholder="••••••••••••"
                    autoComplete='new-password'
                    type='password'
                    error={!!errors.confirmPassword}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "password-error" : undefined}
                  />
                  {errors.confirmPassword && (
                    <FieldError id='password-error'>
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
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
