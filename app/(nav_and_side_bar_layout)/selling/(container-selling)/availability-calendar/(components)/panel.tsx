import React, { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PiCalendarBlankThin,
  PiMapPin,
  PiMapTrifold,
  PiPlus,
  PiPlusBold,
  PiTrash,
} from "react-icons/pi";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { LocationSelector } from "./helper-components-calendar";
import { useCurrentRole } from "@/hooks/user/use-current-role";
import { toast } from "sonner";
import { Location } from "@prisma/client";
import Link from "next/link";
import SetDefaultButton from "./set-default-button";
import { OutfitFont } from "@/components/fonts";
import ListingMap from "@/components/map/listing-map";
import Toast from "@/components/ui/toast";
import Alert from "@/components/ui/custom-alert";

export interface PanelProps {
  content: ReactNode;
  onClose: () => void;
}

interface StackingPanelLayoutProps {
  children: ReactNode;
  panels: PanelProps[];
  panelSide: boolean;
  mainContentVariants: any;
  location?: Location;
  id?: string;
  mk: string;
  isBasePanelOpen: boolean;
  setIsBasePanelOpen: (isOpen: boolean) => void;
  onPanelClose: () => void;
  locations: Location[];
  userId?: string;
}

const StackingPanelLayout: React.FC<StackingPanelLayoutProps> = ({
  children,
  panels,
  panelSide,
  mainContentVariants,
  location,
  id,
  mk,
  isBasePanelOpen,
  setIsBasePanelOpen,
  onPanelClose,
  locations,
  userId,
}) => {
  const router = useRouter();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [displayName, setDisplayName] = useState(location?.displayName);
  const [validDisplayName, setValidDisplayName] = useState(displayName);
  const [geoResult, setGeoResult] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const getLatLngFromAddress = async (address: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${mk}&loading=async&libraries=places`;

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
  const userRole = useCurrentRole();

  const handleSaveAddress = async () => {
    if (locations.length >= 5) {
      Toast({ message: "Sellers may have up to five locations" });
      return;
    }

    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
    const newGeoResult = await getLatLngFromAddress(fullAddress);
    setGeoResult(newGeoResult);
    let hours = null;
    let role = userRole;
    let text = "New store location added";
    if (location) {
      hours = location?.hours;
      role = location?.role;
      text = "Your store location has been updated";
    }
    if (newGeoResult) {
      try {
        const dataToSend = {
          location: [
            {
              ...location,
              address: [
                address.street,
                address.city,
                address.state,
                address.zip,
              ],
              coordinates: [newGeoResult.lng, newGeoResult.lat],
              type: "Point",
              role: role,
              hours: hours,
            },
          ],
          locationId: location?.id,
        };

        const response = await axios.post(
          "/api/useractions/update/location-hours",
          dataToSend
        );

        if (response.status === 200) {
          const newLocation = response.data.locations?.[0];
          const locationId = newLocation?.id;
          console.log(locationId);
          if (locationId) {
            setShowEditAddress(false);
            window.location.replace(
              `/selling/availability-calendar/${locationId}`
            );
            toast.success(text);
          } else {
            throw new Error("Location ID not found in the response");
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error updating address:", error.response?.data);
        } else {
          console.error("Error updating address:", error);
        }
      }
    } else {
      console.error("Geocoding failed");
    }
  };
  const getPanelStyle = (index: number): MotionStyle => {
    const darkenColor = (color: string, amount: number): string => {
      const hex = color.replace("#", "");
      const rgb = parseInt(hex, 16);
      const r = Math.max(0, (rgb >> 16) - amount);
      const g = Math.max(0, ((rgb >> 8) & 0x00ff) - amount);
      const b = Math.max(0, (rgb & 0x0000ff) - amount);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const baseColor = "#ced9bb";
    const darkenAmount = 50;

    const baseStyle: MotionStyle = {
      position: index === 0 ? "relative" : "absolute",
      width: "384px",
      height: "120%",
      zIndex: 50 + index,
      top: index === 0 ? 0 : `${index * 2}px`,
      right: 0,
      backgroundColor: `${darkenColor(
        baseColor,
        index * darkenAmount
      )} !important` as any,
    };

    if (!panelSide) {
      return {
        ...baseStyle,
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        top: "auto",
      };
    }

    return baseStyle;
  };

  const [showEditAddress, setShowEditAddress] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/selling/availability-calendar/new-location") {
      setShowEditAddress(true);
    }
  }, [pathname]);

  const handleDeleteLocation = async () => {
    try {
      const response = await axios.delete(
        "/api/useractions/update/location-hours/delete-location",
        {
          data: { locationId: location?.id },
        }
      );
      if (response.status === 200) {
        Toast({ message: "Store location deleted" });
        window.location.replace("/selling/availability-calendar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function updateDisplayName() {
    const validCharPattern = /^[A-Za-z0-9\-._~' ]+$/;

    if (!displayName) {
      Toast({
        message: "Please enter a display name",
      });
      return;
    }

    if (displayName?.length < 1) {
      Toast({ message: "Display name must be at least 1 character long" });
      return;
    }

    if (displayName.length > 40) {
      Toast({
        message: "Display name cannot exceed 40 characters",
        details: <>Current name is {displayNameLength} characters</>,
      });

      return;
    }

    if (!validCharPattern.test(displayName)) {
      Toast({
        message:
          "Display name can only contain letters, numbers, dashes, periods, underscores, spaces, apostrophes, and tildes",
      });
      return;
    }

    try {
      const dataToSend = {
        location: [
          {
            ...location,
            displayName: displayName,
          },
        ],
        locationId: location?.id,
      };

      const response = await axios.post(
        "/api/useractions/update/location-hours",
        dataToSend
      );

      if (response.status === 200) {
        Toast({ message: "Updated Location Display Name" });
        setValidDisplayName(response.data.displayName);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating address:", error.response?.data);
      } else {
        console.error("Error updating address:", error);
      }
    }
  }
  const displayNameLength = displayName?.length;
  const basePanel: PanelProps = {
    content: (
      <div className={` flex justify-center w-full pt-2`}>
        <div
          className={`w-full sm:w-2/3 md:w-1/2 relative h-full ${
            panelSide && "!w-full"
          }`}
        >
          {!panelSide && (
            <Button
              onClick={() => {
                setIsBasePanelOpen(false);
              }}
              className="w-full px-2 sm:px-4 mb-2 text-base font-medium border py-8 justify-between flex relative"
            >
              <div>View Calendar & Edit Hours</div>
              <PiCalendarBlankThin className="absolute right-1 top-5 h-6 w-6" />
            </Button>
          )}
          <div className="flex flex-col justify-between">
            <LocationSelector
              displayName={validDisplayName}
              id={id}
              address={location?.address}
              locations={locations}
              pathname={pathname}
            />
          </div>
          <button
            className="!text-base font-medium shadow-md relative flex justify-between w-full mt-2 border py-5 rounded-sm px-2 sm:px-4 bg-inherit text-black hover:text-white !border-black"
            onClick={() => {
              router.push(`/create?id=${location?.id}`);
            }}
          >
            Create Listing at this Location
            <PiPlus className={`absolute right-1 top-5 h-6 w-6`} />
          </button>
          <div className="mt-2 mb-32 relative">
            <Alert
              alertTriggerText="Edit Display Name"
              alertTriggerClassName="bg-inherit hover:text-white text-black !border-black !text-base font-semibold justify-start px-2 sm:px-4  !text-base font-medium shadow-md w-full my-2 border py-5 rounded-sm justify-between px-2 sm:px-4 flex relative bg-inherit text-black hover:text-white !border-black"
              headingText="New Location Display Name"
              headingClassName="text-sm"
              subtitleText=""
              confirmButtonText="Save"
              confirmButtonClassName="hover:bg-inherit text-black hover:text-white"
              cancelButtonText="Cancel"
              onClick={updateDisplayName}
              icon={
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  className={`h-6 w-6 absolute right-1 top-5`}
                  viewBox="0 0 1024 1024"
                  fillRule="evenodd"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M33.713 640c1.994 0 3.988-.2 5.982-.498l168.19-29.508c1.994-.399 3.888-1.296 5.284-2.792l423.915-423.875a9.927 9.927 0 0 0 0-14.056L470.888 2.891C468.994.997 466.5 0 463.809 0s-5.184.997-7.078 2.891L32.816 426.766c-1.495 1.496-2.393 3.29-2.791 5.284L.514 600.224c-1.894 11.066 1.495 21.932 9.372 29.807 6.58 6.48 14.954 9.969 23.827 9.969m51.743-85.433 15.653-88.922 362.7-362.667 73.278 73.271-362.7 362.667zM486.826 455.928c27.691-14.812 57.293-20.852 85.545-15.519 32.365 6.11 59.72 26.534 78.96 59.406 29.974 51.211 21.642 102.332-18.484 144.254-17.577 18.364-41.07 35.013-69.996 50.297l-.293.152.848.26c13.153 3.956 27.085 6.1 41.54 6.21l1.174.005c61.068 0 100.981-22.104 125.285-67.876 9.325-17.56 31.119-24.237 48.679-14.913 17.56 9.325 24.237 31.119 14.912 48.68-37.285 70.218-102.092 106.109-188.876 106.109-47.687 0-91.94-15.03-128.188-41.368l-1.056-.774-1.36.473c-46.18 15.996-98.732 29.945-155.37 41.932l-2.239.472c-48.571 10.217-97.257 18.377-139.154 23.957-19.709 2.625-37.813-11.224-40.438-30.932-2.625-19.709 11.224-37.813 30.932-40.438 40.196-5.353 87.126-13.22 133.84-23.045 42.799-9.002 83.011-19.134 119.357-30.342l.234-.074-.436-.693c-16.464-26.452-25.857-55.432-26.142-83.24l-.007-1.303c0-49.907 39.555-104.315 90.733-131.69m72.188 55.231c-10.74-2.027-24.099.699-38.228 8.257-29.546 15.804-52.693 47.643-52.693 68.202 0 18.206 8.889 40.146 24.71 59.736l.238.293 1.223-.514c39.17-16.581 68.483-34.271 85.929-52.186l.64-.663c18.735-19.573 21.386-35.842 8.36-58.1-9.059-15.475-19.03-22.92-30.18-25.025"
                      transform="translate(112 112)"
                    ></path>
                  </g>
                </svg>
              }
            >
              <div className="relative ">
                <input
                  type="text"
                  value={displayName || ""}
                  className={`overflow-x-auto w-full text-center bg-inherit text-sm py-8 font-bold rounded-lg focus:outline-none focus:ring-0 ${
                    displayNameLength && displayNameLength > 30
                      ? "!text-sm"
                      : displayNameLength && displayNameLength > 20
                      ? "!text-[1rem]"
                      : displayNameLength && displayNameLength > 20
                      ? "text-xl"
                      : "!text-2xl"
                  }`}
                  placeholder="Display Name"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </Alert>
            {showEditAddress ? (
              <>
                <div className="w-full mt-2 rounded-t-xl rounded-b-xl bg-inherit ring-transparent shadow-md">
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-x border-t !border-black  bg-inherit rounded-t-xl text-2xl px-3 pb-5 pt-7 font-bold"
                        onChange={(e) =>
                          handleAddressChange("street", e.target.value)
                        }
                      />
                      <div className="absolute top-1 left-3 text-neutral-500 font-light">
                        Street
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-x border-t !border-black bg-inherit text-2xl px-3 pb-5 pt-7 font-bold"
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                      />
                      <div className="absolute top-1 left-3 text-neutral-500 font-light">
                        City
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border-t border-x bg-inherit !border-black text-2xl px-3 pb-5 pt-7 font-bold"
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                      />
                      <div className="absolute top-1 left-3 text-neutral-500 font-light">
                        State
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full rounded-b-xl border bg-inherit  !border-black text-2xl px-3 pb-5 pt-7 font-bold"
                        onChange={(e) =>
                          handleAddressChange("zip", e.target.value)
                        }
                      />
                      <div className="absolute top-1 left-3 text-neutral-500 font-light">
                        Zip Code
                      </div>
                    </div>
                  </>
                </div>
                <div className={`flex items-center justify-center gap-x-2`}>
                  <button
                    className="!text-base font-medium shadow-md w-full my-2 border py-5 rounded-sm text-center px-2 sm:px-4 relative bg-inherit text-black hover:text-white !border-black"
                    onClick={() => {
                      setShowEditAddress(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="!text-base font-medium shadow-md w-full my-2 border py-5 rounded-sm text-center px-2 sm:px-4 relative bg-inherit text-black hover:text-white !border-black"
                    onClick={handleSaveAddress}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <button
                className="!text-base font-medium shadow-md w-full my-2 border py-5 rounded-sm justify-between px-2 sm:px-4 flex relative bg-inherit text-black hover:text-white !border-black"
                onClick={() => {
                  setShowEditAddress(true);
                }}
              >
                Edit Address
                <PiMapPin className={`absolute right-1 top-5 h-6 w-6`} />
              </button>
            )}
            {!location?.isDefault && (
              <SetDefaultButton
                street={location?.address[0]}
                userId={userId}
                locationId={location?.id}
                className="!text-base  font-medium w-full my-2 border py-5 rounded-sm justify-between px-2 sm:px-4 flex relative bg-inherit text-black hover:text-white !border-black shadow-md"
                title="Set as Default Location"
              />
            )}
            <button
              className="!text-base font-medium shadow-md w-full my-2 border py-5 rounded-sm justify-between px-2 sm:px-4 flex relative bg-inherit text-black hover:text-white !border-black"
              onClick={() => {
                setShowMap(!showMap);
              }}
            >
              {!showMap ? "View Location on" : "Hide"} Map
              <PiMapTrifold className={`absolute right-1 top-5 h-6 w-6`} />
            </button>
            {showMap && (
              <div className={`relative`}>
                <ListingMap
                  apiKey={mk}
                  lat={geoResult?.lat || location?.coordinates[1] || 38}
                  lng={geoResult?.lng || location?.coordinates[0] || -84}
                  scrollWheel={false}
                  gestureHandling="none"
                />
              </div>
            )}
            <p className={`text-red-500 text-center text-sm mt-3`}>
              Danger Zone
            </p>
            <Alert
              alertTriggerText="Delete Location"
              headingText="Are you sure?"
              alertTriggerClassName="!text-base  font-medium w-full my-2 border py-5 rounded-sm justify-between px-2 sm:px-4 flex relative text-black hover:text-white !border-black shadow-md"
              subtitleText="Once this location is deleted, all listings at this location will also be lost. Please move any listings you do not want to lose to a different locaiton."
              confirmButtonText="Delete"
              confirmButtonClassName={`shadow-md`}
              cancelButtonText="Cancel"
              onClick={handleDeleteLocation}
              icon={<PiTrash className={`absolute right-1 top-5 h-6 w-6`} />}
            />
          </div>{" "}
        </div>
      </div>
    ),
    onClose: () => {
      if (!panelSide) {
        setIsBasePanelOpen(false);
      }
      onPanelClose();
    },
  };

  const allPanels = [basePanel, ...panels];

  return (
    <div className="flex flex-row sheet min-h-screen overflow-hidden">
      <motion.div
        className="flex-grow overflow-y-auto"
        variants={mainContentVariants}
        initial="closed"
        animate={isBasePanelOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isBasePanelOpen && (
          <motion.div
            className="relative"
            initial={{ width: 0 }}
            animate={{ width: "384px" }}
            exit={{ width: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {allPanels.map((panel, index) => (
              <motion.div
                key={index}
                className={`sheet border-l overflow-y-auto px-6 z mb-2 pt-6 md:pt-20 xl:pt-6 ${
                  panelSide ? "w-96" : "fixed bottom-0 left-0 right-0"
                }`}
                style={getPanelStyle(index)}
                initial={panelSide ? { x: 384, y: index } : { y: "100%" }}
                animate={panelSide ? { x: 0, y: index } : { y: 0 }}
                exit={panelSide ? { x: 384, y: index } : { y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {index > 0 && (
                  <button
                    onClick={panel.onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close panel"
                  >
                    <X size={24} />
                  </button>
                )}
                {panel.content}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StackingPanelLayout;
