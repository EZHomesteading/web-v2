"use client";

// Import necessary modules and components
import { Range } from "react-date-range";
import Button from "../Button";
import Calendar from "../inputs/Calendar";

// Define props interface for ListingReservation component
interface ListingReservationProps {
  price: number; // Price per night
  dateRange: Range; // Selected date range
  totalPrice: number; // Total price for the reservation
  onChangeDate: (value: Range) => void; // Function to handle date range change
  onSubmit: () => void; // Function to handle form submission
  disabled?: boolean; // Flag to indicate if the reservation is disabled
  disabledDates: Date[]; // Array of disabled dates
}

// ListingReservation component definition
const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
}) => {
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
      {/* Display price per night */}
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      {/* Horizontal divider */}
      <hr />
      {/* Render Calendar component for selecting dates */}
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      {/* Horizontal divider */}
      <hr />
      {/* Button to submit reservation */}
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      {/* Horizontal divider */}
      <hr />
      {/* Display total price */}
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
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

// Export ListingReservation component
export default ListingReservation;
