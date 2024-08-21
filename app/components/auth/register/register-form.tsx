"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { CardWrapper } from "@/app/components/auth/register/card-wrapper-register";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/form-error";
import { FormSuccess } from "@/app/components/form-success";
import { register } from "@/actions/auth/register";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "./password-input";
import { Zilla_Slab } from "next/font/google";

const zilla = Zilla_Slab({
  display: "swap",
  weight: "400",
  subsets: ["latin"],
});

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showFullForm, setShowFullForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      role: "CONSUMER",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    setDebugInfo(JSON.stringify(values, null, 2));
    startTransition(() => {
      register(values, searchParams?.toString() || "/").then((data) => {
        setError(data?.error);
        if (data?.user) {
          setSuccess("Registration successful!");
        }
      });
    });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleContinueWithEmail = () => {
    setShowFullForm(true);
    form.setValue("name", "");
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="flex items-center justify-center h-[60vh] w-screen">
      <CardWrapper
        headerLabel=""
        label2="Find your local EZH co-ops"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial={!showFullForm}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 flex flex-col items-center"
          >
            {!showFullForm ? (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-[280px] sm:w-[350px]">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className={`${zilla.className} w-[280px] sm:w-[350px]`}
                  onClick={handleContinueWithEmail}
                >
                  Continue with Email
                </Button>
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-[280px] sm:w-[350px]">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Appleseed Store"
                          className="w-full"
                          onFocus={() => {
                            if (!field.value) {
                              form.setValue("name", "");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-[280px] sm:w-[350px]">
                  <PasswordInput
                    form={form}
                    isPending={isPending}
                    toggleShowPassword={toggleShowPassword}
                    showPassword={showPassword}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-280px sm:w-[350px]">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type={showPassword ? "text" : "password"}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-[280px] sm:w-[350px]"
                >
                  Create an account
                </Button>
              </>
            )}
          </form>
        </Form>
        {/* Debug information */}
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {debugInfo || "No form submission yet"}
          </pre>
        </div>
      </CardWrapper>
    </div>
  );
};

export default RegisterForm;
