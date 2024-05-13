"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
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
  const [text, setText] = React.useState("");
  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const onDelete = () => {
    if (text === "") {
      toast.error("no message enteredd");
      return;
    }
    setIsLoading(true);
    console.log(order);
    axios.post("/api/messages", {
      message: `I have canceled this item, because: ${text}`,
      messageOrder: "1.1",
      conversationId: convoId,
      otherUserId: otherUser,
    });
    axios
      .post("/api/updateListingOnCancel", { order: order })
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
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex">
        <div>
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Reason for order cancellation?
          </Dialog.Title>
          <textarea
            className="w-[100%] h-[60%] resize-none  border-[2px] border-gray- rounded-sm"
            name="cancel"
            id="cancel"
            value={text}
            onChange={handleTextChange}
          ></textarea>
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
