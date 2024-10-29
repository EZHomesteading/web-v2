"use client";
//listing input forms

import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import { toast } from "sonner";

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
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  maxlength: number;
  inputmode:
    | "search"
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | undefined;
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
  inputmode,
  watch,
  setValue,
  type,
  maxlength,
}) => {
  let registerOptions: RegisterOptions<FieldValues> = {
    required: required ? "This field is required" : false,
    ...validationRules,
  };
  const validateInput = (value: string) => {
    if (type === "number") {
      const regex = formatPrice ? /^(\d*\.?\d{0,2}|\.\d{0,2})$/ : /^\d*$/;
      return regex.test(value);
    }
    return true;
  };
  return (
    <>
      <div className="w-inherit relative">
        <input
          id={id}
          disabled={disabled}
          {...register(id, {
            value: type === "number",
            ...registerOptions,
          })}
          inputMode={inputmode}
          pattern="[0-9]*\.?[0-9]*"
          placeholder=""
          className={`
          peer
          w-full
          p-4
          pt-6 
          border-[1px]
          shadow-sm
          rounded-[10px]
          outline-none
          font-extralight
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          pl-4
          ${errors[id] ? "border-rose-500" : "border-neutral-300"} 
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"} 
          ${
            errors[id]
              ? toast.error("Highlighted field is invalid or required")
              : "focus:border-black"
          } 
        `}
          value={isNaN(watch(id)) || watch(id) === undefined ? "" : watch(id)}
          onChange={(e) => {
            let value = e.target.value;
            if (maxlength && value.length > maxlength) {
              value = value.slice(0, maxlength);
              e.target.value = value;
            }
            if (formatPrice && value === ".") {
              value = "0.";
            }
            if (value === "" || validateInput(value)) {
              setValue(id, value === "" ? undefined : value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          }}
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
          peer-placeholder-shown:scale-100 
          left-4
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-black"}
        `}
        >
          {label}
        </label>{" "}
        {formatPrice && (
          <BiDollar
            size={24}
            className="text-neutral-700 absolute top-5 right-2"
          />
        )}
      </div>
    </>
  );
};

export default Input;
