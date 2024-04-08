"use client";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { use, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  location: any;
}

const ListingMap = ({ location }: MapProps) => {
  console.log(location.coordinates);
  const mapRef = React.useRef<HTMLDivElement>(null);

  function Geocoding() {
    const initMap = async (zoom: number) => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");

      const position = {
        lat: location.coordinates[1],
        lng: location.coordinates[0],
      };
      console.log(position);

      //map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: zoom,
        mapId: "MY_NEXTJS_MAPID",
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: "none",
      };
      //map setup
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      map.setOptions({
        scrollwheel: false,
        disableDoubleClickZoom: true,
      });
      var image = {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Red_circle_frame_transparent.svg/1200px-Red_circle_frame_transparent.svg.png",
        size: new google.maps.Size(200, 200),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(40, 30),
        scaledSize: new google.maps.Size(50, 50),
      };
      const marker = new google.maps.Marker({
        map,
        position: position,
        icon: image,
        label: "",
      });
    };

    initMap(11);

    return null;
  }

  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
        <Geocoding />
      </APIProvider>
      <div
        className="rounded-xl overflow-hidden mb-5"
        style={{ height: "200px" }}
        ref={mapRef}
      ></div>
    </>
  );
};

export default ListingMap;
