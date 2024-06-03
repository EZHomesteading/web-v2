//buy history page
import { currentUser } from "@/lib/auth";
import { getUserWithBuyOrders } from "@/actions/getUser";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import Image from "next/image";
import { getUserById } from "@/actions/getUser";
import { SafeListing } from "@/types";
import { GetListingsByIds } from "@/actions/getListings";
import { getStatusText } from "@/app/dashboard/order-status";
import { UserRole } from "@prisma/client";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Page = async () => {
  let user = await currentUser();
  const buyer = await getUserWithBuyOrders({ userId: user?.id });

  const renderedCards = await Promise.all(
    buyer?.buyerOrders
      .filter(
        (order) =>
          order.status >= 17 || order.status === 9 || order.status === 0
      )
      .map(async (order) => {
        const listingPromises = order.listingIds.map((id) =>
          GetListingsByIds({ listingIds: [id] })
        );
        const listings = await Promise.all(listingPromises).then((results) =>
          results.flat()
        );

        const seller = await getUserById({ userId: order.sellerId });
        const statusText = getStatusText(
          order.status,
          false,
          buyer?.name || "(Deleted User)",
          seller?.name || "(Deleted User)"
        );
        const metadata = {
          title: `${user?.name} Buy Order History | EZHomesteading`,
          description: "View your buy order history.",
          keywords: [
            "buy",
            "order history",
            "vendor",
            "ezh",
            "ezhomesteading",
            "produce near me",
            "virtual farmer's market",
            "fresh food",
            "local food",
            "organic food",
          ],
          openGraph: {
            title: `${user?.name} Buy Order History | EZHomesteading`,
            description: "Track your ongoing buy orders.",
            url: "https://www.ezhomesteading.com/dashboard/order-history/buy",
            type: "website",
          },
        };

        return (
          <>
            <head>
              <title>{metadata.title}</title>
              <meta name="description" content={metadata.description} />
              <meta name="keywords" content={metadata.keywords.join(", ")} />
              <meta property="og:title" content={metadata.openGraph.title} />
              <meta
                property="og:description"
                content={metadata.openGraph.description}
              />
              <meta property="og:url" content={metadata.openGraph.url} />
              <meta property="og:type" content={metadata.openGraph.type} />
            </head>
            <Card key={order.id} className="sheet shadow-lg mb-4">
              <CardHeader className="text-xl sm:text-2xl lg:text-3xl py-3 border-b-[1px] border-gray-100 relative">
                {seller?.name}
                <Link
                  href={`/chat/${order.conversationId}`}
                  className="absolute top-2 lg:top-0 right-2 "
                >
                  <Button className="text-xs py-1 px-2  bg-slate-600 rounded-full">
                    Go to Conversation
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col pt-1 pb-1 text-xs sm:text-md lg:text-lg">
                {listings.flatMap((listing: SafeListing) => {
                  const quantities = JSON.parse(order.quantity);
                  const quantityObj = quantities.find(
                    (q: any) => q.id === listing.id
                  );
                  const quantity = quantityObj ? quantityObj.quantity : 0;

                  return (
                    <div
                      key={listing.id}
                      className="flex flex-row items-center gap-2"
                    >
                      <Image
                        src={listing.imageSrc[0]}
                        alt={listing.title}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover aspect-square"
                      />
                      <p>
                        {quantity} {listing.quantityType} of {listing.title}{" "}
                      </p>
                    </div>
                  );
                })}
                <div>Order Total: {formatPrice(order.totalPrice)}</div>
                <div>Current Pick Up Date: {formatTime(order.pickupDate)}</div>
              </CardContent>
              <div className="justify-start md:justify-between m-0 p-0 pt-2 border-t-[1px] border-gray-100 px-6 py-1 flex flex-col md:flex-row  items-start">
                Status changed{" "}
                {formatDistanceToNow(new Date(order.updatedAt), {
                  addSuffix: true,
                })}
                : {statusText}
              </div>
            </Card>
          </>
        );
      }) || []
  );

  const metadata = {
    title: `${user?.name} Buy Order History | EZHomesteading`,
    description: "View your buy order history.",
    keywords: [
      "buy",
      "order history",
      "vendor",
      "ezh",
      "ezhomesteading",
      "produce near me",
      "virtual farmer's market",
      "fresh food",
      "local food",
      "organic food",
    ],
    openGraph: {
      title: `${user?.name} Buy Order History | EZHomesteading`,
      description: "Track your ongoing buy orders.",
      url: "https://www.ezhomesteading.com/dashboard/order-history/buy",
      type: "website",
    },
  };

  return (
    <>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
      </head>
      <div className="min-h-screen w-full flex flex-col items-start">
        <h1 className="px-2 pb-2 pt-2 lg:pt-14 text-3xl sm:text-5xl">
          Buy Order History
        </h1>{" "}
        {user?.role !== UserRole.CONSUMER && (
          <Link className="px-2 py-4" href="/dashboard/order-history/sell">
            <Button>Go to Sell Order History</Button>
          </Link>
        )}{" "}
        <main className="px-4 md:px-8 w-full md:w-2/3 xl:w-1/2">
          {renderedCards}
        </main>
      </div>
    </>
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
