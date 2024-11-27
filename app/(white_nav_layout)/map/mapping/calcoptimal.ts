import { Location } from "@prisma/client";
import { RouteResult, RouteTimings } from "./types";

const AVERAGE_STOP_TIME = 5 * 60;
const BUFFER_TIME = 5 * 60;
const MIN_DEPARTURE_BUFFER = 15 * 60;

export const optimizeTimeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  pickupTimes: { [key: string]: string } = {}
): Promise<RouteResult> => {
  const service = new google.maps.DistanceMatrixService();
  let shortestTime = Infinity;
  let bestRoute: Location[] = [];
  let bestTimings: RouteTimings = {
    segmentTimes: {},
    distanceSegments: {},
    returnTime: 0,
    totalTime: 0,
    totalDistance: 0,
  };

  // Sort by pickup times if provided
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

  const permutations = permute(routeLocations);
  const now = new Date();
  const currentTimeInSeconds = (now.getHours() * 60 + now.getMinutes()) * 60;
  let startTime = currentTimeInSeconds + MIN_DEPARTURE_BUFFER;

  for (const route of permutations) {
    try {
      const matrix = await getDistanceMatrix(
        startLocation,
        route,
        endLocation,
        service
      );

      const {
        segmentTimes,
        distanceSegments,
        totalTime,
        totalDistance,
        returnTime,
      } = await calculateRouteMetrics(matrix, route, startTime, pickupTimes);

      if (totalTime < shortestTime) {
        shortestTime = totalTime;
        bestRoute = route;
        bestTimings = {
          segmentTimes,
          distanceSegments,
          returnTime,
          totalTime,
          totalDistance,
        };
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      continue;
    }
  }

  return {
    route: bestRoute,
    totalTime: bestTimings.totalTime,
    totalDistance: bestTimings.totalDistance,
    timings: bestTimings,
  };
};

const getDistanceMatrix = async (
  startLocation: google.maps.LatLng,
  route: Location[],
  endLocation: google.maps.LatLng,
  service: google.maps.DistanceMatrixService
): Promise<google.maps.DistanceMatrixResponse> => {
  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [
          startLocation,
          ...route.map(
            (loc) =>
              new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
          ),
        ],
        destinations: [
          ...route.map(
            (loc) =>
              new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
          ),
          endLocation,
        ],
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
  });
};

const calculateRouteMetrics = async (
  matrix: google.maps.DistanceMatrixResponse,
  route: Location[],
  startTime: number,
  pickupTimes: { [key: string]: string }
) => {
  let currentTime = startTime;
  const segmentTimes: { [key: string]: number } = {};
  const distanceSegments: { [key: string]: number } = {};
  let totalTime = 0;
  let totalDistance = 0;

  // Handle first location
  if (route.length > 0) {
    const firstLocation = route[0];
    const travelTime = matrix.rows[0].elements[0].duration.value;
    const distance = matrix.rows[0].elements[0].distance.value;

    segmentTimes[firstLocation.id] = travelTime;
    distanceSegments[firstLocation.id] = distance;

    let arrivalTime = currentTime + travelTime;
    let pickupTime = arrivalTime + BUFFER_TIME;

    if (pickupTimes[firstLocation.id]) {
      const requestedTime = timeStringToSeconds(pickupTimes[firstLocation.id]);
      pickupTime = Math.max(requestedTime, arrivalTime + BUFFER_TIME);
    }

    currentTime = pickupTime + AVERAGE_STOP_TIME;
    totalTime = pickupTime + AVERAGE_STOP_TIME - startTime;
    totalDistance = distance;
  }

  // Handle subsequent locations
  for (let i = 1; i < route.length; i++) {
    const location = route[i];
    const travelTime = matrix.rows[i].elements[i].duration.value;
    const distance = matrix.rows[i].elements[i].distance.value;

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

  const returnTime =
    matrix.rows[route.length].elements[route.length].duration.value;
  const returnDistance =
    matrix.rows[route.length].elements[route.length].distance.value;

  return {
    segmentTimes,
    distanceSegments,
    totalTime: totalTime + returnTime,
    totalDistance: totalDistance + returnDistance,
    returnTime,
  };
};
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

// Time utility functions
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
