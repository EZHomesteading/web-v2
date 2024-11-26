import { Location } from "@prisma/client";
import { RouteResult, RouteTimings } from "./types";

export const calculateRouteMetrics = (
  matrix: google.maps.DistanceMatrixResponse,
  route: Location[],
  startIdx: number,
  endIdx: number
): RouteTimings => {
  let totalTime = 0;
  let totalDistance = 0;
  const segmentTimes: { [key: string]: number } = {};

  // Calculate times between consecutive locations
  for (let i = 0; i < route.length - 1; i++) {
    const currentLoc = route[i];
    const nextLoc = route[i + 1];
    const currentLocIdx = route.findIndex((loc) => loc.id === currentLoc.id);
    const nextLocIdx = route.findIndex((loc) => loc.id === nextLoc.id);

    const segmentTime =
      matrix.rows[currentLocIdx + 1].elements[nextLocIdx].duration.value;
    const segmentDistance =
      matrix.rows[currentLocIdx + 1].elements[nextLocIdx].distance.value;

    segmentTimes[currentLoc.id] = segmentTime;
    totalTime += segmentTime;
    totalDistance += segmentDistance;
  }

  // Add time and distance to final destination
  const lastLocIdx = route.findIndex(
    (loc) => loc.id === route[route.length - 1].id
  );
  const returnTime =
    matrix.rows[lastLocIdx + 1].elements[endIdx].duration.value;
  const returnDistance =
    matrix.rows[lastLocIdx + 1].elements[endIdx].distance.value;

  totalTime += returnTime;
  totalDistance += returnDistance;

  return {
    totalTime,
    totalDistance,
    segmentTimes,
    returnTime,
  };
};
const getPermutations = <T>(array: T[]): T[][] => {
  if (array.length <= 1) return [array];

  const result: T[][] = [];
  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const remaining = [...array.slice(0, i), ...array.slice(i + 1)];
    const perms = getPermutations(remaining);

    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }

  return result;
};
export const findPermutationRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng | null
): Promise<RouteResult> => {
  const service = new google.maps.DistanceMatrixService();
  const finalDestination = endLocation || startLocation;

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
            finalDestination,
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

  let bestRoute: Location[] = [];
  let bestScore = Infinity;
  let bestTimings = {
    segmentTimes: {},
    returnTime: 0,
    totalTime: 0,
    totalDistance: 0,
  };

  const permutations = getPermutations(locations);

  for (const perm of permutations) {
    // Calculate comprehensive metrics including final destination
    const metrics = calculateRouteMetrics(matrix, perm, 0, locations.length);

    // Calculate total score considering both route time and return to final destination
    const totalScore = metrics.totalTime;

    if (totalScore < bestScore) {
      bestRoute = perm;
      bestScore = totalScore;
      bestTimings = metrics;
    }
  }

  return {
    route: bestRoute,
    totalTime: bestTimings.totalTime,
    totalDistance: bestTimings.totalDistance,
    timings: bestTimings,
  };
};

export const findDynamicNearestNeighborRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng | null
): Promise<RouteResult> => {
  const service = new google.maps.DistanceMatrixService();
  const finalDestination = endLocation || startLocation;

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
            finalDestination,
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
      const timeFromLocationToFinal =
        matrix.rows[locIdx + 1].elements[locations.length].duration.value;

      // Enhanced scoring system that considers:
      // 1. Time to reach this location
      // 2. Impact on reaching remaining locations
      // 3. Impact on reaching final destination
      let score = timeToLocation;

      if (unvisited.length > 1) {
        // Calculate average time to remaining locations
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

        // Weighted scoring that prioritizes both efficient routing and final destination
        score =
          timeToLocation +
          avgTimeToRemaining * 0.5 +
          timeFromLocationToFinal *
            (1.0 - (unvisited.length - 1) / locations.length);
      } else {
        // For the last location, heavily weight the time to final destination
        score = timeToLocation + timeFromLocationToFinal;
      }

      if (score < bestScore) {
        bestScore = score;
        bestNextIdx = i;
      }
    }

    if (bestNextIdx !== -1) {
      const chosenLocation = unvisited[bestNextIdx];
      route.push(chosenLocation);
      currentIdx =
        locations.findIndex((loc) => loc.id === chosenLocation.id) + 1;
      unvisited.splice(bestNextIdx, 1);
    }
  }

  // Calculate final metrics including return to final destination
  const metrics = calculateRouteMetrics(matrix, route, 0, locations.length);

  return {
    route,
    totalTime: metrics.totalTime,
    totalDistance: metrics.totalDistance,
    timings: metrics,
  };
};
