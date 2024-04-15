"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import circle from "@/public/images/circle.png";
interface MapProps {
  coopCoordinates: { lat: number; lng: number }[];
  producerCoordinates: { lat: number; lng: number }[];
  userCoordinates: { lat: number; lng: number } | null;
}

const ListingsMap = ({
  producerCoordinates,
  coopCoordinates,
  userCoordinates,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async (zoom: number) => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");
      let userPosition: { lat: number; lng: number };
      if (userCoordinates) {
        userPosition = {
          lat: userCoordinates.lat,
          lng: userCoordinates.lng,
        };
      } else {
        userPosition = {
          lat: 36.8508,
          lng: -76.2859,
        };
      }

      const mapOptions: google.maps.MapOptions = {
        center: userPosition,
        zoom: 11,
        mapId: "c3c8ac3d22ecf356",
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
        clickableIcons: true,
        disableDefaultUI: true,
        maxZoom: 16,
        minZoom: 5,
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      //   map.setOptions({
      //     disableDoubleClickZoom: true,
      //   });
      producerCoordinates.forEach((coordinate) => {
        const position = {
          lat: coordinate.lat,
          lng: coordinate.lng,
        };
        const xSkew = Math.random() * 1 - 0.2;
        const ySkew = Math.random() * 1 - 0.2;
        var image = {
          url: "https://i.ibb.co/TMnKw45/circle-2.png",
          size: new google.maps.Size(200, 200),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(10 + xSkew, 10 + ySkew),
          scaledSize: new google.maps.Size(30, 30),
        };

        const marker = new google.maps.Marker({
          map,
          position: position,
          icon: image,
          label: "",
        });
      });
      coopCoordinates.forEach((coordinate) => {
        const position = {
          lat: coordinate.lat,
          lng: coordinate.lng,
        };
        const xSkew = Math.random() * 1 - 0.2;
        const ySkew = Math.random() * 1 - 0.2;
        var image = {
          url: "https://i.ibb.co/qyq0dhb/circle.png",
          size: new google.maps.Size(200, 200),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(10 + xSkew, 10 + ySkew),
          scaledSize: new google.maps.Size(30, 30),
        };

        const marker = new google.maps.Marker({
          map,
          position: position,
          icon: image,
          label: "",
        });
      });
    };
    initMap(11);
  }, [producerCoordinates, coopCoordinates, userCoordinates]);

  return (
    <>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
      ></APIProvider>
      <div className="rounded-xl mb-5 h-screen" ref={mapRef}></div>
    </>
  );
};

export default ListingsMap;
