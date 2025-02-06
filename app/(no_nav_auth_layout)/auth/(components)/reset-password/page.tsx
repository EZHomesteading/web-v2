"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CardWrapper } from "../login/auth-card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterVendorSchema, ResetPasswordSchema } from "@/schemas";
import PasswordInput from "../register/password-input";
import { OutfitFont } from "@/components/fonts";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import axios from "axios";

const ResetPasswordPage = () => {
  const params = useSearchParams();
  const token = params?.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(RegisterVendorSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const apiUrl = GetApiUrl();
    try {
      const res = await axios.get(
        `${apiUrl}/?token=${token}&password=${values.newPassword}`
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`flex items-top justify-center ${OutfitFont.className}`}>
      <CardWrapper backButtonHref="/auth/login" backButtonLabel="Back to Login">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 flex flex-col items-center"
          >
            <div className="w-[280px] sm:w-[350px]">
              <PasswordInput
                form={form}
                isReset={true}
                isPending={isPending}
                toggleShowPassword={toggleShowPassword}
                showPassword={showPassword}
              />
            </div>
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="w-[280px] sm:w-[350px]">
                  <FormLabel>Confirm New Password</FormLabel>
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
              Reset Password
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default ResetPasswordPage;
