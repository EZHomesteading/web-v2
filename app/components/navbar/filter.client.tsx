"use client";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import FiltersIcon from "../icons/filters-icon";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Outfit } from "next/font/google";
import { UserRole } from "@prisma/client";

interface Props {
  user?: any;
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
  const handleSeeListings = () => {
    const params = new URLSearchParams(searchParams?.toString());
    const rKm = (radius / 0.621371).toFixed(1);
    params.set("radius", rKm);
    if (p) {
      params.set("p", "true");
    } else {
      params.delete("p");
    }

    if (c) {
      params.set("c", "true");
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
        className={`${outfit.className} w-screen sm:w-1/2 md:w-1/3 2xl:w-1/5 px-2 sm:px-4 flex flex-col text-zinc-600 sheet`}
      >
        <SheetHeader className="pt-12 text-4xl">Filters</SheetHeader>
        {lat && (
          <Slider
            min={1}
            max={50}
            step={0.5}
            className="px-2"
            value={[radius || rMi]}
            onValueChange={(value: any) => setRadius(value[0])}
          />
        )}

        <>
          {!user ||
            (user.role !== UserRole.CONSUMER && (
              <>
                <div className="w-full flex items-center gap-x-2">
                  <Switch checked={c} onCheckedChange={setC} />
                  See Co-op Listings
                </div>
                <div className="w-full flex items-center gap-x-2">
                  <Switch checked={p} onCheckedChange={setP} />
                  See Producer Listings
                </div>
              </>
            ))}
          <div className="w-full flex items-center gap-x-2">
            <Switch checked={s} onCheckedChange={setS} />
            Not in stock or Coming Soon
          </div>
          <div className="w-full flex items-center gap-x-2">
            <Switch />
            Pick Produce Myself
          </div>
        </>

        <SheetTrigger onClick={handleSeeListings}>See Listings</SheetTrigger>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
