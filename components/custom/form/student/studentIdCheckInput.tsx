"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { LucideLoader, CheckCircle2, XCircle } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export function StudentIdCheckInput({ onChange, value, ...props }: Props) {
  const [checking, setChecking] = useState(false);
  const [valid, setValid] = useState<null | boolean>(null);
  const [message, setMessage] = useState("");

  const debounce = (fn: any, delay = 400) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const checkStudentId = async (id: string) => {
    if (!id) {
      setValid(null);
      setMessage("");
      return;
    }

    setChecking(true);

    setTimeout(() => {
      if (id.startsWith("STU")) {
        setValid(true);
        setMessage("Student ID verified");
      } else {
        setValid(false);
        setMessage("Invalid Student ID");
      }

      setChecking(false);
    }, 800);
  };

  const debouncedCheck = useCallback(debounce(checkStudentId, 500), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange?.(e);
    debouncedCheck(v);
  };

  return (
    <div className="space-y-1 relative">
      {/* ONLY INPUT GOES INSIDE FormControl */}
      <Input value={value} onChange={handleChange} {...props} />

      {/* Icons are OUTSIDE the Input element */}
      {checking && (
        <LucideLoader
          size={18}
          className="absolute right-3 top-[11px] animate-spin text-muted-foreground"
        />
      )}

      {!checking && valid === true && (
        <CheckCircle2
          size={18}
          className="absolute right-3 top-[11px] text-green-500"
        />
      )}

      {!checking && valid === false && (
        <XCircle
          size={18}
          className="absolute right-3 top-[11px] text-red-500"
        />
      )}

      {message && (
        <p className={`text-xs ${valid ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
