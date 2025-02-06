import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  BiAddToQueue,
  BiArea,
  BiChart,
  BiCheckCircle,
  BiClinic,
} from "react-icons/bi";
import Modal from "@/components/modals/chatmodals/HarvestModal";
import Button from "@/components/modals/chatmodals/Button";
import axios from "axios";
import { Listing } from "@prisma/client";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  messageId: string;
  listing: Listing | null;
  conversationId: string;
  messagesLength: number;
}

const HarvestModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  messageId,
  listing,
  conversationId,
  messagesLength,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const buttons = [
    "Additive Monthly Stock",
    "Additive Daily Stock",
    "Monthly Stock Maximum",
    "Daily Stock Maximum",
    "Set as Active Listing",
    "Cancel Harvest",
  ];
  const explanation: string[] = [
    "Monthly: Incrementally add expected quantity to total stock",
    "Daily: Incrementally add expected quantity to total stock",
    "Monthly: Set total stock to expected quantity, overriding current value",
    "Daily: Set total stock to expected quantity, overriding current value",
    "Update stock to current expected quantity and disable future harvest projections",
    "Remove projected harvest for this month from the listing",
  ];
  //console.log(messageId);
  const harvestSet = async (harvestType: string) => {
    setIsLoading(true);
    try {
      await axios.post("/api/listing/updateListing", {
        id: listing?.id,
        harvestType: harvestType,
        stock: listing?.projectedStock,
      });

      Toast({ message: "Your listing was updated." });

      if (messagesLength === 1) {
        await axios.delete(`/api/chat/conversations/${conversationId}`);
      } else {
        await axios.delete(`/api/chat/messages/${messageId}`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      Toast({ message: error.response?.data?.message || "An error occurred" });
    } finally {
      if (messagesLength === 1) {
        setIsLoading(false);
        onClose();
        router.push("/chat");
        router.refresh();
      } else {
        setIsLoading(false);
        onClose();
        router.refresh();
      }
    }
  };

  const activate = async () => {
    try {
      axios.post("/api/listing/updateListing", {
        id: listing?.id,
        harvestDates: [],
        harvestFeatures: false,
        harvestType: null,
        projectedStock: null,
        stock: listing?.projectedStock,
      });

      Toast({ message: "Your listing was updated." });

      if (messagesLength === 1) {
        await axios.delete(`/api/chat/conversations/${conversationId}`);
      } else {
        await axios.delete(`/api/chat/messages/${messageId}`);
      }
    } catch (error: any) {
      Toast({ message: error });
    } finally {
      if (messagesLength === 1) {
        setIsLoading(false);
        onClose();
        router.push("/chat");
        router.refresh();
      } else {
        setIsLoading(false);
        onClose();
        router.refresh();
      }
    }
  };
  const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function removeCurrentMonth(harvestDates: string[]): string[] {
    const currentDate = new Date();
    const currentMonthAbbr = monthAbbreviations[currentDate.getMonth()];

    return harvestDates.filter((month) => month !== currentMonthAbbr);
  }

  const cancelHarvest = async () => {
    let newMonths: string[] = [];
    if (listing?.harvestDates) {
      newMonths = removeCurrentMonth(listing?.harvestDates);
    }
    //console.log(newMonths);
    setIsLoading(true);
    try {
      axios.post("/api/listing/updateListing", {
        id: listing?.id,
        harvestType: null,
        harvestDates: newMonths,
        stock: 0,
      });

      Toast({ message: "Your listing was updated." });

      if (messagesLength === 1) {
        await axios.delete(`/api/chat/conversations/${conversationId}`);
      } else {
        await axios.delete(`/api/chat/messages/${messageId}`);
      }
    } catch (error: any) {
      Toast({ message: error });
    } finally {
      if (messagesLength === 1) {
        setIsLoading(false);
        onClose();
        router.push("/chat");
        router.refresh();
      } else {
        setIsLoading(false);
        onClose();
        router.refresh();
      }
    }
  };

  const icons = [
    <BiClinic key={0} size={36} />,
    <BiAddToQueue key={1} size={36} />,
    <BiArea key={2} size={36} />,
    <BiChart key={3} size={36} />,
    <BiCheckCircle key={4} size={36} />,
    <FiAlertTriangle key={5} size={36} className="text-red-600" />,
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-4xl mx-auto p-4">
        <Dialog.Title
          as="h3"
          className="text-lg font-semibold leading-6 text-gray-900 mb-4 text-center"
        >
          Choose what to do with your Projected Listing.
        </Dialog.Title>
        <p className="text-sm text-gray-500 text-center">
          Stock will only be added to products during designated harvest months.
        </p>
        <p className="text-sm text-gray-500 mb-6 text-center">
          You can change this in settings after you make a selection.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {buttons.map((text, index) => (
            <button
              disabled={isLoading}
              onClick={() => {
                if (index === 0) {
                  harvestSet("addMonthly");
                }
                if (index === 1) {
                  harvestSet("addDaily");
                }
                if (index === 2) {
                  harvestSet("setMonthly");
                }
                if (index === 3) {
                  harvestSet("setDaily");
                }
                if (index === 4) {
                  activate();
                }
                if (index === 5) {
                  cancelHarvest();
                }
              }}
              key={index}
              className={`bg-transparent border text-start border-black px-4 py-2 rounded bg-white hover:bg-slate-300 transition duration-300 shadow-md shadow-slate-700 w-full max-w-[300px] h-[150px] flex flex-col justify-between ${
                isLoading
                  ? "opacity-50 cursor-not-allowed text-gray-500"
                  : "text-black hover:text-black"
              }`}
            >
              <div className="flex-col items-center justify-between">
                {icons[index]}
                <h2 className="text-lg font-semibold">{text}</h2>

                <p className="text-sm mt-2">{explanation[index]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 sm:mt-4 flex justify-center">
        <Button secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default HarvestModal;
