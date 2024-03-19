"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import ListingLocationSearch from "@/app/components/map/ListingLocationSearch";
import { FiMapPin } from "react-icons/fi";

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

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const router = useRouter();

  const handleSearch = async () => {
    try {
      const geoData = await getLatLngFromAddress(location);

      if (geoData) {
        const { lat, lng } = geoData;
        const radius = 10;

        const query = {
          q: searchQuery,
          lat: lat.toString(),
          lng: lng.toString(),
          radius: radius.toString(),
        };

        const url = qs.stringifyUrl(
          {
            url: "/shop",
            query,
          },
          { skipNull: true }
        );

        router.push(url);
      } else {
        console.error("Please enter a valid address.");
      }
    } catch (error) {
      console.error("Error searching listings:", error);
    }
  };

  const handleAddressParsed = (latLng: { lat: number; lng: number } | null) => {
    setLatLng(latLng);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-auto flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row">
            <div className="relative flex items-center mb-2 sm:mb-0">
              <FiMapPin className="absolute z-50 left-2 text-lg text-gray-400" />
              <div>
                <ListingLocationSearch
                  address={location}
                  setAddress={setLocation}
                  onAddressParsed={handleAddressParsed}
                />
              </div>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="What?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}
