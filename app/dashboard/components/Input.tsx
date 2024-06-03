"use client";
//regular text input component with error handling and detecting of what should go in the input.

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
  label: string;
  type?: string;
  disabled?: boolean; // Whether the input field is disabled
  formatPrice?: boolean; // Whether to format the input field as a price
  required?: boolean; // Whether the input field is required
  isUsername?: boolean;
  isEmail?: boolean;
  isNumber?: boolean;
  register: UseFormRegister<FieldValues>; // Function to register the input field with react-hook-form
  errors: FieldErrors; // Errors object from react-hook-form
  step?: string;
  validationRules?: RegisterOptions<FieldValues>;
}

// Input component
const Input: React.FC<InputProps> = ({
  id, // ID of the input field received as prop
  label, // Label for the input field received as prop
  type = "text", // Type of the input field (default is "text")
  disabled, // Whether the input field is disabled received as prop
  formatPrice, // Whether to format the input field as a price received as prop
  isUsername = false,
  isEmail = false,
  isNumber = false,
  register, // Function to register the input field with react-hook-form received as prop
  required, // Whether the input field is required received as prop
  errors,
  validationRules,
}) => {
  let registerOptions: RegisterOptions<FieldValues> = {
    required: required ? "This field is required" : false,
    ...validationRules,
  };

  // Conditionally add the pattern validation for usernames
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

        <input // Input field
          id={id}
          type={showPassword ? "text" : type} // ID of the input field
          disabled={disabled} // Whether the input field is disabled
          {...register(id, registerOptions)} // Registering the input field with react-hook-form
          placeholder="" // Placeholder text
          // type={type} // Type of the input field
          className={`
          peer
          w-full
          p-4
          pt-6
          font-light
          border-2
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

export default Input; // Exporting Input component
