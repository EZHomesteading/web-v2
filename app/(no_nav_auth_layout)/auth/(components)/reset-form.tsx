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
import { CardWrapper } from "./login/card-wrapper-login";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import axios from "axios";
import { toast } from "sonner";
import { OutfitFont } from "@/components/fonts";

export const ResetForm = () => {
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
    const apiUrl = GetApiUrl();
    try {
      const res = await axios.get(`${apiUrl}/?email=${values.email}`);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occured, please try again later", {
        className: `${OutfitFont.className}`,
        duration: 5000,
      });
    }
  };

  return (
    <div className={`${OutfitFont.className}`}>
      <CardWrapper backButtonLabel="Back to Login" backButtonHref="/auth/login">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              Send Reset Email
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
