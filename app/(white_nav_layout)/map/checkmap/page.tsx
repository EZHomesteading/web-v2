// app/(white_nav_layout)/route-optimizer/page.tsx
import { getNavUser } from "@/actions/getUser";
import { Location, Order, UserRole } from "@prisma/client";
import type { Viewport } from "next";
import RouteOptimizer from "./route-optimizer";
import { Card } from "@/components/ui/card";
import { outfitFont } from "@/components/fonts";
import { getLocationsById } from "@/actions/getLocations";
export type OrderMap = {
  id: string;
  pickupDate: Date;
  location: { displayName: string; coordinates: number[]; address: string[] };
};
const RouteOptimizerPage = async ({
  searchParams,
}: {
  searchParams: { ids?: string };
}) => {
  const map_api_key = process.env.MAPS_KEY as string;
  const user = await getNavUser();

  // Default center point of Smithfield, VA
  const defaultLocation = { lat: 37.0345267, lng: -76.6381116 };

  if (!user) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h1 className={`${outfitFont.className} text-xl font-semibold mb-4`}>
            Authentication Required
          </h1>
          <p className={outfitFont.className}>
            Please log in to use the route optimizer.
          </p>
        </Card>
      </div>
    );
  }

  // Get location IDs from search params and fetch locations
  const locationIds = [
    "6723a9e068a33d3facaa64ec",
    "673e41f45171bd1ce1271356",
    "67292cfa5f7005d487c47c46",
  ]; //searchParams.ids?.split(",") || [];
  //const { locations } = await getOrdersById(locationIds);
  //console.log(locations[0].hours?.delivery[0].timeSlots[0]);
  // console.log("locations", locations);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const smithdate = new Date(today);
  smithdate.setHours(11, 19, 0);
  const smithdate2 = new Date(today);
  smithdate2.setHours(11, 53, 0);
  const surrydate = new Date(today);
  surrydate.setHours(10, 45, 0);
  const orders: OrderMap[] = [
    {
      id: "smithfield-foods-hq",
      location: {
        coordinates: [-76.630541, 36.984502],
        displayName: "Smithfield Foods Headquarters",
        address: ["200 Commerce St", "Smithfield", "VA", "23430"],
      },
      pickupDate: smithdate,
    },
    {
      id: "taste-of-smithfield",
      location: {
        coordinates: [-76.63274256984961, 36.981172763915765],
        displayName: "Taste of Smithfield",
        address: ["217 Main St", "Smithfield", "VA", "23430"],
      },
      pickupDate: smithdate2,
    },
    {
      id: "surry",
      location: {
        coordinates: [-76.83449623724694, 37.1326022656586],
        displayName: "Surry Location",
        address: ["35 Bank St", "Surry", "VA", "23883"],
      },
      pickupDate: surrydate,
    },
  ];
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
      <RouteOptimizer
        orders={orders}
        googleMapsApiKey={map_api_key}
        initialLocation={defaultLocation}
      />
    </div>
  );
};

export default RouteOptimizerPage;
