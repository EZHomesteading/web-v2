"use client";

import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Loading from "@/app/components/secondary-loader";
import ClientOnly from "@/app/components/client/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import UserCards from "./user-cards";
import { Location } from "@prisma/client";

interface MapProps {
  coops: {
    name: string;
    location: Location | null;
    listingsCount: number;
  }[];
  producers: {
    name: string;
    location: Location | null;
    listingsCount: number;
  }[];
  vendors: any;
  searchParams?: {
    page?: string;
  };
  totalvendors: number;
}

const VendorsMap = ({
  coops,
  producers,
  vendors,
  totalvendors,
  searchParams,
}: MapProps) => {
  const [filteredVendors, setFilteredVendors] = useState<any>();

  let page = parseInt(searchParams?.page as string, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 20;
  const totalPages = Math.ceil(totalvendors / perPage);
  const isPageOutOfRange = page > totalPages;

  const pageNumbers = [];
  const offsetNumber = 3;

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });
  const onBoundsChange = () => {};

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
  useEffect(() => {
    if (map) {
      const listener = map.addListener("bounds_changed", () => {
        const bounds = map.getBounds();
        if (bounds) {
          const { south, west, north, east } = bounds.toJSON();

          const filteredVendors = [...coops, ...producers].filter((user) => {
            if (user?.location?.coordinates) {
              const coordinates = user?.location.coordinates;
              const [lng, lat] = coordinates;
              return lng >= west && lng <= east && lat >= south && lat <= north;
            } else {
              return null;
            }
            return false;
          });
          // setFilteredVendors(filteredVendors);
          console.log("1", vendors);
          console.log("2", filteredVendors);
          onBoundsChange();
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map, coops, producers, onBoundsChange]);

  const handleMarkerClick = (coordinate: { lat: number; lng: number }) => {
    setSelectedMarker(coordinate);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const coopInfo = coops?.map((coop: any) => ({
    coordinates: {
      lat: coop.location.coordinates[1],
      lng: coop.location.coordinates[0],
    },
    name: coop.name,
    listingsCount: coop?.listingsCount,
  }));

  const producerInfo = producers?.map((producer: any) => ({
    coordinates: {
      lat: producer?.location.coordinates[1],
      lng: producer?.location.coordinates[0],
    },
    name: producer?.name,
    listingsCount: producer?.listingsCount,
  }));

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="flex ">
      <div className="w-1/2">
        <UserCards
          vendors={vendors}
          emptyState={
            vendors.length === 0 ? (
              <ClientOnly>
                <EmptyState showReset />
              </ClientOnly>
            ) : null
          }
          totalPages={totalPages}
          isPageOutOfRange={isPageOutOfRange}
          pageNumbers={pageNumbers}
          currentPage={1}
        />
      </div>
      <div className="w-1/2">
        <GoogleMap
          mapContainerClassName="h-screen"
          options={mapOptions}
          onLoad={(map) => setMap(map)}
        >
          {producerInfo.map((producer, index) => (
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
          ))}
          {coopInfo.map((coop, index) => (
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
          ))}
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
      </div>
    </div>
  );
};

export default VendorsMap;
