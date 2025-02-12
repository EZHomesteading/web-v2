import { getNavUser } from "@/actions/getUser";
import { Location, Order, UserRole } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { OutfitFont } from "@/components/fonts";
import { getActivePickupOrders } from "@/actions/getOrdersMap";
import LocationProvider from "./location-provider";

export type OrderMap = {
  id: string;
  pickupDate: Date;
  name: string | undefined;
  location: {
    displayName: string;
    coordinates: number[];
    address: string[];
  };
};

import { redirect } from "next/navigation";
import { getOrderGroupWithOrders } from "@/actions/gerOrderGroupOrders";

const RouteOptimizerPage = async ({
  searchParams,
}: {
  searchParams: { orderGroupId?: string };
}) => {
  if (!searchParams.orderGroupId) {
    redirect("/dashboard");
  }
  const { orderGroupId } = searchParams;
  if (!orderGroupId) {
    redirect("/dashboard");
  }

  const user = await getNavUser();
  if (!user) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h1 className={`${OutfitFont.className} text-xl font-semibold mb-4`}>
            Authentication Required
          </h1>
          <p className={OutfitFont.className}>
            Please log in to use the route optimizer.
          </p>
        </Card>
      </div>
    );
  }

  const { orders, startLoc, endLoc } = await getOrderGroupWithOrders(
    searchParams.orderGroupId
  );
  if (!orders.length) {
    redirect("/dashboard");
  }
  let defaultLocation = { lat: 37.0345267, lng: -76.6381116 };
  if (user.locations?.length > 0) {
    const firstLocation = user.locations[0];
    defaultLocation = {
      lat: firstLocation.coordinates[1],
      lng: firstLocation.coordinates[0],
    };
  }
  const apiKey = process.env.MAPS_KEY as string;
  return (
    <LocationProvider
      orders={orders}
      googleMapsApiKey={apiKey}
      startLoc={startLoc}
      endLoc={endLoc}
    />
  );
};

export default RouteOptimizerPage;
