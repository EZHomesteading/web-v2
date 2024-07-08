"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { addDays } from "date-fns";
import { useState } from "react";
import SoonExpiryModal from "./soonExpiryModal";
import { CartItem, Location } from "@/actions/getCart";
import { checkoutTime } from "../client";
import { FinalListing } from "@/actions/getListings";
dayjs.extend(utc);

interface Create {
  cartItems: CartItem[];
  pickupArr: checkoutTime[] | undefined;
  stillExpiry: boolean;
}

export type AdjustedListings = {
  listingId: string;
  title: string;
  sellerName: string;
  expiry: Date | null;
  soonValue: number;
};

const OrderCreate = ({ cartItems, pickupArr, stillExpiry }: Create) => {
  let expiredArray: AdjustedListings[] = [];
  const [confirmOpen, setConfirmOpen] = useState(false);
  sessionStorage.setItem("ORDER", "");
  const router = useRouter();
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const shelfLife = (listing: FinalListing) => {
    const adjustedListing = {
      ...listing,
      createdAt: new Date(listing.createdAt),
      endDate:
        listing.shelfLife !== -1
          ? addDays(new Date(listing.createdAt), listing.shelfLife)
          : null,
    };

    return adjustedListing.endDate;
  };

  cartItems.map(async (cartItem: CartItem) => {
    const percentExpiry = new Date(
      now.getTime() + cartItem.listing.shelfLife * 0.3 * 24 * 60 * 60 * 1000
    );
    const expiry = shelfLife(cartItem.listing);
    const adjustedListings = {
      listingId: cartItem.listing.id,
      title: cartItem.listing.title,
      sellerName: cartItem.listing.user.name,
      expiry: expiry,
      soonValue: 3,
    };

    if (expiry && expiry < now) {
      expiredArray.push(adjustedListings);
      return;
    } else if (expiry && expiry < threeDaysLater) {
      adjustedListings.soonValue = 1;
      expiredArray.push(adjustedListings);
      return;
    } else if (expiry && expiry < percentExpiry) {
      adjustedListings.soonValue = 2;
      expiredArray.push(adjustedListings);
      return;
    }
  });

  const createOrder = () => {
    const body: {
      userId: string;
      location: Location;
      listingIds: string[];
      pickupDate: Date;
      quantity: string;
      totalPrice: number;
      status: number;
      stripePaymentIntentId?: string;
    }[] = [];
    let currentpickuparr: checkoutTime | null = null;
    let prevUserId: string | null = null;
    let userItems: CartItem[] = [];
    let prevLocation: Location | null = null;

    const findObjectWithCartIndex = (
      arr: checkoutTime[],
      targetCartIndex: number
    ) => {
      let foundObject = null;

      arr.forEach((obj: checkoutTime) => {
        if (obj.cartIndex === targetCartIndex) {
          foundObject = obj;
        }
      });

      return foundObject;
    };

    cartItems.forEach(async (cartItem: CartItem, index: number) => {
      if (
        cartItem.listing.userId !== prevUserId ||
        cartItem.listing.location.address[0] !== prevLocation?.address[0]
      ) {
        if (prevUserId !== null) {
          const summedTotalPrice = userItems.reduce(
            (acc: number, curr: CartItem) =>
              acc + curr.listing.price * curr.quantity,
            0
          );

          const allListings = userItems.reduce(
            (acc: string[], curr: CartItem) => {
              if (!acc.includes(curr.listing.id.toString())) {
                return [...acc, curr.listing.id.toString()];
              }
              return acc;
            },
            [] as string[]
          );

          const quantities = allListings.map((listingId: string) => {
            const listingQuantity = userItems.reduce(
              (acc: number, curr: CartItem) =>
                curr.listing.id.toString() === listingId
                  ? acc + curr.quantity
                  : acc,
              0
            );
            return { id: listingId, quantity: listingQuantity };
          });
          if (prevLocation && currentpickuparr?.pickupTime) {
            body.push({
              userId: prevUserId,
              location: prevLocation,
              listingIds: allListings,
              pickupDate: currentpickuparr!.pickupTime,
              quantity: JSON.stringify(quantities),
              totalPrice: summedTotalPrice,
              status: 0,
              stripePaymentIntentId: "teststring",
            });
          }
        }
        currentpickuparr = findObjectWithCartIndex(pickupArr!, index);
        prevUserId = cartItem.listing.user.id;
        prevLocation = cartItem.listing.location;
        userItems = [cartItem];
      } else {
        userItems.push(cartItem);
      }
    });

    if (userItems.length > 0 && pickupArr && pickupArr.length > 0) {
      const summedTotalPrice = userItems.reduce(
        (acc: number, curr: CartItem) =>
          acc + curr.listing.price * curr.quantity,
        0
      );

      const allListings = userItems.reduce((acc: string[], curr: CartItem) => {
        if (!acc.includes(curr.listing.id.toString())) {
          return [...acc, curr.listing.id.toString()];
        }
        return acc;
      }, []);

      const quantities = allListings.map((listingId: string) => {
        const listingQuantity = userItems.reduce(
          (acc: number, curr: CartItem) =>
            curr.listing.id.toString() === listingId
              ? acc + curr.quantity
              : acc,
          0
        );
        return { id: listingId, quantity: listingQuantity };
      });

      const pickupTime = pickupArr[pickupArr.length - 1].pickupTime;

      if (pickupTime) {
        let pickupDate: Date;

        if (pickupTime instanceof Date) {
          pickupDate = pickupTime;
        } else if (
          typeof pickupTime === "string" ||
          typeof pickupTime === "number"
        ) {
          pickupDate = new Date(pickupTime);
        } else {
          console.error("Invalid pickup time:", pickupTime);
          return; // or handle this case as appropriate
        }

        if (!isNaN(pickupDate.getTime())) {
          body.push({
            userId: prevUserId!,
            location: prevLocation!,
            listingIds: allListings,
            pickupDate: pickupDate,
            quantity: JSON.stringify(quantities),
            totalPrice: summedTotalPrice,
            status: 0,
          });
        } else {
          console.error("Invalid pickup date:", pickupDate);
          // Handle the error case, maybe throw an error or set a default date
        }
      } else {
        console.error("Pickup time is undefined");
        // Handle the case where pickup time is undefined
      }
    } else {
      console.error("No user items or pickup times available");
      // Handle the case where there are no user items or pickup times
    }

    const post = async () => {
      const response = await axios.post(
        "/api/useractions/checkout/create-order",
        body
      );
      const datas = response.data;
      await datas.forEach((data: { id: string }) => {
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

  const handleFail = () => {
    toast.error("Some of the items in your cart may not be in stock", {
      duration: 2000,
      position: "bottom-right",
      className:
        "flex items-center justify-between p-4 bg-green-500 text-white rounded-lg shadow-md",
    });
  };

  const handleFailure = () => {
    toast.error("Some of the items in your cart do not have pickup times set", {
      duration: 2000,
      position: "bottom-right",
      className:
        "flex items-center justify-between p-4 bg-green-500 text-white rounded-lg shadow-md",
    });
  };

  sessionStorage.setItem("Order", "");
  const stock = cartItems.some((item: CartItem) => item.listing.stock <= 0);

  if (stillExpiry === true) {
    return (
      <div>
        <Button
          onClick={handleFailure}
          className="bg-red-300 text-black hover:text-white hover:bg-red-600 shadow-md hover:shadow-xl hover:cursor-not-allowed w-full"
        >
          Unable to Checkout
        </Button>
      </div>
    );
  } else if (stock === true) {
    return (
      <div>
        <Button
          onClick={handleFail}
          className="bg-red-300 text-black hover:text-white hover:bg-red-600 shadow-md hover:shadow-xl hover:cursor-not-allowed w-full"
        >
          Unable to Checkout
        </Button>
      </div>
    );
  } else if (expiredArray.length !== 0) {
    return (
      <div>
        <SoonExpiryModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          expiryArr={expiredArray}
          createOrder={createOrder}
        />
        <Button
          onClick={() => setConfirmOpen(true)}
          className="bg-green-300 text-black hover:text-white hover:bg-green-600 shadow-md hover:shadow-xl hover:cursor-not-allowed w-full"
        >
          Checkout
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <Button
          onClick={createOrder}
          className="bg-green-300 text-black hover:text-white hover:bg-green-600 shadow-md hover:shadow-xl w-full"
        >
          Checkout
        </Button>
      </div>
    );
  }
};
export default OrderCreate;
