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
import AuthLocation from "../auth-location";
import axios from "axios";
import { UserRole } from "@prisma/client";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

interface BecomeCoopProps {
  user?: UserInfo;
}
export const BecomeCoop = ({ user }: BecomeCoopProps) => {
  const [address, setAddress] = useState<string>("");
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"sell" | "sellAndSource">("sell");
  const getLatLngFromAddress = async (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error("Geocoding failed");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleAddressParsed = async (parsedAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => {
    const { street, city, state, zip } = parsedAddress;
    console.log("address:", parsedAddress);
    const latLng = await getLatLngFromAddress(
      `${parsedAddress.street}, ${parsedAddress.city}, ${parsedAddress.state} ${parsedAddress.zip}`
    );

    if (latLng) {
      form.setValue("location", {
        type: "Point",
        coordinates: [latLng.lng, latLng.lat],
        address: [street, city, state, zip],
      });
    }
  };
  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      name: user?.name || "",

      location: {
        type: "Point",
        coordinates: (user?.location?.coordinates?.slice(0, 2) as [
          number,
          number
        ]) || [0, 0],
        address: (user?.location?.address as [
          string,
          string,
          string,
          string
        ]) || ["", "", "", ""],
      },
      role: UserRole.COOP,
    },
  });
  const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
    try {
      const updatedValues = {
        ...values,
      };
      const stripeResponse = await axios.post(
        "/api/stripe/create-connected-account",
        {
          userId: user?.id,
        }
      );
      if (stripeResponse.status === 200) {
        await fetch("/api/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        });
      } else {
        setError(
          "An error occurred while creating the Stripe connected account. This occurs most often when you enter an invalid information, especially phone number."
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      startTransition(() => {
        setError("");
        setSuccess("Your account has been updated.");
        router.push("/");
      });
    }
  };

  useEffect(() => {
    setActiveTab("sellAndSource");
  }, []);

  const [formStep, setFormStep] = useState<"step1" | "step2">("step1");

  const handleTabChange = (tab: "sell" | "sellAndSource") => {
    switch (tab) {
      case "sell":
        router.push("/auth/become-a-producer");
        break;
      case "sellAndSource":
        router.push("/auth/become-a-co-op");
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
            {formStep === "step1" && (
              <>
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
                          placeholder="john"
                          type="name"
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
                      <FormLabel>Current Email</FormLabel>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isPending}
                  type="button"
                  className="w-full"
                  onClick={() => setFormStep("step2")}
                >
                  Next
                </Button>
              </>
            )}
            {formStep === "step2" && (
              <>
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
                          type="name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AuthLocation
                  address={address}
                  setAddress={setAddress}
                  onAddressParsed={handleAddressParsed}
                />

                <div className="flex flex-row">
                  <Button
                    disabled={isPending}
                    type="button"
                    className="w-full"
                    onClick={() => setFormStep("step1")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => onSubmit(form.getValues())}
                    disabled={isPending}
                    type="submit"
                    className="w-full"
                  >
                    Become an EZH Co-op
                  </Button>
                </div>
              </>
            )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      </Form>
    </CardWrapper>
  );
};
