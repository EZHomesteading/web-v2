"use client";

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
import { Outfit } from "next/font/google";
import { IoTrash } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import CancelModal from "./CancelModal";
import { UserRole } from "@prisma/client";

import { UploadButton } from "@/utils/uploadthing";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import DisputeModal from "./DisputeModal";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  convoId: string;
  otherUsersId: any;
  order: any;
  otherUserRole: string;
  user: any;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  user,
  convoId,
  otherUsersId,
  order,
  otherUserRole,
}) => {
  const [image, setImage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const [validTime, setValidTime] = useState<any>("(select your time)");
  const [dateTime, setDateTime] = useState<any>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [cancel, setCancel] = useState(true);
  const isOwn = user?.email === data?.sender?.email;
  const notOwn = user?.email !== data?.sender?.email;
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
      (data.messageOrder === "1.1" && isLast)
    ) {
      setCancel(false);
    }
  }),
    [order];
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");
  if (!user?.id) {
    return null;
  }
  const container = clsx("flex flex-grow gap-3 p-2", isOwn && "justify-end");
  const body = clsx("flex flex-grow flex-col ga", isOwn && "items-end");
  const message = clsx(
    `text-xs md:text-sm w-fit ${outfit.className}`,
    isOwn ? `m text-white` : `mnot`,
    data.image ? "rounded-md p-0" : " py-2 px-3"
  );
  const notMessage = clsx(
    `text-xs md:text-sm w-fit ${outfit.className}`,
    isOwn ? ` text-white` : ``,
    data.image ? "rounded-md p-0" : " "
  );
  const onSubmit1 = () => {
    axios.post("/api/messages", {
      message: `Yes, That time works, Your order will be ready at that time. at ${user.location?.address}`,
      messageOrder: "2",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    if (user.role === UserRole.COOP) {
      axios.post("/api/update-order", { orderId: order.id, status: 2 });
    } else {
      axios.post("/api/update-order", { orderId: order.id, status: 10 });
    }
  };
  const onSubmit2 = () => {
    if (validTime === "(select your time)") {
      toast.error("You must select a time before choosing this option");
      return;
    }
    axios.post("/api/messages", {
      message: `No, that time does not work. Does ${validTime} work instead? if not, my hours of operation are `,
      messageOrder: "3",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", {
      orderId: order.id,
      status: 3,
      pickupDate: dateTime,
    });
  };
  const onSubmit3 = () => {
    axios.post("/api/messages", {
      message:
        "My apologies, but one or more of these items is no longer available, and this order has been canceled. Sorry for the inconvenience. Feel free to delete this chat whenever you have seen this message. If you do not delete this chat it will be automatically deleted after 72 hours",
      messageOrder: "1.1",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", { orderId: order.id, status: 4 });
    axios.post("/api/updateListingOnCancel", { order: order });
  };
  const onSubmit4 = () => {
    axios.post("/api/messages", {
      message:
        "Fantastic, I will be there to pick up the item at the specified time.",
      messageOrder: "5",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", { orderId: order.id, status: 5 });
  };
  const onSubmit5 = () => {
    axios.post("/api/messages", {
      message: "Your order is ready to be picked up!",
      messageOrder: "6",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", { orderId: order.id, status: 8 });
  };
  const onSubmit6 = () => {
    axios.post("/api/messages", {
      message: "I have Received my order. Thank you!",
      messageOrder: "7",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    if (user.role === UserRole.COOP) {
      axios.post("/api/update-order", { orderId: order.id, status: 17 });
    } else {
      axios.post("/api/update-order", { orderId: order.id, status: 9 });
    }
  };
  const onSubmit7 = () => {
    axios.post("/api/messages", {
      message:
        "Fantastic, this order has been marked as completed, feel free to delete this chat. If you do not delete this chat it will be automatically deleted after 72 hours",
      messageOrder: "1.1",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", { orderId: order.id, status: 18 });
  };
  const onSubmit8 = () => {
    if (validTime === "(select your time)") {
      toast.error("You must select a time before choosing this option");
      return;
    }
    axios.post("/api/messages", {
      message: `No, that time does not work. Can it instead be at ${validTime}`,
      messageOrder: "4",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    if (user.role === UserRole.PRODUCER) {
      axios.post("/api/update-order", {
        orderId: order.id,
        status: 11,
        pickupDate: dateTime,
      });
    } else {
      axios.post("/api/update-order", {
        orderId: order.id,
        status: 6,
        pickupDate: dateTime,
      });
    }
  };
  const onSubmit9 = () => {
    if (validTime === "(select your time)") {
      toast.error("You must select a time before choosing this option");
      return;
    }
    axios.post("/api/messages", {
      message: `I can deliver these items to you at ${validTime}, does that work?`,
      messageOrder: "11",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", {
      orderId: order.id,
      status: 11,
      pickupDate: dateTime,
    });
  };
  const onSubmit10 = () => {
    axios.post("/api/messages", {
      message: "Yes, That time works, See you then!",
      messageOrder: "12",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    if (user.role === UserRole.COOP) {
      axios.post("/api/update-order", { orderId: order.id, status: 13 });
    } else {
      axios.post("/api/update-order", { orderId: order.id, status: 10 });
    }
  };
  const onSubmit11 = () => {
    if (validTime === "(select your time)") {
      toast.error("You must select a time before choosing this option");
      return;
    }
    axios.post("/api/messages", {
      message: `No, that time does not work. Does ${validTime} work instead? if not, my hours of operation are`,
      messageOrder: "13",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", {
      orderId: order.id,
      status: 14,
      pickupDate: dateTime,
    });
  };
  const onSubmit12 = async (img: string) => {
    await axios.post("/api/messages", {
      message: img,
      messageOrder: "img",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    await axios.post("/api/messages", {
      message: "Your item has been delivered.",
      messageOrder: "6",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", { orderId: order.id, status: 16 });
  };
  const onSubmit13 = () => {
    if (validTime === "(select your time)") {
      toast.error("You must select a time before choosing this option");
      return;
    }
    axios.post("/api/messages", {
      message: `No, that time does not work. Does ${validTime} work instead?`,
      messageOrder: "11",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    if (user.role === UserRole.PRODUCER) {
      axios.post("/api/update-order", {
        orderId: order.id,
        status: 11,
        pickupDate: dateTime,
      });
    } else {
      axios.post("/api/update-order", {
        orderId: order.id,
        status: 6,
        pickupDate: dateTime,
      });
    }
  };
  const onSubmit14 = () => {
    axios.post("/api/messages", {
      message:
        "Yes, That time works. Your item will be delivered at that time.",
      messageOrder: "14",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
    axios.post("/api/update-order", { orderId: order.id, status: 10 });
  };

  const handleTime = (childTime: any) => {
    setDateTime(childTime.pickupTime);
    const date = formatTime(childTime.pickupTime);
    setValidTime(date);
  };

  const hoursButton = () => {
    return (
      <span>
        <Sheet>
          <SheetTrigger>HOURS</SheetTrigger>
          <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
            <HoursDisplay coOpHours={user.hours} />
          </SheetContent>
        </Sheet>
      </span>
    );
  };

  return (
    <div>
      <CustomTimeModal2
        isOpen={customTimeOpen}
        onClose={() => setCustomTimeOpen(false)}
        hours={user.hours}
        onSetTime={handleTime}
      />
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
      <CancelModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        order={order}
        otherUser={otherUsersId}
        convoId={convoId}
        otherUserRole={otherUserRole}
      />
      {cancel === true && isLast ? (
        <button
          type="submit"
          onClick={() => setCancelOpen(true)}
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
          Cancel
        </button>
      ) : null}
      <div className={container}>
        <div className={body}>
          <div className="text-xs text-gray-400 mx-1 mb-1">
            {format(new Date(data.createdAt), "p")}
          </div>

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
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 hover:cursor-pointer">
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
            <div className={message}>
              <div>
                {data.messageOrder === "10" ||
                data.messageOrder === "13" ||
                data.messageOrder === "3" ? (
                  <div>
                    {data.body}
                    <span className="text-black">{hoursButton()}</span>
                  </div>
                ) : (
                  <div>{data.body}</div>
                )}
              </div>
            </div>
          )}

          {data.messageOrder === "1.1" && isOwn ? (
            <div className="flex flex-row absolute top-[100px] right-2">
              <ReviewButton buyerId={otherUsersId} sellerId={user?.id} />{" "}
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
          {data.messageOrder === "1.1" && notOwn ? (
            <div className="flex flex-row absolute top-[100px] right-2 ">
              <ReviewButton buyerId={user?.id} sellerId={otherUsersId} />
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

          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">
              {`Seen by ${seenList}`}
            </div>
          )}
        </div>
      </div>
      {notOwn && isLast && data.messageOrder === "1" && (
        <div className="flex flex-col px-2 justify-end items-end">
          <div className="text-sm text-gray-500">Your response options</div>
          <div className="flex flex-col text-xs md:text-sm max-w-[90%] gap-y-1 items-end text-white py-1">
            <button type="submit" onClick={onSubmit1} className="m">
              Yes, That time works, Your order will be ready at that time.
            </button>
            <button onClick={() => setCustomTimeOpen(true)}> SET TIME </button>
            <button type="submit" onClick={onSubmit2} className="m">
              No, that time does not work. Does{" "}
              <span className="text-black">{validTime}</span> work instead? if
              not, my hours of operation are
            </button>
            <button type="submit" onClick={onSubmit3} className="m">
              My apologies, but one or more of these items is no longer
              available, and this order has been canceled. Sorry for the
              inconvenience. Feel free to delete this chat whenever you have
              seen this message. If you do not delete this chat it will be
              automatically deleted after 72 hours
            </button>
          </div>
        </div>
      )}
      {isOwn && isLast && data.messageOrder === "2" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden text-white  py-2 px-3">
              <button type="submit" onClick={onSubmit5} className="m">
                Your order is ready to be picked up!
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "3" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit4}
                className="message hover:bg-sky"
              >
                Fantastic, I will be there to pick up the item at the specified
                time.
              </button>
              <button onClick={() => setCustomTimeOpen(true)}>
                {" "}
                SET TIME{" "}
              </button>
              <button
                type="submit"
                onClick={onSubmit8}
                className="message hover:bg-sky"
              >
                No, that time does not work. Can it instead be ready at{" "}
                <span className="text-black">{validTime}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "4" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit1}
                className="message hover:bg-sky"
              >
                Yes, That time works, Your order will be ready at that time.
              </button>
              <button onClick={() => setCustomTimeOpen(true)}>
                {" "}
                SET TIME{" "}
              </button>
              <button
                type="submit"
                onClick={onSubmit2}
                className="message hover:bg-sky"
              >
                No, that time does not work. Does{" "}
                <span className="text-black">{validTime}</span> work instead? if{" "}
                not, my hours of operation are
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "5" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button type="submit" onClick={onSubmit5} className="">
                Your order is ready to be picked up!
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "6" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden  text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit6}
                className={`m text-xs md:text-sm`}
              >
                I have Received my order. Thank you!
              </button>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden  text-white  py-2 px-3">
              <button
                type="submit"
                onClick={() => setDisputeOpen(true)}
                className={`m text-xs md:text-sm`}
              >
                Dispute Transaction
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "7" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit7}
                className="m hover:bg-sky-500"
              >
                Fantastic, this order has been marked as completed, feel free to
                delete this chat. If you do not delete this chat it will be
                automatically deleted after 72 hours
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "10" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button onClick={() => setCustomTimeOpen(true)}>
                {" "}
                SET TIME{" "}
              </button>

              <button type="submit" onClick={onSubmit9} className="">
                I can deliver these items to you at{" "}
                <span className="text-black">{validTime}</span>, does that work?
              </button>

              <button
                type="submit"
                onClick={onSubmit3}
                className="m hover:bg-sky"
              >
                My apologies, but one or more of these items is no longer
                available, and this order has been canceled. Sorry for the
                inconvenience. Feel free to delete this chat whenever you have
                seen this message. If you do not delete this chat it will be
                automatically deleted after 72 hours
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "11" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit10}
                className="m hover:bg-sky-500"
              >
                Yes, That time works, See you then!
              </button>
              <button onClick={() => setCustomTimeOpen(true)}>
                {" "}
                SET TIME{" "}
              </button>

              <button
                type="submit"
                onClick={onSubmit11}
                className="m hover:bg-sky-500"
              >
                No, that time does not work. Does{" "}
                <span className="text-black">{validTime}</span> work instead? if
                not, my hours of operation are
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "12" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="order-2"></div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden text-white  py-2 px-3">
              <div className="">
                <div className=" p-2 rounded-lg">
                  {!image && (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: any) => {
                        setImage(res[0].url);
                        onSubmit12(res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                      appearance={{
                        container: "h-full w-max",
                      }}
                      className="ut-allowed-content:hidden ut-button:bg-blue-800 ut-button:text-white ut-button:w-fit ut-button:px-2 ut-button:p-3"
                      content={{
                        button({ ready }) {
                          if (ready)
                            return (
                              <div>Sent a photo of the delivered produce</div>
                            );
                          return "Getting ready...";
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
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "13" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="order-2"></div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit14}
                className="m hover:bg-sky-600"
              >
                Yes, That time works. Your item will be delivered at that time.
              </button>
              <button onClick={() => setCustomTimeOpen(true)}>
                {" "}
                SET TIME{" "}
              </button>

              <button
                type="submit"
                onClick={onSubmit13}
                className="m hover:bg-sky-600"
              >
                No, that time does not work. Does{" "}
                <span className="text-black">{validTime}</span> work instead?
              </button>
            </div>
          </div>
        </div>
      )}
      {isOwn && isLast && data.messageOrder === "14" && (
        <div className="flex gap-3 p-2 justify-end ">
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <div className="">
                <div className=" p-2 rounded-lg">
                  {!image && (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: any) => {
                        setImage(res[0].url);
                        onSubmit12(res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                      appearance={{
                        container: "h-full w-max",
                      }}
                      className="ut-allowed-content:hidden ut-button:bg-blue-800 ut-button:text-white ut-button:w-fit ut-button:px-2 ut-button:p-3"
                      content={{
                        button({ ready }) {
                          if (ready)
                            return (
                              <div>Sent a photo of the delivered produce</div>
                            );
                          return "Getting ready...";
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
        </div>
      )}
    </div>
  );
};

export default MessageBox;
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
