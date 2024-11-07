"use client";
import { useState, useCallback } from "react";
import { format } from "date-fns";
import {
  ChatMessage,
  ChatOrder,
  ChatUser,
  MessageOption,
  OtherUserChat,
} from "chat-types";
import Avatar from "@/components/Avatar";
import { outfitFont } from "@/components/fonts";
import { getMessageOptions } from "./messageOptions";
import { chatService } from "../../helper-funcs/chat-service";
import { MessageImage } from "./message-image";
import { MessageActions } from "./message-actions";

interface p {
  message: ChatMessage;
  isLast?: boolean;
  convoId: string;
  order: ChatOrder | null;
  user: ChatUser;
  otherUser: OtherUserChat | null;
  stripeAccountId: string | null | undefined;
  messagesLength: number;
}

const MessageBox = ({ message, isLast, order, user, otherUser }: p) => {
  const [isLoading, setIsLoading] = useState(false);

  const isSeller = user.id === order?.sellerId;
  const isOwn = user?.email === message?.sender?.email;
  const messageOptions = order
    ? getMessageOptions(order.status, user.role, isSeller)
    : [];

  const handleMessageAction = useCallback(
    async (option: MessageOption) => {
      setIsLoading(true);
      try {
        await chatService.updateOrderStatus({
          orderId: order?.id ?? "",
          status: option.status,
          message: `Action: ${option.label}`,
        });
      } catch (error) {
        console.error("Error handling message action:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [order]
  );

  return (
    <div
      className={`flex items-start mt-4 gap-2 py-2 px-4 ${outfitFont.className}`}
    >
      <Avatar image={message.sender.image} />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span>{message.sender.name}</span>
          <span className="text-xs text-neutral-400">
            {format(new Date(message.createdAt), "p")}
          </span>
        </div>

        {message.messageOrder === "img" ? (
          <MessageImage src={message.body} />
        ) : (
          <div className="text-sm font-light">{message.body}</div>
        )}

        {isLast && messageOptions.length > 0 && (
          <MessageActions
            options={messageOptions}
            onSelect={handleMessageAction}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
