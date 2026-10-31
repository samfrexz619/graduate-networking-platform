"use client"
import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOff } from 'lucide-react';
import { cn } from 'cn';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';



interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  ref?: React.Ref<HTMLInputElement>;
  type: string;
  error?: boolean;
  inputId: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  ref,
  type,
  error,
  inputId,
  className,
  onFocus,
  onBlur,
  ...props }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <>
      <InputGroup className={cn('border w-full h-11.5 rounded-lg px-2', isFocused ? 'border-primary' : error ? 'border-error' : 'border-border')}>
        <InputGroupInput
          {...props}
          ref={ref}
          id={inputId}
          type={inputType}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e)
          }}
        />
        {
          type === 'password' && (
            <InputGroupAddon align={'inline-end'}>
              <button aria-label={showPassword ? 'Hide password' : 'Show password'} className='cursor-pointer' type='button' onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <EyeOff color='#64748B' /> : <EyeIcon color='#64748B' />}
              </button>
            </InputGroupAddon>
          )
        }
      </InputGroup>
    </>
  )
}

export default CustomInput;