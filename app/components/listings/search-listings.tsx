"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import SearchLocation from "@/app/components/listings/search-location";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import SearchInput from "./search-input";

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
    console.log("button click");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatLng({ lat, lng });
          setLocation("Near Me");
          setFocus({ left: false, right: true });
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
        radius = 20;
      } else if (location) {
        const geoData = await getLatLngFromAddress(location);
        radius = 20;
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
      setSearchQuery("");
      setLocation("");
      setLatLng(null);
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  };

  const handleAddressParsed = (latLng: { lat: number; lng: number } | null) => {
    setLatLng(latLng);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start md:items-center justify-center relative text-black">
        <div className="w-full mb-2 sm:mb-0 sm:w-auto">
          <SearchLocation
            address={location}
            setAddress={setLocation}
            onSearch={handleSearch}
            onAddressParsed={handleAddressParsed}
            focus={focus}
            setFocus={setFocus}
          />
        </div>
        <div className="w-full mb-2 sm:mb-0 sm:w-auto">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            focus={focus}
            setFocus={setFocus}
          />
        </div>
        {!focus.right && (
          <button
            className="absolute top-full mt-2 py-2 px-4 border-[.2px] rounded-lg text-white w-full"
            onClick={handleNearMeClick}
          >
            Near Me
          </button>
        )}
      </div>
    </>
  );
};

export default FindListingsComponent;
