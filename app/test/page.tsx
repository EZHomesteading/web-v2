"use client";

import { useEffect, useState } from "react";

interface TimeSlot {
  open: number;
  close: number;
}

interface Availability {
  date: string;
  timeSlots: TimeSlot[];
  capacity?: number;
}

interface Hours {
  delivery: Availability[];
  pickup: Availability[];
}

interface Location {
  type: string;
  coordinates: number[];
  address: string[];
  hours?: Hours;
  role: "CONSUMER" | "SELLER" | "ADMIN";
  isDefault: boolean;
}

interface Listing {
  _id: string;
  title: string;
  price: number;
  location: Location;
  createdAt: string;
  updatedAt: string;
}

export default function TestPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      console.log("Attempting to fetch listings...");
      try {
        const response = await fetch("/api/get");
        console.log("Fetch response:", response);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
          throw new Error(
            `Failed to fetch listings: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setListings(data);
      } catch (error: any) {
        console.error("Fetch error:", error);
        setError(error.message);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      <h1>Listings</h1>
      {error && <p>Error: {error}</p>}
      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              {listing.title} - ${listing.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
