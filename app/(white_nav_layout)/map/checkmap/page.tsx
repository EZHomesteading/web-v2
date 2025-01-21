import { getNavUser } from "@/actions/getUser";
import { Location, Order, UserRole } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { outfitFont } from "@/components/fonts";
import { getActivePickupOrders } from "@/actions/getOrdersMap";
import LocationProvider from "./location-provider";

export type OrderMap = {
  id: string;
  pickupDate: Date | null;
  location: {
    displayName: string;
    coordinates: number[];
    address: string[];
  };
};

const RouteOptimizerPage = async () => {
  const map_api_key = process.env.MAPS_KEY as string;
  const user = await getNavUser();

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

  // Fetch active pickup orders for the current user
  const { orders } = await getActivePickupOrders(user.id);

  // Get default location from user's first location
  let defaultLocation = { lat: 37.0345267, lng: -76.6381116 }; // Fallback location

  if (user.locations && user.locations.length > 0) {
    const firstLocation = user.locations[0];
    defaultLocation = {
      lat: firstLocation.coordinates[1], // coordinates are [lng, lat]
      lng: firstLocation.coordinates[0],
    };
  }

  return (
    <LocationProvider
      orders={orders}
      googleMapsApiKey={map_api_key}
      defaultLocation={defaultLocation}
    />
  );
};

export default RouteOptimizerPage;
