// First, lets create a DepartureTimePicker component
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OutfitFont } from "@/components/fonts";

interface DepartureTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: Date) => void;
  currentTime?: Date;
}

const DepartureTimePicker = ({
  isOpen,
  onClose,
  onSubmit,
  currentTime = new Date(),
}: DepartureTimePickerProps) => {
  const [selectedDate, setSelectedDate] = React.useState<string>(
    currentTime.toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = React.useState<string>(
    currentTime.toTimeString().slice(0, 5)
  );

  const handleSubmit = () => {
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    onSubmit(dateTime);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={OutfitFont.className}>
            Set Departure Time
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="departure-date">Departure Date</Label>
            <Input
              id="departure-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departure-time">Departure Time</Label>
            <Input
              id="departure-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Set Departure Time</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartureTimePicker;
