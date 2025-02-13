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
}

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
              {incompatibleDays.map((day, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center ${
                    day.compatible ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span>
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-sm">
                    {day.compatible
                      ? `${Math.floor(day.overlapHours)}h ${Math.round(
                          (day.overlapHours % 1) * 60
                        )}m overlap`
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
