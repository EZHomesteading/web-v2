import { Location } from "@prisma/client";
import { RouteTimings } from "./types";
import {
  getCurrentTimeInSeconds,
  getLocationCloseTime,
  getLocationOpenTime,
  hasTimePassed,
  secondsToTimeString,
  timeStringToSeconds,
} from "./calcoptimal";

const AVERAGE_STOP_TIME = 5 * 60;
const BUFFER_TIME = 5 * 60;

interface RouteResult {
  route: Location[];
  totalTime: number;
  totalDistance: number;
  timings: RouteTimings;
}

// Calculate basic distance matrix
const calculateDistanceMatrix = async (
  baseLocation: google.maps.LatLng,
  locations: Location[]
): Promise<{ [key: string]: number }> => {
  const matrix: { [key: string]: number } = {};

  for (const location of locations) {
    const dest = new google.maps.LatLng(
      location.coordinates[1],
      location.coordinates[0]
    );
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      baseLocation,
      dest
    );
    matrix[location.id] = distance;
  }

  return matrix;
};

// Calculate priority score for arrival time optimization
const calculateArrivalPriorityScore = (
  location: Location,
  window: { openTime: number; closeTime: number; windowSize: number },
  matrix: { [key: string]: number }
): number => {
  const WINDOW_SIZE_WEIGHT = 0.5;
  const DISTANCE_WEIGHT = 0.3;
  const CLOSE_TIME_WEIGHT = 0.2;

  const windowScore = window.windowSize / (24 * 60);
  const distanceScore =
    1 - matrix[location.id] / Math.max(...Object.values(matrix));
  const closeTimeScore = window.closeTime / (24 * 60);

  return (
    windowScore * WINDOW_SIZE_WEIGHT +
    distanceScore * DISTANCE_WEIGHT +
    closeTimeScore * CLOSE_TIME_WEIGHT
  );
};

export const optimizeArrivalTimeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  usePickupOrder: boolean = false,
  targetArrivalTime: number,
  selectedDate: Date,
  startDelay: number
): Promise<RouteResult> => {
  const directionsService = new google.maps.DirectionsService();

  try {
    if (usePickupOrder) {
      return await calculateRouteWithArrivalTimings(
        directionsService,
        startLocation,
        locations,
        endLocation,
        targetArrivalTime,
        selectedDate,
        false,
        false,
        false,
        startDelay
      );
    }

    // Calculate distance matrix and sort locations
    const matrix = await calculateDistanceMatrix(endLocation, locations);
    const sortedLocations = [...locations].sort((a, b) => {
      const aWindow = getServiceWindow(a, selectedDate);
      const bWindow = getServiceWindow(b, selectedDate);

      const aScore = calculateArrivalPriorityScore(a, aWindow, matrix);
      const bScore = calculateArrivalPriorityScore(b, bWindow, matrix);

      return bScore - aScore;
    });

    // Check for tight windows
    const hasTightWindows = sortedLocations.some((location) => {
      const window = getServiceWindow(location, selectedDate);
      return window.windowSize < 360;
    });

    // For routes with more than 3 locations and tight windows, use chunk optimization
    if (locations.length > 3 && hasTightWindows) {
      return await optimizeInChunksForArrival(
        directionsService,
        startLocation,
        sortedLocations,
        endLocation,
        targetArrivalTime,
        selectedDate,
        undefined,
        startDelay
      );
    }

    if (hasTightWindows) {
      const firstLocation = sortedLocations[0];
      const firstLocationLatLng = new google.maps.LatLng(
        firstLocation.coordinates[1],
        firstLocation.coordinates[0]
      );

      const intermediateResult = await calculateRouteWithArrivalTimings(
        directionsService,
        firstLocationLatLng,
        sortedLocations.slice(1),
        endLocation,
        targetArrivalTime,
        selectedDate,
        false,
        true,
        false,
        startDelay
      );

      const finalResult = await calculateInitialLeg(
        directionsService,
        startLocation,
        intermediateResult,
        selectedDate
      );

      return finalResult;
    } else {
      return await calculateRouteWithArrivalTimings(
        directionsService,
        startLocation,
        locations,
        endLocation,
        targetArrivalTime,
        selectedDate,
        true,
        false,
        false,
        startDelay
      );
    }
  } catch (error) {
    throw error;
  }
};

// Optimize route in chunks for arrival time
const optimizeInChunksForArrival = async (
  directionsService: google.maps.DirectionsService,
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  targetArrivalTime: number,
  selectedDate: Date,
  chunkSize: number = 3,
  startDelay: number
): Promise<RouteResult> => {
  let currentEnd = endLocation;
  let currentTime = targetArrivalTime;
  let finalRoute: Location[] = [];
  let remainingLocations = [...locations].reverse();

  while (remainingLocations.length > 0) {
    const chunk = remainingLocations.slice(0, chunkSize);
    remainingLocations = remainingLocations.slice(chunkSize);

    const chunkStart =
      remainingLocations.length === 0
        ? startLocation
        : new google.maps.LatLng(
            remainingLocations[0].coordinates[1],
            remainingLocations[0].coordinates[0]
          );

    const chunkResult = await calculateRouteWithArrivalTimings(
      directionsService,
      chunkStart,
      chunk,
      currentEnd,
      currentTime,
      selectedDate,
      true,
      false,
      false,
      startDelay
    );

    finalRoute = [...chunkResult.route, ...finalRoute];
    currentTime -= chunkResult.totalTime;
    currentEnd = chunkStart;
  }

  return await calculateRouteWithArrivalTimings(
    directionsService,
    startLocation,
    finalRoute,
    endLocation,
    targetArrivalTime,
    selectedDate,
    false,
    false,
    false,
    startDelay
  );
};

const calculateRouteWithArrivalTimings = async (
  directionsService: google.maps.DirectionsService,
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  targetArrivalTime: number,
  selectedDate: Date,
  optimize: boolean = false,
  skipStartOptimization: boolean = false,
  adjustForInitialLeg: boolean = false,
  startDelay: number
): Promise<RouteResult> => {
  if (hasTimePassed(targetArrivalTime, selectedDate, startDelay)) {
    throw {
      type: "TIME_PASSED",
      message:
        "Target arrival time has already passed. Or you are not giving sellers enough notice.",
      details: {
        requestedTime: secondsToTimeString(targetArrivalTime),
        currentTime: secondsToTimeString(getCurrentTimeInSeconds()),
        sellerReq: startDelay,
      },
    };
  }
  const waypoints = locations.map((loc) => ({
    location: new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0]),
    stopover: true,
  }));

  if (skipStartOptimization && waypoints.length > 0) {
    waypoints.shift();
  }

  const result = await new Promise<google.maps.DirectionsResult>(
    (resolve, reject) => {
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          waypoints: waypoints,
          optimizeWaypoints: optimize && !skipStartOptimization,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(
              selectedDate.getTime() + targetArrivalTime * 1000
            ),
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
    optimize && !skipStartOptimization && result.routes[0].waypoint_order
      ? result.routes[0].waypoint_order.map((index) => locations[index])
      : locations;

  // Calculate total route duration including all components
  let totalDuration = 0;
  for (let i = 0; i < legs.length; i++) {
    const legDuration = legs[i].duration?.value ?? 0;
    totalDuration += legDuration;

    if (i < route.length) {
      totalDuration += AVERAGE_STOP_TIME;
      if (i < route.length - 1) {
        totalDuration += BUFFER_TIME;
      }
    }
  }

  const initialLegTime = legs[0].duration?.value ?? 0;
  const effectiveTargetTime = adjustForInitialLeg
    ? targetArrivalTime
    : targetArrivalTime - initialLegTime;

  const startTime = effectiveTargetTime - totalDuration;
  if (hasTimePassed(startTime, selectedDate, startDelay)) {
    throw {
      type: "TIME_PASSED",
      message:
        "Required start time has already passed. Or you are not giving sellers enough notice.",
      details: {
        requestedTime: secondsToTimeString(startTime),
        currentTime: secondsToTimeString(getCurrentTimeInSeconds()),
        sellerReq: startDelay,
      },
    };
  }
  let currentTime = startTime;

  const segmentTimes: { [key: string]: number } = {};
  const distanceSegments: { [key: string]: number } = {};
  const suggestedPickupTimes: { [key: string]: string } = {};
  let totalTime = 0;
  let totalDistance = 0;

  // Process locations in forward order
  for (let i = 0; i < route.length; i++) {
    const location = route[i];
    const leg = legs[i];
    const travelTime = leg.duration?.value ?? 0;
    const distance = leg.distance?.value ?? 0;

    currentTime += travelTime;
    const arrivalTime = currentTime;
    if (hasTimePassed(arrivalTime, selectedDate, startDelay)) {
      throw {
        type: "TIME_PASSED",
        message: `Arrival time at ${location.displayName} has already passed`,
        details: {
          location,
          expectedArrival: secondsToTimeString(arrivalTime),
          currentTime: secondsToTimeString(getCurrentTimeInSeconds()),
        },
      };
    }
    // Validate time constraints with selected date
    const openTime = getLocationOpenTime(location, selectedDate) * 60;
    const closeTime = getLocationCloseTime(location, selectedDate) * 60;

    if (arrivalTime + AVERAGE_STOP_TIME > closeTime) {
      throw {
        type: "LOCATION_CLOSED",
        message: `${location.displayName} would be closed by the time we need to depart`,
        location,
        details: {
          expectedDeparture: secondsToTimeString(
            arrivalTime + AVERAGE_STOP_TIME
          ),
          serviceEnd: secondsToTimeString(arrivalTime + AVERAGE_STOP_TIME),
          closeTime: secondsToTimeString(closeTime),
          openTime: secondsToTimeString(openTime),
        },
      };
    }

    if (arrivalTime < openTime) {
      throw {
        type: "LOCATION_CLOSED",
        message: `${location.displayName} will not be open when we need to arrive`,
        location,
        details: {
          expectedArrival: secondsToTimeString(arrivalTime),
          openTime: secondsToTimeString(openTime),
          closeTime: secondsToTimeString(closeTime),
        },
      };
    }

    segmentTimes[location.id] = travelTime;
    distanceSegments[location.id] = distance;
    suggestedPickupTimes[location.id] = secondsToTimeString(arrivalTime);

    currentTime += AVERAGE_STOP_TIME;
    if (i < route.length - 1) {
      currentTime += BUFFER_TIME;
    }

    totalTime += travelTime + AVERAGE_STOP_TIME;
    totalDistance += distance;
  }

  const finalReturnLeg = legs[legs.length - 1];
  const returnTime = finalReturnLeg.duration?.value ?? 0;
  const returnDistance = finalReturnLeg.distance?.value ?? 0;

  return {
    route,
    totalTime: totalTime + returnTime,
    totalDistance: totalDistance + returnDistance,
    timings: {
      segmentTimes,
      distanceSegments,
      suggestedPickupTimes,
      returnTime,
      totalTime: totalTime + returnTime,
      totalDistance: totalDistance + returnDistance,
    },
  };
};

const calculateInitialLeg = async (
  directionsService: google.maps.DirectionsService,
  startLocation: google.maps.LatLng,
  intermediateResult: RouteResult,
  selectedDate: Date
): Promise<RouteResult> => {
  const firstLocation = intermediateResult.route[0];
  const firstLocationLatLng = new google.maps.LatLng(
    firstLocation.coordinates[1],
    firstLocation.coordinates[0]
  );

  const initialLeg = await new Promise<google.maps.DirectionsResult>(
    (resolve, reject) => {
      directionsService.route(
        {
          origin: startLocation,
          destination: firstLocationLatLng,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(selectedDate.getTime()),
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

  const initialTime = initialLeg.routes[0].legs[0].duration?.value ?? 0;
  const initialDistance = initialLeg.routes[0].legs[0].distance?.value ?? 0;

  const adjustedPickupTimes: { [key: string]: string } = {};
  for (const [locationId, time] of Object.entries(
    intermediateResult.timings.suggestedPickupTimes
  )) {
    const originalSeconds = timeStringToSeconds(time);
    adjustedPickupTimes[locationId] = secondsToTimeString(
      originalSeconds + initialTime
    );
  }

  return {
    route: [firstLocation, ...intermediateResult.route],
    totalTime: initialTime + intermediateResult.totalTime,
    totalDistance: initialDistance + intermediateResult.totalDistance,
    timings: {
      segmentTimes: {
        ...intermediateResult.timings.segmentTimes,
        [firstLocation.id]: initialTime,
      },
      distanceSegments: {
        ...intermediateResult.timings.distanceSegments,
        [firstLocation.id]: initialDistance,
      },
      suggestedPickupTimes: adjustedPickupTimes,
      returnTime: intermediateResult.timings.returnTime,
      totalTime: initialTime + intermediateResult.timings.totalTime,
      totalDistance: initialDistance + intermediateResult.timings.totalDistance,
    },
  };
};

const getServiceWindow = (
  location: Location,
  selectedDate: Date
): {
  openTime: number;
  closeTime: number;
  windowSize: number;
} => {
  const dateString = selectedDate.toISOString().split("T")[0];
  const pickupSlot = location.hours?.pickup?.find(
    (slot) => new Date(slot.date).toISOString().split("T")[0] === dateString
  );

  const openTime = pickupSlot?.timeSlots[0]?.open || 0;
  const closeTime = pickupSlot?.timeSlots[0]?.close || 1440;

  return {
    openTime,
    closeTime,
    windowSize: closeTime - openTime,
  };
};

interface SimpleRouteResult {
  route: Location[];
  totalTime: number;
  totalDistance: number;
  timings: RouteTimings;
}

export const optimizeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng
): Promise<SimpleRouteResult> => {
  const directionsService = new google.maps.DirectionsService();

  // Convert locations to waypoints
  const waypoints = locations.map((loc) => ({
    location: new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0]),
    stopover: true,
  }));

  try {
    const result = await new Promise<google.maps.DirectionsResult>(
      (resolve, reject) => {
        directionsService.route(
          {
            origin: startLocation,
            destination: endLocation,
            waypoints: waypoints,
            optimizeWaypoints: true, // Let Google optimize the route
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

    const legs = result.routes[0].legs;
    const waypointOrder = result.routes[0].waypoint_order;
    const optimizedRoute = waypointOrder.map((index) => locations[index]);

    const segmentTimes: { [key: string]: number } = {};
    const distanceSegments: { [key: string]: number } = {};
    let totalTime = 0;
    let totalDistance = 0;

    // Process all legs except the last one
    for (let i = 0; i < optimizedRoute.length; i++) {
      const leg = legs[i];
      segmentTimes[optimizedRoute[i].id] = leg.duration?.value || 0;
      distanceSegments[optimizedRoute[i].id] = leg.distance?.value || 0;
      totalTime += leg.duration?.value || 0;
      totalDistance += leg.distance?.value || 0;
    }

    // Process the final leg (return to end location)
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
      suggestedPickupTimes: {},
    };

    return {
      route: optimizedRoute,
      totalTime,
      totalDistance,
      timings,
    };
  } catch (error) {
    console.error("Error calculating route:", error);
    throw new Error("No valid route found");
  }
};
