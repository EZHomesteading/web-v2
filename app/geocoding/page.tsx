"use client";

import { useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

export default function Page() {
  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
        <Geocoding />
      </APIProvider>
    </>
  );
}

function Geocoding() {
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder>();
  const [geocodingResult, setGeocodingResult] =
    useState<google.maps.GeocoderResult>();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!geocodingApiLoaded) return;
    setGeocodingService(new window.google.maps.Geocoder());
  }, [geocodingApiLoaded]);

  useEffect(() => {
    if (!geocodingService || !address) return;
    geocodingService.geocode({ address }, (results, status) => {
      if (results && status === "OK") {
        // console.log(address);
        setGeocodingResult(results[0]);
      }
    });
  }, [geocodingService, address]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(
            "1080 stoneham st superior colorado"
            // `${position.coords.latitude}, ${position.coords.longitude}`
          );
        },
        (error) => {
          console.error("couldn't get location", error);
        }
      );
    } else {
      console.error("geolocate not supported by browser");
    }
  }, []);

  if (!geocodingService) return <div>Loading...</div>;
  if (!geocodingResult) return <div>Geocoding...</div>;
  return (
    <>
      <h1>{geocodingResult.formatted_address}</h1>
      <p>Latitude: {geocodingResult.geometry.location.lat()}</p>
      <p>Longitude: {geocodingResult.geometry.location.lng()}</p>
    </>
  );
}
