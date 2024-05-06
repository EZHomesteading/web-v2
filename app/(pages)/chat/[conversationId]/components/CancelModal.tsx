"use client";

import React, { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/app/components/modals/chatmodals/Modal";
import Button from "@/app/components/modals/chatmodals/Button";
import useConversation from "@/hooks/messenger/useConversation";
import { toast } from "react-hot-toast";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  order: any;
  otherUser: any;
  convoId: any;
  otherUserRole: string;
}

const CancelModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  order,
  otherUser,
  convoId,
  otherUserRole,
}) => {
  const session = useSession();
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    console.log(order);
    axios
      .post("/api/messages", {
        message: "I have canceled this item, because of reasons",
        messageOrder: "1.1",
        conversationId: convoId,
        otherUserId: otherUser,
      })
      .then(() => {
        if (session.data?.user.id === order.sellerId) {
          if (session.data?.user.role === "COOP") {
            axios
              .post("/api/update-order", { orderId: order.id, status: 4 })
              .then(() => {
                onClose();
                router.refresh();
              });
          } else {
            axios
              .post("/api/update-order", { orderId: order.id, status: 12 })
              .then(() => {
                onClose();
                router.refresh();
              });
          }
        } else {
          if (session.data?.user.role === "COOP") {
            if (
              session.data?.user.role === "COOP" &&
              otherUserRole === "COOP"
            ) {
              axios
                .post("/api/update-order", { orderId: order.id, status: 7 })
                .then(() => {
                  onClose();
                  router.refresh();
                });
            } else {
              axios
                .post("/api/update-order", { orderId: order.id, status: 15 })
                .then(() => {
                  onClose();
                  router.refresh();
                });
            }
          } else {
            axios
              .post("/api/update-order", { orderId: order.id, status: 7 })
              .then(() => {
                onClose();
                router.refresh();
              });
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [router, conversationId, onClose]);

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
            Cancel Order?
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse ">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Cancel Order
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Go back
        </Button>
      </div>
    </Modal>
  );
};

export default CancelModal;
