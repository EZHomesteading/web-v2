"use client";
// Import necessary modules and components

// make radiogroup data go where its supposed to

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { SafeUser } from "@/app/types";
import Container from "@/app/components/Container";
import { useRouter } from "next/navigation";
// import getCurrentUser from "@/app/actions/getCurrentUser";

import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import { Button } from "@/app/components/ui/button";
// const currentUser = getCurrentUser();

interface UpdateUserProps {
  currentUser?: SafeUser | null;
}

// Define RegisterModal component
const UpdateClient: React.FC<UpdateUserProps> = ({ currentUser }) => {
  const router = useRouter();
  // Hooks for managing state and form data
  const [isLoading, setIsLoading] = useState(false);

  // Form control using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: currentUser?.phoneNumber,
      address: currentUser?.street,
      zip: currentUser?.zip,
      state: currentUser?.state,
      role: "coop",
      name: currentUser?.name,
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!data.phoneNumber) {
      toast.error("Phone Number");
      return;
    }
    setIsLoading(true);

    // Send registration data to the backend
    axios
      .post("/api/update", data)
      .then(() => {
        toast.success("You're now a Co-Op!");
        router.refresh();
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
    <Container>
      <div className="flex flex-col gap-4">
        <Heading
          title="Update your account info"
          subtitle="enter details below"
        />

        <Input
          id="name"
          label="Username"
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
          isNumber
        />

        <Input
          id="address"
          label="Address"
          disabled={isLoading}
          register={register}
          errors={errors}
        />

        <Input
          id="zip"
          label="Zip Code"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="state"
          label="State"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
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
    </Container>
  );
};

// Export the RegisterModal component
export default UpdateClient;
