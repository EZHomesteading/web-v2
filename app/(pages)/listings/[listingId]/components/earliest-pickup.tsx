"use client";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { ExtendedHours } from "@/next-auth";
import { Outfit } from "next/font/google";
import { useEffect, useState } from "react";
const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  hours: ExtendedHours;

  onSetTime: any;
}
const EarliestPickup2 = ({ hours, onSetTime }: Props) => {
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null); //datetime calculated on page load, that takes all of coops hours, anbd finds next available time that they can sell.
  const [earliestPickupTime, setEarliestPickupTime] = useState<string | null>( // stringified version of nextacvailableTime
    null
  );
  useEffect(() => {
    calculateEarliestPickupTime();
  }, []);

  const calculateEarliestPickupTime = () => {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    let nextAvailableTime = null;
    //console.log("user time in minutes:", currentMin);
    for (let i = 0; i < 7; i++) {
      const newHoursIndex = ((now.getDay() + i) % 7) as keyof ExtendedHours;
      //console.log("index", newHoursIndex);
      const newHours = hours[newHoursIndex];

      if (newHours === null) {
        continue; //skips to next day if the co-op is closed
      }

      if (newHours && newHours.length === 0) continue;

      const openTime = newHours ? newHours[0].open : 0; // time the co-op opens on the day
      const closeTime = newHours ? newHours[0].close : 0; // time the co-op closes on the day
      //console.log("open time for co-op", openTime);
      //console.log("closing time for co-op", closeTime);

      if (i === 0 && currentMin < closeTime) {
        // if the user is trying to buy today and before the co-op is closed, proceed
        if (currentMin < openTime) {
          // if the user is trying to buy today and before the co-op is open, pick up is when the co-op opens plus 30 minutes
          // we will need another check here that if the time difference between co-op open time and order time is less than the co-ops set out time, the pick up time is the order time plus set out time
          //console.log("entered case 1");
          nextAvailableTime = new Date(now);
          nextAvailableTime.setHours(
            Math.floor(openTime / 60),
            openTime % 60,
            0,
            0
          );
          nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + 30);
        } else {
          // if the user is buying today after the co-op has opened but before they close, the pick up is now plus the set out time
          //console.log("entered case 2");
          nextAvailableTime = new Date(now);
          nextAvailableTime.setMinutes(now.getMinutes() + 30);
        }
        break;
      } else if (i > 0) {
        //console.log("entered case 3");
        nextAvailableTime = new Date(now);
        nextAvailableTime.setDate(now.getDate() + i);
        if (newHours) {
          nextAvailableTime.setHours(
            Math.floor(newHours[0].open / 60),
            newHours[0].open % 60,
            0,
            0
          );
        }
        nextAvailableTime.setMinutes(nextAvailableTime.getMinutes() + 30);
        break;
      }
    }
    if (nextAvailableTime) {
      const formattedEarliestTime = formatPickupTime({
        pickupTime: nextAvailableTime,
      });
      setEarliestPickupTime(formattedEarliestTime);
    }

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
    //console.log(nextAvailableTime);
  };

  const formatPickupTime = (selectedTimer: any) => {
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
  return (
    <Card onClick={handleAsSoonAsPossible} className="bg-inherit border-none">
      <CardHeader
        className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
      >
        Pickup as soon as possible
      </CardHeader>
      <CardContent className={`${outfit.className}`}>
        In a hurry? The earliest possible time for pickup from this co-op is{" "}
        <span className={`${outfit.className} text-lg`}>
          {earliestPickupTime || "loading..."}
        </span>
      </CardContent>
    </Card>
  );
};

export default EarliestPickup2;
