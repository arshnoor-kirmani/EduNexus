"use client";

import { Input } from "@/components/ui/input";
import { FieldError } from "react-hook-form";
import React from "react";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  error?: FieldError;
}

export default function IconInput({
  icon,
  error,
  className,
  ...props
}: IconInputProps) {
  const invalid = !!error;

  return (
    <div className="relative w-full">
      {/* Left Icon */}
      {/* <div
        className={`
          absolute left-0 top-0 h-full flex items-center pl-2.5 pr-2.5 border-r 
          ${
            invalid
              ? "border-red-500 text-red-500"
              : "border-gray-300 text-muted-foreground"
          }
        `}
      >
        <div className="size-.5">{icon}</div>
      </div> */}
      <div className="absolute left-0 top-0 h-full flex items-center pl-2.5 pr-2.5 border-r text-muted-foreground">
        <div className="size-4.5 flex items-center justify-center">{icon}</div>
      </div>

      {/* Input */}
      <Input
        {...props}
        aria-invalid={invalid}
        className={`pl-12 ${invalid ? "border-red-500" : ""} ${className}`}
      />
    </div>
  );
}
