"use client";

import React, { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export type FormValues = {
  cardNumber: string;
  expirationDate: string;
  ccv: string;
  zipCode: string;
};

interface InputProps {
  id: keyof FormValues;
  label: string;
  type?: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  roundT?: boolean;
  roundB?: boolean;
  round?: boolean;
  roundLB?: boolean;
  roundRB?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  register,
  errors,
  round = false,
  roundB = false,
  roundT = false,
  roundLB = false,
  roundRB = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const getValidationRules = (id: keyof FormValues) => {
    switch (id) {
      case "cardNumber":
        return {
          required: "Card number is required",
          pattern: {
            value: /^[0-9]{16}$/,
            message: "Please enter a valid 16-digit card number",
          },
        };
      case "expirationDate":
        return {
          required: "Expiration date is required",
          pattern: {
            value: /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
            message: "Please enter a valid expiration date (MM/YY)",
          },
        };
      case "ccv":
        return {
          required: "CCV is required",
          pattern: {
            value: /^[0-9]{3,4}$/,
            message: "Please enter a valid 3 or 4 digit CCV",
          },
        };
      case "zipCode":
        return {
          required: "Zip code is required",
          pattern: {
            value: /^[0-9]{5}(?:-[0-9]{4})?$/,
            message: "Please enter a valid zip code",
          },
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-full relative">
      <input
        id={id}
        type={type}
        {...register(id, getValidationRules(id))}
        value={inputValue}
        onChange={handleInputChange}
        className={`
          peer
          w-full
          font-light
          p-2
          pt-6
          bg-inherit
          ${
            round
              ? "rounded-md border"
              : roundB
              ? "rounded-b-md"
              : roundT
              ? "rounded-t-md  border-l-[1px] border-t-[1px] border-r-[1px]"
              : roundLB
              ? "rounded-bl-md border"
              : roundRB &&
                "rounded-br-md border-t-[1px] border-r-[1px] border-b-[1px]"
          }
          outline-none
          transition
          pl-4
          pr-4
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
          left-4
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
      {errors[id] && (
        <p className="text-rose-500 text-sm mt-1">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Input;
