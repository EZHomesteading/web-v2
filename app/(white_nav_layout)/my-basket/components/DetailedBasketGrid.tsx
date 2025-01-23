"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  use,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { outfitFont } from "@/components/fonts";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { PiMinusCircleThin, PiPlusCircleThin } from "react-icons/pi";
import { toast } from "sonner";
import useMediaQuery from "@/hooks/media-query";
import DateOverlay from "./when";
import { Basket, orderMethod } from "@prisma/client";
import { BasketLocation } from "@/actions/getUser";
import AvailabilityMap from "./AvailabilityMap";
import {
  DeliveryPickupToggle,
  DeliveryPickupToggleMode,
} from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";
import SpCounter from "./counter";
import { useRouter } from "next/navigation";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Trash2Icon } from "lucide-react";
import LocationModal from "./LocSelect";
import WeeklyHours from "./weeklyhours";
import { Button } from "@/components/ui/button";
import CheckoutButton from "./checkoutButton";

// Keep specific types where they're well-defined
interface ListingType {
  id: string;
  title: string;
  quantityType: string;
  imageSrc: string[];
  price: number;
  [key: string]: any; // Allow additional properties
}

export interface BasketItem {
  quantity: number;
  listing: ListingType;
  [key: string]: any;
}
interface BasketContextType {
  basketTotals: {
    total: number;
    itemCount: number;
  };
  updateBasketTotals: (totals: { total: number; itemCount: number }) => void;
}
// Use any for complex nested types
interface DetailedBasketGridProps {
  mapsKey: string;
  baskets: any[];
  userLocs: BasketLocation[] | null;
  mk: string | undefined;
  userId: string;
  userLoc: any;
}

interface DetailedBasketCardProps {
  basket: any;
  userLocs: BasketLocation[] | null;
  mk: string | undefined;
  userId: string;
  onModeChange: any;
  pickupTimes: any;
}

interface QuantityControlProps {
  item: BasketItem;
}
const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const [basketTotals, setBasketTotals] = useState({ total: 0, itemCount: 0 });

  const updateBasketTotals = (totals: { total: number; itemCount: number }) => {
    setBasketTotals(totals);
  };

  return (
    <BasketContext.Provider value={{ basketTotals, updateBasketTotals }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};
const DetailedBasketGrid: React.FC<DetailedBasketGridProps> = ({
  baskets,
  mapsKey,
  userLocs,
  userLoc,
  mk,
  userId,
}) => {
  return (
    <BasketProvider>
      <DetailedBasketGridContent
        baskets={baskets}
        mapsKey={mapsKey}
        userLocs={userLocs}
        userLoc={userLoc}
        mk={mk}
        userId={userId}
      />
    </BasketProvider>
  );
};
const DetailedBasketGridContent: React.FC<DetailedBasketGridProps> = ({
  baskets,
  mapsKey,
  userLocs,
  userLoc,
  mk,
  userId,
}) => {
  // Track delivery/pickup mode for each basket
  const { updateBasketTotals } = useBasket();
  const [pickupTimes, setPickupTimes] = useState(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [userActive, setUserActive] = useState(false);
  const [startLoc, setStartLoc] = useState<any[]>([]);
  const [endLoc, setEndLoc] = useState<any[]>([]);
  useEffect(() => {
    // console.log("PICKUPTIMEMEES", pickupTimes);
  }, [pickupTimes]);
  const [basketModes, setBasketModes] = useState<
    Record<string, DeliveryPickupToggleMode>
  >(() =>
    baskets.reduce((acc, basket) => {
      const hasDeliveryHours = basket.location?.hours?.delivery?.length > 0;
      const hasPickupHours = basket.location?.hours?.pickup?.length > 0;
      const isCoop = basket.location.role === "COOP";

      acc[basket.id] =
        !hasDeliveryHours && hasPickupHours
          ? DeliveryPickupToggleMode.PICKUP
          : hasDeliveryHours && !hasPickupHours
          ? DeliveryPickupToggleMode.DELIVERY
          : hasDeliveryHours && hasPickupHours
          ? isCoop
            ? DeliveryPickupToggleMode.PICKUP
            : DeliveryPickupToggleMode.DELIVERY
          : DeliveryPickupToggleMode.DELIVERY;

      return acc;
    }, {} as Record<string, DeliveryPickupToggleMode>)
  );
  const [showLocationModal, setShowLocationModal] = useState(!userLoc);

  useEffect(() => {
    if (!userLoc || userLoc.length === 0) {
      setShowLocationModal(true);
    }
  }, [userLoc]);
  // Filter locations based on their current mode
  const locations = useMemo(() => {
    //console.log("Recalculating locations with basketModes:", basketModes);

    const filteredLocations = baskets.reduce(
      (acc: BasketLocation[], basket) => {
        if (basket.location) {
          const basketMode = basketModes[basket.id];

          // console.log("Checking location:", {
          //   basketId: basket.id,
          //   mode: basketMode,
          //   isCoop: isCoopLocation,
          //   locationId: basket.location.id,
          //   role: basket.location.role,
          // });

          // Include location if:
          // - It's in PICKUP mode
          if (basketMode === DeliveryPickupToggleMode.PICKUP) {
            acc.push(basket.location);
            // console.log("Adding location:", basket.location.id);
          }
        }
        return acc;
      },
      []
    );

    //console.log("Filtered locations:", filteredLocations);
    return filteredLocations;
  }, [baskets, basketModes]);

  const handleBasketModeChange = (
    basketId: string,
    mode: DeliveryPickupToggleMode
  ) => {
    //console.log("Mode change requested:", { basketId, mode });
    setBasketModes((prev) => {
      const newModes = {
        ...prev,
        [basketId]: mode,
      };
      // console.log("New basket modes:", newModes);
      return newModes;
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const totals = baskets.reduce(
        (acc, basket) => ({
          total:
            acc.total +
            basket.items.reduce(
              (sum: number, item: any) =>
                sum + item.listing.price * item.quantity,
              0
            ),
          itemCount:
            acc.itemCount +
            basket.items.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            ),
        }),
        { total: 0, itemCount: 0 }
      );
      updateBasketTotals(totals);
    }, 2000);

    return () => clearInterval(interval);
  }, [updateBasketTotals]);

  interface SummaryCard {
    baskets: any[];
    pickupTimes: Record<string, Date> | null;
  }
  interface BasketState {
    id: string;
    locationId: string;
    orderMethod: string;
    deliveryDate: Date | null;
  }

  const OrderSummaryCard = ({ baskets, pickupTimes }: SummaryCard) => {
    const { basketTotals } = useBasket();

    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span>{basketTotals.itemCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${basketTotals.total.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${basketTotals.total.toFixed(2)}</span>
            </div>
          </div>

          <CheckoutButton
            startLoc={startLoc}
            endLoc={endLoc}
            baskets={baskets}
            pickupTimes={pickupTimes}
            basketTotals={basketTotals}
          />
        </div>
      </Card>
    );
  };
  return (
    <div className={`${outfitFont.className} w-full pb-32`}>
      <LocationModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
      <div className="flex flex-col lg:flex-row px-4 lg:px-0 gap-8">
        <div className="w-full lg:w-[65%] pt-6">
          <h1 className="text-4xl font-medium pb-6">My Market Baskets</h1>
          <div className="flex flex-col space-y-6">
            {baskets.map((basket) => (
              <DetailedBasketCard
                key={basket.id}
                basket={basket}
                userLocs={userLocs}
                mk={mk}
                userId={userId}
                onModeChange={handleBasketModeChange}
                pickupTimes={pickupTimes}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[35%] lg:fixed lg:right-0 lg:mt-10 lg:top-6 lg:pr-4 pt-6 space-y-6">
          <OrderSummaryCard baskets={baskets} pickupTimes={pickupTimes} />
          <AvailabilityMap
            setStartLoc={setStartLoc}
            setEndLoc={setEndLoc}
            userLoc={userLoc}
            locations={locations}
            mapsKey={mapsKey}
            key={locations.length} // Add key to force re-render
            setPickupTimes={setPickupTimes}
          />
        </div>
      </div>
    </div>
  );
};

const DetailedBasketCard: React.FC<DetailedBasketCardProps> = ({
  basket,
  onModeChange,
  pickupTimes,
}) => {
  const over_768px = useMediaQuery("(min-width: 768px)");
  const [errorType, setErrorType] = useState<
    "undecided" | "location" | "deliveryDate" | "pickupDate" | null
  >(null);

  const [deliveryPickupMode, setDeliveryPickupMode] =
    useState<DeliveryPickupToggleMode>(() => {
      const hasDeliveryHours = basket.location?.hours?.delivery?.length > 0;
      const hasPickupHours = basket.location?.hours?.pickup?.length > 0;
      const isCoop = basket.location.role === "COOP";

      if (!hasDeliveryHours && hasPickupHours) {
        return DeliveryPickupToggleMode.PICKUP;
      }
      if (hasDeliveryHours && !hasPickupHours) {
        return DeliveryPickupToggleMode.DELIVERY;
      }
      if (hasDeliveryHours && hasPickupHours) {
        return isCoop
          ? DeliveryPickupToggleMode.PICKUP
          : DeliveryPickupToggleMode.DELIVERY;
      }
      return DeliveryPickupToggleMode.NOHOURS;
    });

  const [basketState, setBasketState] = useState<any>({
    ...basket,
    orderMethod: basket.orderMethod || null,
    selected_time_type: null,
  });
  useEffect(() => {
    setBasketState((prevState: any) => ({
      ...prevState,
      orderMethod:
        deliveryPickupMode === DeliveryPickupToggleMode.DELIVERY
          ? "DELIVERY"
          : "PICKUP",
    }));
  }, [deliveryPickupMode, basket.id, onModeChange]);

  const basketTotal = useMemo(() => {
    return basket.items.reduce((sum: number, item: any) => {
      return sum + item.listing.price * item.quantity;
    }, 0);
  }, [basket.items]);

  const handleDeliveryPickupModeChange = (
    newMode: DeliveryPickupToggleMode
  ) => {
    setDeliveryPickupMode(newMode);
    onModeChange(basket.id, newMode);
  };

  const QuantityControl: React.FC<QuantityControlProps> = ({ item }) => {
    return (
      <div className="flex items-center gap-2">
        <SpCounter item={item} basketId={basket.id}></SpCounter>
      </div>
    );
  };

  const router = useRouter();
  const calculateExpiryDate = (createdAt: Date, shelfLife: number) => {
    if (shelfLife === 365000) return "Never";

    const createdDate = new Date(createdAt);
    const expiryDate = new Date(
      createdDate.getTime() + shelfLife * 24 * 60 * 60 * 1000
    );
    return expiryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDate = (date: Date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const daySuffix =
      day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${dayName}, ${monthName} ${day}${daySuffix}, at ${formattedHours}:${formattedMinutes}${amPm}`;
  };

  return (
    <div className="border rounded-xl shadow-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-4">
            <h2 className="text-xl font-semibold">
              {basket.location.displayName || basket.location.user.name}
            </h2>
            <span className="text-lg text-gray-600">
              ${basketTotal.toFixed(2)}
            </span>

            <WeeklyHours location={basket.location} mode={deliveryPickupMode} />
          </div>
        </div>
        <div className="flex justify-between items-start mb-4">
          <DeliveryPickupToggle
            panelSide={true}
            mode={deliveryPickupMode}
            onModeChange={handleDeliveryPickupModeChange}
            basket={basketState as any}
          />
          {deliveryPickupMode === "DELIVERY" && (
            <DateOverlay
              basket={basketState as any}
              errorType={errorType}
              initialOrderMethod={basket.orderMethod}
              onOpenChange={() => {}}
            />
          )}

          {pickupTimes && pickupTimes[basket.location.id] ? (
            <div className="flex items-center text-xs sm:text-sm justify-center rounded-full border px-3 py-2">
              Pickup set for {formatDate(pickupTimes[basket.location.id])}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {basket.items.map((item: any, index: number) => (
          <div
            key={index}
            className="p-3 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-row gap-4">
              <div className="w-32 h-32 flex-shrink-0 relative rounded-md overflow-hidden">
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {item.listing.imageSrc.map(
                      (src: string, imgIndex: number) => (
                        <CarouselItem
                          key={imgIndex}
                          className="relative w-full h-32"
                        >
                          <Image
                            src={src}
                            alt={item.listing.title}
                            fill
                            sizes="(max-width: 768px) 128px, 128px"
                            className="object-cover"
                            priority={index === 0 && imgIndex === 0}
                          />
                        </CarouselItem>
                      )
                    )}
                  </CarouselContent>
                </Carousel>
              </div>

              <div className="flex flex-col flex-1 justify-between min-w-0">
                <div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {item.listing.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Expires:{" "}
                    {calculateExpiryDate(
                      item.listing.createdAt,
                      parseInt(item.listing.shelfLife)
                    )}
                  </p>
                  <p className="text-xs text-gray-600"></p>
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900 flex flex-row">
                  ${item.listing.price}{" "}
                  {item.listing.quantityType ? (
                    <span className="ml-1">
                      {" "}
                      per {item.listing.quantityType}
                    </span>
                  ) : (
                    <span className="ml-1">
                      {" "}
                      per {item.listing.subCategory}
                    </span>
                  )}
                </div>
                <div className="mt-auto">
                  <QuantityControl item={item} />
                </div>
              </div>
              <div className="flex flex-col justify-between min-w-0">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 z-10"
                  onClick={async () => {
                    await axios.delete(`/api/baskets/itemdelete`, {
                      data: {
                        id: basket.id,
                        items: [item.listing.id],
                      },
                    });
                    router.refresh();
                  }}
                >
                  <span className="sr-only">Remove</span>
                  <Trash2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DetailedBasketGrid;
