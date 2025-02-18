"use client";
//modal that handles order cancellation(need to add logic to start refun process dependent on step the order is canceled)
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/modals/chatmodals/Modal";
import Button from "@/components/modals/chatmodals/Button";
import { ChatOrder } from "chat-types";
import Toast from "@/components/ui/toast";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  order: ChatOrder | null;
  otherUser: string | undefined;
  convoId: string | null | undefined;
  otherUserRole: string | undefined;
  isSeller: boolean;
  orderGroupId: string | null;
}

const CancelModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  order,
  otherUser,
  convoId,
  otherUserRole,
  isSeller,
  orderGroupId,
}) => {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = React.useState("");
  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const onDelete = async () => {
    //early return if the user has not entered a message, tell the user why
    if (text === "") {
      Toast({ message: "No message entered" });
      return;
    }

    setIsLoading(true);
    axios.post("/api/stripe/refund-payment", {
      paymentId: order?.paymentIntentId,
    });

    if (isSeller === true) {
      axios.post("/api/useractions/checkout/update-order", {
        orderId: order?.id,
        status: "CANCELED",
        completedAt: new Date(),
      });
    } else {
      axios.post("/api/useractions/checkout/update-order", {
        orderId: order?.id,
        status: "CANCELED",
        completedAt: new Date(),
      });
    }
    await axios.post("/api/useractions/checkout/remove-order-from-group", {
      orderGroupId: orderGroupId,
      orderId: order?.id,
    });
    //axios post is always the same. post a message with the users input text
    axios.post("/api/chat/messages", {
      message: `I have canceled this item, because: ${text}`,
      messageOrder: "CANCELED",
      conversationId: convoId,
      otherUserId: otherUser,
    });
    axios
      .post("/api/chat/updateListingOnCancel", { order: order })
      .then(() => {
        //sependent on who canceled, set order status appropriately.
        if (session.data?.user.id === order?.sellerId) {
          //if seller cancels
          if (session.data?.user.role === "COOP") {
            //if seller is coop
            axios
              .post("/api/useractions/checkout/update-order", {
                orderId: order?.id,
                status: "CANCELED",
                completedAt: new Date(),
              })
              .then(() => {
                onClose();
                router.refresh();
              });
          } else {
            //if seller is producer(can be else as consumers cant create listings)
            axios
              .post("/api/useractions/checkout/update-order", {
                orderId: order?.id,
                status: "CANCELED",
                completedAt: new Date(),
              })
              .then(() => {
                onClose();
                router.refresh();
              });
          }
        } else {
          //if canceling user is not seller
          if (session.data?.user.role === "COOP") {
            //if cancelling user is coop
            if (
              session.data?.user.role === "COOP" &&
              otherUserRole === "COOP"
            ) {
              //if both users are coop's
              axios
                .post("/api/useractions/checkout/update-order", {
                  orderId: order?.id,
                  status: "CANCELED",
                  completedAt: new Date(),
                })
                .then(() => {
                  onClose();
                  router.refresh();
                });
            } else {
              //if only person cancelling is coop buying from producer
              axios
                .post("/api/useractions/checkout/update-order", {
                  orderId: order?.id,
                  status: "CANCELED",
                  completedAt: new Date(),
                })
                .then(() => {
                  onClose();
                  router.refresh();
                });
            }
          } else {
            //if consumer cancels
            axios
              .post("/api/useractions/checkout/update-order", {
                orderId: order?.id,
                status: "CANCELED",
                completedAt: new Date(),
              })
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
