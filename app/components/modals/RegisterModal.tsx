"use client";
// Import necessary modules and components
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

// Define RegisterModal component
const RegisterModal = () => {
  const router = useRouter();
  // Hooks for managing state and form data
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  // Form control using react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });
  // Function to handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Send registration data to the backend
    axios
      .post("/api/register", data)
      .then(() => {
        registerModal.onClose();
        signIn("credentials", {
          ...data,
          redirect: false,
        }).then((callback) => {
          // Set loading state to false
          setIsLoading(false);

          // Handle sign-in callback
          if (callback?.ok) {
            toast.success("Welcome to EZHomesteading!");
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
        toast.error("Username or Email Already in use");
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
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to EZHomesteading" subtitle="Create an account" />

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
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

// Export the RegisterModal component
export default RegisterModal;
