"use client";

import { SheetCartC, SheetContentC } from "@/app/components/ui/reservePicker";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { SheetTrigger } from "@/app/components/ui/sheet";
import { useState } from "react";
import { CartGroup } from "@/next-auth";
import { ExtendedHours } from "@/next-auth";
import "react-datetime-picker/dist/DateTimePicker.css";
import { Outfit } from "next/font/google";
import CustomTimeModal2 from "./CustomTimeModal2";
import { Button } from "../../../../components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const outfit = Outfit({
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

interface StatusProps {
  hours: ExtendedHours;
  onSetTime: any;
  quantity: number;
  quantityType: string;
  disabled?: boolean;
  listing: any;
}

const DateState2 = ({
  hours,
  listing,
  quantity,
  quantityType,
  disabled,
}: StatusProps) => {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<any>(); //users selected time
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formatPickupTime = (selectedTime: any) => {
    if (!selectedTime) return "";

    const { pickupTime } = selectedTime;
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

  const handleTimer = (childTime: any) => {
    sessionStorage.setItem("ORDER", "");

    setSelectedTime(childTime);
    const body: any = [];

    body.push({
      userId: listing.user.id,
      listingIds: [listing.id],
      pickupDate: childTime.pickupTime,
      quantity: `[{\"id\":\"${listing.id}\",\"quantity\":${quantity}}]`,
      totalPrice: quantity * listing.price,
      status: 0,
    });
    console.log(body);

    const post = async () => {
      await axios.delete(`/api/cartUpdate`);
      await axios.post(`/api/cart/${listing.id}`, {
        quantity: quantity,
        pickup: null,
      });
      const response = await axios.post("/api/create-order", body);
      const datas = response.data;
      await datas.forEach((data: any) => {
        let store = sessionStorage.getItem("ORDER");
        if (store === null) {
          store = "";
        }
        let filteredStore = store.replace(/\[|\]/g, "");
        sessionStorage.setItem(
          "ORDER",
          `[${JSON.stringify(data.id)}` + "," + `${filteredStore}]`
        );
      });
      router.push("/checkout");
    };
    post();
  };

  return (
    <SheetCartC>
      <CustomTimeModal2
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        hours={hours}
        onSetTime={handleTimer}
      />
      <SheetTrigger className="w-full">
        <Button
          disabled={disabled}
          onClick={() => null}
          className="w-full mt-1 bg-green-400 hover:bg-green-700"
        >{`Buy ${quantity} ${quantityType} Now`}</Button>
      </SheetTrigger>
      <SheetContentC
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        hours={hours}
        onSetTime={handleTimer}
      >
        <div onClick={() => setConfirmOpen(true)} className="h-full w-full">
          <SheetTrigger className="h-full w-full">
            <Card className="bg-inherit border-none">
              <CardHeader
                className={`text-2xl 2xl:text-3xl pb-0 mb-0 ${outfit.className}`}
              >
                Set a custom pickup time{" "}
              </CardHeader>
              <CardContent className={`${outfit.className} mt-2`}>
                Not in a rush? Feel free to set a pick up anytime within the
                freshness window of your cart items and this co-op&apos;s open
                hours.
              </CardContent>
            </Card>
          </SheetTrigger>
        </div>
      </SheetContentC>
    </SheetCartC>
  );
};

export default DateState2;
