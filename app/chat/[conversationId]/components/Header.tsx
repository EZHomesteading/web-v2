"use client";
//header component for chat pages, simply displays some information about the chat.
import Link from "next/link";
import useOtherUser from "@/hooks/messenger/useOtherUser";
import { HiChevronLeft } from "react-icons/hi";
import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import { Order, Reviews } from "@prisma/client";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface HeaderProps {
  conversation: FullConversationType;
  order: Order;
  reviews: Reviews[];
}

const Header: React.FC<HeaderProps> = ({ conversation, order, reviews }) => {
  const otherUser = useOtherUser(conversation);
  const router = useRouter();
  if (!otherUser) {
    router.refresh();
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <>
      <div
        className={`${outfit.className} h-12 w-full lg:max-w-[calc(100%-320px)] pt-1 sm:mt-[66px]  z-[10] bg-[#F1EFE7]  fixed 
        flex 
        border-b-[1px]
        pb-2
        px-4 
        lg:px-6 
        justify-between 
        
        items-center `}
      >
        <div className="flex items-center justify-center">
          <Link
            href="/chat"
            className="
            lg:hidden 
            block 
            transition 
            cursor-pointer
          "
          >
            <HiChevronLeft size={32} />
          </Link>
          <div className="text-xl font-medium pl-2 xl:p-0">
            {conversation.name || otherUser.name}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
