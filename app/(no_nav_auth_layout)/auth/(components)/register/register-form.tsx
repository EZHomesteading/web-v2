"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "../login/auth-card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/auth/register";
import { useSearchParams } from "next/navigation";
import PasswordInput from "./password-input";
import { OutfitFont } from "@/components/fonts";

const RegisterForm = () => {
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
    // Reset all form fields except email
    form.reset({
      ...form.getValues(),
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  // useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => {
  //     console.log("Form values changed:", value);
  //     console.log("Changed field:", name);
  //     console.log("Type of change:", type);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form]);

  return (
    <>
      <div className={`${OutfitFont.className} flex items-top justify-center`}>
        <CardWrapper
          backButtonLabel="Already have an account?"
          backButtonHref="/auth/login"
          showSocial={!showFullForm}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              {!showFullForm ? (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-[280px] sm:w-[350px]">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="johnnyappleseed@gmail.com"
                            type="email"
                            className={`w-full `}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    className={`mt-4 w-[280px] sm:w-[350px]`}
                    onClick={handleContinueWithEmail}
                  >
                    Continue with Email
                  </Button>
                  <div className={`${OutfitFont.className} pt-3`}>OR</div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-[280px] sm:w-[350px]">
                        <FormLabel>Email</FormLabel>
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
                      <FormItem className="w-[280px] sm:w-[350px]">
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
                    className="w-[280px] sm:w-[350px] mt-2"
                  >
                    Create an account
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardWrapper>
      </div>
    </>
  );
};

export default RegisterForm;
