"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRef, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@prisma/client";
import {
  PiMagnifyingGlassMinusThin,
  PiMagnifyingGlassPlusThin,
} from "react-icons/pi";

interface MapProps {
  lat: number;
  lng: number;
  apiKey: string;
  height?: string;
  scrollWheel?: boolean;
  gestureHandling?: string;
}

const ListingMap = ({
  scrollWheel = true,
  gestureHandling = "greedy",
  height,
  lat,
  lng,
  apiKey,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(12);
  const MIN_ZOOM = 4;
  const MAX_ZOOM = 14;
  const anonymizeLocation = (lat: number, lng: number) => {
    const hash = (lat * 1000 + lng * 1000) % 97;
    const offset = (hash % 10) * 0.0005;
    return { lat: lat + offset, lng: lng - offset };
  };
  useEffect(() => {
    const initMap = async (zoom: number) => {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const initialCenter = { lat: 0, lng: 0 };

      const mapOptions: google.maps.MapOptions = {
        center: initialCenter,
        mapId: "86bd900426b98c0a",
        clickableIcons: false,
        zoom: zoom,
        fullscreenControl: false,
        zoomControl: scrollWheel,
        keyboardShortcuts: false,
        scrollwheel: scrollWheel,
        mapTypeControl: false,
        maxZoom: MAX_ZOOM,
        minZoom: MIN_ZOOM,
        mapTypeId: "roadmap",
        disableDoubleClickZoom: true,
        gestureHandling: gestureHandling,
      };

      const newMap = new Map(mapRef.current as HTMLDivElement, mapOptions);
      setMap(newMap);
    };

    initMap(zoom);
  }, [apiKey]);

  useEffect(() => {
    if (map && lat && lng) {
      const anonymizedCoords = anonymizeLocation(lat, lng);

      map.setCenter(anonymizedCoords);

      const svgMarker = {
        path: `M256 256
               m-256,0
               a256,256 0 1,0 512,0
               a256,256 0 1,0 -512,0
               M${240 + 122.88},${192 + 128}h-8V${
          130.57 + 128
        }l1.49,2.08a8,8,0,1,0,13-9.3l-40-56a8,8,0,0,0-2-1.94L${137 + 122.88},${
          18.77 + 128
        }l-.1-.07a16,16,0,0,0-17.76,0l-.1.07L${51.45 + 122.88},${
          65.42 + 128
        }a8,8,0,0,0-2,1.94l-40,56a8,8,0,1,0,13,9.3L${24 + 122.88},${
          130.57 + 128
        }V${192 + 128}H${16 + 122.88}a8,8,0,0,0,0,16H${
          240 + 122.88
        }a8,8,0,0,0,0-16ZM${40 + 122.88},${108.17 + 128}L${61.7 + 122.88},${
          77.79 + 128
        }L${128 + 122.88},${32 + 128}l${66.3},${45.78}L${216 + 122.88},${
          108.17 + 128
        }V${192 + 128}H${192 + 122.88}V${120 + 128}a8,8,0,0,0-8-8H${
          72 + 122.88
        }a8,8,0,0,0-8,8v72H${40 + 122.88}Zm88,42L${97 + 122.88},${128 + 128}H${
          159 + 122.88
        }Zm48-14.62v48.91L${141.76 + 122.88},${160 + 128}ZM${114.24 + 122.88},${
          160 + 128
        }L${80 + 122.88},${184.46 + 128}V${135.55 + 128}ZM${128 + 122.88},${
          169.83 + 128
        }L${159 + 122.88},${192 + 128}H${97 + 122.88}ZM${104 + 122.88},${
          88 + 128
        }a8,8,0,0,1,8-8h32a8,8,0,1,1,0,16H${112 + 122.88}A8,8,0,0,1,${
          104 + 122.88
        },${88 + 128}Z`,
        fillColor: "#4A90E2",
        fillOpacity: 0.4,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        scale: 0.22,
        anchor: new google.maps.Point(256, 256),
        rotation: 0,
      };
      new google.maps.Marker({
        map,
        position: anonymizedCoords,
        icon: svgMarker,
        label: "",
      });
    }
  }, [map, lat, lng]);

  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  return (
    <>
      <APIProvider apiKey={apiKey}>
        <div
          className="rounded-sm overflow-hidden"
          style={{ height: height || "400px" }}
          ref={mapRef}
        ></div>
        <div
          className={`absolute sm:top-2 sm:right-2 top-2 right-6 rounded-md shadow-md `}
        >
          <div
            className={`flex flex-col bg-white p-3 rounded-sm border   gap-y-2`}
          >
            <PiMagnifyingGlassPlusThin
              size={25}
              className={`hover:cursor-pointer`}
              onClick={() =>
                setZoom((prevZoom) => Math.min(prevZoom + 0.5, MAX_ZOOM))
              }
            />
            <hr className={`w-full border-t`} />
            <PiMagnifyingGlassMinusThin
              className={`hover:cursor-pointer`}
              onClick={() =>
                setZoom((prevZoom) => Math.max(prevZoom - 0.5, MIN_ZOOM))
              }
              size={25}
            />
          </div>
        </div>
      </APIProvider>
    </>
  );
};

export default ListingMap;
