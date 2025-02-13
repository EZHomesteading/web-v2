"use client";
//modal to confirm that user wants to delete that chat, should only be able to delete if messages are at a finalised state such as completed or cancelled.
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Modal from "@/components/modals/chatmodals/Modal";
import Button from "@/components/modals/chatmodals/Button";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const NotSureModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start ">
        <div
          className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
        >
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Enter The Name of Your Product
          </Dialog.Title>
          <div className="mt-2">
            <input type="text" />
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} onClick={onClose}>
          Use this Category?
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          close
        </Button>
      </div>
    </Modal>
  );
};

export default NotSureModal;
