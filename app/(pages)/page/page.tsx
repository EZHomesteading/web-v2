"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import LocationSearchInput from "@/app/components/map/LocationSearchInput";

const getLatLngFromAddress = async (address: string) => {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      console.log(`Address: ${address}, Latitude: ${lat}, Longitude: ${lng}`);
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
  const router = useRouter();

  const handleSearch = async () => {
    try {
      const geoData = await getLatLngFromAddress(location);

      if (geoData) {
        const { lat, lng } = geoData;
        const radius = 10;

        const query = {
          search: searchQuery,
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

  return (
    <div>
      <h1>Search Listings</h1>
      <div>
        <input
          type="text"
          placeholder="Search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
        <LocationSearchInput
          address={location}
          setAddress={setLocation}
          onAddressParsed={(address: any) => {
            console.log(address);
          }}
        />
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
