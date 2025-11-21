"use client";

import { Input } from "@/components/ui/input";
import { InstituteConf } from "@/helper/apiHelper/InsituteConfig";
import { LucideLoader } from "lucide-react";
import { set } from "mongoose";
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
        setLoading(true);
        console.log({ valid });
        if (valid) {
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
              } else {
                clearErrors(name);
                setEmailAvailable(true);
                console.log("Email available");
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }
  }, [debouncedValue]);

  return (
    <div className="relative">
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
