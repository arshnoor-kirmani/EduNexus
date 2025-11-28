"use client";

import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";
import { AlertCircle, Info, CheckCircle2, TriangleAlert } from "lucide-react";
import { JSX } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Variant = "error" | "warning" | "success" | "info";

interface CustomFormMessageProps {
  warning?: React.ReactNode;
  success?: React.ReactNode;
  info?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  tooltip?: string;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  error:
    "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-400/20",
  warning:
    "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-300/10 dark:border-amber-400/20",
  success:
    "text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-500/10 dark:border-green-400/20",
  info: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/10 dark:border-blue-400/20",
};

const variantIcons: Record<Variant, JSX.Element> = {
  error: <AlertCircle className="h-4 w-4 mt-0.5" />,
  warning: <TriangleAlert className="h-4 w-4 mt-0.5" />,
  success: <CheckCircle2 className="h-4 w-4 mt-0.5" />,
  info: <Info className="h-4 w-4 mt-0.5" />,
};

export function CustomFormMessage({
  warning,
  success,
  info,
  title,
  children,
  tooltip,
  className,
}: CustomFormMessageProps) {
  const { error } = useFormField();

  const variant: Variant = error
    ? "error"
    : warning
    ? "warning"
    : success
    ? "success"
    : "info";

  const message = error?.message || warning || success || info;
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 px-2 mt-2 rounded-lg text-xs border backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-1 duration-200",
        variantStyles[variant],
        className
      )}
    >
      {/* RICH TOOLTIP */}
      <Tooltip>
        <TooltipTrigger asChild>{variantIcons[variant]}</TooltipTrigger>
        <TooltipContent className="dark py-3 w-64 sm:w-72">
          <div className="flex gap-3">
            {variantIcons[variant]}

            <div className="space-y-1">
              <p className="font-medium text-[13px]">
                {variant === "error"
                  ? "Error Information"
                  : variant === "warning"
                  ? "Warning Details"
                  : variant === "success"
                  ? "Success Message"
                  : "Information"}
              </p>
              <p className="text-muted-foreground text-xs">
                {tooltip ||
                  (variant === "error"
                    ? "This field contains incorrect data. Please fix it before continuing."
                    : variant === "warning"
                    ? "There is something you should review before proceeding."
                    : variant === "success"
                    ? "Everything looks correct and validated."
                    : "Additional information about this field.")}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* message */}
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}

        <div className="text-nowrap">
          {message}
          {"  "}
          {children && <span className="font-semibold">{children}</span>}
        </div>
      </div>
    </div>
  );
}

// ****************************** IGNORE BELOW THIS LINE **************************** //
// Usage Examples:

//  Warning Message
//  <CustomFormMessage
//      warning="Institute already exists but not verified."
//      title="Email Found"
//   >
//      <b>{instituteName}</b>
//  </CustomFormMessage>

//  Success Message
//  <CustomFormMessage
//    success="Your email is available!"
//    title="Looks good!"
//  />

// Info Message with Children
//   <CustomFormMessage info="Enter Institute Name detected:">
//     <b>{"instituteName"}</b>
//   </CustomFormMessage>
