"use client";

import { useEffect } from "react";
import { useCurrentLocation } from "@/hooks/use-Current-Location";
import RouteOptimizer from "./route-optimizer";
import { OrderMap } from "./page";

type LocationProviderProps = {
  orders: OrderMap[];
  googleMapsApiKey: string;
  startLoc: number[];
  endLoc: number[];
};

export default function LocationProvider({
  orders,
  googleMapsApiKey,
  startLoc,
  endLoc,
}: LocationProviderProps) {
  const { location, error, loading } = useCurrentLocation();
  const locationAsCoord = location ? [location?.lat, location?.lng] : null;
  const initialLocation = locationAsCoord ? locationAsCoord : startLoc;

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
      <RouteOptimizer
        orders={orders}
        googleMapsApiKey={googleMapsApiKey}
        startLoc={initialLocation}
        endLoc={endLoc}
      />
    </div>
  );
}
