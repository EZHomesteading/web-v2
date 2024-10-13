import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import { X } from "lucide-react";
import { LocationSelector } from "./location-selector";
import { Button } from "@/app/components/ui/button";
import Map from "@/app/onboard/map";
import { PiCalendarBlankThin } from "react-icons/pi";
import axios from "axios";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
export interface PanelProps {
  content: ReactNode;
  onClose: () => void;
}

interface StackingPanelLayoutProps {
  children: ReactNode;
  panels: PanelProps[];
  panelSide: boolean;
  mainContentVariants: any;
  panelVariants: any;
  location: any;
  index: number;
  mk: string;
  isBasePanelOpen: boolean;
  setIsBasePanelOpen: (isOpen: boolean) => void;
}

const StackingPanelLayout: React.FC<StackingPanelLayoutProps> = ({
  children,
  panels,
  panelSide,
  panelVariants,
  mainContentVariants,
  location,
  index,
  mk,
  isBasePanelOpen,
  setIsBasePanelOpen,
}) => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const router = useRouter();
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
        console.log("lat", lat, "lng", lng);
        return { lat, lng };
      } else {
        throw new Error("Geocoding failed");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleSaveAddress = async () => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
    const geoResult = await getLatLngFromAddress(fullAddress);

    if (geoResult) {
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
              coordinates: [geoResult.lng, geoResult.lat],
              type: "Point",
              role: location.role,
              hours: location.hours,
            },
          ],
          locationIndex: index,
        };

        console.log("Data being sent:", JSON.stringify(dataToSend, null, 2));

        const response = await axios.post(
          "/api/useractions/update/location-hours",
          dataToSend
        );

        if (response.status === 200) {
          setShowEditAddres(false);
          router.refresh();
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
      height: "100%",
      zIndex: 50 + index,
      top: index === 0 ? 0 : `${index * 40}px`,
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
  const [showEditAddres, setShowEditAddres] = React.useState(false);

  const allPanels = [
    {
      content: (
        <div className="flex justify-center w-full">
          <div className={`w-full sm:w-2/3 md:w-1/2 ${panelSide && "!w-full"}`}>
            {!panelSide && (
              <Button
                onClick={() => {
                  setIsBasePanelOpen(false);
                }}
                className="w-full mb-2 border py-8 justify-between flex relative"
              >
                <div className="text-md sm:text-xl font-light">
                  View Calendar & Edit Hours
                </div>
                <PiCalendarBlankThin size={40} className="absolute right-1" />
              </Button>
            )}
            <div className="flex flex-col justify-between">
              <div>
                <LocationSelector index={index} />
                {showEditAddres ? (
                  <>
                    <div className="border w-full mt-2 rounded-t-xl rounded-b-xl bg-inherit ring-transparent shadow-sm">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full rounded-t-xl border-x bg-inherit text-2xl px-3 pb-5 pt-7 font-bold"
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
                    </div>
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
                        setShowEditAddres(false);
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
                      setShowEditAddres(true);
                    }}
                  >
                    Edit Address
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-5">
              <Map
                center={{
                  lat: location?.coordinates[1],
                  lng: location?.coordinates[0],
                }}
                mk={mk}
                showSearchBar={false}
                w={400}
                h={600}
              />
            </div>
          </div>
        </div>
      ),
      onClose: () => setIsBasePanelOpen(false),
    },
    ...panels,
  ];

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
                <div className="p-6 relative">
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
