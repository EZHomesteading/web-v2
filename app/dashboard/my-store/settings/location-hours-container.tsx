import React, { memo, useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import SliderSelection from "./slider-selection";
import { Zilla_Slab } from "next/font/google";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { HoursDisplay } from "@/app/components/co-op-hours/hours-display";
import { PiTrashSimple } from "react-icons/pi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { IoIosAdd } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";
interface LocationData {
  type: string;
  coordinates?: number[];
  address: string[];
  hours: any;
}
interface Location {
  [key: number]: LocationData | undefined;
}
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
      <Card key={locationIndex} className="col-span-1 h-fit bg relative">
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
                  <SheetTrigger className="text-white bg-primary font-extralight h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
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
                <Dialog>
                  <DialogTrigger>
                    <PiTrashSimple className="text-red-500 font-extralight absolute top-2 right-2" />
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      Are you sure you want to delete this location and hours?
                      This action is irreversible
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

const HoursLocationContainer = ({ location }: LocationProps) => {
  const [index, setIndex] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<{ [key: number]: any }>({});
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
    setSelectedLocation(null);
  };

  const renderLocationCards = () => {
    const nonNullLocations = Object.entries(locationState || {}).filter(
      ([_, value]) => value !== null
    );

    const renderAddLocationCard = () => {
      const [newAddress, setNewAddress] = useState(["", "", "", ""]);
      const [showAddLocationCard, setShowAddLocationCard] = useState(false);
      const handleAddressChange = (index: number, value: string) => {
        setNewAddress((prevAddress) => [
          ...prevAddress.slice(0, index),
          value,
          ...prevAddress.slice(index + 1),
        ]);
      };

      const handleAddLocation = useCallback(() => {
        const newLocationIndex = Object.values(locationState || {}).findIndex(
          (location) => location === null || location === undefined
        );

        if (newLocationIndex !== -1) {
          const parsedAddress = {
            type: "Point",
            coordinates: [],
            address: newAddress,
            hours: null,
          };

          setLocationState((prevLocation) => {
            const newLocation = { ...prevLocation };
            newLocation[newLocationIndex] = parsedAddress;
            return newLocation;
          });

          console.log("location at submit", locationState);
          setNewAddress(["", "", "", ""]);
          setShowAddLocationCard(false);

          postDataToDatabase({
            ...locationState,
            [newLocationIndex]: parsedAddress,
          })
            .then(() => {
              // window.location.replace("/dashboard/my-store/settings");
              toast.success("Your account details have changed");
            })
            .catch((error) => {
              toast.error(error.message);
            });
        } else {
          toast.error("Maximum number of locations reached");
        }
      }, [locationState, setLocationState, newAddress]);

      const postDataToDatabase = async (data: Location | undefined) => {
        console.log("data", data);
        try {
          const response = await axios.post("/api/update", { location: data });
          return response.data;
        } catch (error) {}
      };

      return (
        <div>
          {showAddLocationCard ? (
            <Card className="col-span-1 h-fit bg relative">
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
                  <Button
                    onClick={handleAddLocation}
                    className="font-light w-1/2"
                  >
                    Add Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card
                className="col-span-1 h-full bg relative"
                onClick={() => {
                  setShowAddLocationCard(true);
                }}
              >
                <CardContent className="flex flex-col justify-center items-center h-full">
                  <IoIosAdd className="text-7xl" />
                  <h2 className="text-lg mt-2 font-bold">
                    Add New Location & Hours
                  </h2>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      );
    };
    return (
      <div
        className={`grid grid-rows-${
          nonNullLocations.length < 3
            ? nonNullLocations.length + 1
            : nonNullLocations.length
        } sm:grid-cols-5 gap-4`}
      >
        {nonNullLocations.map(([key, locationData], locationIndex) => {
          const handleAddressChange = (index: number, value: any) => {
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

          const handleLocationClick = () => {
            setIndex(Number(key));
          };

          const handleDeleteLocation = () => {};

          return (
            <CardComponent
              key={key}
              locationIndex={locationIndex}
              address={addresses[Number(key)] || locationData.address}
              showAddressChange={selectedLocation === Number(key)}
              handleAddressChange={handleAddressChange}
              handleSaveAddress={() => handleSaveAddress(Number(key))}
              handleCancelAddressChange={() =>
                handleCancelAddressChange(Number(key))
              }
              handleLocationClick={handleLocationClick}
              handleDeleteLocation={handleDeleteLocation}
              handleShowAddressChange={() =>
                handleShowAddressChange(Number(key))
              }
              hours={locationData?.hours}
            />
          );
        })}
        {nonNullLocations.length < 3 && renderAddLocationCard()}
      </div>
    );
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
