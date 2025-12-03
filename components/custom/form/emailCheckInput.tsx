"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { InstituteConf } from "@/config/InstituteClient";
import { cn } from "@/lib/utils";
import { LucideLoader, Mail as MailIcon } from "lucide-react";
import {
  UseFormTrigger,
  UseFormWatch,
  FieldValues,
  Path,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

type Mode = "login" | "register";

interface EmailInputProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (v: string) => void;
  name: Path<T>;

  watch?: UseFormWatch<T>;
  trigger?: UseFormTrigger<T>;

  setError?: UseFormSetError<T>;
  clearErrors?: UseFormClearErrors<T>;

  setAvailableName?: (name: string) => void;
  setEmailAvailable?: (v: boolean) => void;

  mode?: Mode;
  error?: boolean;
  iconShow?: boolean;
  className?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps<any>>(
  (
    {
      value,
      onChange,
      name,
      watch,
      trigger,
      setError,
      clearErrors,
      setAvailableName,
      setEmailAvailable,
      mode = "register",
      error = false,
      iconShow = true,
      className,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);

    // debounce local value for API checks
    const [debounced, setDebounced] = useDebounceValue(value ?? "", 500);

    useEffect(() => {
      if (!debounced) {
        // if empty, clear possible manual errors and early-exit
        if (clearErrors) clearErrors(name);
        setAvailableName?.("");
        setEmailAvailable?.(false);
        return;
      }

      // optional trigger validation (react-hook-form schema)
      const run = async () => {
        if (trigger) {
          const ok = await trigger(name);
          if (!ok) return; // if schema fails, don't call API
        }

        setLoading(true);
        try {
          const res = await InstituteConf.checkEmailUnique(debounced);
          const isRegistered = res?.data?.isRegistered;
          const institute = res?.data?.institute || {};
          console.log("Email Check:", { isRegistered, institute, mode });
          if (mode === "register") {
            // For register mode: email must not be registered
            setAvailableName?.("");
            setEmailAvailable?.(false);

            if (isRegistered && institute.isVerified) {
              setError?.(name, {
                type: "manual",
                message: "Email already registered",
              });
            } else if (isRegistered && !institute.information?.isVerified) {
              setAvailableName?.(institute.information?.institute_name || "");
              setEmailAvailable?.(true);
            } else {
              clearErrors?.(name);
              setEmailAvailable?.(true);
            }
          } else {
            // login mode — email must exist and be verified
            if (!isRegistered) {
              setError?.(name, {
                type: "manual",
                message: "Email not registered.",
              });
              return;
            }

            if (!institute.isVerified) {
              setError?.(name, {
                type: "manual",
                message: "Email not verified. Please verify your email.",
              });
              return;
            }
            setEmailAvailable?.(true);
          }
        } catch (err) {
          // optionally set a non-blocking message or console
          console.error("Email check error:", err);
        } finally {
          setLoading(false);
        }
      };

      run();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    return (
      <div className="relative">
        {iconShow && (
          <div className="absolute left-0 top-0 h-full flex items-center pl-2.5 pr-2.5 border-r text-muted-foreground">
            <div className="size-4.5 flex items-center justify-center">
              <MailIcon />
            </div>
          </div>
        )}

        <Input
          // forward react-hook-form props & native attrs
          ref={ref}
          {...props}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setDebounced(e.target.value);
          }}
          // NOTE: `data-invalid` triggers shadcn's `data-[invalid]` style
          data-invalid={error ? "" : undefined}
          placeholder="you@example.com"
          // IMPORTANT: keep className from FormControl first so it isn't overwritten
          className={cn(className, iconShow && "pl-12 w-full")}
        />

        {loading && (
          <LucideLoader
            size={18}
            className="animate-spin absolute right-3 top-1/2 -translate-y-1/2"
          />
        )}
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";
