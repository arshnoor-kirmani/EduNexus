"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";

import { Mail, User2, BadgeInfo, Loader } from "lucide-react";
import { PasswordInput } from "../form/PasswordInput";
import Link from "next/link";
import { AppData } from "@/config/appConfig";
import { EmailInput } from "../form/emailCheckInput";
import { CustomFormMessage } from "../form/FormMessage";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

import { errorToast, successToast } from "../utils/Toast";
import { InstituteConf } from "@/config/InstituteClient";
import { useRouter } from "next/navigation";

type UserType = "institute" | "student" | "teacher";

interface UniversalLoginProps {
  userType: UserType;
}

// UI + Validation config
const uiConfig = {
  institute: {
    title: "Institute Login",
    subtitle: "Sign in to manage your institute",
    label: "Email",
    placeholder: "you@example.com",
    icon: <Mail className="w-5 h-5" />,
    schema: z.object({
      identifier: z.string().email("Enter a valid email"),
      password: z.string().min(6, "Password is too short"),
    }),
  },

  student: {
    title: "Student Login",
    subtitle: "Access your student dashboard",
    label: "Student ID",
    placeholder: "Enter Student ID",
    icon: <User2 className="w-5 h-5" />,
    schema: z.object({
      identifier: z.string().min(3, "Invalid student ID"),
      password: z.string().min(6, "Password is too short"),
    }),
  },

  teacher: {
    title: "Teacher Login",
    subtitle: "Log in to your teacher panel",
    label: "Teacher ID",
    placeholder: "Enter Teacher ID",
    icon: <BadgeInfo className="w-5 h-5" />,
    schema: z.object({
      identifier: z.string().min(3, "Invalid teacher ID"),
      password: z.string().min(6, "Password is too short"),
    }),
  },
};

export default function UniversalLogin({ userType }: UniversalLoginProps) {
  const config = uiConfig[userType];
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [isValidUser, setIsValidUser] = useState<boolean>(false);
  const [availableName, setAvailableName] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (userType === "institute") {
        const success = await InstituteConf.login({
          email: values.identifier,
          password: values.password,
        });
        if (!success) return;
        // Redirect to institute dashboard
        route.push(AppData.routes.frontend.dashboard.institute);
      }
    } catch (error) {
      errorToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen p-4">
      <Card className="w-[420px] gap-3">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {config.title}

            <CardDescription className="font-normal tracking-normal">
              {config.subtitle}
            </CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* IDENTIFIER */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{config.label}</FormLabel>
                    <FormControl>
                      {userType === "institute" ? (
                        <EmailInput
                          {...field}
                          mode="login"
                          watch={form.watch}
                          trigger={form.trigger}
                          setError={form.setError}
                          clearErrors={form.clearErrors}
                          setEmailAvailable={setIsValidUser}
                          setAvailableName={setAvailableName}
                          error={!!fieldState.error}
                        />
                      ) : (
                        <Input
                          {...field}
                          placeholder={config.placeholder}
                          className={cn("w-full")}
                        />
                      )}
                    </FormControl>

                    {/* custom form message will read from react-hook-form */}
                    <CustomFormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="••••••••••"
                        showRequirements
                      />
                    </FormControl>

                    <CustomFormMessage />

                    <div className="flex justify-end">
                      <Link
                        href={
                          AppData.routes.frontend.auth.resetPassword.institute
                        }
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-5 flex items-center justify-center gap-2"
                disabled={loading || !isValidUser}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {userType === "institute" && (
          <CardDescription className="text-center px-2 text-xs mt-1">
            New Institute?{" "}
            <Link
              href={AppData.routes.frontend.auth.register.institute}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Register here
            </Link>
          </CardDescription>
        )}
      </Card>
    </div>
  );
}
