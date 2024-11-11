"use client";

import { Dialog } from "@headlessui/react";
import Modal from "@/components/modals/chatmodals/Modal";
import Button from "@/components/modals/chatmodals/Button";
import { CommonInputProps } from "@/types/create.types";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "@/app/(no-nav_layout)/create/components/listing-input";
import { OrderStatus } from "@prisma/client";
import axios from "axios";

interface ConfirmModalProps {
  open: boolean;
  modalMessage: string;
  SetFee: boolean;
  newStatus: OrderStatus;
  convoId: string;
  otherUsersId: string | undefined;
  orderId: string | undefined;
  onConfirm: (status: OrderStatus, skip?: boolean) => void;
  onCancel: () => void;
}

const ChatConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  SetFee,
  modalMessage,
  newStatus,
  convoId,
  otherUsersId,
  orderId,
  onConfirm,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      fee: 0.0,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const commonInputProps: CommonInputProps = {
    register,
    errors,
    watch,
    setValue,
    disabled: isLoading,
  };

  const fee = watch("fee");

  const handleConfirm = async () => {
    //setIsLoading(true);
    try {
      // Create the complete message here
      if (fee > 0) {
        const numericFee = parseFloat(Number(fee).toFixed(2));
        const completeMessage = SetFee
          ? `${modalMessage} ${fee ? `$${Number(fee).toFixed(2)}` : "$0.00"}`
          : modalMessage;
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: orderId,
          status: newStatus,
          deliveryFee: numericFee,
        });
        await axios.post("/api/chat/messages", {
          message: completeMessage,
          messageOrder: newStatus,
          conversationId: convoId,
          otherUserId: otherUsersId,
          fee: numericFee,
        });
        const skip = true;
        onConfirm(newStatus, skip);
        return;
      }

      //console.log("COMPLETEMESSAGE", completeMessage, newStatus);
      // Pass the complete message directly to onConfirm without setting state
      onConfirm(newStatus);
    } catch (error) {
      console.error("Error in confirmation:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onCancel}>
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Confirm action
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              This will send this message: {modalMessage}
              {SetFee && ` ${fee ? `$${Number(fee).toFixed(2)}` : "$0.00"}`}
            </p>
          </div>
        </div>
      </div>

      {SetFee && (
        <div className="mt-4">
          <Input
            {...commonInputProps}
            id="fee"
            label="Delivery Fee"
            type="number"
            step="0.01"
            formatPrice
            maxlength={4}
            inputmode="decimal"
          />
        </div>
      )}

      <div className="mt-5 flex justify-between w-full">
        <Button danger onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

        <Button secondary onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Confirming..." : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
};
export default ChatConfirmModal;
