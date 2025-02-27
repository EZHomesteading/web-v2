// types.ts
import { Location, UserRole } from "@prisma/client";

export interface RouteOptimizerProps {
  setStartLoc: React.Dispatch<React.SetStateAction<any[]>>;
  setEndLoc: React.Dispatch<React.SetStateAction<any[]>>;
  initialTime: Date;
  locations: any[];
  googleMapsApiKey: string;
  initialLocation: number[];
  onClose: () => void;
  setCartPickupTimes: any;
  isOpen: boolean;
  startDelay: number;
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
  timings: RouteTimings;
}
export interface RouteTimings {
  segmentTimes: { [key: string]: number };
  returnTime: number;
  totalTime: number;
  totalDistance: number;
  suggestedPickupTimes: { [key: string]: string };
  distanceSegments: {
    [k: string]: number;
  };
}
