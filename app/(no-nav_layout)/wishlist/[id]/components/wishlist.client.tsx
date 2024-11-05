"use client";

import { WishlistLocation } from "@/actions/getUser";
import Map from "./map-wishlist";
import useMediaQuery from "@/hooks/media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { hasAvailableHours } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { outfitFont, zillaFont } from "@/components/fonts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orderMethod } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Wishlist_ID_Page } from "wishlist";
import { PiChatsCircleThin } from "react-icons/pi";

interface p {
  wishlist: any;
  userLocs: WishlistLocation[] | null;
  mk: string;
}
type ProposedLocation = {
  address: string[];
  coordinates: number[];
};
const WishlistClient = ({ wishlist, userLocs, mk }: p) => {
  const over_768px = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const [showSearchBar, setShowSearchBar] = useState(false);
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
  const [errorType, setErrorType] = useState<
    "undecided" | "location" | "deliveryDate" | "pickupDate" | null
  >(null);

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
        proposedLoc: null,
      }));
    } else {
      setWishlistState((prev) => ({
        ...prev,
        pickupDate: undefined,
        deliveryDate: undefined,
        proposedLoc: null,
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

  const messageSellers = async () => {
    if (handleErrors()) return;
    const now = new Date();
    const params = {
      itemId: "672a5995ec6fff7a57cec43b",
      order: {
        pickupDate: now,
        quantity: { id: "672954ba1bb88919c84687da", quantity: 10 },
        totalPrice: 400,
        status: "PENDING",
        preferredLocationId: "67292cfa5f7005d487c47c46",
      },
      sellerId: "6729165df65c1ba881baa489",
      type: "delivery",
    };
    try {
      const OrderResponse = await axios.post("/api/chat/createOrder", params);

      console.log("order created successfully!", OrderResponse.data);
    } catch (error) {
      console.error("Error in the overall process:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleErrors = () => {
    if (!wishlist) return false;

    if (isOrderMethodUndecided()) {
      toast.error(
        "Please select your preferred delivery method for this wishlist."
      );
      setErrorType("undecided");
      return true;
    } else if (isDeliveryWithoutLocation()) {
      toast.error("Please specify a delivery location for this wishlist.");
      setErrorType("location");
      return true;
    } else if (isDeliveryWithoutDate()) {
      toast.error("Please propose a preferred delivery date and time.");
      setErrorType("deliveryDate");
      return true;
    } else if (isPickupWithoutDate()) {
      toast.error("Please suggest a time when you can pick up this wishlist.");
      setErrorType("pickupDate");
      return true;
    }

    setErrorType(null);
    return false;
  };

  const isOrderMethodUndecided = () =>
    wishlist.orderMethod === orderMethod.UNDECIDED;
  const isDeliveryWithoutLocation = () =>
    wishlist.orderMethod === orderMethod.DELIVERY && !wishlist.proposedLoc;
  const isDeliveryWithoutDate = () =>
    wishlist.orderMethod === orderMethod.DELIVERY &&
    wishlist.proposedLoc &&
    !wishlist.deliveryDate;
  const isPickupWithoutDate = () =>
    wishlist.orderMethod === orderMethod.PICKUP && !wishlist.pickupDate;
  wishlist.orderMethod === orderMethod.PICKUP && !wishlist.pickupDate;
  return (
    <>
      <div
        className={`fixed top-2 md:w-[calc(100%/2)] w-[100%] sm:top-20 left-0 ml-1 sm:ml-3 md:ml-7 lg:ml-[3.75rem] 2xl:ml-[7.75rem] bg-white`}
      >
        <>
          <Link
            href={`/store/${wishlist?.location?.user?.url}/${wishlist?.location?.id}`}
            className={`hover:cursor-pointer text-4xl`}
          >
            {wishlist?.location?.displayName || wishlist?.location?.user?.name}
          </Link>
          <div className="w-full overflow-x-auto my-3 flex justify-start items-center gap-x-2">
            {" "}
            {!over_768px && (
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className={`flex items-center justify-center rounded-md border px-3 py-2 bg-black text-white `}
                  >
                    More Info
                  </button>
                </SheetTrigger>
                <SheetContent
                  side={`bottom`}
                  className={`h-[calc(100%-128px)] md:h-[calc(100%-180px)] rounded-t-xl pt-16 px-2 ${outfitFont.className}`}
                >
                  <div className="flex flex-col justify-between gap-2 w-full  h-fit">
                    <div className={`border rounded-xl shadow-md p-3 mb-2`}>
                      {[
                        {
                          label: "Proposed Pickup Date",
                          value: wishlist?.pickupDate?.toString() || "Not Set",
                        },
                        {
                          label: "Proposed Delivery Location",
                          value: wishlist?.proposedLoc?.address[0],
                        },
                        {
                          label: "Proposed Delivery Date",
                          value: wishlist?.pickupDate?.toString() || "Not Set",
                        },
                        {
                          label: "Notes",
                          value: "None",
                          isTruncated: true,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`${zillaFont.className} flex justify-between w-full items-start `}
                        >
                          <div className={`mb-3 font-semibold text-sm`}>
                            {item.label}
                          </div>
                          <div
                            className={`${
                              item.isTruncated ? "truncate max-w-[200px]" : ""
                            }  underline`}
                          >
                            {item.value}
                          </div>
                        </div>
                      ))}{" "}
                      <button
                        className={`border rounded-md p-3 w-full bg-cyan-200/40 shadow-md flex items-center justify-center `}
                        onClick={messageSellers}
                      >
                        Send Message to Seller
                      </button>
                    </div>
                  </div>
                  <div className={` rounded-t-md`}>
                    <Map
                      mk={mk}
                      showSearchBar={false}
                      maxZ={14}
                      minZ={10}
                      wishlistStyle={`h-[500px] w-full rounded-md shadow-md`}
                      // proposedLoc={{
                      //   lat: wishlist.proposedLoc.coordinates[1],
                      //   lng: wishlist.proposedLoc.coordinates[0],
                      // }}
                      // sellerLoc={{
                      //   lat: wishlist.proposedLoc.coordinates[1],
                      //   lng: wishlist.proposedLoc.coordinates[0],
                      // }}
                      center={{
                        lat: wishlist.location.coordinates[1],
                        lng: wishlist.location.coordinates[0],
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {hasPickup && hasDelivery && (
              <Popover>
                <PopoverTrigger
                  className={`flex items-center justify-center rounded-full border px-3 py-2 ${
                    errorType === "undecided" ? "borderRed" : ""
                  }`}
                >
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
                      <div className="ml-2">
                        I would like to pick up the order
                      </div>
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
                <PopoverTrigger
                  className={`flex items-center justify-center rounded-full border px-3 py-2 ${
                    errorType === "location" ? "borderRed" : ""
                  }`}
                >
                  {wishlist.proposedLoc === null
                    ? "Where?"
                    : wishlist?.proposedLoc?.address[0]}
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
                            userLoc?.address &&
                            wishlistState.proposedLoc?.address[0] ===
                              userLoc.address[0]
                              ? "bg-black"
                              : "bg-white"
                          }`}
                        >
                          <div className="rounded-full border bg-white p-1" />
                        </div>
                        <div className="ml-2">
                          {userLoc && userLoc.address && (
                            <>{userLoc.address[0]}</>
                          )}
                        </div>
                      </button>
                    ))}
                    <button className="flex justify-start items-center w-full">
                      <div
                        className={`rounded-full border p-[.4rem] ${"bg-white"}`}
                      >
                        <div className="rounded-full border bg-white p-1" />
                      </div>
                      <div className="ml-2">
                        <>Enter New Address</>
                      </div>
                    </button>
                    <div className="flex w-full justify-between">
                      <button
                        className="underline"
                        onClick={() =>
                          setWishlistState((prev) => ({
                            ...prev,
                            proposedLoc: null,
                          }))
                        }
                      >
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
            {((wishlist.orderMethod === orderMethod.DELIVERY &&
              wishlist.proposedLoc) ||
              wishlist.orderMethod === orderMethod.PICKUP) && (
              <Popover>
                <PopoverTrigger
                  className={`flex items-center justify-center rounded-full border px-3 py-2 ${
                    errorType === "deliveryDate" || errorType === "pickupDate"
                      ? "borderRed"
                      : ""
                  }`}
                >
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
                          !wishlistState.deliveryDate &&
                          !wishlistState.pickupDate
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
        </>
      </div>
      {over_768px ? (
        <div className="fixed right-0 top-2 sm:top-20 w-[calc(100%/2)] xl:w-[calc(100%/3)] px-1">
          <div className="flex flex-col justify-between gap-2 w-full  h-fit">
            <div className={`border rounded-md shadow-md p-3 mb-2`}>
              {[
                {
                  label: "Proposed Pickup Date",
                  value: wishlist?.pickupDate?.toString() || "Not Set",
                },
                {
                  label: "Proposed Delivery Location",
                  value: wishlist?.proposedLoc?.address[0],
                },
                {
                  label: "Proposed Delivery Date",
                  value: wishlist?.pickupDate?.toString() || "Not Set",
                },
                {
                  label: "Notes",
                  value: "None",
                  isTruncated: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${zillaFont.className} flex justify-between w-full items-start `}
                >
                  <div className={`mb-3 font-semibold text-sm`}>
                    {item.label}
                  </div>
                  <div
                    className={`${
                      item.isTruncated ? "truncate max-w-[200px]" : ""
                    }  underline`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}{" "}
              <button
                className={`border rounded-md p-3 w-full bg-cyan-200/40 shadow-md flex items-center justify-center `}
                onClick={messageSellers}
              >
                Send Message to Seller
              </button>
            </div>
          </div>
          <div className={` rounded-t-md`}>
            <Map
              mk={mk}
              showSearchBar={false}
              maxZ={14}
              minZ={10}
              wishlistStyle={`h-[500px] w-full rounded-md shadow-md`}
              // proposedLoc={{
              //   lat: wishlist.proposedLoc.coordinates[1],
              //   lng: wishlist.proposedLoc.coordinates[0],
              // }}
              // sellerLoc={{
              //   lat: wishlist.proposedLoc.coordinates[1],
              //   lng: wishlist.proposedLoc.coordinates[0],
              // }}
              center={{
                lat: wishlist.location.coordinates[1],
                lng: wishlist.location.coordinates[0],
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <button
            className={`fixed bottom-32 left-1/2 transform -translate-x-1/2 border rounded-full p-3 w-[220px] bg-cyan-200/40 shadow-lg flex items-center justify-between `}
            onClick={messageSellers}
          >
            Send Message to Seller
            <PiChatsCircleThin className=" text-2xl" />
          </button>
        </>
      )}
    </>
  );
};

export default WishlistClient;
