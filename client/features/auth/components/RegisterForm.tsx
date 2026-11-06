"use client";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/auth.schema';
import Logo from '@/components/common/Logo';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import CustomInput from '@/components/ui/CustomInput';
import type { RegisterFormData } from '../schemas/auth.schema';
import ChoiceCard from '@/components/ui/ChoiceCard';
import { BookOpen, BriefcaseBusiness, GraduationCap, Loader, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// so that it doesn't render everytime the comp renders since it is a static data
const roleOptions = [
  {
    label: "Student",
    value: "student",
    description: "Exploring career opportunities",
    icon: <GraduationCap />
  },
  {
    label: "Graduate",
    value: "graduate",
    description: "Starting my professional journey",
    icon: <BookOpen />
  },
  {
    label: "Mentor",
    value: "mentor",
    description: "Helping others grow",
    icon: <Users />
  },
  {
    label: "Recruiter",
    value: "recruiter",
    description: "Finding talented people",
    icon: <BriefcaseBusiness />
  },
];


const RegisterForm: React.FC = () => {

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      termsConditions: false
    }
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log(data);
    } catch (error) {
      console.error("Error occurred while submitting registration form:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className='mx-auto w-full max-w-160'>
      <div className='w-full hidden lg:flex justify-between items-center'>
        <p className='text-13'>Already have an account?</p>
        <Link href="/login" className='font-semibold text-primary text-14'>Log in</Link>
      </div>
      <div className='block lg:hidden'>
        <Logo link='login' />
      </div>

      <div className='pt-20 w-full md:w-110 mx-auto'>
        <h2 className='text-2xl lg:text-4xl font-bold'>Start your next chapter</h2>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className='mt-4'>
          <FieldGroup>
            <FieldSet>
              <FieldDescription className=''>
                Join a community that’s going places, together.
              </FieldDescription>

              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field className='gap-1.5'>
                    <FieldLabel htmlFor='firstName'>
                      First Name
                    </FieldLabel>
                    <CustomInput
                      {...register("firstName")}
                      inputId='firstName'
                      autoComplete='given-name'
                      placeholder="Jane"
                      type='text'
                      error={!!errors.firstName}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                    {errors.firstName && (
                      <FieldError id='firstName-error' className='text-error text-14'>
                        {errors.firstName.message}
                      </FieldError>
                    )}
                  </Field>
                  <Field className='gap-1.5'>
                    <FieldLabel htmlFor='lastName'>
                      Last Name
                    </FieldLabel>
                    <CustomInput
                      {...register("lastName")}
                      inputId='lastName'
                      autoComplete='family-name'
                      placeholder="Doe"
                      type='text'
                      error={!!errors.lastName}
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                    />
                    {errors.lastName && (
                      <FieldError id='lastName-error' className='text-error text-14'>
                        {errors.lastName.message}
                      </FieldError>
                    )}
                  </Field>
                </div>
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
                    autoComplete='new-password'
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
                <Field data-invalid={!!errors.confirmPassword} className='gap-1.5'>
                  <FieldLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                  <CustomInput
                    {...register("confirmPassword")}
                    inputId='confirmPassword'
                    placeholder="••••••••••••"
                    autoComplete='new-password'
                    type='password'
                    error={!!errors.confirmPassword}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "comfirmPassword-error" : undefined}
                  />
                  {errors.confirmPassword && (
                    <FieldError id='comfirmPassword-error'>
                      <small className='text-error text-14'>{errors.confirmPassword.message}</small>
                    </FieldError>
                  )}
                </Field>
                <Field data-invalid={!!errors.role} className='gap-1.5'>
                  <FieldLabel id="role-label">Which best describes you?</FieldLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <ChoiceCard
                        radioOptions={roleOptions}
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        error={!!errors?.role}
                      />
                    )}
                  />
                  <FieldDescription>You can update this later in your account settings.</FieldDescription>
                  {
                    errors.role && (
                      <FieldError>
                        <small className='text-error text-14'>{errors.role.message}</small>
                      </FieldError>
                    )
                  }
                </Field>
                <Field data-invalid={!!errors.termsConditions} className='gap-1.5'>
                  <div className='flex gap-2 item-center'>
                    <Controller
                      name='termsConditions'
                      control={control}
                      render={({ field }) => (
                        <div className='flex items-center gap-2'>
                          <Checkbox
                            id='termsConditions'
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                            aria-invalid={!!errors.termsConditions}
                            className="text-white border-border" />
                          <FieldLabel htmlFor='termsConditions' className='cursor-pointer flex'>I agree to the{" "}<Link href="#" className='text-primary'>Terms of Service</Link>{" "}and{" "}<Link href="#" className='text-primary'>Privacy Policy.</Link></FieldLabel>
                        </div>
                      )}
                    />
                  </div>
                  {errors.termsConditions && (
                    <FieldError>
                      <small className='text-error text-14'>{errors.termsConditions.message}</small>
                    </FieldError>
                  )}
                </Field>

                <Field orientation={'horizontal'}>
                  <Button type='submit' disabled={isLoading} className="text-white h-11 border-none cursor-pointer rounded-lg flex w-full">
                    {isLoading && <Loader className="animate-spin" />}
                    <span>{isLoading ? "Creating account..." : "Create account & continue"}</span>
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

export default RegisterForm;
