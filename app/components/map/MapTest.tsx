// pseudocode
// import current user
// convert current user's location info to lat, lng
// pass into lat, lng in position const
// create marker for user
// if no user, dead center of virginia

"use client";

import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
export function MapTest() {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
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
}
