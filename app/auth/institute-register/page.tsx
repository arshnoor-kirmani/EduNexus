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

export type InstituteFormValues = z.infer<typeof instituteSchema>;
export default function page() {
  // ======================================
  const [checkEmail, setCheckingEmail] = useState<boolean>(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [instituteName, setInstituteName] = useState<string>();
  // ======================================
  const form = useForm<InstituteFormValues>({
    resolver: zodResolver(instituteSchema),
    defaultValues: { name: "", email: "", institute_name: "", password: "" },
  });
  // ================== On Submit================
  async function onSubmit(values: InstituteFormValues) {}
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
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Owner Name" />
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
                    <FormItem className="relative">
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
                        />
                      </FormControl>
                      <FormMessage />
                      {instituteName && (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg ">
                          Your email is already linked with{" "}
                          <strong>Arshnoor</strong>, but the account is not
                          verified. Please verify to continue.
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full p-3"
                  // disabled={checkingEmail || success}
                >
                  {
                    //checkingEmail ? (
                    //   <span className="inline-flex items-center gap-2">
                    //     {" "}
                    //     <LucideLoader className="animate-spin" size={16} />{" "}
                    //     Submitting...
                    //   </span>
                    // ) : success ? (
                    //   "Done"
                    // ) :
                    "Submit"
                  }
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
