import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Circle, useLoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Location } from "@prisma/client";

interface LocationStatus {
  isOpen: boolean;
  willOpen: boolean;
  closesSoon: boolean;
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

interface AvailabilityMapProps {
  mapsKey: string;
  locations: any[];
}

const AvailabilityMap: React.FC<AvailabilityMapProps> = ({
  locations,
  mapsKey,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [mapCenter, setMapCenter] = useState({
    lat: locations[0]?.coordinates[1] ?? 40.7128,
    lng: locations[0]?.coordinates[0] ?? -74.006,
  });
  const [randomizedPositions, setRandomizedPositions] =
    useState<RandomizedPositions>({});
  const [locationStatuses, setLocationStatuses] = useState<LocationStatuses>(
    {}
  );
  const googleMapsApiKey = mapsKey;
  const libraries: ("places" | "geometry")[] = ["places", "geometry"];
  const mapRef = useRef<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState<number>(20);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  const generateRandomOffset = (): number => {
    const maxOffset = 0.007;
    return (Math.random() - 0.5) * maxOffset;
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

  const checkLocationAvailability = (): void => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const timeInMinutes =
      selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes();

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
      }

      newStatuses[location.id] = { isOpen, willOpen, closesSoon };
    });

    setLocationStatuses(newStatuses);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          <Button onClick={checkLocationAvailability} className="w-full">
            Check Availability
          </Button>
        </div>
      </Card>

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
