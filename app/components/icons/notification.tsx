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
        <SheetContent className="pt-12 bg-neutral-400 border-none justify-start flex flex-col px-2 gap-y-2">
          {notifications.map((notification, index) => (
            <Link
              key={index}
              className="relative"
              href={`/chat/${notification.conversationId}`}
            >
              <SheetTrigger
                className={`${outfit.className} px-2 py-5 pb-2 min-w-full`}
              >
                <span className="absolute top-0 right-2 text-xs text-black">
                  {formatDistanceToNow(new Date(notification.updatedAt), {
                    addSuffix: true,
                  })}
                </span>

                <div className="flex justify-start items-start text-start text-white notification-bubble">
                  {notification.text}
                </div>
              </SheetTrigger>
            </Link>
          ))}
        </SheetContent>
      </Sheet>
      <style jsx>{`
        .notification-bubble {
          position: relative;
          background-color: #4a5568;
          border-radius: 20px;
          padding: 10px 20px;
          margin-bottom: 10px;
        }
        .notification-bubble:hover {
          box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1),
            0 2px 4px rgba(0, 0, 0, 0.06);
          scale: 1.003;
        }
        .notification-bubble::after {
          content: "";
          position: absolute;
          bottom: 5px;
          right: 15px;
          transform: translateY(50%) rotate(45deg);
          width: 15px;
          height: 15px;
          background-color: #4a5568;
        }
      `}</style>
    </>
  );
};

export default NotificationIcon;
