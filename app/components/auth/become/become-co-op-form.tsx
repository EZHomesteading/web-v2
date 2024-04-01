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
import { useMapsLibrary } from "@vis.gl/react-google-maps";

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

  const [location, setLocation] = useState("");
  console.log(location);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder>();
  const [geocodingResult, setGeocodingResult] =
    useState<google.maps.GeocoderResult>();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!geocodingApiLoaded) return;
    setGeocodingService(new window.google.maps.Geocoder());
  }, [geocodingApiLoaded]);

  useEffect(() => {
    if (!geocodingService || !address) return;
    geocodingService.geocode({ address }, (results, status) => {
      if (results && status === "OK") {
        setGeocodingResult(results[0]);
      }
    });
  }, [geocodingService, address]);

  const handleAddressParsed = (latLng: { lat: number; lng: number } | null) => {
    setLatLng(latLng);
    console.log(latLng);
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
        coordinates: user?.location?.coordinates || [0, 0],
      },
      street: user?.street || "",
      city: user?.city || "",
      state: user?.state || "",
      zip: user?.zip || "",
      role: "COOP",
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
    try {
      const locationObj = {
        type: "Point",
        coordinates: [latLng?.lng || 0, latLng?.lat || 0],
      };
      const response = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSuccess("Co-op information updated successfully.");
        router.push("/");
      } else {
        setError("Failed to update co-op information.");
      }
    } catch (error) {
      setError("An error occurred while updating co-op information.");
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
                      <FormLabel>Current Phone Number</FormLabel>
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
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Co-Op Location</FormLabel>
                      <FormControl>
                        <AuthLocation
                          address={location}
                          setAddress={setLocation}
                          onAddressParsed={handleAddressParsed}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  <Button disabled={isPending} type="submit" className="w-full">
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
