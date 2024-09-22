"use client";

import React, { useState } from "react";
import { FieldErrors, UseFormRegister, RegisterOptions } from "react-hook-form";
import { FormValues } from "./types";
import { BiDollar } from "react-icons/bi";
import { PiEye, PiEyeClosedThin } from "react-icons/pi";

interface InputProps {
  id: keyof FormValues;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  isUsername?: boolean;
  isEmail?: boolean;
  isPhoneNumber?: boolean;
  formatPrice?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  register,
  required,
  errors,
  isUsername = false,
  isEmail = false,
  isPhoneNumber = false,
  formatPrice = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    let formattedNumber = "";

    if (cleaned.startsWith("1")) {
      cleaned = cleaned.slice(1);
      formattedNumber = "+1 ";
    }

    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }

    if (cleaned.length > 0) {
      formattedNumber += "(" + cleaned.slice(0, Math.min(3, cleaned.length));
    }
    if (cleaned.length >= 4) {
      formattedNumber += ") " + cleaned.slice(3, Math.min(6, cleaned.length));
    }
    if (cleaned.length >= 7) {
      formattedNumber += "-" + cleaned.slice(6, 10);
    }

    return formattedNumber;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    let value = input.value;

    if (isPhoneNumber) {
      const rawNumbers = value.replace(/\D/g, "");
      value = formatPhoneNumber(rawNumbers);

      const newCursorPosition = calculateCursorPosition(
        input.value,
        value,
        input.selectionStart || 0
      );

      setInputValue(value);

      setTimeout(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      setInputValue(value);
    }

    register(id, registerOptions).onChange({
      ...event,
      target: {
        ...input,
        value: value,
      },
    });
  };

  const registerOptions: RegisterOptions<FormValues, typeof id> = {
    required: required ? "This field is required" : false,
  };

  if (isUsername) {
    registerOptions.pattern = {
      value: /^(?=.{4,})[a-zA-Z0-9&' ]+$/,
      message:
        "Username must be at least 4 characters long and can only contain letters, numbers, &, and '",
    };
  }

  if (isEmail) {
    registerOptions.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Not a valid email",
    };
  }

  if (isPhoneNumber) {
    registerOptions.pattern = {
      value: /^\+1 \d{10}$|^\(\d{3}\) \d{3}-\d{4}$/,
      message: "Invalid phone number format",
    };
  }

  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        type={showPassword ? "text" : type}
        disabled={disabled}
        {...register(id, registerOptions)}
        placeholder=""
        value={inputValue}
        onChange={handleInputChange}
        className={`
          peer
          w-full
          max-w-screen
          ${type === "password" ? "w-full" : "sm:max-w-[500px]"}
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
          ${type === "password" ? "pr-10" : "pr-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
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
      {type === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {showPassword ? <PiEye size={20} /> : <PiEyeClosedThin size={20} />}
        </button>
      )}
      {errors[id] && (
        <p className="text-rose-500 text-sm mt-1">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;

const calculateCursorPosition = (
  rawValue: string,
  formattedValue: string,
  selectionStart: number
) => {
  const rawDigitsBeforeCursor = rawValue
    .slice(0, selectionStart)
    .replace(/\D/g, "").length;

  let digitCount = 0;
  let newCursorPosition = 0;

  for (let i = 0; i < formattedValue.length; i++) {
    if (/\d/.test(formattedValue[i])) {
      digitCount++;
    }
    if (digitCount === rawDigitsBeforeCursor + 1) {
      newCursorPosition = i + 1;
      break;
    }
  }

  if (newCursorPosition === 0) {
    newCursorPosition = formattedValue.length;
  }

  return newCursorPosition;
};
