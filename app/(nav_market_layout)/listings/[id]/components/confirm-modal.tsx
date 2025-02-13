"use client";
//modal to confirm that user wants to delete that chat, should only be able to delete if messages are at a finalised state such as completed or cancelled.
import React, { useCallback, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/chatmodals/Modal";
import Button from "@/components/modals/chatmodals/Button";
import useConversation from "@/hooks/messenger/useConversation";
import Toast from "@/components/ui/toast";
import { OutfitFont } from "@/components/fonts";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  listingId: string;
  reports: number | null;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  listingId,
  reports,
}) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/listing/updateListing", {
        id: listingId,
        reports: reports ? reports + 1 : 1,
      })
      .then(() => {
        onClose();
        Toast({ message: "Report sent, thankyou for the input." });
      })
      .catch(() => Toast({ message: "Something went wrong!" }))

      .finally(() => setIsLoading(false));
  }, [router, conversationId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showX>
      <div className={`${OutfitFont.className}`}>
        <div className={`flex items-center gap-x-2`}>
          <div className={`p-3 bg-red-100 rounded-full`}>
            <FiAlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>{" "}
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Report Listing
          </Dialog.Title>
        </div>
        <p className={`text-sm my-3 text-gray-500`}>
          Are you sure you want to report this listing? It may negatively impact
          the seller. All listings that are reported will be reviewed by EZH
          staff.
        </p>
        <div className={`flex items-center justify-between`}>
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} danger onClick={onDelete}>
            Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
