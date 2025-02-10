"use client";
//button to register user to stripe, giving them a stripe ID
import { UserInfo } from "next-auth";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Props {
  user?: UserInfo;
  label: string;
}
const StripeButton = ({ user, label }: Props) => {
  const stripe = async () => {
    try {
      await axios.post("/api/stripe/create-connected-account", {
        userId: user?.id,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (!user?.stripeAccountId) {
    return (
      <Link href="/onboard">
        <Button
          onClick={stripe}
          className="hover:bg-green-100 hover:text-black"
        >
          {label}
        </Button>
      </Link>
    );
  } else {
    return (
      <Link href="/onboard">
        <Button className="hover:bg-green-100 hover:text-black">{label}</Button>
      </Link>
    );
  }
};

export default StripeButton;
