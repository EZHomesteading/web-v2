"use client";

import { BasketLocation } from "@/actions/getUser";
import Map from "./map.basket";
import useMediaQuery from "@/hooks/media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  formatDateToMMMDDAtHourMin,
  hasAvailableHours,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import { outfitFont } from "@/components/fonts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { basket_time_type, orderMethod } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Basket_Selected_Time_Type } from "@/types/basket";
import { PiChatsCircleThin } from "react-icons/pi";
import DateOverlay from "./when";

interface p {
  basket: any;
  userLocs: BasketLocation[] | null;
  mk: string;
}
type ProposedLocation = {
  address: string[];
  coordinates: number[];
};
const BasketClient = ({ basket, userLocs, mk }: p) => {
  const over_768px = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isDateOverlayOpen, setIsDateOverlayOpen] = useState(false);

  const { hasPickup, hasDelivery, initialOrderMethod } = useMemo(() => {
    const hasPickup = hasAvailableHours(basket.location.hours?.pickup || []);
    const hasDelivery = hasAvailableHours(
      basket.location.hours?.delivery || []
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
  }, [basket.location.hours]);

  const [basketState, setBasketState] = useState<Basket_Selected_Time_Type>({
    ...basket,
    orderMethod: basket.orderMethod || initialOrderMethod,
    selected_time_type: null,
  });
  const [time_type, set_time_type] = useState(
    basketState.time_type || basket_time_type.ASAP
  );
  const [errorType, setErrorType] = useState<
    "undecided" | "location" | "deliveryDate" | "pickupDate" | null
  >(null);

  const formatOrderMethodText = (method: orderMethod) => {
    if (method === orderMethod.UNDECIDED) return "How?";
    return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
  };

  const resetForm = () => {
    if (hasPickup && hasDelivery) {
      setBasketState((prev) => ({
        ...prev,
        orderMethod: orderMethod.UNDECIDED,
        pickupDate: null,
        deliveryDate: null,
        proposedLoc: null,
      }));
    } else {
      setBasketState((prev) => ({
        ...prev,
        pickupDate: null,
        deliveryDate: null,
        proposedLoc: null,
      }));
    }
  };

  const saveChanges = async () => {
    const updatedData = {
      id: basketState.id,
      proposedLoc: basketState.proposedLoc,
      deliveryDate: basketState.deliveryDate,
      pickupDate: basketState.pickupDate,
      orderMethod: basketState.orderMethod,
      items: basketState.items.map((item) => ({
        listingId: item.listing.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await axios.post("/api/baskets/update", updatedData);
      if (res.status === 200) {
        toast.success("Basket was updated");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update basket");
      console.error("Update error:", error);
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
      type: basketState.orderMethod,
    };
    try {
      const OrderResponse = await axios.post("/api/chat/createOrder", params);
    } catch (error) {
      console.error("Error in the overall process:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleErrors = () => {
    if (!basket) return false;

    if (isOrderMethodUndecided()) {
      toast.error(
        "Please select your preferred delivery method for this basket."
      );
      setErrorType("undecided");
      return true;
    } else if (isDeliveryWithoutLocation()) {
      toast.error("Please specify a delivery location for this basket.");
      setErrorType("location");
      return true;
    } else if (isDeliveryWithoutDate()) {
      toast.error("Please propose a preferred delivery date and time.");
      setErrorType("deliveryDate");
      return true;
    } else if (isPickupWithoutDate()) {
      toast.error("Please suggest a time when you can pick up this basket.");
      setErrorType("pickupDate");
      return true;
    }

    setErrorType(null);
    return false;
  };
  const isOrderMethodUndecided = () =>
    basket.orderMethod === orderMethod.UNDECIDED;
  const isDeliveryWithoutLocation = () =>
    basket.orderMethod === orderMethod.DELIVERY && !basket.proposedLoc;
  const isDeliveryWithoutDate = () =>
    basket.orderMethod === orderMethod.DELIVERY &&
    basket.proposedLoc &&
    !basket.deliveryDate;
  const isPickupWithoutDate = () =>
    basket.orderMethod === orderMethod.PICKUP && !basket.pickupDate;
  basket.orderMethod === orderMethod.PICKUP && !basket.pickupDate;
  const SaveChangesButton = () => {
    return (
      <>
        <button
          className={`${outfitFont.className} text-white bg-black px-3 py-2 rounded-full border `}
          onClick={saveChanges}
        >
          Save Changes
        </button>
      </>
    );
  };
  const formattedDate =
    (basket.deliveryDate &&
      formatDateToMMMDDAtHourMin(new Date(basket.deliveryDate))) ||
    (basket.pickupDate &&
      formatDateToMMMDDAtHourMin(new Date(basket.pickupDate))) ||
    "When?";

  return (
    <>
      <div
        className={`fixed top-2 md:w-[calc(100%/2)] w-[100%] md:top-20 left-0 ml-1  2xl:ml-[7.75rem] bg-white`}
      >
        <>
          <Link
            href={`/store/${basket?.location?.user?.url}/${basket?.location?.id}`}
            className={`hover:cursor-pointer text-4xl`}
          >
            {basket?.location?.displayName || basket?.location?.user?.name}
          </Link>
          <div className="w-screen md:w-full overflow-x-auto my-3 flex justify-start items-center gap-x-2 whitespace-nowrap pr-20">
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
                          value: formattedDate,
                          display:
                            basket?.orderMethod === orderMethod.PICKUP && true,
                        },
                        {
                          label: "Proposed Delivery Location",
                          value: formattedDate,
                          display:
                            basket?.orderMethod === orderMethod.DELIVERY &&
                            true,
                        },
                        {
                          label: "Proposed Delivery Date",
                          value: basket.deliveryDate?.toString() || "Not Set",
                          display:
                            basket?.orderMethod === orderMethod.DELIVERY &&
                            true,
                        },
                        {
                          label: "Notes",
                          value: "None",
                          isTruncated: true,
                          display: false,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`flex justify-between w-full items-start ${
                            item.display === false && "hidden"
                          } `}
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
                      basketStyle={`h-[500px] w-full rounded-md shadow-md`}
                      // proposedLoc={{
                      //   lat: basket.proposedLoc.coordinates[1],
                      //   lng: basket.proposedLoc.coordinates[0],
                      // }}
                      // sellerLoc={{
                      //   lat: basket.proposedLoc.coordinates[1],
                      //   lng: basket.proposedLoc.coordinates[0],
                      // }}
                      center={{
                        lat: basket.location.coordinates[1],
                        lng: basket.location.coordinates[0],
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
                  {formatOrderMethodText(basketState.orderMethod)}
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-[600px]">
                  <div
                    className={`text-center font-semibold border-b pb-3 ${outfitFont.className}`}
                  >
                    Order Type
                  </div>
                  <div
                    className={` text-lg w-full flex flex-col gap-y-3 items-start justify-start text-start pt-3`}
                  >
                    <button
                      className="flex justify-start items-center w-full"
                      onClick={() =>
                        setBasketState((prev) => ({
                          ...prev,
                          orderMethod: orderMethod.DELIVERY,
                          pickupDate: null,
                        }))
                      }
                    >
                      <div
                        className={`rounded-full border p-[.4rem] ${
                          basketState.orderMethod === orderMethod.DELIVERY
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
                        setBasketState((prev) => ({
                          ...prev,
                          orderMethod: orderMethod.PICKUP,
                          deliveryDate: null,
                          proposedLoc: null,
                        }))
                      }
                    >
                      <div
                        className={`rounded-full border p-[.4rem] ${
                          basketState.orderMethod === orderMethod.PICKUP
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
                      <SaveChangesButton />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {basket.orderMethod === orderMethod.DELIVERY && (
              <Popover>
                <PopoverTrigger
                  className={`flex items-center justify-center rounded-full border px-3 py-2 
                    w-[200px] ${errorType === "location" ? "borderRed" : ""}`}
                >
                  {basket.proposedLoc === null
                    ? "Where?"
                    : basket?.proposedLoc?.address[0]}
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-[600px]">
                  <div
                    className={`text-center font-semibold border-b pb-3 ${outfitFont.className}`}
                  >
                    Delivery Location
                  </div>
                  <div
                    className={` text-lg w-full flex flex-col gap-y-3 items-start justify-start text-start pt-3`}
                  >
                    {userLocs?.map((userLoc, index) => (
                      <button
                        key={index}
                        className="truncate flex justify-start items-center w-[200px]"
                        onClick={() => {
                          if (userLoc.coordinates && userLoc.address) {
                            setBasketState((prev) => ({
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
                            basketState.proposedLoc?.address[0] ===
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
                          setBasketState((prev) => ({
                            ...prev,
                            proposedLoc: null,
                          }))
                        }
                      >
                        Reset
                      </button>
                      <SaveChangesButton />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {((basket.orderMethod === orderMethod.DELIVERY &&
              basket.proposedLoc) ||
              basket.orderMethod === orderMethod.PICKUP) && (
              <DateOverlay
                basket={basketState}
                errorType={errorType}
                initialOrderMethod={initialOrderMethod}
                onOpenChange={setIsDateOverlayOpen}
              />
            )}
          </div>
        </>
      </div>
      {over_768px ? (
        <div
          className={`fixed right-0 top-2 sm:top-20 w-[calc(100%/2)] xl:w-[calc(100%/3)] px-1 z-[50] transition-opacity duration-300 ${
            isDateOverlayOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col justify-between gap-2 w-full  h-fit">
            <div className={`border rounded-md shadow-md p-3 mb-2`}>
              {[
                {
                  label: "Proposed Pickup Date",
                  value: formattedDate,
                  display: basket?.orderMethod === orderMethod.PICKUP && true,
                  info_title: "Why do I need to enter this?",
                  info: "Just fill in your info - no commitment yet! Once you select when you'd like to pick up your order, they'll take a look and can accept, suggest another time, or decline. You'll only have the option pay after you've both agreed on the details.",
                },
                {
                  label: "Proposed Delivery Location",
                  value: basket?.proposedLoc?.address[0] || "Not Set",
                  display: basket?.orderMethod === orderMethod.DELIVERY && true,
                  info_title: "Why do I need to enter this?",
                  info: "Just fill in your info - no commitment yet! Once you pick when and where you'd like your delivery, they'll take a look and can accept, suggest another time, or decline. You'll only have the option to pay after you've both agreed on the details.",
                },
                {
                  label: "Proposed Delivery Date",
                  value: formattedDate,
                  display: basket?.orderMethod === orderMethod.DELIVERY && true,
                  info_title: "",
                  info: "Just fill in your info - no commitment yet! Once you pick when and where you'd like your delivery, they'll take a look and can accept, suggest another time, or decline. You'll only have the option to pay after you've both agreed on the details.",
                },
                {
                  label: "Notes",
                  value: "None",
                  isTruncated: true,
                  display: false,
                  info_title: "",
                  info: "",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={` flex justify-between w-full items-start ${
                    item.display === false && "hidden"
                  } `}
                >
                  <div className={`mb-3 font-semibold text-sm`}>
                    {item.label}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        className={`${
                          item.isTruncated ? "truncate max-w-[200px]" : ""
                        }  hover:cursor-pointer underline select-none`}
                      >
                        {item.value}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className={`${outfitFont.className} mr-3`}>
                      {item.info}
                    </PopoverContent>
                  </Popover>
                </div>
              ))}{" "}
              <button
                className={`border rounded-md p-3 w-full bg-cyan-200/40 shadow-md flex items-center justify-center z-[50] transition-opacity duration-300 ${
                  isDateOverlayOpen
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
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
              basketStyle={`h-[500px] w-full rounded-md shadow-md`}
              // proposedLoc={{
              //   lat: basket.proposedLoc.coordinates[1],
              //   lng: basket.proposedLoc.coordinates[0],
              // }}
              // sellerLoc={{
              //   lat: basket.proposedLoc.coordinates[1],
              //   lng: basket.proposedLoc.coordinates[0],
              // }}
              center={{
                lat: basket.location.coordinates[1],
                lng: basket.location.coordinates[0],
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <button
            className={`z-[50] transition-opacity duration-300 ${
              isDateOverlayOpen
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            } fixed bottom-32 z-1 left-1/2 transform -translate-x-1/2 border rounded-full p-3 w-[220px] bg-cyan-200/40 shadow-lg flex items-center justify-between `}
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

export default BasketClient;
