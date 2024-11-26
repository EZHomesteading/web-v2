// types.ts
import { Location, UserRole } from "@prisma/client";

export interface RouteOptimizerProps {
  locations: Location[];
  googleMapsApiKey: string;
  initialLocation: {
    lat: number;
    lng: number;
  };
  userRole: UserRole;
}
export interface initialLocation {
  lat: number;
  lng: number;
}
export interface ModalState {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  variant?: "default" | "destructive";
}

export interface TimeValidation {
  isValid: boolean;
  message: string;
}

export interface OptimalRoute {
  locations: Location[];
  suggestedPickupTimes: { [key: string]: string };
  totalDuration: number;
  totalDistance: number;
  segments: RouteSegment[];
}

export interface RouteSegment {
  location: Location;
  arrivalTime: number;
  pickupTime: number;
  departureTime: number;
  travelTime: number;
  distance: number;
  waitTime: number;
}

export interface RouteResult {
  route: Location[];
  totalTime: number;
  totalDistance: number;
  timings: {
    segmentTimes: { [key: string]: number };
    returnTime: number;
    totalTime: number;
    totalDistance: number;
  };
}
export interface RouteTimings {
  segmentTimes: { [key: string]: number };
  returnTime: number;
  totalTime: number;
  totalDistance: number;
}
