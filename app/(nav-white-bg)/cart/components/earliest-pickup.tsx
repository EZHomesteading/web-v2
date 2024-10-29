"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExtendedHours } from "@/next-auth";
import { Outfit } from "next/font/google";
import { CartGroup2, ValidTime } from "../client";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  hours: ExtendedHours;
  index: number;
  onSetTime: (childTime: ValidTime) => void;
  role: string;
  sodtarr: CartGroup2[];
}

interface Timer {
  pickupTime: Date;
}

const EarliestPickup = ({ hours, onSetTime, index, role, sodtarr }: Props) => {
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null);
  const [earliestPickupTime, setEarliestPickupTime] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const calculateEarliestPickupTime = useCallback(() => {
    const now = new Date();
    const currentDayIndex = (now.getDay() + 6) % 7;
    const currentMin = now.getHours() * 60 + now.getMinutes();
    let nextAvailableTime = null;

    let sodt =
      sodtarr.find((item: CartGroup2) => item.cartIndex === index) ||
      sodtarr[index];

    for (let i = 0; i < 7; i++) {
      const newHoursIndex = ((currentDayIndex + i) % 7) as keyof ExtendedHours;
      const newHours = hours[newHoursIndex];

      if (newHours === null || (newHours && newHours.length === 0)) {
        continue;
      }

      let foundSlot = false;

      if (i === 0) {
        let foundSlotOnSameDay = false;

        for (const hourSlot of newHours) {
          const openTime = hourSlot.open;
          const closeTime = hourSlot.close;

          if (currentMin < openTime) {
            if (openTime - currentMin >= 30) {
              nextAvailableTime = new Date(now);
              nextAvailableTime.setHours(
                Math.floor(openTime / 60),
                openTime % 60,
                0,
                0
              );
              foundSlotOnSameDay = true;
              break;
            }
          } else if (
            currentMin >= openTime &&
            currentMin + sodt.sodt < closeTime
          ) {
            nextAvailableTime = new Date(now);
            const futureMin = currentMin + sodt.sodt;
            const futureHours = Math.floor(futureMin / 60);
            const futureMinutes = futureMin % 60;
            nextAvailableTime.setHours(futureHours, futureMinutes, 0, 0);
            foundSlotOnSameDay = true;
            break;
          }
        }

        if (foundSlotOnSameDay) {
          foundSlot = true;
          break;
        }
      } else {
        const openTime = newHours[0].open;
        nextAvailableTime = new Date(now);
        nextAvailableTime.setDate(now.getDate() + i);
        nextAvailableTime.setHours(
          Math.floor(openTime / 60),
          openTime % 60,
          0,
          0
        );
        foundSlot = true;
        break;
      }

      if (foundSlot) {
        break;
      }
    }

    if (!nextAvailableTime) {
      setNextAvailableTime(null);
      setEarliestPickupTime(null);
      setIsLoading(false);
      return;
    }

    const formattedEarliestTime = formatPickupTime({
      pickupTime: nextAvailableTime,
    });
    setNextAvailableTime(nextAvailableTime);
    setEarliestPickupTime(formattedEarliestTime);
    setIsLoading(false);
  }, [hours, sodtarr, index]);

  useEffect(() => {
    setIsLoading(true);
    calculateEarliestPickupTime();
  }, [calculateEarliestPickupTime]);

  const handleAsSoonAsPossible = () => {
    if (!isLoading && nextAvailableTime) {
      onSetTime({ pickupTime: nextAvailableTime, index: index });
    }
  };

  const formatPickupTime = (selectedTimer: Timer) => {
    if (!selectedTimer) return "";
    const { pickupTime } = selectedTimer;
    const now = new Date();
    const pickupDate = new Date(pickupTime);

    if (pickupDate.toDateString() === now.toDateString()) {
      return `Today at ${pickupDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (pickupDate.getTime() < now.getTime() + 7 * 24 * 60 * 60 * 1000) {
      return `${pickupDate.toLocaleDateString([], {
        weekday: "long",
      })} at ${pickupDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else {
      return `${pickupDate.toLocaleDateString()} at ${pickupDate.toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;
    }
  };

  if (!hours || !sodtarr) {
    return null;
  }

  if (Object.values(hours).every((dayHours) => dayHours === null)) {
    return (
      <Card className="bg-inherit border-none cursor-not-allowed opacity-50">
        <CardHeader
          className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
        >
          Earliest pickup not available
        </CardHeader>
        <CardContent className={`${outfit.className}`}>
          {role === "PRODUCER"
            ? `This Producer has not provided their hours. Please contact them for more information.`
            : `This co-op has not provided their hours. Please contact them for more information.`}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={handleAsSoonAsPossible}
      className={`bg-inherit border-none ${
        isLoading ? "cursor-wait opacity-50" : "cursor-pointer"
      }`}
    >
      <CardHeader
        className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
      >
        {role === "PRODUCER"
          ? `Get delivered as soon as possible`
          : `Pickup as soon as possible`}
      </CardHeader>
      <CardContent className={`${outfit.className}`}>
        {role === "PRODUCER"
          ? `In a hurry? The earliest possible delivery time from this producer is `
          : `In a hurry? The earliest possible time for pickup from this co-op is `}

        <span className={`${outfit.className} text-lg`}>
          {isLoading ? "Calculating..." : earliestPickupTime || "not available"}
        </span>
      </CardContent>
    </Card>
  );
};

export default EarliestPickup;
