"use client";
// Import necessary modules and components
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useBecomeCoopModal from "@/app/hooks/useBecomeCoopModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

// Define RegisterModal component
const BecomeCoopModal = () => {
  // Hooks for managing state and form data
  const becomeCoopModal = useBecomeCoopModal();
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
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Send registration data to the backend
    axios
      .post("/api/become", data)
      .then(() => {
        toast.success("Registered as a Co-Op!");
        becomeCoopModal.onClose();
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
    becomeCoopModal.onClose();
    loginModal.onOpen();
  }, [becomeCoopModal, loginModal]);

  // JSX content for the modal body
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to EZHomesteading" subtitle="Become a Co-Op!" />
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
    </div>
  );

  // JSX content for the modal footer
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
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

  // Render the RegisterModal component
  return (
    <Modal
      disabled={isLoading}
      isOpen={becomeCoopModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={becomeCoopModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

// Export the RegisterModal component
export default BecomeCoopModal;
