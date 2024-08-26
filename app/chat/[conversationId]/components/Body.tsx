"use client";
//body component for messenger, this is where pusher is initialised, map over all messages
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import { find } from "lodash";
import { $Enums, Order } from "@prisma/client";
import { UserInfo } from "@/next-auth";
import { format, parseISO } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { Outfit } from "next/font/google";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import Image from "next/image";
import {
  IoMapOutline,
  IoStorefront,
  IoStorefrontOutline,
} from "react-icons/io5";
import { CiClock1 } from "react-icons/ci";

interface BodyProps {
  initialMessages: FullMessageType[];
  otherUser: {
    id: string;
    name: string;
    role: $Enums.UserRole;
    image: string | null;
    email: string;
    stripeAccountId: string | null;
  } | null;
  order: Order;
  user: UserInfo;
  conversationId: string;
  listings: any;
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
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    axios.post(`/api/chat/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/chat/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
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
      //pusherClient.disconnect(); // Disconnect Pusher connection
    };
  }, [conversationId]);
  const formattedPickupDate = order?.pickupDate
    ? formatPickupDate(order.pickupDate)
    : "No pickup date set";
  let item = "products";
  if (order?.listingIds?.length === 1) {
    item = "product";
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className={`${outfit.className} h-12 px-2 sm:px-10 w-full border-b-[1px] flex justify-between items-center`}
      >
        <div className="flex items-center gap-x-1 text-xs text-neutral-600">
          <div>
            {order?.listingIds?.length} {item}
          </div>
          <div className="h-1 w-1 bg-neutral-600 rounded-full"></div>
          <div>
            <div className="text-xs">{formattedPickupDate}</div>
          </div>
          <div className="h-1 w-1 bg-neutral-600 rounded-full"></div>
          <div className="text-xs">${order?.totalPrice}</div>
        </div>
        <Popover>
          <PopoverTrigger>
            <Button>More Details</Button>
          </PopoverTrigger>
          <PopoverContent className={`${outfit.className} mr-9  `}>
            <div className="font-normal text-xl mb-3 border-b-[1px]">
              Order Details
            </div>

            <div className="space-y-4">
              {listings.map((listing: any) => (
                <div key={listing.id} className="flex items-center space-x-4">
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
                    <p className="text-xs font-extralight text-gray-500">
                      ${listing.price} per {listing.quantityType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="font-normal text-xl my-3 border-b-[1px]">
              Seller Details
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 w-full ">
              <Button className="w-full flex-items-center gap-x-2 justify-between font-light text-sm">
                <div>Open & Close Hours</div> <CiClock1 />
              </Button>
              <Button className="w-full flex items-center gap-x-2 justify-between font-light text-sm">
                <div>Get Directions</div> <IoMapOutline />
              </Button>
              <Button className="w-full flex gap-x-2 items-center justify-between font-light text-sm">
                <div>Visit Store</div>
                <IoStorefrontOutline />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
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
