"use client";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  DrawingManager,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import Loading from "@/app/components/secondary-loader";
import InfoWindowCarousel from "./info-window-carousel";
import Avatar from "../../components/Avatar";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["200"],
});

interface MapProps {
  coops: any;
  producers: any;
}

const ListingsMap = ({ coops, producers }: MapProps) => {
  const [filteredCoops, setFilteredCoops] = useState<any>([]);
  const [filteredProducers, setFilteredProducers] = useState<any>([]);
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
    name: string;
    image: string;
    firstName: string;
    id: string;
    images: string[];
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<HTMLDivElement | null>(null);

  const mapOptions: google.maps.MapOptions = {
    center: { lat: 36.8508, lng: -76.2859 },
    zoom: 11,
    mapId: "86bd900426b98c0a",
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

  const handleMarkerClick = (
    coordinate: { lat: number; lng: number },
    name: string,
    images: string[],
    firstName: string,
    image: string,
    id: string
  ) => {
    setSelectedMarker({ ...coordinate, name, images, image, firstName, id });
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (
      infoWindowRef.current &&
      !infoWindowRef.current.contains(event.domEvent.target as Node)
    ) {
      handleInfoWindowClose();
    }
  };

  useEffect(() => {
    if (selectedMarker && mapRef.current) {
      const map = mapRef.current;
      const markerPosition = new google.maps.LatLng(
        selectedMarker.lat,
        selectedMarker.lng
      );
      map.panTo(markerPosition);
    }
  }, [selectedMarker]);
  const coopInfo = coops?.map((coop: any) => ({
    coordinates: {
      lat: coop.location.coordinates[1],
      lng: coop.location.coordinates[0],
    },
    name: coop.name,
    firstName: coop?.firstName,
    image: coop?.image,
    id: coop.id,
    images: coop?.listings?.map((listing: any) => listing.imageSrc) || [],
    listingsCount: coop?.listings?.length ?? 0,
  }));

  const producerInfo = producers?.map((producer: any) => ({
    coordinates: {
      lat: producer?.location.coordinates[1],
      lng: producer?.location.coordinates[0],
    },
    firstName: producer?.firstName,
    image: producer?.image,
    name: producer?.name,
    id: coopInfo.id,
    images: producer?.listings?.map((listing: any) => listing.imageSrc) || [],
    listingsCount: producer?.listings?.length ?? 0,
  }));

  const [drawnShape, setDrawnShape] = useState<google.maps.LatLng[] | null>(
    null
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: ["drawing", "geometry"],
  });

  const onPolylineComplete = (polyline: google.maps.Polyline) => {
    const coordinates = polyline.getPath().getArray();
    setDrawnShape(coordinates);

    const polygonPath = coordinates.map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));

    const polygon = new google.maps.Polygon({
      paths: polygonPath,
    });

    const filteredCoops = coopInfo.filter((coop: any) => {
      const coopLatLng = new google.maps.LatLng(
        coop.coordinates.lat,
        coop.coordinates.lng
      );

      return google.maps.geometry.poly.containsLocation(coopLatLng, polygon);
    });
    const filteredProducers = producerInfo.filter((producer: any) => {
      const coopLatLng = new google.maps.LatLng(
        producer.coordinates.lat,
        producer.coordinates.lng
      );

      return google.maps.geometry.poly.containsLocation(coopLatLng, polygon);
    });
    setFilteredCoops(filteredCoops);
    setFilteredProducers(filteredProducers);
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="relative">
      <GoogleMap
        onLoad={(map) => {
          mapRef.current = map;
        }}
        mapContainerClassName="h-[95vh] w-screen"
        options={mapOptions}
        onClick={handleMapClick}
      >
        {producerInfo.map((producer: any, index: number) => {
          return (
            <MarkerF
              key={`producer-${index}`}
              position={producer.coordinates}
              icon={{
                url: "https://i.ibb.co/TMnKw45/circle-2.png",
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20),
              }}
              label={{
                text: `${producer.listingsCount}`,
              }}
              onClick={() => {
                handleMarkerClick(
                  producer.coordinates,
                  producer.name,
                  producer.images,
                  producer.firstName,
                  producer.image,
                  producer.id
                );
              }}
            />
          );
        })}
        {coopInfo.map((coop: any, index: number) => {
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
              onClick={() => {
                handleMarkerClick(
                  coop.coordinates,
                  coop.name,
                  coop.images,
                  coop.firstName,
                  coop.image,
                  coop.id
                );
              }}
            />
          );
        })}
        <DrawingManager
          onPolylineComplete={onPolylineComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
            },
            polylineOptions: {
              strokeColor: "#FFFFF",
              strokeWeight: 2,
              clickable: false,
              editable: false,
              zIndex: 1,
            },
          }}
        />
      </GoogleMap>
      {selectedMarker && (
        <div
          ref={infoWindowRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/4 bg-white rounded-lg shadow-md transition-opacity duration-500 ease-in-out p-0 m-0"
          style={{ opacity: selectedMarker ? 1 : 0 }}
        >
          <div className="flex items-start flex-col bg-slate-200 rounded-b-lg">
            <InfoWindowCarousel
              handleInfoWindowClose={handleInfoWindowClose}
              images={selectedMarker.images}
            />
            <header className="flex flex-row p-1 relative w-full">
              <Avatar user={selectedMarker} />

              <ul className="flex flex-col ml-1 pl-1">
                <h1 className={`${outfit.className} text-sm `}>
                  {selectedMarker.name}
                </h1>
                <li className={`${outfit.className} text-xs text-gray-600`}>
                  {selectedMarker.firstName}
                </li>
              </ul>
              <Link
                href={`/store/${selectedMarker.id}`}
                className="absolute right-1 top-1"
              >
                <Button>Go to Store</Button>
              </Link>
            </header>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsMap;
