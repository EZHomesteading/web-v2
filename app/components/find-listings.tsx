"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import ListingLocationSearch from "@/app/components/map/ListingLocationSearch";
import { FiMapPin } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { BsBasket } from "react-icons/bs";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const getLatLngFromAddress = async (address: string) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error("Geocoding failed");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const FindListingsComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const router = useRouter();
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
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatLng({ lat, lng });
          setLocation(`${lat}, ${lng}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = async () => {
    try {
      let lat: string | null = null;
      let lng: string | null = null;
      let radius: number | null = null;
      if (latLng) {
        lat = latLng.lat.toString();
        lng = latLng.lng.toString();
        radius = 10;
      } else if (location) {
        const geoData = await getLatLngFromAddress(location);
        radius = 10;
        if (geoData) {
          lat = geoData.lat.toString();
          lng = geoData.lng.toString();
        }
      }

      const query: Record<string, string | undefined> = {
        ...(searchQuery ? { q: searchQuery } : {}),
        ...(lat ? { lat: lat.toString() } : {}),
        ...(lng ? { lng: lng.toString() } : {}),
        ...(radius ? { radius: radius.toString() } : {}),
      };

      const url = qs.stringifyUrl(
        {
          url: "/shop",
          query,
        },
        { skipNull: true }
      );

      router.push(url);
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  };

  const handleAddressParsed = (latLng: { lat: number; lng: number } | null) => {
    setLatLng(latLng);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-auto flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row">
            <div className="relative flex items-center mb-2 sm:mb-0">
              <FiMapPin className="absolute z-50 left-2 text-lg text-gray-400" />
              <ListingLocationSearch
                address={location}
                setAddress={setLocation}
                onAddressParsed={handleAddressParsed}
                onFocus={() => setFocus({ ...focus, left: true })}
                onBlur={() => setFocus({ ...focus, left: false })}
              />
            </div>
            <div className="relative flex items-center mb-2 sm:mb-0">
              <BsBasket className="absolute text-lg left-2 text-gray-400" />
              <input
                type="text"
                placeholder="Everything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-full px-4 py-2 pl-8 outline-none transition-all duration-200 border
              focus:left ? 'bg-white border-black scale-120' : 'bg-gray-100 border-gray-300'"
                onFocus={() => setFocus({ ...focus, right: true })}
                onBlur={() => setFocus({ ...focus, right: false })}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <IoIosSearch className="text-lg text-gray-400" />
              </button>
            </div>
          </div>
          <button
            onClick={handleNearMeClick}
            disabled={focus.right}
            className={`absolute top-10 ${
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

export default FindListingsComponent;
