"use client";
import {
  hasAvailableHours,
  week_day_mmm_dd_yy_time,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { outfitFont } from "@/components/fonts";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useMediaQuery from "@/hooks/media-query";
import {
  Availability,
  Hours,
  orderMethod,
  proposedLoc,
  UserRole,
} from "@prisma/client";
import { UserInfo } from "next-auth";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { toast } from "sonner";

interface p {
  listing: any;
  user?: UserInfo;
}

const SendMessageSection = ({ listing, user }: p) => {
  const hasPickup = hasAvailableHours(listing.location.hours?.pickup || []);
  const hasDelivery = hasAvailableHours(listing.location.hours?.delivery || []);
  let initialOrderMethod: orderMethod;
  if (hasPickup && hasDelivery) {
    if (user?.role == UserRole.COOP) {
      initialOrderMethod = orderMethod.DELIVERY;
    } else {
      initialOrderMethod = orderMethod.PICKUP;
    }
  } else if (hasPickup) {
    initialOrderMethod = orderMethod.PICKUP;
  } else if (hasDelivery) {
    initialOrderMethod = orderMethod.DELIVERY;
  } else {
    initialOrderMethod = orderMethod.UNDECIDED;
  }

  const [method, setMethod] = useState(initialOrderMethod);
  const [quantity, setQuantity] = useState(listing.minOrder || 1);
  const [proposedLoc, setProposedLoc] = useState<proposedLoc | null>({
    address: [""],
    coordinates: [1, 2],
  });

  const formatOrderMethodText = (method: orderMethod) => {
    return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
  };
  const findEarliestTime = (orderType: orderMethod, sellerHours: Hours) => {
    const currentDate = new Date();
    const relevantHours =
      orderType === orderMethod.DELIVERY
        ? sellerHours.delivery
        : sellerHours.pickup;

    const firstAvailable = relevantHours
      .filter((availability: Availability) => {
        const availableDate = new Date(availability.date);
        return !isNaN(availableDate.getTime()) && availableDate >= currentDate;
      })
      .sort(
        (
          a: { date: string | number | Date },
          b: { date: string | number | Date }
        ) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

    if (!firstAvailable) {
      return { time: "No available time", date: null };
    }

    const { time, date } = week_day_mmm_dd_yy_time(
      firstAvailable.timeSlots[0].open,
      new Date(firstAvailable.date)
    );

    return { time, date };
  };
  const { time, date } = findEarliestTime(method, listing.location?.hours);
  const [selectedDateTime, setSelectedDateTime] = useState(date);
  const [errorType, setErrorType] = useState<
    | "undecided"
    | "location"
    | "deliveryDate"
    | "pickupDate"
    | "zero"
    | "lessThanMin"
    | null
  >(null);
  const handleErrors = () => {
    if (!listing) return false;

    if (isOrderMethodUndecided()) {
      toast.error(
        "Please select your preferred delivery method for this listing."
      );
      setErrorType("undecided");
      return true;
    } else if (isDeliveryWithoutLocation()) {
      toast.error("Please specify a delivery location for this listing.");
      setErrorType("location");
      return true;
    } else if (isDeliveryWithoutLocation()) {
      toast.error("Please specify a delivery location for this listing.");
      setErrorType("location");
      return true;
    } else if (isZeroQuantity()) {
      toast.error("Quantity must be greater than zero.");
      setErrorType("location");
      return true;
    } else if (quantityLessThanMinOrder()) {
      toast.error(
        `The minimum order size for this listing is ${listing.minOrder} ${listing.quantityType}`
      );
      setErrorType("deliveryDate");
      return true;
    } else if (isPickupWithoutDate()) {
      toast.error("Please suggest a time when you can pick up this listing.");
      setErrorType("pickupDate");
      return true;
    }

    setErrorType(null);
    return false;
  };
  const isOrderMethodUndecided = () => method === orderMethod.UNDECIDED;
  const quantityLessThanMinOrder = () => quantity < listing.minOrder;
  const isZeroQuantity = () => quantity <= 0;
  const isDeliveryWithoutLocation = () =>
    method === orderMethod.DELIVERY && !proposedLoc;
  const isDeliveryWithoutDate = () =>
    method === orderMethod.DELIVERY && proposedLoc && !selectedDateTime;
  const isPickupWithoutDate = () =>
    method === orderMethod.PICKUP && !selectedDateTime;
  method === orderMethod.PICKUP && !selectedDateTime;
  return (
    <>
      <div className={`border border-black shadow-md rounded-md h-fit p-3 `}>
        <div className={`text-lg font-semibold`}>
          Modify Info & Send Seller a Message
        </div>
        <div>
          ${listing.price} per {listing.quantityType}
        </div>
        <div
          className={`grid grid-cols-2 grid-rows-2 my-8 shadow-sm rounded-xl border border-custom`}
        >
          <div
            className={` p-0 relative hover:cursor-pointer rounded-tl-xl h-14       `}
          >
            <div
              className={`absolute top-1 text-xs text-neutral-700 left-1 font-medium`}
            >
              Quantity
            </div>
            <Input
              className={`w-full  focus-visible:ring-0 border-none p-8 pl-2 font-semibold `}
              type="number"
              maxLength={6}
              inputMode="numeric"
              min={listing.minOrder || 1}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <div
                className={`${
                  errorType === "undecided" ? "borderRed" : ""
                } pt-5 pl-1 border-l border-custom pr-8 relative hover:cursor-pointer rounded-tr-xl`}
              >
                <div
                  className={`absolute top-1 text-xs text-neutral-700 left-1 font-medium`}
                >
                  How?
                </div>
                <button className={`text-sm font-semibold`}>
                  {formatOrderMethodText(method)}
                </button>
                <div
                  className={`absolute bottom-1/2 transform translate-y-1/2 right-2`}
                >
                  <RiArrowDropDownLine />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className={`w-full ${outfitFont.className}`}>
              <div className={`text-center font-semibold border-b pb-3 `}>
                Order Type
              </div>
              {hasPickup && hasDelivery ? (
                <div
                  className={` text-lg w-full flex flex-col gap-y-3 items-start justify-start text-start pt-3`}
                >
                  <button
                    className="flex justify-start items-center w-full"
                    onClick={() => {
                      setMethod(orderMethod.DELIVERY);
                      setProposedLoc(null);
                      setSelectedDateTime(null);
                    }}
                  >
                    <div
                      className={`rounded-full border p-[.4rem] ${
                        method === orderMethod.DELIVERY
                          ? "bg-black"
                          : "bg-white"
                      }`}
                    >
                      <div className="rounded-full border bg-white p-1" />
                    </div>
                    <div className="ml-2">
                      I would like the order delivered to me for a fee
                    </div>
                  </button>
                  <button
                    className="flex justify-start items-center w-full"
                    onClick={() => {
                      setMethod(orderMethod.PICKUP);
                      setSelectedDateTime(null);
                    }}
                  >
                    <div
                      className={`rounded-full border p-[.4rem] ${
                        method === orderMethod.PICKUP ? "bg-black" : "bg-white"
                      }`}
                    >
                      <div className="rounded-full border bg-white p-1" />
                    </div>
                    <div className="ml-2">
                      I would like to pick up the order
                    </div>
                  </button>
                </div>
              ) : hasPickup ? (
                <div className="mt-2">
                  Orders from this location are only available for pickup due to
                  seller hours
                </div>
              ) : (
                hasDelivery && (
                  <div className="mt-2">
                    Orders from this location are only available for delivery
                    due to seller hours
                  </div>
                )
              )}
            </PopoverContent>
          </Popover>

          {method === orderMethod.DELIVERY && (
            <div
              className={` pt-5 pl-1  pr-8 border-l relative border-t border-custom hover:cursor-pointer rounded-br-xl`}
            >
              <div
                className={`absolute top-1 text-xs text-neutral-700 left-1 font-medium`}
              >
                Where?
              </div>
              <button className={`text-sm font-semibold`}></button>
              <div
                className={`absolute bottom-1/2 transform translate-y-1/2 right-2`}
              >
                <RiArrowDropDownLine />
              </div>
            </div>
          )}
        </div>
        <div className={`text-xs text-center mt-3 mb-1`}>
          You will not be charged at this time
        </div>
        <button
          className={`w-full rounded-md p-4 text-sm shadow-sm bg-sky-100 mb-3`}
        >
          Send Seller a Message
        </button>

        <button
          className={`w-full rounded-md p-4 text-sm shadow-sm bg-sky-100`}
        >
          Add to Basket{" "}
        </button>
      </div>
    </>
  );
};

export default SendMessageSection;
