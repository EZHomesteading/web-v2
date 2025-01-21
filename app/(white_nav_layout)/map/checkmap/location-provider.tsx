"use client";

import { useEffect } from "react";
import { useCurrentLocation } from "@/hooks/use-Current-Location";
import RouteOptimizer from "./route-optimizer";
import { OrderMap } from "./page";

type LocationProviderProps = {
  orders: OrderMap[];
  googleMapsApiKey: string;
  defaultLocation: { lat: number; lng: number };
};

export default function LocationProvider({
  orders,
  googleMapsApiKey,
  defaultLocation,
}: LocationProviderProps) {
  const { location, error, loading } = useCurrentLocation();

  const initialLocation = location || defaultLocation;

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
      <RouteOptimizer
        orders={orders}
        googleMapsApiKey={googleMapsApiKey}
        initialLocation={initialLocation}
      />
    </div>
  );
}
