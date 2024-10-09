// Map.tsx
"use client";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback } from "react";
import Loading from "@/app/components/secondary-loader";
import { Libraries } from "@googlemaps/js-api-loader";
import { UserInfo } from "@/next-auth";
import LocationSearchInput from "../components/map/LocationSearchInput";

interface MapProps {
  mk: string;
  user?: UserInfo;
  center?: { lat: number; lng: number };
  showSearchBar?: boolean;
  h?: number;
  w?: number;
}

const libraries: Libraries = ["places", "drawing", "geometry"];

const Map = ({
  mk,
  user,
  showSearchBar = true,
  center = { lat: 38, lng: -79 },
  h,
  w,
}: MapProps) => {
  const [address, setAddress] = useState("");
  const [currentCenter, setCurrentCenter] = useState<google.maps.LatLngLiteral>(
    user?.location?.[0]?.coordinates
      ? {
          lat: user.location[0].coordinates[1],
          lng: user.location[0].coordinates[0],
        }
      : center
  );
  const [zoom, setZoom] = useState(6);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mk,
    libraries: libraries,
    version: "3.58",
  });

  const handleLocationSelect = useCallback(
    (latLng: google.maps.LatLngLiteral) => {
      setCurrentCenter(latLng);
      setZoom(15);
    },
    []
  );

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
  const mapContainerStyle =
    h && w
      ? `h-[${h}px] w-[${w}px] rounded-lg shadow-lg`
      : h
      ? `h-[${h}px] w-screen`
      : w
      ? `w-[${w}px] h-screen`
      : "h-screen w-screen";
  return (
    <div className={`relative touch-none`}>
      {showSearchBar && (
        <div className="absolute z w-full px-2 top-5">
          <LocationSearchInput
            address={address}
            setAddress={setAddress}
            onLocationSelect={handleLocationSelect}
            apiKey={mk}
          />
        </div>
      )}

      <GoogleMap
        onLoad={(map) => {
          mapRef.current = map;
        }}
        mapContainerClassName={mapContainerStyle}
        options={mapOptions}
      >
        <MarkerF position={currentCenter} />
      </GoogleMap>
    </div>
  );
};

export default Map;
