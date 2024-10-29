"use client";
//payout button component
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface p {
  stripeAccountId?: string;
  total: number;
}
const PayoutButton = ({
  stripeAccountId,

  total,
}: p) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handlePayout = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/stripe/payout", {
        total: total,
        stripeAccountId: stripeAccountId,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error with payout", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <Button className="mt-2" onClick={handlePayout} disabled={isLoading}>
        {isLoading ? "Loading..." : "Withdraw"}
      </Button>
    </>
  );
};

export default PayoutButton;
