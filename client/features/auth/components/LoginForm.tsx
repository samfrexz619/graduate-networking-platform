"use client";

import React from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';

import CustomInput from '@/components/ui/CustomInput';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { LoginFormData, loginSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Logo from '@/components/common/Logo';
import { login } from '../api/auth.api';
import { Loader } from 'lucide-react';
import { toast } from '@/components/ui/toast';




interface Props {

}

const LoginForm: React.FC<Props> = (props) => {

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      console.log(response)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.add({
        type: "error",
        description: errMessage
      });
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <section className='w-full max-w-160 mx-auto'>
      <div className='w-full hidden lg:flex justify-between items-center'>
        <p className='text-13'>New to CareerConnect?</p>
        <Link href="/register" className='font-semibold text-primary text-14'>Create an account →</Link>
      </div>
      <div className='block lg:hidden'>
        <Logo link='login' />
      </div>
      <div className='pt-20 w-full md:w-110 mx-auto'>
        <h2 className='text-4xl font-bold'>Welcome back</h2>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className='mt-4'>
          <FieldGroup>
            <FieldSet>
              <FieldDescription className=''>
                Your next opportunity could start with a hello.
              </FieldDescription>
              <FieldGroup className=''>
                <Field data-invalid={!!errors.email} className='gap-1.5'>
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
                      {errors.email.message}
                    </FieldError>
                  )}
                </Field>
                <Field data-invalid={!!errors.password} className='gap-1.5'>
                  <FieldLabel htmlFor='password'>
                    Password
                  </FieldLabel>
                  <CustomInput
                    {...register("password")}
                    inputId='password'
                    placeholder="••••••••••••"
                    autoComplete='current-password'
                    type='password'
                    error={!!errors.password}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  {errors.password && (
                    <FieldError id='password-error'>
                      <small className='text-error text-14'>{errors.password.message}</small>
                    </FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.rememberMe} className='gap-1.5'>
                  <div className='flex justify-between item-center'>
                    <Controller
                      name='rememberMe'
                      control={control}
                      render={({ field }) => (
                        <div className='flex items-center gap-2'>
                          <Checkbox
                            id='rememberMe'
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="text-white border-border" />
                          <FieldLabel htmlFor='rememberMe' className='cursor-pointer'>Remember me</FieldLabel>
                        </div>
                      )}
                    />
                    <Link href="#" className='block text-primary text-14 font-bold'>Forgot password?</Link>
                  </div>
                </Field>
                <Field orientation={'horizontal'}>
                  <Button type='submit' disabled={isLoading} className="text-white h-11 border-none cursor-pointer rounded-lg flex w-full">
                    {isLoading && <Loader className="animate-spin" />}
                    <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
        <div className='mt-8 space-y-6'>
          <i className='w-full block bg-border h-px'></i>
          <p className='text-center text-13 text-[#64748B]'>A new connection. A little guidance. A clearer next step.</p>
          <p className='text-center text-13'>Don’t have an account? <Link href="#" className='font-semibold text-primary'>Create an account</Link></p>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
