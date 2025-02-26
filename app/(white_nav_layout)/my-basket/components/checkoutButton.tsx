import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import SoonExpiryModal from "./soonExpiryModal";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CheckoutButtonProps {
  baskets: any[];
  pickupTimes: Record<string, Date> | null;
  basketTotals: {
    total: number;
    itemCount: number;
  };
  endLoc: any;
  startLoc: any;
}

interface AdjustedListing {
  listingId: string;
  title: string;
  sellerName: string;
  expiry: Date | null;
  soonValue: number;
}

const CheckoutButton = ({
  baskets,
  pickupTimes,
  basketTotals,
  endLoc,
  startLoc,
}: CheckoutButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expiredArray, setExpiredArray] = useState<AdjustedListing[]>([]);
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const router = useRouter();

  // Check if any items are out of stock
  const hasOutOfStock = baskets.some((basket) =>
    basket.items.some((item: any) => item.listing.stock <= 0)
  );

  const hasNotEnoughStock = baskets.some((basket) =>
    basket.items.some((item: any) => item.listing.stock <= item.quantity)
  );

  const createExpiryArray = () => {
    const expiryArray: AdjustedListing[] = [];

    baskets.forEach((basket) => {
      basket.items.forEach((item: any) => {
        const shelfLifeInDays = item.listing.shelfLife;
        const createdAt = new Date(item.listing.createdAt);
        const expiry =
          shelfLifeInDays !== -1 ? addDays(createdAt, shelfLifeInDays) : null;

        const percentExpiry = new Date(
          now.getTime() + shelfLifeInDays * 0.3 * 24 * 60 * 60 * 1000
        );

        const adjustedListing: AdjustedListing = {
          listingId: item.listing.id,
          title: item.listing.title,
          sellerName: basket.location.displayName || basket.location.user.name,
          expiry: expiry,
          soonValue: 0,
        };

        if (expiry && expiry < now) {
          adjustedListing.soonValue = 3;
          expiryArray.push(adjustedListing);
        } else if (expiry && expiry < threeDaysLater) {
          adjustedListing.soonValue = 1;
          expiryArray.push(adjustedListing);
        } else if (expiry && expiry < percentExpiry) {
          adjustedListing.soonValue = 2;
          expiryArray.push(adjustedListing);
        }
      });
    });

    return expiryArray;
  };

  const handleCheckout = () => {
    // Create expiry array
    const expiryArr = createExpiryArray();

    // Handle missing pickup/delivery times
    if (!allTimesSet) {
      toast.error("Please set pickup or delivery times for all items", {
        duration: 2000,
        position: "bottom-right",
      });
      return;
    }

    // Handle out of stock items
    if (hasOutOfStock) {
      toast.error("Some items in your basket are out of stock", {
        duration: 2000,
        position: "bottom-right",
      });
      return;
    }
    if (hasNotEnoughStock) {
      toast.error(
        "Some items in your basket do not have enough stock for your order.",
        {
          duration: 2000,
          position: "bottom-right",
        }
      );
      return;
    }
    // If there are expired or soon-to-expire items, show modal
    if (expiryArr.length > 0) {
      setExpiredArray(expiryArr);
      setConfirmOpen(true);
      return;
    }

    // If all checks pass, proceed with checkout
    createOrder();
  };

  const createOrder = async () => {
    try {
      console.log("Starting checkout process...");
      console.log("Initial baskets:", baskets);
      console.log("Pickup times:", pickupTimes);
      const orderGroupResponse = await axios.post(
        "/api/useractions/checkout/create-group",
        {
          startLoc: startLoc,
          endLoc: endLoc,
        }
      );

      const orderGroupId = orderGroupResponse.data.id;
      // Prepare updates for all baskets that need pickup times set
      const updates = baskets
        .filter((basket) => {
          const hasPickupTime = Boolean(pickupTimes?.[basket.location.id]);
          // Include if it has a pickup time OR if it has a delivery date
          const needsUpdate =
            hasPickupTime ||
            (basket.orderMethod === "DELIVERY" && basket.deliveryDate);

          console.log(`Basket ${basket.id} needs update:`, needsUpdate, {
            currentOrderMethod: basket.orderMethod,
            hasPickupTime,
            locationId: basket.location.id,
            pickupTime: pickupTimes?.[basket.location.id],
            deliveryDate: basket.deliveryDate,
          });
          return needsUpdate;
        })
        .map((basket) => {
          // Use nullish coalescing to safely handle pickupTimes
          const pickupDate = pickupTimes?.[basket.location.id] ?? null;

          const update = {
            id: basket.id,
            pickupDate,
            orderMethod: pickupDate ? "PICKUP" : basket.orderMethod,
            // Only set deliveryDate if no pickup time
            deliveryDate: pickupDate ? null : basket.deliveryDate,
            proposedLoc: basket.proposedLoc,
            time_type: basket.time_type,
            items: basket.items.map((item: any) => ({
              listingId: item.listing.id,
              quantity: item.quantity,
            })),
          };
          console.log(`Prepared update for basket ${basket.id}:`, update);
          return update;
        });

      console.log(`Prepared ${updates.length} basket updates:`, updates);

      if (updates.length > 0) {
        console.log("Sending batch update request...");
        const response = await axios.post("/api/baskets/batch-update", {
          updates,
        });

        console.log("Received response:", response.data);

        if (!response.data || response.status !== 200) {
          console.error("Invalid response:", response);
          throw new Error("Failed to update baskets");
        }
      }

      console.log("All updates successful, redirecting to checkout");
      router.push(`/checkout?orderGroupId=${orderGroupId}`);
    } catch (error) {
      console.error("Error updating baskets:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
      }
      toast.error("Error preparing checkout. Please try again.", {
        duration: 2000,
        position: "bottom-right",
      });
    }
  };
  // Also add debug logs to the all times check
  const allTimesSet = baskets.every((basket) => {
    const hasPickupTime = pickupTimes && pickupTimes[basket.location.id];
    const hasDeliveryDate =
      basket.orderMethod === "DELIVERY" && basket.deliveryDate;
    console.log(`Checking times for basket ${basket.id}:`, {
      hasPickupTime,
      hasDeliveryDate,
      orderMethod: basket.orderMethod,
      pickupTime: pickupTimes?.[basket.location.id],
      deliveryDate: basket.deliveryDate,
    });
    return hasPickupTime || hasDeliveryDate;
  });

  // Don't render if there are no items
  if (basketTotals.itemCount === 0) {
    return null;
  }

  // Determine button style and text based on state
  let buttonStyle = "w-full mt-4";
  let buttonText = "Proceed to Checkout";

  if (!allTimesSet || hasOutOfStock) {
    buttonStyle += " bg-red-300 text-black hover:text-white hover:bg-red-600";
    buttonText = "Unable to Checkout";
  } else {
    buttonStyle += " bg-green-600 hover:bg-green-700 text-white";
  }

  return (
    <>
      <SoonExpiryModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        expiryArr={expiredArray}
        createOrder={createOrder}
      />
      {!allTimesSet ? (
        <div className="text-red-500">
          You must set delivery/pickup times for all items before proceeding to
          checkout
        </div>
      ) : null}
      {hasOutOfStock ? (
        <div className="text-red-500">
          One or more of the items in your cart are out of stock.
        </div>
      ) : hasNotEnoughStock ? (
        <div className="text-red-500">
          One or more of the items in your cart do not have enough stock to
          complete your order.
        </div>
      ) : null}

      <Button
        className={buttonStyle}
        onClick={handleCheckout}
        disabled={!allTimesSet || hasOutOfStock || hasNotEnoughStock}
      >
        {buttonText}
      </Button>
    </>
  );
};

export default CheckoutButton;
