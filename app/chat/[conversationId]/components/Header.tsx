"use client";
//header component for chat pages, simply displays some information about the chat.
import { HiChevronLeft } from "react-icons/hi";
import Link from "next/link";
import useOtherUser from "@/hooks/messenger/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { FullConversationType } from "@/types";
import { useRouter } from "next/navigation";
import { Order, Reviews } from "@prisma/client";
import Button from "@/app/components/modals/chatmodals/Button";
import ReactStars from "react-stars";

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
  function getAverageRating(reviews: Reviews[]) {
    if (reviews.length === 0) return 0;

    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRatings / reviews.length;
    return Math.round(averageRating * 2) / 2;
  }
  const avgRate = getAverageRating(reviews);
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
          <div className="flex flex-row items-start gap-x-4">
            <div className="flex-shrink-0">
              <Avatar image={otherUser.image} />
            </div>
            <div className="flex flex-col flex-grow">
              <div className="text-xl font-semibold mb-2">
                {conversation.name || otherUser.name}
              </div>
              {otherUser.id === order.sellerId ? (
                <div className="flex flex-row justify-between w-full">
                  <button
                    onClick={() => router.push(`/store/${otherUser.url}`)}
                    className=" flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600 mr-2"
                  >
                    Go to Store
                  </button>
                  <Button
                    onClick={() =>
                      window.open(
                        `http://maps.apple.com/?q=${order.location.coordinates[1]},${order.location.coordinates[0]}`,
                        "_ blank"
                      )
                    }
                  >
                    Get Directions
                  </Button>
                </div>
              ) : (
                <button
                  className="
        flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
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
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Header;
