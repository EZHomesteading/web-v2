"use client";

import { HiChevronLeft } from "react-icons/hi";

import { useMemo } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";

import useOtherUser from "@/hooks/messenger/useOtherUser";
//import useActiveList from "@/hooks/messenger/useActiveList";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/avatar-group";

interface HeaderProps {
  conversation: any;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);

  //const { members } = useActiveList();
  //const isActive = members.indexOf(otherUser?.email!) !== -1;
  // const statusText = useMemo(() => {
  //   if (conversation.isGroup) {
  //     return `${conversation.users.length} members`;
  //   }

  //   return isActive ? "Active" : "Offline";
  // }, [conversation, isActive]);

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
            {conversation.isGroup ? (
              <AvatarGroup users={conversation.users} />
            ) : (
              <Avatar image={otherUser.image} />
            )}
            <div className="flex flex-col text-3xl items-center justify-center">
              <div>{conversation.name || otherUser.name}</div>
              <div className="text-sm font-light text-neutral-500">
                {otherUser.firstName}
              </div>
            </div>
          </div>
          {/* <Link
            href="/info/support"
            target="_blank"
            className="
            block 
            transition 
            cursor-pointer
           ml-[50px] text-center bg-sky-500  hover:bg-sky-600  rounded-lg px-4 py-2"
          >
            Contact Support
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default Header;
