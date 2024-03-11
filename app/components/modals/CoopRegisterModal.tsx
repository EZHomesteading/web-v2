"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import useCoopRegisterModal from "@/app/hooks/useCoopRegisterModal";
import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import LocationSearchInput from "../map/LocationSearchInput";

const CoopRegisterModal = () => {
  type AddressComponents = {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  const router = useRouter();
  const coopRegisterModal = useCoopRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "coop",
    },
  });

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const fullAddress = `${data.street}, ${data.city}, ${data.state}, ${data.zip}`;
    const geoData = await getLatLngFromAddress(fullAddress);

    setIsLoading(true);

    if (geoData) {
      const formData = {
        ...data,
        location: {
          type: "Point",
          coordinates: [geoData.lng, geoData.lat],
        },
      };

      axios
        .post("/api/registercoop", formData)
        .then(() => {
          coopRegisterModal.onClose();
          signIn("credentials", {
            ...data,
            redirect: false,
          }).then((callback) => {
            // Set loading state to false
            setIsLoading(false);

            // Handle sign-in callback
            if (callback?.ok) {
              toast.success("You're now a Co-Op!");
              router.refresh();
            }

            if (callback?.error) {
              toast.error(callback.error);
            }
          });
        })
        .catch(function (error) {
          console.log(error.response.status);
          console.log(error.response.data);
          console.log(error.response.headers);
          toast.error("Username or Email invalid");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleAddressSelect = ({
    street,
    city,
    state,
    zip,
  }: AddressComponents) => {
    setValue("street", street);
    setValue("city", city);
    setValue("state", state);
    setValue("zip", zip);
  };

  const onToggle = useCallback(() => {
    coopRegisterModal.onClose();
    loginModal.onOpen();
  }, [coopRegisterModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to EZhomesteading"
        subtitle="Start selling your produce as a Co-Op!"
      />

      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        isUsername={true}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        isEmail={true}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validationRules={{
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
        }}
      />
      <LocationSearchInput
        address={watch("address")}
        setAddress={(address) => setValue("address", address)}
        onAddressParsed={handleAddressSelect}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={coopRegisterModal.isOpen}
      title=""
      actionLabel="Submit"
      onClose={coopRegisterModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default CoopRegisterModal;
