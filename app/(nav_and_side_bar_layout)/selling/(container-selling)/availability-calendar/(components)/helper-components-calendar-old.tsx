import { OutfitFont, ZillaFont } from "@/components/fonts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Location, TimeSlot } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
  PiCarProfileThin,
  PiEyeThin,
  PiHouseLineThin,
  PiPencilSimpleLineThin,
} from "react-icons/pi";
import { RiArrowDownSLine } from "react-icons/ri";

export enum DeliveryPickupToggleMode {
  DELIVERY = "DELIVERY",
  PICKUP = "PICKUP",
}

interface DeliveryPickupToggleProps {
  panelSide: boolean;
  mode: DeliveryPickupToggleMode;
  onModeChange: (mode: DeliveryPickupToggleMode) => void;
}

const DeliveryPickupToggle = ({
  panelSide,
  mode,
  onModeChange,
}: DeliveryPickupToggleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative select-none hover:bg-inherit rounded-full text-xs sm:text-sm flex items-center justify-start bg-inherit px-2 sm:px-4"
        >
          {mode === DeliveryPickupToggleMode.DELIVERY ? (
            <PiCarProfileThin className="h-8 w-8 pr-1" />
          ) : (
            <PiHouseLineThin className="h-6 w-6 pr-1" />
          )}

          {panelSide && (
            <>
              {mode === DeliveryPickupToggleMode.DELIVERY
                ? "Delivery"
                : "Pickup & Dropoff"}
            </>
          )}
          <div className="border-r h-full pl-1" />
          <RiArrowDownSLine className="h-6 w-6 pl-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-full ${OutfitFont.className} p-4`}>
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value: string) =>
            onModeChange(value as DeliveryPickupToggleMode)
          }
        >
          <DropdownMenuRadioItem value={DeliveryPickupToggleMode.DELIVERY}>
            <div className="flex items-center justify-between w-full pb-3 p-1">
              <div className="flex flex-col items-start">
                <div className="text-xl font-medium">Delivery Hours</div>
                <div className="text-xs">Times you are able to deliver</div>
              </div>
              <div
                className={`rounded-full border p-[.4rem] ml-20 ${
                  mode === DeliveryPickupToggleMode.DELIVERY
                    ? "bg-black"
                    : "bg-white"
                }`}
              >
                <div className="rounded-full border bg-white p-1"></div>
              </div>
            </div>
          </DropdownMenuRadioItem>
          <hr className="w-full pt-2" />
          <DropdownMenuRadioItem value={DeliveryPickupToggleMode.PICKUP}>
            <div className="flex items-center justify-between w-full p-1">
              <div className="flex flex-col items-start">
                <div className="text-xl font-medium">
                  Pickup & Dropoff Hours
                </div>
                <div className="text-xs">
                  Times for accepting deliveries or pickups
                  <div>
                    You may not need to be present <div></div>depending on
                    item(s) perishability
                  </div>
                </div>
              </div>
              <div
                className={`rounded-full border p-[.4rem] ml-20 ${
                  mode === DeliveryPickupToggleMode.PICKUP
                    ? "bg-black"
                    : "bg-white"
                }`}
              >
                <div className="rounded-full border bg-white p-1"></div>
              </div>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <div className="px-2 w-full mt-2">
          <Button className="w-full">More Info</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface LocationSelectorProps {
  id?: string;
  address: any;
  locations: Location[];
  pathname: string | null;
  inPanel?: boolean;
  displayName?: string | null;
}

const LocationSelector = ({
  id,
  address,
  locations,
  pathname,
  inPanel = true,
  displayName,
}: LocationSelectorProps) => {
  const router = useRouter();

  const formatAddress = (address: string[]): string => {
    return address.join(", ");
  };
  const menuItems = locations.map((location: Location, idx: number) => (
    <DropdownMenuRadioItem
      key={idx}
      value={location.id}
      className={`${OutfitFont.className} hover:cursor-pointer w-full min-w-[326px] text-sm font-medium truncate max-w-[326px] py-4 flex items-center justify-start`}
    >
      <div
        className={`rounded-full border p-[.4rem] ml-1 mr-2  ${
          location?.id === id ||
          (!id &&
            location.isDefault &&
            pathname !== "/selling/availability-calendar/new-location")
            ? "bg-black"
            : "bg-white"
        }`}
      >
        <div className="rounded-full border bg-white p-1"></div>
      </div>
      {location?.displayName ? (
        <div className={`flex flex-col items-start`}>
          <p>{location?.displayName}</p>
          <p className={`text-neutral-500 text-xs`}>
            {formatAddress(location.address)}
          </p>
        </div>
      ) : (
        <p className={`font-medium text-sm`}>
          {formatAddress(location.address)}
        </p>
      )}
    </DropdownMenuRadioItem>
  ));

  if (locations.length < 5) {
    menuItems.push(
      <DropdownMenuRadioItem
        key={`new`}
        value={`new`}
        className={`${OutfitFont.className} hover:cursor-pointer w-full min-w-[326px] text-xl font-light truncate max-w-[326px] py-4 flex items-center justify-start`}
      >
        <CiCirclePlus className="text-[1.6rem] ml-1 mr-2" />
        <p className={`font-medium text-sm`}>Add New Location & Hours</p>
      </DropdownMenuRadioItem>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`${
          inPanel
            ? "w-full bg-inherit flex items-center justify-start py-8 shadow-md rounded-sm !border-black hover:text-white"
            : "rounded-full bg-inherit"
        } `}
      >
        <Button
          variant="outline"
          className={`relative select-none hover:bg-inherit ${
            inPanel ? "rounded-sm text-md" : "rounded-full"
          } flex items-center justify-start bg-inherit px-2 sm:px-4`}
        >
          {inPanel && displayName ? (
            <div className={`w-full flex flex-col items-start`}>
              <p>{displayName}</p>
              <p
                className={`truncate max-w-[87%] text-start text-neutral-700 text-xs`}
              >
                {address[0]}
              </p>
            </div>
          ) : (
            <div className={`truncate max-w-[87%] text-start `}>
              {address[0]}
            </div>
          )}

          {!inPanel && <div className="border-r h-full pl-1" />}

          <RiArrowDownSLine
            className={`${
              inPanel ? "absolute right-0 top-4 h-8 w-8" : "h-6 w-6"
            } `}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[326px] w-full zmax">
        <DropdownMenuRadioGroup
          value={id}
          onValueChange={(value) => {
            if (value === "new") {
              router.push(
                "/new-location-and-hours?/selling/availability-calendar"
              );
            } else {
              router.push(`/selling/availability-calendar/${value}`);
            }
          }}
          className="w-full"
        >
          {menuItems}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface CustomSwitchProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ isOpen, onToggle }) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  const handleClick = () => {
    setLocalIsOpen(!localIsOpen);
    onToggle();
  };

  return (
    <div
      className="relative select-none w-48 h-12 bg-gray-300 rounded-full cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="absolute inset-0 flex items-center justify-evenly text-sm font-medium">
        <span
          className={`z-10 pr-1 transition-colors duration-300 ${
            localIsOpen ? "text-white" : "text-gray-500"
          }`}
        >
          Open
        </span>
        <span
          className={`z-10 transition-colors duration-300 ${
            localIsOpen ? "text-gray-500" : "text-white"
          }`}
        >
          Closed
        </span>
      </div>
      <div
        className={`
          absolute top-1 bottom-1 w-1/2 bg-slate-900 rounded-full
          transition-all duration-300 ease-in-out
          ${localIsOpen ? "left-1" : "right-1"}
        `}
      />
    </div>
  );
};

export enum Mode {
  VIEW = "VIEW",
  EDIT = "EDIT",
}

interface ViewEditToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  panelSide: boolean;
}

const ViewEditToggle = ({
  mode,
  onModeChange,
  panelSide,
}: ViewEditToggleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative select-none hover:bg-inherit rounded-full flex items-center justify-start bg-inherit text-xs sm:text-sm px-2 sm:py-4"
        >
          {panelSide && (
            <>
              {mode === Mode.VIEW ? (
                <PiEyeThin className="h-8 w-8 pr-1" />
              ) : (
                <PiPencilSimpleLineThin className="h-6 w-6 pr-1" />
              )}
              <div className="border-l h-full pr-1" />
            </>
          )}

          {mode === Mode.VIEW ? "View Mode" : "Edit Mode"}
          <div className="border-r h-full pl-1" />
          <RiArrowDownSLine className="h-6 w-6 pl-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-full p-4 ${OutfitFont.className}`}>
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value: string) => onModeChange(value as Mode)}
        >
          <DropdownMenuRadioItem value={Mode.VIEW}>
            <div className="flex items-center justify-between w-full p-1">
              <div className="flex flex-col items-start">
                <div className="text-xl font-medium">View Mode</div>
                <div className="text-xs">
                  Select Calendar Day(s) to View Hours
                </div>
              </div>
              <div
                className={`rounded-full border p-[.4rem] ml-20 ${
                  mode === Mode.VIEW ? "bg-black" : "bg-white"
                }`}
              >
                <div className="rounded-full border bg-white p-1"></div>
              </div>
            </div>
          </DropdownMenuRadioItem>
          <hr className="w-full mt-2" />
          <DropdownMenuRadioItem value={Mode.EDIT}>
            <div className="flex items-center justify-between w-full pt-2 p-1">
              <div className="flex flex-col items-start">
                <div className="text-xl font-medium">Edit Mode</div>
                <div className="text-xs">
                  Select Calendar Day(s) to Change Hours
                </div>
              </div>
              <div
                className={`rounded-full border p-[.4rem] ml-20 ${
                  mode === Mode.EDIT ? "bg-black" : "bg-white"
                }`}
              >
                <div className="rounded-full border bg-white p-1"></div>
              </div>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface CalendarDayProps {
  day: number | null;
  onMouseDown: (day: number | null) => void;
  onMouseEnter: (day: number | null) => void;
  isSelected: boolean | null;
  timeSlots?: TimeSlot[];
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onMouseDown,
  onMouseEnter,
  isSelected,
  timeSlots,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (day !== null) {
      e.preventDefault();
      onMouseDown(day);
    }
  };

  const handleMouseEnter = () => {
    if (day !== null) {
      onMouseEnter(day);
    }
  };

  const convertMinutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      className={`
        ${day !== null ? "border border-gray-200 h-36 cursor-pointer" : "h-12"}
        ${isSelected && day !== null ? "bg-emerald-200/80 border " : ""}
        relative
      `}
    >
      {day !== null && (
        <div className="sm:p-2 pl-1 ">
          <div
            className={`text-sm font-light ${
              isSelected
                ? "underline"
                : timeSlots?.length === 0
                ? "line-through"
                : ""
            }`}
          >
            {day}
          </div>
          {timeSlots?.map((slot, index) => (
            <div
              key={index}
              className={`${ZillaFont.className} text-[.5rem] lg:text-xs !text-black mt-1 overflow-y-auto `}
            >
              {`${convertMinutesToTimeString(
                slot.open
              )} - ${convertMinutesToTimeString(slot.close)}`}
            </div>
          ))}
        </div>
      )}
      {isSelected && day !== null && (
        <div className="absolute inset-0 bg-slate-700 opacity-50 pointer-events-none"></div>
      )}
    </div>
  );
};
interface CalendarDayCartProps {
  day: number | null;
  onMouseDown: (day: number | null) => void;
  isSelected: boolean | null;
  timeSlots?: TimeSlot[];
}

const CalendarDayCart: React.FC<CalendarDayCartProps> = ({
  day,
  onMouseDown,
  isSelected,
  timeSlots,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (day !== null) {
      e.preventDefault();
      onMouseDown(day);
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      className={`relative flex items-center justify-center  ${
        day !== null ? " cursor-pointer p-1 text-xs" : ""
      } ${isSelected && day !== null ? "" : "border-transparent"}`}
    >
      {day !== null && (
        <div
          className={`!text-xs font-medium text-center ${
            OutfitFont.className
          } ${
            isSelected
              ? "underline "
              : timeSlots?.length === 0
              ? "line-through text-neutral-600"
              : "text-blue-500/60"
          }`}
        >
          {day}
        </div>
      )}
    </button>
  );
};

export {
  DeliveryPickupToggle,
  CalendarDayCart,
  ViewEditToggle,
  CustomSwitch,
  LocationSelector,
  CalendarDay,
};
