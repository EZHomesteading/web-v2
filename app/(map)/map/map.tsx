"use client";

import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  MarkerClustererF,
} from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import Loading from "@/app/components/secondary-loader";
import InfoWindowCarousel from "./info-window-carousel";
import { Outfit } from "next/font/google";
import Avatar from "@/app/components/Avatar";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { CiCircleQuestion, CiEdit } from "react-icons/ci";
import { MdOutlineEditOff } from "react-icons/md";
import { CiBookmarkRemove } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";
import { Popover, PopoverTrigger } from "@/app/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

interface MapUser {
  id: string;
  name: string;
  firstName: string | null;
  location: {
    coordinates: number[];
  } | null;
  image: string | null;
  listings: {
    imageSrc: string[];
  }[];
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface MapProps {
  coops: MapUser[];
  producers: MapUser[];
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
  const coopInfo = coops
    ?.map((coop: MapUser) => {
      if (!coop.location || !coop.location.coordinates) return null;

      const coordinates = coop.location.coordinates;
      const images = coop.listings
        ? coop.listings.flatMap(
            (listing: { imageSrc: string[] }) => listing.imageSrc
          )
        : [];
      const listingsCount = coop.listings ? coop.listings.length : 0;

      return {
        coordinates: {
          lat: coordinates[1],
          lng: coordinates[0],
        },
        name: coop.name,
        firstName: coop?.firstName,
        image: coop?.image,
        id: coop.id,
        images: images,
        listingsCount: listingsCount,
      };
    })
    .filter(Boolean);
  const producerInfo = producers
    ?.map((producer: MapUser) => {
      if (!producer.location) return null;
      return {
        coordinates: {
          lat: producer.location.coordinates[1],
          lng: producer.location.coordinates[0],
        },
        name: producer.name,
        firstName: producer?.firstName,
        image: producer?.image,
        id: producer.id,
        images: producer?.listings?.length
          ? producer.listings.flatMap(
              (listing: { imageSrc: string[] }) => listing.imageSrc
            )
          : [],
        listingsCount: producer?.listings?.length ?? 0,
      };
    })
    .filter(Boolean);
  const [drawnShape, setDrawnShape] = useState<google.maps.LatLng[] | null>(
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
  const handleCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        setCurrentCenter({
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        });
      }
    }
  };

  const handleZoomChanged = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      if (newZoom !== undefined) {
        setZoom(newZoom);
        setSelectedMarker(null);
      }
    }
  };

  const startDrawing = () => {
    handleCenterChanged();
    handleZoomChanged();
    setFilteredCoops([]);
    setFilteredProducers([]);
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
          strokeColor: "#008080",
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
    handleCenterChanged();
    handleZoomChanged();

    setFilteredCoops(coopInfo);
    setFilteredProducers(producerInfo);
  };

  return (
    <div
      className={`relative touch-none ${isDrawingEnabled ? "opacity-80 " : ""}`}
    >
      <Popover>
        <PopoverTrigger
          className={`${outfit.className} absolute top-1 left-1 z-10 bg-slate-800 text-white shadow-lg px-1 py-2 rounded-lg text-xs sm:text-sm flex flex-row items-center`}
        >
          <CiCircleQuestion className="mr-1" size={20} />
          Drawing Tool Usage
        </PopoverTrigger>
        <PopoverContent className=" bg-slate-800 text-white mt-1 ml-1 rounded-md z">
          <ul className={`${outfit.className} p-2 rounded-md text-xs`}>
            <li className="flex flex-row">
              - Click
              <button className="ml-1 text-xs bg-teal-600 hover:bg-teal-900 flex flex-row items-center rounded-md px-1 ">
                <CiEdit size={15} className="mr-1" />
                Start Drawing
              </button>
            </li>
            <li>- Click or press and drag a shape</li>
            <li className="flex flex-row">
              - Click{" "}
              <button className="ml-1 text-xs bg-green-600 hover:bg-green-800 flex flex-row items-center rounded-md px-1 ">
                <IoCheckmark size={15} className="ml-1" />
                Apply
              </button>
            </li>
            <li>- Click on a marker for more info</li>
            <li className="flex flex-row">
              - Click{" "}
              <button className="mx-1 text-xs bg-red-500 hover:bg-red-700 flex flex-row items-center rounded-md px-1 ">
                <CiBookmarkRemove size={15} className="ml-1" />
                Remove Filters
              </button>
              to remove drawing filters
            </li>
          </ul>
        </PopoverContent>
      </Popover>
      {!isDrawingEnabled && (
        <Button
          className="absolute top-1 right-1 z-10 p-1 text-xs sm:text-sm bg-teal-600 hover:bg-teal-900"
          onClick={startDrawing}
        >
          <CiEdit size={20} className="mr-1" />
          Start Drawing
        </Button>
      )}
      {isDrawingEnabled && (
        <Button
          className="absolute top-1 right-1 z-10 p-1 text-xs md:text-sm bg-red-500 hover:bg-red-700"
          onClick={stopDrawing}
        >
          <MdOutlineEditOff size={20} className="ml-1" />
          Stop Drawing
        </Button>
      )}
      {drawnShape && (
        <Button
          className="absolute top-11 left-1 z-10 p-1 bg-red-500 hover:bg-red-700"
          onClick={resetMap}
        >
          <CiBookmarkRemove size={20} className="ml-1" />
          Remove Filters
        </Button>
      )}
      {isApplyButtonVisible && (
        <Button
          className="p-1 text-xs sm:text-sm absolute top-11 right-1 z-10 bg-green-600 hover:bg-green-800"
          onClick={applyDrawnShape}
        >
          <IoCheckmark size={20} className="ml-1" />
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
        {filteredCoops.map((coop: any, index: number) => (
          <MarkerF
            key={`coop-${index}`}
            position={coop.coordinates}
            label={{
              text: `${coop.listingsCount}`,
              fontSize: "10px",
            }}
            icon={{
              url: "https://i.ibb.co/qyq0dhb/circle.png",
              scaledSize: new window.google.maps.Size(28, 28),
              size: {
                height: 28,
                width: 28,
                equals: () => true,
              },
              anchor: new window.google.maps.Point(25, 22),
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
        {filteredProducers.map((producer: any, index: number) => (
          <MarkerF
            key={`producer-${index}`}
            position={producer.coordinates}
            label={{
              text: `${producer.listingsCount}`,
              fontSize: "10px",
            }}
            icon={{
              url: "https://i.ibb.co/TMnKw45/circle-2.png",
              scaledSize: new window.google.maps.Size(28, 28),
              anchor: new window.google.maps.Point(25, 22),
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
          />
        ))}
      </GoogleMap>
      {selectedMarker && (
        <div
          ref={infoWindowRef}
          className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 bg-white rounded-lg shadow-md transition-opacity duration-500 ease-in-out p-0 m-0"
          style={{ opacity: selectedMarker ? 1 : 0 }}
        >
          <div className="flex items-start flex-col bg-slate-200 rounded-b-lg">
            <InfoWindowCarousel
              handleInfoWindowClose={handleInfoWindowClose}
              images={selectedMarker.images}
            />
            <header className="flex flex-row p-1 relative w-full">
              <Avatar image={selectedMarker.image} />

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
