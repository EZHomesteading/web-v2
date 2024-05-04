import { IoMdNotificationsOutline } from "react-icons/io";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { getStatusText } from "@/app/components/notification-order-status";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { navBuyOrder, navSellOrder } from "@/next-auth";
import { formatDistanceToNow } from "date-fns";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["200"],
});
interface Props {
  bOrders: navBuyOrder[];
  sOrders: navSellOrder[];
}

const NotificationIcon = async ({ bOrders, sOrders }: Props) => {
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
            <IoMdNotificationsOutline className="h-9 w-9 " />
            <div className="absolute top-[1px] right-0 text-green bg-red-600 rounded-full w-5 p-[1px] text-xs">
              {notifications.length}
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="pt-12 bg-black border-none justify-start flex flex-col px-2 gap-y-2">
          {notifications.map((notification, index) => (
            <Link
              key={index}
              className="relative"
              href={`/chat/${notification.conversationId}`}
            >
              <SheetTrigger
                className={`${outfit.className} shadow-xl px-2 pt-5 pb-2 min-w-full rounded-lg text-white bg-slate-500 hover:bg-slate-800`}
              >
                <span className="absolute top-1 right-2 text-xs text-white">
                  {formatDistanceToNow(new Date(notification.updatedAt), {
                    addSuffix: true,
                  })}
                </span>

                <div className="flex justify-start text-white">
                  {notification.text}
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
