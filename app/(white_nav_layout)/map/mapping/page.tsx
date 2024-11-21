// app/(white_nav_layout)/route-optimizer/page.tsx
import { getNavUser } from "@/actions/getUser";
import { UserRole } from "@prisma/client";
import type { Viewport } from "next";
import RouteOptimizer from "./route-optimizer";
import { Card } from "@/components/ui/card";
import { outfitFont } from "@/components/fonts";
import { getLocationsById } from "@/actions/getLocations";

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
  const { locations } = await getLocationsById(locationIds);
  console.log("locations", locations);
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
      <RouteOptimizer
        locations={locations}
        googleMapsApiKey={map_api_key}
        initialLocation={defaultLocation}
        userRole={user.role}
      />
    </div>
  );
};

export default RouteOptimizerPage;
