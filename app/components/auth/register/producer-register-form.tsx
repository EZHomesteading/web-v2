"use client";
//producer register form with location handling
import * as z from "zod";
import AuthLocation from "../auth-location";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { RegisterVendorSchema } from "@/schemas";
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
import { register } from "@/actions/auth/register-vendor";
import { useRouter } from "next/navigation";
import axios from "axios";
//import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import PasswordInput from "./password-input";

export const ProducerRegisterForm = () => {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [formStep, setFormStep] = useState("step1");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "sellAndSource">(
    "sell"
  );

  const getLatLngFromAddress = async (address: string) => {
    const apiKey = process.env.MAPS_KEY;
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

  const form = useForm<z.infer<typeof RegisterVendorSchema>>({
    resolver: zodResolver(RegisterVendorSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phoneNumber: "",
      name: "",
      password: "",
      confirmPassword: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
        address: ["", "", "", ""],
      },
      role: UserRole.PRODUCER,
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

  useEffect(() => {
    setActiveTab("sell");
  }, []);

  const handleTabChange = (tab: "buy" | "sell" | "sellAndSource") => {
    switch (tab) {
      case "buy":
        router.push("/auth/register");
        break;
      case "sell":
        router.push("/auth/register-producer");
        break;
      case "sellAndSource":
        router.push("/auth/register-co-op");
        break;
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <CardWrapper
      headerLabel="Become a Producer"
      label2="Grow produce & sell to co-ops hassle-free"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      // showSocial
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
                          placeholder="Johnny"
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
                  disabled={isPending}
                  type="button"
                  className="w-full"
                  onClick={() => setFormStep("step2")}
                >
                  Next
                </Button>
              </>
            )}
          </div>

          {formStep === "step2" && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Appleseed Farm"
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
                  Become an EZH Producer
                </Button>
              </div>
            </>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ProducerRegisterForm;
