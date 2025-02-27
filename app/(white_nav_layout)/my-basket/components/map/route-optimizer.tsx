import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Location } from "@prisma/client";
import RouteOptimizer from "@/app/(white_nav_layout)/map/mapping/route-optimizer";
import { X } from "lucide-react";

interface RouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  googleMapsApiKey: string;
  initialLocation: number[];
  selectedTime: Date;
  setPickupTimes: any;
  setStartLoc: React.Dispatch<React.SetStateAction<any[]>>;
  setEndLoc: React.Dispatch<React.SetStateAction<any[]>>;
  startDelay: number;
}

const RouteOptimizerModal: React.FC<RouteOptimizerModalProps> = ({
  setStartLoc,
  setEndLoc,
  isOpen,
  onClose,
  locations,
  googleMapsApiKey,
  initialLocation,
  selectedTime,
  setPickupTimes,
  startDelay,
}) => {
  // Handler to prevent closing when clicking outside
  const handleOpenChange = (open: boolean) => {
    // Only allow closing through the explicit close button
    if (open === false && isOpen === true) {
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0"
        style={{ zIndex: 50 }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          return false;
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <button
          onClick={() => onClose()}
          className="absolute top-1 right-1 p-2 rounded-full hover:bg-gray-100 z-[9999999]"
        >
          <X size={24} />
        </button>
        <style jsx global>{`
          .pac-container {
            z-index: 9999999 !important;
            position: fixed !important;
            pointer-events: auto !important;
          }

          [role="dialog"] {
            z-index: 9999998 !important;
          }

          .google-maps-input {
            pointer-events: auto !important;
            position: relative !important;
            z-index: 9999998 !important;
          }
        `}</style>
        <div className="w-full h-full relative">
          <RouteOptimizer
            startDelay={startDelay}
            setEndLoc={setEndLoc}
            setStartLoc={setStartLoc}
            initialTime={selectedTime}
            locations={locations}
            googleMapsApiKey={googleMapsApiKey}
            initialLocation={initialLocation}
            onClose={onClose}
            isOpen={isOpen}
            setCartPickupTimes={setPickupTimes}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteOptimizerModal;
