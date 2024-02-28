"use client";
// Import necessary modules and components
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

import Button from "../Button";
import { useTheme } from "next-themes";

// Define props interface for Modal component
interface ModalProps {
  isOpen?: boolean; // Optional prop indicating whether the modal is open
  onClose: () => void; // Function to handle modal close event
  onSubmit: () => void; // Function to handle form submission event
  title?: string; // Optional title for the modal
  body?: React.ReactElement; // JSX content for the modal body
  footer?: React.ReactElement; // JSX content for the modal footer
  actionLabel: string; // Label for the primary action button
  disabled?: boolean; // Optional prop indicating whether the modal is disabled
  secondaryAction?: () => void; // Function to handle secondary action button click
  secondaryActionLabel?: string; // Label for the secondary action button
}

// Modal component definition
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const { theme } = useTheme(); // Get the current theme using useTheme hook

  // Define CSS variables for modal background colors based on the theme
  const modalBackgroundLight = "#ffffff"; // Light theme modal background
  const modalBackgroundDark = "#333333"; // Dark theme modal background

  // Update modal background dynamically based on the theme
  const modalStyle = {
    backgroundColor:
      theme === "light" ? modalBackgroundLight : modalBackgroundDark,
  };
  // State variable to manage modal visibility
  const [showModal, setShowModal] = useState(isOpen);

  // Effect to synchronize modal visibility with isOpen prop
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Callback function to handle modal close event
  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  // Callback function to handle form submission event
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  // Callback function to handle secondary action button click
  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  // If modal is not open, return null
  if (!isOpen) {
    return null;
  }

  // Render the modal JSX
  return (
    <>
      <div
        className="
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-neutral-800/70
        "
      >
        <div
          className="
          relative 
          w-full
          md:w-4/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto 
          h-full 
          lg:h-auto
          md:h-auto
          "
        >
          {/* Modal content */}
          <div
            className={`
            translate
            duration-300
            h-full
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="
              translate
              h-full
              lg:h-auto
              md:h-auto
              border-0 
              rounded-lg 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-full  
              outline-none 
              focus:outline-none
            "
              style={modalStyle}
            >
              {/* Modal header */}
              <div
                className="
                flex 
                items-center 
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
                "
              >
                <button
                  className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                    absolute
                    left-9
                  "
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/* Modal body */}
              <div className="relative p-6 flex-auto">{body}</div>
              {/* Modal footer */}
              <div className="flex flex-col gap-2 p-6">
                <div
                  className="
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    w-full
                  "
                >
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      disabled={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                      outline
                    />
                  )}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Export the Modal component
export default Modal;
