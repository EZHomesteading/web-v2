import React, { memo, useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import SliderSelection from "./slider-selection";
import { Zilla_Slab } from "next/font/google";
import { Button } from "@/app/components/ui/button";
import { PiTrashSimple } from "react-icons/pi";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { IoIosAdd } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";
import { LocationObj, Prisma, UserRole } from "@prisma/client";
import { ExtendedHours } from "@/next-auth";

const zilla = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});

interface Location {
  [key: number]: LocationObj | undefined;
}

interface LocationProps {
  location?: Location;
  apiKey: string;
  role: UserRole;
}

const locationHeadings = [
  { text: "Default Location", style: "text-xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-xl mt-2 font-semibold" },
  { text: "Third Location", style: "text-xl mt-2 font-medium" },
];

const CardComponent = memo(
  ({
    locationIndex,
    address,
    handleAddressChange,
    handleSaveAddress,
    showAddressChange,
    handleCancelAddressChange,
    coordinates,
    handleDeleteLocation,
    handleShowAddressChange,
    hours,
    locationState,
    location,
  }: {
    locationIndex: number;
    address: string[];
    handleAddressChange: (index: number, value: string) => void;
    handleSaveAddress: () => void;
    showAddressChange: boolean;
    coordinates: number[];
    handleCancelAddressChange: () => void;
    handleDeleteLocation: (locationIndex: number) => void;
    handleShowAddressChange: () => void;
    hours: ExtendedHours;
    locationState: Location | undefined;
    location: Location | undefined;
  }) => {
    {
      locationState && console.log(locationState[locationIndex]);
    }

    return (
      <Card
        key={locationIndex}
        className="col-span-1 h-fit bg relative w-5/6 sm:w-full"
      >
        <CardContent className="">
          <h3 className={locationHeadings[locationIndex]?.style || ""}>
            {locationHeadings[locationIndex]?.text || ""}
          </h3>
          <ul>
            <li className={`${zilla.className}`}>
              {showAddressChange ? (
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
              ) : (
                <div className="text-[1rem] truncate w-full">
                  {address
                    ? `${address[0]}, ${address[1]}, ${address[2]}, ${address[3]}`
                    : null}
                </div>
              )}
            </li>
          </ul>

          <div className="flex flex-col gap-2 mt-2 font-light w-full">
            {showAddressChange ? (
              <div className="flex w-full gap-2">
                <Button
                  onClick={handleCancelAddressChange}
                  className="w-1/2 font-light"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAddress}
                  className="w-1/2 font-light"
                >
                  Confirm
                </Button>
              </div>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger className="text-white bg-primary font-extralight h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    Change Hours
                  </DialogTrigger>
                  <DialogContent className="bg">
                    {locationState && (
                      <SliderSelection
                        hours={hours}
                        index={locationIndex}
                        location={
                          location as unknown as {
                            0: {
                              type: string;
                              coordinates: number[];
                              address: string[];
                              hours: Prisma.JsonValue;
                            } | null;
                            1: {
                              type: string;
                              coordinates: number[];
                              address: string[];
                              hours: Prisma.JsonValue;
                            } | null;
                            2: {
                              type: string;
                              coordinates: number[];
                              address: string[];
                              hours: Prisma.JsonValue;
                            } | null;
                          }
                        }
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  className="font-extralight"
                  onClick={handleShowAddressChange}
                >
                  Change Address
                </Button>
                <Dialog>
                  <DialogTrigger>
                    <PiTrashSimple className="text-red-500 font-extralight absolute top-2 right-2" />
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      Are you sure you want to delete this location and hours?
                      This action is irreversible
                      <Button
                        onClick={() => handleDeleteLocation(locationIndex)}
                      >
                        I'm sure
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
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
              <li className={`${zilla.className}`}>
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
        <>
          <Card
            className="col-span-1 h-full bg relative w-5/6 sm:w-full"
            onClick={() => {
              setShowAddLocationCard(true);
            }}
          >
            <CardContent className="flex flex-col justify-center items-center h-full">
              <IoIosAdd className="text-7xl" />
              <h2 className="text-lg mt-2 font-bold">New Location & Hours</h2>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const HoursLocationContainer = ({ location, apiKey, role }: LocationProps) => {
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

  const renderLocationCards = () => {
    const nonNullLocations = Object.entries(locationState || {}).filter(
      ([_, value]) => value !== null
    );
    const max = role === UserRole.COOP ? 3 : 1;
    const handleAddLocation = useCallback(
      async (newAddress: string[]) => {
        const updatedAddress = newAddress.join(", ");
        console.log(updatedAddress);
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
    return (
      <div
        className={`grid grid-rows-${
          nonNullLocations.length < max
            ? nonNullLocations.length + 1
            : nonNullLocations.length
        } sm:grid-cols-3 xl:grid-cols-4 gap-4`}
      >
        {nonNullLocations.map(([key, locationData], locationIndex) => {
          const handleAddressChange = (index: number, value: string) => {
            setAddresses((prevAddresses) => ({
              ...prevAddresses,
              [Number(key)]: prevAddresses[Number(key)]
                ? [...prevAddresses[Number(key)]]
                : [...locationData.address],
              [Number(key)]: [
                ...prevAddresses[Number(key)].slice(0, index),
                value,
                ...prevAddresses[Number(key)].slice(index + 1),
              ],
            }));
          };

          return (
            <CardComponent
              key={key}
              locationIndex={locationIndex}
              address={addresses[Number(key)] || locationData.address}
              coordinates={locationData.coordinates}
              showAddressChange={selectedLocation === Number(key)}
              handleAddressChange={handleAddressChange}
              handleSaveAddress={() => handleSaveAddress(Number(key))}
              handleCancelAddressChange={() => handleCancelAddressChange()}
              handleDeleteLocation={() => handleDeleteLocation(locationIndex)}
              handleShowAddressChange={() =>
                handleShowAddressChange(Number(key))
              }
              hours={locationData?.hours}
              locationState={locationState}
              location={location}
            />
          );
        })}
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

  return (
    <>
      <div className="">{renderLocationCards()}</div>
    </>
  );
};

export default HoursLocationContainer;
const post = async (data: Location | undefined) => {
  try {
    const response = await axios.post("/api/update", { location: data });
    return response.data;
  } catch (error) {
    toast.error("There was an error updating your location or hours");
  }
};
