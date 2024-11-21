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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { outfitFont } from "@/components/fonts";
import { UserRole } from "@prisma/client";

// Constants
const AVERAGE_STOP_TIME = 10 * 60; // 10 minutes in seconds
const BUFFER_TIME = 5 * 60; // 5 minutes buffer between stops
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

// Interfaces
interface Location {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  name: string;
  address: string[];
  hours: {
    delivery: Array<{
      date: string;
      timeSlots: Array<{
        open: number;
        close: number;
      }>;
    }>;
  };
}

interface RouteOptimizerProps {
  locations: Location[];
  googleMapsApiKey: string;
  initialLocation: {
    lat: number;
    lng: number;
  };
  userRole: UserRole;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  variant?: "default" | "destructive";
}

interface TimeValidation {
  isValid: boolean;
  message: string;
}

interface OptimalRoute {
  locations: Location[];
  suggestedPickupTimes: { [key: string]: string };
  totalDuration: number;
}

interface RouteSegment {
  location: Location;
  arrivalTime: number;
  pickupTime: number;
  departureTime: number;
  travelTime: number;
  waitTime: number;
}

const RouteOptimizer = ({
  locations,
  googleMapsApiKey,
  initialLocation,
  userRole,
}: RouteOptimizerProps) => {
  // State Management
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [endLocation, setEndLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [zoom, setZoom] = useState(12);
  const [optimizedRoute, setOptimizedRoute] = useState<Location[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [pickupTimes, setPickupTimes] = useState<{ [key: string]: string }>({});
  const [customEndLocation, setCustomEndLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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

  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);

  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setZoom(map.getZoom() || 12);
  };
  const onZoomChanged = () => {
    if (mapRef.current) {
      setZoom(mapRef.current.getZoom() || 12);
    }
  };
  // Time Utility Functions
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  const secondsToTimeString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return (hours * 60 + minutes) * 60;
  };

  // Route Optimization Functions
  const getPermutations = <T,>(array: T[]): T[][] => {
    if (array.length <= 1) return [array];

    const result: T[][] = [];
    for (let i = 0; i < array.length; i++) {
      const current = array[i];
      const remaining = [...array.slice(0, i), ...array.slice(i + 1)];
      const remainingPerms = getPermutations(remaining);

      for (const perm of remainingPerms) {
        result.push([current, ...perm]);
      }
    }

    return result;
  };

  const isLocationOpen = (
    location: Location,
    timeInSeconds: number
  ): boolean => {
    const today = new Date().toISOString().split("T")[0];
    const todaySlots = location.hours.delivery.find(
      (slot) => slot.date.split("T")[0] === today
    );

    if (!todaySlots?.timeSlots[0]) return false;

    const openSeconds = todaySlots.timeSlots[0].open * 60;
    const closeSeconds = todaySlots.timeSlots[0].close * 60;

    return timeInSeconds >= openSeconds && timeInSeconds <= closeSeconds;
  };

  const getLocationOpenTime = (location: Location): number => {
    const today = new Date().toISOString().split("T")[0];
    const todaySlots = location.hours.delivery.find(
      (slot) => slot.date.split("T")[0] === today
    );
    return todaySlots?.timeSlots[0]?.open ?? 0;
  };

  const calculateOptimalRoute = async (
    startLocation: google.maps.LatLng,
    locations: Location[],
    endLoc: google.maps.LatLng | null
  ): Promise<OptimalRoute> => {
    const service = new google.maps.DistanceMatrixService();
    const now = new Date();
    const currentTimeInSeconds = (now.getHours() * 60 + now.getMinutes()) * 60;

    try {
      // Get distance matrix
      const matrix = await new Promise<google.maps.DistanceMatrixResponse>(
        (resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: [
                startLocation,
                ...locations.map(
                  (loc) =>
                    new google.maps.LatLng(
                      loc.coordinates.lat,
                      loc.coordinates.lng
                    )
                ),
              ],
              destinations: [
                ...locations.map(
                  (loc) =>
                    new google.maps.LatLng(
                      loc.coordinates.lat,
                      loc.coordinates.lng
                    )
                ),
                endLoc || startLocation,
              ],
              travelMode: google.maps.TravelMode.DRIVING,
              drivingOptions: {
                departureTime: new Date(),
                trafficModel: google.maps.TrafficModel.BEST_GUESS,
              },
            },
            (response, status) => {
              if (status === "OK" && response !== null) {
                resolve(response);
              } else {
                reject(status);
              }
            }
          );
        }
      );

      // Initialize tracking variables
      let bestRoute: Location[] = [];
      let bestTotalTime = Infinity;
      let bestPickupTimes: { [key: string]: string } = {};
      let bestSegments: RouteSegment[] = [];

      // Calculate times for each permutation
      const permutations = getPermutations(locations);
      for (const route of permutations) {
        let currentTime = currentTimeInSeconds;
        let currentLocation = 0;
        let totalTime = 0;
        let isValidRoute = true;
        let segments: RouteSegment[] = [];
        let pickupTimes: { [key: string]: string } = {};

        // Process each location in the route
        for (const location of route) {
          const travelTime =
            matrix.rows[currentLocation].elements[currentLocation + 1].duration
              .value;
          currentTime += travelTime;

          // Check if location is open
          if (!isLocationOpen(location, currentTime)) {
            const openTime = getLocationOpenTime(location) * 60;
            if (currentTime < openTime) {
              const waitTime = openTime - currentTime;
              currentTime += waitTime;
              totalTime += waitTime;
            } else {
              isValidRoute = false;
              break;
            }
          }

          // Record segment information
          segments.push({
            location,
            arrivalTime: currentTime,
            pickupTime: currentTime + BUFFER_TIME,
            departureTime: currentTime + BUFFER_TIME + AVERAGE_STOP_TIME,
            travelTime,
            waitTime: 0,
          });

          pickupTimes[location.id] = secondsToTimeString(
            currentTime + BUFFER_TIME
          );

          // Add processing and buffer time
          currentTime += AVERAGE_STOP_TIME + BUFFER_TIME;
          totalTime += travelTime + AVERAGE_STOP_TIME + BUFFER_TIME;
          currentLocation++;
        }

        // Update best route if current route is valid and faster
        if (isValidRoute && totalTime < bestTotalTime) {
          bestRoute = route;
          bestTotalTime = totalTime;
          bestPickupTimes = pickupTimes;
          bestSegments = segments;
        }
      }

      if (bestRoute.length === 0) {
        throw new Error("No valid route found within operating hours");
      }

      setRouteSegments(bestSegments);

      return {
        locations: bestRoute,
        suggestedPickupTimes: bestPickupTimes,
        totalDuration: bestTotalTime,
      };
    } catch (error) {
      console.error("Error calculating optimal route:", error);
      throw error;
    }
  };

  // Time Validation
  const validatePickupTime = (
    locationId: string,
    time: string
  ): TimeValidation => {
    const location = locations.find((loc) => loc.id === locationId);
    if (!location) return { isValid: false, message: "Location not found" };

    const segment = routeSegments.find((seg) => seg.location.id === locationId);
    if (!segment)
      return { isValid: false, message: "Route timing not calculated" };

    const selectedSeconds = timeStringToSeconds(time);
    const earliestPickup = segment.arrivalTime + BUFFER_TIME;
    const latestPickup = segment.departureTime - AVERAGE_STOP_TIME;

    if (selectedSeconds < earliestPickup) {
      return {
        isValid: false,
        message: `Cannot pickup before ${secondsToTimeString(earliestPickup)}`,
      };
    }

    if (selectedSeconds > latestPickup) {
      return {
        isValid: false,
        message: `Must pickup before ${secondsToTimeString(latestPickup)}`,
      };
    }

    if (!isLocationOpen(location, selectedSeconds)) {
      return {
        isValid: false,
        message: "Location is closed at this time",
      };
    }

    return { isValid: true, message: "" };
  };

  // Map and Location Handlers
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

  // Initialize map and location
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

  // Route Calculation
  const calculateRoute = async () => {
    if (!userLocation || locations.length === 0) return;

    try {
      // Calculate optimal route first
      const optimizedResult = await calculateOptimalRoute(
        userLocation,
        locations,
        endLocation || userLocation
      );

      setOptimizedRoute(optimizedResult.locations);
      setPickupTimes(optimizedResult.suggestedPickupTimes);

      // Show route summary
      showNotification(
        "Route Optimized",
        <div className="space-y-4">
          <div>
            <p className="font-medium">
              Total Route Time: {formatDuration(optimizedResult.totalDuration)}
            </p>
            <p className="text-sm text-gray-600">
              (Includes travel time, {formatDuration(AVERAGE_STOP_TIME)} per
              stop, and {formatDuration(BUFFER_TIME)} buffers)
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Suggested Schedule:</p>
            {routeSegments.map((segment, index) => (
              <div key={segment.location.id} className="text-sm">
                <div className="font-medium">
                  {index + 1}. {segment.location.name}
                </div>
                <div className="ml-4 text-gray-600">
                  <div>Arrival: {secondsToTimeString(segment.arrivalTime)}</div>
                  <div>
                    Suggested Pickup: {secondsToTimeString(segment.pickupTime)}
                  </div>
                  <div>Travel time: {formatDuration(segment.travelTime)}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium">
            You can adjust the suggested pickup times within each location's
            operating hours.
          </p>
        </div>
      );
    } catch (error) {
      showNotification(
        "Route Optimization Error",
        "Unable to find a valid route that meets all time constraints. Please try different locations or time windows.",
        "destructive"
      );
    }
  };
  // Notification Handler
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
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="relative h-[calc(100vh-64px)]">
      <Card className="absolute top-4 left-4 z-10 w-96">
        <CardHeader>
          <CardTitle className={outfitFont.className}>Route Planner</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(100vh-128px-2rem)]">
          {/* Selected Locations */}
          <div className="space-y-2">
            <h3 className={`${outfitFont.className} font-medium`}>
              Selected Locations ({locations.length})
            </h3>
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className={`${outfitFont.className} font-medium`}>
                    {location.name}
                  </span>
                </div>
                <span
                  className={`${outfitFont.className} text-xs text-gray-500`}
                >
                  {location.address[0]}
                </span>
                {/* Operating Hours */}
                {location.hours.delivery[0]?.timeSlots[0] && (
                  <div className="text-xs text-gray-600">
                    Operating Hours:{" "}
                    {formatTime(location.hours.delivery[0].timeSlots[0].open)} -{" "}
                    {formatTime(location.hours.delivery[0].timeSlots[0].close)}
                  </div>
                )}
                {/* Pickup Time Input */}
                <div className="mt-2">
                  <Label htmlFor={`pickup-${location.id}`}>
                    Pickup Time
                    {pickupTimes[location.id] && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Suggested: {pickupTimes[location.id]})
                      </span>
                    )}
                  </Label>
                  <Input
                    id={`pickup-${location.id}`}
                    type="time"
                    value={pickupTimes[location.id] || ""}
                    onChange={(e) => {
                      const validation = validatePickupTime(
                        location.id,
                        e.target.value
                      );
                      setTimeValidations((prev) => ({
                        ...prev,
                        [location.id]: validation,
                      }));
                      if (validation.isValid) {
                        setPickupTimes((prev) => ({
                          ...prev,
                          [location.id]: e.target.value,
                        }));
                      }
                    }}
                    className={
                      timeValidations[location.id]?.isValid === false
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {timeValidations[location.id]?.isValid === false && (
                    <div className="text-xs text-red-500 mt-1">
                      {timeValidations[location.id].message}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* End Location Selection */}
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

            {/* Calculate Route Button */}
            <Button
              className="w-full"
              onClick={calculateRoute}
              disabled={locations.length === 0}
            >
              Optimize Route
            </Button>

            {/* Route Summary */}
            {optimizedRoute.length > 0 && (
              <div className="p-2 bg-slate-100 rounded-md space-y-2">
                <p className={`${outfitFont.className} font-medium`}>
                  Optimized Route:
                </p>
                {optimizedRoute.map((location, index) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {index + 1}. {location.name}
                    </span>
                    <span className="text-gray-600">
                      {pickupTimes[location.id]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <GoogleMap
        key={locations.length}
        onLoad={onMapLoad}
        onZoomChanged={onZoomChanged}
        mapContainerClassName="w-full h-full"
        center={userLocation ?? undefined}
        zoom={12}
        options={{
          zoomControl: true,
          maxZoom: 16,
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
        {locations.map((location) => (
          <Circle
            key={location.id}
            center={location.coordinates}
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
              strokeColor: "lightblue",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "lightblue",
              fillOpacity: 0.35,
            }}
          />
        ))}

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
            {userLocation && (
              <Polyline
                path={[
                  { lat: userLocation.lat(), lng: userLocation.lng() },
                  {
                    lat: optimizedRoute[0].coordinates.lat,
                    lng: optimizedRoute[0].coordinates.lng,
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
              path={optimizedRoute.map((location) => ({
                lat: location.coordinates.lat,
                lng: location.coordinates.lng,
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

            {/* Line from last location to "final" location */}
            {endLocation ? (
              <Polyline
                path={[
                  {
                    lat: optimizedRoute[optimizedRoute.length - 1].coordinates
                      .lat,
                    lng: optimizedRoute[optimizedRoute.length - 1].coordinates
                      .lng,
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
              userLocation && (
                <Polyline
                  path={[
                    {
                      lat: optimizedRoute[optimizedRoute.length - 1].coordinates
                        .lat,
                      lng: optimizedRoute[optimizedRoute.length - 1].coordinates
                        .lng,
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
