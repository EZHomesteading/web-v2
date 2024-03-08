"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import useCoopUpdateModal from "@/app/hooks/useCoopUpdateModal";

const CoopUpdateModal = () => {
  const router = useRouter();
  const coopUpdateModal = useCoopUpdateModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

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
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Registered!");
        coopUpdateModal.onClose();
        signIn("credentials", {
          ...data,
          redirect: false,
        }).then((callback) => {
          setIsLoading(false);

          if (callback?.ok) {
            toast.success("Logged in");
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
  };

  const onToggle = useCallback(() => {
    coopUpdateModal.onClose();
    loginModal.onOpen();
  }, [coopUpdateModal, loginModal]);

  const bodyContent = (
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
        isUsername={true}
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
      isOpen={coopUpdateModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={coopUpdateModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default CoopUpdateModal;
