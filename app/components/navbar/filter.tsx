"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import { UserRole } from "@prisma/client";
import FiltersIcon from "../ui/filters-icon";
import { UserInfo } from "@/next-auth";
import { Button } from "../ui/button";

interface Props {
  user?: UserInfo;
}
const Filters = ({ user }: Props) => {
  const [radius, setRadius] = useState(0);
  const [showCoops, setShowCoops] = useState(false);
  const [showProducers, setShowProducers] = useState(
    user?.role === UserRole.COOP
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const showRadiusSlider = searchParams?.get("lat") && searchParams?.get("lng");
  const r = searchParams?.get("radius");
  const rMi = r ? Math.round(parseFloat(r) * 0.621371 * 10) / 10 : 0;

  const handleSeeListings = () => {
    const params = new URLSearchParams(searchParams?.toString());
    const rKm = (radius / 0.621371).toFixed(1);
    params.set("radius", rKm);

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Sheet>
      <SheetTrigger className="absolte flex flex-row border-[1px] border-gray-500 rounded-full px-3 py-3 bg-white">
        <FiltersIcon /> Filters
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-screen sm:w-1/2 md:w-1/3 2xl:w-1/5 px-2 sm:px-4 flex flex-col"
      >
        <SheetHeader>Filters</SheetHeader>
        {showRadiusSlider && (
          <Slider
            min={1}
            max={50}
            step={0.5}
            className="px-2"
            value={[radius || rMi]}
            onValueChange={(value) => setRadius(value[0])}
          />
        )}
        {user?.role === UserRole.COOP && (
          <>
            <div>
              <Switch checked={showCoops} onCheckedChange={setShowCoops} />{" "}
              Co-ops
            </div>
            <div>
              <Switch
                checked={showProducers}
                onCheckedChange={setShowProducers}
              />{" "}
              Producers
            </div>
          </>
        )}
        {(user?.role !== UserRole.COOP || (showCoops && !showProducers)) && (
          <div>
            <Switch /> Pick Produce Myself
          </div>
        )}
        <SheetTrigger>
          <Button onClick={handleSeeListings}>See Listings</Button>
        </SheetTrigger>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
