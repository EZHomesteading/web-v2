"use client";
//filters sidebar popover component
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/app/(nav_market_layout)/market/_components/radius-slider";
import { Switch } from "@/components/ui/switch";
import FiltersIcon from "@/components/navbar/icons/filters-icon";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/components/ui/select";
import axios from "axios";
import { outfitFont } from "@/components/fonts";

interface Props {
  role?: UserRole;
}

const Filters = ({ role }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get radius in miles from searchParams, fallback to 10 miles if not set.
  let r = searchParams?.get("radius") || "10";
  const [radius, setRadius] = useState(parseInt(r, 10));
  const [listingCount, setListingCount] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  // Get latitude and longitude from searchParams.
  const lat = searchParams?.get("lat");
  const lng = searchParams?.get("lng");

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

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const minLoadingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (radius > 0 && lat && lng) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const fetchListingsCount = async () => {
          setLoading(true);

          try {
            const radiusInMeters = radius * 1609.34;

            const res = await axios.get(
              `/api/get/market/count?lat=${lat}&lng=${lng}&radius=${radiusInMeters}`
            );
            const data = await res;
            console.log(data);
            // setListingCount(data.count);

            minLoadingTimeout.current = setTimeout(() => {
              setLoading(false);
            }, 500);
          } catch (error) {
            console.error("Failed to fetch listings count:", error);
            setLoading(false);
          }
        };

        fetchListingsCount();
      }, 500);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (minLoadingTimeout.current) {
        clearTimeout(minLoadingTimeout.current);
      }
    };
  }, [radius, lat, lng]);

  const handleSeeListings = () => {
    const params = new URLSearchParams(searchParams?.toString());
    const radiusInMeters = (radius * 1609.34).toFixed(1);
    params.set("radius", radiusInMeters);

    if (radius === 0) {
      params.delete("radius");
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
        className={`${outfitFont.className} w-screen sm:w-3/4 md:w-1/2 2xl:w-1/5 px-2 sm:px-4 flex flex-col text-zinc-700 sheet`}
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
                className={`${outfitFont.className}`}
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
                className={`${outfitFont.className}`}
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
          {loading ? (
            <span className="flex items-center justify-center h-[28px]">
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </span>
          ) : (
            `See ${listingCount} Listings`
          )}
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
