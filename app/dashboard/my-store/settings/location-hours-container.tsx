import React, { memo, useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import SliderSelection from "./slider-selection";
import { Zilla_Slab } from "next/font/google";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import { Location } from "@/next-auth";

const zilla = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});

interface LocationProps {
  location?: Location | undefined;
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

const HoursLocationContainer = ({ location }: LocationProps) => {
  // const { location } = user || {};
  const [index, setIndex] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<{ [key: number]: any }>({});
  console.log("BEANS 144", location);
  useEffect(() => {
    console.log("BEANS");
    if (location) {
      console.log("BEANS");
      let initialAddresses: { [key: number]: string[] } = {};
      Object.entries(location).forEach(([key, value]) => {
        if (value === null) {
          return;
        }
        console.log("BEANS 153", value.address);
        initialAddresses[Number(key)] = value.address;
      });
      //console.log("BEANS", initialAddresses);
      setAddresses(initialAddresses);
    }
  }, [location]);

  const handleShowAddressChange = (locationIndex: number) => {
    setSelectedLocation(locationIndex);
  };

  const handleCancelAddressChange = (locationIndex: number) => {
    if (location) {
      const locationarr = Object.entries(location);
      const locationObj = locationarr[locationIndex]?.[1];
      setAddresses((prevAddresses) => ({
        ...prevAddresses,
        [locationIndex]: locationObj.address || [],
      }));
      setSelectedLocation(null);
    }
  };

  const handleSaveAddress = (locationIndex: number) => {
    // Update the user's location in the state or make an API call to update it on the server
    // For example: updateUserLocation(locationIndex, { address: addresses[locationIndex] });
    setSelectedLocation(null);
  };

  const renderLocationCards = () => {
    //console.log(location);
    if (location) {
      //console.log(location[0]);

      return (
        <div
          className={`grid grid-rows-${
            Object.entries(location).length
          } sm:grid-cols-5 gap-4`}
        >
          {Object.entries(location).map(
            (locationData: any, locationIndex: number) => {
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
            }
          )}
        </div>
      );
    }
    return <div>No locations found.</div>;
  };

  const renderSliderSection = () => {
    return (
      <>
        <SliderSelection user={location} index={index} />
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
