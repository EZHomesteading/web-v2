"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingCart } from "lucide-react";

interface DateCompatibility {
  date: string;
  compatible: boolean;
  overlapHours: number;
  overlapTimeRange?: string;
  dayName?: string;
  monthDay?: string;
  timeSlots?: any[];
}

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;

  return mins === 0
    ? `${displayHours}${period}`
    : `${displayHours}:${mins.toString().padStart(2, "0")}${period}`;
};

// Helper function to calculate time range string from the overlapHours data
const calculateTimeRangeFromBasketData = (
  incompatibleDays: DateCompatibility[]
) => {
  return incompatibleDays.map((day) => {
    // Use existing overlapTimeRange if present
    if (day.overlapTimeRange) return day;

    // Format the day name and month/day if not present
    const date = new Date(day.date);
    const dayName =
      day.dayName || date.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay =
      day.monthDay ||
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Calculate time range based on compatibility
    let overlapTimeRange = "No available hours";
    if (day.compatible && day.overlapHours > 0) {
      overlapTimeRange = `${Math.floor(day.overlapHours)}h window`;
    }

    return {
      ...day,
      dayName,
      monthDay,
      overlapTimeRange,
    };
  });
};

const HoursWarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  incompatibleDays,
  type,
  isFirstItem, // New prop to indicate if this is the first item
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  incompatibleDays: DateCompatibility[];
  type: "pickup" | "delivery";
  isFirstItem?: boolean;
}) => {
  console.log("Modal rendering with isFirstItem:", isFirstItem);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport on client-side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint is 640px
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Process the incompatible days to add time ranges if not already present
  const processedDays = calculateTimeRangeFromBasketData(incompatibleDays);

  // Responsive dialog content class
  const dialogContentClass = isMobile
    ? "w-full h-[100dvh] max-h-screen rounded-none p-4 sm:p-6 flex flex-col"
    : "sm:max-w-md";

  // Responsive content area class
  const contentAreaClass = isMobile
    ? "py-2 flex-grow overflow-y-auto mb-4"
    : "py-2 max-h-[60vh] overflow-y-auto";

  // First Item View - Show location hours
  if (isFirstItem) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={dialogContentClass}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Location Operating Hours
            </DialogTitle>
            <DialogDescription>
              This is the first item in your basket. Here are the {type} hours
              available:
            </DialogDescription>
          </DialogHeader>
          <div className={contentAreaClass}>
            <ul className="space-y-3">
              {processedDays.map((day, index) => (
                <li key={index} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between items-center font-medium">
                    <span>
                      {day.dayName || ""} {day.monthDay || day.date}
                    </span>
                  </div>
                  {day.timeSlots && day.timeSlots.length > 0 ? (
                    <div className="mt-1 text-sm text-gray-600">
                      {day.timeSlots.map((slot, idx) => (
                        <div key={idx} className="inline-block mr-3 mb-1">
                          {slot.openFormatted || formatTime(slot.open)} -{" "}
                          {slot.closeFormatted || formatTime(slot.close)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-gray-600">
                      {day.overlapHours > 0
                        ? `Available for ${Math.floor(day.overlapHours)}h`
                        : "No hours available"}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter
            className={`${
              isMobile ? "mt-auto pt-4 border-t" : ""
            } flex justify-end gap-2`}
          >
            <Button
              variant="outline"
              onClick={onClose}
              className={isMobile ? "flex-1" : ""}
            >
              Cancel
            </Button>
            <Button onClick={onConfirm} className={isMobile ? "flex-1" : ""}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Basket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Subsequent Items View - Show compatibility check
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours Compatibility Check
          </DialogTitle>
          <DialogDescription>
            Here's the {type} hours compatibility with other items in your
            basket:
          </DialogDescription>
        </DialogHeader>
        <div className={contentAreaClass}>
          <ul className="space-y-2">
            {processedDays.map((day, index) => (
              <li
                key={index}
                className={`flex flex-wrap justify-between items-center p-2 rounded ${
                  day.compatible
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span className="font-medium">
                  {day.dayName || ""} {day.monthDay || day.date}
                </span>
                <span className="text-sm mt-1 w-full sm:w-auto sm:mt-0">
                  {day.compatible
                    ? day.overlapTimeRange
                      ? `${day.overlapTimeRange}`
                      : `${Math.floor(day.overlapHours)}h overlap`
                    : "No compatible hours"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter
          className={`${
            isMobile ? "mt-auto pt-4 border-t" : ""
          } flex justify-end gap-2`}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={isMobile ? "flex-1" : ""}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className={isMobile ? "flex-1" : ""}>
            Add to Basket Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HoursWarningModal;
