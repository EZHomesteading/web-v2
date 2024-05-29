"use client";
//modal to allow users to sign up for email notifications when the product is back in stock
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Modal from "@/app/components/modals/chatmodals/Modal";
import Button from "@/app/components/modals/chatmodals/Button";
import { toast } from "sonner";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  listingId: string;
  userEmail?: string;
}

const NotifyModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  listingId,
  userEmail,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = React.useState(userEmail || "");
  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };
  function isValidEmail(testText: string) {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email string against the pattern
    return emailPattern.test(testText);
  }
  const onSubmit = async () => {
    if (text === "") {
      toast.error("no message enteredd");
      return;
    }
    if (isValidEmail(text) === false) {
      toast.error("invalid email");
      return;
    }
    console.log(listingId);
    setIsLoading(true);
    try {
      //email subscription API route
      await axios.post("/api/emailSub", {
        id: listingId,
        email: text,
      });
    } catch (err: any) {
      toast.error(err.response.data.error);
      setIsLoading(false);
      onClose();
      return;
    }

    setIsLoading(false);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex">
        <div className=" w-[100%]">
          <Dialog.Title
            as="h3"
            className="text-base  font-semibold leading-6 text-gray-900"
          >
            Enter your Email Adress
          </Dialog.Title>
          <textarea
            className="w-[100%] h-[60%] resize-none  border-[2px] border-gray- rounded-sm"
            name="cancel"
            id="cancel"
            value={text}
            onChange={handleTextChange}
          ></textarea>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse ">
        <Button disabled={isLoading} danger onClick={onSubmit}>
          Subscribe
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Go back
        </Button>
      </div>
    </Modal>
  );
};

export default NotifyModal;
