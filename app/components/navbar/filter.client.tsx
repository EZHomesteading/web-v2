"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Slider } from "../ui/slider";

const FilterClient = () => {
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
    <>
      {" "}
      <Slider
        min={1}
        max={50}
        step={0.5}
        className="px-2"
        value={[20]}
        onValueChange={(value) => {}}
      />
    </>
  );
};

export default FilterClient;
