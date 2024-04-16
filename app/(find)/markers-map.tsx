"use client";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";
import Loading from "@/app/components/secondary-loader";
import { UserRole } from "@prisma/client";

interface MapProps {
  userCoordinates: { lat: number; lng: number } | null;
  coops: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    listingsCount: number;
  }[];
  producers: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    listingsCount: number;
  }[];
}

const ListingsMap = ({ userCoordinates, coops, producers }: MapProps) => {
  const coopInfo = coops?.map((user: any) => ({
    coordinates: {
      lat: user?.location.coordinates[1],
      lng: user?.location.coordinates[0],
    },
    name: user?.name,
    listingsCount: user?.listings.length,
  }));
  console.log(coopInfo);
  const producerInfo = producers?.map((user: any) => ({
    coordinates: {
      lat: user?.location.coordinates[1],
      lng: user?.location.coordinates[0],
    },
    name: user?.name,
    listingsCount: user?.listings.length,
  }));
  console.log(producerInfo);
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });

  const mapOptions: google.maps.MapOptions = {
    center: { lat: 36.8508, lng: -76.2859 },
    zoom: 11,
    mapId: "c3c8ac3d22ecf406",
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
  };

  const handleMarkerClick = (coordinate: { lat: number; lng: number }) => {
    setSelectedMarker(coordinate);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <GoogleMap mapContainerClassName="h-screen" options={mapOptions}>
      {producerInfo.map((producer, index) => {
        // const xSkew = Math.random() * 10 - 5;
        // const ySkew = Math.random() * 10 - 5;
        return (
          <MarkerF
            key={`producer-${index}`}
            position={producer.coordinates}
            icon={{
              url: "https://i.ibb.co/TMnKw45/circle-2.png",
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
            onClick={() => handleMarkerClick(producer.coordinates)}
            label={{
              text: `${producer.listingsCount}`,
            }}
          />
        );
      })}
      {coopInfo.map((coop, index) => {
        console.log("coords:", coop.coordinates);
        // const xSkew = Math.random() * 10 - 5;
        // const ySkew = Math.random() * 10 - 5;
        return (
          <MarkerF
            key={`coop-${index}`}
            position={coop.coordinates}
            icon={{
              url: "https://i.ibb.co/qyq0dhb/circle.png",
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
            label={{
              text: `${coop.listingsCount}`,
            }}
            onClick={() => handleMarkerClick(coop.coordinates)}
          />
        );
      })}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker}
          onCloseClick={handleInfoWindowClose}
        >
          <div>
            <p>lat: {selectedMarker.lat}</p>
            <p>lng: {selectedMarker.lng}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default ListingsMap;
