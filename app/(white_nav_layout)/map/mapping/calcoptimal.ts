import { Location } from "@prisma/client";
import { RouteResult } from "./types";
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

const AVERAGE_STOP_TIME = 5 * 60;
const BUFFER_TIME = 5 * 60;
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
  usePickupOrder: boolean = false,
  departureTime: number
): Promise<RouteResult> => {
  const directionsService = new google.maps.DirectionsService();
  const now = new Date();
  const currentTimeInSeconds = (now.getHours() * 60 + now.getMinutes()) * 60;
  //const departureTime = currentTimeInSeconds + MIN_DEPARTURE_BUFFER;

  try {
    if (usePickupOrder) {
      // If using manual order, just calculate with end location
      return await calculateRouteWithTimings(
        directionsService,
        startLocation,
        locations,
        endLocation,
        departureTime,
        false
      );
    }

    // Sort locations by time constraints
    const sortedLocations = [...locations].sort((a, b) => {
      const aWindow = getServiceWindow(a);
      const bWindow = getServiceWindow(b);

      // If time windows are significantly different, sort by window size
      if (Math.abs(aWindow.windowSize - bWindow.windowSize) > 60) {
        return aWindow.windowSize - bWindow.windowSize; // Smaller window first
      }

      // If windows are similar, sort by closing time
      return aWindow.closeTime - bWindow.closeTime;
    });

    // Check if we have any tight time windows
    const hasTightWindows = sortedLocations.some((location) => {
      const window = getServiceWindow(location);
      return window.windowSize < 360; // Consider windows less than 6 hours as "tight"
    });

    if (hasTightWindows) {
      // Use two-phase routing for tight windows
      const lastLocation = sortedLocations[sortedLocations.length - 1];
      const lastLocationLatLng = new google.maps.LatLng(
        lastLocation.coordinates[1],
        lastLocation.coordinates[0]
      );

      // First phase: Route through time-constrained locations
      const intermediateResult = await calculateRouteWithTimings(
        directionsService,
        startLocation,
        sortedLocations,
        lastLocationLatLng,
        departureTime,
        false, // Don't optimize order since we sorted by time windows
        true // Skip end location optimization
      );

      // Second phase: Add final leg to custom end location
      const finalResult = await calculateFinalLeg(
        directionsService,
        intermediateResult,
        endLocation
      );

      return finalResult;
    } else {
      // If no tight windows, let Google optimize the entire route including end location
      return await calculateRouteWithTimings(
        directionsService,
        startLocation,
        locations,
        endLocation,
        departureTime,
        true // Use Google's optimization
      );
    }
  } catch (error) {
    throw error;
  }
};

const getServiceWindow = (
  location: Location
): {
  openTime: number;
  closeTime: number;
  windowSize: number;
} => {
  const openTime = location.hours?.pickup[0]?.timeSlots[0]?.open || 0;
  const closeTime = location.hours?.pickup[0]?.timeSlots[0]?.close || 1440;

  return {
    openTime,
    closeTime,
    windowSize: closeTime - openTime,
  };
};

const calculateFinalLeg = async (
  directionsService: google.maps.DirectionsService,
  intermediateResult: RouteResult,
  endLocation: google.maps.LatLng
): Promise<RouteResult> => {
  const lastLocation =
    intermediateResult.route[intermediateResult.route.length - 1];
  const lastLocationLatLng = new google.maps.LatLng(
    lastLocation.coordinates[1],
    lastLocation.coordinates[0]
  );

  const finalLeg = await new Promise<google.maps.DirectionsResult>(
    (resolve, reject) => {
      directionsService.route(
        {
          origin: lastLocationLatLng,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
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

  return {
    route: intermediateResult.route,
    totalTime:
      intermediateResult.totalTime +
      (finalLeg.routes[0].legs[0].duration?.value || 0),
    totalDistance:
      intermediateResult.totalDistance +
      (finalLeg.routes[0].legs[0].distance?.value || 0),
    timings: {
      ...intermediateResult.timings,
      returnTime: finalLeg.routes[0].legs[0].duration?.value || 0,
      totalTime:
        intermediateResult.timings.totalTime +
        (finalLeg.routes[0].legs[0].duration?.value || 0),
      totalDistance:
        intermediateResult.timings.totalDistance +
        (finalLeg.routes[0].legs[0].distance?.value || 0),
    },
  };
};

const calculateRouteWithTimings = async (
  directionsService: google.maps.DirectionsService,
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  departureTime: number,
  optimize: boolean = false,
  skipEndOptimization: boolean = false
): Promise<RouteResult> => {
  const waypoints = locations.map((loc) => ({
    location: new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0]),
    stopover: true,
  }));

  // If we're skipping end optimization, remove the last waypoint
  if (skipEndOptimization && waypoints.length > 0) {
    waypoints.pop();
  }

  const result = await new Promise<google.maps.DirectionsResult>(
    (resolve, reject) => {
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          waypoints: waypoints,
          optimizeWaypoints: optimize && !skipEndOptimization,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(Date.now() + departureTime * 1000),
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
  const route =
    optimize && !skipEndOptimization && result.routes[0].waypoint_order
      ? result.routes[0].waypoint_order.map((index) => locations[index])
      : locations;

  let currentTime = departureTime;
  const segmentTimes: { [key: string]: number } = {};
  const distanceSegments: { [key: string]: number } = {};
  const suggestedPickupTimes: { [key: string]: string } = {};
  let totalTime = 0;
  let totalDistance = 0;

  // Process each location
  for (let i = 0; i < route.length; i++) {
    const location = route[i];
    const leg = legs[i];
    const travelTime = leg.duration?.value || 0;
    const distance = leg.distance?.value || 0;

    const expectedArrival = currentTime + travelTime;
    const openTime = getLocationOpenTime(location) * 60;
    const closeTime = location.hours?.pickup[0]?.timeSlots[0]?.close
      ? location.hours?.pickup[0]?.timeSlots[0]?.close * 60
      : Infinity;

    const earliestServiceStart = Math.max(
      expectedArrival + BUFFER_TIME,
      openTime
    );
    const serviceEndTime = earliestServiceStart + AVERAGE_STOP_TIME;

    // Check if we're arriving before opening time
    if (expectedArrival + BUFFER_TIME < openTime) {
      throw {
        type: "LOCATION_CLOSED",
        message: `${location.displayName} will not be open yet when we arrive`,
        location,
        details: {
          expectedArrival: secondsToTimeString(expectedArrival),
          serviceStart: secondsToTimeString(earliestServiceStart),
          serviceEnd: secondsToTimeString(serviceEndTime),
          openTime: secondsToTimeString(openTime),
          closeTime: secondsToTimeString(closeTime),
          willOpen: true, // Add this flag to indicate it's a "not open yet" scenario
        },
      };
    }

    // Existing closing time check
    if (serviceEndTime > closeTime) {
      throw {
        type: "LOCATION_CLOSED",
        message: `${location.displayName} would be closed at arrival or during service`,
        location,
        details: {
          expectedArrival: secondsToTimeString(expectedArrival),
          serviceStart: secondsToTimeString(earliestServiceStart),
          serviceEnd: secondsToTimeString(serviceEndTime),
          closeTime: secondsToTimeString(closeTime),
          openTime: secondsToTimeString(openTime),
          willOpen: false, // Add this flag to indicate it's a "closed" scenario
        },
      };
    }

    const waitTime = Math.max(0, openTime - expectedArrival);

    segmentTimes[location.id] = travelTime;
    distanceSegments[location.id] = distance;
    suggestedPickupTimes[location.id] =
      secondsToTimeString(earliestServiceStart);

    totalTime += travelTime + waitTime + AVERAGE_STOP_TIME;
    totalDistance += distance;

    currentTime = serviceEndTime;
  }

  // Add final leg if not skipping end optimization
  const returnLeg = legs[legs.length - 1];
  const returnTime = returnLeg.duration?.value || 0;
  const returnDistance = returnLeg.distance?.value || 0;
  totalTime += returnTime;
  totalDistance += returnDistance;

  return {
    route,
    totalTime,
    totalDistance,
    timings: {
      segmentTimes,
      distanceSegments,
      suggestedPickupTimes,
      returnTime,
      totalTime,
      totalDistance,
    },
  };
};
// Utility functions remain the same
export const secondsToTimeString = (seconds: number): string => {
  // Ensure seconds is a valid number
  if (typeof seconds !== "number" || isNaN(seconds)) {
    console.error("Invalid seconds value:", seconds);
    seconds = 0; // Default to midnight rather than showing NaN
  }

  // Convert negative times to positive (add 24 hours until positive)
  while (seconds < 0) {
    seconds += 24 * 60 * 60;
  }

  // Handle times over 24 hours (normalize to 24-hour period)
  seconds = seconds % (24 * 60 * 60);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Convert to 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12;

  // Format the string (ensuring hours of 0 show as 12)
  return `${displayHours === 0 ? 12 : displayHours}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
};

export const timeStringToSeconds = (timeString: string): number => {
  if (!timeString || typeof timeString !== "string") {
    console.error("Invalid time string:", timeString);
    return 0; // Default to midnight rather than returning NaN
  }

  try {
    // Parse time string format "HH:MM AM/PM"
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid time components:", timeString);
      return 0;
    }

    let totalHours = hours;

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) totalHours += 12;
    if (period === "AM" && hours === 12) totalHours = 0;

    return (totalHours * 60 + minutes) * 60;
  } catch (error) {
    console.error("Error parsing time string:", timeString, error);
    return 0; // Default to midnight on error
  }
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
  const todayDeliverySlot = location.hours?.pickup?.find((slot) => {
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
  const todayDeliverySlot = location.hours?.pickup?.find((slot) => {
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
