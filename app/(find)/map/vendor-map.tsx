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

interface MapProps {
  coops: {
    name: string;
    coordinates: number[] | undefined;
    listingsCount: number;
  }[];
  producers: {
    name: string;
    coordinates: number[] | undefined;
    listingsCount: number;
  }[];
  vendors: any;

  searchParams?: {
    page?: string;
  };
  totalvendors: any;
}

const VendorsMap = ({
  coops,
  producers,
  vendors,
  totalvendors,
  searchParams,
}: MapProps) => {
  const [userCoordinates, setUserCoordinates] = useState<number[][]>([]);

  let page = parseInt(searchParams?.page as string, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 20;
  const totalPages = Math.ceil(totalvendors / perPage);
  const isPageOutOfRange = page > totalPages;
  const [filteredVendors, setFilteredVendors] = useState<any[]>(vendors);

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
  const onBoundsChange = () => {
    setUserCoordinates(userCoordinates);
  };

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

          const userCoordinates = [...coops, ...producers]
            .filter((user) => {
              const coordinates = user.coordinates;
              if (coordinates) {
                const [lng, lat] = coordinates;
                return (
                  lng >= west && lng <= east && lat >= south && lat <= north
                );
              }
              return false;
            })
            .map((user) => user.coordinates as number[]);
          console.log(userCoordinates);
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
      lat: coop.coordinates[1],
      lng: coop.coordinates[0],
    },
    name: coop.name,
    listingsCount: coop?.listingsCount,
  }));

  const producerInfo = producers?.map((producer: any) => ({
    coordinates: {
      lat: producer?.coordinates[1],
      lng: producer?.coordinates[0],
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
          userCoordinates={userCoordinates}
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
