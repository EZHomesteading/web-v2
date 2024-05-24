"use client";

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useRef } from "react";
import Loading from "@/app/components/secondary-loader";

interface MapProps {
  center: any;
}

const Map = ({ center }: MapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: ["drawing", "geometry"],
    version: "3.55",
  });

  const mapOptions: google.maps.MapOptions = {
    center: center,
    zoom: 12,
    mapId: "86bd900426b98c0a",
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    keyboardShortcuts: false,
    clickableIcons: true,
    disableDefaultUI: true,
    maxZoom: 13,
    scrollwheel: true,
    minZoom: 4,
    gestureHandling: "greedy",
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <GoogleMap
      onLoad={(map) => {
        mapRef.current = map;
      }}
      mapContainerClassName="h-[calc(20vh-64px)] w-full"
      options={mapOptions}
    >
      <MarkerF
        position={center}
        icon={{
          url: "https://i.ibb.co/TMnKw45/circle-2.png",
          scaledSize: new window.google.maps.Size(28, 28),
          anchor: new window.google.maps.Point(25, 22),
        }}
      />
    </GoogleMap>
  );
};

export default Map;
