"use client";

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import Loading from "@/app/components/secondary-loader";
import InfoWindowCarousel from "./info-window-carousel";
import { Outfit } from "next/font/google";
import Avatar from "@/app/components/Avatar";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface MapProps {
  coops: any;
  producers: any;
}

const VendorsMap = ({ coops, producers }: MapProps) => {
  const [currentCenter, setCurrentCenter] = useState<google.maps.LatLngLiteral>(
    {
      lat: 36.8508,
      lng: -76.2859,
    }
  );
  const [zoom, setZoom] = useState(11);
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

  const [isApplyButtonVisible, setIsApplyButtonVisible] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: ["drawing", "geometry"],
    version: "3.55",
  });

  const mapOptions: google.maps.MapOptions = {
    center: currentCenter,
    zoom: zoom,
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
    gestureHandling: "greedy",
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
    setCurrentCenter(coordinate);
    setZoom(13);
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
  const [currentShape, setCurrentShape] = useState<google.maps.Polyline | null>(
    null
  );
  const [filteredCoops, setFilteredCoops] = useState<any>(coopInfo);
  const [filteredProducers, setFilteredProducers] = useState<any>(producerInfo);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [polylinePath, setPolylinePath] = useState<google.maps.LatLng[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  useEffect(() => {
    const disableDefaultTouchBehavior = (event: TouchEvent) => {
      event.preventDefault();
    };

    window.addEventListener("touchmove", disableDefaultTouchBehavior, {
      passive: false,
    });

    return () => {
      window.removeEventListener("touchmove", disableDefaultTouchBehavior);
    };
  }, []);
  if (!isLoaded) {
    return <Loading />;
  }

  const startDrawing = () => {
    setIsDrawingEnabled(true);
    if (mapRef.current) {
      mapRef.current.setOptions({
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: false,
        gestureHandling: "none",
      });
    }
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    setIsDrawingEnabled(false);
    setPolylinePath([]);
    setIsApplyButtonVisible(false);
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (mapRef.current) {
      mapRef.current.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        gestureHandling: "greedy",
      });
    }
  };

  const handleMouseDown = (event: google.maps.MapMouseEvent) => {
    if (isDrawingEnabled && event.latLng) {
      setIsDrawing(true);
      const path = polylineRef.current?.getPath();
      if (path) {
        path.push(event.latLng);
        setPolylinePath(path.getArray());
      } else {
        const polyline = new google.maps.Polyline({
          strokeColor: "#FFFFF",
          strokeWeight: 2,
          clickable: false,
          editable: false,
          zIndex: 1,
        });
        polyline.setMap(mapRef.current);
        polylineRef.current = polyline;
        polyline.getPath().push(event.latLng);
        setPolylinePath(polyline.getPath().getArray());
      }
    }
  };
  const handleMouseMove = (event: google.maps.MapMouseEvent) => {
    if (isDrawing && event.latLng) {
      const path = polylineRef.current?.getPath();
      if (path) {
        path.push(event.latLng);
        setPolylinePath(path.getArray());
      }
    }
  };
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const path = polylineRef.current?.getPath();
      if (path && path.getLength() > 2) {
        const firstPoint = path.getAt(0);
        const lastPoint = path.getAt(path.getLength() - 1);
        if (firstPoint && lastPoint) {
          path.push(firstPoint);
          setPolylinePath(path.getArray());
        }
      }
      setIsApplyButtonVisible(true);
    }
  };

  const applyDrawnShape = () => {
    const coordinates = polylineRef.current?.getPath().getArray() || [];
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
    stopDrawing();
  };

  const resetMap = () => {
    if (currentShape) {
      currentShape.setMap(null);
      setCurrentShape(null);
    }
    setFilteredCoops(coopInfo);
    setFilteredProducers(producerInfo);
  };

  return (
    <div
      className={`relative touch-none ${isDrawingEnabled ? "opacity-95" : ""}`}
    >
      {!isDrawingEnabled && (
        <Button className="absolute top-1 right-1 z-10" onClick={startDrawing}>
          Start Drawing
        </Button>
      )}
      {isDrawingEnabled && (
        <Button className="absolute top-1 right-1 z-10" onClick={stopDrawing}>
          Stop Drawing
        </Button>
      )}
      <Button className="absolute top-1 left-1 z-10" onClick={resetMap}>
        Remove Filters
      </Button>
      {isApplyButtonVisible && (
        <Button
          className="absolute top-11 right-1 z-10"
          onClick={applyDrawnShape}
        >
          Apply
        </Button>
      )}

      <GoogleMap
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        mapContainerClassName="h-[calc(100vh-64px)] w-screen"
        options={mapOptions}
        onClick={handleMapClick}
      >
        {filteredProducers.map((producer: any, index: number) => (
          <MarkerF
            key={`producer-${index}`}
            position={producer.coordinates}
            icon={{
              url: "https://i.ibb.co/TMnKw45/circle-2.png",
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
            onClick={() =>
              handleMarkerClick(
                producer.coordinates,
                producer.name,
                producer.images,
                producer.firstName,
                producer.image,
                producer.id
              )
            }
            label={{
              text: `${producer.listingsCount}`,
            }}
          />
        ))}
        {filteredCoops.map((coop: any, index: number) => (
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
            onClick={() =>
              handleMarkerClick(
                coop.coordinates,
                coop.name,
                coop.images,
                coop.firstName,
                coop.image,
                coop.id
              )
            }
          />
        ))}
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
                <p className={`${outfit.className} text-xs text-gray-600`}>
                  {selectedMarker.firstName}
                </p>
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

export default VendorsMap;
