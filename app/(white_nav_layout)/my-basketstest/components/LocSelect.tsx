import React, { useRef, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import axios from "axios";

type GooglePlace = google.maps.places.Autocomplete;

interface LocationModalProps {
  open: boolean;
  onClose?: () => void;
}

interface Location {
  address: string;
  lat: number;
  lng: number;
}

const LocationModal: React.FC<LocationModalProps> = ({ open }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(open);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const startSearchBoxRef = useRef<GooglePlace | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen && autocompleteInputRef.current) {
      autocompleteInputRef.current.focus();
    }
  }, [isOpen]);

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    setSelectedLocation({
      address: place.formatted_address || "",
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  const handleSave = async () => {
    if (!selectedLocation) return;

    try {
      setIsSaving(true);
      await axios.post("/api/useractions/update/newlocation", {
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving location:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (selectedLocation) {
      setIsOpen(newOpen);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Popover Container */}
      <div className="relative flex left-[50%]  w-full h-full">
        <Popover open={true} onOpenChange={handleOpenChange}>
          <PopoverAnchor asChild>
            <div className="w-1 h-1" />
          </PopoverAnchor>

          <PopoverContent
            align="center"
            className="w-[500px] p-6 shadow-xl"
            style={{ zIndex: 51 }}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              autocompleteInputRef.current?.focus();
            }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  Set Your Location
                </h3>
                <p className="text-sm text-gray-600">
                  Please enter your address to use our routing features
                </p>{" "}
                <p className="text-sm text-gray-600">
                  This will be saved to your profile for use with later orders.
                </p>
              </div>

              <div>
                <Autocomplete
                  onLoad={(autocomplete: GooglePlace) => {
                    startSearchBoxRef.current = autocomplete;
                  }}
                  onPlaceChanged={() => {
                    if (startSearchBoxRef.current) {
                      const place = startSearchBoxRef.current.getPlace();
                      handlePlaceSelected(place);
                    }
                  }}
                  options={{
                    componentRestrictions: { country: "us" },
                    fields: ["formatted_address", "geometry", "name"],
                    types: ["address"],
                  }}
                >
                  <Input
                    ref={autocompleteInputRef}
                    type="text"
                    placeholder="Enter your address..."
                    className="w-full text-lg p-4 h-12"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Autocomplete>
              </div>

              {selectedLocation && (
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Selected address:
                    </p>
                    <p className="text-base font-medium">
                      {selectedLocation.address}
                    </p>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-12 text-lg"
                  >
                    {isSaving ? "Saving..." : "Save Location"}
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LocationModal;
