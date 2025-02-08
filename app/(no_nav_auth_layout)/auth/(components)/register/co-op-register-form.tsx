"use client";
//coop registration with location handling
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { RegisterVendorSchema } from "@/schemas";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "../login/auth-card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/auth/register-vendor";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import PasswordInput from "./password-input";
import { OutfitFont } from "@/components/fonts";

export const CoOpRegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterVendorSchema>>({
    resolver: zodResolver(RegisterVendorSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phoneNumber: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: UserRole.COOP,
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterVendorSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data?.error);
      });
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <CardWrapper
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      className={`mb-4 sm:mb-0`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`${OutfitFont.className}`}
        >
          <div className="space-y-2">
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl className={`mt-4`}>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Johnny"
                        className={`mt-4`}
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
                  <FormItem className="w-280px sm:w-[350px]">
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Appleseed Co-op"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-280px sm:w-[350px]">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="johnny.appleseed@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        disabled={isPending}
                        placeholder="(743) 216-9078"
                        value={field.value as any}
                        onChange={(value) => field.onChange(value)}
                        format="(###) ###-####"
                        style={{
                          backgroundColor: "inherit",
                        }}
                        international={false}
                        defaultCountry="US"
                        countrySelectProps={{ disabled: true }}
                        maxLength={14}
                        className="w-280px sm:w-[350px] h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PasswordInput
                form={form}
                isPending={isPending}
                toggleShowPassword={toggleShowPassword}
                showPassword={showPassword}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type={showPassword ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => onSubmit(form.getValues())}
                disabled={isPending}
                type="submit"
                className="w-full"
              >
                Become an EZH Co-op
              </Button>
            </>
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      </Form>
    </CardWrapper>
  );
};
