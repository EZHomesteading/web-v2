"use client";
//coop hours popover hours input
import * as React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Label } from "@/app/components/ui/label";
import { Status, statuses } from "./hours";

type HourPickerProps = {
  sideLabel: string;
  buttonLabel: string;
  value: string;
  onChange: (dbValue: string) => void;
};

const HourPicker = ({
  sideLabel,
  buttonLabel,
  value,
  onChange,
}: HourPickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    statuses.find((status) => status.dbValue === value) || null
  );

  const handleSelect = (value: string) => {
    const selected = statuses.find((status) => status.value === value);
    if (selected) {
      setSelectedStatus(selected);
      onChange(selected.dbValue);
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <Label>{sideLabel}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? selectedStatus.label : buttonLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={handleSelect}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HourPicker;
