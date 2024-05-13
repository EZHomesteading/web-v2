"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import useConversation from "@/hooks/messenger/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
  otherUser: string | undefined;
  order: any;
  otherUserRole: any;
}

const Body: React.FC<BodyProps> = ({
  initialMessages = [],
  otherUser,
  order,
  otherUserRole,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
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

    // Subscribe to the channel and bind event handlers
    pusherClient.subscribe(conversationId);
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    // Cleanup function to unsubscribe and unbind event handlers
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
      pusherClient.disconnect(); // Disconnect Pusher connection
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-row-reverse"></div>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          convoId={conversationId}
          otherUsersId={otherUser}
          order={order}
          otherUserRole={otherUserRole}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
