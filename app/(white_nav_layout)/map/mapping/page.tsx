// app/(white_nav_layout)/route-optimizer/page.tsx
import { getNavUser } from "@/actions/getUser";
import { UserRole } from "@prisma/client";
import type { Viewport } from "next";
import RouteOptimizer from "./route-optimizer";
import { Card } from "@/components/ui/card";
import { outfitFont } from "@/components/fonts";

// Define hardcoded locations around Smithfield, VA
const SMITHFIELD_LOCATIONS = [
  {
    id: "smithfield-foods-hq",
    coordinates: {
      lat: 36.9822,
      lng: -76.6307,
    },
    name: "Smithfield Foods Headquarters",
    address: ["200 Commerce St", "Smithfield", "VA", "23430"],
    hours: {
      delivery: [
        {
          date: new Date().toISOString(),
          timeSlots: [
            {
              open: 540, // 9:00 AM in minutes
              close: 1020, // 5:00 PM in minutes
            },
          ],
        },
      ],
    },
  },
  {
    id: "taste-of-smithfield",
    coordinates: {
      lat: 36.9824,
      lng: -76.6319,
    },
    name: "Taste of Smithfield",
    address: ["217 Main St", "Smithfield", "VA", "23430"],
    hours: {
      delivery: [
        {
          date: new Date().toISOString(),
          timeSlots: [
            {
              open: 600, // 10:00 AM in minutes
              close: 960, // 4:00 PM in minutes
            },
          ],
        },
      ],
    },
  },
  {
    id: "surry",
    coordinates: {
      lat: 37.1065,
      lng: -76.7564,
    },
    name: "Surry Location",
    address: ["35 Bank St", "Surry", "VA", "23883"],
    hours: {
      delivery: [
        {
          date: new Date().toISOString(),
          timeSlots: [
            {
              open: 660, // 11:00 AM in minutes
              close: 1320, // 10:00 PM in minutes
            },
          ],
        },
      ],
    },
  },
  {
    id: "chantilly",
    coordinates: {
      lat: 38.8883,
      lng: -77.4324,
    },
    name: "Chantilly Location",
    address: ["4080 Lafayette Center Dr", "Chantilly", "VA", "20151"],
    hours: {
      delivery: [
        {
          date: new Date().toISOString(),
          timeSlots: [
            {
              open: 660, // 11:00 AM in minutes
              close: 1380, // 11:00 PM in minutes
            },
          ],
        },
      ],
    },
  },
];

export const viewport: Viewport = {
  themeColor: "white",
};

export const metadata = {
  title: "Route Optimizer | Smithfield Delivery Routes",
  description:
    "Optimize your delivery route across Smithfield, Virginia locations",
};

const RouteOptimizerPage = async () => {
  const map_api_key = process.env.MAPS_KEY as string;
  const user = await getNavUser();

  // Default center point of Smithfield, VA
  const defaultLocation = { lat: 36.9823, lng: -76.631 };

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

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
      <RouteOptimizer
        locations={SMITHFIELD_LOCATIONS}
        googleMapsApiKey={map_api_key}
        initialLocation={defaultLocation}
        userRole={user.role}
      />
    </div>
  );
};

export default RouteOptimizerPage;
