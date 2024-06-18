"use client";
//order create component, called when cart and buy now button is succesfulkly clicked
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { addDays } from "date-fns";
import { useState } from "react";
import SoonExpiryModal from "./soonExpiryModal";
dayjs.extend(utc);

interface Create {
  cartItems: any;
  pickupArr: any;
  stillExpiry: boolean;
}

const OrderCreate = ({ cartItems, pickupArr, stillExpiry }: Create) => {
  let expiredArray: any = [];
  const [confirmOpen, setConfirmOpen] = useState(false);
  sessionStorage.setItem("ORDER", "");
  const router = useRouter();
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const shelfLife = (listing: any) => {
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

  cartItems.map(async (cartItem: any) => {
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

    if (expiry < now) {
      expiredArray.push(adjustedListings);
      //console.log(expiredArray);
      return;
    } else if (expiry < threeDaysLater) {
      adjustedListings.soonValue = 1;
      expiredArray.push(adjustedListings);
      ///console.log(expiredArray);
      return;
    } else if (expiry < percentExpiry) {
      adjustedListings.soonValue = 2;
      expiredArray.push(adjustedListings);
      //console.log(expiredArray);
      return;
    }
  });
  //console.log(expiredArray);

  const createOrder = () => {
    const body: any = [];
    let currentpickuparr: any = null;
    let prevUserId: any = null;
    let userItems: any = [];
    let prevLocation: any = null;
    const findObjectWithCartIndex = (arr: any, targetCartIndex: number) => {
      let foundObject = null;

      arr.forEach((obj: any) => {
        if (obj.cartIndex === targetCartIndex) {
          foundObject = obj;
        }
      });

      return foundObject;
    };
    cartItems.forEach(async (cartItem: any, index: number) => {
      //complex map of items in cart to produce accurate orders to be passed to the checkout forms.
      if (
        //if cart item has a different user or a different adress
        cartItem.listing.userId !== prevUserId ||
        cartItem.listing.location.address[0] !== prevLocation.address[0]
      ) {
        if (prevUserId !== null) {
          //if this is not the first item in the list
          //build the total price
          const summedTotalPrice = userItems.reduce(
            (acc: any, curr: any) => acc + curr.listing.price * curr.quantity,
            0
          );
          //map over all items in cart build an array of all listing id's with no repeats. from the user items array which is built after this if statement resolves
          const allListings = userItems.reduce((acc: any, curr: any) => {
            if (!acc.includes(curr.listing.id.toString())) {
              return [...acc, curr.listing.id.toString()];
            }
            return acc;
          }, []);

          //build the array of listing id's with their assosiated singular quantities. from the array of all listings
          const quantities = allListings.map((listingId: any) => {
            const listingQuantity = userItems.reduce(
              (acc: any, curr: any) =>
                curr.listing.id.toString() === listingId
                  ? acc + curr.quantity
                  : acc,
              0
            );
            return { id: listingId, quantity: listingQuantity };
          });
          //push new object data to the body
          body.push({
            userId: prevUserId,
            location: prevLocation,
            listingIds: allListings,
            pickupDate: currentpickuparr.pickupTime,
            quantity: JSON.stringify(quantities),
            totalPrice: summedTotalPrice,
            status: 0,
            stripePaymentIntentId: "teststring",
          });
        }
        currentpickuparr = findObjectWithCartIndex(pickupArr, index); //find pickup time value assosiated with this loop through the array, will not change the value if one is not found?
        //set previous values for next map. and grab the pickup time values for the object being built.
        prevUserId = cartItem.listing.user.id;
        prevLocation = cartItem.listing.location;
        userItems = [cartItem]; //add the current cart item into the user items array.
      } else {
        //handle pushing first item into the cartItems array
        userItems.push(cartItem);
      }
    });

    //Handle the last item because previous map only sets data based on previous item.
    if (userItems.length > 0) {
      //build the total price
      const summedTotalPrice = userItems.reduce(
        (acc: any, curr: any) => acc + curr.listing.price * curr.quantity,
        0
      );
      //map over all items in cart build an array of all listing id's with no repeats. from the user items array which is built after the previous map resolved
      const allListings = userItems.reduce((acc: any, curr: any) => {
        if (!acc.includes(curr.listing.id.toString())) {
          return [...acc, curr.listing.id.toString()];
        }
        return acc;
      }, []);
      //build the array of listing id's with their assosiated singular quantities. from the array of all listings
      const quantities = allListings.map((listingId: string) => {
        const listingQuantity = userItems.reduce(
          (acc: any, curr: any) =>
            curr.listing.id.toString() === listingId
              ? acc + curr.quantity
              : acc,
          0
        );
        return { id: listingId, quantity: listingQuantity };
      });
      //push data to the body object
      body.push({
        userId: prevUserId,
        location: prevLocation,
        listingIds: allListings,
        pickupDate: pickupArr[pickupArr.length - 1].pickupTime,
        quantity: JSON.stringify(quantities),
        totalPrice: summedTotalPrice,
        status: 0,
      });
    }
    const post = async () => {
      //post data to database/set order id's in the session storage for later use.
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
  const stock = cartItems.some((item: any) => item.listing.stock <= 0);

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
