"use client";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import FiltersIcon from "../icons/filters-icon";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  user?: any;
}
const Filters = ({ user }: Props) => {
  const [radius, setRadius] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const r = searchParams?.get("radius");
  const rMi = r ? Math.round(parseFloat(r) * 0.621371 * 10) / 10 : 0;

  const handleSeeListings = () => {
    const params = new URLSearchParams(searchParams?.toString());
    const rKm = (radius / 0.621371).toFixed(1);
    params.set("radius", rKm);

    router.push(`/market?${params.toString()}`);
  };
  return (
    <Sheet>
      <SheetTrigger className="flex flex-row border-[1px] border-gray-500 rounded-full px-2 py-2 bg-transparent">
        <FiltersIcon /> Filters
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-screen sm:w-1/2 md:w-1/3 2xl:w-1/5 px-2 sm:px-4 flex flex-col"
      >
        <SheetHeader>Filters</SheetHeader>

        <Slider
          min={1}
          max={50}
          step={0.5}
          className="px-2"
          value={[radius || rMi]}
          onValueChange={(value) => setRadius(value[0])}
        />
        <>
          <div>
            <Switch /> Co-ops
          </div>
          <div>
            <Switch /> Producers
          </div>
        </>
        <div>
          <Switch /> Pick Produce Myself
        </div>

        <SheetTrigger onClick={handleSeeListings}>See Listings</SheetTrigger>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
