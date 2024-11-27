// calculateOptimalRoute.ts
import { Location } from "@prisma/client";

interface RouteSegment {
  location: Location;
  arrivalTime: number;
  pickupTime: number;
  departureTime: number;
  travelTime: number;
  distance: number;
  waitTime: number;
}

interface OptimalRoute {
  locations: Location[];
  suggestedPickupTimes: { [key: string]: string };
  totalDuration: number;
  totalDistance: number;
  segments: RouteSegment[];
}

// Constants
const AVERAGE_STOP_TIME = 5 * 60; // 5 minutes in seconds
const BUFFER_TIME = 5 * 60; // 5 minutes buffer between stops
const MIN_DEPARTURE_BUFFER = 15 * 60; // 15 minutes minimum before departure

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

export const calculateOptimalRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLoc: google.maps.LatLng | null,
  pickupTimes: { [key: string]: string }
): Promise<OptimalRoute> => {
  const service = new google.maps.DistanceMatrixService();
  const now = new Date();
  const currentTimeInSeconds = (now.getHours() * 60 + now.getMinutes()) * 60;
  let startTime = currentTimeInSeconds + MIN_DEPARTURE_BUFFER;
  const finalDestination = endLoc || startLocation;
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
                  new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
              ),
            ],
            destinations: [
              ...routeLocations.map(
                (loc) =>
                  new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
              ),
              finalDestination,
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
      const matrixIndex = locations.findIndex((loc) => loc.id === location.id);
      let travelTime = 0;
      let distance = 0;

      // Calculate travel time and distance to next location
      if (currentLocation === routeLocations.length - 1) {
        const finalDestIndex = matrix.rows[0].elements.length - 1;
        travelTime =
          matrix.rows[currentLocation].elements[finalDestIndex].duration.value;
        distance =
          matrix.rows[currentLocation].elements[finalDestIndex].distance.value;
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

        // Calculate wait time if arriving before pickup time
        if (pickupTime - BUFFER_TIME > arrivalTime) {
          waitTime = pickupTime - BUFFER_TIME - arrivalTime;
          if (waitTime > 3600) {
            // If wait time is more than 1 hour
            throw {
              type: "EXCESSIVE_WAIT",
              message: `Excessive wait time before ${location.displayName}`,
              location: location,
              details: {
                waitTime: formatDuration(waitTime),
                arrivalTime: secondsToTimeString(arrivalTime),
                requestedPickup: secondsToTimeString(pickupTime),
              },
            };
          }
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
        const openTime = location.hours?.delivery[0]?.timeSlots[0]?.open
          ? location.hours?.delivery[0]?.timeSlots[0]?.open * 60
          : 0;
        const closeTime = location.hours?.delivery[0]?.timeSlots[0]?.close
          ? location.hours?.delivery[0]?.timeSlots[0]?.close * 60
          : 0;

        throw {
          type: "LOCATION_CLOSED",
          message: `Location ${location.displayName} would be closed at pickup time`,
          location: location,
          details: {
            estimatedArrival: secondsToTimeString(arrivalTime),
            pickupTime: secondsToTimeString(pickupTime),
            openTime: secondsToTimeString(openTime),
            closeTime: secondsToTimeString(closeTime),
          },
        };
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
        existingPickupTimes[location.id] || secondsToTimeString(pickupTime);

      currentTime = departureTime + travelTime;
      totalTime += travelTime + AVERAGE_STOP_TIME + BUFFER_TIME + waitTime;
      totalDistance += distance;
      currentLocation++;
    }
    if (endLoc) {
      const lastLocation = routeLocations[routeLocations.length - 1];
      const lastLocIndex = locations.findIndex(
        (loc) => loc.id === lastLocation.id
      );
      const finalTravelTime =
        matrix.rows[lastLocIndex + 1].elements[locations.length].duration.value;
      const finalDistance =
        matrix.rows[lastLocIndex + 1].elements[locations.length].distance.value;

      totalTime += finalTravelTime;
      totalDistance += finalDistance;

      // Add final segment info if needed
      segments.push({
        location: lastLocation,
        arrivalTime: currentTime,
        pickupTime: currentTime,
        departureTime: currentTime + AVERAGE_STOP_TIME,
        travelTime: finalTravelTime,
        distance: finalDistance,
        waitTime: 0,
      });
    }
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
