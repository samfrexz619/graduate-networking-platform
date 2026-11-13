"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '@/components/ui/CustomInput';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../schemas/auth.schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';



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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      console.log(data);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='w-full max-w-110 mx-auto h-full flex items-center'>
      <div className=''>
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
      </div>
    </section>
  );
}

export default ForgotPassword;
