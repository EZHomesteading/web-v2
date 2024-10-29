"use client";
//component for displaying add to cart, buy now button, information about the product and a counter for the user to choose how much of the product to add to cart
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import useCartListing from "@/hooks/listing/use-cart";
import { useState } from "react";
import DateState2 from "./DateState2";
import NotifyModal from "./NotifyModal";
import { User } from "@prisma/client";
import { FinalListing } from "@/actions/getListings";
import ReactStars from "react-stars";
import ConfirmModal from "./ConfirmModal";
import {
  o,
  z,
} from "@/app/selling/(container-selling)/availability-calendar/(components)/helper-components-calendar";

interface ListingReservationProps {
  listingId: string;
  user?: User | null;
  product: FinalListing & { description: string };
  toggleCart: (e: any, quantity: number) => Promise<void>;
  sodt: (number | null)[];
  rating: number[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  product,
  listingId,
  user,
  toggleCart,
  sodt,
  rating,
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

  const renderRating = () => {
    const applicableRatings = rating.filter(
      (index) => index !== 0 && index in ratingMeanings
    );
    const possibleRatings = [1, 2, 3, 4];
    const inverseRatings = possibleRatings.filter(
      (index) => index !== 0 && !applicableRatings.includes(index)
    );
    return (
      <div className="text-sm text-gray-600  items-center gap-x-1">
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmmOpen, setConfirmmOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(); //users selected time
  const [quantity, setQuantity] = useState(product.minOrder || 1);
  const { hasCart } = useCartListing({
    listingId,
    user,
    quantity,
  });
  const description = product.description;
  const stock = product.stock;
  const quantityType = product.quantityType;
  const price = product.price;
  const startDate = product.createdAt;
  const endDate =
    product.shelfLife !== -1
      ? addDays(new Date(startDate), product.shelfLife)
      : null;
  const endDateString = endDate
    ? format(endDate, "MMM dd, yyyy")
    : "No expiry date";

  const increaseQuantity = () => {
    if (product.stock && quantity < product.stock) {
      setQuantity((prevQuantity: number) => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (product.minOrder === null) {
      product.minOrder = 1;
    }
    if (quantity > product.minOrder) {
      setQuantity((prevQuantity: number) => prevQuantity - 1);
    }
  };

  const handleToggleCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await toggleCart(e, quantity);
  };

  const handleTimer = (childTime: Date) => {
    setSelectedTime(childTime);
  };
  function pluralizeQuantityType(quantity: number, type: string) {
    if (quantity === 1) {
      return type;
    }

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
        className={` bg-white 
        rounded-xl 
        border-[1px]
        border-neutral-200 
        overflow-hidden
        gap-1 
        p-2 ${o.className}`}
      >
        <Button onClick={() => setConfirmmOpen(true)}>Report Listing</Button>
        <div
          className={`${z.className}
      text-lg font-light text-neutral-500 p-2`}
        >
          {renderRating()}
          Item Description: {description}
        </div>
        <hr />
        <ul className="p-2">
          {stock}{" "}
          {quantityType ? pluralizeQuantityType(stock, quantityType) : null}{" "}
          remaining
          <li>
            ${price} per {quantityType}
          </li>
        </ul>
        <hr />
        <div className="p-2">Expected Expiry Date: {endDateString}</div>
        <hr />
        {product.stock <= 0 ? (
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
            {product.minOrder === null || product.minOrder === 1 ? (
              <></>
            ) : (
              <>
                <div className="flex flex-row items-center p-2">
                  Minimum order: {product.minOrder} {quantityType}
                </div>
                <hr />
              </>
            )}
            {!hasCart ? (
              <div className="flex flex-col items-center gap-2">
                <div className=" flex flex-row justify-center items-center mt-2 ">
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
                    >
                      -
                    </button>
                    <input
                      className="bg-transparent text-center appearance-none outline-none"
                      value={quantity}
                      min={1}
                      max={product.stock ?? undefined}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (
                          !isNaN(value) &&
                          value >= 1 &&
                          value <= (product.stock ?? Infinity)
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
                    />
                    <button
                      className="text-gray-600 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseQuantity();
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <Button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleToggleCart(e)
                  }
                  className="w-full bg-green-400 shadow-xl mb-[2px]"
                >
                  {hasCart
                    ? `Added to Cart`
                    : `Add ${quantity} ${quantityType} to Cart`}
                </Button>
              </div>
            ) : (
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleToggleCart(e)
                }
                className="w-full bg-green-400 mb-[2px]"
              >
                {hasCart ? `Added to Cart` : "Add to Cart"}
              </Button>
            )}
            <div>
              <DateState2
                sodt={sodt}
                onSetTime={handleTimer}
                quantity={quantity}
                quantityType={quantityType}
                listing={product}
                user={user?.name}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ListingReservation;
