"use client";
//payout button component
import axios from "axios";
import { Button } from "@/app/components/ui/button";
interface p {
  stripeAccountId?: string;
  totalSales?: number;
  userId: string;
  totalPaidOut: number;
}
const PayoutButton = ({
  stripeAccountId,
  totalPaidOut,
  totalSales,
  userId,
}: p) => {
  const handlePayout = async () => {
    try {
      axios.post("/api/stripe/payout", {
        stripeAccountId: stripeAccountId,
        totalPaidOut: totalPaidOut,
        totalSales: totalSales,
        userId: userId,
      });
    } catch (error) {
      console.error("Error with payout", error);
    }
  };
  return (
    <>
      <Button className="mt-2 " onClick={handlePayout}>
        Withdraw
      </Button>
    </>
  );
};

export default PayoutButton;
