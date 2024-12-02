import {
  formatDuration,
  metersToMiles,
  secondsToTimeString,
} from "./calcoptimal";
import React from "react";
import { Location } from "@prisma/client";
import { RouteSegment } from "./types";

interface RouteSegmentDisplayProps {
  optimizedRoute: Location[];
  routeTimings: {
    segmentTimes: Record<string, number>;
    distanceSegments: Record<string, number>;
    returnTime: number;
    totalTime: number;
    totalDistance: number;
  };
  routeSegments: RouteSegment[];
}

const RouteSegmentDisplay = ({
  optimizedRoute,
  routeTimings,
  routeSegments,
}: RouteSegmentDisplayProps) => {
  return (
    <div className="space-y-3">
      {optimizedRoute.map((location, index) => {
        const segment = routeSegments[index];

        return (
          <div key={location.id} className="border-b last:border-b-0 pb-3">
            <div className="font-medium">
              {index + 1}. {location.displayName}
            </div>
            <div className="pl-4 space-y-1 mt-1">
              {segment && (
                <>
                  <div className="text-gray-600">
                    Estimated Arrival:{" "}
                    {secondsToTimeString(segment.arrivalTime)}
                  </div>
                  <div className="text-gray-600">
                    Pickup Time: {secondsToTimeString(segment.pickupTime)}
                  </div>
                </>
              )}
              {index === 0 ? (
                <div className="text-gray-600">
                  Travel Time from start:{" "}
                  {formatDuration(routeTimings.segmentTimes[location.id] || 0)}
                </div>
              ) : (
                <div className="text-gray-600">
                  Travel Time from last stop:{" "}
                  {formatDuration(routeTimings.segmentTimes[location.id] || 0)}
                </div>
              )}
              <div className="text-gray-600">
                Distance from last stop:{" "}
                {metersToMiles(
                  routeTimings.distanceSegments[location.id] || 0
                ).toFixed(1)}{" "}
                miles
              </div>
              {segment?.waitTime > 0 && (
                <div className="text-gray-600">
                  Wait Time: {formatDuration(segment.waitTime)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RouteSegmentDisplay;
