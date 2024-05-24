"use client";
import toast from "react-hot-toast";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  step?: string;
  validationRules?: RegisterOptions<FieldValues>;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  disabled,
  formatPrice,
  register,
  required,
  errors,
  validationRules,
}) => {
  let registerOptions: RegisterOptions<FieldValues> = {
    required: required ? "This field is required" : false,
    ...validationRules,
  };

  return (
    <>
      <div className="w-inherit relative">
        {formatPrice && (
          <BiDollar
            size={24}
            className="text-neutral-700 absolute top-5 left-2"
          />
        )}

        <input
          id={id}
          disabled={disabled}
          {...register(id, registerOptions)}
          placeholder=""
          className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          border-[1px]
          shadow-md
          rounded-[20px]
          outline-none
          bg
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"} 
          ${errors[id] ? "border-rose-500" : "border-neutral-300"} 
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"} 
          ${
            errors[id]
              ? toast.error("Highlighted field is invalid or required")
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
          z-5 
          origin-[0] 
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-black"}
        `}
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default Input; // Exporting Input component
