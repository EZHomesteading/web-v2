import { IoMdNotificationsOutline } from "react-icons/io";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { getStatusText } from "@/app/components/icons/notification-order-status";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { navBuyOrder, navSellOrder } from "@/next-auth";
import { formatDistanceToNow } from "date-fns";
import { FaComment } from "react-icons/fa";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["200"],
});

interface Props {
  bOrders: navBuyOrder[];
  sOrders: navSellOrder[];
}

const NotificationIcon = ({ bOrders, sOrders }: Props) => {
  const notifications: {
    text: string;
    conversationId: string;
    updatedAt: string;
  }[] = [];

  if (bOrders) {
    bOrders.forEach((order: any) => {
      const statusText = getStatusText(
        order.status,
        false,
        order.seller?.name,
        order.buyer?.name
      );
      if (statusText !== "") {
        notifications.push({
          text: statusText,
          conversationId: order.conversationId,
          updatedAt: order.updatedAt,
        });
      }
    });
  }

  if (sOrders) {
    sOrders.forEach((order: any) => {
      const statusText = getStatusText(
        order.status,
        true,
        order.seller?.name,
        order.buyer?.name
      );
      if (statusText !== "") {
        notifications.push({
          text: statusText,
          conversationId: order.conversationId,
          updatedAt: order.updatedAt,
        });
      }
    });
  }

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      <Sheet>
        <SheetTrigger className="cursor-pointer">
          <div className="relative">
            <IoMdNotificationsOutline className="h-10 w-9 text-neutral-300" />
            <div className="absolute top-[1px] right-0 text-green bg-red-600 rounded-full w-5 p-[1px] text-xs">
              {notifications.length}
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="pt-12 bg-slate-500 opacity-border-none justify-start flex flex-col gap-y-1 border-none overflow-y-auto">
          {notifications.map((notification, index) => (
            <Link
              key={index}
              className="relative hover:opacity-60"
              href={`/chat/${notification.conversationId}`}
            >
              <SheetTrigger
                className={`${outfit.className} border-neutral-200 border-b-[1px] min-w-full`}
              >
                <div className="relative">
                  <div className="flex justify-start items-center text-start text-white bg-slate-500 pl-2 py-3">
                    <FaComment className="h-6 w-6 mr-2 text-slate-200 flex-shrink-0" />
                    <div>
                      <span className="absolute top-0 right-2 text-xs text-gray-200">
                        {formatDistanceToNow(new Date(notification.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {notification.text}
                    </div>
                  </div>
                </div>
              </SheetTrigger>
            </Link>
          ))}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NotificationIcon;
