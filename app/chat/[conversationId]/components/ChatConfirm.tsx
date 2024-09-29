"use client";
//modal to confirm that user wants to delete that chat, should only be able to delete if messages are at a finalised state such as completed or cancelled.
import React, { useCallback, useState } from "react";

import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import Modal from "@/app/components/modals/chatmodals/Modal";
import Button from "@/app/components/modals/chatmodals/Button";

type SubmitFunction = () => Promise<void>;
interface ConfirmModalProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  modalMessage: string;
  currentSubmitFunction: SubmitFunction | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  onCancel: () => void;
}

const ChatConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onOpenChange,
  setIsLoading,
  modalMessage,
  currentSubmitFunction,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal isOpen={open} onClose={onCancel}>
      <div className="sm:flex sm:items-start">
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
            Confirm action
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              This will send this message: {modalMessage}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between w-full">
        <Button danger onClick={onCancel}>
          Cancel
        </Button>

        <Button secondary onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ChatConfirmModal;
