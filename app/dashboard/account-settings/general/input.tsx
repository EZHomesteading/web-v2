"use client";

import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import { PiEye, PiEyeClosedThin } from "react-icons/pi";
import { toast } from "sonner";

interface InputProps {
  id: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  label?: string;
  required?: boolean;
  isUsername?: boolean;
  isEmail?: boolean;
  isNumber?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  step?: string;
  validationRules?: RegisterOptions<FieldValues>;
}

const Input: React.FC<InputProps> = ({
  id,
  type = "text",
  disabled,
  label,
  formatPrice,
  isUsername = false,
  isEmail = false,
  isNumber = false,
  register,
  required,
  errors,
  validationRules,
}) => {
  let registerOptions: RegisterOptions<FieldValues> = {
    required: required ? "This field is required" : false,
    ...validationRules,
  };

  if (isUsername) {
    registerOptions.pattern = {
      value: /^(?=.{4,})[a-zA-Z0-9&' ]+$/,
      message: "Username must not contain spaces or special characters",
    };
  }
  if (isNumber) {
    registerOptions.pattern = {
      value: /^(\+1)?\s*\(\d{3}\)\s*\d{3}-\d{4}$/,
      message: "Only enter numbers",
    };
  }
  if (isEmail) {
    registerOptions.pattern = {
      value: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
      message: "Not a valid Email",
    };
  }

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <div className="w-inherit relative">
        {formatPrice && (
          <BiDollar
            size={24}
            className="text-neutral-700 absolute top-5 left-2"
          />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? <PiEye size={20} /> : <PiEyeClosedThin size={20} />}
          </button>
        )}

        <input
          id={id}
          type={showPassword ? "text" : type}
          disabled={disabled}
          {...register(id, registerOptions)}
          placeholder=""
          className={`
          peer
          w-full
          max-w-screen
          sm:max-w-[500px]
          font-light
          p-2
          pt-6
          bg-inherit
          border
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
          ${
            errors[id]
              ? toast.success("Highlighted field is invalid or required")
              : "focus:border-black"
          }
        `}
        />
        <label
          className={`
        absolute
        text-md
        duration-150
        transform
        -translate-y-3
        top-5
        text-sm
        z-10
        origin-[0]
        ${formatPrice ? "left-9" : "left-4"}
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id] ? "text-rose-500" : "text-zinc-400"}
      `}
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default Input;
