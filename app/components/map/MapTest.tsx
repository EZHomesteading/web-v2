"use client";

import { SafeUser } from "@/app/types";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface UpdateUserProps {
  currentUser?: SafeUser | null;
}

const MapTester: React.FC<UpdateUserProps> = ({ currentUser }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  console.log(currentUser?.zip);
  useEffect(() => {
    const initMap = async () => {
      console.log("map init");
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly", //How often map updates
      });
      const { Map } = await loader.importLibrary("maps");
      const position = {
        lat: 36.8508,
        lng: -76.2859,
      };
      //map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 10,
        mapId: "MY_NEXTJS_MAPID",
      };
      //map setup
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    };
    initMap();
  }, []);

  return (
    <>
      <div
        className="mx-auto"
        style={{ height: "600px", width: "600px" }}
        ref={mapRef}
      ></div>
    </>
  );
};

export default MapTester;
