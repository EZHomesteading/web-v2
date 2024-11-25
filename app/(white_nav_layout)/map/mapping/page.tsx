// app/(white_nav_layout)/route-optimizer/page.tsx
import { getNavUser } from "@/actions/getUser";
import { Location, UserRole } from "@prisma/client";
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
  // const { locations } = await getLocationsById(locationIds);
  // console.log("locations", locations);
  const locations: Location[] = [
    {
      id: "smithfield-foods-hq",
      userId: "default-user",
      coordinates: [-76.630541, 36.984502],
      displayName: "Smithfield Foods Headquarters",
      type: "business",
      address: ["200 Commerce St", "Smithfield", "VA", "23430"],
      role: "USER" as UserRole,
      SODT: null,
      bio: null,
      image: null,
      isDefault: false,
      showPreciseLocation: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      hours: {
        pickup: [
          {
            date: new Date(),
            capacity: 0,
            timeSlots: [
              {
                open: 540,
                close: 1020,
              },
            ],
          },
        ],
        delivery: [
          {
            date: new Date(),
            capacity: 0,
            timeSlots: [
              {
                open: 540, // 9:00 AM in minutes
                close: 1920, // 5:00 PM in minutes
              },
            ],
          },
        ],
      },
    },
    {
      id: "taste-of-smithfield",
      userId: "default-user",
      coordinates: [-76.63274256984961, 36.981172763915765],
      displayName: "Taste of Smithfield",
      type: "business",
      address: ["217 Main St", "Smithfield", "VA", "23430"],
      role: "USER" as UserRole,
      SODT: null,
      bio: null,
      image: null,
      isDefault: false,
      showPreciseLocation: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      hours: {
        pickup: [
          {
            date: new Date(),
            capacity: 0,
            timeSlots: [
              {
                open: 600, // 10:00 AM in minutes
                close: 1960, // 4:00 PM in minutes
              },
            ],
          },
        ],
        delivery: [
          {
            date: new Date(),
            capacity: 0,
            timeSlots: [
              {
                open: 600,
                close: 1960,
              },
            ],
          },
        ],
      },
    },
    {
      id: "surry",
      userId: "default-user",
      coordinates: [-76.83449623724694, 37.1326022656586],
      displayName: "Surry Location",
      type: "business",
      address: ["35 Bank St", "Surry", "VA", "23883"],
      role: "USER" as UserRole,
      SODT: null,
      bio: null,
      image: null,
      isDefault: false,
      showPreciseLocation: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      hours: {
        pickup: [
          {
            date: new Date(),
            capacity: 0,
            timeSlots: [
              {
                open: 660,
                close: 1920,
              },
            ],
          },
        ],
        delivery: [
          {
            date: new Date(),
            capacity: 0,
            timeSlots: [
              {
                open: 660, // 11:00 AM in minutes
                close: 1820, // 10:00 PM in minutes
              },
            ],
          },
        ],
      },
    },
  ];
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
