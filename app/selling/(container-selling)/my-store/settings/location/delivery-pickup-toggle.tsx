import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import { Outfit } from "next/font/google";
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

export { DeliveryPickupToggle, ViewEditToggle };
