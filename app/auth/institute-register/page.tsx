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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/Custom/Form/EmailCheckInput";
import { PasswordInput } from "@/components/Custom/Form/PasswordInput";
import Link from "next/link";
import {
  Building2Icon,
  LucideLoader,
  School,
  University,
  User2Icon,
} from "lucide-react";
import IconInput from "@/components/Custom/Form/IconInput";
import { InstituteConf } from "@/helper/apiHelper/InsituteConfig";
import { toast } from "sonner";

export type InstituteFormValues = z.infer<typeof instituteSchema>;
export default function page() {
  // ======================================
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [instituteName, setInstituteName] = useState<string>();
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
          toast.success(res.message || res.error);
        } else {
          toast.warning(res.message || res.error);
        }
        setIsSubmiting(false);
      });
      console.log({ res });
    } catch (err: any) {
      console.log({ err });
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
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />

                      {/* Warning */}
                      {instituteName && (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg mt-1">
                          Your email is already linked with{" "}
                          <strong>{instituteName}</strong>, but the account is
                          not verified. Please verify to continue.
                        </p>
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
                      </FormControl>
                      <FormMessage />
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
                      </FormControl>
                      <FormMessage />
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
    </div>
  );
}
