"use client";
//this file contains all mapping functionality
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
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
import { MarkerClusterer } from "@react-google-maps/api";
import { Libraries } from "@googlemaps/js-api-loader";

interface MapUser {
  location: number[];
  id: string;
}
[];

interface Info {
  coordinates: {
    lat: number;
    lng: number;
  };
  id: string;
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface MapProps {
  coops: MapUser[];
  producers: MapUser[];
  coordinates: { lat: number; lng: number };
  mk: string;
}
const libraries: Libraries = ["drawing", "geometry"];
const VendorsMap = ({ coops, producers, coordinates, mk }: MapProps) => {
  const [currentCenter, setCurrentCenter] = useState(coordinates);
  const [zoom, setZoom] = useState(11);
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
    name: string;
    image: string;
    firstName: string;
    id: string;
    images: string[];
    url: string;
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<HTMLDivElement | null>(null);

  const [isApplyButtonVisible, setIsApplyButtonVisible] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mk,
    libraries: libraries,
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

  const handleMarkerClick = async (
    coordinate: { lat: number; lng: number },
    id: string
  ) => {
    try {
      const response = await fetch(`/api/user/marker-info?id=${id}`);
      const markerData = await response.json();
      setSelectedMarker({
        ...coordinate,
        name: markerData.name,
        images: markerData.listings.flatMap(
          (listing: { imageSrc: string[] }) => listing.imageSrc
        ),
        image: markerData.image,
        firstName: markerData.firstName,
        id: markerData.id,
        url: markerData.url,
      });

      setCurrentCenter(coordinate);
      setZoom(13);
    } catch (error) {
      console.error("Error fetching marker info:", error);
    }
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
      const coordinates = coop.location;
      return {
        coordinates: {
          lat: coordinates[1],
          lng: coordinates[0],
        },
        id: coop.id,
      };
    })
    .filter(Boolean);
  const producerInfo = producers
    ?.map((producer: MapUser) => {
      return {
        coordinates: {
          lat: producer.location[1],
          lng: producer.location[0],
        },
        id: producer.id,
      };
    })
    .filter(Boolean);
  const [drawnShape, setDrawnShape] = useState<google.maps.LatLng[] | null>(
    null
  );
  // State variables for drawing functionality
  const [filteredCoops, setFilteredCoops] = useState(coopInfo);
  const [filteredProducers, setFilteredProducers] = useState(producerInfo);
  const [showCoops, setShowCoops] = useState(true);
  const [showProducers, setShowProducers] = useState(true);
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

  // Render a loading component if the Google Maps script is not loaded
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
    setShowCoops(false);
    setShowProducers(false);
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
    setShowCoops(true);
    setShowProducers(true);
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

  const handleMouseDown = (event: any) => {
    console.log(event);
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

    const filteredCoops = coopInfo.filter((coop: Info) => {
      const coopLatLng = new google.maps.LatLng(
        coop.coordinates.lat,
        coop.coordinates.lng
      );

      return google.maps.geometry.poly.containsLocation(coopLatLng, polygon);
    });
    const filteredProducers = producerInfo.filter((producer: Info) => {
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
    setShowCoops(true);
    setShowProducers(true);
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
        {showCoops && (
          <MarkerClusterer
            options={{
              imagePath: "https://i.ibb.co/r42S9tm/circle-2-2.png",
              gridSize: 100,
              maxZoom: 12, // Start clustering at zoom level 12
              minimumClusterSize: 5,
            }}
          >
            {(clusterer) => (
              <>
                {filteredCoops.map((coop: Info, index: number) => (
                  <MarkerF
                    key={`coop-${index}`}
                    position={coop.coordinates}
                    clusterer={clusterer}
                    icon={{
                      url: "https://i.ibb.co/kJ7KYN7/circle-2-1.png",
                      scaledSize: new window.google.maps.Size(28, 28),
                      size: {
                        height: 28,
                        width: 28,
                        equals: () => true,
                      },
                      anchor: new window.google.maps.Point(30, 22),
                    }}
                    onClick={() => handleMarkerClick(coop.coordinates, coop.id)}
                  />
                ))}
              </>
            )}
          </MarkerClusterer>
        )}
        {showProducers && (
          <MarkerClusterer
            options={{
              imagePath: "https://i.ibb.co/TMnKw45/circle-2.png",
              gridSize: 100,
              maxZoom: 12, // Start clustering at zoom level 12
              minimumClusterSize: 5,
            }}
          >
            {(clusterer) => (
              <>
                {filteredProducers.map((producer: Info, index: number) => (
                  <MarkerF
                    key={`producer-${index}`}
                    position={producer.coordinates}
                    icon={{
                      url: "https://i.ibb.co/W6Sr1Rx/circle-2-1.png",
                      scaledSize: new window.google.maps.Size(28, 28),
                      anchor: new window.google.maps.Point(25, 22),
                    }}
                    clusterer={clusterer}
                    onClick={() =>
                      handleMarkerClick(producer.coordinates, producer.id)
                    }
                  />
                ))}
              </>
            )}
          </MarkerClusterer>
        )}
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
                href={`/store/${selectedMarker.url}`}
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
