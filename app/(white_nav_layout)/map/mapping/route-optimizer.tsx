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
import { outfitFont } from "@/components/fonts";
import { Location } from "@prisma/client";
import { formatTime } from "./utils";
// Import the separated functions and types
import { optimizeRoute } from "./calcsimple";
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
import RouteSegmentDisplay from "./routsegment";
import DepartureTimePicker from "./departureTime";
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

const RouteOptimizer = ({
  locations,
  googleMapsApiKey,
  initialLocation,
  userRole,
}: RouteOptimizerProps) => {
  // State Management
  const [departureTimePickerOpen, setDepartureTimePickerOpen] = useState(false);
  const [selectedDepartureTime, setSelectedDepartureTime] =
    useState<Date | null>(null);
  const [routeTimings, setRouteTimings] = useState<RouteTimings>({
    segmentTimes: {},
    returnTime: 0,
    totalTime: 0,
    totalDistance: 0,
    distanceSegments: {},
    suggestedPickupTimes: {},
  });
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
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
  const [zoom, setZoom] = useState(12);
  const [optimizedRoute, setOptimizedRoute] = useState<Location[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [pickupTimes, setPickupTimes] = useState<{ [key: string]: string }>({});
  const [customEndLocation, setCustomEndLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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
  const [orderedLocations, setOrderedLocations] =
    useState<Location[]>(locations);
  const onDragEnd = (result: any) => {
    if (!result.destination || !usePickupOrder) return;

    const items = Array.from(orderedLocations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedLocations(items);
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
  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);

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

  const validatePickupTime = (
    locationId: string,
    time: string
  ): TimeValidation => {
    const location = locations.find((loc) => loc.id === locationId);
    if (!location) return { isValid: false, message: "Location not found" };

    const selectedSeconds = timeStringToSeconds(time);

    // Check if location is open
    if (!isLocationOpen(location, selectedSeconds)) {
      return {
        isValid: false,
        message: "Location would be closed at this time",
      };
    }

    // Check time constraints with adjacent stops
    const locIndex = optimizedRoute.findIndex((loc) => loc.id === locationId);
    if (locIndex > 0) {
      const prevLocation = optimizedRoute[locIndex - 1];
      const prevPickupTime = pickupTimes[prevLocation.id];
      if (prevPickupTime) {
        const prevPickupSeconds = timeStringToSeconds(prevPickupTime);
        const travelTime = routeSegments[locIndex - 1]?.travelTime ?? 0;
        if (selectedSeconds - prevPickupSeconds < travelTime + 600) {
          return {
            isValid: false,
            message: "Insufficient travel time from previous stop",
          };
        }
      }
    }

    return { isValid: true, message: "" };
  };
  const getLocationStatusColor = (status: LocationStatus) => {
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
      // Find this location's segment in the route
      const segment = routeSegments.find(
        (seg) => seg.location.id === location.id
      );

      if (segment) {
        const arrivalTime = segment.arrivalTime;
        const closeTime = location.hours?.delivery[0]?.timeSlots[0]?.close
          ? location.hours?.delivery[0]?.timeSlots[0]?.close * 60
          : 0;

        const isCurrentlyOpen = isLocationOpen(location, startTime);
        const willBeOpenOnArrival = isLocationOpen(location, arrivalTime);
        const timeUntilClose = closeTime - arrivalTime;
        const closesSoon = timeUntilClose <= 1800 && timeUntilClose > 0; // 0-30 minutes

        statuses[location.id] = {
          isOpen: isCurrentlyOpen,
          willBeOpen: willBeOpenOnArrival,
          closesSoon: closesSoon,
          estimatedArrival: arrivalTime,
        };
      } else {
        // Default status for locations not in the route
        statuses[location.id] = {
          isOpen: isLocationOpen(location, startTime),
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
    if (!userLocation || locations.length === 0) return;
    clearMap();

    try {
      // Calculate start time based on selected departure time or current time + buffer
      const now = selectedDepartureTime || new Date();
      const startTime = selectedDepartureTime
        ? (selectedDepartureTime.getHours() * 60 +
            selectedDepartureTime.getMinutes()) *
          60
        : (now.getHours() * 60 + now.getMinutes()) * 60 + MIN_DEPARTURE_BUFFER;

      const optimizedResult = await optimizeTimeRoute(
        userLocation,
        usePickupOrder ? orderedLocations : locations,
        endLocation || userLocation,
        usePickupOrder,
        startTime
      );

      setOptimizedRoute(optimizedResult.route);
      setRouteTimings(optimizedResult.timings);

      // Update this line to use the same startTime
      let currentTime = startTime; // Remove the buffer calculation here
      const segments: RouteSegment[] = [];

      optimizedResult.route.forEach((location, index) => {
        const travelTime = optimizedResult.timings.segmentTimes[location.id];
        const distance = optimizedResult.timings.distanceSegments[location.id];

        const arrivalTime = currentTime + travelTime;
        const pickupTime = pickupTimes[location.id]
          ? timeStringToSeconds(pickupTimes[location.id])
          : arrivalTime + BUFFER_TIME;
        const waitTime = Math.max(0, pickupTime - (arrivalTime + BUFFER_TIME));
        const departureTime = pickupTime + AVERAGE_STOP_TIME;

        segments.push({
          location,
          arrivalTime,
          pickupTime,
          departureTime,
          travelTime,
          distance,
          waitTime,
        });

        currentTime = departureTime;
      });

      setRouteSegments(segments);

      // Update location statuses based on the calculated route
      const newStatuses = updateLocationStatuses(
        locations,
        segments,
        startTime
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
      const openTime = error.location?.hours?.delivery[0]?.timeSlots[0]?.open;
      const closeTime = error.location?.hours?.delivery[0]?.timeSlots[0]?.close;
      const formattedOpen = openTime ? formatTime(openTime) : "N/A";
      const formattedClose = closeTime ? formatTime(closeTime) : "N/A";

      // Use error.details.expectedArrival which is already in the correct format
      const estimatedArrival = error.details.expectedArrival || "N/A";

      errorMessage = (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">
            Cannot route to {error.location?.displayName || "location"}
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
          <Button onClick={() => calculateSimpleRoute()}>
            Create Route Without Time Constraints
          </Button>
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

  const onPlaceSelected = (place: google.maps.places.PlaceResult) => {
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

      showNotification(
        "End Location Set",
        `End location set to: ${place.formatted_address}`
      );
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

    setUserLocation(
      new google.maps.LatLng(initialLocation.lat, initialLocation.lng)
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(
            new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(
            new google.maps.LatLng(initialLocation.lat, initialLocation.lng)
          );
        }
      );
    }
  }, [isLoaded, initialLocation]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <DepartureTimePicker
        isOpen={departureTimePickerOpen}
        onClose={() => setDepartureTimePickerOpen(false)}
        onSubmit={handleDepartureTimeSet}
        currentTime={selectedDepartureTime || new Date()}
      />
      {/* Left Panel */}
      <Card className="absolute top-4 left-4 z-10 w-96 pt-6">
        <CardContent className="overflow-y-auto max-h-[calc(100vh-128px-2rem)]">
          <div className="">
            <Button
              className="w-full mb-4"
              onClick={() => setDepartureTimePickerOpen(true)}
              disabled={locations.length === 0}
            >
              {selectedDepartureTime
                ? `Departure: ${selectedDepartureTime.toLocaleString()}`
                : "Set Departure Time"}
            </Button>
            {/* Add this above the locations section */}
            <div className="flex items-center gap-1 ">
              <Switch
                checked={usePickupOrder}
                onCheckedChange={setUsePickupOrder}
              />
              <Label className="cursor-pointer">
                Enable drag & drop reordering
              </Label>
            </div>
            <StrictMode>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="locations" type="location">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
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
                              className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg mb-2 select-none border-2 border-transparent hover:border-blue-500 active:border-blue-700"
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
                              {" "}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {usePickupOrder && (
                                    <div className="text-gray-400 cursor-grab hover:text-gray-600">
                                      ⣿
                                    </div>
                                  )}
                                  <span
                                    className={`${outfitFont.className} font-medium truncate`}
                                  >
                                    {index + 1}. {location.displayName}
                                  </span>
                                </div>
                              </div>
                              {location?.hours?.delivery[0]?.timeSlots[0] && (
                                <div className="text-xs text-gray-600">
                                  Operating Hours:{" "}
                                  {formatTime(
                                    location.hours.delivery[0].timeSlots[0].open
                                  )}{" "}
                                  -{" "}
                                  {formatTime(
                                    location.hours.delivery[0].timeSlots[0]
                                      .close
                                  )}
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
            <div className="space-y-2">
              <label
                className={`${outfitFont.className} flex items-center gap-2`}
              >
                <Switch
                  checked={useCustomEndLocation}
                  onCheckedChange={(checked) => {
                    setUseCustomEndLocation(checked);
                    if (!checked) {
                      setEndLocation(null);
                      setCustomEndLocation(null);
                      setAddressSearch("");
                    }
                  }}
                />
                <span>Different End Location</span>
              </label>

              {useCustomEndLocation && (
                <div className="space-y-2">
                  <Label>End Location Address</Label>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      searchBoxRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      if (searchBoxRef.current) {
                        const place = searchBoxRef.current.getPlace();
                        onPlaceSelected(place);
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
                      placeholder="Enter an address..."
                      className="w-full"
                    />
                  </Autocomplete>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={calculateRoute}
              disabled={locations.length === 0}
            >
              Optimize Route
            </Button>
          </div>
          {routeSegments.length > 0 && (
            <div className="p-2 bg-slate-100 rounded-md">
              <div className="border-b">
                <div className="text-sm">
                  <p className="text-gray-600 pl-4">
                    Start Location: {addressSearch || "Current Location"}
                  </p>

                  {routeSegments.length > 0 && (
                    <p className="text-gray-600 pl-4">
                      Departure:{" "}
                      {routeSegments[0]
                        ? secondsToTimeString(
                            routeSegments[0].arrivalTime -
                              routeSegments[0].travelTime
                          )
                        : "N/A"}
                    </p>
                  )}

                  <p className="text-gray-600 pl-4">
                    Distance:{" "}
                    {metersToMiles(
                      routeSegments.length > 0
                        ? routeSegments.reduce(
                            (acc, segment) => acc + segment.distance,
                            0
                          )
                        : routeTimings.totalDistance
                    ).toFixed(1)}{" "}
                    miles, Time:{" "}
                    {formatDuration(
                      routeSegments.length > 0
                        ? routeSegments.reduce(
                            (acc, segment) => acc + segment.travelTime,
                            0
                          )
                        : routeTimings.totalTime
                    )}
                  </p>
                </div>
              </div>

              <div className="">
                <RouteSegmentDisplay
                  optimizedRoute={optimizedRoute}
                  routeTimings={routeTimings}
                  routeSegments={routeSegments}
                  useCustomEndLocation={useCustomEndLocation}
                />

                {useCustomEndLocation && customEndLocation && addressSearch && (
                  <div className="border-t">
                    <div className="font-medium">Final Destination:</div>
                    <div className="pl-4">
                      <p className="text-gray-600">{addressSearch}</p>
                      <p className="text-gray-600">
                        Travel Time from Last Stop:{" "}
                        {formatDuration(routeTimings.returnTime)}
                      </p>
                      {routeSegments.length > 0 &&
                        routeSegments[routeSegments.length - 1]
                          .departureTime !== undefined && (
                          <p className="text-gray-600">
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
            </div>
          )}
        </CardContent>
      </Card>{" "}
      {/* Map */}
      <GoogleMap
        key={mapKey}
        onLoad={onMapLoad}
        onZoomChanged={onZoomChanged}
        mapContainerClassName="w-full h-full"
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
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              url: "/icons/clipart2825061.png",
              scaledSize: new google.maps.Size(64, 76),
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
          const colors = getLocationStatusColor(status);
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
                  text: location.displayName || "no name found",
                  color: "black",
                  fontSize: "14px",
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
        {optimizedRoute.length > 1 && (
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className={`${outfitFont.className} ${
                modalState.variant === "destructive" ? "text-red-600" : ""
              }`}
            >
              {modalState.title}
            </DialogTitle>
          </DialogHeader>
          <div className={outfitFont.className}>{modalState.description}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RouteOptimizer;
