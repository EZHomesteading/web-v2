"use client";

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Loading from "@/components/secondary-loader";
import { Libraries } from "@googlemaps/js-api-loader";
import LocationSearchInput from "@/components/map/LocationSearchInput";

interface MapProps {
  mk: string;
  center?: { lat: number; lng: number };
  showSearchBar?: boolean;
  h?: number;
  w?: number;
  z?: number;
  maxZ?: number;
  minZ?: number;
  basketStyle?: string;
  proposedLoc?: { lat: number; lng: number };
  sellerLoc?: { lat: number; lng: number };
}

const libraries: Libraries = ["places", "drawing", "geometry"];

const customSvgMarker = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="48" fill="rgba(42, 157, 244, 0.3)" stroke="rgba(42, 157, 244, 0.6)" stroke-width="2" />

</svg>
`;

const Map = ({
  mk,
  showSearchBar = true,
  center = { lat: 38, lng: -79 },
  h,
  w,
  z = 14,
  minZ = 12,
  maxZ = 15,
  basketStyle,
  proposedLoc,
  sellerLoc,
}: MapProps) => {
  const [address, setAddress] = useState("");
  const [currentCenter, setCurrentCenter] =
    useState<google.maps.LatLngLiteral>(center);

  const [zoom, setZoom] = useState(z);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mk,
    libraries: libraries,
    version: "3.58",
  });

  const handleLocationSelect = useCallback(
    (latLng: google.maps.LatLngLiteral) => {
      setCurrentCenter(latLng);
      setZoom(14);
    },
    []
  );

  const getApproximatePosition = useCallback(
    (position: google.maps.LatLngLiteral) => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 0.005; // Adjust this value to control the maximum distance
      const lat = position.lat + radius * Math.cos(angle);
      const lng = position.lng + radius * Math.sin(angle);
      return { lat, lng };
    },
    []
  );

  const approximatePosition = useMemo(
    () => getApproximatePosition(currentCenter),
    [currentCenter, getApproximatePosition]
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
    clickableIcons: false,
    disableDefaultUI: true,
    maxZoom: maxZ,
    scrollwheel: true,
    minZoom: minZ,
    gestureHandling: "greedy",
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
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
    h && w && !basketStyle
      ? `h-[${h}px] w-[${w}px] rounded-lg shadow-lg`
      : h
      ? `h-[${h}px] w-screen`
      : w
      ? `w-[${w}px] h-screen`
      : basketStyle
      ? `${basketStyle}`
      : "h-screen w-screen rounded-md shadow-xl";

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
        <MarkerF
          position={approximatePosition}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              customSvgMarker
            )}`,
            scaledSize: new google.maps.Size(200, 200),
            anchor: new google.maps.Point(100, 100),
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default Map;
