"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface Create {
  cartItems: any;
  pickupArr: any;
  stillExpiry: boolean;
}

const OrderCreate = ({ cartItems, pickupArr, stillExpiry }: Create) => {
  sessionStorage.setItem("ORDER", "");
  const router = useRouter();
  const createOrder = () => {
    const body: any = [];
    let currentpickuparr: any = null;
    let prevUserId: any = null;
    let userItems: any = [];
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
      //if index of pickup time matches index of cartitems map, set pickup time as user set pickup time.

      if (cartItem.listing.userId !== prevUserId) {
        if (prevUserId !== null) {
          const summedTotalPrice = userItems.reduce(
            (acc: any, curr: any) => acc + curr.price,
            0
          );
          const allListings = userItems.reduce((acc: any, curr: any) => {
            if (!acc.includes(curr.listingId.toString())) {
              return [...acc, curr.listingId.toString()];
            }
            return acc;
          }, []);

          const quantities = allListings.map((listingId: string) => {
            const listingQuantity = userItems.reduce(
              (acc: any, curr: any) =>
                curr.listingId.toString() === listingId
                  ? acc + curr.quantity
                  : acc,
              0
            );
            return { id: listingId, quantity: listingQuantity };
          });
          body.push({
            userId: prevUserId,
            listingIds: allListings,
            pickupDate: currentpickuparr.pickupTime,
            quantity: JSON.stringify(quantities),
            totalPrice: summedTotalPrice,
            status: 0,
            stripePaymentIntentId: "teststring",
          });
        }
        currentpickuparr = findObjectWithCartIndex(pickupArr, index);
        prevUserId = cartItem.listing.user.id;
        userItems = [cartItem];
      } else {
        userItems.push(cartItem);
      }
    });

    //Handle the last user's items
    if (userItems.length > 0) {
      const summedTotalPrice = userItems.reduce(
        (acc: any, curr: any) => acc + curr.listing.price,
        0
      );
      //console.log(userItems);
      const allListings = userItems.reduce((acc: any, curr: any) => {
        console.log(curr.listing.id);
        if (!acc.includes(curr.listing.id.toString())) {
          return [...acc, curr.listing.id.toString()];
        }
        return acc;
      }, []);

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

      body.push({
        userId: prevUserId,
        listingIds: allListings,
        pickupDate: pickupArr[pickupArr.length - 1].pickupTime,
        quantity: JSON.stringify(quantities),
        totalPrice: summedTotalPrice,
        status: 0,
      });
    }

    const post = async () => {
      console.log(body);
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
  }

  if (stock === true) {
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
