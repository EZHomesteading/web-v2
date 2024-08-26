"use client";
// message box, handles all styling, logic for messages, and logic for available actions for the entire automated message system.
//THIS COMPONENT IS ESSENTIALLY A TEXT BASED RPG
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FullMessageType } from "@/types";
import "react-datetime-picker/dist/DateTimePicker.css";
import axios from "axios";
import CustomTimeModal2 from "./dateStates";
import toast from "react-hot-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import ReviewButton from "@/app/components/ui/reviewButton";
import { Outfit, Zilla_Slab } from "next/font/google";
import { IoTrash } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import CancelModal from "./CancelModal";
import { Order, UserRole } from "@prisma/client";
import { UploadButton } from "@/utils/uploadthing";
import {
  PiCalendarBlankLight,
  PiCalendarCheckLight,
  PiCalendarPlusLight,
  PiCalendarXLight,
} from "react-icons/pi";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import DisputeModal from "./DisputeModal";
import { User } from "next-auth";
import { ValidTime } from "@/app/(pages)/listings/[listingId]/components/CustomTimeModal2";
import { ExtendedHours, UserInfo } from "@/next-auth";
import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover-msg";
import { MessageSquare, ChevronDown } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import MessageInput from "./MessageInput";
import { currentUser } from "@/lib/auth";
import Form from "./Form";
import Avatar from "@/app/components/Avatar";
import EscalateModal from "./EscalateModal";
import RefundModal from "./RefundModal";
import { BiMessageSquareEdit } from "react-icons/bi";

const zilla = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  convoId: string;
  otherUsersId: string | undefined;
  order: Order;
  otherUserRole: string | undefined;
  user: UserInfo;
  stripeAccountId?: string | null;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  user,
  convoId,
  otherUsersId,
  order,
  otherUserRole,
  stripeAccountId,
}) => {
  function createMapsLinks() {
    const address = [
      order?.location?.address[0],
      order?.location?.address[1],
      order?.location?.address[2],
      order?.location?.address[3],
    ];

    const encodedAddress = encodeURIComponent(address.join(", "));

    const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

    const appleMapsLink = `http://maps.apple.com/?daddr=${encodedAddress}`;

    return { googleMapsLink, appleMapsLink };
  }

  function isIOS(): boolean {
    if (typeof window === "undefined" || !window.navigator) {
      return false;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }

  const { googleMapsLink, appleMapsLink } = createMapsLinks();

  const link = isIOS() ? appleMapsLink : googleMapsLink;

  createMapsLinks();
  const [image, setImage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const [validTime, setValidTime] = useState<string>("(select your time)");
  const [dateTime, setDateTime] = useState<Date | string>("");
  const [cancel, setCancel] = useState(true);
  const [dispute, setDispute] = useState(true);
  const [escalate, setEscalate] = useState(false);
  const [refund, setRefund] = useState(false);
  const isOwn = user?.email === data?.sender?.email;
  const notOwn = user?.email !== data?.sender?.email;
  const pulseAnimation = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }
`;
  //dependent on message order allow or dont allow the cancel button to be visible
  useEffect(() => {
    if (
      (data.messageOrder === "4" && isLast) ||
      (data.messageOrder === "7" && isLast) ||
      (data.messageOrder === "15" && isLast) ||
      (data.messageOrder === "9" && isLast) ||
      (data.messageOrder === "18" && isLast) ||
      (data.messageOrder === "19" && isLast) ||
      (data.messageOrder === "17" && isLast) ||
      (data.messageOrder === "12" && isLast) ||
      (data.messageOrder === "6" && isLast) ||
      (data.messageOrder === "1.1" && isLast) ||
      (data.messageOrder === "1.6" && isLast)
    ) {
      setCancel(false);
    }
  }),
    [order];
  useEffect(() => {
    if (
      (data.messageOrder === "1" && isLast) ||
      (data.messageOrder === "2" && isLast) ||
      (data.messageOrder === "3" && isLast) ||
      (data.messageOrder === "4" && isLast) ||
      (data.messageOrder === "5" && isLast) ||
      (data.messageOrder === "7" && isLast) ||
      (data.messageOrder === "8" && isLast) ||
      (data.messageOrder === "9" && isLast) ||
      (data.messageOrder === "10" && isLast) ||
      (data.messageOrder === "1.1" && isLast) ||
      (data.messageOrder === "11" && isLast) ||
      (data.messageOrder === "12" && isLast) ||
      (data.messageOrder === "1.6" && isLast)
    ) {
      setDispute(false);
    }
  }),
    [order];
  useEffect(() => {
    if (data.messageOrder === "1.6" && isLast) {
      setEscalate(true);
      setRefund(true);
    }
  }),
    [order];
  //handle seen messages
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");
  if (!user?.id) {
    return null;
  }

  //declare clsx styling
  const container = clsx(
    "flex flex-grow items-start gap-2 py-2 px-4 testcontainer"
  );
  const body = clsx("flex flex-col");
  const message = clsx(
    `text-xs md:text-sm w-fit font-light ${outfit.className}`,
    data.image ? "rounded-md p-0" : " "
  );
  const notMessage = clsx(
    `text-xs md:text-sm w-fit ${outfit.className}`,
    isOwn ? ` ` : ``,
    data.image ? "rounded-md p-0" : " "
  );

  // all onsubmit options dependent on messages in chat.
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit1 = async () => {
    setIsLoading(true);
    try {
      //coop seller confirms order pickup time
      await axios.post("/api/chat/messages", {
        message: `Yes, That time works, Your order will be ready at that time. at ${order.location.address[0]}, ${order.location.address[1]}, ${order.location.address[2]}. ${order.location.address[3]}.`,
        messageOrder: "2",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      if (user.role === UserRole.COOP) {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 2,
        });
      } else {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 10,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2 = async () => {
    setIsLoading(true);
    try {
      // coop chooses new delivery/pickup time
      if (validTime === "(select your time)") {
        toast.error("You must select a time before choosing this option");
        return;
      }
      await axios.post("/api/chat/messages", {
        message: `No, that time does not work. Does ${validTime} work instead? If not, `,
        messageOrder: "3",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 3,
        pickupDate: dateTime,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit3 = async () => {
    setIsLoading(true);
    try {
      //coop or producer cancels order because the item is no longer available.
      await axios.post("/api/chat/messages", {
        message:
          "My apologies, but one or more of these items is no longer available, and this order has been canceled. Sorry for the inconvenience. Feel free to delete this chat whenever you have seen this message. If you do not delete this chat it will be automatically deleted after 72 hours",
        messageOrder: "1.1",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 4,
      });
      await axios.post("/api/updateListingOnCancel", { order: order });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit4 = async () => {
    setIsLoading(true);
    try {
      //buyer confirms new pickup time set by seller
      await axios.post("/api/chat/messages", {
        message:
          "Fantastic, I will be there to pick up the item at the specified time.",
        messageOrder: "5",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 5,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit5 = async (img: string) => {
    setIsLoading(true);
    try {
      //coop has set out the order
      await axios.post("/api/chat/messages", {
        message: img,
        messageOrder: "img",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/chat/messages", {
        message: `Your order is ready to be picked up at ${order.location.address[0]}, ${order.location.address[1]}, ${order.location.address[2]}. ${order.location.address[3]}!`,
        messageOrder: "6",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 8,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit6 = async () => {
    setIsLoading(true);
    try {
      //buyer picks up/ receives delivery of the order, stripe transfer initiated
      await axios.post("/api/chat/messages", {
        message: "I have Received my order. Thank you!",
        messageOrder: "7",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      if (user.role === UserRole.COOP && otherUserRole != UserRole.COOP) {
        //if buyer is coop buying from producer set status 17
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 17,
        });
      } else {
        //if buyer is not coop buying from producer set status to 9
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 9,
        });
      }
      const TotalPrice = order.totalPrice * 100;
      const stripeFee = Math.ceil(TotalPrice * 0.029 + 30);
      await axios.post("/api/stripe/transfer", {
        //finalise stripe transaction
        total: TotalPrice - stripeFee,
        stripeAccountId: stripeAccountId,
        orderId: order.id,
        status: order.status,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit7 = async () => {
    setIsLoading(true);
    try {
      //seller marks order as complete.
      await axios.post("/api/chat/messages", {
        message:
          "Fantastic, this order has been marked as completed, feel free to delete this chat. If you do not delete this chat it will be automatically deleted after 72 hours",
        messageOrder: "1.1",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 18,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit8 = async () => {
    setIsLoading(true);
    try {
      //early return if no time selected.
      if (validTime === "(select your time)") {
        toast.error("You must select a time before choosing this option");
        return;
      }
      //handle producer reschedule or consumer reschedule
      await axios.post("/api/chat/messages", {
        message: `No, that time does not work. Can it instead be at ${validTime}`,
        messageOrder: "4",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      if (user.role === UserRole.PRODUCER) {
        //pretty sure this is not needed, will keep just in case
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 11,
          pickupDate: dateTime,
        });
      } else {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 6,
          pickupDate: dateTime,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit9 = async () => {
    setIsLoading(true);
    try {
      //handle producer reschedule
      if (validTime === "(select your time)") {
        toast.error("You must select a time before choosing this option");
        return;
      }
      await axios.post("/api/chat/messages", {
        message: `I can deliver these items to you at ${validTime}, does that work?`,
        messageOrder: "11",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 11,
        pickupDate: dateTime,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit10 = async () => {
    setIsLoading(true);
    try {
      //handle producer accepts drop off time or producer accepts drop off time.
      await axios.post("/api/chat/messages", {
        message: "Yes, That time works, See you then!",
        messageOrder: "12",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      if (user.role === UserRole.COOP) {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 13,
        });
      } else {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 10,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit11 = async () => {
    setIsLoading(true);
    try {
      //early return if time is not selected
      if (validTime === "(select your time)") {
        toast.error("You must select a time before choosing this option");
        return;
      }
      //coop declares new drop off time for producer deliveries
      await axios.post("/api/chat/messages", {
        message: `No, that time does not work. Does ${validTime} work instead? If not, `,
        messageOrder: "13",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 14,
        pickupDate: dateTime,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit12 = async (img: string) => {
    setIsLoading(true);
    try {
      //producer delivers item and attaches an image.
      //early returns are handles in image upload function, cannot click submit without uploading an image.
      await axios.post("/api/chat/messages", {
        message: img,
        messageOrder: "img",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/chat/messages", {
        message: "Your item has been delivered.",
        messageOrder: "6",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 16,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit13 = async () => {
    setIsLoading(true);
    try {
      //early return if no time selected
      if (validTime === "(select your time)") {
        toast.error("You must select a time before choosing this option");
        return;
      }
      //producer or consumer declare new pickup/dropoff time
      //pretty sure this is only producer declaring new time, but put in consumer logic just in case things get mixed up.
      await axios.post("/api/chat/messages", {
        message: `No, that time does not work. Does ${validTime} work instead?`,
        messageOrder: "11",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      if (user.role === UserRole.PRODUCER) {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 11,
          pickupDate: dateTime,
        });
      } else {
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order.id,
          status: 6,
          pickupDate: dateTime,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit14 = async () => {
    setIsLoading(true);
    try {
      //producer confirms delivery time
      await axios.post("/api/chat/messages", {
        message:
          "Yes, That time works. Your item will be delivered at that time.",
        messageOrder: "14",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order.id,
        status: 10,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //receive data from child and set date time based on user inputs in modal
  const handleTime = (childTime: ValidTime) => {
    setDateTime(childTime.pickupTime);
    const date = formatTime(childTime.pickupTime);
    setValidTime(date);
  };

  //extra view hours component
  const hoursButton = () => {
    return (
      <span className="bg-slate-500 rounded-md px-1">
        <Sheet>
          <SheetTrigger>here are my hours.</SheetTrigger>
          <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
            <HoursDisplay
              coOpHours={order.location.hours as unknown as ExtendedHours}
            />
          </SheetContent>
        </Sheet>
      </span>
    );
  };
  const anyhours: ExtendedHours = {
    0: [{ open: 0, close: 1439 }],
    1: [{ open: 0, close: 1439 }],
    2: [{ open: 0, close: 1439 }],
    3: [{ open: 0, close: 1439 }],
    4: [{ open: 0, close: 1439 }],
    5: [{ open: 0, close: 1439 }],
    6: [{ open: 0, close: 1439 }],
  };
  //Seller receives Order
  const resp1 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit1();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm text-start p-2 flex items-center gap-x-1 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarCheckLight />
        {isLoading ? "Loading..." : "Agree to Time"}
      </button>
      {dateTime ? (
        <>
          <button
            type="submit"
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSubmit2();
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarBlankLight />
            {isLoading ? "Loading..." : "Send Reschedule Offer"}
          </button>
          <button
            onClick={() => setCustomTimeOpen(true)}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarPlusLight />
            {isLoading ? "Loading..." : "Set New Reschedule Time"}
          </button>
        </>
      ) : (
        <button
          onClick={() => setCustomTimeOpen(true)}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarPlusLight />
          {isLoading ? "Loading..." : "Reschedule Time"}
        </button>
      )}

      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit3();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarXLight />
        {isLoading ? "Loading..." : "Cancel Order"}
      </button>
    </div>
  );

  const resp2 = (
    <div className="flex flex-col text-xs md:text-sm max-w-[90%] gap-y-1 items-end  py-1">
      <div className="">
        <div className=" p-2 rounded-lg">
          {!image && (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { url: string }[]) => {
                setImage(res[0].url);
                setIsLoading(true);
                try {
                  onSubmit5(res[0].url);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsLoading(false);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              appearance={{
                container: "h-full w-max",
              }}
              className={`ut-allowed-content:hidden ut-button:bg-blue-800 ut-button: ut-button:w-fit ut-button:px-2 ut-button:p-3 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              content={{
                button({ ready }) {
                  if (ready) return <div>Send a photo of the produce</div>;
                  return isLoading ? "Loading..." : "Getting ready...";
                },
              }}
            />
          )}
          {image && (
            <>
              <div>
                <div className="m-5 relative">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Image
                        src={image}
                        height={180}
                        width={180}
                        alt="a"
                        className="aspect-square rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                        Click to Enlarge
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="xl:flex xl:justify-center">
                      <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                        {" "}
                        <div>
                          <Image
                            src={image}
                            fill
                            className="object-cover w-full"
                            alt="a"
                          />
                        </div>
                        <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                          Close
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const resp3 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit4();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1  ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarCheckLight />
        {isLoading ? "Loading..." : "Agree to Time"}
      </button>
      {dateTime ? (
        <button
          type="submit"
          onClick={async () => {
            setIsLoading(true);
            try {
              await onSubmit8();
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          }}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarBlankLight />
          {isLoading ? "Loading..." : "Send Reschedule Offer"}
        </button>
      ) : (
        <button
          onClick={() => setCustomTimeOpen(true)}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarPlusLight />
          {isLoading ? "Loading..." : "Reschedule Time"}
        </button>
      )}
      <button
        onClick={() => setCustomTimeOpen(true)}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarPlusLight />
        {isLoading ? "Loading..." : "Set New Reschedule Time"}
      </button>
    </div>
  );

  const resp4 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      {" "}
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit1();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarCheckLight />
        {isLoading ? "Loading..." : "Agree to Time"}
      </button>
      {dateTime ? (
        <button
          type="submit"
          onClick={async () => {
            setIsLoading(true);
            try {
              await onSubmit2();
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          }}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarBlankLight />
          {isLoading ? "Loading..." : "Send Reschedule Offer"}
        </button>
      ) : (
        <button
          onClick={() => setCustomTimeOpen(true)}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarPlusLight />
          {isLoading ? "Loading..." : "Reschedule Time"}
        </button>
      )}
      <button
        onClick={() => setCustomTimeOpen(true)}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarPlusLight />
        {isLoading ? "Loading..." : "Set New Reschedule Time"}
      </button>
    </div>
  );

  const resp5 = (
    <div className="flex flex-col text-xs md:text-sm max-w-[90%] gap-y-1 items-end  py-1">
      <div className="">
        <div className=" p-2 rounded-lg">
          {!image && (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { url: string }[]) => {
                setImage(res[0].url);
                setIsLoading(true);
                try {
                  onSubmit5(res[0].url);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsLoading(false);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              appearance={{
                container: "h-full w-max",
              }}
              className={`ut-allowed-content:hidden ut-button:bg-blue-800 ut-button: ut-button:w-fit ut-button:px-2 ut-button:p-3 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              content={{
                button({ ready }) {
                  if (ready) return <div>Send a photo of the produce</div>;
                  return isLoading ? "Loading..." : "Getting ready...";
                },
              }}
            />
          )}
          {image && (
            <>
              <div>
                <div className="m-5 relative">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Image
                        src={image}
                        height={180}
                        width={180}
                        alt="a"
                        className="aspect-square rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                        Click to Enlarge
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="xl:flex xl:justify-center">
                      <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                        {" "}
                        <div>
                          <Image
                            src={image}
                            fill
                            className="object-cover w-full"
                            alt="a"
                          />
                        </div>
                        <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                          Close
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  // buyer receives their item or can choose to dispute
  const resp6 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      {" "}
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit6();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarCheckLight />
        {isLoading ? "Loading..." : "Confirm Order"}
      </button>
      <button
        onClick={() => setDisputeOpen(true)}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarPlusLight />
        {isLoading ? "Loading..." : "Dispute Transaction"}
      </button>
    </div>
  );
  const resp7 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      {" "}
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit7();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <PiCalendarCheckLight />
        {isLoading ? "Loading..." : "Thank Buyer"}
      </button>
    </div>
  );
  const resp8 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      {" "}
      {dateTime ? (
        <>
          <button
            type="submit"
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSubmit9();
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarBlankLight />
            {isLoading ? "Loading..." : "Send Delivery Time Offer"}
          </button>
          <button
            onClick={() => setCustomTimeOpen(true)}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarPlusLight />
            {isLoading ? "Loading..." : "Set Different Time"}
          </button>
        </>
      ) : (
        <button
          onClick={() => setCustomTimeOpen(true)}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarPlusLight />
          {isLoading ? "Loading..." : "Set Delivery Time"}
        </button>
      )}
    </div>
  );
  const resp9 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      {" "}
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit10();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`m hover:bg-sky-500 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Accept Delivery Time"}
      </button>
      {dateTime ? (
        <>
          <button
            type="submit"
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSubmit11();
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p -2 flex items-center gap-x-1 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarBlankLight />
            {isLoading ? "Loading..." : "Send Delivery Time Offer"}
          </button>
          <button
            onClick={() => setCustomTimeOpen(true)}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarPlusLight />
            {isLoading ? "Loading..." : "Set Different Time"}
          </button>
        </>
      ) : (
        <button
          onClick={() => setCustomTimeOpen(true)}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarPlusLight />
          {isLoading ? "Loading..." : "Set Delivery Time"}
        </button>
      )}
    </div>
  );
  const resp10 = (
    <div className="flex flex-col text-xs md:text-sm max-w-[90%] gap-y-1 items-end  py-1">
      <div className="">
        <div className=" p-2 rounded-lg">
          {!image && (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { url: string }[]) => {
                setImage(res[0].url);
                setIsLoading(true);
                try {
                  onSubmit12(res[0].url);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsLoading(false);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              appearance={{
                container: "h-full w-max",
              }}
              className={`ut-allowed-content:hidden ut-button:bg-blue-800 ut-button: ut-button:w-fit ut-button:px-2 ut-button:p-3 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              content={{
                button({ ready }) {
                  if (ready)
                    return <div>Send a photo of the delivered produce</div>;
                  return isLoading ? "Loading..." : "Getting ready...";
                },
              }}
            />
          )}
          {image && (
            <>
              <div>
                <div className="m-5 relative">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Image
                        src={image}
                        height={180}
                        width={180}
                        alt="a"
                        className="aspect-square rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                        Click to Enlarge
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="xl:flex xl:justify-center">
                      <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                        {" "}
                        <div>
                          <Image
                            src={image}
                            fill
                            className="object-cover w-full"
                            alt="a"
                          />
                        </div>
                        <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                          Close
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  const resp11 = (
    <div className="flex flex-col items-start t md:text-xl gap-0 ! py-1">
      <button
        type="submit"
        onClick={async () => {
          setIsLoading(true);
          try {
            await onSubmit14();
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`m hover:bg-sky-600 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Accept Delivery Time"}
      </button>
      {dateTime ? (
        <>
          <button
            type="submit"
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSubmit9();
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarBlankLight />
            {isLoading ? "Loading..." : "Send Delivery Time Offer"}
          </button>
          <button
            onClick={() => setCustomTimeOpen(true)}
            className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            <PiCalendarPlusLight />
            {isLoading ? "Loading..." : "Set Different Time"}
          </button>
        </>
      ) : (
        <button
          onClick={() => setCustomTimeOpen(true)}
          className={`w-[100%] bg-transparent shadow-none  font-extralight border-black rounded-none hover:shadow-sm  text-start p-2 flex items-center gap-x-1 focus:outline-none ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          <PiCalendarPlusLight />
          {isLoading ? "Loading..." : "Set Delivery Time"}
        </button>
      )}
    </div>
  );
  const resp12 = (
    <div className="flex flex-col text-xs md:text-sm max-w-[90%] gap-y-1 items-end  py-1">
      <div className="flex flex-col text-sm w-fit overflow-hidden message   py-2 px-3">
        <div className="">
          <div className=" p-2 rounded-lg">
            {!image && (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  setImage(res[0].url);
                  setIsLoading(true);
                  try {
                    onSubmit12(res[0].url);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "h-full w-max",
                }}
                className={`ut-allowed-content:hidden ut-button:bg-blue-800 ut-button: ut-button:w-fit ut-button:px-2 ut-button:p-3 ${
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
                content={{
                  button({ ready }) {
                    if (ready)
                      return <div>Sent a photo of the delivered produce</div>;
                    return isLoading ? "Loading..." : "Getting ready...";
                  },
                }}
              />
            )}
            {image && (
              <>
                <div>
                  <div className="m-5 relative">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Image
                          src={image}
                          height={180}
                          width={180}
                          alt="a"
                          className="aspect-square rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
                          Click to Enlarge
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="xl:flex xl:justify-center">
                        <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                          {" "}
                          <div>
                            <Image
                              src={image}
                              fill
                              className="object-cover w-full"
                              alt="a"
                            />
                          </div>
                          <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                            Close
                          </AlertDialogCancel>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      {user.id === order.sellerId ? (
        <CustomTimeModal2
          isOpen={customTimeOpen}
          onClose={() => setCustomTimeOpen(false)}
          hours={anyhours}
          onSetTime={handleTime}
          isSeller={true}
        />
      ) : (
        <CustomTimeModal2
          isOpen={customTimeOpen}
          onClose={() => setCustomTimeOpen(false)}
          hours={order.location.hours as unknown as ExtendedHours}
          onSetTime={handleTime}
          isSeller={false}
        />
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <DisputeModal
        isOpen={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        user={user}
        orderId={order.id}
        conversationId={convoId}
        otherUserId={otherUsersId}
      />
      <EscalateModal
        isOpen={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        orderId={order.id}
      />
      <RefundModal
        isOpen={refundOpen}
        onClose={() => setRefundOpen(false)}
        orderId={order.id}
        orderAmount={order.totalPrice}
        conversationId={convoId}
        otherUserId={otherUsersId}
        paymentId={order.paymentIntentId}
      />
      {user.id === order.sellerId ? (
        <CancelModal
          isOpen={cancelOpen}
          onClose={() => setCancelOpen(false)}
          order={order}
          otherUser={otherUsersId}
          convoId={convoId}
          otherUserRole={otherUserRole}
          isSeller={true}
        />
      ) : (
        <CancelModal
          isOpen={cancelOpen}
          onClose={() => setCancelOpen(false)}
          order={order}
          otherUser={otherUsersId}
          convoId={convoId}
          otherUserRole={otherUserRole}
          isSeller={false}
        />
      )}
      {/* allow cancel button to appear */}
      <div className="flex flex-row">
        {cancel === true && isLast ? (
          <button
            type="submit"
            onClick={() => setCancelOpen(true)}
            className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 mt-2ml-1mr-1absolute top-[100px] right-2"
          >
            Cancel
          </button>
        ) : null}
        {dispute === true && isLast ? (
          <button
            type="submit"
            onClick={() => setDisputeOpen(true)}
            className="
 rounded-full 
 p-2 
 bg-sky-500 
 cursor-pointer 
 hover:bg-sky-600 
 mt-2
 ml-1
 mr-1
 absolute top-[100px] right-2
"
          >
            Dispute Order
          </button>
        ) : null}
        {escalate === true && isLast ? (
          <button
            type="submit"
            onClick={() => setEscalateOpen(true)}
            className="
 rounded-full 
 p-2 
 bg-sky-500 
 cursor-pointer 
 hover:bg-sky-600 
 mt-2
 ml-1
 mr-1
 absolute top-[100px] right-2
"
          >
            Get an Admin Involved
          </button>
        ) : null}
        {refund === true && isLast && user.id === order.sellerId ? (
          <button
            type="submit"
            onClick={() => setRefundOpen(true)}
            className="
 rounded-full 
 p-2 
 bg-sky-500 
 cursor-pointer 
 hover:bg-sky-600 
 mt-2
 ml-1
 mr-1
 absolute top-[100px] right-[200px]
"
          >
            Refund Buyer
          </button>
        ) : null}
        {/* messages body starts here */}
      </div>
      <div className={container}>
        <div className="pt-2">
          <Avatar image={data.sender.image} />
        </div>

        <div className={body}>
          <div
            className={`flex justify-start items-start gap-x-2 ${outfit.className} `}
          >
            <div className="flex items-center gap-x-2">
              {data.sender.name}
              <div className="text-[8px] text-neutral-400 font-extralight">
                {format(new Date(data.createdAt), "p")}
              </div>
            </div>
          </div>
          {/* handle displaying images V.S. regular messages */}
          {data.messageOrder === "img" ? (
            <>
              <div className={notMessage}>
                <div className="m-5 relative">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Image
                        src={data.body || ""}
                        height={180}
                        width={180}
                        alt="a"
                        className="aspect-square rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 rounded-lg hover:cursor-pointer">
                        Click to Enlarge
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="xl:flex xl:justify-center">
                      <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative">
                        {" "}
                        <div>
                          <Image
                            src={data.body || ""}
                            fill
                            className="object-cover w-full"
                            alt="a"
                          />
                        </div>
                        <AlertDialogCancel className="absolute top-3 right-3 bg-transpart border-none bg px-2 m-0">
                          Close
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          ) : (
            <div>
              {/* display hours button dependent on message */}
              {data.messageOrder === "10" ||
              data.messageOrder === "13" ||
              data.messageOrder === "3" ? (
                <div className={message}>
                  {data.body}
                  <span>{hoursButton()}</span>
                </div>
              ) : (
                <div className={message}>{data.body}</div>
              )}
            </div>
          )}
          {/* if order is complete and is your message, display review button with buyer id passed  */}
          {data.messageOrder === "1.1" && isOwn ? (
            <div className="flex flex-row absolute top-[100px] right-2">
              <ReviewButton
                reviewedId={otherUsersId}
                reviewerId={user?.id}
                buyer={user.id === order.sellerId ? false : true}
              />{" "}
              <div>
                <div
                  onClick={() => setConfirmOpen(true)}
                  className="  gap-3 items-center cursor-pointer hover:opacity-75 "
                >
                  <div className="w-10 h-10 ml-2 bg-neutral-100 rounded-full text-black flex items-center justify-center">
                    <IoTrash size={20} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* if order is complete and is NOT your message, display review button with seller id passed  */}
          {data.messageOrder === "1.1" && notOwn ? (
            <div className="flex flex-row absolute top-[100px] right-2 ">
              <ReviewButton
                reviewerId={user?.id}
                reviewedId={otherUsersId}
                buyer={user.id === order.sellerId ? false : true}
              />
              <div>
                <div
                  onClick={() => setConfirmOpen(true)}
                  className=" gap-3 items-center cursor-pointer hover:opacity-75"
                >
                  <div className="w-10 h-10 ml-2 bg-neutral-100 rounded-full text-black flex items-center justify-center">
                    <IoTrash size={20} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* display seen messages */}
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">
              {`Seen by ${seenList}`}
            </div>
          )}
        </div>
      </div>
      {/* MESSAGE OPTIONS START HERE */}
      {/* MESSAGE OPTIONS START HERE */}
      {/* MESSAGE OPTIONS START HERE */}
      {/* MESSAGE OPTIONS START HERE */}
      {/* COOP receives order responce options */}
      {isLast && data.messageOrder === "1.6" ? (
        <Form otherUsersId={otherUsersId} />
      ) : (
        isLast && (
          <Popover>
            <style>{pulseAnimation}</style>
            <PopoverTrigger asChild>
              <Button
                variant={notOwn ? "default" : "secondary"}
                className={`fixed bottom-5 right-5 flex items-center gap-2 transition-all duration-300
            ${notOwn ? "animate-bounce shadow-lg" : ""}
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
                style={notOwn ? { animation: "pulse 2s infinite" } : {}}
              >
                {notOwn ? (
                  <>
                    <BiMessageSquareEdit className="w-6 h-6" />
                    <span className="text-lg">Choose Response</span>
                  </>
                ) : (
                  <span>No Options</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`${outfit.className} rounded-t-md w-[300px] p-0`}
            >
              <div>
                <h3
                  className={`${zilla.className} text-md lg:text-md font-semibold p-4`}
                >
                  Your Response Options
                </h3>
                <div className="flex flex-col p-4 pt-0">
                  {notOwn && data.messageOrder === "1" ? (
                    resp1
                  ) : isOwn && data.messageOrder === "2" ? (
                    resp2
                  ) : notOwn && data.messageOrder === "3" ? (
                    resp3
                  ) : notOwn && data.messageOrder === "4" ? (
                    resp4
                  ) : notOwn && data.messageOrder === "5" ? (
                    resp5
                  ) : notOwn && data.messageOrder === "6" ? (
                    resp6
                  ) : notOwn && data.messageOrder === "7" ? (
                    resp7
                  ) : notOwn && data.messageOrder === "10" ? (
                    resp8
                  ) : notOwn && data.messageOrder === "11" ? (
                    resp9
                  ) : notOwn && data.messageOrder === "12" ? (
                    resp10
                  ) : notOwn && data.messageOrder === "13" ? (
                    resp11
                  ) : isOwn && data.messageOrder === "14" ? (
                    resp12
                  ) : (
                    <div className="px-2 text-slate-500 font-light text-md">
                      No response options available
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )
      )}
    </div>
  );
};

export default MessageBox;
//day suffix getter function
const getOrdinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// formats time from date type to date string readable by our other formatters.
const formatTime = (timeString: Date) => {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const ordinalSuffix = getOrdinalSuffix(day);

  return `${formattedHours}:${formattedMinutes}${ampm} on ${month} ${day}${ordinalSuffix}`;
};
