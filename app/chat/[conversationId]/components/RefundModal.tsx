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
  orderAmount: number | undefined;
  conversationId: string | null | undefined;
  otherUserId: string | undefined;
  paymentId: string | null | undefined;
  orderGroupId: string | null;
}

const RefundModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderAmount,
  conversationId,
  otherUserId,
  paymentId,
  orderGroupId,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(async () => {
    setIsLoading(true);
    const data = { orderId, status: "REFUNDED" };
    axios.post("/api/stripe/refund-payment", {
      paymentId: paymentId,
    });
    axios.post(`/api/chat/dispute/updateDispute/`, data);
    axios.post("/api/useractions/checkout/update-order", {
      orderId: orderId,
      status: "REFUNDED",
      completedAt: new Date(),
    });
    await axios.post("/api/useractions/checkout/remove-order-from-group", {
      orderGroupId: orderGroupId,
      orderId: orderId,
    });
    axios
      .post("/api/chat/messages", {
        message: `I have Refunded you the full amount of $${orderAmount}, this order is marked as cancelled. Feel free to Delete this chat.`,
        messageOrder: "REFUNDED",
        conversationId: conversationId,
        otherUserId: otherUserId,
      })
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
            Refund the entire amount?
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              This will Refund the amount of ${orderAmount} to the buyer. Are
              you sure you want to do this?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Yes
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          No
        </Button>
      </div>
    </Modal>
  );
};

export default RefundModal;
