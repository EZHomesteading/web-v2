"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useEffect } from "react";

interface Create {
  cartItems: any;
  pickupArr: any;
  stillExpiry: boolean;
}

const OrderCreate = ({ cartItems, pickupArr, stillExpiry }: Create) => {
  const router = useRouter();
  const createOrder = () => {
    const body: any = [];
    let prevUserId: any = null;
    let userItems: any = [];

    cartItems.forEach((cartItem: any, index: number) => {
      //if index of pickup time matches index of cartitems map, set pickup time as user set pickup time.
      function findObjectWithCartIndex(arr: any, targetCartIndex: number) {
        let foundObject = null;

        arr.forEach((obj: any) => {
          if (obj.cartIndex === targetCartIndex) {
            foundObject = obj;
          }
        });

        return foundObject;
      }

      if ((index = pickupArr))
        if (cartItem.listing.userId !== prevUserId) {
          const currentpickuparr: any = findObjectWithCartIndex(
            pickupArr,
            index
          );
          if (currentpickuparr && currentpickuparr.expiry) {
            console.log("hello");
          } //stock=false};
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
              pickupDate: "2024-04-01T20:45:14.623+00:00",
              quantity: JSON.stringify(quantities),
              totalPrice: summedTotalPrice,
              status: "pending",
              stripePaymentIntentId: "teststring",
              conversationId: "660b1cda321d320d4fe69785",
            });
          }
          prevUserId = cartItem.listing.userId;
          userItems = [cartItem];
        } else {
          userItems.push(cartItem);
        }
    });

    // Handle the last user's items
    if (userItems.length > 0) {
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
            curr.listingId.toString() === listingId ? acc + curr.quantity : acc,
          0
        );
        return { id: listingId, quantity: listingQuantity };
      });

      body.push({
        userId: prevUserId,
        listingIds: allListings,
        pickupDate: "2024-04-01T20:45:14.623+00:00",
        quantity: JSON.stringify(quantities),
        totalPrice: summedTotalPrice,
        status: "pending",
        stripePaymentIntentId: "teststring",
        conversationId: "660b1cda321d320d4fe69785",
      });
    }

    const post = async () => {
      const response = await axios.post("/api/create-order", body);
      //console.log(response.data);
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
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    });
  };
  const handleFailure = () => {
    toast.error("Some of the items in your cart do not have pickup times set", {
      duration: 2000,
      position: "bottom-right",
      className:
        "flex items-center justify-between p-4 bg-green-500 text-white rounded-lg shadow-md",
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    });
  };
  sessionStorage.setItem("ORDER", "");
  const stock = cartItems.some((item: any) => item.listing.stock === 0);

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
