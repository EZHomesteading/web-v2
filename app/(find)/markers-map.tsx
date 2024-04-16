"use client";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";
import Loading from "@/app/components/secondary-loader";

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
      {producerCoordinates.map((coordinate, index) => {
        // const xSkew = Math.random() * 10 - 5;
        // const ySkew = Math.random() * 10 - 5;
        return (
          <MarkerF
            key={`producer-${index}`}
            position={coordinate}
            icon={{
              url: "https://i.ibb.co/TMnKw45/circle-2.png",
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
            onClick={() => handleMarkerClick(coordinate)}
            label={{
              text: "1",
            }}
          />
        );
      })}
      {coopCoordinates.map((coordinate, index) => {
        // const xSkew = Math.random() * 10 - 5;
        // const ySkew = Math.random() * 10 - 5;
        return (
          <MarkerF
            key={`coop-${index}`}
            position={coordinate}
            icon={{
              url: "https://i.ibb.co/qyq0dhb/circle.png",
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
            label={{
              text: "1",
            }}
            onClick={() => handleMarkerClick(coordinate)}
          />
        );
      })}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker}
          onCloseClick={handleInfoWindowClose}
        >
          <div>
            <h3></h3>
            <p>lat: {selectedMarker.lat}</p>
            <p>lng: {selectedMarker.lng}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default ListingsMap;
