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
    <div className=" trunc">
      {optimizedRoute.map((location, index) => {
        const segment = routeSegments[index];

        return (
          <div key={location.id} className="border-b last:border-b-0">
            <div className="font-medium">
              {index + 1}. {location.displayName}
            </div>
            <div className="pl-4 ">
              {index === 0 ? (
                <div className="text-gray-600">
                  Dist{" "}
                  {metersToMiles(
                    routeTimings.distanceSegments[location.id] || 0
                  ).toFixed(1)}{" "}
                  miles -{" "}
                  {formatDuration(routeTimings.segmentTimes[location.id] || 0)}
                </div>
              ) : (
                <div className="text-gray-600">
                  Dist{" "}
                  {metersToMiles(
                    routeTimings.distanceSegments[location.id] || 0
                  ).toFixed(1)}{" "}
                  miles -{" "}
                  {formatDuration(routeTimings.segmentTimes[location.id] || 0)}
                </div>
              )}

              {segment && (
                <>
                  <div className="text-gray-600">
                    Arr: {secondsToTimeString(segment.arrivalTime)} - Dep:{" "}
                    {secondsToTimeString(segment.pickupTime + 10 * 60)}
                  </div>
                </>
              )}

              {segment?.waitTime > 0 && (
                <div className="text-red-600">
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
