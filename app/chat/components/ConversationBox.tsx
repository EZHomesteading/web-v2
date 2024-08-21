"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import clsx from "clsx";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/hooks/messenger/useOtherUser";
import { FullConversationType } from "@/types";
import { UserInfo } from "@/next-auth";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  user?: UserInfo;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  user,
}) => {
  const otherUser = useOtherUser(data);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/chat/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => user?.email, [user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center mb-1 space-x-3 p-3 `,
        selected ? "" : "hover:cursor-pointer"
      )}
    >
      <Avatar image={otherUser.image} />
      <div className={`${outfit.className} min-w-0 flex-1`}>
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-normal">{otherUser.name}</p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400 
                  font-extralight
                "
              >
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
            {data.messages[data.messages.length - 1].body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
