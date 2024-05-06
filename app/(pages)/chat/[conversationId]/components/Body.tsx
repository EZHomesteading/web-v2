"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/lib/pusher";
import useConversation from "@/hooks/messenger/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import { find } from "lodash";
import CancelModal from "./CancelModal";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancel, setCancel] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const { conversationId } = useConversation();
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

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

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);
  useEffect(() => {
    if (order?.status == null) {
      return;
    }
    if (
      order.status === 4 ||
      order.status === 7 ||
      order.status === 15 ||
      order.status === 9 ||
      order.status === 18 ||
      order.status === 19 ||
      order.status === 17 ||
      order.status === 12
    ) {
      setCancel(false);
    }
  }),
    [order];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-row-reverse">
        <CancelModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          order={order}
          otherUser={otherUser}
          convoId={conversationId}
          otherUserRole={otherUserRole}
        />
        {cancel === false ? null : (
          <button
            type="submit"
            onClick={() => setConfirmOpen(true)}
            // onTouchMoveCapture={}
            className="
 rounded-full 
 p-2 
 bg-sky-500 
 cursor-pointer 
 hover:bg-sky-600 
 mt-2
 ml-1
 mr-1
"
          >
            Cancel
          </button>
        )}
      </div>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          convoId={conversationId}
          otherUsersId={otherUser}
          order={order}
        />
      ))}

      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
