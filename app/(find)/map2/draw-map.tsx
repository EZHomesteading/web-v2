"use client";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
  DrawingManager,
} from "@react-google-maps/api";
import { useState } from "react";
import Loading from "@/app/components/secondary-loader";

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
}

type vendor = {
  name: string;
  coordinates: number[] | undefined;
  listingsCounts: number;
};

const ListingsMap = ({ coops, producers }: MapProps) => {
  const [filteredCoops, setFilteredCoops] = useState<typeof coopInfo>([]);
  const [filteredProducers, setFilteredProducers] = useState<
    typeof producerInfo
  >([]);

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

  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [drawnShape, setDrawnShape] = useState<google.maps.LatLng[] | null>(
    null
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: ["drawing", "geometry"],
  });

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

  const handleMarkerClick = (coordinate: { lat: number; lng: number }) => {
    setSelectedMarker(coordinate);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

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

    const filteredCoops = coopInfo.filter((coop) => {
      const coopLatLng = new google.maps.LatLng(
        coop.coordinates.lat,
        coop.coordinates.lng
      );

      return google.maps.geometry.poly.containsLocation(coopLatLng, polygon);
    });
    const filteredProducers = producerInfo.filter((producer) => {
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
    <GoogleMap mapContainerClassName="h-screen" options={mapOptions}>
      {filteredProducers.map((producer, index) => {
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

      {filteredCoops.map((coop, index) => {
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
  );
};

export default ListingsMap;
