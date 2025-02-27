"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Autocomplete,
  Circle,
  Polyline,
} from "@react-google-maps/api";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { StrictMode } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OutfitFont } from "@/components/fonts";
import { Location } from "@prisma/client";
import { formatTime } from "./utils";
// Import the separated functions and types
//import { optimizeRoute } from "./calcreverse";
import {
  optimizeTimeRoute,
  timeStringToSeconds,
  secondsToTimeString,
  formatDuration,
  metersToMiles,
  isLocationOpen,
  getLocationOpenTime,
} from "./calcoptimal";
import {
  RouteOptimizerProps,
  ModalState,
  TimeValidation,
  RouteSegment,
  RouteTimings,
} from "./types";
import DepartureTimePicker from "./departureTime";
import { toast } from "sonner";
import { optimizeArrivalTimeRoute, optimizeRoute } from "./calcreverse";
interface LocationStatus {
  isOpen: boolean;
  willBeOpen: boolean;
  closesSoon: boolean;
  estimatedArrival: number | null;
}
const libraries: ("places" | "geometry")[] = ["places", "geometry"];
interface RandomizedLocation {
  originalLat: number;
  originalLng: number;
  randomLat: number;
  randomLng: number;
}
type ExtendedLocation = Location & { user?: { name: string } };

const RouteOptimizer = ({
  isOpen,
  setEndLoc,
  setStartLoc,
  initialTime,
  locations,
  googleMapsApiKey,
  initialLocation,
  onClose,
  setCartPickupTimes,
  startDelay,
}: RouteOptimizerProps) => {
  // State Management
  const [departureTimePickerOpen, setDepartureTimePickerOpen] = useState(false);
  const [selectedDepartureTime, setSelectedDepartureTime] =
    useState<Date>(initialTime);
  const [routeTimings, setRouteTimings] = useState<RouteTimings>({
    segmentTimes: {},
    returnTime: 0,
    totalTime: 0,
    totalDistance: 0,
    distanceSegments: {},
    suggestedPickupTimes: {},
  });
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    new google.maps.LatLng(initialLocation[1], initialLocation[0]) || null
  );
  const [endLocation, setEndLocation] = useState<google.maps.LatLng | null>(
    null
  );

  const [randomizedPositions, setRandomizedPositions] = useState<{
    [key: string]: RandomizedLocation;
  }>({});
  const [locationStatuses, setLocationStatuses] = useState<{
    [key: string]: LocationStatus;
  }>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [optimizedRoute, setOptimizedRoute] = useState<ExtendedLocation[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [pickupTimes, setPickupTimes] = useState<{ [key: string]: string }>({});
  const [calcFromEnd, setCalcFromEnd] = useState(false);
  const [customEndLocation, setCustomEndLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [customStartLocation, setCustomStartLocation] = useState<{} | null>(
    initialLocation || null
  );
  const [useCustomStartLocation, setUseCustomStartLocation] = useState(false);
  const [startLocation, setStartLocation] = useState<google.maps.LatLng | null>(
    new google.maps.LatLng(initialLocation[1], initialLocation[0]) || null
  );
  const [mapKey, setMapKey] = useState(0);
  const [useCustomEndLocation, setUseCustomEndLocation] = useState(false);

  const [addressSearch, setAddressSearch] = useState("");
  const [timeValidations, setTimeValidations] = useState<{
    [key: string]: TimeValidation;
  }>({});
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
  });
  const [usePickupOrder, setUsePickupOrder] = useState(false);
  const [orderedLocations, setOrderedLocations] = useState<any[]>(locations);
  const onDragEnd = (result: any) => {
    if (!result.destination || !usePickupOrder) return;

    const items = Array.from(orderedLocations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedLocations(items);
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleDepartureTimeSet = (date: Date) => {
    setSelectedDepartureTime(date);
    clearMap();
  };
  const generateRandomOffset = () => {
    // 0.5 miles is approximately 0.007 degrees of lat/lng
    const maxOffset = 0.007;
    return (Math.random() - 0.5) * maxOffset;
  };
  useEffect(() => {
    setOrderedLocations(locations);
  }, [locations]);
  useEffect(() => {
    const newRandomPositions: { [key: string]: RandomizedLocation } = {};

    locations.forEach((location) => {
      if (!randomizedPositions[location.id]) {
        const originalLat = location.coordinates[1];
        const originalLng = location.coordinates[0];
        const randomLat = originalLat + generateRandomOffset();
        const randomLng = originalLng + generateRandomOffset();

        newRandomPositions[location.id] = {
          originalLat,
          originalLng,
          randomLat,
          randomLng,
        };
      }
    });

    setRandomizedPositions((prev) => ({
      ...prev,
      ...newRandomPositions,
    }));
  }, [locations]);
  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const startSearchBoxRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const endSearchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  const clearMap = () => {
    setMapKey((prev) => prev + 1);
    setOptimizedRoute([]);
    setRouteSegments([]);
    setPickupTimes({});
    setRouteTimings({
      segmentTimes: {},
      returnTime: 0,
      totalTime: 0,
      totalDistance: 0,
      distanceSegments: {},
      suggestedPickupTimes: {},
    });
  };

  // Map Event Handlers
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setZoom(map.getZoom() || 12);
  };

  const onZoomChanged = () => {
    if (mapRef.current) {
      setZoom(mapRef.current.getZoom() || 12);
    }
  };

  const getLocationStatusColor = (
    location: Location,
    status: LocationStatus
  ) => {
    if (selectedDepartureTime) {
      const departureDate = new Date(selectedDepartureTime);
      const matchingSlot = location.hours?.pickup?.find(
        (daySlot: any) =>
          new Date(daySlot.date).toDateString() === departureDate.toDateString()
      );

      if (!matchingSlot?.timeSlots?.[0]) {
        return {
          fillColor: "red",
          strokeColor: "red",
        };
      }
    }

    if (!status.isOpen && status.willBeOpen) {
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

  const updateLocationStatuses = (
    locations: Location[],
    routeSegments: RouteSegment[],
    startTime: number
  ): { [key: string]: LocationStatus } => {
    const statuses: { [key: string]: LocationStatus } = {};

    locations.forEach((location) => {
      const segment = routeSegments.find(
        (seg) => seg.location.id === location.id
      );

      if (segment) {
        const arrivalTime = segment.arrivalTime;
        const currentDate = new Date();
        const nextAvailableSlot = location.hours?.pickup?.find((slot) => {
          if (!slot?.timeSlots?.length) return false;
          return new Date(slot.date) >= currentDate;
        });

        const closeTime = nextAvailableSlot?.timeSlots[0]?.close
          ? nextAvailableSlot.timeSlots[0].close * 60
          : 0;

        const isCurrentlyOpen = isLocationOpen(
          location,
          startTime,
          selectedDepartureTime
        );
        const willBeOpenOnArrival = isLocationOpen(
          location,
          arrivalTime,
          selectedDepartureTime
        );
        const timeUntilClose = closeTime - arrivalTime;
        const closesSoon = timeUntilClose <= 1800 && timeUntilClose > 0;

        statuses[location.id] = {
          isOpen: isCurrentlyOpen,
          willBeOpen: willBeOpenOnArrival,
          closesSoon: closesSoon,
          estimatedArrival: arrivalTime,
        };
      } else {
        statuses[location.id] = {
          isOpen: isLocationOpen(location, startTime, selectedDepartureTime),
          willBeOpen: true,
          closesSoon: false,
          estimatedArrival: null,
        };
      }
    });

    return statuses;
  };
  const AVERAGE_STOP_TIME = 10 * 60;
  const BUFFER_TIME = 0 * 60;
  const MIN_DEPARTURE_BUFFER = 30 * 60;
  const calculateRoute = async () => {
    const startingPoint = startLocation;
    if (!startingPoint || locations.length === 0) return;
    clearMap();

    try {
      const targetDate = selectedDepartureTime || new Date();
      const targetTimeInSeconds =
        (targetDate.getHours() * 60 + targetDate.getMinutes()) * 60;

      let optimizedResult;
      if (calcFromEnd) {
        optimizedResult = await optimizeArrivalTimeRoute(
          startingPoint,
          usePickupOrder ? orderedLocations : locations,
          endLocation || startingPoint,
          usePickupOrder,
          targetTimeInSeconds,
          selectedDepartureTime,
          startDelay
        );
      } else {
        optimizedResult = await optimizeTimeRoute(
          startingPoint,
          usePickupOrder ? orderedLocations : locations,
          endLocation || startingPoint,
          usePickupOrder,
          targetTimeInSeconds,
          selectedDepartureTime,
          startDelay
        );
      }

      setOptimizedRoute(optimizedResult.route);
      setRouteTimings(optimizedResult.timings);

      const segments: RouteSegment[] = [];
      let currentTime: number;

      if (calcFromEnd) {
        // For arrival-based calculation, need to account for final return leg
        const finalReturnTime = optimizedResult.timings.returnTime;
        currentTime = targetTimeInSeconds - finalReturnTime;

        // Process locations backwards from final return time
        for (let i = optimizedResult.route.length - 1; i >= 0; i--) {
          const location = optimizedResult.route[i];
          const travelTime = optimizedResult.timings.segmentTimes[location.id];
          const distance =
            optimizedResult.timings.distanceSegments[location.id];

          // First account for the stop time at this location
          currentTime -= AVERAGE_STOP_TIME;
          const departureTime = currentTime + AVERAGE_STOP_TIME;
          const arrivalTime = currentTime;
          const pickupTime = arrivalTime;

          // Then account for travel time to this location
          currentTime -= travelTime;

          // Add buffer time before this location (except for first location)
          if (i > 0) {
            currentTime -= BUFFER_TIME;
          }

          // Insert at beginning of array to maintain forward order
          segments.unshift({
            location,
            arrivalTime,
            pickupTime,
            departureTime,
            travelTime,
            distance,
            waitTime: 0,
          });
        }
      } else {
        // Forward calculation starting from departure time
        currentTime = targetTimeInSeconds;

        for (let i = 0; i < optimizedResult.route.length; i++) {
          const location = optimizedResult.route[i];
          const travelTime = optimizedResult.timings.segmentTimes[location.id];
          const distance =
            optimizedResult.timings.distanceSegments[location.id];

          // Add travel time to reach this location
          currentTime += travelTime;
          const arrivalTime = currentTime;
          const pickupTime = arrivalTime;
          const departureTime = pickupTime + AVERAGE_STOP_TIME;

          segments.push({
            location,
            arrivalTime,
            pickupTime,
            departureTime,
            travelTime,
            distance,
            waitTime: 0,
          });

          // Update current time to departure and add buffer if not last location
          currentTime = departureTime;
          if (i < optimizedResult.route.length - 1) {
            currentTime += BUFFER_TIME;
          }
        }
      }

      setRouteSegments(segments);

      // Update location statuses based on the first segment's start time
      const newStatuses = updateLocationStatuses(
        locations,
        segments,
        segments[0].arrivalTime - segments[0].travelTime
      );
      setLocationStatuses(newStatuses);
    } catch (error) {
      handleRouteError(error);
    }
  };

  const handleRouteError = (error: any) => {
    console.error("Route calculation error:", error);

    let errorMessage: React.ReactNode;

    if (error.type === "LOCATION_CLOSED") {
      const currentDate = selectedDepartureTime
        ? new Date(selectedDepartureTime)
        : new Date();
      const matchingSlot = error.location?.hours?.pickup?.find(
        (slot: any) =>
          new Date(slot.date).toDateString() === currentDate.toDateString()
      );
      const openTime = matchingSlot?.timeSlots?.[0]?.open;
      const closeTime = matchingSlot?.timeSlots?.[0]?.close;
      const formattedOpen = openTime ? formatTime(openTime) : "N/A";
      const formattedClose = closeTime ? formatTime(closeTime) : "N/A";

      // Use error.details.expectedArrival which is already in the correct format
      const estimatedArrival = error.details.expectedArrival || "N/A";

      errorMessage = (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">
            Cannot route to{" "}
            {error.location?.displayName || error.location.user.name}
          </p>
          <p>
            This location would be closed when we arrive. Their hours are:{" "}
            {formattedOpen} - {formattedClose}
          </p>
          <p className="text-sm text-gray-600">
            Estimated arrival: {estimatedArrival}
          </p>
          {error.details.serviceStart && (
            <p className="text-sm text-gray-600">
              Service would start at: {error.details.serviceStart}
            </p>
          )}
          {error.details.serviceEnd && (
            <p className="text-sm text-gray-600">
              Service would end at: {error.details.serviceEnd}
            </p>
          )}
        </div>
      );
    } else if (error.type === "EXCESSIVE_WAIT") {
      errorMessage = (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">
            Excessive wait time for {error.location?.displayName || "location"}
          </p>
          <p>
            Would arrive at {error.details?.arrivalTime || "N/A"} but pickup
            isn't until {error.details?.requestedPickup || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            Wait time would be {error.details?.waitTime || "N/A"}
          </p>
        </div>
      );
    } else if (error.type === "TIME_PASSED") {
      const earlyTime =
        timeStringToSeconds(error.details.currentTime) +
        error.details.sellerReq * 60;
      errorMessage = (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">{error.message}</p>
          <p className="text-sm text-gray-600">
            Current Time: {error.details.currentTime}
          </p>
          <p className="text-sm text-gray-600">
            Requested Time: {error.details.requestedTime}
          </p>
          <p className="text-sm text-gray-600">
            Sellers request {formatTimeFromMinutes(error.details.sellerReq)}{" "}
            notice
          </p>
          <p className="text-sm text-gray-600">
            Ealiest possible departure: {secondsToTimeString(earlyTime)}
          </p>
          {error.details.location && (
            <p className="text-sm text-gray-600">
              Location: {error.details.location.displayName}
            </p>
          )}
        </div>
      );
    } else {
      errorMessage = (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">
            Unable to find a valid route
          </p>
          <p className="text-sm text-gray-600">
            Please try adjusting your route order.
          </p>
        </div>
      );
    }

    showNotification(
      "Route Calculation Error",
      <div className="space-y-4">
        {errorMessage}
        <DialogFooter className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() =>
              setModalState((prev) => ({ ...prev, isOpen: false }))
            }
          >
            Close
          </Button>
          {/* <Button onClick={() => calculateSimpleRoute()}>
            Create Route Without Time Constraints
          </Button> */}
        </DialogFooter>
      </div>,
      "destructive"
    );
  };
  const calculateSimpleRoute = async () => {
    if (!userLocation || locations.length === 0) return;
    clearMap();
    try {
      const bestRoute = await optimizeRoute(
        userLocation,
        locations,
        endLocation || userLocation
      );
      setOptimizedRoute(bestRoute.route);
      setRouteTimings(bestRoute.timings);
    } catch (error) {
      handleRouteError(error);
    }
  };

  const onStartPlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCustomStartLocation(newLocation);
      setUserLocation(new google.maps.LatLng(newLocation.lat, newLocation.lng));
      setStartLocation(
        new google.maps.LatLng(newLocation.lat, newLocation.lng)
      );

      if (mapRef.current) {
        mapRef.current.panTo(newLocation);
        mapRef.current.setZoom(15);
      }

      clearMap();
    }
  };

  const onEndPlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCustomEndLocation(newLocation);
      setEndLocation(new google.maps.LatLng(newLocation.lat, newLocation.lng));
      setAddressSearch(place.formatted_address || "");
      if (mapRef.current) {
        mapRef.current.panTo(newLocation);
        mapRef.current.setZoom(15);
      }
    }
  };
  // Notification helpers
  const showNotification = (
    title: string,
    description: React.ReactNode,
    variant?: "default" | "destructive"
  ) => {
    setModalState({
      isOpen: true,
      title,
      description,
      variant,
    });
  };

  // Initialize user location
  useEffect(() => {
    if (!isLoaded) return;

    // Only set initial location if no custom start location is set
    if (!customStartLocation) {
      setUserLocation(
        new google.maps.LatLng(initialLocation[1], initialLocation[0])
      );

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            setUserLocation(newLocation);
          },
          (error) => {
            console.error("Error getting location:", error);
            setUserLocation(
              new google.maps.LatLng(initialLocation[1], initialLocation[0])
            );
          }
        );
      }
    }
  }, [isLoaded, initialLocation, customStartLocation]);
  useEffect(() => {
    calculateRoute();
  }, [isOpen]);
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <DepartureTimePicker
        isOpen={departureTimePickerOpen}
        onClose={() => setDepartureTimePickerOpen(false)}
        onSubmit={handleDepartureTimeSet}
        currentTime={selectedDepartureTime || new Date()}
      />
      {!userLocation && (
        <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-[500px] p-4 md:p-6 mx-4 text-center">
          <CardHeader>
            <CardTitle className="text-xl md:text-3xl font-bold text-gray-800">
              Set a Start Location to Continue
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Sidebar Card - Responsive */}
      <Card className="absolute top-4 left-4 z-10 w-[85vw] md:w-[350px] lg:w-96 pt-2 max-h-[calc(100vh-100px)] rounded-lg overflow-hidden">
        <CardContent className="overflow-y-auto max-h-[calc(100vh-128px-2rem)] p-2 ">
          {isCollapsed ? (
            <Button
              className="w-full mb-2 text-sm md:text-base"
              onClick={toggleCollapse}
            >
              {" "}
              Open Optimizer
            </Button>
          ) : (
            <div>
              {" "}
              <div className="">
                <Button
                  className="w-full mb-4 text-sm md:text-base"
                  onClick={toggleCollapse}
                >
                  {" "}
                  Collapse Optimizer
                </Button>
                <Button
                  className="w-full mb-4 text-sm md:text-base"
                  onClick={() => setDepartureTimePickerOpen(true)}
                  disabled={locations.length === 0}
                >
                  {selectedDepartureTime
                    ? calcFromEnd
                      ? `Arrival: ${selectedDepartureTime.toLocaleString()}`
                      : `Departure: ${selectedDepartureTime.toLocaleString()}`
                    : "Set Departure Time"}
                </Button>

                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center gap-1 mb-2">
                  <div className="flex items-center gap-1 mb-1 md:mb-0 md:mr-2">
                    <Switch
                      checked={usePickupOrder}
                      onCheckedChange={setUsePickupOrder}
                    />
                    <Label className="cursor-pointer text-sm">
                      Enable reordering
                    </Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={calcFromEnd}
                      onCheckedChange={setCalcFromEnd}
                    />
                    <Label className="cursor-pointer text-sm">
                      Calculate by arrival time
                    </Label>
                  </div>
                </div>

                {/* Draggable Locations List */}
                <StrictMode>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="locations" type="location">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="max-h-[20vh] md:max-h-[30vh] overflow-y-auto mb-2"
                        >
                          {orderedLocations.map((location, index) => (
                            <Draggable
                              key={location.id}
                              draggableId={location.id}
                              index={index}
                              isDragDisabled={!usePickupOrder}
                            >
                              {(dragProvided, snapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg mb-2 select-none border-2 border-transparent hover:border-blue-500 active:border-blue-700 text-sm"
                                  style={{
                                    ...dragProvided.draggableProps.style,
                                    cursor: usePickupOrder ? "grab" : "default",
                                    backgroundColor: snapshot.isDragging
                                      ? "#e2e8f0"
                                      : "",
                                    boxShadow: snapshot.isDragging
                                      ? "0 5px 15px rgba(0,0,0,0.3)"
                                      : "none",
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {usePickupOrder && (
                                        <div className="text-gray-400 cursor-grab hover:text-gray-600">
                                          ⣿
                                        </div>
                                      )}
                                      <span
                                        className={`${OutfitFont.className} font-medium truncate`}
                                      >
                                        {index + 1}.{" "}
                                        {location.displayName ||
                                          location.user.name}
                                      </span>
                                    </div>
                                  </div>
                                  {location?.hours?.pickup?.length > 0 &&
                                    selectedDepartureTime && (
                                      <div className="text-xs text-gray-600">
                                        {(() => {
                                          const departureDate = new Date(
                                            selectedDepartureTime
                                          );
                                          const matchingSlot =
                                            location.hours.pickup.find(
                                              (daySlot: any) =>
                                                new Date(
                                                  daySlot.date
                                                ).toDateString() ===
                                                departureDate.toDateString()
                                            );

                                          // Find next available date after selected date
                                          const nextAvailableSlot =
                                            location.hours.pickup.find(
                                              (daySlot: any) =>
                                                new Date(daySlot.date) >
                                                  departureDate &&
                                                daySlot.timeSlots?.[0]
                                            );

                                          if (matchingSlot?.timeSlots?.[0]) {
                                            return `Operating Hours: ${formatTime(
                                              matchingSlot.timeSlots[0].open
                                            )} - ${formatTime(
                                              matchingSlot.timeSlots[0].close
                                            )}`;
                                          }

                                          return (
                                            <>
                                              Location Closed on{" "}
                                              {departureDate.toLocaleDateString(
                                                "en-US",
                                                {
                                                  weekday: "long",
                                                  month: "short",
                                                  day: "numeric",
                                                }
                                              )}
                                              {nextAvailableSlot && (
                                                <>
                                                  <br />
                                                  Next Available:{" "}
                                                  {new Date(
                                                    nextAvailableSlot.date
                                                  ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                      weekday: "long",
                                                      month: "short",
                                                      day: "numeric",
                                                    }
                                                  )}
                                                </>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </StrictMode>

                {/* Location Settings */}
                <div className="space-y-2 mb-2">
                  <label
                    className={`${OutfitFont.className} flex items-center gap-2 text-sm`}
                  >
                    <Switch
                      checked={useCustomStartLocation}
                      onCheckedChange={(checked1) => {
                        setUseCustomStartLocation(checked1);
                        if (!checked1) {
                          setStartLocation(
                            new google.maps.LatLng(
                              initialLocation[1],
                              initialLocation[0]
                            )
                          );
                          setCustomStartLocation(null);
                          setAddressSearch("");
                        }
                      }}
                    />
                    <span>
                      {!userLocation
                        ? "Set Start Location"
                        : "Different Start Location"}
                    </span>
                  </label>
                  {useCustomStartLocation && (
                    <div className="space-y-1">
                      <Label className="text-xs md:text-sm">
                        Start Location Address
                      </Label>
                      <div className="relative">
                        <div
                          className="absolute inset-0"
                          style={{ zIndex: 1000 }}
                        >
                          <Autocomplete
                            onLoad={(autocomplete) => {
                              startSearchBoxRef.current = autocomplete;
                            }}
                            onPlaceChanged={() => {
                              if (startSearchBoxRef.current) {
                                const place =
                                  startSearchBoxRef.current.getPlace();
                                onStartPlaceSelected(place);
                              }
                            }}
                            options={{
                              componentRestrictions: { country: "us" },
                              fields: ["formatted_address", "geometry", "name"],
                              types: ["address"],
                            }}
                          >
                            <Input
                              type="text"
                              placeholder="Enter start address..."
                              className="w-full text-sm"
                              style={{ position: "relative", zIndex: 1000 }}
                            />
                          </Autocomplete>
                        </div>
                        <div style={{ height: "40px" }}></div>
                      </div>
                    </div>
                  )}
                  <label
                    className={`${OutfitFont.className} flex items-center gap-2 text-sm`}
                  >
                    <Switch
                      checked={useCustomEndLocation}
                      onCheckedChange={(checked) => {
                        setUseCustomEndLocation(checked);
                        if (!checked) {
                          setEndLocation(
                            new google.maps.LatLng(
                              initialLocation[1],
                              initialLocation[0]
                            )
                          );
                          setCustomEndLocation(null);
                          setAddressSearch("");
                        }
                      }}
                    />
                    <span>Different End Location</span>
                  </label>

                  {useCustomEndLocation && (
                    <div className="space-y-1">
                      <Label className="text-xs md:text-sm">
                        End Location Address
                      </Label>
                      <div className="relative">
                        <div
                          className="absolute inset-0"
                          style={{ zIndex: 1000 }}
                        >
                          <Autocomplete
                            onLoad={(autocomplete) => {
                              endSearchBoxRef.current = autocomplete;
                            }}
                            onPlaceChanged={() => {
                              if (endSearchBoxRef.current) {
                                const place =
                                  endSearchBoxRef.current.getPlace();
                                onEndPlaceSelected(place);
                              }
                            }}
                            options={{
                              componentRestrictions: { country: "us" },
                              fields: ["formatted_address", "geometry", "name"],
                              types: ["address"],
                            }}
                          >
                            <Input
                              type="text"
                              placeholder="Enter end address..."
                              className="w-full text-sm"
                              style={{ position: "relative", zIndex: 1000 }}
                            />
                          </Autocomplete>
                        </div>
                        <div style={{ height: "40px" }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full text-sm md:text-base mb-2"
                  onClick={calculateRoute}
                  disabled={
                    !!(
                      locations.length === 0 ||
                      (selectedDepartureTime &&
                        orderedLocations.some((location) => {
                          const departureDate = new Date(selectedDepartureTime);
                          const matchingSlot = location.hours?.pickup?.find(
                            (daySlot: any) =>
                              new Date(daySlot.date).toDateString() ===
                              departureDate.toDateString()
                          );
                          return !matchingSlot?.timeSlots?.[0];
                        }))
                    )
                  }
                >
                  {!selectedDepartureTime
                    ? "Optimize Route"
                    : orderedLocations.some((location) => {
                        const departureDate = new Date(selectedDepartureTime);
                        const matchingSlot = location.hours?.pickup?.find(
                          (daySlot: any) =>
                            new Date(daySlot.date).toDateString() ===
                            departureDate.toDateString()
                        );
                        return !matchingSlot?.timeSlots?.[0];
                      })
                    ? "Pick a day when all locations are open"
                    : "Optimize Route"}
                </Button>
              </div>
              {/* Route Results Section */}
              {routeSegments.length > 0 && (
                <div className="p-2 bg-slate-100 rounded-md text-sm">
                  <div className="border-b">
                    <div className="text-xs md:text-sm">
                      <p className="text-gray-600 pl-2 md:pl-4">
                        Start Location: {addressSearch || "Current Location"}
                      </p>

                      {routeSegments.length > 0 && (
                        <p className="text-gray-600 pl-2 md:pl-4">
                          Departure:{" "}
                          {routeSegments[0]
                            ? secondsToTimeString(
                                routeSegments[0].arrivalTime -
                                  routeSegments[0].travelTime
                              )
                            : "N/A"}
                        </p>
                      )}

                      <p className="text-gray-600 pl-2 md:pl-4">
                        Distance:{" "}
                        {metersToMiles(
                          routeSegments.reduce(
                            (acc, segment) => acc + segment.distance,
                            0
                          ) +
                            (!useCustomEndLocation
                              ? routeTimings.totalDistance -
                                Object.values(
                                  routeTimings.distanceSegments
                                ).reduce((sum, d) => sum + d, 0)
                              : 0)
                        ).toFixed(1)}{" "}
                        miles, Time:{" "}
                        {formatDuration(
                          routeSegments.reduce(
                            (acc, segment) => acc + segment.travelTime,
                            0
                          ) +
                            (!useCustomEndLocation
                              ? routeTimings.returnTime
                              : routeTimings.returnTime)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[20vh] md:max-h-[25vh] overflow-y-auto">
                    {optimizedRoute.map((location, index) => {
                      const segment = routeSegments[index];
                      const isLastLocation =
                        index === optimizedRoute.length - 1;

                      return (
                        <div
                          key={location.id}
                          className="border-b last:border-b-0 py-1"
                        >
                          <div className="font-medium text-xs md:text-sm">
                            {index + 1}.{" "}
                            {location.displayName || location?.user?.name}
                          </div>
                          <div className="pl-2 md:pl-4">
                            <div className="text-gray-600 text-xs">
                              Dist{" "}
                              {metersToMiles(
                                routeTimings.distanceSegments[location.id] || 0
                              ).toFixed(1)}{" "}
                              miles -{" "}
                              {formatDuration(
                                routeTimings.segmentTimes[location.id] || 0
                              )}
                            </div>

                            {segment && (
                              <div className="text-gray-600 text-xs">
                                Arr: {secondsToTimeString(segment.arrivalTime)}{" "}
                                - Dep:{" "}
                                {secondsToTimeString(
                                  segment.pickupTime + 10 * 60
                                )}
                              </div>
                            )}

                            {segment?.waitTime > 0 && (
                              <div className="text-red-600 text-xs">
                                Wait Time: {formatDuration(segment.waitTime)}
                              </div>
                            )}

                            {isLastLocation &&
                              routeTimings.returnTime > 0 &&
                              !useCustomEndLocation && (
                                <div className="border-t mt-1 pt-1">
                                  <div className="text-gray-600 text-xs">
                                    Return to Start:{" "}
                                    {metersToMiles(
                                      routeTimings.totalDistance -
                                        Object.values(
                                          routeTimings.distanceSegments
                                        ).reduce((sum, d) => sum + d, 0)
                                    ).toFixed(1)}{" "}
                                    miles -{" "}
                                    {formatDuration(routeTimings.returnTime)}
                                  </div>
                                  {segment && (
                                    <div className="text-gray-600 text-xs">
                                      Estimated Return:{" "}
                                      {secondsToTimeString(
                                        segment.departureTime +
                                          routeTimings.returnTime
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {useCustomEndLocation &&
                    customEndLocation &&
                    addressSearch && (
                      <div className="border-t pt-1">
                        <div className="font-medium text-xs md:text-sm">
                          Final Destination:
                        </div>
                        <div className="pl-2 md:pl-4">
                          <p className="text-gray-600 text-xs truncate max-w-full">
                            {addressSearch}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Travel from Last Stop:{" "}
                            {metersToMiles(
                              routeTimings.totalDistance -
                                Object.values(
                                  routeTimings.distanceSegments
                                ).reduce((sum, d) => sum + d, 0)
                            ).toFixed(1)}{" "}
                            miles - {formatDuration(routeTimings.returnTime)}
                          </p>
                          {routeSegments.length > 0 &&
                            routeSegments[routeSegments.length - 1]
                              .departureTime !== undefined && (
                              <p className="text-gray-600 text-xs">
                                Estimated Arrival:{" "}
                                {secondsToTimeString(
                                  routeSegments[routeSegments.length - 1]
                                    .departureTime
                                    ? routeSegments[routeSegments.length - 1]
                                        .departureTime + routeTimings.returnTime
                                    : routeTimings.returnTime
                                )}
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                </div>
              )}
              {routeSegments.length > 0 && (
                <Button
                  className=" w-full bg-green-500 hover:bg-green-600 text-white p-4 md:p-6 text-sm md:text-lg font-semibold shadow-lg rounded-lg z-50"
                  onClick={() => {
                    setStartLoc(
                      startLocation
                        ? [startLocation.lat(), startLocation.lng()]
                        : userLocation
                        ? [userLocation.lat(), userLocation.lng()]
                        : initialLocation
                    );

                    setEndLoc(
                      endLocation ? [endLocation.lat(), endLocation.lng()] : []
                    );
                    setCartPickupTimes(
                      routeSegments.reduce(
                        (acc: { [key: string]: Date }, segment) => {
                          if (selectedDepartureTime) {
                            const departureTimeWithPickupTime = new Date(
                              selectedDepartureTime
                            );
                            const hours = Math.floor(segment.pickupTime / 3600);
                            const minutes = Math.floor(
                              (segment.pickupTime % 3600) / 60
                            );
                            departureTimeWithPickupTime.setHours(
                              hours,
                              minutes
                            );

                            acc[segment.location.id] =
                              departureTimeWithPickupTime;
                          }
                          return acc;
                        },
                        {}
                      )
                    );
                    onClose();
                    toast.success("Route exported successfully");
                  }}
                >
                  Use these Pickup Times?
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      <GoogleMap
        key={mapKey}
        onLoad={onMapLoad}
        onZoomChanged={onZoomChanged}
        mapContainerClassName="w-full h-full rounded-xl"
        center={userLocation ?? undefined}
        zoom={12}
        options={{
          zoomControl: true,
          maxZoom: 13,
          minZoom: 9,
          streetViewControl: false,
          mapTypeControl: false,
          scaleControl: true,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* Starting Location Marker */}
        {(startLocation || userLocation) && (
          <MarkerF
            position={
              startLocation?.toJSON() ||
              userLocation?.toJSON() || {
                lat: initialLocation[1],
                lng: initialLocation[0],
              }
            }
            icon={{
              url: "/icons/clipart2825061.png",
              scaledSize: new google.maps.Size(48, 58),
            }}
            title="Start Location"
          />
        )}

        {/* Location Circles */}
        {locations.map((location) => {
          const status = locationStatuses[location.id] || {
            isOpen: true,
            willBeOpen: true,
            closesSoon: false,
            estimatedArrival: null,
          };
          const colors = getLocationStatusColor(location, status);
          const randomPosition = randomizedPositions[location.id];

          if (!randomPosition) return null;

          return (
            <React.Fragment key={location.id}>
              <Circle
                center={
                  new google.maps.LatLng(
                    randomPosition.randomLat,
                    randomPosition.randomLng
                  )
                }
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
              <MarkerF
                position={
                  new google.maps.LatLng(
                    randomPosition.randomLat,
                    randomPosition.randomLng
                  )
                }
                label={{
                  text:
                    location.displayName ||
                    location.user.name ||
                    "no name found",
                  color: "black",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 0,
                }}
              />
            </React.Fragment>
          );
        })}

        {/* End Location Marker */}
        {customEndLocation && (
          <MarkerF
            position={
              new google.maps.LatLng(
                customEndLocation.lat,
                customEndLocation.lng
              )
            }
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              scaledSize: new google.maps.Size(32, 32),
            }}
            title={
              userLocation &&
              customEndLocation &&
              userLocation.equals(
                new google.maps.LatLng(
                  customEndLocation.lat,
                  customEndLocation.lng
                )
              )
                ? "Start Location"
                : "End Location"
            }
          />
        )}

        {/* Connect locations with straight lines and arrows */}
        {optimizedRoute.length > 0 && (
          <>
            {/* Line from starting location to first location */}
            {userLocation && randomizedPositions[optimizedRoute[0].id] && (
              <Polyline
                path={[
                  { lat: userLocation.lat(), lng: userLocation.lng() },
                  {
                    lat: randomizedPositions[optimizedRoute[0].id].randomLat,
                    lng: randomizedPositions[optimizedRoute[0].id].randomLng,
                  },
                ]}
                options={{
                  strokeColor: "#4A90E2",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  zIndex: 1,
                  icons: [
                    {
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      },
                      offset: "100%",
                      repeat: "100px",
                    },
                  ],
                }}
              />
            )}

            {/* Lines between locations */}
            <Polyline
              path={optimizedRoute
                .map((location) => randomizedPositions[location.id])
                .filter(Boolean)
                .map((pos) => ({
                  lat: pos.randomLat,
                  lng: pos.randomLng,
                }))}
              options={{
                strokeColor: "#4A90E2",
                strokeOpacity: 0.8,
                strokeWeight: 4,
                zIndex: 1,
                icons: [
                  {
                    icon: {
                      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    },
                    offset: "100%",
                    repeat: "100px",
                  },
                ],
              }}
            />

            {/* Line from last location to final location */}
            {endLocation &&
            randomizedPositions[
              optimizedRoute[optimizedRoute.length - 1].id
            ] ? (
              <Polyline
                path={[
                  {
                    lat: randomizedPositions[
                      optimizedRoute[optimizedRoute.length - 1].id
                    ].randomLat,
                    lng: randomizedPositions[
                      optimizedRoute[optimizedRoute.length - 1].id
                    ].randomLng,
                  },
                  { lat: endLocation.lat(), lng: endLocation.lng() },
                ]}
                options={{
                  strokeColor: "#4A90E2",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  zIndex: 1,
                  icons: [
                    {
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      },
                      offset: "100%",
                      repeat: "100px",
                    },
                  ],
                }}
              />
            ) : (
              userLocation &&
              randomizedPositions[
                optimizedRoute[optimizedRoute.length - 1].id
              ] && (
                <Polyline
                  path={[
                    {
                      lat: randomizedPositions[
                        optimizedRoute[optimizedRoute.length - 1].id
                      ].randomLat,
                      lng: randomizedPositions[
                        optimizedRoute[optimizedRoute.length - 1].id
                      ].randomLng,
                    },
                    { lat: userLocation.lat(), lng: userLocation.lng() },
                  ]}
                  options={{
                    strokeColor: "#4A90E2",
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    zIndex: 1,
                    icons: [
                      {
                        icon: {
                          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        },
                        offset: "100%",
                        repeat: "100px",
                      },
                    ],
                  }}
                />
              )
            )}
          </>
        )}
      </GoogleMap>

      {/* Notification Modal */}
      <Dialog
        open={modalState.isOpen}
        onOpenChange={() =>
          setModalState((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <DialogContent className="sm:max-w-md max-w-[90%] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle
              className={`${OutfitFont.className} text-base md:text-lg ${
                modalState.variant === "destructive" ? "text-red-600" : ""
              }`}
            >
              {modalState.title}
            </DialogTitle>
          </DialogHeader>
          <div className={`${OutfitFont.className} text-sm md:text-base`}>
            {modalState.description}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legend Card */}
      <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-fit max-w-[90%] rounded-xl z-50 bg-white">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center p-2 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-600"></div>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500"></div>
            <span>Closing Soon</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600"></div>
            <span>Closed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[0_0_0_2px_#16a34a] md:shadow-[0_0_0_3px_#16a34a]"></div>
            <span>Opening Soon</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
function formatTimeFromMinutes(totalMinutes: number): string {
  // Handle negative values
  if (totalMinutes < 0) {
    return `${formatTimeFromMinutes(-totalMinutes)} ago`;
  }

  // Handle zero case
  if (totalMinutes === 0) {
    return "0 minutes";
  }

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const parts = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  }

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0 || (days === 0 && hours === 0)) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }

  return parts.join(" ");
}
export default RouteOptimizer;
