// pseudocode
// import current user
// convert current user's location info to lat, lng
// pass into lat, lng in position const
// create marker for user
// if no user, dead center of virginia

"use client";

import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { SafeUser } from "@/app/types";
import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface UpdateUserProps {
  currentUser?: SafeUser | null;
}

const MapTester: React.FC<UpdateUserProps> = ({ currentUser }) => {
  console.log(currentUser?.zip);
  const mapRef = React.useRef<HTMLDivElement>(null);

  function Geocoding() {
    const geocodingApiLoaded = useMapsLibrary("geocoding");
    const [geocodingService, setGeocodingService] =
      useState<google.maps.Geocoder>();
    const [geocodingResult, setGeocodingResult] =
      useState<google.maps.GeocoderResult>();
    const [address, setAddress] = useState("");
    const [zoom, setZoom] = useState(4);

    useEffect(() => {
      if (!geocodingApiLoaded) return;
      setGeocodingService(new window.google.maps.Geocoder());
    }, [geocodingApiLoaded]);

    useEffect(() => {
      if (!geocodingService || !address) return;
      geocodingService.geocode({ address }, (results, status) => {
        if (results && status === "OK") {
          console.log(address);
          setGeocodingResult(results[0]);
        }
      });
    }, [geocodingService, address]);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (currentUser?.street) {
              setAddress(
                currentUser?.street
                // `${position.coords.latitude}, ${position.coords.longitude}`
              );
              setZoom(10);
            } else {
              setAddress("ballaire kansas");
            }
          },
          (error) => {
            console.error("couldn't get location", error);
          }
        );
      } else {
        console.error("geolocate not supported by browser");
      }
    }, []);

    const initMap = async (
      geocodingResult: google.maps.GeocoderResult,
      zoom: number
    ) => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly", //How often map updates
      });
      const { Map } = await loader.importLibrary("maps");
      const position = {
        lat: geocodingResult.geometry.location.lat(),
        lng: geocodingResult.geometry.location.lng(),
      };
      //map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: zoom,
        mapId: "MY_NEXTJS_MAPID",
      };
      //map setup
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
    };

    if (!geocodingService) return <div>Loading...</div>;
    if (!geocodingResult) return <div>Geocoding...</div>;
    if (geocodingResult) {
      initMap(geocodingResult, zoom);
    }
    return (
      <>
        {/* <h1>{geocodingResult.formatted_address}</h1>
        <p>Latitude: {geocodingResult.geometry.location.lat()}</p>
        <p>Longitude: {geocodingResult.geometry.location.lng()}</p> */}
      </>
    );
  }

  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
        <Geocoding />
      </APIProvider>
      <div
        className="mx-auto"
        style={{ height: "600px", width: "600px" }}
        ref={mapRef}
      ></div>
    </>
  );
};

export default MapTester;
