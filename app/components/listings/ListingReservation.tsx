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
    shelfLife: number;
    imageSrc: string;
    createdAt: Date;
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
  const stock = product.stock;
  const quantityType = product.quantityType;
  const price = product.price;
  const total = product.price * product.stock;
  const startDate = product.createdAt;
  const endDate =
    product.shelfLife !== -1
      ? addDays(new Date(startDate), product.shelfLife)
      : null;
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
        {stock} {quantityType} remaining at ${price}
        {quantityType && <div className="font-light">per {quantityType}</div>}
      </div>
      <hr />
      {dateRange && <Calendar value={dateRange} onChange={() => {}} />}
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label={`Message User`} onClick={onSubmit} />
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
        <div>Buy All Now for ${total}</div>
      </div>
    </div>
  );
};

// Export ListingReservation component
export default ListingReservation;
