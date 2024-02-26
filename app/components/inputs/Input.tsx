"use client";

// Importing necessary modules and components
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"; // Components and types from react-hook-form
import { BiDollar } from "react-icons/bi"; // Icon component for dollar symbol

// Interface defining props accepted by the Input component
interface InputProps {
  id: string; // ID of the input field
  label: string; // Label for the input field
  type?: string; // Type of the input field (default is "text")
  disabled?: boolean; // Whether the input field is disabled
  formatPrice?: boolean; // Whether to format the input field as a price
  required?: boolean; // Whether the input field is required
  register: UseFormRegister<FieldValues>; // Function to register the input field with react-hook-form
  errors: FieldErrors; // Errors object from react-hook-form
}

// Input component
const Input: React.FC<InputProps> = ({
  id, // ID of the input field received as prop
  label, // Label for the input field received as prop
  type = "text", // Type of the input field (default is "text")
  disabled, // Whether the input field is disabled received as prop
  formatPrice, // Whether to format the input field as a price received as prop
  register, // Function to register the input field with react-hook-form received as prop
  required, // Whether the input field is required received as prop
  errors, // Errors object from react-hook-form received as prop
}) => {
  return (
    <div className="w-full relative">
      {" "}
      {/* Container for the input field */}
      {formatPrice && ( // Conditional rendering if formatPrice is true
        <BiDollar // Dollar symbol icon
          size={24} // Size of the icon
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}
      <input // Input field
        id={id} // ID of the input field
        disabled={disabled} // Whether the input field is disabled
        {...register(id, { required })} // Registering the input field with react-hook-form
        placeholder=" " // Placeholder text
        type={type} // Type of the input field
        className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${
            formatPrice ? "pl-9" : "pl-4"
          } // Adding left padding if formatPrice is true
          ${
            errors[id] ? "border-rose-500" : "border-neutral-300"
          } // Highlighting border in case of error
          ${
            errors[id] ? "focus:border-rose-500" : "focus:border-black"
          } // Highlighting border in case of focus
        `}
      />
      <label // Label for the input field
        className={`
          absolute 
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          ${
            formatPrice ? "left-9" : "left-4"
          } // Adjusting left position if formatPrice is true
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${
            errors[id] ? "text-rose-500" : "text-zinc-400"
          } // Changing color in case of error
        `}
      >
        {label} {/* Label text */}
      </label>
    </div>
  );
};

export default Input; // Exporting Input component
