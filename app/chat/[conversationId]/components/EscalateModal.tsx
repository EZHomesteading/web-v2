"use client";
//modal to confirm that user wants to delete that chat, should only be able to delete if messages are at a finalised state such as completed or cancelled.
import React, { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/chatmodals/Modal";
import Button from "@/components/modals/chatmodals/Button";
import Toast from "@/components/ui/toast";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  orderId: string | undefined;
}

const EscalateModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  orderId,
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    const data = { orderId, status: "DISPUTE_UNDER_REVIEW" };
    axios.post("/api/useractions/checkout/update-order", {
      orderId: orderId,
      status: "DISPUTE_UNDER_REVIEW",
    });
    axios
      .post(`/api/chat/dispute/updateDispute/`, data)
      .then(() => {
        onClose();
        router.refresh();
      })
      .catch(() => Toast({ message: "Something went wrong!" }))
      .finally(() => setIsLoading(false));
  }, [router, orderId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
        >
          <FiAlertTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
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
            Get an Admin involved?
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              This will mark the dispute as "needs attention" so our admins know
              to come look at the situation. If you click yes, an Administrator
              will be in the chat shortly to help sort out the problem.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Get me an Admin
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          cancel
        </Button>
      </div>
    </Modal>
  );
};

export default EscalateModal;
