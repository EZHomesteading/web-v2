"use client";
// Import necessary modules and components

// create new post route for update user
// get current user for update.
// add new variables and fields to update.
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "../components/modals/Modal";
import Input from "../components/inputs/Input";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { FORM_DEFAULT_STATE } from "react-hook-form/dist/constants";

// Define RegisterModal component
const updateModal = () => {
  // Hooks for managing state and form data
  const [isLoading, setIsLoading] = useState(false);

  // Form control using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: "",
      address: "",
      zip: "",
      state: "",
      isCoop: false,
      isProducer: false,
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Send registration data to the backend
    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Updated!");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // JSX content for the modal body
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Heading
          title="Update your account info"
          subtitle="enter details below"
        />
        <Input
          id="phoneNumber"
          label="phone number"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="address"
          label="address"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="zip"
          label="zip code"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="state"
          label="state"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="city"
          label="Name"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="password"
          label="Password"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <hr />
        <div className="text-neutral-500 text-center mt-4 font-light">
          <p>
            <span
              onClick={handleSubmit(onSubmit)}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              SUBMIT
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the RegisterModal component
export default updateModal;
