"use client";
//become producer auth form
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UpdateSchema } from "@/schemas";
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
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { UserInfo } from "next-auth";

interface BecomeProducerProps {
  user?: UserInfo;
  createStripeConnectedAccount: () => Promise<any>;
}

export const BecomeProducer = ({
  user,
  createStripeConnectedAccount,
}: BecomeProducerProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      firstName: user?.fullName?.first || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      name: user?.name || "",

      role: UserRole.PRODUCER,
    },
  });
  const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
    try {
      const updatedValues = {
        ...values,
      };
      await createStripeConnectedAccount();

      console.log("Updating user information");
      await fetch("/api/useractions/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      setSuccess("Your account has been updated.");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setError("An error occurred. Please try again.");
    } finally {
      startTransition(() => {
        setError("");
        setSuccess("Your account has been updated.");
        router.push("/onboard");
      });
    }
  };

  return (
    <CardWrapper
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-[280px] sm:w-[350px]">
                    <FormLabel>Current Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="font-light"
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
                        className="font-light"
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
                  <FormItem>
                    <FormLabel>Producer Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Appleseed Store"
                        type="name"
                        className="font-light"
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
                className="w-full text-xs"
              >
                Become an EZH Producer
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
