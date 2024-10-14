import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Map from "@/app/onboard/map";
import { PiCalendarBlankThin } from "react-icons/pi";
import axios from "axios";
import { useRouter } from "next/navigation";
import LocationSearchInput from "@/app/components/map/LocationSearchInput";
import { LocationSelector, o } from "./helper-components-calendar";
import { useCurrentRole } from "@/hooks/user/use-current-role";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Location } from "@prisma/client";
export interface PanelProps {
  content: ReactNode;
  onClose: () => void;
}

interface StackingPanelLayoutProps {
  children: ReactNode;
  panels: PanelProps[];
  panelSide: boolean;
  mainContentVariants: any;
  location: any;
  id: string;
  mk: string;
  isBasePanelOpen: boolean;
  setIsBasePanelOpen: (isOpen: boolean) => void;
  onPanelClose: () => void;
  locations: Location[];
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
}) => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const router = useRouter();
  const [geoResult, setGeoResult] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
          locationId: id,
        };

        const response = await axios.post(
          "/api/useractions/update/location-hours",
          dataToSend
        );

        if (response.status === 200) {
          setShowEditAddress(false);
          router.refresh();
          toast.success(text);
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
    const darkenAmount = 10;

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
  const [showEditAddress, setShowEditAddress] = React.useState(false);

  const [enterManually, setEnterManually] = useState(false);
  const [a, b] = useState("");
  const basePanel: PanelProps = {
    content: (
      <div className="flex justify-center w-full">
        <div className={`w-full sm:w-2/3 md:w-1/2 ${panelSide && "!w-full"}`}>
          {!panelSide && (
            <Button
              onClick={() => {
                setIsBasePanelOpen(false);
              }}
              className="w-full my-2 border py-8 justify-between flex relative"
            >
              <div className="text-md sm:text-xl font-light">
                View Calendar & Edit Hours
              </div>
              <PiCalendarBlankThin size={40} className="absolute right-1" />
            </Button>
          )}
          <div className="flex flex-col justify-between">
            <div>
              <LocationSelector
                id={id}
                panelSide={panelSide}
                address={location?.address}
                locations={locations}
              />
              {showEditAddress ? (
                <>
                  <div className="w-full mt-2 rounded-t-xl rounded-b-xl bg-inherit ring-transparent shadow-sm">
                    {!enterManually ? (
                      <>
                        {/* <div className="relative">
                          <LocationSearchInput
                            className="w-full rounded-xl border bg-inherit text-2xl px-3 pb-5 pt-7 font-bold"
                            apiKey={mk}
                            address={a}
                            onLocationSelect={() => {
                              setAddress(address);
                            }}
                            setAddress={b}
                            showIcon={false}
                          />
                          <div className="absolute top-1 left-3 text-neutral-500 font-light">
                            Address
                          </div>
                        </div> */}
                        <Button
                          className="w-full bg-slate-500 px-5 py-7 mt-2 text-3xl font-extralight shadow-md"
                          onClick={handleSaveAddress}
                        >
                          Save Changes
                        </Button>
                        <Button
                          className="w-full px-5 py-7 mt-2 text-3xl font-extralight bg-inherit shadow-md"
                          variant={`outline`}
                          onClick={() => {
                            setEnterManually(true);
                          }}
                        >
                          Enter Manually
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border-x border-t bg-inherit rounded-t-xl text-2xl px-3 pb-5 pt-7 font-bold"
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
                            className="w-full border-x border-t bg-inherit text-2xl px-3 pb-5 pt-7 font-bold"
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
                            className="w-full border-t border-x bg-inherit text-2xl px-3 pb-5 pt-7 font-bold"
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
                            className="w-full rounded-b-xl border bg-inherit text-2xl px-3 pb-5 pt-7 font-bold"
                            onChange={(e) =>
                              handleAddressChange("zip", e.target.value)
                            }
                          />
                          <div className="absolute top-1 left-3 text-neutral-500 font-light">
                            Zip Code
                          </div>
                        </div>
                        <Button
                          className="w-full bg-slate-500 px-5 py-7 mt-2 text-3xl font-extralight shadow-md"
                          onClick={handleSaveAddress}
                        >
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    className="w-full px-5 py-7 mt-2 text-3xl font-extralight bg-inherit shadow-md"
                    variant={`outline`}
                    onClick={() => {
                      setEnterManually(false);
                      setShowEditAddress(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full px-5 py-7 mt-2 text-3xl font-extralight bg-inherit shadow-md select-none"
                  variant={`outline`}
                  onClick={() => {
                    setShowEditAddress(true);
                  }}
                >
                  Edit Address
                </Button>
              )}
            </div>
          </div>
          <div className="mt-5">
            {(geoResult || location) && (
              <Map
                center={{
                  lat: geoResult?.lat || location?.coordinates[1],
                  lng: geoResult?.lng || location?.coordinates[0],
                }}
                mk={mk}
                showSearchBar={false}
                w={400}
                h={350}
              />
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full my-2 border py-8 justify-center text-center flex relative bg-red-500/80">
                <div className="text-md sm:text-xl font-light">
                  Delete Location
                </div>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={`${o.className} sheet p-3 h-64 w-72 rounded-xl border`}
            >
              <div className="text-2xl">Are you sure?</div>
              <div className="text-sm">
                Once a location is deleted, all listings with its location will
                also be lost. Please move any listings you do not want to lose
                to a different locaiton.
              </div>
              <div className="flex items-center justify-between w-full">
                <Button className="bg-red-500/80 text-white">Delete</Button>
                <AlertDialogCancel className="bg-inherit border h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  {" "}
                  Cancel
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
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
                className={`sheet border-l overflow-y-auto border-t ${
                  panelSide ? "w-96" : "fixed bottom-0 left-0 right-0"
                }`}
                style={getPanelStyle(index)}
                initial={panelSide ? { x: 384, y: index } : { y: "100%" }}
                animate={panelSide ? { x: 0, y: index } : { y: 0 }}
                exit={panelSide ? { x: 384, y: index } : { y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className={`px-6 relative`}>
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
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StackingPanelLayout;
