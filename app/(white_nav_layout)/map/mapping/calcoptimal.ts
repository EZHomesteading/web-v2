import { Location } from "@prisma/client";
import { RouteResult, RouteTimings } from "./types";
// First, let's define our error types
interface LocationClosedError {
  type: "LOCATION_CLOSED";
  message: string;
  location: Location;
  details: {
    startTime?: number;
    pickupTime?: number;
  };
}

interface RouteError {
  type: "ROUTE_ERROR";
  message: string;
  details?: unknown;
}

type OptimizationError = LocationClosedError | RouteError;
const AVERAGE_STOP_TIME = 5 * 60;
const BUFFER_TIME = 5 * 60;
const MIN_DEPARTURE_BUFFER = 15 * 60;
const permute = <T>(arr: T[]): T[][] => {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const permutations = permute(rest);
    permutations.forEach((perm) => {
      result.push([arr[i], ...perm]);
    });
  }
  return result;
};
export const optimizeTimeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  pickupTimes: { [key: string]: string } = {},
  usePickupOrder: boolean = false
): Promise<RouteResult> => {
  const directionsService = new google.maps.DirectionsService();

  // Check if any locations are closed before attempting routes
  const now = new Date();
  const currentTimeInSeconds = (now.getHours() * 60 + now.getMinutes()) * 60;
  let startTime = currentTimeInSeconds + MIN_DEPARTURE_BUFFER;

  // Validate all locations are open
  for (const location of locations) {
    if (!isLocationOpen(location, startTime)) {
      throw {
        type: "LOCATION_CLOSED",
        message: `${location.displayName} would be closed`,
        location,
        details: { startTime },
      };
    }
  }

  // If using pickup times, sort locations by requested pickup time
  const routeLocations =
    Object.keys(pickupTimes).length > 0
      ? [...locations].sort((a, b) => {
          const timeA = pickupTimes[a.id]
            ? timeStringToSeconds(pickupTimes[a.id])
            : Infinity;
          const timeB = pickupTimes[b.id]
            ? timeStringToSeconds(pickupTimes[b.id])
            : Infinity;
          return timeA - timeB;
        })
      : locations;

  // If usePickupOrder is true, don't optimize, just use the sorted order
  if (usePickupOrder) {
    return await calculateRouteWithTimings(
      directionsService,
      startLocation,
      routeLocations,
      endLocation,
      startTime,
      pickupTimes
    );
  }

  try {
    // Let Google optimize the route if we're not using pickup times
    if (Object.keys(pickupTimes).length === 0) {
      return await calculateRouteWithTimings(
        directionsService,
        startLocation,
        locations,
        endLocation,
        startTime,
        pickupTimes,
        true // Use Google's optimization
      );
    }

    // If we have pickup times, we need to try different permutations
    const permutations = permute(routeLocations);
    let bestRoute: RouteResult | null = null;

    for (const route of permutations) {
      try {
        const result = await calculateRouteWithTimings(
          directionsService,
          startLocation,
          route,
          endLocation,
          startTime,
          pickupTimes
        );

        if (!bestRoute || result.totalTime < bestRoute.totalTime) {
          bestRoute = result;
        }
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "type" in error &&
          error.type === "LOCATION_CLOSED"
        ) {
          throw error;
        }
        continue;
      }
    }

    if (!bestRoute) {
      throw new Error("No valid routes found");
    }

    return bestRoute;
  } catch (error) {
    throw error;
  }
};

const calculateRouteWithTimings = async (
  directionsService: google.maps.DirectionsService,
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  startTime: number,
  pickupTimes: { [key: string]: string },
  optimize: boolean = false
): Promise<RouteResult> => {
  // Convert locations to waypoints
  const waypoints = locations.map((loc) => ({
    location: new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0]),
    stopover: true,
  }));

  const result = await new Promise<google.maps.DirectionsResult>(
    (resolve, reject) => {
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          waypoints: waypoints,
          optimizeWaypoints: optimize,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(Date.now() + startTime * 1000),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
        },
        (response, status) => {
          if (status === "OK" && response) resolve(response);
          else reject(status);
        }
      );
    }
  );

  const legs = result.routes[0].legs;
  const optimizedOrder = optimize ? result.routes[0].waypoint_order : undefined;
  const route = optimizedOrder
    ? optimizedOrder.map((index) => locations[index])
    : locations;

  let currentTime = startTime;
  const segmentTimes: { [key: string]: number } = {};
  const distanceSegments: { [key: string]: number } = {};
  let totalTime = 0;
  let totalDistance = 0;

  // Process each leg except the last one (return to end)
  for (let i = 0; i < route.length; i++) {
    const location = route[i];
    const leg = legs[i];
    const travelTime = leg.duration?.value || 0;
    const distance = leg.distance?.value || 0;

    let arrivalTime = currentTime + travelTime;
    let pickupTime = arrivalTime + BUFFER_TIME;
    let waitTime = 0;

    if (pickupTimes[location.id]) {
      const requestedTime = timeStringToSeconds(pickupTimes[location.id]);
      if (requestedTime > arrivalTime + BUFFER_TIME) {
        waitTime = requestedTime - (arrivalTime + BUFFER_TIME);
        pickupTime = requestedTime;
      }
    }

    if (!isLocationOpen(location, pickupTime)) {
      throw {
        type: "LOCATION_CLOSED",
        message: `${location.displayName} would be closed`,
        location,
        details: { pickupTime },
      };
    }

    segmentTimes[location.id] = travelTime;
    distanceSegments[location.id] = distance;

    totalTime += travelTime + waitTime + AVERAGE_STOP_TIME;
    totalDistance += distance;
    currentTime = pickupTime + AVERAGE_STOP_TIME;
  }

  // Add final leg to end location
  const returnLeg = legs[legs.length - 1];
  const returnTime = returnLeg.duration?.value || 0;
  const returnDistance = returnLeg.distance?.value || 0;
  totalTime += returnTime;
  totalDistance += returnDistance;

  const timings: RouteTimings = {
    segmentTimes,
    distanceSegments,
    returnTime,
    totalTime,
    totalDistance,
  };

  return {
    route,
    totalTime,
    totalDistance,
    timings,
  };
};

// Utility functions remain the same
export const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return (hours * 60 + minutes) * 60;
};

export const secondsToTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

export const metersToMiles = (meters: number): number => {
  return meters * 0.000621371;
};

// Location validation functions remain the same
export const getLocationOpenTime = (location: Location): number => {
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

export const isLocationOpen = (
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
