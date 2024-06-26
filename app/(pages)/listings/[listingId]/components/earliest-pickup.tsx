"use client";
//element and funciton to pull ealiest possible pick up time (need to add based on coops/producers, setout/delivery times.)
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { ExtendedHours } from "@/next-auth";
import { Outfit } from "next/font/google";
import { useEffect, useState } from "react";
import { ValidTime } from "./CustomTimeModal2";
const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  hours: ExtendedHours;
  onSetTime: (childTime: ValidTime) => void;
  role: string;
  sodtarr: (number | null)[];
}
const EarliestPickup = ({ hours, onSetTime, role, sodtarr }: Props) => {
  console.log("beans", hours);
  const [sodt, setSodt] = useState(60);
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null); //datetime calculated on page load, that takes all of coops hours, anbd finds next available time that they can sell.
  const [earliestPickupTime, setEarliestPickupTime] = useState<string | null>( // stringified version of nextacvailableTime
    null
  );
  useEffect(() => {
    calculateEarliestPickupTime();
    if (sodtarr[1] === null && sodtarr[0] === null) {
    } else if (
      sodtarr[1] !== null &&
      sodtarr[0] !== null &&
      sodtarr[0] >= sodtarr[1]
    ) {
      setSodt(sodtarr[0]);
    } else if (
      sodtarr[1] !== null &&
      sodtarr[0] !== null &&
      sodtarr[1] >= sodtarr[0]
    ) {
      setSodt(sodtarr[1]);
    }
  }, []);

  const calculateEarliestPickupTime = () => {
    const now = new Date();
    const currentDayIndex = (now.getDay() + 6) % 7; // Convert Sunday-Saturday to Monday-Sunday
    const currentMin = now.getHours() * 60 + now.getMinutes();
    let nextAvailableTime = null;

    for (let i = 0; i < 7; i++) {
      const newHoursIndex = ((currentDayIndex + i) % 7) as keyof ExtendedHours;
      const newHours = hours[newHoursIndex];

      if (newHours === null || (newHours && newHours.length === 0)) {
        continue; // Skip to the next day if the seller is closed or has no hours
      }

      let foundSlot = false;

      if (i === 0) {
        // Check if the buyer is buying on the same day as the seller's hours
        let foundSlotOnSameDay = false;

        for (const hourSlot of newHours) {
          const openTime = hourSlot.open;
          const closeTime = hourSlot.close;

          if (currentMin < openTime) {
            // If the buyer is buying before the seller's current open slot
            if (openTime - currentMin >= 30) {
              // If the time difference is 30 minutes or more, set the pickup time to the seller's opening time
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
          } else if (currentMin >= openTime && currentMin + sodt < closeTime) {
            // If the buyer is buying within the seller's current open slot and the current time plus buffer time is before the closing time
            nextAvailableTime = new Date(now);
            const futureMin = currentMin + sodt;
            const futureHours = Math.floor(futureMin / 60);
            const futureMinutes = futureMin % 60;
            nextAvailableTime.setHours(futureHours, futureMinutes, 0, 0); // Set the pickup time to the current time plus 40 minutes (30 minutes + 10 minutes buffer)
            foundSlotOnSameDay = true;
            break;
          }
        }

        if (foundSlotOnSameDay) {
          foundSlot = true;
          break;
        }
      } else {
        // Set the pickup time to the seller's opening time on the next available day
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
      return null;
    }

    const formattedEarliestTime = formatPickupTime({
      pickupTime: nextAvailableTime,
    });
    setEarliestPickupTime(formattedEarliestTime);

    return nextAvailableTime;
  };
  useEffect(() => {
    const nextAvailableTime = calculateEarliestPickupTime();
    setNextAvailableTime(nextAvailableTime);
  }, []);

  const handleAsSoonAsPossible = () => {
    if (nextAvailableTime) {
      onSetTime({ pickupTime: nextAvailableTime });
    }
  };

  const formatPickupTime = (selectedTimer: ValidTime) => {
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
            ? `This Producer has not provided their hours. Please contact them for more
                  information.`
            : `This co-op has not provided their hours. Please contact them for more
                  information.`}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card onClick={handleAsSoonAsPossible} className="bg-inherit border-none">
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
          {earliestPickupTime || "not available"}
        </span>
      </CardContent>
    </Card>
  );
};

export default EarliestPickup;
