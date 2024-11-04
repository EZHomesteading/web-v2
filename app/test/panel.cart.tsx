import { ReactNode } from "react";
import { motion, AnimatePresence, MotionStyle } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/app/(no-nav_layout)/new-location-and-hours/_components/map";
import { PiCalendarBlankThin } from "react-icons/pi";
import { Location } from "@prisma/client";
import { outfitFont } from "@/components/fonts";
import TimePicker from "./time.picker.cart";
import { DeliveryPickupToggleMode } from "../(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";

export interface PanelProps {
  content: ReactNode;
  onClose: () => void;
}

interface StackingPanelLayoutProps {
  children: ReactNode;
  panelSide: boolean;
  mainContentVariants: any;
  location?: Location;
  mode?: DeliveryPickupToggleMode;
  mk: string;
  isBasePanelOpen: boolean;
  setIsBasePanelOpen: (isOpen: boolean) => void;
  handleTimeChange: any;
}

const PanelCart: React.FC<StackingPanelLayoutProps> = ({
  children,
  panelSide,
  mainContentVariants,
  location,
  mode,
  mk,
  isBasePanelOpen,
  setIsBasePanelOpen,
  handleTimeChange,
}) => {
  const getPanelStyle = (index: number): MotionStyle => {
    const darkenColor = (color: string, amount: number): string => {
      const hex = color.replace("#", "");
      const rgb = parseInt(hex, 16);
      const r = Math.max(0, (rgb >> 16) - amount);
      const g = Math.max(0, ((rgb >> 8) & 0x00ff) - amount);
      const b = Math.max(0, (rgb & 0x0000ff) - amount);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const darkenAmount = 50;

    const baseStyle: MotionStyle = {
      position: index === 0 ? "relative" : "absolute",
      width: "384px",
      height: "120%",
      zIndex: 50 + index,
      top: index === 0 ? 0 : `${index * 2}px`,
      right: 0,
      backgroundColor: `${darkenColor(
        "#fff",
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

  const basePanel: PanelProps = {
    content: (
      <div
        className={`${outfitFont.className} flex justify-center w-full mt-2`}
      >
        <div className={`w-full sm:w-2/3 md:w-1/2 ${panelSide && "!w-full"}`}>
          {!panelSide && (
            <Button
              onClick={() => {
                setIsBasePanelOpen(false);
              }}
              className="w-full my-2 border py-8 justify-between flex relative"
            >
              <div className="text-md sm:text-xl font-light">
                View Seller Calendar
              </div>
              <PiCalendarBlankThin size={40} className="absolute right-1" />
            </Button>
          )}
          <TimePicker
            value={`9:00 AM`}
            onChange={handleTimeChange}
            mode={mode}
          />
          <div className="mt-5">
            {location && (
              <Map
                center={{
                  lat: location?.coordinates[1] || 38,
                  lng: location?.coordinates[0] || -79,
                }}
                mk={mk}
                showSearchBar={false}
                w={400}
                h={350}
                z={14}
                maxZ={14}
                minZ={14}
                subtitle=""
              />
            )}
            <div className="text-xs font-light text-center pt-2">
              Approximate location shown for privacy; exact address provided
              upon {mode === "DELIVERY" ? "delivery time" : "pickup time"}{" "}
              agreement and payment.
            </div>
          </div>
        </div>
      </div>
    ),
    onClose: () => {
      setIsBasePanelOpen(false);
    },
  };

  const allPanels = [basePanel];

  return (
    <div className="flex flex-row border-t min-h-screen overflow-hidden">
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
                className={`bg-white border-l overflow-y-auto ${
                  panelSide ? "w-96" : "fixed bottom-0 left-0 right-0"
                }`}
                style={getPanelStyle(index)}
                initial={panelSide ? { x: 384, y: index } : { y: "100%" }}
                animate={panelSide ? { x: 0, y: index } : { y: 0 }}
                exit={panelSide ? { x: 384, y: index } : { y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className={`px-6 relative`}>
                  <button
                    onClick={() => setIsBasePanelOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close panel"
                  >
                    <X size={24} />
                  </button>
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

export default PanelCart;
