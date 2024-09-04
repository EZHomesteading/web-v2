"use client";
//header component for chat pages, simply displays some information about the chat.

import Link from "next/link";
import useOtherUser from "@/hooks/messenger/useOtherUser";
import { HiChevronLeft } from "react-icons/hi";
import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import { Order, Reviews } from "@prisma/client";
// import { Button } from "@/app/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/app/components/ui/popover";
// import { IoMapOutline, IoStorefrontOutline } from "react-icons/io5";
// import ReactStars from "react-stars";
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
  // function getAverageRating(reviews: Reviews[]) {
  //   if (reviews.length === 0) return 0;

  //   const totalRatings = reviews.reduce(
  //     (sum, review) => sum + review.rating,
  //     0
  //   );
  //   const averageRating = totalRatings / reviews.length;
  //   return Math.round(averageRating * 2) / 2;
  // }
  // const avgRate = getAverageRating(reviews);
  return (
    <>
      <div
        className={`${outfit.className} w-full 
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
        {/* <div className="flex flex-row items-center justify-between gap-x-4">
          <Popover>
            {/* <PopoverTrigger className="flex items-center border rounded-md shadow-sm px-2 py-2 bg-details"> */}
        {/* <PopoverTrigger>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-chat shadow-sm mt-2 flex flex-col w-[200px] space-y-2 mr-5 sm:mt-[.4rem] sm:mr-6 !text-black">
              {otherUser.id === order.sellerId ? (
                <>
                  <Button
                    onClick={() => router.push(`/store/${otherUser.url}`)}
                    className={`${outfit.className} bg-inherit shadow-sm flex justify-start gap-x-2 items-center text-black hover:text-white bg-slate-400 font-light`}
                  >
                    <IoStorefrontOutline />
                    <div className="b">Visit Store</div>
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        `http://maps.apple.com/?q=${order.location.coordinates[1]},${order.location.coordinates[0]}`,
                        "_ blank"
                      )
                    }
                    className={`bg-inherit shadow-sm flex justify-start gap-x-2 items-center text-black bg-slate-400 hover:text-white ${outfit.className} font-light`}
                  >
                    <IoMapOutline />
                    <div className="">Get Directions</div>
                  </Button>
                </>
              ) : (
                <button
                  className="
        flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
                  onClick={() => router.push(`/profile/${otherUser.id}`)}
                  title="View reviews of this buyer"
                >
                  <ReactStars
                    count={1}
                    size={20}
                    color2={"#000"}
                    value={1}
                    half={false}
                    edit={false}
                  />
                  {avgRate === 0 ? "New" : avgRate}
                </button>
              )}
            </PopoverContent>
          </Popover>
        </div> */}
      </div>
    </>
  );
};

export default Header;
