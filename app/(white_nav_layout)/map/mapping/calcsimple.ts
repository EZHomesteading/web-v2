// calcsimple.ts
import { Location } from "@prisma/client";
import { RouteResult, RouteTimings } from "./types";

export const permute = <T>(arr: T[]): T[][] => {
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

export const optimizeRoute = async (
  startLocation: google.maps.LatLng,
  locations: Location[],
  endLocation: google.maps.LatLng
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

  const permutations = permute(locations);

  for (const route of permutations) {
    try {
      // First matrix for main segments
      const origins = [
        startLocation,
        ...route
          .slice(0, -1)
          .map(
            (loc) =>
              new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
          ),
      ];

      const destinations = [
        ...route.map(
          (loc) =>
            new google.maps.LatLng(loc.coordinates[1], loc.coordinates[0])
        ),
      ];

      const mainMatrix = await new Promise<google.maps.DistanceMatrixResponse>(
        (resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: origins,
              destinations: destinations,
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

      // Second matrix for final leg
      const lastLocationMatrix =
        await new Promise<google.maps.DistanceMatrixResponse>(
          (resolve, reject) => {
            service.getDistanceMatrix(
              {
                origins: [
                  new google.maps.LatLng(
                    route[route.length - 1].coordinates[1],
                    route[route.length - 1].coordinates[0]
                  ),
                ],
                destinations: [endLocation],
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

      // Add debug log here
      console.log("Last location:", route[route.length - 1].displayName);
      console.log("End location:", endLocation.toString());
      console.log("Final leg matrix response:", lastLocationMatrix);

      // Rest of the function remains the same...

      const segmentTimes: { [key: string]: number } = {};
      const distanceSegments: { [key: string]: number } = {};
      let totalTime = 0;
      let totalDistance = 0;

      for (let i = 0; i < route.length; i++) {
        const element = mainMatrix.rows[i].elements[i];
        if (!element || element.status !== "OK") {
          throw new Error(`Invalid route segment at index ${i}`);
        }

        segmentTimes[route[i].id] = element.duration.value;
        distanceSegments[route[i].id] = element.distance.value;
        totalTime += element.duration.value;
        totalDistance += element.distance.value;
      }

      const returnElement = lastLocationMatrix.rows[0].elements[0];
      const returnTime = returnElement.duration.value;
      const returnDistance = returnElement.distance.value;

      totalTime += returnTime;
      totalDistance += returnDistance;

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

  if (Object.keys(bestTimings.segmentTimes).length === 0) {
    throw new Error("No valid route found");
  }

  return {
    route: bestRoute,
    totalTime: bestTimings.totalTime,
    totalDistance: bestTimings.totalDistance,
    timings: bestTimings,
  };
};
