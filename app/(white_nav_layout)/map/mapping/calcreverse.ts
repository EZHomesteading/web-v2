// calcsimple.ts
import { Location } from "@prisma/client";
import { RouteTimings } from "./types";
import {
  getLocationOpenTime,
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

export const optimizeArrivalTimeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  usePickupOrder: boolean = false,
  targetArrivalTime: number
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
        false
      );
    }

    // Sort locations by time constraints, prioritizing later closing times
    const sortedLocations = [...locations].sort((a, b) => {
      const aWindow = getServiceWindow(a);
      const bWindow = getServiceWindow(b);

      if (Math.abs(aWindow.windowSize - bWindow.windowSize) > 60) {
        return bWindow.windowSize - aWindow.windowSize;
      }
      return bWindow.closeTime - aWindow.closeTime;
    });

    const hasTightWindows = sortedLocations.some((location) => {
      const window = getServiceWindow(location);
      return window.windowSize < 360;
    });

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
        false,
        true
      );

      const finalResult = await calculateInitialLeg(
        directionsService,
        startLocation,
        intermediateResult
      );

      return finalResult;
    } else {
      return await calculateRouteWithArrivalTimings(
        directionsService,
        startLocation,
        locations,
        endLocation,
        targetArrivalTime,
        true
      );
    }
  } catch (error) {
    throw error;
  }
};

const calculateRouteWithArrivalTimings = async (
  directionsService: google.maps.DirectionsService,
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng,
  targetArrivalTime: number,
  optimize: boolean = false,
  skipStartOptimization: boolean = false,
  adjustForInitialLeg: boolean = false
): Promise<RouteResult> => {
  const waypoints = locations.map((loc) => ({
    location: new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0]),
    stopover: true,
  }));

  if (skipStartOptimization && waypoints.length > 0) {
    waypoints.shift();
  }

  // Get complete route
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
  const route =
    optimize && !skipStartOptimization && result.routes[0].waypoint_order
      ? result.routes[0].waypoint_order.map((index) => locations[index])
      : locations;

  // Calculate total route duration including all components
  let totalDuration = 0;
  for (let i = 0; i < legs.length; i++) {
    const legDuration = legs[i].duration?.value ?? 0;
    totalDuration += legDuration;

    // Only add stop time and buffer for actual stops (not the final return leg)
    if (i < route.length) {
      totalDuration += AVERAGE_STOP_TIME;
      // Add buffer time between stops, but not after the last stop
      if (i < route.length - 1) {
        totalDuration += BUFFER_TIME;
      }
    }
  }

  // If this is part of a split calculation, don't subtract the initial leg time
  const initialLegTime = legs[0].duration?.value ?? 0;
  const effectiveTargetTime = adjustForInitialLeg
    ? targetArrivalTime
    : targetArrivalTime - initialLegTime;

  // Calculate start time to hit target
  const startTime = effectiveTargetTime - totalDuration;
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

    // Validate time constraints
    const openTime = getLocationOpenTime(location) * 60;
    const closeTime = location.hours?.pickup[0]?.timeSlots[0]?.close
      ? location.hours?.pickup[0]?.timeSlots[0]?.close * 60
      : Infinity;

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
  intermediateResult: RouteResult
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

  const initialTime = initialLeg.routes[0].legs[0].duration?.value ?? 0;
  const initialDistance = initialLeg.routes[0].legs[0].distance?.value ?? 0;

  // Adjust all timing information in suggestedPickupTimes
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
