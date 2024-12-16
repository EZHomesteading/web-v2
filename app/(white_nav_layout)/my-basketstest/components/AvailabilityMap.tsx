import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Circle, useLoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateToMMMDDAtHourMin } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { toast } from "sonner";
import useMediaQuery from "@/hooks/media-query";
import { Calendar } from "@/components/ui/calendar";
import TimePicker from "./time.picker";

interface LocationStatus {
  isOpen: boolean;
  willOpen: boolean;
  closesSoon: boolean;
  nextOpenTime?: string;
}

interface RandomizedPosition {
  originalLat: number;
  originalLng: number;
  randomLat: number;
  randomLng: number;
}

interface LocationStatuses {
  [key: string]: LocationStatus;
}

interface RandomizedPositions {
  [key: string]: RandomizedPosition;
}
interface DateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}
interface AvailabilityMapProps {
  mapsKey: string;
  locations: any[];
}
const convertTimeStringToMinutes = (timeString: string): number => {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;

  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    totalMinutes -= 12 * 60;
  }

  return totalMinutes;
};

const convertMinutesToTimeString = (minutes: number): string => {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};
const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onSelect,
  isOpen,
  onClose,
  triggerRef,
}) => {
  const [step, setStep] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const [tempTime, setTempTime] = useState(selectedTime);

  const handleDateSelect = (date: Date | undefined) => {
    setTempDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setTempTime(time);
  };

  const handleNext = () => {
    if (step === "date" && tempDate) {
      setStep("time");
    } else if (step === "time" && tempDate) {
      // Parse the time string into hours and minutes
      const [timeStr, period] = tempTime.split(" ");
      const [hours, minutes] = timeStr.split(":").map((num) => parseInt(num));

      // Convert to 24-hour format if PM
      let hour24 = hours;
      if (period === "PM" && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === "AM" && hours === 12) {
        hour24 = 0;
      }

      // Create a new date object with the selected date and time
      const dateWithTime = new Date(tempDate);
      dateWithTime.setHours(hour24);
      dateWithTime.setMinutes(minutes);
      dateWithTime.setSeconds(0);
      dateWithTime.setMilliseconds(0);

      onSelect(
        dateWithTime.toISOString().split("T")[0],
        `${hour24.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
      );
      onClose();
      setStep("date"); // Reset for next open
    }
  };
  const getInitialPosition = () => {
    if (!triggerRef.current) return { top: 0, left: 0, width: 0, height: 0 };
    const rect = triggerRef.current.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  };
  const over_640px = useMediaQuery("(min-width: 750px)");
  const getAnimatePosition = () => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();

    if (over_640px) {
      return {
        top: rect.bottom + 8,
        left: -20,
        width: 700,
        height: 550,
        opacity: 1,
      };
    }

    return {
      top: "4px",
      left: "4px",
      right: "4px",
      bottom: "4px",
      width: "calc(100% - 8px)",
      height: "calc(100% - 8px)",
      opacity: 1,
    };
  };

  const handleBack = () => {
    if (step === "time") {
      setStep("date");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed ${
              over_640px ? "sm:bg-transparent" : "bg-white/80 backdrop-blur-md"
            } inset-0 z-[100]`}
            onClick={onClose}
          />

          <motion.div
            initial={getInitialPosition()}
            animate={getAnimatePosition()}
            exit={getInitialPosition()}
            transition={{
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
              width: { duration: 0.2 },
            }}
            className="bg-white rounded-3xl border shadow-xl z-[101] fixed w-full max-w-[700px] mx-auto inset-0 h-[550px] overflow-hidden"
          >
            <div className="relative h-full bg-white rounded-3xl flex flex-col px-6 pb-6 pt-14">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-black bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold">
                  {step === "date" ? "Select Date" : "Select Time"}
                </h2>
                {tempDate && step === "time" && (
                  <p className="text-sm text-gray-500">
                    {tempDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="flex-1 flex flex-col items-center">
                {step === "date" ? (
                  <div className="w-full max-w-sm mx-auto">
                    <Calendar
                      mode="single"
                      selected={tempDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border shadow"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-sm mx-auto">
                    <TimePicker
                      top={false}
                      value={tempTime}
                      onChange={handleTimeSelect}
                      isOpen={true}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4">
                {step === "time" ? (
                  <Button variant="outline" onClick={handleBack}>
                    Back to Calendar
                  </Button>
                ) : (
                  <div /> // Empty div for spacing
                )}
                <Button
                  onClick={handleNext}
                  disabled={!tempDate || (step === "time" && !tempTime)}
                  className="flex items-center gap-2"
                >
                  {step === "date" ? "Next" : "Confirm"}
                  {step === "date" && <ChevronRight size={16} />}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
const AvailabilityMap: React.FC<AvailabilityMapProps> = ({
  locations,
  mapsKey,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerTriggerRef = useRef<HTMLButtonElement>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: locations[0]?.coordinates[1] ?? 40.7128,
    lng: locations[0]?.coordinates[0] ?? -74.006,
  });
  const [randomizedPositions, setRandomizedPositions] =
    useState<RandomizedPositions>({});
  const [locationStatuses, setLocationStatuses] = useState<LocationStatuses>(
    {}
  );
  const [showUnavailableDialog, setShowUnavailableDialog] = useState(false);
  const [unavailableLocations, setUnavailableLocations] = useState<
    Array<{
      name: string;
      nextOpenTime: string;
    }>
  >([]);
  const googleMapsApiKey = mapsKey;
  const libraries: ("places" | "geometry")[] = ["places", "geometry"];
  const mapRef = useRef<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState<number>(20);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  const getDisplayText = () => {
    if (!selectedDate || !selectedTime) {
      return "Pick a date and time";
    }
    return formatDateToMMMDDAtHourMin(
      new Date(`${selectedDate}T${selectedTime}`)
    );
  };
  const generateRandomOffset = (): number => {
    const maxOffset = 0.007;
    return (Math.random() - 0.5) * maxOffset;
  };
  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };
  useEffect(() => {
    const newRandomPositions: RandomizedPositions = {};
    locations.forEach((location) => {
      if (!randomizedPositions[location.id] && location.coordinates) {
        const originalLat = location.coordinates[1];
        const originalLng = location.coordinates[0];
        newRandomPositions[location.id] = {
          originalLat,
          originalLng,
          randomLat: originalLat + generateRandomOffset(),
          randomLng: originalLng + generateRandomOffset(),
        };
      }
    });
    setRandomizedPositions((prev) => ({ ...prev, ...newRandomPositions }));
  }, [locations]);

  const findNextOpenTime = (location: any, selectedDateTime: Date): string => {
    if (!location.hours?.delivery?.[0]?.timeSlots?.[0]) {
      return "No schedule available";
    }

    const openHour = location.hours.delivery[0].timeSlots[0].open;
    const closeHour = location.hours.delivery[0].timeSlots[0].close;
    let nextDate = new Date(selectedDateTime);

    // If current time is after closing, move to next day
    if (selectedDateTime.getHours() >= closeHour) {
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(openHour, 0, 0, 0);
    } else if (selectedDateTime.getHours() < openHour) {
      // If current time is before opening, set to opening time today
      nextDate.setHours(openHour, 0, 0, 0);
    }

    return nextDate.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const checkLocationAvailability = (): void => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const timeInMinutes =
      selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes();
    const unavailable: Array<{ name: string; nextOpenTime: string }> = [];
    const newStatuses: LocationStatuses = {};

    locations.forEach((location) => {
      let isOpen = false;
      let willOpen = false;
      let closesSoon = false;

      if (location.hours?.delivery?.[0]?.timeSlots?.[0]) {
        const openTime = location.hours.delivery[0].timeSlots[0].open * 60;
        const closeTime = location.hours.delivery[0].timeSlots[0].close * 60;

        isOpen = timeInMinutes >= openTime && timeInMinutes <= closeTime;
        willOpen = timeInMinutes < openTime;
        closesSoon = isOpen && closeTime - timeInMinutes <= 30;

        if (!isOpen) {
          unavailable.push({
            name:
              location.displayName || location.user?.name || "Unknown Location",
            nextOpenTime: findNextOpenTime(location, selectedDateTime),
          });
        }
      }

      newStatuses[location.id] = { isOpen, willOpen, closesSoon };
    });

    setLocationStatuses(newStatuses);

    if (unavailable.length > 0) {
      setUnavailableLocations(unavailable);
      setShowUnavailableDialog(true);
    }
  };
  useEffect(() => {
    // Get current date and time
    const now = new Date();

    // Format date for input field
    const formattedDate = now.toISOString().split("T")[0];

    // Format time for input field (HH:mm)
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    // Set the input fields
    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);

    // Calculate minutes since midnight
    const timeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Check each location's availability
    const initialStatuses: LocationStatuses = {};
    locations.forEach((location) => {
      let isOpen = false;
      let willOpen = false;
      let closesSoon = false;

      if (location.hours?.delivery?.[0]?.timeSlots?.[0]) {
        const openTime = location.hours.delivery[0].timeSlots[0].open * 60;
        const closeTime = location.hours.delivery[0].timeSlots[0].close * 60;

        isOpen = timeInMinutes >= openTime && timeInMinutes <= closeTime;
        willOpen = timeInMinutes < openTime;
        closesSoon = isOpen && closeTime - timeInMinutes <= 30;
      }

      initialStatuses[location.id] = { isOpen, willOpen, closesSoon };
    });

    setLocationStatuses(initialStatuses);
  }, []);
  const getLocationStatusColor = (
    status: LocationStatus
  ): {
    fillColor: string;
    strokeColor: string;
    strokeWeight?: number;
  } => {
    if (!status.isOpen && status.willOpen) {
      return {
        fillColor: "red",
        strokeColor: "green",
        strokeWeight: 3,
      };
    } else if (!status.isOpen) {
      return {
        fillColor: "red",
        strokeColor: "red",
      };
    } else if (status.closesSoon) {
      return {
        fillColor: "yellow",
        strokeColor: "yellow",
      };
    }
    return {
      fillColor: "green",
      strokeColor: "green",
    };
  };
  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }
  return (
    <div className="mt-8">
      <Card className="p-4 mb-4">
        <div className="flex justify-between items-center">
          <button
            ref={datePickerTriggerRef}
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center justify-center rounded-full border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {getDisplayText()}
          </button>
          <Button
            onClick={checkLocationAvailability}
            className="w-32"
            disabled={!selectedDate || !selectedTime}
          >
            Check
          </Button>
        </div>
      </Card>

      <DateTimePicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelect={handleDateTimeSelect}
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        triggerRef={datePickerTriggerRef}
      />

      {/* Unavailable Locations Dialog */}
      <Dialog
        open={showUnavailableDialog}
        onOpenChange={setShowUnavailableDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unavailable Locations</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 mb-4">
              The following locations are closed at the selected time:
            </p>
            <div className="space-y-3">
              {unavailableLocations.map((loc, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium">{loc.name}</p>
                  <p className="text-sm text-gray-600">
                    Next available: {loc.nextOpenTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-[400px] rounded-lg overflow-hidden">
        <GoogleMap
          key={mapsKey}
          mapContainerClassName="w-full h-full"
          center={mapCenter}
          zoom={9}
          onLoad={(map) => {
            mapRef.current = map;
            setZoom(map.getZoom() || 9);
          }}
          onZoomChanged={() => {
            if (mapRef.current) {
              setZoom(mapRef.current.getZoom() || 9);
            }
          }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            minZoom: 6,
            maxZoom: 10,
            scaleControl: true, // Enable scale control
          }}
        >
          {locations.map((location) => {
            const status = locationStatuses[location.id] || {
              isOpen: true,
              willOpen: false,
              closesSoon: false,
            };
            const colors = getLocationStatusColor(status);
            const position = randomizedPositions[location.id];

            if (!position) return null;

            return (
              <Circle
                key={location.id}
                center={{
                  lat: position.randomLat,
                  lng: position.randomLng,
                }}
                radius={
                  zoom >= 16
                    ? 60
                    : zoom >= 15
                    ? 120
                    : zoom >= 14
                    ? 240
                    : zoom >= 13
                    ? 500
                    : zoom >= 12
                    ? 1000
                    : zoom >= 11
                    ? 2000
                    : zoom >= 10
                    ? 4000
                    : 8000
                }
                options={{
                  strokeColor: colors.strokeColor,
                  strokeOpacity: 0.8,
                  strokeWeight: colors.strokeWeight || 2,
                  fillColor: colors.fillColor,
                  fillOpacity: 0.35,
                }}
              />
            );
          })}
        </GoogleMap>
      </div>
      <div className="mt-4 flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-600"></div>
          <span>Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Closing Soon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600"></div>
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_0_3px_#16a34a]"></div>
          <span>Opening Soon</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityMap;
