"use client";
//map component for listing pages. displays single circle roughly around the sellers location
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/next-auth";

interface MapProps {
  location: Location | null;
}

const ListingMap = ({ location }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  function Geocoding() {
    const initMap = async (zoom: number) => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");

      let position;

      if (location) {
        position = {
          lat: location?.coordinates[1],
          lng: location?.coordinates[0],
        };
      }

      const mapOptions: google.maps.MapOptions = {
        center: position,
        mapId: "86bd900426b98c0a",
        zoom: zoom,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: "none",
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      map.setOptions({
        scrollwheel: false,
        disableDoubleClickZoom: true,
      });

      const xSkew = Math.random() * 20 - 10;
      const ySkew = Math.random() * 20 - 10;

      var image = {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Red_circle_frame_transparent.svg/1200px-Red_circle_frame_transparent.svg.png",
        size: new google.maps.Size(200, 200),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(40 + xSkew, 30 + ySkew),
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
