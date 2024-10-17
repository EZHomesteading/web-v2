"use client";
//filters sidebar popover component
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Slider } from "./radius-slider";
import { Switch } from "../ui/switch";
import FiltersIcon from "../icons/filters-icon";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Outfit } from "next/font/google";
import { UserRole } from "@prisma/client";
import { GiFruitTree, GiFruiting } from "react-icons/gi";
import { IoStorefrontOutline } from "react-icons/io5";
import { ClockIcon } from "@radix-ui/react-icons";
import { BsPersonWalking } from "react-icons/bs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  role?: UserRole;
}

const outfit = Outfit({
  subsets: ["latin-ext"],
  display: "block",
});
const Filters = ({ role }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let r = searchParams?.get("radius");

  const [radius, setRadius] = useState(0);
  const lat = searchParams?.get("lat");

  const rMi = r ? Math.round(parseFloat(r) * 0.621371 * 10) / 10 : 0;
  const [p, setP] = useState(searchParams?.get("p") === "true");
  const [c, setC] = useState(searchParams?.get("c") === "true");
  const [s, setS] = useState(searchParams?.get("s") === "f");
  const [ra, setRa] = useState(searchParams?.get("ra"));
  const [pr, setPr] = useState(searchParams?.get("pr"));
  const [l, setL] = useState(false);
  useEffect(() => {
    const r = searchParams?.get("radius");
    if (r) {
      const newR = parseInt(r);
      setRadius(Math.round(newR * 0.621371 * 10) / 10);
    }
    setP(searchParams?.get("p") === "true");
    setC(searchParams?.get("c") === "true");
    setS(searchParams?.get("s") === "f");
    setRa(searchParams?.get("ra") || "");
    setPr(searchParams?.get("pr") || "");
  }, [searchParams]);
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
    if (ra) {
      params.set("ra", ra);
    }
    if (pr) {
      params.set("pr", pr);
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownOpenChange = useCallback((open: boolean) => {
    if (open) {
      setIsDropdownOpen(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 250); // 0.25 seconds delay
    }
  }, []);

  const handleSelectChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
    };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <Sheet>
      <SheetTrigger className="flex flex-row border-[1px] border-gray-500 rounded-full px-2 py-2 bg-transparent">
        <FiltersIcon />
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
            disabled={isDropdownOpen}
          />
        )}

        <>
          {!role ||
            (role !== UserRole.CONSUMER && (
              <>
                <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
                  <Switch
                    checked={c}
                    onCheckedChange={setC}
                    disabled={isDropdownOpen}
                  />
                  <IoStorefrontOutline /> See Co-op Listings
                </div>
                <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
                  <Switch
                    checked={p}
                    onCheckedChange={setP}
                    disabled={isDropdownOpen}
                  />
                  <GiFruitTree /> See Producer Listings
                </div>
              </>
            ))}
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Switch
              checked={s}
              onCheckedChange={setS}
              disabled={isDropdownOpen}
            />
            <ClockIcon /> Not in stock or Coming Soon
          </div>
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Switch disabled={isDropdownOpen} />
            <BsPersonWalking /> Pick Produce Myself
          </div>{" "}
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Select
              onValueChange={handleSelectChange(setRa)}
              onOpenChange={handleDropdownOpenChange}
            >
              <SelectTrigger className="w-[75px]">
                <SelectValue placeholder="" defaultValue={ra || "htl"} />
              </SelectTrigger>
              <SelectContent
                className={`${outfit.className}`}
                onClick={stopPropagation}
              >
                <SelectGroup>
                  <SelectItem value="htl">High to Low</SelectItem>
                  <SelectItem value="lth">Low to High</SelectItem>
                  <SelectItem value="5">Rating of 5</SelectItem>
                  <SelectItem value="4">Rating of 4</SelectItem>
                  <SelectItem value="3">Rating of 3</SelectItem>
                  <SelectItem value="2">Rating of 2</SelectItem>
                  <SelectItem value="1">Rating of 1</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <GiFruiting /> Sort EZH Organic Rating
          </div>
          <div className="w-full flex items-center gap-x-2 text-lg xl:text-[1rem] 2xl:text-xl font-medium">
            <Select
              onValueChange={handleSelectChange(setPr)}
              onOpenChange={handleDropdownOpenChange}
            >
              <SelectTrigger className="w-[75px]">
                <SelectValue placeholder="" defaultValue={pr || "htl"} />
              </SelectTrigger>
              <SelectContent
                className={`${outfit.className}`}
                onClick={stopPropagation}
              >
                <SelectGroup>
                  <SelectItem value="htl">High to Low</SelectItem>
                  <SelectItem value="lth">Low to High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <GiFruiting /> Sort by Price
          </div>
        </>

        <SheetTrigger
          onClick={handleSeeListings}
          className={`flex w-full font-extralight text-xl bg-slate-500 text-center justify-center text-white p-3 rounded-full shadow-lg ${
            isDropdownOpen ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isDropdownOpen}
        >
          See Listings
        </SheetTrigger>
        <SheetTrigger
          onClick={() => router.push("/market")}
          className={`flex w-full font-extralight text-xl bg-slate-500 text-center justify-center text-white p-3 rounded-full shadow-lg ${
            isDropdownOpen ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isDropdownOpen}
        >
          Clear Filters
        </SheetTrigger>
      </SheetContent>
    </Sheet>
  );
};

export default Filters;
