"use client";
//  modified date picker layout for buy now button. skips cart page altogether.
import { SheetCartC, SheetContentC } from "@/app/components/ui/reservePicker";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { SheetTrigger } from "@/app/components/ui/sheet";
import { useState } from "react";
import { ExtendedHours } from "@/next-auth";
import "react-datetime-picker/dist/DateTimePicker.css";
import { Outfit } from "next/font/google";
import CustomTimeModal2 from "./CustomTimeModal2";
import { Button } from "../../../../components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SoonExpiryModal from "./soonExpiryModal";
import { addDays, format } from "date-fns";

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
  user: any;
  sodt: any;
}

const DateState2 = ({
  hours,
  listing,
  quantity,
  quantityType,
  disabled,
  sodt,
  user,
}: StatusProps) => {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<any>(); //users selected time
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  let body: any = [];

  const shelfLife = (listing: any) => {
    const adjustedListing = {
      ...listing,
      createdAt: new Date(listing.createdAt),
      endDate:
        listing.shelfLife !== -1
          ? addDays(new Date(listing.createdAt), listing.shelfLife)
          : null,
    };

    const shelfLifeDisplay = adjustedListing.endDate
      ? `Estimated Expiry Date: ${format(
          adjustedListing.endDate,
          "MMM dd, yyyy"
        )}`
      : "This product is non-perisable";
    return shelfLifeDisplay;
  };
  function convertToDate(dateString: string) {
    const datePart = dateString.split(": ")[1];
    const dateObj = new Date(datePart);
    return dateObj;
  }
  const expiry = convertToDate(shelfLife(listing));
  const handleTimer = async (childTime: any) => {
    sessionStorage.setItem("ORDER", "");

    setSelectedTime(childTime);

    await body.push({
      userId: listing.user.id,
      listingIds: [listing.id],
      pickupDate: childTime.pickupTime,
      quantity: `[{\"id\":\"${listing.id}\",\"quantity\":${quantity}}]`,
      totalPrice: quantity * listing.price,
      status: 0,
    });
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const percentExpiry = new Date(
      now.getTime() + listing.shelfLife * 0.3 * 24 * 60 * 60 * 1000
    );
    if (expiry < now) {
      setTimeOpen(true);
      return;
    } else if (expiry < threeDaysLater) {
      setTimeOpen(true);
      return;
    } else if (expiry < percentExpiry) {
      setTimeOpen(true);
      return;
    }
    const post = async () => {
      await axios.delete(`/api/cart`);
      try {
        await axios.post(`/api/cart/${listing.id}`, {
          quantity: quantity,
          pickup: null,
        });
      } catch (err: any) {
        toast.error(err.response.data.error);
        return;
      }
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
      <SoonExpiryModal
        isOpen={timeOpen}
        onClose={() => setTimeOpen(false)}
        listing={listing}
        quantity={quantity}
        expiry={expiry}
        childTime={selectedTime}
      />
      <CustomTimeModal2
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        hours={hours}
        onSetTime={handleTimer}
        user={user}
      />
      <SheetTrigger className="w-full">
        <Button
          disabled={disabled}
          onClick={() => {
            if (!user) {
              let callbackUrl = window.location.href;
              const encodedCallbackUrl = encodeURIComponent(callbackUrl);

              router.push(`/auth/login?callbackUrl=${encodedCallbackUrl}`);
              return;
            }
          }}
          className="w-full mt-1 bg-green-400 hover:bg-green-700"
        >{`Buy ${quantity} ${quantityType} Now`}</Button>
      </SheetTrigger>
      <SheetContentC
        side="top"
        className="border-none h-screen w-screen bg-transparent flex flex-col lg:flex-row justify-center lg:justify-evenly items-center"
        hours={hours}
        onSetTime={handleTimer}
        sodt={sodt}
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
