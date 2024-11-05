"use client";
import { WishlistLocation } from "@/actions/getUser";
import { hasAvailableHours } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { outfitFont, zillaFont } from "@/components/fonts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orderMethod } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Wishlist_ID_Page } from "wishlist";

interface WishlistButtonsProps {
  wishlist: Wishlist_ID_Page;
  userLocs: WishlistLocation[] | null;
}
type ProposedLocation = {
  address: string[];
  coordinates: number[];
};
const WishlistButtons = ({ wishlist, userLocs }: WishlistButtonsProps) => {
  const router = useRouter();

  // Determine available order methods based on seller's hours
  const { hasPickup, hasDelivery, initialOrderMethod } = useMemo(() => {
    const hasPickup = hasAvailableHours(wishlist.location.hours?.pickup || []);
    const hasDelivery = hasAvailableHours(
      wishlist.location.hours?.delivery || []
    );

    let initialOrderMethod: orderMethod;
    if (hasPickup && hasDelivery) {
      initialOrderMethod = orderMethod.UNDECIDED;
    } else if (hasPickup) {
      initialOrderMethod = orderMethod.PICKUP;
    } else if (hasDelivery) {
      initialOrderMethod = orderMethod.DELIVERY;
    } else {
      initialOrderMethod = orderMethod.UNDECIDED;
    }

    return { hasPickup, hasDelivery, initialOrderMethod };
  }, [wishlist.location.hours]);

  const [wishlistState, setWishlistState] = useState<Wishlist_ID_Page>({
    ...wishlist,
    orderMethod: wishlist.orderMethod || initialOrderMethod,
  });

  const formatOrderMethodText = (method: orderMethod) => {
    if (method === orderMethod.UNDECIDED) return "How?";
    return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
  };

  const resetForm = () => {
    if (hasPickup && hasDelivery) {
      setWishlistState((prev) => ({
        ...prev,
        orderMethod: orderMethod.UNDECIDED,
        pickupDate: undefined,
        deliveryDate: undefined,
        proposedLoc: undefined,
      }));
    } else {
      setWishlistState((prev) => ({
        ...prev,
        pickupDate: undefined,
        deliveryDate: undefined,
        proposedLoc: undefined,
      }));
    }
  };

  const saveChanges = async () => {
    const updatedData = {
      id: wishlistState.id,
      proposedLoc: wishlistState.proposedLoc,
      deliveryDate: wishlistState.deliveryDate,
      pickupDate: wishlistState.pickupDate,
      orderMethod: wishlistState.orderMethod,
      items: wishlistState.items.map((item) => ({
        listingId: item.listing.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await axios.post("/api/wishlists/update", updatedData);
      if (res.status === 200) {
        toast.success("Wishlist was updated");
        router.refresh();
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="w-full overflow-x-auto my-3 flex justify-start items-center gap-x-2">
      {hasPickup && hasDelivery && (
        <Popover>
          <PopoverTrigger className="flex items-center justify-center rounded-full border px-3 py-2">
            {formatOrderMethodText(wishlistState.orderMethod)}
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-[600px]">
            <div
              className={`text-center font-semibold border-b pb-3 ${outfitFont.className}`}
            >
              Order Type
            </div>
            <div
              className={`${zillaFont.className} text-lg w-full flex flex-col gap-y-3 items-start justify-start text-start pt-3`}
            >
              <button
                className="flex justify-start items-center w-full"
                onClick={() =>
                  setWishlistState((prev) => ({
                    ...prev,
                    orderMethod: orderMethod.DELIVERY,
                    pickupDate: undefined,
                  }))
                }
              >
                <div
                  className={`rounded-full border p-[.4rem] ${
                    wishlistState.orderMethod === orderMethod.DELIVERY
                      ? "bg-black"
                      : "bg-white"
                  }`}
                >
                  <div className="rounded-full border bg-white p-1" />
                </div>
                <div className="ml-2">
                  I would like the order delivered to me
                </div>
              </button>
              <button
                className="flex justify-start items-center w-full"
                onClick={() =>
                  setWishlistState((prev) => ({
                    ...prev,
                    orderMethod: orderMethod.PICKUP,
                    deliveryDate: undefined,
                    proposedLoc: undefined,
                  }))
                }
              >
                <div
                  className={`rounded-full border p-[.4rem] ${
                    wishlistState.orderMethod === orderMethod.PICKUP
                      ? "bg-black"
                      : "bg-white"
                  }`}
                >
                  <div className="rounded-full border bg-white p-1" />
                </div>
                <div className="ml-2">I would like to pick up the order</div>
              </button>
              <div className="flex w-full justify-between">
                <button className="underline" onClick={resetForm}>
                  Reset
                </button>
                <button
                  className="rounded-full border px-2 py-1"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {wishlist.orderMethod === orderMethod.DELIVERY && (
        <Popover>
          <PopoverTrigger className="flex items-center justify-center rounded-full border px-3 py-2">
            {!wishlist.proposedLoc ? "Where?" : wishlist.proposedLoc.address[0]}
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-[600px]">
            <div
              className={`text-center font-semibold border-b pb-3 ${outfitFont.className}`}
            >
              Delivery Location
            </div>
            <div
              className={`${zillaFont.className} text-lg w-full flex flex-col gap-y-3 items-start justify-start text-start pt-3`}
            >
              {userLocs?.map((userLoc, index) => (
                <button
                  key={index}
                  className="flex justify-start items-center w-full"
                  onClick={() => {
                    if (userLoc.coordinates && userLoc.address) {
                      setWishlistState((prev) => ({
                        ...prev,
                        proposedLoc: {
                          address: userLoc.address,
                          coordinates: userLoc.coordinates,
                        } as ProposedLocation,
                      }));
                    }
                  }}
                >
                  <div
                    className={`rounded-full border p-[.4rem] ${
                      wishlistState.proposedLoc?.coordinates ===
                      userLoc.coordinates
                        ? "bg-black"
                        : "bg-white"
                    }`}
                  >
                    <div className="rounded-full border bg-white p-1" />
                  </div>
                  <div className="ml-2">
                    {userLoc && userLoc.address && <>{userLoc.address[0]}</>}
                  </div>
                </button>
              ))}
              <div className="flex w-full justify-between">
                <button
                  className="underline"
                  onClick={() =>
                    setWishlistState((prev) => ({
                      ...prev,
                      proposedLoc: undefined,
                    }))
                  }
                >
                  Reset Location
                </button>
                <button
                  className="rounded-full border px-2 py-1"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {((wishlist.orderMethod === orderMethod.DELIVERY &&
        wishlist.proposedLoc) ||
        wishlist.orderMethod === orderMethod.PICKUP) && (
        <Popover>
          <PopoverTrigger className="flex items-center justify-center rounded-full border px-3 py-2">
            {wishlist.orderMethod === orderMethod.DELIVERY
              ? wishlist.deliveryDate
                ? wishlist.deliveryDate.toString()
                : "When?"
              : wishlist.pickupDate
              ? wishlist.pickupDate.toString()
              : "When?"}
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-[600px]">
            <div
              className={`text-center font-semibold border-b pb-3 ${outfitFont.className}`}
            >
              {wishlistState.orderMethod === orderMethod.DELIVERY
                ? "Delivery Time"
                : "Pickup Time"}
            </div>
            <div
              className={`${zillaFont.className} text-lg w-full flex flex-col gap-y-3 items-start justify-start text-start pt-3`}
            >
              <div className="bg-slate-300 rounded-full p-2">
                <button
                  className={`rounded-full ${
                    !wishlistState.deliveryDate && !wishlistState.pickupDate
                      ? "bg-white border"
                      : ""
                  } py-1 px-2 mr-1`}
                  onClick={() => {
                    const now = new Date();
                    setWishlistState((prev) => ({
                      ...prev,
                      ...(prev.orderMethod === orderMethod.DELIVERY
                        ? { deliveryDate: now }
                        : { pickupDate: now }),
                    }));
                  }}
                >
                  As Soon as Possible
                </button>
                <button className="rounded-full py-1 px-2 mr-1">
                  Custom Time
                </button>
              </div>
              <div className="flex w-full justify-between">
                <button
                  className="underline"
                  onClick={() =>
                    setWishlistState((prev) => ({
                      ...prev,
                      deliveryDate: undefined,
                      pickupDate: undefined,
                    }))
                  }
                >
                  Reset Time
                </button>
                <button
                  className="rounded-full border px-2 py-1"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default WishlistButtons;
