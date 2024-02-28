"use client";
// Import necessary modules and components
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import { Button } from "../components/ui/button";

// Define RegisterModal component
const RegisterModal = () => {
  // Hooks for managing state and form data
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  // Form control using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "coop",
      address: "",
      phoneNumber: "",
      zip: "",
      state: "",
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Send registration data to the backend
    axios
      .post("/api/registercoop", data)
      .then(() => {
        toast.success("Registered!");
        registerModal.onClose();
        loginModal.onOpen();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to toggle between register and login modals
  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  // JSX content for the modal body
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Heading
          title="Welcome to EZhomesteading"
          subtitle="Create an account!"
        />
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="name"
          label="Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="password"
          label="Password"
          type="text"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="address"
          label="Address (not required)"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="phoneNumber"
          label="Phone Number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="zip"
          label="Zip Code (not required)"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="state"
          label="State (not required)"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>

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
      <div className="flex flex-col gap-4 mt-3">
        <div className="text-neutral-500 text-center mt-4 font-light">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export the RegisterModal component
export default RegisterModal;
