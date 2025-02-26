"use client";
// message box, handles all styling, logic for messages, and logic for available actions for the entire automated message system.
//THIS COMPONENT IS ESSENTIALLY A TEXT BASED RPG
import clsx from "clsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import "react-datetime-picker/dist/DateTimePicker.css";
import axios from "axios";
//import toast from "react-hot-toast";
import CancelModal from "./CancelModal";
import { Listing, OrderStatus, UserRole } from "@prisma/client";
import { UploadButton } from "@/utils/uploadthing";
import {
  PiCalendarBlankLight,
  PiCalendarCheckLight,
  PiCalendarPlusLight,
  PiCalendarXLight,
  PiNewspaperClippingThin,
} from "react-icons/pi";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DisputeModal from "./DisputeModal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-msg";
import Form from "./Form";
import Avatar from "@/components/Avatar";
import { BiMessageSquareEdit } from "react-icons/bi";
import ChatConfirmModal from "./ChatConfirm";

import HarvestModal from "./HarvestModal";
import {
  ChatListing,
  ChatMessage,
  ChatOrder,
  ChatUser,
  Hours,
  MessageOption,
} from "chat-types";
import { OutfitFont, ZillaFont } from "@/components/fonts";

import { getMessageOptions } from "./messageOptions";
import { MessageActions } from "./message-actions";
import { ImageUpload } from "./imageUpload";
import { useRouter } from "next/navigation";
//import DateTimePicker from "./customtimemodal";

interface MessageBoxProps {
  listings: ChatListing[];
  data: ChatMessage;
  listing: Listing | null;
  isLast?: boolean;
  convoId: string;
  otherUsersId: string | undefined;
  order: ChatOrder | null;
  otherUserRole: string | undefined;
  user: ChatUser;
  stripeAccountId?: string | null;
  messagesLength: number;
  orderGroupId: string | null;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  listings,
  user,
  convoId,
  listing,
  otherUsersId,
  messagesLength,
  order,
  otherUserRole,
  stripeAccountId,
  orderGroupId,
}) => {
  //const [validTime, setValidTime] = useState<string>("(select your time)");
  const router = useRouter();
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  //const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const [HarvestOpen, setHarvestOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [newStatus, setStatus] = useState<OrderStatus>("PENDING");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [isLoading, setIsLoading] = useState(false);
  const isOwn = user?.email === data?.sender?.email;
  const notOwn = user?.email !== data?.sender?.email;
  console.log(notOwn, isOwn);
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

  if (!user?.id) {
    return null;
  }
  //declare clsx styling
  const container = clsx("flex flex-grow  items-start mt-4 gap-2 py-2 px-4");
  const body = clsx("flex  flex-col");
  const message = clsx(
    `text-xs md:text-sm w-fit font-light ${OutfitFont.className}`,
    data.image ? "rounded-md p-0" : " "
  );
  const notMessage = clsx(
    `text-xs md:text-sm w-fit ${OutfitFont.className}`,
    isOwn ? ` ` : ``,
    data.image ? "rounded-md p-0" : " "
  );
  let onCancel = () => {
    setIsModalOpen(false);
    setIsLoading(false);
  };

  let onConfirm = async (status: OrderStatus, skip?: boolean) => {
    if (skip) {
      setIsModalOpen(false);
      return;
    } else {
      setIsLoading(true);
      try {
        await trySubmit(status);
      } catch (error) {
        console.error(error);
      } finally {
        setIsModalOpen(false);
        setIsLoading(false);
      }
    }
  };

  const handleConfirm = (status: OrderStatus): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const message = await getMessageByStatus(status);
      setModalMessage(message); // Set initial message
      setStatus(status);
      setIsModalOpen(true);

      onCancel = () => {
        setIsModalOpen(false);
        resolve(false);
        setIsLoading(false);
      };
    });
  };
  const getMessageByStatus = async (status: OrderStatus) => {
    let message = "";
    if (status === "SELLER_ACCEPTED" && order?.fulfillmentType === "PICKUP") {
      message = `Yes, That time works, Your order will be ready at that time. at ${order?.location?.address[0]}, ${order?.location?.address[1]}, ${order?.location?.address[2]}. ${order?.location?.address[3]}.`;
      // } else if (
      //   (order?.fulfillmentType === "PICKUP" &&
      //     status === "SELLER_RESCHEDULED") ||
      //   status === "BUYER_RESCHEDULED"
      // ) {
      //   message = `No, that time does not work. Does ${validTime} work instead?`;
      // }
    } else if (status === "BUYER_ACCEPTED") {
      message =
        "That works, I will be there to pick up the item at the specified time.";
    } else if (status === "PICKED_UP") {
      message = "I have Received my order. Thank you!";
    } else if (status === "COMPLETED") {
      message =
        "Fantastic, this order has been marked as completed, feel free to delete this chat. If you do not delete this chat it will be automatically deleted after 72 hours";
      // }
      //  else if (
      //   order?.fulfillmentType === "DELIVERY" &&
      //   status === "SELLER_RESCHEDULED"
      // ) {
      //   message = `I can deliver these items to you at ${validTime}, does that work?`;
    } else if (
      status === "SELLER_ACCEPTED" &&
      order?.fulfillmentType === "DELIVERY"
    ) {
      message =
        "Yes, That time works. Your item will be delivered at that time.";
    } else if (status === "IN_TRANSIT") {
      message = "Your order is on the way!";
    } else if (status === "SELLER_PREPARING") {
      message = "We are Preparing your Order!";
    }
    return message;
  };
  // all onsubmit options dependent on messages in chat.
  const trySubmit = async (status: OrderStatus) => {
    const message = await getMessageByStatus(status);
    if (status === "COMPLETED") {
      try {
        // First API call
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order?.id,
          status: status,
          completedAt: new Date(),
        });

        // Second API call (stripe payout)
        await axios.post("/api/stripe/transfer", {
          total: order?.totalPrice,
          paymentId: order?.paymentIntentId,
          orderId: order?.id,
        });

        await axios.post("/api/chat/messages", {
          message: message,
          messageOrder: status,
          conversationId: convoId,
          otherUserId: otherUsersId,
        });
      } catch (error) {
        console.error("Error processing order:", error);

        // You can check for specific error conditions
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // Unauthorized
            router.push("/login");
            return;
          } else if (error.response?.status === 400) {
            // Bad request
            router.push("/selling/my-store");
            return;
          } else {
            // General error
            router.push("/selling/my-store");
            return;
          }
        } else {
          // Non-axios error
          router.push("/selling/my-store");
          return;
        }
      }
      //coop seller confirms order pickup time
    } else {
      await axios.post("/api/useractions/checkout/update-order", {
        orderId: order?.id,
        status: status,
      });
      await axios.post("/api/chat/messages", {
        message: message,
        messageOrder: status,
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
    }
  };
  const onSubmit = async (status: OrderStatus) => {
    const confirmed = await handleConfirm(status);
    if (confirmed) {
    }
  };

  const isSeller = user.id === order?.sellerId;
  const messageOptions = order
    ? getMessageOptions(
        data.messageOrder as OrderStatus,
        order.fulfillmentType,
        user.role,
        isSeller,
        // setCustomTimeOpen,
        setCancelOpen,
        setDisputeOpen

        //message?.dateTime, // Add the dateTime from message
      )
    : [];
  const handleImageUpload = async (imageUrl: string) => {
    setIsLoading(true);
    try {
      await axios.post("/api/chat/messages", {
        message: imageUrl,
        messageOrder: "IMG",
        conversationId: convoId,
        otherUserId: otherUsersId,
      });
      if (imageUploadType === "delivery") {
        //producer delivers item and attaches an image.
        //early returns are handles in image upload function, cannot click submit without uploading an image.
        await axios.post("/api/chat/messages", {
          message: "Your item has been delivered.",
          messageOrder: "DELIVERED",
          conversationId: convoId,
          otherUserId: otherUsersId,
        });
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order?.id,
          status: "DELIVERED",
        });
      } else {
        await axios.post("/api/chat/messages", {
          message: `Your order is ready to be picked up at ${order?.location?.address[0]}, ${order?.location?.address[1]}, ${order?.location?.address[2]}. ${order?.location?.address[3]}!`,
          messageOrder: "READY_FOR_PICKUP",
          conversationId: convoId,
          otherUserId: otherUsersId,
        });
        await axios.post("/api/useractions/checkout/update-order", {
          orderId: order?.id,
          status: "READY_FOR_PICKUP",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowImageUpload(false);
    }
  };
  const handleMessageAction = useCallback(
    async (option: MessageOption) => {
      if (option.onClick) {
        option.onClick();
        return;
      }

      if (option.requiresPhoto) {
        setImageUploadType(
          order?.fulfillmentType === "DELIVERY" ? "delivery" : "pickup"
        );
        setShowImageUpload(true);
        return;
      }

      setIsLoading(true);
      try {
        await onSubmit(option.status);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [order]
  );
  const [isProcessingTime, setIsProcessingTime] = useState(false);

  // useEffect(() => {
  //   // Only proceed with submission if we're processing a time selection
  //   if (isProcessingTime && validTime !== "(select your time)") {
  //     const submitOrder = async () => {
  //       if (user.id === order?.sellerId) {
  //         await onSubmit("SELLER_RESCHEDULED");
  //       } else {
  //         await onSubmit("BUYER_RESCHEDULED");
  //       }
  //       setIsProcessingTime(false);
  //     };
  //     submitOrder();
  //   }
  // }, [validTime, isProcessingTime]);
  // console.log(order?.location);
  // const handleSelect = async (date: string, time: string) => {
  //   setIsProcessingTime(true);
  //   const dateObj = new Date(`${date}T${time}`);
  //   const formattedTime = formatTime(dateObj);

  //   setSelectedDate(date);
  //   setSelectedTime(time);
  //   setValidTime(formattedTime);
  // };
  return (
    <div>
      {/* <DateTimePicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelect={handleSelect}
        isOpen={customTimeOpen}
        onClose={() => setCustomTimeOpen(false)}
        hours={order?.location?.hours ?? null}
        type={order?.fulfillmentType?.toLowerCase() as "pickup" | "delivery"}
      /> */}
      <CancelModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        order={order}
        otherUser={otherUsersId}
        convoId={order?.conversationId}
        otherUserRole={otherUserRole}
        isSeller={true}
        orderGroupId={orderGroupId}
      />
      <DisputeModal
        isOpen={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        user={user}
        orderId={order?.id}
        conversationId={convoId}
        otherUserId={otherUsersId}
      />
      <ChatConfirmModal
        open={isModalOpen}
        modalMessage={modalMessage}
        orderId={order?.id}
        newStatus={newStatus}
        convoId={convoId}
        otherUsersId={otherUsersId}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <HarvestModal
        isOpen={HarvestOpen}
        onClose={() => setHarvestOpen(false)}
        messageId={data.id}
        listing={listing}
        conversationId={convoId}
        messagesLength={messagesLength}
      />
      {/* messages body starts here */}
      <div className={container}>
        <div className="pt-2">
          <Avatar image={data.sender.image} />
        </div>

        <div className={body}>
          <div
            className={`flex justify-start items-start gap-x-2 ${OutfitFont.className} `}
          >
            <div className="flex items-center gap-x-2">
              {data.sender.name}
              <div className="text-[8px] text-neutral-400 font-extralight">
                {format(new Date(data.createdAt), "p")}
              </div>
            </div>
          </div>
          {/* handle displaying images V.S. regular messages */}
          {data.messageOrder === "IMG" ? (
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
                    <AlertDialogContent className="xl:flex xl:justify-center z-[50]">
                      <div className="lg:w-1/2 h-[60vh] overflow-hidden rounded-xl relative z-[50]">
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
              {data.messageOrder === "10" ? (
                <div>
                  <div className={message}>{data.body}</div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="bg-transparent mt-2 inline-flex border !shadow-md !shadow-slate-700 !border-black text-black px-4 py-2 rounded hover:bg-white hover:text-black transition duration-300">
                        <PiNewspaperClippingThin className="mt-1 mr-1" />
                        View Hours
                      </button>
                    </SheetTrigger>

                    <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                      {/* <HoursDisplay
                        coOpHours={order?.location.hours}
                      /> */}
                    </SheetContent>
                  </Sheet>
                </div>
              ) : data.messageOrder === "HARVEST" ? (
                <div>
                  <div className={message}>{data.body}</div>

                  <button
                    onClick={() => setHarvestOpen(true)}
                    className="bg-transparent mt-2 inline-flex border !shadow-md !shadow-slate-700 !border-black text-black px-4 py-2 rounded hover:bg-white hover:text-black transition duration-300"
                  >
                    Projected Harvest Options
                  </button>
                </div>
              ) : (
                <div className={message}>{data.body}</div>
              )}
            </div>
          )}
          {/* display seen messages */}
          {isLast && isOwn && data.seen === true && (
            <div className="text-xs font-light text-gray-500">{`Seen`}</div>
          )}
        </div>
      </div>
      {/* MESSAGE OPTIONS START HERE */}

      {/* COOP receives order responce options */}
      {isLast &&
      (data.messageOrder === "DISPUTED" ||
        data.messageOrder === "COMPLETED") ? (
        data.messageOrder === "COMPLETED" ? (
          <Button
            variant={"secondary"}
            className={`fixed bottom-5 right-5 flex items-center gap-2 transition-all duration-300
    
      hover:scale-105
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
          >
            <>
              <span className="text-lg">Order Complete</span>
            </>
          </Button>
        ) : (
          <div className="flex flex-col flex-grow items-end justify-end w-full">
            <div className="fixed md:mb-0 mb-20 bottom-0 pb-[20px] bg-[#F1EFE7] w-full lg:max-w-[calc(100%-320px)]">
              <Form otherUsersId={otherUsersId} />
            </div>
          </div>
        )
      ) : (
        isLast && (
          <Popover>
            <style>{pulseAnimation}</style>
            <PopoverTrigger asChild>
              <Button
                variant={
                  (notOwn &&
                    data.messageOrder !== "IN_TRANSIT" &&
                    data.messageOrder !== "SELLER_PREPARING" &&
                    data.messageOrder !== "SELLER_ACCEPTED" &&
                    data.messageOrder !== "REFUNDED") ||
                  (isOwn && data.messageOrder === "IN_TRANSIT") ||
                  (isOwn && data.messageOrder === "SELLER_PREPARING") ||
                  (isOwn && data.messageOrder === "SELLER_ACCEPTED")
                    ? "default"
                    : "secondary"
                }
                className={`fixed mb-20 md:mb-0 bottom-5 right-5 flex items-center gap-2 transition-all duration-300
           
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
                style={
                  (notOwn &&
                    data.messageOrder !== "IN_TRANSIT" &&
                    data.messageOrder !== "SELLER_PREPARING" &&
                    data.messageOrder !== "SELLER_ACCEPTED" &&
                    data.messageOrder !== "REFUNDED") ||
                  (isOwn && data.messageOrder === "IN_TRANSIT") ||
                  (isOwn && data.messageOrder === "SELLER_PREPARING") ||
                  (isOwn && data.messageOrder === "SELLER_ACCEPTED")
                    ? { animation: "pulse 2s infinite" }
                    : {}
                }
              >
                {(notOwn &&
                  data.messageOrder !== "IN_TRANSIT" &&
                  data.messageOrder !== "SELLER_PREPARING" &&
                  data.messageOrder !== "SELLER_ACCEPTED" &&
                  data.messageOrder !== "REFUNDED") ||
                (isOwn && data.messageOrder === "IN_TRANSIT") ||
                (isOwn && data.messageOrder === "SELLER_PREPARING") ||
                (isOwn && data.messageOrder === "SELLER_ACCEPTED") ? (
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
              className={`${OutfitFont.className} rounded-t-md w-[300px] p-0`}
            >
              <div>
                <h3
                  className={`${ZillaFont.className} text-md rounded-t-md bg-[#F1EFE7] lg:text-md font-semibold pt-2 px-4`}
                >
                  Your Response Options
                </h3>
                <div className="flex flex-col p-4 pt-0 bg-[#F1EFE7] rounded-b-md">
                  {isLast && (
                    <>
                      {showImageUpload ? (
                        <ImageUpload
                          onImageUpload={handleImageUpload}
                          isLoading={isLoading}
                          messageType={imageUploadType}
                        />
                      ) : (
                        messageOptions.length > 0 && (
                          <MessageActions
                            options={messageOptions}
                            onSelect={handleMessageAction}
                            isLoading={isLoading}
                          />
                        )
                      )}
                    </>
                  )}
                  <div className="text-xs">
                    Not seeing a good response? Check out the more options
                    button.
                  </div>
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
