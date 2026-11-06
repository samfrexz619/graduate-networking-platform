"use client";
import React from 'react';
import { cn } from "cn";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check, GraduationCap } from "lucide-react";



interface ChoiceOption {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}


interface ChoiceCardProps {
  radioOptions?: ChoiceOption[];
  value: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const ChoiceCard: React.FC<ChoiceCardProps> = (props) => {
  const {
    radioOptions,
    value,
    onValueChange,
    disabled, } = props;

  return (
    <RadioGroupPrimitive.Root aria-labelledby="role-label" value={value} onValueChange={onValueChange} disabled={disabled} className="grid grid-cols-2 gap-3">
      {radioOptions?.map(option => (
        <label
          key={option.value}
          className={cn(
            "flex flex-col cursor-pointer items-start gap-2 rounded-lg",
            "border border-border p-2 transition-colors",
            "hover:border-primary",
            "has-data-[state=checked]:border-primary",
            "has-data-[state=checked]:bg-primary/5",
            "has-data-disabled:cursor-not-allowed",
            "has-data-disabled:opacity-50"
          )}
        >
          <div className="w-full flex justify-between">
            <RadioGroupPrimitive.Item
              value={option.value}
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center",
                "justify-center rounded-full border",
                "border-border text-white",
                "data-[state=checked]:border-primary",
                "data-[state=checked]:bg-primary",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/40"
              )}
            >
              <RadioGroupPrimitive.Indicator>
                <Check className="size-3.5" strokeWidth={3} />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            {option.icon && (
              <span className="text-secondary-text">
                {option.icon}
              </span>
            )}
          </div>

          <span className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {option.label}
            </span>
            {option.description && (
              <p className="text-xs text-secondary-text">
                {option.description}
              </p>
            )}
          </span>
        </label>
      ))}
    </RadioGroupPrimitive.Root >
  );
}

export default ChoiceCard;
