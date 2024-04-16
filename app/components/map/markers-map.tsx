"use client";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";

interface MapProps {
  coopCoordinates: { lat: number; lng: number }[];
  producerCoordinates: { lat: number; lng: number }[];
  userCoordinates: { lat: number; lng: number } | null;
  users: {
    id: string;
    name: string;
    email: string;
    firstName: string | null;
    emailVerified: Date | null;
    phoneNumber: string | null;
    street: string | null;
    city: string | null;
    zip: string | null;
    state: string | null;
    location: any;
    image: string | null;
    hoursOfOperation: any;
    role: any;
    password: string | null;
    stripeAccountId: string | null;
    createdAt: Date;
    updatedAt: Date;
    conversationIds: string[];
    seenMessageIds: string[];
    favoriteIds: string[];
    subscriptions: string | null;
  }[];
}

const ListingsMap = ({
  producerCoordinates,
  coopCoordinates,
  userCoordinates,
  users,
}: MapProps) => {
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });

  const mapOptions: google.maps.MapOptions = {
    center: userCoordinates || { lat: 36.8508, lng: -76.2859 },
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
    scrollwheel: true,
    minZoom: 5,
  };

  const handleMarkerClick = (coordinate: { lat: number; lng: number }) => {
    setSelectedMarker(coordinate);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerClassName="rounded-xl mb-5 h-screen"
      options={mapOptions}
    >
      {producerCoordinates.map((coordinate, index) => (
        <MarkerF
          key={`producer-${index}`}
          position={coordinate}
          icon={{
            url: "https://i.ibb.co/TMnKw45/circle-2.png",
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
          }}
          onClick={() => handleMarkerClick(coordinate)}
        />
      ))}
      {coopCoordinates.map((coordinate, index) => (
        <MarkerF
          key={`coop-${index}`}
          position={coordinate}
          icon={{
            url: "https://i.ibb.co/qyq0dhb/circle.png",
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 15),
          }}
          onClick={() => handleMarkerClick(coordinate)}
        />
      ))}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker}
          onCloseClick={handleInfoWindowClose}
        >
          <div></div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default ListingsMap;
