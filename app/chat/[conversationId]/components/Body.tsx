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
}

const Body: React.FC<BodyProps> = ({
  initialMessages = [],
  otherUser,
  order,
  user,
  conversationId,
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

  return (
    <div className="flex-1 overflow-y-auto">
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
