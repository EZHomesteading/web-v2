"use client";
import { useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { BsBasket } from "react-icons/bs";

const Geocoding = () => {
  const geocodingApiLoaded = useMapsLibrary("geocoding");
  const [geocodingService, setGeocodingService] =
    useState<google.maps.Geocoder>();
  const [geocodingResult, setGeocodingResult] =
    useState<google.maps.GeocoderResult>();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!geocodingApiLoaded) return;
    setGeocodingService(new window.google.maps.Geocoder());
  }, [geocodingApiLoaded]);

  useEffect(() => {
    if (!geocodingService || !address) return;
    geocodingService.geocode({ address }, (results, status) => {
      if (results && status === "OK") {
        setGeocodingResult(results[0]);
      }
    });
  }, [geocodingService, address]);

  const [focus, setFocus] = useState({ left: false, right: false });

  const handleNearMeClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
          setAddress(userLocation);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-auto flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row">
            <div className="relative flex items-center mb-2 sm:mb-0">
              <FiMapPin className="absolute left-2 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="Where?"
                className="rounded-full sm:rounded-l-full sm:rounded-r-none px-4 py-2 pl-8 outline-none transition-all duration-200 border
              focus:left ? 'bg-white border-black scale-105' : 'bg-gray-100 border-gray-300' sm:w-50"
                onFocus={() => setFocus({ ...focus, left: true })}
                onBlur={() => setFocus({ ...focus, left: false })}
              />
            </div>
            <div className="relative flex items-center">
              <BsBasket className="absolute left-2 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="What?"
                className="rounded-full sm:rounded-l-none sm:rounded-r-full px-4 py-2 pl-8 outline-none transition-all duration-200 border
              focus:right ? 'bg-white border-black scale-105' : 'bg-gray-100 border-gray-300' sm:w-50"
                onFocus={() => setFocus({ ...focus, right: true })}
                onBlur={() => setFocus({ ...focus, right: false })}
              />
              <FiSearch className="absolute right-0 mr-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleNearMeClick}
            disabled={focus.right}
            className={`px-4 py-2 ${
              focus.left
                ? "text-black border-[.5px] border-black rounded-lg"
                : "text-white "
            }`}
            style={{ width: "calc(100% - 1rem)" }}
          >
            Near Me
          </button>
        </div>
      </div>
    </>
  );
};

export default Geocoding;
