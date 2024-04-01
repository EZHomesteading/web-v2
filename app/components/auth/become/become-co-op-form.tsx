"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UpdateSchema } from "@/schemas";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { CardWrapper } from "@/app/components/auth/become/card-wrapper-become";
import { Button } from "@/app/components/ui/button";
import { FormError } from "@/app/components/form-error";
import { FormSuccess } from "@/app/components/form-success";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/next-auth";
import LocationSearchInput from "../../map/LocationSearchInput";

interface BecomeCoopProps {
  user?: UserInfo;
}
export const BecomeCoop = ({ user }: BecomeCoopProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"sell" | "sellAndSource">(
    "sellAndSource"
  );

  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      name: user?.name || "",
      location: user?.location || "",
      street: user?.street || "",
      city: user?.city || "",
      state: user?.state || "",
      zip: user?.zip || "",
      role: "COOP",
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateSchema>) => {};

  useEffect(() => {
    setActiveTab("sellAndSource");
  }, []);

  const handleTabChange = (tab: "sell" | "sellAndSource") => {
    switch (tab) {
      case "sell":
        router.push("/auth/register-producer");
        break;
      case "sellAndSource":
        router.push("/auth/register-co-op");
        break;
    }
  };

  return (
    <CardWrapper
      headerLabel="Become a Co-Op"
      label2="Grow produce & source from producers to expand then start selling. Use your current info or update it below."
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Johnny"
                      type="firstName"
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
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="555-555-5555"
                      type="phone"
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
                  <FormLabel>Co-Op Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Appleseed Store"
                      type="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-Op Location</FormLabel>
                  <FormControl>
                    <LocationSearchInput address="" setAddress={() => {}} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="button" className="w-full">
            Next
          </Button>
          <Button disabled={isPending} type="submit" className="w-full">
            Become an EZH Co-op
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
