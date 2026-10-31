"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import CustomInput from '@/components/common/CustomInput';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { LoginFormData, loginSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';




interface Props {

}

const LoginForm: React.FC<Props> = (props) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data)
  }

  return (
    <section className='w-max-160 mx-auto'>
      <div className='w-full flex justify-between items-center'>
        <p>New to CareerConnect?</p>
        <Link href="/register" className='font-semibold text-primary text-14'>Create an account →</Link>
      </div>
      <div></div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldDescription>
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
                  />
                  {errors.email && (
                    <FieldError>
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
                  />
                  {errors.password && (
                    <FieldError>
                      {errors.password.message}
                    </FieldError>
                  )}
                </Field>

                <div className='flex justify-between item-center'>
                  <Field orientation="horizontal" className='w-auto'>
                    <Checkbox defaultChecked className="text-white" />
                    <FieldLabel>Remember me</FieldLabel>
                  </Field>
                  <Link href="#" className='block text-primary text-14 font-bold'>Forgot password?</Link>
                </div>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </div>

    </section>
  );
}

export default LoginForm;
