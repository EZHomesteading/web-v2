import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface DateCompatibility {
  date: string;
  compatible: boolean;
  overlapHours: number;
  overlapTimeRange?: string;
}

// Helper function to calculate time range string from the overlapHours data
const calculateTimeRangeFromBasketData = (
  incompatibleDays: DateCompatibility[]
) => {
  return incompatibleDays.map((day) => {
    // This is just a placeholder - in the actual implementation,
    // you would use the actual start and end times from the useBasket hook
    if (!day.compatible) return day;
    if (day.overlapTimeRange) return day;

    // This function would be integrated with the actual time slot calculation
    // in the useBasket hook to generate accurate time ranges
    return {
      ...day,
      overlapTimeRange:
        day.overlapHours > 0
          ? `${Math.floor(day.overlapHours)}h window`
          : "No overlap",
    };
  });
};

const HoursWarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  incompatibleDays,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  incompatibleDays: DateCompatibility[];
  type: "pickup" | "delivery";
}) => {
  // Process the incompatible days to add time ranges if not already present
  const processedDays = calculateTimeRangeFromBasketData(incompatibleDays);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours Compatibility Check
          </DialogTitle>
          <DialogDescription>
            Here's the {type} hours compatibility with other items in your cart
            for the next 7 days:
            <ul className="mt-2 space-y-2">
              {processedDays.map((day, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center ${
                    day.compatible ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span>
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-sm">
                    {day.compatible
                      ? day.overlapTimeRange
                        ? `Overlaps ${day.overlapTimeRange}`
                        : `${Math.floor(day.overlapHours)}h overlap`
                      : "No compatible hours"}
                  </span>
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Add to Cart Anyway</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HoursWarningModal;
