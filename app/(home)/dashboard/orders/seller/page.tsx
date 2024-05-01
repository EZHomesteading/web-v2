import { currentUser } from "@/lib/auth";
import getUserWithSellOrders from "@/actions/user/getUserWithSellOrders";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import Image from "next/image";
import homebg from "@/public/images/product-images/Boysenberry.webp";
import getUserById from "@/actions/user/getUserById";
import { SafeListing } from "@/types";
import GetListingsByListingIds from "@/actions/listing/getListingsByListingIds";
const Page = async () => {
  let user = await currentUser();
  const seller = await getUserWithSellOrders({ userId: user?.id });
  return (
    <div className="h-screen">
      {" "}
      <main className="flex flex-col items-start justify-start">
        {" "}
        <h1 className="px-2 py-4 text-lg lg:text-4xl">Sell Orders</h1>{" "}
        {seller?.sellerOrders.map(async (order) => {
          const listings = await GetListingsByListingIds({
            listingIds: order.listingIds,
          });
          console.log("orders:", order);
          const buyer = await getUserById({ userId: order.userId });
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
                      {" "}
                      <Image
                        width={80}
                        height={80}
                        src={listing.imageSrc}
                        alt={listing.title}
                      />{" "}
                      <p>
                        {" "}
                        {listing.quantityType} of {listing.title}{" "}
                      </p>{" "}
                    </div>
                  );
                })}{" "}
                <div>Order Total: ${order.totalPrice}</div>{" "}
                <div>Pick Up Date: {order.pickupDate.toLocaleDateString()}</div>{" "}
                <div>Status: </div>{" "}
              </CardContent>{" "}
            </Card>
          );
        })}{" "}
      </main>{" "}
    </div>
  );
};
export default Page;
