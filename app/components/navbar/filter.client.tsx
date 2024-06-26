"use client";
//filters sidebar popover component
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import FiltersIcon from "../icons/filters-icon";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Outfit } from "next/font/google";
import { UserRole } from "@prisma/client";
import { GiFruitTree } from "react-icons/gi";
import { IoStorefrontOutline } from "react-icons/io5";
import { ClockIcon } from "@radix-ui/react-icons";
import { BsPersonWalking } from "react-icons/bs";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { Checkbox } from "../ui/checkbox";
import { navUser } from "@/next-auth";

interface Props {
  user?: navUser;
}

const outfit = Outfit({
  subsets: ["latin-ext"],
  display: "block",
});
const Filters = ({ user }: Props) => {
  const [radius, setRadius] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const r = searchParams?.get("radius");
  const lat = searchParams?.get("lat");
  const rMi = r ? Math.round(parseFloat(r) * 0.621371 * 10) / 10 : 0;
  const [p, setP] = useState(searchParams?.get("p") === "true");
  const [c, setC] = useState(searchParams?.get("c") === "true");
  const [s, setS] = useState(searchParams?.get("s") === "f");
  const [l, setL] = useState(false);
  const handleSeeListings = () => {
    const params = new URLSearchParams(searchParams?.toString());
    const rKm = (radius / 0.621371).toFixed(1);
    params.set("radius", rKm);
    if (rMi === 0) {
      params.delete("radius");
    }
    if (p) {
      params.set("p", "t");
    } else {
      params.delete("p");
    }
    if (l) {
      params.delete("lat");
      params.delete("lng");
      params.delete("radius");
    }
    if (c) {
      params.set("c", "t");
    } else {
      params.delete("c");
    }

    if (s) {
      params.set("s", "f");
    } else {
      params.delete("s");
    }
    router.push(`/market?${params.toString()}`);
  };
  return (
    <Sheet>
      <SheetTrigger className="flex flex-row border-[1px] border-gray-500 rounded-full px-2 py-2 bg-transparent">
        <FiltersIcon /> Filters
      </SheetTrigger>
      <SheetContent
        side="left"
        className={`${outfit.className} w-screen sm:w-3/4 md:w-1/2 2xl:w-1/5 px-2 sm:px-4 flex flex-col text-zinc-700 sheet`}
      >
        <SheetHeader className="pt-12 text-4xl font-extralight">
          Filters
        </SheetHeader>
        {lat && (
          <Slider
            min={1}
            max={50}
            step={0.5}
            className="px-2"
            value={[radius || rMi]}
            onValueChange={(value: number[]) => setRadius(value[0])}
          />
        )}

        <>
          {!user ||
            (user.role !== UserRole.CONSUMER && (
              <>
                <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
                  <Switch checked={c} onCheckedChange={setC} />
                  <IoStorefrontOutline /> See Co-op Listings
                </div>
                <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
                  <Switch checked={p} onCheckedChange={setP} />
                  <GiFruitTree /> See Producer Listings
                </div>
              </>
            ))}
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Switch checked={s} onCheckedChange={setS} />
            <ClockIcon /> Not in stock or Coming Soon
          </div>
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Switch />
            <BsPersonWalking /> Pick Produce Myself
          </div>
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Checkbox />
            <LiaMapMarkedAltSolid /> Remove location input
          </div>
        </>

        <SheetTrigger
          onClick={handleSeeListings}
          className="flex w-full font-extralight text-xl bg-slate-500 text-center justify-center text-white p-3 rounded-full shadow-lg"
        >
          See Listings
        </SheetTrigger>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
