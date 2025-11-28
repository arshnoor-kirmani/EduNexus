"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/components/custom/utils/Toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InstituteConf } from "@/helper/apiHelper/InstituteConfig";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSender } from "@/config/EmailSendConfig";
import { DialogClose } from "@radix-ui/react-dialog";
import { CustomFormMessage } from "./FormMessage";
import { Loader2 } from "lucide-react";

interface OTPDialogProps {
  open: boolean;
  email: string;
  onSuccess?: () => void;
  verificationType:
    | "register"
    | "login"
    | "forgot"
    | "change-email"
    | "change-phone";
  verifierType: "institute" | "student" | "teacher" | "user" | "admin";

  digits?: number;
}

const digits = Number(process.env.NEXT_PUBLIC_OTP_DIGITS) || 6;
const schema = z.object({
  otp: z.string().length(digits, "Enter all digits"),
});

export default function OTPDialog({
  open,
  email,
  verificationType,
  verifierType,
  digits = 6,
  onSuccess,
}: OTPDialogProps) {
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [resendCounter, setResendCounter] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });
  const otpValue = form.watch("otp");
  function startResendCounter() {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setResendCounter((sec) => {
        if (sec <= 1) {
          clearInterval(interval);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }
  useEffect(() => {
    if (!open) return;
    setResendCounter(30);
    startResendCounter();
  }, [open]);
  // -----------------------
  // UNIVERSAL VERIFY FUNCTION
  // -----------------------
  // console.log(EmailSender.generateExpiry());
  const handleVerify = async (values: z.infer<typeof schema>) => {
    if (values.otp.length !== digits) {
      return errorToast("Please enter complete OTP");
    }
    const { otp } = values;

    setLoading(true);

    try {
      console.log("OTP Component Props:", { otp, email }); //remove
      const res = await InstituteConf.codeVerify(otp, email);
      console.log("OTP Component res:", res); //remove

      if (!res.success) {
        throw new Error(res.error || "Failed to verify OTP");
      }
      // onSuccess && onSuccess();
      // onClose();
    } catch (err: any) {
      form.setError("otp", {
        type: "manual",
        message: err.message || "Something Wrong",
      });

      console.log("OTP Component err:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // UNIVERSAL RESEND FUNCTION
  // -----------------------
  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await InstituteConf.ResendVerifyCode(email);

      if (!res.success) {
        setResendLoading(false);
      }
      form.setValue("otp", "");
      setResendCounter(30);
      startResendCounter();
    } catch (err) {
      errorToast("Server error while resending OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="w-[90%] sm:w-full max-w-sm rounded-2xl p-4 sm:p-6 [&>button]:hidden">
        <DialogHeader className="">
          <DialogTitle className="text-lg font-semibold">
            Email Verification
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            A verification code has been sent to
            <span className="font-semibold text-foreground"> {email}</span>.
            Please enter the code below to continue.
          </DialogDescription>
        </DialogHeader>

        {/* OTP Input */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleVerify)}
            className="space-y-6"
          >
            {/* OTP Field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center mt-4 sm:mt-5">
                        <InputOTP
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            form.clearErrors("otp");
                          }}
                          maxLength={digits}
                          pattern={REGEXP_ONLY_DIGITS}
                        >
                          <InputOTPGroup className="gap-2 sm:gap-3">
                            {Array.from({ length: digits }).map((_, i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className={`
                      rounded-md text-lg h-11 w-9 sm:w-12 sm:h-12 border transition-all
                      ${
                        form.getFieldState("otp").error
                          ? "border-destructive ring-2 ring-destructive/40 dark:destructive"
                          : "border-gray-300"
                      }
                    `}
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <CustomFormMessage className="text-center w-fit mx-auto" />
                  </FormItem>
                );
              }}
            />

            {/* Submit */}

            {/* Verify Button */}
            <Button
              disabled={loading || otpValue?.length !== digits}
              className="block mx-auto mt-5 sm:mt-6 h-10 text-sm rounded-lg"
            >
              {loading ? "Verifying…" : "Verify Code"}
            </Button>
          </form>
          {/* Resend */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Didn’t get the code?
            </p>

            <Button
              variant="link"
              onClick={handleResend}
              disabled={resendCounter > 0 || resendLoading}
              className="p-0 text-xs sm:text-sm cursor-pointer"
            >
              {resendLoading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Resending...
                </span>
              ) : resendCounter > 0 ? (
                `Resend in ${resendCounter}s`
              ) : (
                "Send Code Again"
              )}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
