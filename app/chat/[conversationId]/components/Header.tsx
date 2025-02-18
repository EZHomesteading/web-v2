"use client";
//header component for chat pages, simply displays some information about the chat.
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { OutfitFont } from "@/components/fonts";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <>
      <div
        className={`${OutfitFont.className} h-12 w-full lg:max-w-[calc(100%-320px)] pt-1 sm:mt-[-49px]  z-[10] bg-[#F1EFE7]  fixed 
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
          <div className="text-xl font-medium pl-2 xl:p-0">{name}</div>
        </div>
      </div>
    </>
  );
};

export default Header;
