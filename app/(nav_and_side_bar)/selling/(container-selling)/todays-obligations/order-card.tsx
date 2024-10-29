import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { formatDateTime } from "./order-date-time";
import Image from "next/image";
import { UserRole } from "@prisma/client";

const OrderCard = ({ order, user }: { order: any; user: any }) => {
  const getActionButton = () => {
    if (order.status === 19) {
      return (
        <Link href={`/chat/${order?.conversationId}`} className="w-full">
          <button className="w-full bg-emerald-950/50 text-white py-2 rounded-b-lg hover:bg-emerald-950/70 transition-colors">
            Mark as Delivered
          </button>
        </Link>
      );
    }
    if (order.status === 11) {
      return (
        <Link href={`/chat/${order?.conversationId}`} className="w-full">
          <button className="w-full  text-white py-2 rounded-b-lg bg-emerald-950/50 hover:bg-emerald-950/70 transition-colors">
            Mark as Ready for Pickup
          </button>
        </Link>
      );
    }
    if (order.status === 7) {
      return (
        <Link href={`/chat/${order?.conversationId}`} className="w-full">
          <button className="w-full bg-emerald-950/50 hover:bg-emerald-950/70 text-white py-2 rounded-b-lg  transition-colors">
            Review New Pickup Time
          </button>
        </Link>
      );
    }
    return null;
  };

  const formattedDate = formatDateTime(order.pickupDate, user.role);
  const quantities = JSON.parse(order.quantity || "[]");

  return (
    <Card className="h-full aspect-square sheet border-none shadow-md flex flex-col">
      <CardContent className="flex-grow overflow-y-auto p-2 ">
        {order?.listings?.map((listing: any, index: number) => {
          const quantityObj = quantities.find(
            (q: { id: any }) => q.id === listing.id
          );
          const quantity = quantityObj ? quantityObj.quantity : "N/A";

          return (
            <div
              key={listing.id || index}
              className="flex items-start justify-between mb-2"
            >
              <div className="flex space-x-1">
                <Image
                  src={listing?.imageSrc[0]}
                  alt={`${listing?.title} Image`}
                  height={40}
                  width={40}
                  className="rounded-lg"
                />
                <div>
                  <h3
                    className="font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis "
                    title={listing.title}
                  >
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {quantity} {listing.quantityType}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="mt-2">
          <div className="font-medium">Address</div>
          <div className="font-light">
            {order?.location?.address[0]}, {order?.location?.address[1]},{" "}
            {order?.location?.address[2]}, {order?.location?.address[3]}
          </div>
        </div>
        <div className="mt-2">
          <div className="font-medium">
            Current {user?.role === UserRole.COOP ? "Pickup" : "Delivery"} Date
          </div>
          <div className="font-light">{formattedDate}</div>
        </div>
      </CardContent>
      {getActionButton()}
    </Card>
  );
};

export default OrderCard;
