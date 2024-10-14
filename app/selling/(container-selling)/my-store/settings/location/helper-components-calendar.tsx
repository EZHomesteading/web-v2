import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { TimeSlot } from "@prisma/client";
import { Outfit, Zilla_Slab } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
  PiCarProfileThin,
  PiEyeThin,
  PiHouseLineThin,
  PiPencilSimpleLineThin,
} from "react-icons/pi";
import { RiArrowDownSLine } from "react-icons/ri";

const o = Outfit({
  subsets: ["latin"],
  display: "swap",
});

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
          className="relative select-none hover:bg-inherit rounded-full mr-1 text-xs sm:text-sm flex items-center justify-start bg-inherit px-2 sm:px-4"
        >
          {panelSide && (
            <>
              {mode === DeliveryPickupToggleMode.DELIVERY ? (
                <PiCarProfileThin className="h-8 w-8 pr-1" />
              ) : (
                <PiHouseLineThin className="h-6 w-6 pr-1" />
              )}
              <div className="border-l h-full pr-1" />
            </>
          )}

          {mode === DeliveryPickupToggleMode.DELIVERY
            ? "Delivery"
            : "Pickup & Dropoff"}
          <div className="border-r h-full pl-1" />
          <RiArrowDownSLine className="h-6 w-6 pl-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-full ${o.className} p-4`}>
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
      <DropdownMenuContent className={`w-full p-4 ${o.className}`}>
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

interface LocationSelectorProps {
  index: number;
  panelSide: boolean;
  address: any;
}
interface Location {
  address: string[];
  coordinates: number[];
  type: string;
  role: string;
  hours: any;
}
const LocationSelector = ({
  index,
  panelSide,
  address,
}: LocationSelectorProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const locations = user?.location || [];

  const formatAddress = (address: string[]): string => {
    return address.join(", ");
  };
  let activeAddress;
  activeAddress = address ? address[0] : "New Location";

  const menuItems = locations.map((location: Location, idx: number) => (
    <DropdownMenuRadioItem
      key={idx}
      value={idx.toString()}
      className={`${o.className} hover:cursor-pointer w-full min-w-[326px] text-xl font-light truncate max-w-[326px] py-4 flex items-center justify-start`}
    >
      <div
        className={`rounded-full border p-[.4rem] ml-1 mr-2  ${
          idx === index ? "bg-black" : "bg-white"
        }`}
      >
        <div className="rounded-full border bg-white p-1"></div>
      </div>{" "}
      {formatAddress(location.address)}
    </DropdownMenuRadioItem>
  ));

  if (locations.length < 3) {
    menuItems.push(
      <DropdownMenuRadioItem
        key={locations.length.toString()}
        value={locations.length.toString()}
        className={`${o.className} hover:cursor-pointer w-full min-w-[326px] text-xl font-light truncate max-w-[326px] py-4 flex items-center justify-start`}
      >
        <CiCirclePlus className="text-[1.6rem] ml-1 mr-2" />
        Add New Location & Hours
      </DropdownMenuRadioItem>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`w-full bg-inherit flex items-center justify-start py-8 shadow-md ${
          panelSide ? "mt-6" : ""
        }`}
      >
        <Button
          variant="outline"
          className="w-full relative select-none hover:bg-inherit"
        >
          <div className="truncate max-w-[87%] text-start select-none text-xl">
            {activeAddress}
          </div>
          <RiArrowDownSLine
            className="absolute bottom-[-1] right-0"
            size={50}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[326px] w-full">
        <DropdownMenuRadioGroup
          value={index.toString()}
          onValueChange={(value) => {
            if (value === "add-new") {
              router.push("/selling/my-store/settings/location/new");
            } else {
              router.push(`/selling/my-store/settings/location/${value}`);
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
interface CalendarDayProps {
  day: number | null;
  onMouseDown: (day: number | null) => void;
  onMouseEnter: (day: number | null) => void;
  isSelected: boolean;
  timeSlots: TimeSlot[];
}

const z = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});

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

  const animationSettings = useMemo(() => {
    if (timeSlots.length === 0) {
      return {
        shouldAnimate: false,
        startColor: "black",
        endColor: "black",
        duration: "5s",
      };
    }

    const { open, close } = timeSlots[0];
    const totalMinutesOpen = close - open;
    const maxAnimationDuration = 20; // Maximum animation time in seconds
    const animationDuration =
      Math.min((totalMinutesOpen / 60) * 2, maxAnimationDuration) + "s";

    const getColorForTime = (time: number) => {
      if (time < 6 * 60) return "black";
      if (time < 8 * 60) return "#FF8C00";
      if (time < 12 * 60) return "#FFFF00";
      if (time < 16 * 60) return "#FFD700";
      if (time < 18 * 60) return "#FFA500";
      if (time < 20 * 60) return "#FF4500";
      return "black";
    };

    return {
      shouldAnimate: true,
      startColor: getColorForTime(open),
      endColor: getColorForTime(close),
      duration: animationDuration,
    };
  }, [timeSlots]);

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
                : timeSlots.length === 0
                ? "line-through"
                : ""
            }`}
          >
            {day}
          </div>
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`${
                z.className
              } text-[.5rem] lg:text-xs !text-black mt-1 overflow-y-auto ${
                animationSettings.shouldAnimate ? "daylight-animation" : ""
              }`}
              style={
                {
                  animation: animationSettings.shouldAnimate
                    ? `daylightGradient ${animationSettings.duration} linear forwards`
                    : "none",
                  "--start-color": animationSettings.startColor,
                  "--end-color": animationSettings.endColor,
                } as React.CSSProperties
              }
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

export {
  DeliveryPickupToggle,
  ViewEditToggle,
  CustomSwitch,
  LocationSelector,
  CalendarDay,
  o,
  z,
};
