"use client";

import { addDays, format } from "date-fns";
import Button from "../Button";
// import Calendar from "../inputs/Calendar";

// interface Range {
//   startDate: Date;
//   endDate: Date;
//   key: string;
// }

interface ListingReservationProps {
  product: {
    endDate: Date | null;
    title: string;
    shelfLife: number;
    imageSrc: string;
    createdAt: Date;
    description: string;
    city: string;
    state: string;
    price: number;
    quantityType: string;
    stock: number;
  };
  onSubmit: () => void;
  disabled?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  product,
  onSubmit,
  disabled,
}) => {
  const description = product.description;
  const stock = product.stock;
  const quantityType = product.quantityType;
  const price = product.price;
  // const total = product.price * product.stock;
  const startDate = product.createdAt;
  const endDate =
    product.shelfLife !== -1
      ? addDays(new Date(startDate), product.shelfLife)
      : null;
  const endDateString = endDate
    ? format(endDate, "MMM dd, yyyy")
    : "No expiry date"; // const dateRange = endDate ? { startDate, endDate, key: "selection" } : null;
  return (
    <>
      <div
        className="
        bg-white 
        rounded-xl 
        border-[1px]
        border-neutral-200 
        overflow-hidden
        gap-1 
        p-2
      "
      >
        <div
          className="
      text-lg font-light text-neutral-500 p-2"
        >
          {description}
        </div>
        <hr />
        <div className="flex flex-row items-center p-2">
          {stock} {quantityType} remaining at ${price}
          {quantityType && (
            <div className="font-light"> per {quantityType}</div>
          )}
        </div>
        <hr />
        <div className="p-2">Expected Expiry Date: {endDateString}</div>
        {/* {dateRange && <Calendar value={dateRange} onChange={() => {}} />} */}
        <Button disabled={disabled} label={`Buy Now`} onClick={onSubmit} />
      </div>
    </>
  );
};

// Export ListingReservation component
export default ListingReservation;
