"use client";
//component for displaying add to cart, buy now button, information about the product and a counter for the user to choose how much of the product to add to cart
import { addDays, format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import useCartListing from "@/hooks/listing/use-cart";
import { useState } from "react";
import DateState2 from "./DateState2";
import NotifyModal from "./NotifyModal";
import { User } from "@prisma/client";
import { FinalListing } from "@/actions/getListings";
import { Outfit, Zilla_Slab } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});
const zilla = Zilla_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["300"],
});

interface ListingReservationProps {
  listingId: string;
  user?: User | null;
  product: FinalListing & { description: string };
  disabled?: boolean;
  toggleCart: (e: any, quantity: number) => Promise<void>;
  sodt: (number | null)[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  product,
  disabled,
  listingId,
  user,
  toggleCart,
  sodt,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      console.log(product.minOrder);
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

  return (
    <>
      <NotifyModal
        isOpen={confirmOpen}
        listingId={listingId}
        onClose={() => setConfirmOpen(false)}
        userEmail={user?.email}
      />
      <div
        className={` bg-white 
        rounded-xl 
        border-[1px]
        border-neutral-200 
        overflow-hidden
        gap-1 
        p-2 ${outfit.className}`}
      >
        <div
          className={`${zilla.className}
      text-lg font-light text-neutral-500 p-2`}
        >
          {description}
        </div>
        <hr />
        <ul className="p-2">
          {stock} remaining{" "}
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
                disabled={disabled}
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
