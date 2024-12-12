"use client";
import React, { useState, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { outfitFont, workFont } from "@/components/fonts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  PiMinusCircleThin,
  PiPlusCircleThin,
  PiChatsCircleThin,
} from "react-icons/pi";
import { toast } from "sonner";
import { formatDateToMMMDDAtHourMin } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";
import useMediaQuery from "@/hooks/media-query";
import DateOverlay from "./when";
import { orderMethod } from "@prisma/client";
import { BasketLocation } from "@/actions/getUser";
import AvailabilityMap from "./AvailabilityMap";
import { mapKeys } from "lodash";
// Keep specific types where they're well-defined
interface ListingType {
  id: string;
  title: string;
  quantityType: string;
  imageSrc: string[];
  price: number;
  [key: string]: any; // Allow additional properties
}

interface BasketItem {
  quantity: number;
  listing: ListingType;
  [key: string]: any;
}

// Use any for complex nested types
interface DetailedBasketGridProps {
  mapsKey: string;
  baskets: any[];
  userLocs: BasketLocation[] | null;
  mk: string | undefined;
  userId: string;
}

interface DetailedBasketCardProps {
  basket: any;
  userLocs: BasketLocation[] | null;
  mk: string | undefined;
  userId: string;
}

interface PriceBreakdownProps {
  total: number;
  price: number;
  quantity: number;
  quantityType: string;
}

interface QuantityControlProps {
  item: BasketItem;
}

const DetailedBasketGrid: React.FC<DetailedBasketGridProps> = ({
  baskets,
  mapsKey,
  userLocs,
  mk,
  userId,
}) => {
  const calculateBasketTotals = useMemo(() => {
    return baskets.reduce(
      (acc, basket) => {
        const basketTotal = basket.items.reduce((sum: number, item: any) => {
          return sum + item.listing.price * item.quantity;
        }, 0);
        const itemCount = basket.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        return {
          total: acc.total + basketTotal,
          itemCount: acc.itemCount + itemCount,
        };
      },
      { total: 0, itemCount: 0 }
    );
  }, [baskets]);

  const deliveryFee = 4.99;

  const OrderSummaryCard = () => (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Total Items:</span>
          <span>{calculateBasketTotals.itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${calculateBasketTotals.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee:</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>
              ${(calculateBasketTotals.total + deliveryFee).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
  const locations = baskets.reduce((acc: Location[], basket) => {
    if (basket.location) {
      acc.push(basket.location);
    }
    return acc;
  }, []);

  return (
    <div className={`${outfitFont.className} w-full pb-32`}>
      <div className="flex flex-col lg:flex-row px-4 lg:px-0 gap-8">
        {/* Main content area */}
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
              />
            ))}
          </div>

          {/* Mobile/Tablet Summary - appears at bottom of basket list */}
          <div className="lg:hidden mt-8">
            <OrderSummaryCard />
            <AvailabilityMap locations={locations} mapsKey={mapsKey} />
          </div>
        </div>

        {/* Desktop Summary Card */}
        <div className="hidden lg:block w-[35%] pt-6 ">
          <div className="fixed w-[calc(35%-2rem)]">
            <OrderSummaryCard />
            <AvailabilityMap locations={locations} mapsKey={mapsKey} />
          </div>
        </div>
      </div>
    </div>
  );
};
const DetailedBasketCard: React.FC<DetailedBasketCardProps> = ({
  basket,
  userLocs,
  mk,
  userId,
}) => {
  const over_768px = useMediaQuery("(min-width: 768px)");
  const [errorType, setErrorType] = useState<
    "undecided" | "location" | "deliveryDate" | "pickupDate" | null
  >(null);
  const [basketState, setBasketState] = useState<any>({
    ...basket,
    orderMethod: basket.orderMethod || orderMethod.UNDECIDED,
    selected_time_type: null,
  });

  const basketTotal = useMemo(() => {
    return basket.items.reduce((sum: number, item: any) => {
      return sum + item.listing.price * item.quantity;
    }, 0);
  }, [basket.items]);

  const QuantityControl: React.FC<QuantityControlProps> = ({ item }) => {
    const [quantity, setQuantity] = useState<number>(item.quantity);

    return (
      <div className="flex items-center gap-2">
        <PiMinusCircleThin
          className="text-2xl cursor-pointer"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        />
        <span>{quantity}</span>
        <PiPlusCircleThin
          className="text-2xl cursor-pointer"
          onClick={() => setQuantity((prev) => prev + 1)}
        />
      </div>
    );
  };

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

  return (
    <div className="border rounded-xl shadow-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-baseline gap-4">
          <h2 className="text-xl font-semibold">
            {basket.location.displayName || basket.location.user.name}
          </h2>
          <span className="text-lg text-gray-600">
            ${basketTotal.toFixed(2)}
          </span>
        </div>
        <DateOverlay
          basket={basketState as any}
          errorType={errorType}
          initialOrderMethod={basket.orderMethod}
          onOpenChange={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {basket.items.map((item: any, index: number) => (
          <div
            key={index}
            className="p-3 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-row gap-4">
              {/* Left side - Carousel */}
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

              {/* Right side - Information */}
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
                </div>
                <div className="mt-auto">
                  <QuantityControl item={item} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DetailedBasketGrid;
