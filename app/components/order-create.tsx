"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Create {
  cartItems: any;
}

const OrderCreate = ({ cartItems }: Create) => {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState("");
  const createOrder = () => {
    const body: any = [];
    let prevUserId: any = null;
    let userItems: any = [];

    cartItems.forEach((cartItem: any) => {
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
      console.log(response.data);
      const datas = response.data;
      datas.forEach((data: any) => {
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
    };
    post();
  };
  sessionStorage.setItem("ORDER", "");

  return (
    <div>
      <button
        onClick={createOrder}
        className="w-full mt-20 rounded-md border border-transparent bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        Checkout
      </button>
    </div>
  );
};
export default OrderCreate;
