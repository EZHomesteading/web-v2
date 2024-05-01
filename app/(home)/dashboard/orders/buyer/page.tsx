import { currentUser } from "@/lib/auth";
import getUserWithBuyOrders from "@/actions/user/getUserWithBuyOrders";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import Image from "next/image";
import getUserById from "@/actions/user/getUserById";
import { SafeListing } from "@/types";
import GetListingsByListingIds from "@/actions/listing/getListingsByListingIds";
import { getStatusText } from "@/app/components/order-status";
import { UserRole } from "@prisma/client";
const Page = async () => {
  let user = await currentUser();
  const buyer = await getUserWithBuyOrders({ userId: user?.id });

  return (
    <div className="h-screen">
      <main className="flex flex-col items-start justify-start">
        <h1 className="px-2 py-4 text-lg lg:text-4xl">Buy Orders</h1>{" "}
        {buyer?.buyerOrders
          .filter((order) => order.status !== 0)
          .map(async (order) => {
            const listings = await GetListingsByListingIds({
              listingIds: order.listingIds,
            });
            const seller = await getUserById({ userId: order.sellerId });
            return (
              <Card key={order.id}>
                <CardHeader>{buyer?.name}</CardHeader>{" "}
                <CardContent className="flex flex-col">
                  {listings.map(async (listing: SafeListing) => {
                    return (
                      <div
                        key={listing.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <Image
                          width={80}
                          height={80}
                          src={listing.imageSrc}
                          alt={listing.title}
                        />
                        <p>
                          {listing.quantityType} of {listing.title}{" "}
                        </p>
                      </div>
                    );
                  })}
                  <div>Order Total: ${order.totalPrice}</div>{" "}
                  <div>Pick Up Date: {formatTime(order.pickupDate)}</div>{" "}
                  <div>
                    {" "}
                    Status:{" "}
                    {getStatusText(
                      order.status,
                      buyer?.name || "",
                      seller?.name || "",

                      buyer?.role === UserRole.COOP
                        ? UserRole.COOP
                        : UserRole.CONSUMER
                    )}
                  </div>{" "}
                </CardContent>{" "}
              </Card>
            );
          })}{" "}
      </main>{" "}
    </div>
  );
};
export default Page;

const getOrdinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatTime = (timeString: Date) => {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const ordinalSuffix = getOrdinalSuffix(day);

  return `${formattedHours}:${formattedMinutes}${ampm} on ${month} ${day}${ordinalSuffix}`;
};
