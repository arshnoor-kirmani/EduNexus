"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form"

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  error?: FieldError;
}

const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, error, className, ...props }, ref) => {
    const invalid = !!error;

    return (
      <div className="relative w-full">
        <div className="absolute left-0 top-0 h-full flex items-center pl-3 pr-2 border-r text-muted-foreground">
          <div className="size-4.5 flex items-center justify-center">
            {icon}
          </div>
        </div>

        <Input
          ref={ref}
          {...props}
          data-invalid={invalid ? "" : undefined}
          className={cn("pl-12 w-full", className)}
        />
      </div>
    );
  }
);

IconInput.displayName = "IconInput";
export default IconInput;
