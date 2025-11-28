"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { instituteSchema } from "@/lib/validators/Register";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/custom/form/PasswordInput";
import Link from "next/link";
import {
  Building2Icon,
  LucideLoader,
  School,
  University,
  User2Icon,
} from "lucide-react";
import IconInput from "@/components/custom/form/IconInput";
import { InstituteConf } from "@/helper/apiHelper/InstituteConfig";
import { toast } from "sonner";
import {
  errorToast,
  successToast,
  warningToast,
} from "@/components/custom/utils/Toast";
import OTPDialog from "@/components/custom/form/OtpInput";
import { useRouter } from "next/navigation";
import { CustomFormMessage } from "@/components/custom/form/FormMessage";
import { EmailInput } from "@/components/custom/form/emailCheckInput";

export type InstituteFormValues = z.infer<typeof instituteSchema>;
export default function page() {
  // ======================================
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [instituteName, setInstituteName] = useState<string>();
  const [email, setEmail] = useState<string>(
    "try.arshnoorkirmani+21@gmail.com"
  );
  const [otpOpen, setOtpOpen] = useState<boolean>(false);
  // ======================================
  const form = useForm<InstituteFormValues>({
    resolver: zodResolver(instituteSchema),
    defaultValues: { name: "", email: "", institute_name: "", password: "" },
  });
  // ================== On Submit================
  async function onSubmit(values: InstituteFormValues) {
    console.log({ values });
    setIsSubmiting(true);
    try {
      const res = InstituteConf.register(values).then((res) => {
        if (res.success) {
          successToast("Institute Registered Successfully");
          setEmail(values.email);
          setOtpOpen(true);
        } else {
          warningToast(res.error || "Error registering institute");
        }
        setIsSubmiting(false);
      });
      console.log({ res });
    } catch (err: any) {
      console.log({ err });
      errorToast(err.message || "Error registering institute");
      setIsSubmiting(false);
      toast.error(err);
    }
  }
  return (
    <div className="container flex items-center justify-center min-h-screen p-4">
      <div className="w-[420px]">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create Institute Account</CardTitle>
            <CardDescription className="text-xs">
              Create an account for your institute
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                {/* Owner Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <IconInput
                          {...field}
                          placeholder="Enter Owner Name"
                          className="pl-12"
                          icon={<User2Icon />}
                        />
                      </FormControl>{" "}
                      <CustomFormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <EmailInput<InstituteFormValues>
                          {...field}
                          watch={form.watch}
                          trigger={form.trigger}
                          setError={form.setError}
                          clearErrors={form.clearErrors}
                          setInstituteName={setInstituteName}
                          setEmailAvailable={setIsEmailAvailable}
                          className="pl-12 w-full"
                        />
                      </FormControl>
                      <CustomFormMessage />
                      {/* Warning */}
                      {instituteName && (
                        <CustomFormMessage
                          info="Institute Name detected:"
                          tooltip="This email is linked with another institute. Proceeding will update the owner name, institute name, and password."
                        >
                          <b>{instituteName}</b>
                        </CustomFormMessage>
                      )}
                    </FormItem>
                  )}
                />

                {/* Institute Name */}
                <FormField
                  control={form.control}
                  name="institute_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute Name</FormLabel>
                      <FormControl>
                        <IconInput
                          {...field}
                          placeholder="Enter Institute Name"
                          error={form.formState.errors.institute_name}
                          icon={<Building2Icon />}
                        />
                      </FormControl>{" "}
                      <CustomFormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                          className="pl-12"
                        />
                      </FormControl>{" "}
                      <CustomFormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full p-3"
                  disabled={!isEmailAvailable || isSubmiting}
                >
                  {isSubmiting ? (
                    <span className="inline-flex items-center gap-2">
                      <LucideLoader className="animate-spin" size={16} />
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </Button>

                <Link href="/auth/institute-login">
                  <Button
                    variant="secondary"
                    type="button"
                    className="w-full cursor-pointer"
                  >
                    Institute Login
                  </Button>
                </Link>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
      {/* ========================= */}
      <OTPDialog
        open={otpOpen}
        email={email}
        verificationType="forgot"
        verifierType="institute"
        onSuccess={() => {
          router.push("/auth/institute-login");
        }}
      />
    </div>
  );
}
