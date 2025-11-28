"use client";

import { Input } from "@/components/ui/input";
import { InstituteConf } from "@/helper/apiHelper/InstituteConfig";
import { LucideLoader, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import {
  UseFormWatch,
  FieldValues,
  UseFormTrigger,
  Path,
} from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

interface EmailInputProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (v: string) => void;
  name: Path<T>;
  watch: UseFormWatch<T>;
  trigger: UseFormTrigger<T>;
  setError: any;
  clearErrors: any;
  setInstituteName: any;
  setEmailAvailable: any;
}
export function EmailInput<T extends FieldValues>({
  value,
  onChange,
  name,
  watch,
  trigger,
  setError,
  clearErrors,
  setInstituteName,
  setEmailAvailable,
  ...props
}: EmailInputProps<T>) {
  const [loading, setLoading] = useState(false);
  const [debouncedValue, setValue] = useDebounceValue(value, 500);

  useEffect(() => {
    if (debouncedValue) {
      trigger(name).then((valid) => {
        if (valid) {
          setLoading(true);
          setEmailAvailable(false);
          setInstituteName("");
          InstituteConf.checkEmailUnique(debouncedValue)
            .then((res) => {
              console.log({ res }); //remove
              if (res.data.isRegistered && res.data.institute.isVerified) {
                console.log("Email already registered");
                setError(name, {
                  type: "manual",
                  message: "Email already registered",
                });
              } else if (
                res.data.isRegistered &&
                !res.data.institute.arshnoor
              ) {
                setInstituteName(
                  res.data.institute.information.institute_name ||
                    "Unkown Institute"
                );
                clearErrors(name);
                setEmailAvailable(true);
              } else {
                clearErrors(name);
                setEmailAvailable(true);
                console.log("Email available");
              }
            })
            .finally(() => {
              setLoading(false);
            })
            .catch((err) => {
              console.log({ err });
            });
        }
      });
    }
  }, [debouncedValue]);

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 h-full flex items-center pl-2.5 pr-2.5 border-r text-muted-foreground">
        <div className="size-4.5 flex items-center justify-center">
          <Mail />
        </div>
      </div>

      <Input
        {...props}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setValue(e.target.value);
        }}
        placeholder="you@example.com"
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
