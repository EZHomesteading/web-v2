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
const LATENESS_PENALTY_MULTIPLIER = 2;
const WAIT_TIME_PENALTY_MULTIPLIER = 1.5;

interface RouteOptimizerProps {
  locations: Location[];
  googleMapsApiKey: string;
  initialLocation: {
    lat: number;
    lng: number;
  };
  userRole: UserRole;
}
type ExistingPickupTimes = { [key: string]: string };
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

interface MatrixTravelInfo {
  travelTime: number;
  distance: number;
}

interface RouteValidationResult {
  isValid: boolean;
  currentTime: number;
  segments: RouteSegment[];
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
  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return (hours * 60 + minutes) * 60;
  };

  // Route Optimization Functions

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

    if (!location.hours?.delivery) return 0;

    const todaySlots = location.hours.delivery.find(
      (slot) => new Date(slot.date).toISOString().split("T")[0] === today
    );

    return todaySlots?.timeSlots[0]?.open ?? 0;
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

    // This now uses the calculateRouteMetrics from the utils
    let bestRoute: Location[] = [];
    let bestTotalTime = Infinity;
    let bestTotalDistance = Infinity;

    const permutations = getPermutations(locations);
    const finalDestinationIdx = matrix.rows[0].elements.length - 1;

    for (const perm of permutations) {
      const validation = await validateRoute(
        perm,
        await getDistanceMatrix(startLocation, locations, endLocation),
        locations,
        startLocation,
        endLocation
      );
      if (validation.isValid) {
        const totalTime = validation.segments.reduce(
          (acc, segment) => acc + segment.travelTime,
          0
        );
        const totalDistance = validation.segments.reduce(
          (acc, segment) => acc + segment.distance,
          0
        );

        if (totalTime < bestTotalTime) {
          bestRoute = perm;
          bestTotalTime = totalTime;
          bestTotalDistance = totalDistance;
        }
      }
    }

    return {
      route: bestRoute,
      totalTime: bestTotalTime,
      totalDistance: bestTotalDistance,
    };
  };
  const getDistanceMatrix = async (
    startLocation: google.maps.LatLng,
    locations: Location[],
    endLocation: google.maps.LatLng | null
  ): Promise<google.maps.DistanceMatrixResponse> => {
    const service = new google.maps.DistanceMatrixService();

    return new Promise((resolve, reject) => {
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
    });
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

      const validation = await validateRoute(
        bestRoute.route,
        await getDistanceMatrix(userLocation, locations, endLocation),
        locations,
        userLocation,
        endLocation
      );

      if (!validation.isValid) {
        throw new Error("Could not validate route");
      }

      setOptimizedRoute(bestRoute.route);
      setRouteSegments(validation.segments);
      setPickupTimes({});

      showNotification(
        "Route Created",
        <div className="space-y-4">
          {/* Rest of the code remains the same */}
        </div>
      );
    } catch (error) {
      console.error("Route calculation error:", error);
      showNotification(
        "Route Creation Error",
        "Unable to create route. Please try again.",
        "destructive"
      );
    }
  };

  const validatePickupTime = (
    locationId: string,
    time: string
  ): TimeValidation => {
    const location = locations.find((loc) => loc.id === locationId);
    if (!location) return { isValid: false, message: "Location not found" };

    const selectedSeconds = timeStringToSeconds(time);

    // Get today's operating hours
    const today = new Date().toISOString().split("T")[0];
    const todaySlots = location.hours?.delivery?.find(
      (slot) => new Date(slot.date).toISOString().split("T")[0] === today
    );

    if (!todaySlots?.timeSlots[0]) {
      return { isValid: false, message: "No operating hours found for today" };
    }

    const openSeconds = todaySlots.timeSlots[0].open * 60;
    const closeSeconds = todaySlots.timeSlots[0].close * 60;

    if (selectedSeconds < openSeconds) {
      return {
        isValid: false,
        message: `Location opens at ${formatTime(
          todaySlots.timeSlots[0].open
        )}`,
      };
    }

    if (selectedSeconds > closeSeconds) {
      return {
        isValid: false,
        message: `Location closes at ${formatTime(
          todaySlots.timeSlots[0].close
        )}`,
      };
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
  const findBestRouteOrder = async (
    matrix: google.maps.DistanceMatrixResponse,
    locations: Location[],
    existingPickupTimes: ExistingPickupTimes,
    startLocation: google.maps.LatLng
  ): Promise<RouteValidationResult> => {
    const locationWithTimes = locations.filter(
      (loc) => existingPickupTimes[loc.id]
    );
    const unconstrained = locations.filter(
      (loc) => !existingPickupTimes[loc.id]
    );

    // If no time constraints, use regular optimization
    if (locationWithTimes.length === 0) {
      const result = await findPermutationRoute(startLocation, locations, null);
      const validation = await validateRoute(
        result.route,
        matrix,
        locations,
        startLocation,
        null
      );
      return validation;
    }

    const constrainedPermutations = getPermutations(locationWithTimes);
    let bestValidation: RouteValidationResult | null = null;
    let bestScore = Infinity;

    for (const constrainedOrder of constrainedPermutations) {
      const unconstrainedPermutations = getPermutations(unconstrained);

      for (const unconstrainedOrder of unconstrainedPermutations) {
        const possibleInsertions = generatePossibleInsertions(
          constrainedOrder,
          unconstrainedOrder
        );

        for (const route of possibleInsertions) {
          const validation = await validateRoute(
            route,
            matrix,
            existingPickupTimes,
            locations,
            startLocation
          );

          if (validation.isValid) {
            const score = calculateRouteScore(validation, existingPickupTimes);
            if (score < bestScore) {
              bestScore = score;
              bestValidation = validation;
            }
          }
        }
      }
    }

    if (!bestValidation) {
      throw new Error("No valid route found meeting all time constraints");
    }

    return bestValidation;
  };
  const getTravelInfo = (
    matrix: google.maps.DistanceMatrixResponse,
    fromIndex: number,
    toIndex: number
  ): MatrixTravelInfo => {
    return {
      travelTime: matrix.rows[fromIndex].elements[toIndex].duration.value,
      distance: matrix.rows[fromIndex].elements[toIndex].distance.value,
    };
  };

  const getLocationIndex = (
    location: Location,
    locations: Location[]
  ): number => {
    return locations.findIndex((loc) => loc.id === location.id);
  };

  const isLocationOpen = (
    location: Location,
    timeInSeconds: number
  ): boolean => {
    const today = new Date().toISOString().split("T")[0];

    if (!location.hours?.delivery) return false;

    const todaySlots = location.hours.delivery.find(
      (slot) => new Date(slot.date).toISOString().split("T")[0] === today
    );

    if (!todaySlots?.timeSlots[0]) return false;

    const openSeconds = todaySlots.timeSlots[0].open * 60;
    const closeSeconds = todaySlots.timeSlots[0].close * 60;

    return timeInSeconds >= openSeconds && timeInSeconds <= closeSeconds;
  };

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

  const generatePossibleInsertions = (
    constrained: Location[],
    unconstrained: Location[]
  ): Location[][] => {
    const results: Location[][] = [];

    if (unconstrained.length === 0) {
      return [constrained];
    }

    const insertLocations = (
      current: Location[],
      remaining: Location[],
      startPos: number
    ): void => {
      if (remaining.length === 0) {
        results.push([...current]);
        return;
      }

      const location = remaining[0];
      const nextRemaining = remaining.slice(1);

      for (let i = startPos; i <= current.length; i++) {
        const newCurrent = [
          ...current.slice(0, i),
          location,
          ...current.slice(i),
        ];
        insertLocations(newCurrent, nextRemaining, i + 1);
      }
    };

    insertLocations(constrained, unconstrained, 0);
    return results;
  };

  const validateRoute = async (
    route: Location[],
    matrix: google.maps.DistanceMatrixResponse,
    locations: Location[],
    startLocation: google.maps.LatLng,
    endLocation: google.maps.LatLng | null
  ): Promise<RouteValidationResult> => {
    let currentTime = timeStringToSeconds("00:00"); // Start of day
    let currentLocationIndex = 0;
    let segments: RouteSegment[] = [];

    for (const location of route) {
      const locationIndex = getLocationIndex(location, locations);
      const travelInfo = getTravelInfo(
        matrix,
        currentLocationIndex,
        locationIndex
      );

      currentTime += travelInfo.travelTime;
      let arrivalTime = currentTime;
      let waitTime = 0;
      let pickupTime: number;

      // If this location has a specified pickup time
      if (pickupTimes[location.id]) {
        const requiredPickup = timeStringToSeconds(pickupTimes[location.id]);
        if (currentTime > requiredPickup) {
          return { isValid: false, currentTime: 0, segments: [] };
        }
        if (currentTime < requiredPickup - BUFFER_TIME) {
          waitTime = requiredPickup - BUFFER_TIME - currentTime;
          currentTime = requiredPickup - BUFFER_TIME;
        }
        pickupTime = requiredPickup;
      } else {
        pickupTime = currentTime + BUFFER_TIME;
      }

      // Check if location will be open
      if (!isLocationOpen(location, pickupTime)) {
        return { isValid: false, currentTime: 0, segments: [] };
      }

      const departureTime = pickupTime + AVERAGE_STOP_TIME;

      segments.push({
        location,
        arrivalTime,
        pickupTime,
        departureTime,
        travelTime: travelInfo.travelTime,
        distance: travelInfo.distance,
        waitTime,
      });

      currentTime = departureTime;
      currentLocationIndex = locationIndex + 1;
    }

    return {
      isValid: true,
      currentTime,
      segments,
    };
  };

  const calculateRouteScore = (
    validation: RouteValidationResult,
    pickupTimes: { [key: string]: string }
  ): number => {
    if (!validation.isValid) return Infinity;

    let score = 0;

    // Add up travel times
    score += validation.segments.reduce(
      (acc, segment) => acc + segment.travelTime,
      0
    );

    // Penalize wait times
    score += validation.segments.reduce(
      (acc, segment) => acc + segment.waitTime * WAIT_TIME_PENALTY_MULTIPLIER,
      0
    );

    // Penalize missed pickup times
    for (const segment of validation.segments) {
      if (pickupTimes[segment.location.id]) {
        const requestedTime = timeStringToSeconds(
          pickupTimes[segment.location.id]
        );
        if (segment.pickupTime > requestedTime) {
          score +=
            (segment.pickupTime - requestedTime) * LATENESS_PENALTY_MULTIPLIER;
        }
      }
    }

    return score;
  };
  const calculateOptimalRoute = async (
    startLocation: google.maps.LatLng,
    locations: Location[],
    endLoc: google.maps.LatLng | null,
    existingPickupTimes: { [key: string]: string }
  ): Promise<OptimalRoute> => {
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
              endLoc || startLocation,
            ],
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
              departureTime: new Date(),
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

    const bestRoute = await findBestRouteOrder(
      matrix,
      locations,
      existingPickupTimes,
      startLocation
    );

    const totalDistance = bestRoute.segments.reduce(
      (acc, segment) => acc + segment.distance,
      0
    );

    const totalDuration = bestRoute.segments.reduce(
      (acc, segment) =>
        acc +
        segment.travelTime +
        segment.waitTime +
        AVERAGE_STOP_TIME +
        BUFFER_TIME,
      0
    );

    // Preserve existing pickup times and only suggest new ones for unconstrained locations
    const suggestedPickupTimes = { ...existingPickupTimes };
    bestRoute.segments.forEach((segment) => {
      if (!existingPickupTimes[segment.location.id]) {
        suggestedPickupTimes[segment.location.id] = secondsToInputTimeString(
          segment.pickupTime
        );
      }
    });

    return {
      locations: bestRoute.segments.map((segment) => segment.location),
      suggestedPickupTimes,
      totalDuration,
      totalDistance,
      segments: bestRoute.segments,
    };
  };
  const calculateRoute = async () => {
    if (!userLocation || locations.length === 0) return;
    clearMap();

    try {
      // If there are any pickup times set, use the time-optimized route
      if (Object.keys(pickupTimes).length > 0) {
        const optimizedResult = await calculateOptimalRoute(
          userLocation,
          locations,
          endLocation || userLocation,
          pickupTimes
        );

        setOptimizedRoute(optimizedResult.locations);
        setPickupTimes(optimizedResult.suggestedPickupTimes);
        setRouteSegments(optimizedResult.segments);

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
                Total Route Time:{" "}
                {formatDuration(optimizedResult.totalDuration)}
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
                    <div>
                      Arrival: {secondsToTimeString(segment.arrivalTime)}
                    </div>
                    <div>Pickup: {secondsToTimeString(segment.pickupTime)}</div>
                    <div>Travel time: {formatDuration(segment.travelTime)}</div>
                    {segment.waitTime > 0 && (
                      <div>Wait time: {formatDuration(segment.waitTime)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        // If no pickup times, use the simple route
        await calculateSimpleRoute();
      }
    } catch (error) {
      console.error("Route optimization error:", error);
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
                                    {secondsToTimeString(segment.arrivalTime)}
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
        {locations.map((location) => (
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
