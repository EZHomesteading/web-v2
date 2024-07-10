"use client";
//header component for chat pages, simply displays some information about the chat.
import { HiChevronLeft } from "react-icons/hi";
import Link from "next/link";
import useOtherUser from "@/hooks/messenger/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/avatar-group";
import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import { Order } from "@prisma/client";
import Button from "@/app/components/modals/chatmodals/Button";

interface HeaderProps {
  conversation: FullConversationType;
  order: Order;
}

const Header: React.FC<HeaderProps> = ({ conversation, order }) => {
  const otherUser = useOtherUser(conversation);
  const router = useRouter();
  return (
    <>
      <div
        className="
        bg-slate-900 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
        text-white
      "
      >
        <div className="flex gap-3 items-center">
          <Link
            href="/chat"
            className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
          >
            <HiChevronLeft size={32} />
          </Link>
          <div className="flex flex-row items-start gap-x-2">
            {/* {conversation.isGroup ? (
              <AvatarGroup users={conversation.users} />
            ) : ( */}
            <Avatar image={otherUser.image} />
            {/* )} */}
            <div
              className="flex flex-col text-3xl items-center justify-center"
              onClick={() => router.push(`/profile/${otherUser.id}`)}
            >
              <div>{conversation.name || otherUser.name}</div>
              {otherUser.id === order.sellerId ? (
                <Button onClick={() => router.push(`/store/${otherUser.url}`)}>
                  Go to Store
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/profile/${otherUser.url}`)}
                >
                  View buyers rating
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
