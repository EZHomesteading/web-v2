"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";
import { pusherClient } from "@/lib/pusher";
import Avatar from "@/components/Avatar";
import useOtherUser from "@/hooks/messenger/useOtherUser";
import { FullConversationType, FullMessageType } from "@/types";
import { IoNotificationsCircle } from "react-icons/io5";
import { UserInfo } from "next-auth";
import { OutfitFont } from "@/components/fonts";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  user?: UserInfo | null | undefined;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  user,
}) => {
  const [conversation, setConversation] = useState(data);
  const otherUser = useOtherUser(conversation);
  const router = useRouter();

  useEffect(() => {
    setConversation(data);
  }, [data]);

  useEffect(() => {
    const newHandler = (message: FullMessageType) => {
      if (message.conversationId === conversation.id) {
        setConversation((current) => ({
          ...current,
          messages: [...current.messages, message],
          lastMessageAt: new Date(message.createdAt),
        }));
      }
    };

    const updateHandler = (message: FullMessageType) => {
      if (message.conversationId === conversation.id) {
        setConversation((current) => ({
          ...current,
          messages: current.messages.map((currentMessage) =>
            currentMessage.id === message.id ? message : currentMessage
          ),
        }));
      }
    };

    pusherClient.subscribe(conversation.id);
    pusherClient.bind("messages:new", newHandler);
    pusherClient.bind("message:update", updateHandler);

    return () => {
      pusherClient.unsubscribe(conversation.id);
      pusherClient.unbind("messages:new", newHandler);
      pusherClient.unbind("message:update", updateHandler);
    };
  }, [conversation.id]);

  const handleClick = useCallback(() => {
    router.push(`/chat/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  }, [conversation.messages]);

  const userEmail = useMemo(() => user?.email, [user?.email]);
  const isOwn = user?.email === lastMessage?.sender?.email;
  const notOwn = !isOwn;

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) return false;
    return lastMessage.seen;
  }, [userEmail, lastMessage]);
  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center mb-1 space-x-3 p-3`,
        selected ? "" : "hover:cursor-pointer"
      )}
    >
      <Avatar image={otherUser?.image} />

      <div className={`${OutfitFont.className} min-w-0 flex-1`}>
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          {(notOwn && lastMessage?.messageOrder !== "SELLER_ACCEPTED") ||
          (isOwn && lastMessage?.messageOrder === "SELLER_ACCEPTED") ? (
            <span
              className=" bg-white w-3 h-3 rounded-[40px] absolute left-[40px] top-[43px] md:left-[50px] md:top-[45px] group"
              aria-label="Your turn to respond"
            >
              <IoNotificationsCircle
                color="green"
                className="absolute right-[-5px] top-[-3px]"
                size={20}
              />
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 top-full mt-1 whitespace-nowrap z-10">
                Your turn to respond
              </span>
            </span>
          ) : null}
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-normal">{otherUser?.name}</p>

            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-extralight">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm font-thin`,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessage?.body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
