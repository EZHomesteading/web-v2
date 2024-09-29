import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { IoIosAdd } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";
import { LocationObj, UserRole } from "@prisma/client";
import { ExtendedHours } from "@/next-auth";
import AccountCard from "./location-card";

const locationHeadings = [
  { text: "Default Location", style: "text-xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-xl mt-2 font-semibold" },
  { text: "Third Location", style: "text-xl mt-2 font-medium" },
];

const AddLocationCard = ({
  onAddLocation,
}: {
  onAddLocation: (newAddress: string[]) => void;
}) => {
  const [newAddress, setNewAddress] = useState(["", "", "", ""]);
  const [showAddLocationCard, setShowAddLocationCard] = useState(false);

  const handleAddressChange = (index: number, value: string) => {
    setNewAddress((prevAddress) => [
      ...prevAddress.slice(0, index),
      value,
      ...prevAddress.slice(index + 1),
    ]);
  };

  const handleAddLocation = () => {
    onAddLocation(newAddress);
    setNewAddress(["", "", "", ""]);
    setShowAddLocationCard(false);
  };

  return (
    <div>
      {showAddLocationCard ? (
        <Card className="col-span-1 h-fit bg relative w-5/6 sm:w-full">
          <CardContent className="pb-3 pt-1">
            <ul>
              <li>
                <div className="gap-y-2 flex flex-col">
                  <Input
                    onChange={(e) => handleAddressChange(0, e.target.value)}
                    placeholder="street"
                  />
                  <Input
                    onChange={(e) => handleAddressChange(1, e.target.value)}
                    placeholder="city"
                  />
                  <Input
                    onChange={(e) => handleAddressChange(2, e.target.value)}
                    placeholder="state"
                  />
                  <Input
                    onChange={(e) => handleAddressChange(3, e.target.value)}
                    placeholder="zip"
                  />
                </div>
              </li>
            </ul>
            <div className="flex justify-center mt-2 gap-x-2">
              <Button
                className="font-light w-1/2"
                onClick={() => {
                  setShowAddLocationCard(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLocation} className="font-light w-1/2">
                Add Location
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className="col-span-1 h-full bg relative w-5/6 sm:w-full cursor-pointer"
          onClick={() => {
            setShowAddLocationCard(true);
          }}
        >
          <CardContent className="flex flex-col justify-center items-center h-full">
            <IoIosAdd className="text-7xl" />
            <h2 className="text-lg mt-2 font-bold">New Location & Hours</h2>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface Location {
  [key: number]: LocationObj | undefined;
}

interface LocationProps {
  location?: Location;
  apiKey: string;
  role: UserRole;
  id: string;
}

const HoursLocationContainer = ({
  location,
  apiKey,
  role,
  id,
}: LocationProps) => {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<{ [key: number]: string[] }>({});
  const [locationState, setLocationState] = useState<Location | undefined>(
    location
  );

  useEffect(() => {
    if (locationState) {
      let initialAddresses: { [key: number]: string[] } = {};
      Object.entries(locationState).forEach(([key, value]) => {
        if (value === null) {
          return;
        }
        initialAddresses[Number(key)] = value.address;
      });
      setAddresses(initialAddresses);
    }
  }, [locationState]);

  const handleShowAddressChange = (locationIndex: number) => {
    setSelectedLocation(locationIndex);
  };

  const handleDeleteLocation = (locationIndex: number) => {
    setLocationState((prevLocationState) => {
      const updatedLocationState = { ...prevLocationState };
      delete updatedLocationState[locationIndex];

      const shiftedLocationState = Object.entries(updatedLocationState).reduce(
        (acc, [key, value], index) => {
          acc[index] = value;
          return acc;
        },
        {} as Location
      );
      post(shiftedLocationState);
      return shiftedLocationState;
    });
  };

  const handleCancelAddressChange = () => {
    setSelectedLocation(null);
  };

  const handleSaveAddress = async (locationIndex: number) => {
    const updatedAddress = addresses[locationIndex].join(", ");
    const latLng = await getLatLngFromAddress(updatedAddress);

    if (latLng) {
      setLocationState((prevLocationState) => {
        const updatedLocationState = { ...prevLocationState };
        const updatedLocation: LocationObj = {
          ...updatedLocationState[locationIndex],
          address: addresses[locationIndex],
          type: "Point",
          coordinates: [latLng.lng, latLng.lat],
          hours: updatedLocationState[locationIndex]?.hours || null,
        };
        updatedLocationState[locationIndex] = updatedLocation;
        post(updatedLocationState);
        return updatedLocationState;
      });
      setSelectedLocation(null);
    } else {
      toast.error("Invalid address. Please enter a valid address.");
    }
  };

  const handleAddLocation = useCallback(
    async (newAddress: string[]) => {
      const updatedAddress = newAddress.join(", ");
      const latLng = await getLatLngFromAddress(updatedAddress);

      if (latLng) {
        const parsedAddress: LocationObj = {
          address: newAddress,
          coordinates: [latLng.lng, latLng.lat],
          hours: null,
          type: "Point",
        };

        const updatedLocationState = { ...locationState };
        const firstNullIndex = Object.values(updatedLocationState).findIndex(
          (location) => location === null
        );

        if (firstNullIndex !== -1) {
          updatedLocationState[firstNullIndex] = parsedAddress;
        } else {
          const newLocationIndex = Object.keys(updatedLocationState).length;
          updatedLocationState[newLocationIndex] = parsedAddress;
        }

        setLocationState(updatedLocationState);

        try {
          await post(updatedLocationState);
          toast.success("Your account details have changed", {
            duration: 2000,
          });
        } catch (error) {
          toast.error("There was an error adding the new location");
        }
      } else {
        toast.error("Invalid address. Please enter a valid address.");
      }
    },
    [locationState, setLocationState]
  );

  const renderLocationCards = () => {
    const nonNullLocations = Object.entries(locationState || {}).filter(
      ([_, value]) => value !== null
    );
    const max = role === UserRole.COOP ? 3 : 1;

    return (
      <div
        className={`grid grid-rows-${
          nonNullLocations.length < max
            ? nonNullLocations.length + 1
            : nonNullLocations.length
        } `}
      >
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
        {nonNullLocations.map(([key, locationData], locationIndex) => (
          <AccountCard
            key={key}
            locationIndex={locationIndex}
            locationHeading={locationHeadings[locationIndex]?.text || ""}
            address={locationData.address.join(", ")}
          />
        ))}
        {nonNullLocations.length < max && (
          <AddLocationCard onAddLocation={handleAddLocation} />
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
