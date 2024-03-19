"use client";

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

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "1:00 AM",
    label: "1:00 AM",
  },
  {
    value: "1:15 AM",
    label: "1:15 AM",
  },
  {
    value: "1:30 AM",
    label: "1:30 AM",
  },
  {
    value: "1:45 AM",
    label: "1:45 AM",
  },
  {
    value: "2:00 AM",
    label: "2:00 AM",
  },
  {
    value: "2:15 AM",
    label: "2:15 AM",
  },
  {
    value: "2:30 AM",
    label: "2:30 AM",
  },
  {
    value: "2:45 AM",
    label: "2:45 AM",
  },
  {
    value: "3:00 AM",
    label: "3:00 AM",
  },
  {
    value: "3:15 AM",
    label: "3:15 AM",
  },
  {
    value: "3:30 AM",
    label: "3:30 AM",
  },
  {
    value: "3:45 AM",
    label: "3:45 AM",
  },
  {
    value: "4:00 AM",
    label: "4:00 AM",
  },
  {
    value: "4:15 AM",
    label: "4:15 AM",
  },
  {
    value: "4:30 AM",
    label: "4:30 AM",
  },
  {
    value: "4:45 AM",
    label: "4:45 AM",
  },
  {
    value: "5:00 AM",
    label: "5:00 AM",
  },
  {
    value: "5:15 AM",
    label: "5:15 AM",
  },
  {
    value: "5:30 AM",
    label: "5:30 AM",
  },
  {
    value: "5:45 AM",
    label: "5:45 AM",
  },
  {
    value: "6:00 AM",
    label: "6:00 AM",
  },
  {
    value: "6:15 AM",
    label: "6:15 AM",
  },
  {
    value: "6:30 AM",
    label: "6:30 AM",
  },
  {
    value: "6:45 AM",
    label: "6:45 AM",
  },
  {
    value: "7:00 AM",
    label: "7:00 AM",
  },
  {
    value: "7:15 AM",
    label: "7:15 AM",
  },
  {
    value: "7:30 AM",
    label: "7:30 AM",
  },
  {
    value: "7:45 AM",
    label: "7:45 AM",
  },
  {
    value: "8:00 AM",
    label: "8:00 AM",
  },
  {
    value: "8:15 AM",
    label: "8:15 AM",
  },
  {
    value: "8:30 AM",
    label: "8:30 AM",
  },
  {
    value: "8:45 AM",
    label: "8:45 AM",
  },
  {
    value: "9:00 AM",
    label: "9:00 AM",
  },
  {
    value: "9:15 AM",
    label: "9:15 AM",
  },
  {
    value: "9:30 AM",
    label: "9:30 AM",
  },
  {
    value: "9:45 AM",
    label: "9:45 AM",
  },
  {
    value: "10:00 AM",
    label: "10:00 AM",
  },
  {
    value: "10:15 AM",
    label: "10:15 AM",
  },
  {
    value: "10:30 AM",
    label: "10:30 AM",
  },
  {
    value: "10:45 AM",
    label: "10:45 AM",
  },
  {
    value: "11:00 AM",
    label: "11:00 AM",
  },
  {
    value: "11:15 AM",
    label: "11:15 AM",
  },
  {
    value: "11:30 AM",
    label: "11:30 AM",
  },
  {
    value: "11:45 AM",
    label: "11:45 AM",
  },
  {
    value: "12:00 PM",
    label: "12:00 PM",
  },
  {
    value: "12:15 PM",
    label: "12:15 PM",
  },
  {
    value: "12:30 PM",
    label: "12:30 PM",
  },
  {
    value: "12:45 PM",
    label: "12:45 PM",
  },
  {
    value: "1:00 PM",
    label: "1:00 PM",
  },
  {
    value: "1:15 PM",
    label: "1:15 PM",
  },
  {
    value: "1:30 PM",
    label: "1:30 PM",
  },
  {
    value: "1:45 PM",
    label: "1:45 PM",
  },
  {
    value: "2:00 PM",
    label: "2:00 PM",
  },
  {
    value: "2:15 PM",
    label: "2:15 PM",
  },
  {
    value: "2:30 PM",
    label: "2:30 PM",
  },
  {
    value: "2:45 PM",
    label: "2:45 PM",
  },
  {
    value: "3:00 PM",
    label: "3:00 PM",
  },
  {
    value: "3:15 PM",
    label: "3:15 PM",
  },
  {
    value: "3:30 PM",
    label: "3:30 PM",
  },
  {
    value: "3:45 PM",
    label: "3:45 PM",
  },
  {
    value: "4:00 PM",
    label: "4:00 PM",
  },
  {
    value: "4:15 PM",
    label: "4:15 PM",
  },
  {
    value: "4:30 PM",
    label: "4:30 PM",
  },
  {
    value: "4:45 PM",
    label: "4:45 PM",
  },
  {
    value: "5:00 PM",
    label: "5:00 PM",
  },
  {
    value: "5:15 PM",
    label: "5:15 PM",
  },
  {
    value: "5:30 PM",
    label: "5:30 PM",
  },
  {
    value: "5:45 PM",
    label: "5:45 PM",
  },
  {
    value: "6:00 PM",
    label: "6:00 PM",
  },
  {
    value: "6:15 PM",
    label: "6:15 PM",
  },
  {
    value: "6:30 PM",
    label: "6:30 PM",
  },
  {
    value: "6:45 PM",
    label: "6:45 PM",
  },
  {
    value: "7:00 PM",
    label: "7:00 PM",
  },
  {
    value: "7:15 PM",
    label: "7:15 PM",
  },
  {
    value: "7:30 PM",
    label: "7:30 PM",
  },
  {
    value: "7:45 PM",
    label: "7:45 PM",
  },
  {
    value: "8:00 PM",
    label: "8:00 PM",
  },
  {
    value: "8:15 PM",
    label: "8:15 PM",
  },
  {
    value: "8:30 PM",
    label: "8:30 PM",
  },
  {
    value: "8:45 PM",
    label: "8:45 PM",
  },
  {
    value: "9:00 PM",
    label: "9:00 PM",
  },
  {
    value: "9:15 PM",
    label: "9:15 PM",
  },
  {
    value: "9:30 PM",
    label: "9:30 PM",
  },
  {
    value: "9:45 PM",
    label: "9:45 PM",
  },
  {
    value: "10:00 PM",
    label: "10:00 PM",
  },
  {
    value: "10:15 PM",
    label: "10:15 PM",
  },
  {
    value: "10:30 PM",
    label: "10:30 PM",
  },
  {
    value: "10:45 PM",
    label: "10:45 PM",
  },
  {
    value: "11:00 PM",
    label: "11:00 PM",
  },
  {
    value: "11:15 PM",
    label: "11:15 PM",
  },
  {
    value: "11:30 PM",
    label: "11:30 PM",
  },
  {
    value: "11:45 PM",
    label: "11:45 PM",
  },
];

const ComboboxPopover = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  );

  return (
    <div className="flex items-center space-x-4">
      <Label>Open</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Open</>}
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
                    onSelect={(value) => {
                      setSelectedStatus(
                        statuses.find((priority) => priority.value === value) ||
                          null
                      );
                      setOpen(false);
                    }}
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

export default ComboboxPopover;
