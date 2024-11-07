"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Basket_ID_Page } from "@/types/basket";
import { date } from "zod";

interface p {
  basket: Basket_ID_Page;
}
const MessageSeller = ({ basket }: p) => {
  const messageSellers = async () => {
    const now = new Date();
    console.log(basket);
    const params = {
      itemId: "672a5995ec6fff7a57cec43b",
      order: {
        pickupDate: now,
        quantity: { id: "672954ba1bb88919c84687da", quantity: 10 },
        totalPrice: 400,
        status: "PENDING",
        preferredLocationId: "67292cfa5f7005d487c47c46",
      },
      sellerId: "6729165df65c1ba881baa489",
      type: "delivery",
    };
    try {
      const OrderResponse = await axios.post("/api/chat/createOrder", params);

      console.log("order created successfully!", OrderResponse.data);
    } catch (error) {
      console.error("Error in the overall process:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
    }
  };
  return (
    <>
      <Button onClick={messageSellers} className={`w-full`}>
        Send Inquiry to Seller
      </Button>
    </>
  );
};

export default MessageSeller;
