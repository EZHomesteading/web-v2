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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { outfitFont } from "@/components/fonts";
import { Location, UserRole } from "@prisma/client";

// Constants
const AVERAGE_STOP_TIME = 5 * 60; // 5 minutes in seconds
const BUFFER_TIME = 5 * 60; // 5 minutes buffer between stops
const MIN_DEPARTURE_BUFFER = 15 * 60; // 15 minutes minimum before departure
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

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
  totalDistance: number;
  segments: RouteSegment[];
}

interface RouteSegment {
  location: Location;
  arrivalTime: number;
  pickupTime: number;
  departureTime: number;
  travelTime: number;
  distance: number;
  waitTime: number;
}

interface RouteResult {
  route: Location[];
  totalTime: number;
  totalDistance: number;
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

  // Refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);
  const metersToMiles = (meters: number): number => {
    return meters * 0.000621371; // Direct conversion from meters to miles
  };
  const clearMap = () => {
    setMapKey((prev) => prev + 1);
    setOptimizedRoute([]);
    setRouteSegments([]);
    setPickupTimes({});
    localStorage.removeItem("totalTime");
    localStorage.removeItem("totalDistance");
    localStorage.removeItem("routeTimes");
    localStorage.removeItem("returnTime");
  };
  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

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
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const secondsToInputTimeString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };
  const minutesToInputTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}`;
  };
  const timeStringToSeconds = (timeString: string): number => {
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let hours24 = hours;
    if (period === "PM" && hours !== 12) {
      hours24 += 12;
    } else if (period === "AM" && hours === 12) {
      hours24 = 0;
    }

    return (hours24 * 60 + minutes) * 60;
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

  const calculateRouteMetrics = (
    matrix: google.maps.DistanceMatrixResponse,
    route: Location[],
    startIdx: number,
    endIdx: number
  ): { totalTime: number; totalDistance: number } => {
    let totalTime = 0;
    let totalDistance = 0;

    // Start location to first stop
    if (route.length > 0) {
      const firstLocIdx = locations.findIndex((loc) => loc.id === route[0].id);
      totalTime += matrix.rows[startIdx].elements[firstLocIdx].duration.value;
      totalDistance +=
        matrix.rows[startIdx].elements[firstLocIdx].distance.value;
    }

    // Between locations
    for (let i = 0; i < route.length - 1; i++) {
      const currentLoc = route[i];
      const nextLoc = route[i + 1];
      const currentLocIdx = locations.findIndex(
        (loc) => loc.id === currentLoc.id
      );
      const nextLocIdx = locations.findIndex((loc) => loc.id === nextLoc.id);

      // Direct lookup without offset
      totalTime +=
        matrix.rows[currentLocIdx].elements[nextLocIdx].duration.value;
      totalDistance +=
        matrix.rows[currentLocIdx].elements[nextLocIdx].distance.value;
    }

    // Last stop to end location
    if (route.length > 0) {
      const lastLocIdx = locations.findIndex(
        (loc) => loc.id === route[route.length - 1].id
      );
      totalTime += matrix.rows[lastLocIdx].elements[endIdx].duration.value;
      totalDistance += matrix.rows[lastLocIdx].elements[endIdx].distance.value;
    }

    return { totalTime, totalDistance };
  };

  const getLocationOpenTime = (location: Location): number => {
    const today = new Date().toISOString().split("T")[0];
    const todayDeliverySlot = location.hours?.delivery?.find((slot) => {
      if (!slot) return false;
      return new Date(slot.date).toISOString().split("T")[0] === today;
    });

    if (
      !todayDeliverySlot ||
      !todayDeliverySlot.timeSlots ||
      todayDeliverySlot.timeSlots.length === 0
    ) {
      return 0;
    }

    return todayDeliverySlot.timeSlots[0].open;
  };
  const isLocationOpen = (
    location: Location,
    timeInSeconds: number
  ): boolean => {
    const today = new Date().toISOString().split("T")[0];
    const todayDeliverySlot = location.hours?.delivery?.find((slot) => {
      if (!slot) return false;
      return new Date(slot.date).toISOString().split("T")[0] === today;
    });

    if (
      !todayDeliverySlot ||
      !todayDeliverySlot.timeSlots ||
      todayDeliverySlot.timeSlots.length === 0
    ) {
      return false;
    }

    return (
      timeInSeconds >= todayDeliverySlot.timeSlots[0].open * 60 &&
      timeInSeconds <= todayDeliverySlot.timeSlots[0].close * 60
    );
  };
  const findDynamicNearestNeighborRoute = async (
    startLocation: google.maps.LatLng,
    locations: Location[],
    endLocation: google.maps.LatLng | null
  ): Promise<RouteResult> => {
    const service = new google.maps.DistanceMatrixService();

    const matrix = await new Promise<google.maps.DistanceMatrixResponse>(
      (resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [
              startLocation,
              ...locations.map(
                (loc) =>
                  new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
              ),
            ],
            destinations: [
              ...locations.map(
                (loc) =>
                  new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
              ),
              endLocation || startLocation,
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

    let unvisited = [...locations];
    let route: Location[] = [];
    let currentPos = startLocation;
    let currentIdx = 0;

    while (unvisited.length > 0) {
      let bestNextIdx = -1;
      let bestScore = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const locIdx = locations.findIndex((loc) => loc.id === unvisited[i].id);
        const timeToLocation =
          matrix.rows[currentIdx].elements[locIdx].duration.value;

        if (unvisited.length > 1) {
          let avgTimeToRemaining = 0;
          const remainingLocs = unvisited.filter((_, index) => index !== i);

          for (const remainingLoc of remainingLocs) {
            const remainingIdx = locations.findIndex(
              (loc) => loc.id === remainingLoc.id
            );
            avgTimeToRemaining +=
              matrix.rows[locIdx + 1].elements[remainingIdx].duration.value;
          }
          avgTimeToRemaining /= remainingLocs.length;

          const score = timeToLocation + avgTimeToRemaining * 0.5;

          if (score < bestScore) {
            bestScore = score;
            bestNextIdx = i;
          }
        } else {
          if (timeToLocation < bestScore) {
            bestScore = timeToLocation;
            bestNextIdx = i;
          }
        }
      }

      if (bestNextIdx !== -1) {
        const chosenLocation = unvisited[bestNextIdx];
        route.push(chosenLocation);
        currentIdx =
          locations.findIndex((loc) => loc.id === chosenLocation.id) + 1;
        currentPos = new google.maps.LatLng(
          chosenLocation.coordinates[1],
          chosenLocation.coordinates[0]
        );
        unvisited.splice(bestNextIdx, 1);
      }
    }

    // Calculate final destination index (last location in matrix)
    const finalDestinationIdx = matrix.rows[0].elements.length - 1;

    const metrics = calculateRouteMetrics(
      matrix,
      route,
      0,
      finalDestinationIdx
    );

    return {
      route,
      totalTime: metrics.totalTime,
      totalDistance: metrics.totalDistance,
    };
  };

  const findPermutationRoute = async (
    startLocation: google.maps.LatLng,
    locations: Location[],
    endLocation: google.maps.LatLng | null
  ): Promise<RouteResult> => {
    const service = new google.maps.DistanceMatrixService();

    const matrix = await new Promise<google.maps.DistanceMatrixResponse>(
      (resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [
              startLocation,
              ...locations.map(
                (loc) =>
                  new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
              ),
            ],
            destinations: [
              ...locations.map(
                (loc) =>
                  new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
              ),
              endLocation || startLocation,
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

    let bestRoute: Location[] = [];
    let bestTotalTime = Infinity;
    let bestTotalDistance = Infinity;

    const permutations = getPermutations(locations);
    // Calculate final destination index (last location in matrix)
    const finalDestinationIdx = matrix.rows[0].elements.length - 1;

    for (const perm of permutations) {
      const metrics = calculateRouteMetrics(
        matrix,
        perm,
        0,
        finalDestinationIdx
      );

      if (metrics.totalTime < bestTotalTime) {
        bestRoute = perm;
        bestTotalTime = metrics.totalTime;
        bestTotalDistance = metrics.totalDistance;
      }
    }

    return {
      route: bestRoute,
      totalTime: bestTotalTime,
      totalDistance: bestTotalDistance,
    };
  };

  const calculateSimpleRoute = async () => {
    if (!userLocation || locations.length === 0) return;
    clearMap();
    try {
      let bestRoute: RouteResult;

      if (locations.length <= 8) {
        bestRoute = await findPermutationRoute(
          userLocation,
          locations,
          endLocation
        );
      } else {
        bestRoute = await findDynamicNearestNeighborRoute(
          userLocation,
          locations,
          endLocation
        );
      }

      // Store the route metrics
      localStorage.setItem("totalTime", bestRoute.totalTime.toString());
      localStorage.setItem("totalDistance", bestRoute.totalDistance.toString());

      // Calculate and store individual travel times
      const service = new google.maps.DistanceMatrixService();
      const routeTimes: { [key: string]: number } = {};

      // Calculate times between stops
      for (let i = 0; i < bestRoute.route.length; i++) {
        const isLastStop = i === bestRoute.route.length - 1;
        const origin = new google.maps.LatLng(
          bestRoute.route[i].coordinates[1],
          bestRoute.route[i].coordinates[0]
        );

        let destination;
        if (isLastStop) {
          // For the last stop, use the end location or return to start
          destination = endLocation || userLocation;
        } else {
          destination = new google.maps.LatLng(
            bestRoute.route[i + 1].coordinates[1],
            bestRoute.route[i + 1].coordinates[0]
          );
        }

        const result = await service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        });

        if (result.rows[0]?.elements[0]?.duration) {
          if (isLastStop) {
            // Store the return time separately
            localStorage.setItem(
              "returnTime",
              result.rows[0].elements[0].duration.value.toString()
            );
          } else {
            routeTimes[bestRoute.route[i].id] =
              result.rows[0].elements[0].duration.value;
          }
        }
      }

      localStorage.setItem("routeTimes", JSON.stringify(routeTimes));

      setOptimizedRoute(bestRoute.route);
      setPickupTimes({});
      setRouteSegments([]);

      showNotification(
        "Optimized Route Created",
        <div className="space-y-4">
          <div>
            <p className="font-medium">Best Route Found:</p>
            <p className="text-sm text-gray-600">
              Total drive time: {formatDuration(bestRoute.totalTime)}
              <br />
              Total Distance:{" "}
              {metersToMiles(
                Number(localStorage.getItem("totalDistance"))
              ).toFixed(1)}{" "}
              miles
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Route Order:</p>
            {bestRoute.route.map((location, index) => (
              <div key={location.id} className="text-sm ml-4">
                {index + 1}. {location.displayName}
              </div>
            ))}
          </div>
        </div>
      );

      // Force a re-render
      setOptimizedRoute([...bestRoute.route]);
    } catch (error) {
      console.error("Route calculation error:", error);
      showNotification(
        "Route Creation Error",
        "Unable to create route. Please try again.",
        "destructive"
      );
    }
  };

  const calculateOptimalRoute = async (
    startLocation: google.maps.LatLng,
    locations: Location[],
    endLoc: google.maps.LatLng | null
  ): Promise<OptimalRoute> => {
    const service = new google.maps.DistanceMatrixService();
    const now = new Date();
    const currentTimeInSeconds = (now.getHours() * 60 + now.getMinutes()) * 60;
    let startTime = currentTimeInSeconds + MIN_DEPARTURE_BUFFER;

    // Get existing pickup times
    const existingPickupTimes = { ...pickupTimes };

    // Convert locations to mutable array for reordering
    let routeLocations = [...locations];

    // Sort locations with user-entered times by those times
    if (Object.keys(existingPickupTimes).length > 0) {
      routeLocations.sort((a, b) => {
        const timeA = existingPickupTimes[a.id]
          ? timeStringToSeconds(existingPickupTimes[a.id])
          : Infinity;
        const timeB = existingPickupTimes[b.id]
          ? timeStringToSeconds(existingPickupTimes[b.id])
          : Infinity;
        return timeA - timeB;
      });
    }

    try {
      const matrix = await new Promise<google.maps.DistanceMatrixResponse>(
        (resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: [
                startLocation,
                ...routeLocations.map(
                  (loc) =>
                    new google.maps.LatLng(
                      loc.coordinates[1],
                      loc.coordinates[0]
                    )
                ),
              ],
              destinations: [
                ...routeLocations.map(
                  (loc) =>
                    new google.maps.LatLng(
                      loc.coordinates[1],
                      loc.coordinates[0]
                    )
                ),
                endLoc || startLocation,
              ],
              travelMode: google.maps.TravelMode.DRIVING,
              drivingOptions: {
                departureTime: new Date(
                  now.getTime() + MIN_DEPARTURE_BUFFER * 1000
                ),
                trafficModel: google.maps.TrafficModel.BEST_GUESS,
              },
            },
            (response, status) => {
              if (status === "OK" && response !== null) resolve(response);
              else reject(status);
            }
          );
        }
      );

      let currentTime = startTime;
      let currentLocation = 0;
      let totalTime = 0;
      let totalDistance = 0;
      let segments: RouteSegment[] = [];
      let newPickupTimes: { [key: string]: string } = {};

      // Calculate initial travel time to first location
      if (routeLocations.length > 0) {
        const firstLocIndex = locations.findIndex(
          (loc) => loc.id === routeLocations[0].id
        );
        const initialTravelTime =
          matrix.rows[0].elements[firstLocIndex].duration.value;

        // If first location has a user-entered time, adjust start time
        if (existingPickupTimes[routeLocations[0].id]) {
          const userPickupTime = timeStringToSeconds(
            existingPickupTimes[routeLocations[0].id]
          );
          startTime = userPickupTime - BUFFER_TIME - initialTravelTime;
          currentTime = startTime;
        }
      }

      // Process each location
      for (const location of routeLocations) {
        const matrixIndex = locations.findIndex(
          (loc) => loc.id === location.id
        );
        let travelTime = 0;
        let distance = 0;

        // Calculate travel time and distance to next location
        if (currentLocation === routeLocations.length - 1) {
          const finalDestIndex = matrix.rows[0].elements.length - 1;
          travelTime =
            matrix.rows[currentLocation].elements[finalDestIndex].duration
              .value;
          distance =
            matrix.rows[currentLocation].elements[finalDestIndex].distance
              .value;
        } else {
          const nextLocation = routeLocations[currentLocation + 1];
          const nextLocIndex = locations.findIndex(
            (loc) => loc.id === nextLocation.id
          );
          const currentLocIndex = locations.findIndex(
            (loc) => loc.id === location.id
          );
          travelTime =
            matrix.rows[currentLocIndex + 1].elements[nextLocIndex].duration
              .value;
          distance =
            matrix.rows[currentLocIndex + 1].elements[nextLocIndex].distance
              .value;
        }

        if (currentLocation === 0) {
          currentTime += matrix.rows[0].elements[matrixIndex].duration.value;
        }

        let arrivalTime = currentTime;
        let pickupTime: number;
        let waitTime = 0;

        if (existingPickupTimes[location.id]) {
          // Use user-entered pickup time
          pickupTime = timeStringToSeconds(existingPickupTimes[location.id]);

          // Validate user-entered pickup time
          const validation = validatePickupTime(
            location.id,
            existingPickupTimes[location.id]
          );
          if (!validation?.isValid) {
            throw new Error(
              `Invalid pickup time for ${location.displayName}: ${validation?.message}`
            );
          }

          // Calculate wait time if arriving before pickup time
          if (pickupTime - BUFFER_TIME > arrivalTime) {
            waitTime = pickupTime - BUFFER_TIME - arrivalTime;
            arrivalTime = pickupTime - BUFFER_TIME;
          }
        } else {
          // For locations without user times, find earliest possible pickup
          const openTime = getLocationOpenTime(location) * 60;
          pickupTime = Math.max(arrivalTime + BUFFER_TIME, openTime);
          if (pickupTime > arrivalTime + BUFFER_TIME) {
            waitTime = pickupTime - (arrivalTime + BUFFER_TIME);
            arrivalTime = pickupTime - BUFFER_TIME;
          }
        }

        const departureTime = pickupTime + AVERAGE_STOP_TIME;

        // Validate location is open
        if (!isLocationOpen(location, pickupTime)) {
          throw new Error(
            `Location ${location.displayName} would be closed at pickup time`
          );
        }

        segments.push({
          location,
          arrivalTime,
          pickupTime,
          departureTime,
          travelTime,
          distance,
          waitTime,
        });

        newPickupTimes[location.id] =
          existingPickupTimes[location.id] ||
          secondsToInputTimeString(pickupTime);

        currentTime = departureTime + travelTime;
        totalTime += travelTime + AVERAGE_STOP_TIME + BUFFER_TIME + waitTime;
        totalDistance += distance;
        currentLocation++;
      }

      setRouteSegments(segments);

      return {
        locations: routeLocations,
        suggestedPickupTimes: newPickupTimes,
        totalDuration: totalTime,
        totalDistance,
        segments,
      };
    } catch (error) {
      console.error("Error calculating optimal route:", error);
      throw error;
    }
  };

  const validatePickupTime = (
    locationId: string,
    time: string
  ): TimeValidation | undefined => {
    const location = locations.find((loc) => loc.id === locationId);
    if (!location) return { isValid: false, message: "Location not found" };

    const selectedSeconds = timeStringToSeconds(time);

    // Get today's operating hours
    const today = new Date().toISOString().split("T")[0];
    const todaySlots = location.hours?.delivery?.find(
      (slot) => new Date(slot.date).toISOString().split("T")[0] === today
    );

    if (!todaySlots?.timeSlots?.[0]) {
      return { isValid: false, message: "No operating hours found for today" };
    }

    const openSeconds = todaySlots.timeSlots[0].open * 60;
    const closeSeconds = todaySlots.timeSlots[0].close * 60;

    if (selectedSeconds < openSeconds) {
      return {
        isValid: false,
        message: `Location opens at ${secondsToTimeString(openSeconds)}`,
      };
    }

    if (selectedSeconds > closeSeconds) {
      return {
        isValid: false,
        message: `Location closes at ${secondsToTimeString(closeSeconds)}`,
      };
    }

    // Check if pickup time is too close to previous stop
    const locIndex = optimizedRoute.findIndex((loc) => loc.id === locationId);
    if (locIndex > 0) {
      const prevLocation = optimizedRoute[locIndex - 1];
      const prevPickupTime = pickupTimes[prevLocation.id];

      if (prevPickupTime) {
        const prevPickupSeconds = timeStringToSeconds(prevPickupTime);
        const travelTime = routeSegments[locIndex - 1]?.travelTime ?? 0;

        if (
          selectedSeconds - prevPickupSeconds <
          travelTime + AVERAGE_STOP_TIME + BUFFER_TIME
        ) {
          return {
            isValid: false,
            message: "Insufficient travel time from previous stop",
          };
        }
      }
    }

    // Check if pickup time is too close to next stop
    if (locIndex < optimizedRoute.length - 1) {
      const nextLocation = optimizedRoute[locIndex + 1];
      const nextPickupTime = pickupTimes[nextLocation.id];

      if (nextPickupTime) {
        const nextPickupSeconds = timeStringToSeconds(nextPickupTime);
        const travelTime = routeSegments[locIndex]?.travelTime ?? 0;

        if (
          nextPickupSeconds - selectedSeconds <
          AVERAGE_STOP_TIME + BUFFER_TIME + travelTime
        ) {
          return {
            isValid: false,
            message: "Insufficient travel time to next stop",
          };
        }
      }
    }

    return { isValid: true, message: "" };
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

  const calculateRoute = async () => {
    if (!userLocation || locations.length === 0) return;
    clearMap();

    try {
      const optimizedResult = await calculateOptimalRoute(
        userLocation,
        locations,
        endLocation || userLocation
      );

      setOptimizedRoute(optimizedResult.locations);
      setPickupTimes(optimizedResult.suggestedPickupTimes);
      setRouteSegments(optimizedResult.segments);

      console.log(routeSegments);
      showNotification(
        "Route Optimized",
        <div className="space-y-4">
          <div>
            <p className="font-medium">
              Suggested Departure:{" "}
              {optimizedResult.segments[0]
                ? secondsToTimeString(
                    optimizedResult.segments[0].arrivalTime -
                      optimizedResult.segments[0].travelTime
                  )
                : "N/A"}
              <br />
              Total Route Time: {formatDuration(optimizedResult.totalDuration)}
              <br />
              Total distance:{" "}
              {metersToMiles(optimizedResult.totalDistance).toFixed(1)} miles
            </p>
            <p className="text-sm text-gray-600">
              (Includes travel time, {formatDuration(AVERAGE_STOP_TIME)} per
              stop, and {formatDuration(BUFFER_TIME)} buffers)
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Suggested Schedule:</p>
            {optimizedResult.segments.map((segment, index) => (
              <div key={segment.location.id} className="text-sm">
                <div className="font-medium">
                  {index + 1}. {segment.location.displayName}
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
        <div className="space-y-4">
          <p>
            Unable to find a valid route that meets all time constraints. Please
            try different locations or time windows.
          </p>
          <DialogFooter>
            <Button
              onClick={() => {
                setModalState({ isOpen: false, title: "", description: "" });
                calculateSimpleRoute();
              }}
            >
              Create Route Without Time Constraints
            </Button>
          </DialogFooter>
        </div>,
        "destructive"
      );
    }
  };

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
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => clearMap()}
              disabled={locations.length === 0}
            >
              Reset
            </Button>
            <h3 className={`${outfitFont.className} font-medium`}>
              Selected Locations ({locations.length})
            </h3>
            <h3 className={`${outfitFont.className} font-medium`}>
              If you enter a time in one location you will always go to that
              location first
            </h3>
            <h3 className={`${outfitFont.className} font-medium`}>
              Arrival times are calculated as though you leave after 10 minutes
              of arrival.
            </h3>
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className={`${outfitFont.className} font-medium`}>
                    {location.displayName}
                  </span>
                </div>
                <span
                  className={`${outfitFont.className} text-xs text-gray-500`}
                >
                  {location.address[0]}
                </span>
                {location?.hours?.delivery[0]?.timeSlots[0] && (
                  <div className="text-xs text-gray-600">
                    Operating Hours:{" "}
                    {formatTime(location.hours.delivery[0].timeSlots[0].open)} -{" "}
                    {formatTime(location.hours.delivery[0].timeSlots[0].close)}
                  </div>
                )}
                <div className="mt-2">
                  <Label htmlFor={`pickup-${location.id}`}>
                    Pickup Time
                    {pickupTimes[location.id] && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Suggested:{" "}
                        {secondsToTimeString(
                          timeStringToSeconds(pickupTimes[location.id])
                        )}
                        )
                      </span>
                    )}
                  </Label>
                  <Input
                    id={`pickup-${location.id}`}
                    type="time"
                    // min={secondsToInputTimeString(
                    //   location?.hours?.delivery[0].timeSlots[0].open
                    //     ? location?.hours?.delivery[0].timeSlots[0].open
                    //     : 0
                    // )}
                    // max={secondsToInputTimeString(
                    //   location?.hours?.delivery[0].timeSlots[0].close
                    //     ? location?.hours?.delivery[0].timeSlots[0].close
                    //     : 24 * 60
                    // )}
                    value={pickupTimes[location.id] || ""}
                    onChange={(e) => {
                      console.log(e.target.value);
                      console.log(
                        location?.hours?.delivery[0].timeSlots[0].close
                      );

                      const validation = validatePickupTime(
                        location.id,
                        e.target.value
                      );
                      setTimeValidations((prev) => ({
                        ...prev,
                        [location.id]: validation || {
                          isValid: false,
                          message: "",
                        },
                      }));
                      if (validation?.isValid) {
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

            {optimizedRoute.length > 0 && (
              <div className="p-2 bg-slate-100 rounded-md space-y-4">
                <div className="border-b pb-2">
                  <p className={`${outfitFont.className} font-medium text-lg`}>
                    {routeSegments.length > 0
                      ? "Time-Optimized Route"
                      : "Distance-Optimized Route"}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {routeSegments.length > 0 ? (
                      // Time-optimized route summary
                      <>
                        <p>
                          Total Distance:{" "}
                          {metersToMiles(
                            routeSegments.reduce(
                              (acc, segment) => acc + segment.distance,
                              0
                            )
                          ).toFixed(1)}{" "}
                          miles
                        </p>

                        <p>
                          Suggested Departure:{" "}
                          {routeSegments[0]
                            ? secondsToTimeString(
                                routeSegments[0].arrivalTime -
                                  routeSegments[0].travelTime
                              )
                            : "N/A"}
                        </p>
                        <p>
                          Total Travel Time:{" "}
                          {formatDuration(
                            routeSegments.reduce(
                              (acc, segment) => acc + segment.travelTime,
                              0
                            )
                          )}
                        </p>
                        <p className="text-xs">
                          (Travel time does not include, 5 min per stop, and 5
                          min buffers)
                        </p>
                      </>
                    ) : (
                      // Distance-optimized route summary
                      <>
                        <p>
                          Total Distance:{" "}
                          {localStorage.getItem("totalDistance")
                            ? `${metersToMiles(
                                Number(localStorage.getItem("totalDistance"))
                              ).toFixed(1)} miles`
                            : "Calculating..."}
                        </p>
                        <p>
                          Total Travel Time:{" "}
                          {localStorage.getItem("totalTime")
                            ? formatDuration(
                                Number(localStorage.getItem("totalTime"))
                              )
                            : "Calculating..."}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className={`${outfitFont.className} font-medium`}>
                    Stop Details:
                  </p>
                  {optimizedRoute.map((location, index) => {
                    const segment = routeSegments[index];
                    const isLastStop = index === optimizedRoute.length - 1;

                    return (
                      <div
                        key={location.id}
                        className="flex flex-col space-y-1 pb-2 border-b last:border-b-0"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {index + 1}. {location.displayName}
                            </span>
                          </div>
                          {/* Show pickup time only for time-optimized routes */}
                          {routeSegments.length > 0 &&
                            pickupTimes[location.id] && (
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Pickup:</span>
                                <span className="text-blue-600 font-medium">
                                  {secondsToTimeString(
                                    timeStringToSeconds(
                                      pickupTimes[location.id]
                                    )
                                  )}
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="text-sm text-gray-600 pl-6 space-y-0.5">
                          {routeSegments.length > 0 ? (
                            // Time-optimized route details
                            segment && (
                              <>
                                <div className="flex justify-between">
                                  <span>Arrival:</span>
                                  <span>
                                    {secondsToTimeString(
                                      segment.arrivalTime - segment.waitTime
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>
                                    {isLastStop
                                      ? "Time to Return:"
                                      : "Travel Time to Next Stop:"}
                                  </span>
                                  <span>
                                    {formatDuration(segment.travelTime)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Distance:</span>
                                  <span>
                                    {metersToMiles(segment.distance).toFixed(1)}{" "}
                                    miles
                                  </span>
                                </div>
                                {segment.waitTime > 0 && (
                                  <div className="flex justify-between">
                                    <span>Wait Time:</span>
                                    <span>
                                      {formatDuration(segment.waitTime)}
                                    </span>
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            // Distance-optimized route details
                            <div className="flex justify-between">
                              <span>
                                {isLastStop
                                  ? "Time to Return:"
                                  : "Travel Time to Next Stop:"}
                              </span>
                              <span>
                                {isLastStop
                                  ? localStorage.getItem("returnTime")
                                    ? formatDuration(
                                        parseInt(
                                          localStorage.getItem("returnTime") ||
                                            "0"
                                        )
                                      )
                                    : "Not available"
                                  : JSON.parse(
                                      localStorage.getItem("routeTimes") || "{}"
                                    )[location.id]
                                  ? formatDuration(
                                      JSON.parse(
                                        localStorage.getItem("routeTimes") ||
                                          "{}"
                                      )[location.id]
                                    )
                                  : "Not available"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
        {locations.map((location, index) => (
          <Circle
            key={location.id}
            center={
              new google.maps.LatLng(
                location.coordinates[1],
                location.coordinates[0]
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
              strokeColor: "green",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "green",
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
                    lat: optimizedRoute[0].coordinates[1],
                    lng: optimizedRoute[0].coordinates[0],
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
                lat: location.coordinates[1],
                lng: location.coordinates[0],
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
            {endLocation ? (
              <Polyline
                path={[
                  {
                    lat: optimizedRoute[optimizedRoute.length - 1]
                      .coordinates[1],
                    lng: optimizedRoute[optimizedRoute.length - 1]
                      .coordinates[0],
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
                      lat: optimizedRoute[optimizedRoute.length - 1]
                        .coordinates[1],
                      lng: optimizedRoute[optimizedRoute.length - 1]
                        .coordinates[0],
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
