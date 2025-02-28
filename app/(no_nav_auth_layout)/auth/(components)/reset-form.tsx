"use client";
//reset account form
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "./login/auth-card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import axios from "axios";
import { toast } from "sonner";
import { OutfitFont } from "@/components/fonts";
import Toast from "@/components/ui/toast";

export const ResetForm = ({ apiUrl }: { apiUrl: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    try {
      const res = await axios.get(
        `${apiUrl}/resend/send-pw-reset-email?email=${values.email}`
      );
      Toast({ message: res.data.message });
    } catch (error) {
      console.error(error);
      toast.error("An error occured, please try again later", {
        className: `${OutfitFont.className}`,
        duration: 5000,
      });
    }
  };

  return (
    <CardWrapper backButtonLabel="Back to Login" backButtonHref="/auth/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={`space-y-4 ${OutfitFont.className}`}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="johnnyappleseed@gmail.com"
                      type="email"
                      className={`w-[280px] sm:w-[350px]`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <button
              className={`${OutfitFont.className} w-full border border-custom shadow-sm rounded-md py-2 bg-black text-white`}
              disabled={isPending}
              type="submit"
            >
              Send Reset Email
            </button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
