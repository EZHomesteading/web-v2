"use client";

import { Input } from "@/components/ui/input";
import { Location } from "@prisma/client";
import { UserInfo } from "next-auth";
import { useState } from "react";

interface p {
  listing: any;
  user?: UserInfo;
  locations: Location[] | null;
}

const SendMessageSection = ({ listing, user, locations }: p) => {
  const [quantity, setQuantity] = useState(listing.minOrder || 1);

  return (
    <>
      <div className={`border shadow-sm mt-3 rounded-md h-fit pb-6 pt-2 px-2`}>
        <div className={`text-xl font-semibold`}>Add to your Basket</div>
        <p className={`pb-4`}>
          ${listing.price} per {listing.quantityType}
        </p>

        <div
          className={` p-0 relative hover:cursor-pointer rounded-md border border-custom h-14       `}
        >
          <div
            className={`absolute top-1 text-xs text-neutral-700 left-1 font-medium`}
          >
            Quantity
          </div>
          <Input
            className={`w-full  focus-visible:ring-0 border-none p-8 pl-2 font-semibold `}
            type="number"
            maxLength={6}
            max={listing?.stock}
            inputMode="numeric"
            min={listing.minOrder || 1}
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </div>
        <button
          className={`w-full mt-4 rounded-md p-4 text-lg font-semibold shadow-sm bg-sky-100`}
        >
          Add {quantity ? quantity : 0} {listing?.quantityType} to Basket{" "}
        </button>
        <div className={`text-xs text-center mt-3`}>
          You will not be charged at this time
        </div>
      </div>
    </>
  );
};

export default SendMessageSection;
