// calcsimple.ts
import { Location } from "@prisma/client";
import { RouteResult, RouteTimings } from "./types";

export const optimizeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng
): Promise<RouteResult> => {
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
