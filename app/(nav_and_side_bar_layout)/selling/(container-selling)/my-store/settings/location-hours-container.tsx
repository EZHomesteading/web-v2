import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { Location, UserRole } from "@prisma/client";
import AccountCard from "./location-card";

const locationHeadings = [
  { text: "Default Location", style: "text-xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-xl mt-2 font-semibold" },
  { text: "Third Location", style: "text-xl mt-2 font-medium" },
];

interface LocationProps {
  locations?: Location[];
  apiKey: string;
  role: UserRole;
  id: string;
}

const HoursLocationContainer = ({ locations, apiKey, role }: LocationProps) => {
  const renderLocationCards = () => {
    const nonNullLocations = Object.entries(locations || {}).filter(
      ([_, value]) => value !== null
    );
    const nullLocations = Object.entries(locations || {}).filter(
      ([_, value]) => value === null
    );

    return (
      <div>
        {nonNullLocations.length === 0 ? (
          <Card className="col-span-1 h-full bg-red-600 relative justify-center items-center">
            <CardContent className="flex flex-col justify-center items-center h-full pt-3">
              <div>
                You have no default location set. If you would like to create a
                product, this needs to be set up.
              </div>
            </CardContent>
          </Card>
        ) : null}
        {nonNullLocations.map(([key, location], locationIndex) => (
          <AccountCard
            key={key}
            id={location?.id}
            locationHeading={locationHeadings[locationIndex]?.text || ""}
            address={location.address.join(", ")}
          />
        ))}
        {role !== UserRole.PRODUCER && (
          <>
            {nullLocations.map(([key, location], locationIndex) => (
              <AccountCard
                key={key}
                id={location?.id}
                locationHeading={
                  locationHeadings[locationIndex + 1]?.text || ""
                }
                address="No Address or Hours Saved"
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const getLatLngFromAddress = async (address: string) => {
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

  return <>{renderLocationCards()}</>;
};

export default HoursLocationContainer;

const post = async (data: Location | undefined) => {
  try {
    const response = await axios.post("/api/useractions/update", {
      location: data,
    });
    return response.data;
  } catch (error) {
    toast.error("There was an error updating your location or hours");
  }
};
