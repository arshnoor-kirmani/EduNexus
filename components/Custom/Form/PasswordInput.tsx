import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Lock, LucideEye, LucideEyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  showRequirements?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  disabled,
  showRequirements = true,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full mb-10",
        showRequirements ? "mb-10" : "mb-auto"
      )}
    >
      {/* Left Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-muted-foreground border-r">
        <Lock className="h-4.5 w-4.5" />
      </div>

      {/* Input */}
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Password"
        disabled={disabled}
        className="pl-12 pr-10 placeholder:text-xs"
        {...props}
      />

      {/* Toggle Visibility Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
        {show ? (
          <LucideEye size={18} onClick={() => setShow(false)} />
        ) : (
          <LucideEyeOff size={18} onClick={() => setShow(true)} />
        )}
      </div>

      {/* Requirements */}
      {showRequirements && (
        <p className="text-xs text-muted-foreground mt-2 absolute">
          Password must be at least 8 characters, contain an uppercase letter
          and a number.
        </p>
      )}
    </div>
  );
}
