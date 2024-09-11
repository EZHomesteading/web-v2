"use client";
//body component for messenger, this is where pusher is initialised, map over all messages
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import { find } from "lodash";
import { $Enums, Order, Reviews } from "@prisma/client";
import { ExtendedHours, UserInfo } from "@/next-auth";
import { format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { Outfit } from "next/font/google";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { SheetCartC, SheetContentF } from "@/app/components/ui/review-sheet";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import Image from "next/image";
import {
  IoMapOutline,
  IoStar,
  IoStorefront,
  IoStorefrontOutline,
  IoTrash,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import CancelModal from "./CancelModal";
import ConfirmModal from "./ConfirmModal";
import DisputeModal from "./DisputeModal";
import EscalateModal from "./EscalateModal";
import RefundModal from "./RefundModal";
import {
  HiOutlineExclamationCircle,
  HiOutlineMinusCircle,
} from "react-icons/hi";
import { PiGavel } from "react-icons/pi";
import { RiExchangeDollarLine } from "react-icons/ri";
import { MdOutlineRateReview } from "react-icons/md";

interface BodyProps {
  initialMessages: FullMessageType[];
  otherUser: {
    id: string;
    name: string;
    role: $Enums.UserRole;
    image: string | null;
    email: string;
    stripeAccountId: string | null;
    url: string | undefined;
  } | null;
  order: Order;
  user: UserInfo;
  conversationId: string;
  listings: any;
  reviews: Reviews[];
}
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const Body: React.FC<BodyProps> = ({
  initialMessages = [],
  otherUser,
  order,
  user,
  conversationId,
  listings,
  reviews,
}) => {
  const sellerRole =
    otherUser?.id === order.sellerId ? otherUser.role : user.role;
  const quantities = JSON.parse(order.quantity);
  console.log(quantities);
  const getQuantitiy = (listingId: string) => {
    // Find the listing with the matching id
    const foundListing = quantities.find(
      (quantity: any) => quantity.id === listingId
    );

    // Return the found listing or null if not found
    return foundListing.quantity || null;
  };
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const lastMessage = messages[messages.length - 1];

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  const [cancel, setCancel] = useState(true);
  const [dispute, setDispute] = useState(true);
  const [escalate, setEscalate] = useState(false);
  const [refund, setRefund] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [review, setReview] = useState(false);

  //dependent on message order allow or dont allow the cancel button to be visible
  useEffect(() => {
    if (
      lastMessage.messageOrder === "4" ||
      lastMessage.messageOrder === "7" ||
      lastMessage.messageOrder === "15" ||
      lastMessage.messageOrder === "9" ||
      lastMessage.messageOrder === "18" ||
      lastMessage.messageOrder === "19" ||
      lastMessage.messageOrder === "17" ||
      (user.id !== order.sellerId && lastMessage.messageOrder === "14") ||
      lastMessage.messageOrder === "12" ||
      lastMessage.messageOrder === "6" ||
      lastMessage.messageOrder === "1.1" ||
      lastMessage.messageOrder === "1.6"
    ) {
      setCancel(false);
    }
  }),
    [order];
  useEffect(() => {
    if (
      lastMessage.messageOrder === "1" ||
      lastMessage.messageOrder === "2" ||
      lastMessage.messageOrder === "3" ||
      lastMessage.messageOrder === "4" ||
      lastMessage.messageOrder === "5" ||
      lastMessage.messageOrder === "7" ||
      lastMessage.messageOrder === "8" ||
      lastMessage.messageOrder === "9" ||
      lastMessage.messageOrder === "10" ||
      lastMessage.messageOrder === "1.1" ||
      lastMessage.messageOrder === "11" ||
      lastMessage.messageOrder === "1.6"
    ) {
      setDispute(false);
    }
  }),
    [order];
  useEffect(() => {
    if (lastMessage.messageOrder === "1.6") {
      setEscalate(true);
      setRefund(true);
      setReview(true);
    }
  }),
    [order];
  useEffect(() => {
    if (lastMessage.messageOrder === "1.1") {
      setReview(true);
      setConfirm(true);
    }
  }),
    [order];
  //handle seen messages
  const seenList = (lastMessage.seen || [])
    .filter((user) => user.email !== lastMessage?.sender?.email)
    .map((user) => user.name)
    .join(", ");
  if (!user?.id) {
    return null;
  }
  useEffect(() => {
    axios.post(`/api/chat/conversations/${conversationId}/seen`);
  }, [conversationId]);
  const router = useRouter();
  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
  }, [initialMessages, conversationId]);
  useEffect(() => {
    const messageHandler = async (message: FullMessageType) => {
      try {
        await axios.post(`/api/chat/conversations/${conversationId}/seen`);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          // Check if the new message is the last one in the updated messages array
          if (updatedMessages.length === prevMessages.length + 1) {
            // Scroll to the bottom after adding the new message
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }
          return updatedMessages;
        });
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((prevMessages) =>
        prevMessages.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            // Check if the updated message is the last one in the prevMessages array
            if (prevMessages.length === messages.length) {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.subscribe(conversationId);
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    // Cleanup function to unsubscribe and unbind event handlers
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId, messages]);
  const formattedPickupDate = order?.pickupDate
    ? formatPickupDate(order.pickupDate)
    : "No pickup date set";
  let item = "items";
  if (order?.listingIds?.length === 1) {
    item = "item";
  }
  return (
    <div className="flex-1 overflow-y-auto">
      {user.id === order.sellerId ? (
        <CancelModal
          isOpen={cancelOpen}
          onClose={() => setCancelOpen(false)}
          order={order}
          otherUser={otherUser?.id}
          convoId={order.conversationId}
          otherUserRole={otherUser?.role}
          isSeller={true}
        />
      ) : (
        <CancelModal
          isOpen={cancelOpen}
          onClose={() => setCancelOpen(false)}
          order={order}
          otherUser={otherUser?.id}
          convoId={order.conversationId}
          otherUserRole={otherUser?.role}
          isSeller={false}
        />
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        orderId={order.id}
        onClose={() => setConfirmOpen(false)}
      />
      <DisputeModal
        isOpen={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        user={user}
        orderId={order.id}
        conversationId={order.conversationId}
        otherUserId={otherUser?.id}
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
        conversationId={order.conversationId}
        otherUserId={otherUser?.id}
        paymentId={order?.paymentIntentId}
      />
      <div
        className={`${outfit.className} h-12 mt-[110px] px-2 sm:px-10 w-full border-b-[1px] lg:max-w-[calc(100%-320px)] z-[10] bg-[#F1EFE7]  fixed flex justify-between items-center`}
      >
        <div className="flex items-center gap-x-1 text-xs text-neutral-600">
          <div>
            {order?.listingIds?.length} {item}
          </div>
          <div className="h-1 w-1 bg-neutral-600 rounded-full"></div>
          <div>
            <div className="text-xs">
              {sellerRole === "PRODUCER" ? "Drop off time:" : "Pickup time:"}{" "}
              {formattedPickupDate}
            </div>
          </div>
          <div className="h-1 w-1 bg-neutral-600 rounded-full"></div>
          <div className="text-xs">Total: ${order?.totalPrice}</div>
        </div>
        <Popover>
          <PopoverTrigger className=" absolute right-4 bottom-12">
            <Button>More Options</Button>
          </PopoverTrigger>
          <PopoverContent className={`${outfit.className} mr-9  `}>
            <div className="font-normal text-xl mb-3 border-b-[1px]">
              Order Details
            </div>

            <div className="space-y-4">
              {listings.map((listing: any) => (
                <div
                  key={listing.id}
                  className="flex items-center space-x-4"
                  onClick={() => router.push(`/listings/${listing.id}`)}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={listing.imageSrc[0] || "/placeholder.jpg"}
                      alt={listing.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover aspect-square"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-normal">{listing.title}</p>
                    <p className="text-xs font-extralight text-gray-700">
                      ${listing.price} per {listing.quantityType}
                    </p>
                    <p className="text-xs font-extralight text-gray-700">
                      {getQuantitiy(listing.id)} {listing.quantityType} for $
                      {getQuantitiy(listing.id) * listing.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="font-normal text-xl my-3 border-b-[1px]">
              {user.id === order.sellerId ? "Buyer Details" : "Seller Details"}
            </div>

            {user.id === order.sellerId ? (
              user.role === "PRODUCER" ? (
                <div className="flex flex-col items-center justify-center space-y-1 w-full ">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="w-full flex items-center gap-x-2 justify-between font-light text-sm">
                        <div>View Hours</div> <IoStorefront />
                      </Button>
                    </SheetTrigger>

                    <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                      <HoursDisplay
                        coOpHours={order.location.hours as ExtendedHours}
                      />
                    </SheetContent>
                  </Sheet>
                  <Button
                    onClick={() =>
                      window.open(
                        `http://maps.apple.com/?address=${order.location.address}`,
                        "_ blank"
                      )
                    }
                    className="w-full flex items-center gap-x-2 justify-between font-light text-sm"
                  >
                    <div>Get Directions</div> <IoMapOutline />
                  </Button>
                  <Button
                    className="
      w-full flex items-center gap-x-2 justify-between font-light text-sm "
                    onClick={() => router.push(`/profile/${order.userId}`)}
                    title="View reviews of this buyer"
                  >
                    <div>View Reviews</div> <IoStar />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1 w-full ">
                  <Button
                    className="
      w-full flex items-center gap-x-2 justify-between font-light text-sm "
                    onClick={() => router.push(`/profile/${order.userId}`)}
                    title="View reviews of this buyer"
                  >
                    <div>View Reviews</div> <IoStar />
                  </Button>
                </div>
              )
            ) : otherUser?.role === "PRODUCER" ? (
              <Button
                onClick={() => router.push(`/store/${otherUser?.url}`)}
                className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
              >
                <div>Visit Store</div>
                <IoStorefrontOutline />
              </Button>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1 w-full ">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full flex items-center gap-x-2 justify-between font-light text-sm">
                      <div>View Hours</div> <IoStorefront />
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                    <HoursDisplay
                      coOpHours={order.location.hours as ExtendedHours}
                    />
                  </SheetContent>
                </Sheet>
                <Button
                  onClick={() =>
                    window.open(
                      `http://maps.apple.com/?address=${order.location.address}`,
                      "_ blank"
                    )
                  }
                  className="w-full flex items-center gap-x-2 justify-between font-light text-sm"
                >
                  <div>Get Directions</div> <IoMapOutline />
                </Button>
                <Button
                  onClick={() => router.push(`/store/${otherUser?.url}`)}
                  className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
                >
                  <div>Visit Store</div>
                  <IoStorefrontOutline />
                </Button>
              </div>
            )}
            <div className="font-normal text-xl my-3 border-b-[1px]">
              Order Options
            </div>
            {/* allow cancel button to appear */}
            <div className="flex flex-col items-center justify-center space-y-1 w-full">
              {cancel === true ? (
                <Button
                  type="submit"
                  onClick={() => setCancelOpen(true)}
                  className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
                >
                  <div>Cancel Order </div> <HiOutlineMinusCircle />
                </Button>
              ) : null}
              {dispute === true ? (
                <Button
                  type="submit"
                  onClick={() => setDisputeOpen(true)}
                  className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
                >
                  <div>Dispute Order</div> <HiOutlineExclamationCircle />
                </Button>
              ) : null}
              {escalate === true ? (
                <Button
                  type="submit"
                  onClick={() => setEscalateOpen(true)}
                  className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
                >
                  <div>Get an Admin Involved</div> <PiGavel />
                </Button>
              ) : null}
              {refund === true && user.id === order.sellerId ? (
                <Button
                  type="submit"
                  onClick={() => setRefundOpen(true)}
                  className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
                >
                  <div>Refund Buyer</div> <RiExchangeDollarLine />
                </Button>
              ) : null}
              {review === true ? (
                <SheetCartC>
                  <SheetTrigger asChild>
                    <Button className="w-full flex items-center gap-x-2 justify-between font-light text-sm">
                      <div>Write Review</div> <MdOutlineRateReview />
                    </Button>
                  </SheetTrigger>
                  <SheetContentF
                    side="top"
                    className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
                    reviewedId={otherUser?.id}
                    reviewerId={user?.id}
                    orderId={order.id}
                    buyer={user.id === order.sellerId ? false : true}
                  ></SheetContentF>
                </SheetCartC>
              ) : null}
              {confirm === true ? (
                <Button
                  type="submit"
                  onClick={() => setConfirmOpen(true)}
                  className="w-full flex gap-x-2 items-center justify-between font-light text-sm"
                >
                  <div> Delete Chat </div> <IoTrash />
                </Button>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="pb-[150px]"></div>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          user={user}
          convoId={conversationId}
          otherUsersId={otherUser?.id}
          order={order}
          otherUserRole={otherUser?.role}
          stripeAccountId={otherUser?.stripeAccountId}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
function formatPickupDate(date: Date): string {
  try {
    return format(date, "EEE MMM d, h:mma");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}
