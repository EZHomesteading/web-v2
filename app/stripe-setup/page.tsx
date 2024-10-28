//onboarding parent element
import Onboarding from "./stripesetup";
import { Viewport } from "next";
import authCache from "@/auth-cache";
import Stripe from "stripe";
import { getLocationByIndex, getUserLocations } from "@/actions/getUser";
import Link from "next/link";
import { o } from "../selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import { outfitFont } from "../components/outfit.font";
import { LocationEZH } from "next-auth";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const apiKey = process.env.MAPS_KEY;

const Page = async () => {
  const session = await authCache();
  if (!session?.user.id) {
    return;
  }

  console.log(session?.user);
  return (
    <>
      <>{session?.user && <Onboarding user={session?.user} />}</>
    </>
  );
};

export default Page;
