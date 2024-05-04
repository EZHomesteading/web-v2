import { IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { getStatusText } from "@/app/components/notification-order-status";
import Link from "next/link";
import { Outfit } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["200"],
});
interface Props {
  user?: any;
}

const NotificationIcon = async ({ user }: Props) => {
  const notifications: { text: string; conversationId: string }[] = [];

  if (user?.buyerOrders) {
    user.buyerOrders.forEach((order: any) => {
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
        });
      }
    });
  }

  if (user?.sellerOrders) {
    user.sellerOrders.forEach((order: any) => {
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
        <SheetContent className="pt-12 sheet justify-start flex flex-col px-2 gap-y-2">
          {notifications.map((notification, index) => (
            <Link key={index} href={`/chat/${notification.conversationId}`}>
              <SheetTrigger>
                <div
                  className={`${outfit.className} shadow-xl px-2 py-2 rounded-xl bg-neutral-800 text-white hover:bg-neutral-500`}
                >
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
