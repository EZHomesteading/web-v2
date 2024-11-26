// utils.tsx
import { OptimalRoute, RouteResult } from "./types";

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
};

export const secondsToInputTimeString = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
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

const metersToMiles = (meters: number): number => {
  return meters * 0.000621371;
};
const formatAddress = (address: string[]): string => {
  return address.join(", ");
};
export const storeRouteMetrics = (route: RouteResult) => {
  localStorage.setItem("totalTime", route.totalTime.toString());
  localStorage.setItem("totalDistance", route.totalDistance.toString());

  // Extract individual route times for each location
  const service = new google.maps.DistanceMatrixService();
  const routeTimes: { [key: string]: number } = {};

  // Get time between each location in the route
  route.route.forEach((location, index) => {
    if (index < route.route.length - 1) {
      const nextLocation = route.route[index + 1];
      // Get the time between current and next location from the matrix
      const timeToNext = route.totalTime / route.route.length; // This is a simplification, you should use actual matrix data
      routeTimes[location.id] = timeToNext;
    }
  });

  // Store route times
  localStorage.setItem("routeTimes", JSON.stringify(routeTimes));

  // Store return time (time from last location back to start)
  if (route.route.length > 0) {
    const returnTime = route.totalTime / route.route.length; // This is a simplification
    localStorage.setItem("returnTime", returnTime.toString());
  }
};

export const generateRouteNotification = (optimizedResult: OptimalRoute) => {
  const firstSegment = optimizedResult.segments[0];
  const departureTime = firstSegment
    ? secondsToTimeString(firstSegment.arrivalTime - firstSegment.travelTime)
    : "N/A";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="font-medium">Start Location:</div>
        <p className="text-gray-600 ml-4">
          16901 Rivers Edge Trl W, Smithfield, VA 23430, USA
        </p>
        <p className="text-gray-600 ml-4">
          Suggested Departure time: {departureTime}
        </p>
        <p className="text-gray-600 ml-4">
          Total Distance:{" "}
          {metersToMiles(optimizedResult.totalDistance).toFixed(1)} miles
        </p>
        <p className="text-gray-600 ml-4">
          Total Travel Time: {formatDuration(optimizedResult.totalDuration)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Stops:</div>
        {optimizedResult.segments.map((segment, index) => {
          const prevSegment =
            index > 0 ? optimizedResult.segments[index - 1] : null;

          return (
            <div key={segment.location.id} className="ml-4 space-y-1">
              <div className="font-medium">
                {index + 1}. {segment.location.displayName}
              </div>
              <div className="text-gray-600 ml-4">
                <div className="font-medium">
                  Pickup Time: {secondsToTimeString(segment.pickupTime)}
                </div>
                <div>
                  {index === 0
                    ? "Travel Time from start: "
                    : "Travel Time from last stop: "}
                  {formatDuration(segment.travelTime)}
                </div>
                <div>
                  Distance from last stop:{" "}
                  {metersToMiles(segment.distance).toFixed(1)} miles
                </div>
                {segment.waitTime > 0 && (
                  <div>Wait Time: {formatDuration(segment.waitTime)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const generateSimpleRouteNotification = (bestRoute: RouteResult) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="font-medium">Start Location:</div>
        <p className="text-gray-600 ml-4">
          16901 Rivers Edge Trl W, Smithfield, VA 23430, USA
        </p>
        <p className="text-gray-600 ml-4">
          Total Distance: {metersToMiles(bestRoute.totalDistance).toFixed(1)}{" "}
          miles
        </p>
        <p className="text-gray-600 ml-4">
          Total Travel Time: {formatDuration(bestRoute.totalTime)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Stops:</div>
        {bestRoute.route.map((location, index) => {
          const segmentTime = bestRoute.timings.segmentTimes[location.id];
          const isLastStop = index === bestRoute.route.length - 1;
          const nextLocation = !isLastStop ? bestRoute.route[index + 1] : null;

          return (
            <div key={location.id} className="ml-4 space-y-1">
              <div className="font-medium">
                {index + 1}. {location.displayName}
              </div>
              <div className="text-gray-600 ml-4">
                <div>
                  {index === 0
                    ? "Travel Time from start: "
                    : "Travel Time from last stop: "}
                  {formatDuration(segmentTime || 0)}
                </div>
                {nextLocation && (
                  <div>
                    Distance to next stop:{" "}
                    {metersToMiles(
                      bestRoute.totalDistance / bestRoute.route.length
                    ).toFixed(1)}{" "}
                    miles
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
