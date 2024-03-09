"use client";

import { addDays, parseISO } from "date-fns";
import Button from "../Button";
import Calendar from "../inputs/Calendar";

interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface ListingReservationProps {
  product: {
    endDate: Date | null;
    title: string;
    price: number;
    shelfLife: number;
    imageSrc: string;
    createdAt: Date;
    city: string;
    state: string;
  };
  onSubmit: () => void;
  disabled?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  product,
  onSubmit,
  disabled,
}) => {
  const startDate = product.createdAt;
  // Adjust endDate calculation based on shelfLife
  const endDate =
    product.shelfLife !== -1
      ? addDays(new Date(startDate), product.shelfLife)
      : null;
  // For non-expiring items, no end date is calculated
  const dateRange = endDate ? { startDate, endDate, key: "selection" } : null;
  return (
    <div
      className="
        bg-white 
        rounded-xl 
        border-[1px]
        border-neutral-200 
        overflow-hidden
      "
    >
      <div className="flex flex-row items-center gap-1 p-4">
        {/* <div className="font-semibold"> $ {price}</div>
          {data.quantityType && (
            <div className="font-light">per {data.quantityType}</div>
          )} */}
      </div>
      <hr />
      {dateRange && <Calendar value={dateRange} onChange={() => {}} />}
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Buy Now" onClick={onSubmit} />
      </div>
      <div></div>
      <hr />
      <div
        className="
          p-4 
          flex 
          flex-row 
          items-center 
          justify-between
          font-semibold
          text-lg
        "
      >
        <div>Price for entire stock</div>
        {/* <div>$ price*stock</div> */}
      </div>
    </div>
  );
};

// Export ListingReservation component
export default ListingReservation;
