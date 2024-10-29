"use client";
//modal that handles order cancellation(need to add logic to start refun process dependent on step the order is cancelled)
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/modals/chatmodals/Modal";
import Button from "@/components/modals/chatmodals/Button";
import { toast } from "react-hot-toast";
import { Order } from "@prisma/client";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  order: Order;
  otherUser: string | undefined;
  convoId: string | null;
  otherUserRole: string | undefined;
  isSeller: boolean;
}

const CancelModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  order,
  otherUser,
  convoId,
  otherUserRole,
  isSeller,
}) => {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = React.useState("");
  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const onDelete = async () => {
    //early return if the user ahs not entered a message, tell the user why
    if (text === "") {
      toast.error("no message entered");
      return;
    }
    setIsLoading(true);
    console.log(order.paymentIntentId);
    axios.post("/api/stripe/refund-payment", {
      paymentId: order.paymentIntentId,
    });
    if (isSeller === true) {
      axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 4,
        completedAt: new Date(),
      });
    } else {
      axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 12,
        completedAt: new Date(),
      });
    }
    //axios post is always the same. post a message with the users input text
    axios.post("/api/chat/messages", {
      message: `I have canceled this item, because: ${text}`,
      messageOrder: "1.1",
      conversationId: convoId,
      otherUserId: otherUser,
    });
    axios
      .post("/api/chat/updateListingOnCancel", { order: order })
      .then(() => {
        //sependent on who cancelled, set order status appropriately.
        if (session.data?.user.id === order.sellerId) {
          //if seller cancels
          if (session.data?.user.role === "COOP") {
            //if seller is coop
            axios
              .post("/api/useractions/checkout/update-order", {
                orderId: order.id,
                status: 4,
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
                orderId: order.id,
                status: 12,
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
                  orderId: order.id,
                  status: 7,
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
                  orderId: order.id,
                  status: 15,
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
                orderId: order.id,
                status: 7,
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
