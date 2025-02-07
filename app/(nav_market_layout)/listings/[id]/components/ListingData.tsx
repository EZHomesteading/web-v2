"use client";

import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import DateState2 from "./DateState2";
import NotifyModal from "./NotifyModal";
import { Availability, Hours, orderMethod, User } from "@prisma/client";
import { FinalListing } from "@/actions/getListings";
import ReactStars from "react-stars";
import ConfirmModal from "./ConfirmModal";
import { outfitFont, zillaFont } from "@/components/fonts";
import { useBasket } from "@/hooks/listing/use-basket";
import { toast } from "sonner";
import { Loader2, ShoppingCart, Trash } from "lucide-react";
import { hasAvailableHours } from "@/app/(nav_and_side_bar_layout)/selling/(container-selling)/availability-calendar/(components)/helper-functions-calendar";

interface ListingInfoProps {
  listingId: string;
  user?: User | null;
  product: FinalListing & { description: string };
  sodt: (number | null)[];
  rating: number[];
  hours?: Hours | null;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  product,
  listingId,
  user,
  sodt,
  rating,
  hours,
}) => {
  const ratingMeanings: { [key: number]: string } = {
    1: "Not Genetically Modified",
    2: "No Inorganic Fertilizers",
    3: "No Inorganic Pesticides",
    4: "Not Modified After Harvest",
  };

  const inverseRatingMeanings: { [key: number]: string } = {
    1: "May be Genetically Modified",
    2: "May use Inorganic Fertilizers",
    3: "May use Inorganic Pesticides",
    4: "May be Modified After Harvest",
  };

  // State management
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmmOpen, setConfirmmOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>();
  const [existingItem, setExistingItem] = useState<any>(null);

  // Initialize basket hook
  const {
    isLoading,
    quantity,
    setQuantity,
    toggleBasket,
    checkExistingItem,
    isInBasket,
  } = useBasket({
    listingId,
    user,
    initialQuantity: product.minOrder || 1,
    hours,
  });

  // Check for existing basket item on mount
  useEffect(() => {
    const checkBasket = async () => {
      if (user) {
        const item = await checkExistingItem();
        setExistingItem(item);
        if (item?.quantity) {
          setQuantity(item.quantity);
        }
      }
    };
    checkBasket();
  }, [user, checkExistingItem, setQuantity]);

  // Product details
  const {
    description,
    stock,
    quantityType,
    price,
    createdAt: startDate,
    shelfLife,
    minOrder,
  } = product;

  // Calculate end date
  // const endDate =
  //   shelfLife !== -1 ? addDays(new Date(startDate), shelfLife) : null;
  // const endDateString = endDate
  //   ? format(endDate, "MMM dd, yyyy")
  //   : "No expiry date";

  // Quantity handlers
  const increaseQuantity = () => {
    if (stock && quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Cannot exceed available stock");
    }
  };

  const decreaseQuantity = () => {
    const minQuantity = minOrder || 1;
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    } else {
      toast.error(`Minimum order is ${minQuantity} ${quantityType}`);
    }
  };

  // basket handlers
  const handleToggleBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      toast.error("Please login to add items to your Wish List");
      return;
    }

    try {
      await toggleBasket(e);
      if (!isInBasket) {
        const item = await checkExistingItem();
        setExistingItem(item);
      } else {
        setExistingItem(null);
      }
    } catch (error) {
      toast.error("Failed to update basket");
    }
  };

  // Utility function for pluralization
  function pluralizeQuantityType(quantity: number, type: string) {
    if (quantity === 1) return type;

    switch (type.toLowerCase()) {
      case "lb":
        return "lbs";
      case "oz":
        return "oz";
      case "pint":
      case "quart":
      case "gallon":
      case "bushel":
      case "peck":
      case "crate":
      case "basket":
      case "bag":
      case "box":
      case "bunch":
        return type + "s";
      case "dozen":
        return "dozen";
      case "each":
        return "each";
      case "none":
        return "";
      default:
        return type;
    }
  }

  // Rating component
  const renderRating = () => {
    const applicableRatings = rating.filter(
      (index) => index !== 0 && index in ratingMeanings
    );
    const possibleRatings = [1, 2, 3, 4];
    const inverseRatings = possibleRatings.filter(
      (index) => index !== 0 && !applicableRatings.includes(index)
    );

    return (
      <div className="text-sm text-gray-600 items-center gap-x-1">
        <div className="text-sm text-gray-600 flex items-center gap-x-1">
          <ReactStars
            count={4}
            size={20}
            color2={"#000"}
            value={rating.length - 1}
            half={false}
            edit={false}
          />
        </div>
        <ul className="mb-2 list-none list-inside">
          {applicableRatings.map((ratingIndex) => (
            <li
              key={ratingIndex}
              className="text-sm text-gray-600 flex items-center gap-x-1"
            >
              {ratingMeanings[ratingIndex]}
            </li>
          ))}
          {inverseRatings.map((ratingIndex) => (
            <li
              key={ratingIndex}
              className="text-sm text-gray-600 flex items-center gap-x-1"
            >
              {inverseRatingMeanings[ratingIndex]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render basket button text
  const renderBasketButtonText = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      );
    }

    if (isInBasket) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Trash className="h-4 w-4" />
          Remove from Basket
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Add {quantity} {quantityType} to Basket
      </div>
    );
  };

  return (
    <>
      <NotifyModal
        isOpen={confirmOpen}
        listingId={listingId}
        onClose={() => setConfirmOpen(false)}
        userEmail={user?.email}
      />
      <ConfirmModal
        isOpen={confirmmOpen}
        listingId={listingId}
        onClose={() => setConfirmmOpen(false)}
        reports={product.reports}
      />
      <div
        className={`bg-white 
        rounded-xl 
        border-[1px]
        border-neutral-200 
        overflow-hidden
        gap-1 
        p-2 ${outfitFont.className}`}
      >
        <Button
          onClick={() => setConfirmmOpen(true)}
          variant="outline"
          className="w-full mb-2"
        >
          Report Listing
        </Button>
        <div
          className={`${zillaFont.className}
          text-lg font-light text-neutral-500 p-2`}
        >
          {renderRating()}
          Item Description: {description}
        </div>
        <hr />
        <ul className="p-2">
          <li>
            {stock}{" "}
            {quantityType ? pluralizeQuantityType(stock, quantityType) : null}{" "}
            remaining
          </li>
          <li>
            ${price} per {quantityType}
          </li>
        </ul>
        <hr />
        {/* <div className="p-2">Expected Expiry Date: {endDateString}</div> */}
        <hr />
        {stock <= 0 ? (
          <div>
            <div className="p-2">Item is out of stock</div>
            <Button
              onClick={() => setConfirmOpen(true)}
              className="w-full bg-green-400 shadow-xl mb-[2px]"
            >
              Notify me when in stock
            </Button>
          </div>
        ) : (
          <>
            {minOrder && minOrder > 1 && (
              <>
                <div className="flex flex-row items-center p-2">
                  Minimum order: {minOrder} {quantityType}
                </div>
                <hr />
              </>
            )}

            {/* Show existing cbasket info if item exists */}
            {existingItem && (
              <div className="p-2 bg-gray-50 rounded-md mb-2">
                <h3 className="font-medium text-sm mb-1">
                  Currently on Basket:
                </h3>
                <ul className="text-sm text-gray-600">
                  <li>
                    Quantity: {existingItem.quantity} {quantityType}
                  </li>
                  {existingItem.basket?.pickupDate && (
                    <li>
                      Pickup:{" "}
                      {format(new Date(existingItem.basket.pickupDate), "PPp")}
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              {!isInBasket && (
                <div className="flex flex-row justify-center items-center mt-2">
                  Set Quantity
                  <div
                    className="flex items-center bg-gray-200 rounded-full ml-2 px-4 py-2"
                    style={{ width: "fit-content" }}
                  >
                    <button
                      className="text-gray-600 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQuantity();
                      }}
                      disabled={isLoading}
                    >
                      -
                    </button>
                    <input
                      className="bg-transparent text-center appearance-none outline-none"
                      value={quantity}
                      min={minOrder || 1}
                      max={stock}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (
                          !isNaN(value) &&
                          value >= (minOrder || 1) &&
                          value <= stock
                        ) {
                          setQuantity(value);
                        }
                      }}
                      style={{
                        WebkitAppearance: "textfield",
                        MozAppearance: "textfield",
                        appearance: "textfield",
                        width: "40px",
                      }}
                      disabled={isLoading}
                    />
                    <button
                      className="text-gray-600 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseQuantity();
                      }}
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleToggleBasket}
                disabled={isLoading}
                className={`w-full shadow-xl mb-[2px] ${
                  isInBasket
                    ? "bg-red-400 hover:bg-red-500"
                    : "bg-green-400 hover:bg-green-500"
                }`}
              >
                {renderBasketButtonText()}
              </Button>
            </div>
            {/* <div>
              <DateState2
                sodt={sodt}
                onSetTime={handleTimer}
                quantity={quantity}
                quantityType={quantityType}
                listing={product}
                user={user?.name}
              />
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default ListingInfo;
