import React, { memo, useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import SliderSelection from "./slider-selection";
import { Zilla_Slab } from "next/font/google";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";

const zilla = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});

interface LocationProps {
  user: {
    location: {
      address: string[];
      hours?: any;
      coordinates?: any;
    }[];
  };
}

const locationHeadings = [
  { text: "Default Location", style: "text-2xl mt-2 font-bold" },
  { text: "Secondary Location", style: "text-2xl mt-2 font-semibold" },
  { text: "Tertiary Location", style: "text-2xl mt-2 font-medium" },
];

const CardComponent = memo(
  ({
    locationIndex,
    address,
    handleAddressChange,
    handleSaveAddress,
    showAddressChange,
    handleCancelAddressChange,
    handleLocationClick,
    handleDeleteLocation,
    handleShowAddressChange,
    hours,
  }: {
    locationIndex: number;
    address: string[];
    handleAddressChange: (index: number, value: string) => void;
    handleSaveAddress: () => void;
    showAddressChange: boolean;
    handleCancelAddressChange: () => void;
    handleLocationClick: () => void;
    handleDeleteLocation: () => void;
    handleShowAddressChange: () => void;
    hours: any;
  }) => {
    return (
      <Card key={locationIndex} className="col-span-1 h-fit bg">
        <CardContent>
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
                <div className="text-[1rem] overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {`${address[0]}, ${address[1]}, ${address[2]}, ${address[3]}`}
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
                <Sheet>
                  <SheetTrigger className="text-white bg-slate-900 font-extralight">
                    Visualize Hours
                  </SheetTrigger>
                  <SheetContent className="flex flex-col items-center justify-center border-none sheet h-screen w-screen">
                    <HoursDisplay coOpHours={hours} />
                  </SheetContent>
                </Sheet>
                <Button
                  className="font-extralight"
                  onClick={handleLocationClick}
                >
                  Change Hours
                </Button>
                <Button
                  className="font-extralight"
                  onClick={handleShowAddressChange}
                >
                  Change Address
                </Button>
                <Button
                  className="bg-red-950 font-extralight"
                  onClick={handleDeleteLocation}
                >
                  Delete Location & Hours
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

const HoursLocationContainer = ({ user }: LocationProps) => {
  const { location } = user || {};
  const [index, setIndex] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
    if (location) {
      const initialAddresses: { [key: number]: string[] } = {};
      location.forEach((loc, index) => {
        initialAddresses[index] = loc.address;
      });
      setAddresses(initialAddresses);
    }
  }, [location]);

  const handleShowAddressChange = (locationIndex: number) => {
    setSelectedLocation(locationIndex);
  };

  const handleCancelAddressChange = (locationIndex: number) => {
    setAddresses((prevAddresses) => ({
      ...prevAddresses,
      [locationIndex]: location?.[locationIndex].address || [],
    }));
    setSelectedLocation(null);
  };

  const handleSaveAddress = (locationIndex: number) => {
    // Update the user's location in the state or make an API call to update it on the server
    // For example: updateUserLocation(locationIndex, { address: addresses[locationIndex] });
    setSelectedLocation(null);
  };

  const renderLocationCards = () => {
    if (location && location.length > 0) {
      return (
        <div
          className={`grid grid-rows-${location.length} sm:grid-cols-5 gap-4`}
        >
          {location.map((locationData: any, locationIndex: number) => {
            const handleAddressChange = (index: number, value: string) => {
              setAddresses((prevAddresses) => ({
                ...prevAddresses,
                [locationIndex]: prevAddresses[locationIndex]
                  ? [...prevAddresses[locationIndex]]
                  : [...locationData.address],
                [locationIndex]: [
                  ...prevAddresses[locationIndex].slice(0, index),
                  value,
                  ...prevAddresses[locationIndex].slice(index + 1),
                ],
              }));
            };

            const handleLocationClick = () => {
              setIndex(locationIndex);
            };

            const handleDeleteLocation = () => {};

            return (
              <CardComponent
                key={locationIndex}
                locationIndex={locationIndex}
                address={addresses[locationIndex] || locationData.address}
                showAddressChange={selectedLocation === locationIndex}
                handleAddressChange={handleAddressChange}
                handleSaveAddress={() => handleSaveAddress(locationIndex)}
                handleCancelAddressChange={() =>
                  handleCancelAddressChange(locationIndex)
                }
                handleLocationClick={handleLocationClick}
                handleDeleteLocation={handleDeleteLocation}
                handleShowAddressChange={() =>
                  handleShowAddressChange(locationIndex)
                }
                hours={locationData?.hours}
              />
            );
          })}
        </div>
      );
    }
    return <div>No locations found.</div>;
  };

  const renderSliderSection = () => {
    return (
      <>
        <SliderSelection user={user} index={index} />
      </>
    );
  };

  return (
    <>
      {index === null ? (
        <div className="">{renderLocationCards()}</div>
      ) : (
        renderSliderSection()
      )}
    </>
  );
};

export default HoursLocationContainer;
