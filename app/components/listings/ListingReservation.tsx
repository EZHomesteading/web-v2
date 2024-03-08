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
    title: string;
    price: number;
    shelfLife: number;
    imageSrc: string;
    createdAt: string;
  };
  onSubmit: () => void;
  disabled?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  product,
  onSubmit,
  disabled,
}) => {
  const startDate = product.createdAt
    ? parseISO(product.createdAt)
    : new Date();
  const endDate = addDays(startDate, product.shelfLife);

  // If your Calendar component expects a single range object directly
  const dateRange = { startDate, endDate, key: "selection" };
  console.log(startDate, endDate);
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
      <Calendar value={dateRange} onChange={() => {}} />
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Buy Now" onClick={onSubmit} />
      </div>
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
