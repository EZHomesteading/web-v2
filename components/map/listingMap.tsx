"use client";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface UpdateUserProps {
  user?: any | null;
  city: string;
  state: string;
  street: string;
}

const MapTester: React.FC<UpdateUserProps> = ({ city, state, street }) => {
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
          setGeocodingResult(results[0]);
        }
      });
    }, [geocodingService, address]);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (city) {
              setAddress(street + city + state);
              setZoom(12);
            } else {
              setAddress("Norfolk, VA");
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
        version: "weekly",
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
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
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
        anchor: new google.maps.Point(65, 45),
        scaledSize: new google.maps.Size(75, 75),
      };
      const marker = new google.maps.Marker({
        map,
        position: position,
        icon: image,
        label: "",
      });
    };

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
        className="rounded-xl overflow-hidden mb-5"
        style={{ height: "200px" }}
        ref={mapRef}
      ></div>
    </>
  );
};

export default MapTester;
