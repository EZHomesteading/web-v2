"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/app/(nav_market_layout)/market/_components/radius-slider";
import { Switch } from "@/components/ui/switch";
import FiltersIcon from "@/components/navbar/icons/filters-icon";
import { IoStorefrontOutline } from "react-icons/io5";
import { ClockIcon } from "@radix-ui/react-icons";
import { BsPersonWalking } from "react-icons/bs";
import { GiFruitTree, GiFruiting } from "react-icons/gi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { outfitFont } from "@/components/fonts";

interface Props {
  role?: UserRole;
}

const Filters = ({ role }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let r = searchParams?.get("radius")
    ? parseInt(searchParams.get("radius") || "")
    : null;

  const [radius, setRadius] = useState(r);
  const [isOpen, setIsOpen] = useState(false);

  const handleSeeListings = () => {
    const params = new URLSearchParams(searchParams?.toString());
    const radiusInMeters = radius?.toFixed(1) || "10";
    params.set("radius", radiusInMeters);
    router.push(`/market?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="p-3 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <FiltersIcon />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-y-40 inset-x-2 sm:inset-x-10 xl:inset-x-20  bg-white rounded-lg shadow-lg flex flex-col w-calc(100vw-1rem) sm:max-w-xl px-4 py-6 z-50 ${outfitFont.className}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">Filters</h2>
                <button onClick={() => setIsOpen(false)}>
                  <FiltersIcon />
                </button>
              </div>
              {r && (
                <div className="mt-4">
                  <Slider
                    min={1}
                    max={50}
                    step={0.5}
                    value={[radius || 10]}
                    onValueChange={(value: number[]) => setRadius(value[0])}
                  />
                </div>
              )}

              {!role || role !== UserRole.CONSUMER ? (
                <>
                  <div className="mt-4 flex items-center gap-x-2 font-medium">
                    <Switch className={`bg-emerald-950/70`} />
                    <IoStorefrontOutline />
                    <span>See Co-op Listings</span>
                  </div>
                  <div className="mt-4 flex items-center gap-x-2  font-medium">
                    <Switch />
                    <GiFruitTree />
                    <span>See Producer Listings</span>
                  </div>
                </>
              ) : null}

              <div className="mt-4 flex items-center gap-x-2 font-medium">
                <Switch />
                <ClockIcon />
                <span>Not in stock or Coming Soon</span>
              </div>

              <div className="mt-4 flex items-center gap-x-2 font-medium">
                <Switch />
                <BsPersonWalking />
                <span>Pick Produce Myself</span>
              </div>

              <div className="mt-4">
                <Select>
                  <SelectTrigger className={`font-medium`}>
                    <SelectValue
                      placeholder="Sort by Rating"
                      className={`font-medium`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value="high"
                        className={`${outfitFont.className}`}
                      >
                        High to Low
                      </SelectItem>
                      <SelectItem
                        value="low"
                        className={`${outfitFont.className}`}
                      >
                        Low to High
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <button
                onClick={handleSeeListings}
                className="mt-auto w-full bg-emerald-950/70 text-white rounded-lg py-4 px-3 text-lg font-semibold"
              >
                See Listings
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Filters;
