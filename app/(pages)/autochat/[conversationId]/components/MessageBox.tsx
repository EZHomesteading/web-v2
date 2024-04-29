"use client";

import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/types";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";
import axios from "axios";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  convoId: string;
  otherUsersId: any;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  convoId,
  otherUsersId,
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [selectedDateTime, setSelectedDateTime] = useState(
    new Date("2023-04-16T12:00:00")
  );
  const handleDateTimeChange = (date: any) => {
    setSelectedDateTime(date);
  };

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const notOwn = session.data?.user?.email !== data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex flex-grow gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-grow flex-col ga", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "message text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : " py-2 px-3"
  );
  const onSubmit1 = () => {
    axios.post("/api/messages", {
      message: "Yes, That time works, Your order will be ready at that time.",
      messageOrder: "2",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit2 = () => {
    axios.post("/api/messages", {
      message: `No, that time does not work. Does ${selectedDateTime.toString()} work instead? if not, my hours of operation are (insert hours of operation)`,
      messageOrder: "3",
      conversationId: convoId,
      otherUserId: otherUsersId,
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
  };
  const onSubmit4 = () => {
    axios.post("/api/messages", {
      message:
        "Fantastic, I will be there to pick up the item at the specified time.",
      messageOrder: "5",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit5 = () => {
    axios.post("/api/messages", {
      message: "Your order is ready to be picked up!",
      messageOrder: "6",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit6 = () => {
    axios.post("/api/messages", {
      message: "I have Received my order. Thank you!",
      messageOrder: "7",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit7 = () => {
    axios.post("/api/messages", {
      message:
        "Fantastic, this order has been marked as completed, feel free to delete this chat. If you do not delete this chat it will be automatically deleted after 72 hours",
      messageOrder: "1.1",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit8 = () => {
    axios.post("/api/messages", {
      message: `No, that time does not work. Can it instead be at ${selectedDateTime.toString()}`,
      messageOrder: "4",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit9 = () => {
    axios.post("/api/messages", {
      message: `I can deliver these items to you at ${selectedDateTime.toString()}, does that work?`,
      messageOrder: "11",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit10 = () => {
    axios.post("/api/messages", {
      message: "Yes, That time works, See you then!",
      messageOrder: "12",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit11 = () => {
    axios.post("/api/messages", {
      message: `No, that time does not work. Does ${selectedDateTime.toString()} work instead? if not, my hours of operation are (insert hours of operation)`,
      messageOrder: "13",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit12 = () => {
    axios.post("/api/messages", {
      message: "Your item has been delivered.",
      messageOrder: "6",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit13 = () => {
    axios.post("/api/messages", {
      message: `No, that time does not work. Does ${selectedDateTime.toString()} work instead?`,
      messageOrder: "11",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };
  const onSubmit14 = () => {
    axios.post("/api/messages", {
      message:
        "Yes, That time works. Your item will be delivered at that time.",
      messageOrder: "14",
      conversationId: convoId,
      otherUserId: otherUsersId,
    });
  };

  return (
    <div>
      <div className={container}>
        <div className={avatar}>
          <Avatar user={data.sender} />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500">{data.sender.name}</div>
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
          <div className={message}>
            <ImageModal
              src={data.image}
              isOpen={imageModalOpen}
              onClose={() => setImageModalOpen(false)}
            />
            {data.image ? (
              <Image
                alt="Image"
                height="288"
                width="288"
                onClick={() => setImageModalOpen(true)}
                src={data.image}
                className="
                object-cover 
                 
                hover:scale-110 
                 
                translate
              "
              />
            ) : (
              <div>
                <div>{data.body}</div>
              </div>
            )}
          </div>
          {isLast && isOwn && seenList.length > 0 && (
            <div
              className="
            text-xs 
            font-light 
            text-gray-500
            "
            >
              {`Seen by ${seenList}`}
            </div>
          )}
        </div>
      </div>
      {notOwn && isLast && data.messageOrder === "1" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden max-w-[70%] gap-y-2 text-white py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit1}
                className="message hover:bg-sky"
              >
                Yes, That time works, Your order will be ready at that time.
              </button>
              <div className="">
                <DateTimePicker
                  className="text-black mt-2 w-5 outline-none"
                  onChange={handleDateTimeChange}
                  value={selectedDateTime}
                  disableClock={true} // Optional, to disable clock selection
                  clearIcon={null} // Optional, to remove the clear icon
                  calendarIcon={null} // Optional, to remove the calendar icon
                />
                <button
                  type="submit"
                  onClick={onSubmit2}
                  className="message hover:bg-sky"
                >
                  No, that time does not work. Does{" "}
                  {selectedDateTime.toString()} work instead? if not, my hours
                  of operation are (insert hours of operation)
                </button>
              </div>
              <button
                type="submit"
                onClick={onSubmit3}
                className="message hover:bg-sky"
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
      {isOwn && isLast && data.messageOrder === "2" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit5}
                className="message hover:bg-sky"
              >
                Your order is ready to be picked up!
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "3" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
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
              <button
                type="submit"
                onClick={onSubmit8}
                className="message hover:bg-sky"
              >
                No, that time does not work. Can it instead be ready at{" "}
                {selectedDateTime.toString()}
              </button>
              <div className="">
                <DateTimePicker
                  className="text-black mt-2 w-5 outline-none"
                  onChange={handleDateTimeChange}
                  value={selectedDateTime}
                  disableClock={true} // Optional, to disable clock selection
                  clearIcon={null} // Optional, to remove the clear icon
                  calendarIcon={null} // Optional, to remove the calendar icon
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "4" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
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
              <button
                type="submit"
                onClick={onSubmit2}
                className="message hover:bg-sky"
              >
                No, that time does not work. Does {selectedDateTime.toString()}{" "}
                work instead? if not, my hours of operation are (insert hours of
                operation)
              </button>
              <div className="flex justify-center outline-none">
                <DateTimePicker
                  className="text-black mt-2 w-5 outline-none"
                  onChange={handleDateTimeChange}
                  value={selectedDateTime}
                  disableClock={true} // Optional, to disable clock selection
                  clearIcon={null} // Optional, to remove the clear icon
                  calendarIcon={null} // Optional, to remove the calendar icon
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "5" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit5}
                className="message hover:bg-sky"
              >
                Your order is ready to be picked up!
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "6" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit6}
                className="message hover:bg-sky"
              >
                I have Received my order. Thank you!
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "7" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit7}
                className="message hover:bg-sky-500"
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
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit9}
                className="message hover:bg-sky"
              >
                I can deliver these items to you at{" "}
                {selectedDateTime.toString()}, does that work?
              </button>
              <div className="flex justify-center outline-none">
                <DateTimePicker
                  className="text-black mt-2 w-5 outline-none"
                  onChange={handleDateTimeChange}
                  value={selectedDateTime}
                  disableClock={true} // Optional, to disable clock selection
                  clearIcon={null} // Optional, to remove the clear icon
                  calendarIcon={null} // Optional, to remove the calendar icon
                />
              </div>
              <button
                type="submit"
                onClick={onSubmit3}
                className="message hover:bg-sky"
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
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit10}
                className="message hover:bg-sky-500"
              >
                Yes, That time works, See you then!
              </button>
              <button
                type="submit"
                onClick={onSubmit11}
                className="message hover:bg-sky-500"
              >
                No, that time does not work. Does {selectedDateTime.toString()}{" "}
                work instead? if not, my hours of operation are (insert hours of
                operation)
              </button>
              <div className="flex justify-center outline-none">
                <DateTimePicker
                  className="text-black mt-2 w-5 outline-none"
                  onChange={handleDateTimeChange}
                  value={selectedDateTime}
                  disableClock={true} // Optional, to disable clock selection
                  clearIcon={null} // Optional, to remove the clear icon
                  calendarIcon={null} // Optional, to remove the calendar icon
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "12" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit12}
                className="message hover:bg-sky-600"
              >
                Your item has been delivered.
              </button>
            </div>
          </div>
        </div>
      )}
      {notOwn && isLast && data.messageOrder === "13" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit14}
                className="message hover:bg-sky-600"
              >
                Yes, That time works. Your item will be delivered at that time.
              </button>
              <button
                type="submit"
                onClick={onSubmit13}
                className="message hover:bg-sky-600"
              >
                No, that time does not work. Does {selectedDateTime.toString()}{" "}
                work instead?
              </button>
              <div className="flex justify-center outline-none">
                <DateTimePicker
                  className="text-black mt-2 w-5 outline-none"
                  onChange={handleDateTimeChange}
                  value={selectedDateTime}
                  disableClock={true} // Optional, to disable clock selection
                  clearIcon={null} // Optional, to remove the clear icon
                  calendarIcon={null} // Optional, to remove the calendar icon
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isOwn && isLast && data.messageOrder === "14" && (
        <div className="flex gap-3 p-4 justify-end ">
          <div className="order-2">
            <Avatar user={session?.data?.user} />
          </div>
          <div className="flex flex-col ga items-end">
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">Your response options</div>
            </div>
            <div className="flex flex-col text-sm w-fit overflow-hidden message text-white  py-2 px-3">
              <button
                type="submit"
                onClick={onSubmit12}
                className="message hover:bg-sky-600"
              >
                Your item has been delivered.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
