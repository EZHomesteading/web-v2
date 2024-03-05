"use client";

// Importing necessary modules and components
import Image from "next/image"; // Image component from Next.js
import { useRouter } from "next/navigation"; // useRouter hook from Next.js
import { useCallback, useMemo } from "react"; // useCallback and useMemo hooks from React
import { format } from "date-fns"; // Function for formatting dates
import { useTheme } from "next-themes";
import useCountries from "@/app/hooks/useCountries"; // Custom hook for country data
import { SafeListing, SafeReservation, SafeUser } from "@/app/types"; // Types for safe listing, reservation, and user data

import HeartButton from "../HeartButton"; // HeartButton component
import Button from "../Button"; // Button component
import ClientOnly from "../ClientOnly"; // ClientOnly component

// Interface defining props accepted by the ListingCard component
interface ListingCardProps {
  data: SafeListing; // Data for the listing
  reservation?: SafeReservation; // Reservation data for the listing
  onAction?: (id: string) => void; // Function to handle action on the listing
  disabled?: boolean; // Whether the listing is disabled
  actionLabel?: string; // Label for the action button
  actionId?: string; // ID for the action
  secondActionId?: string;
  secondActionLabel?: string;
  onSecondAction?: (id: string) => void;
  currentUser?: SafeUser | null; // Current user data
}

// ListingCard component
const ListingCard: React.FC<ListingCardProps> = ({
  data, // Data for the listing received as prop
  reservation, // Reservation data for the listing received as prop
  onAction, // Function to handle action on the listing received as prop
  disabled, // Whether the listing is disabled received as prop
  actionLabel, // Label for the action button received as prop
  actionId = "", // ID for the action received as prop
  currentUser,
  secondActionId,
  onSecondAction,
  secondActionLabel,
  // Current user data received as prop
}) => {
  const router = useRouter(); // useRouter hook from Next.js
  const { getByValue } = useCountries(); // Custom hook for getting country data
  const { theme } = useTheme();

  const location = getByValue(data.locationValue); // Getting location data based on location value

  // Function to handle cancellation action
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Stopping event propagation

      if (disabled) {
        // Checking if the listing is disabled
        return;
      }

      onAction?.(actionId); // Calling onAction function with action ID
    },
    [disabled, onAction, actionId]
  ); // Dependency array includes disabled, onAction, and actionId

  const handleSecondAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // Stopping event propagation

      if (disabled) {
        // Checking if the listing is disabled
        return;
      }

      onSecondAction?.(actionId); // Calling onAction function with action ID
    },
    [disabled, onSecondAction, secondActionId]
  ); // Dependency array includes disabled, onAction, and actionId

  // Memoized price based on reservation status
  const price = useMemo(() => {
    if (reservation) {
      // If reservation exists, use reservation price
      return reservation.totalPrice;
    }

    return data.price; // Otherwise, use listing price
  }, [reservation, data.price]); // Dependency array includes reservation and listing price

  // Memoized reservation date based on reservation status
  const reservationDate = useMemo(() => {
    if (!reservation) {
      // If no reservation exists, return null
      return null;
    }

    // Format start and end dates of the reservation
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    // Return formatted reservation date range
    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]); // Dependency array includes reservation

  const cardBackgroundLight = "#ffffff"; // Light theme card background
  const cardBackgroundDark = "#666666"; // Dark theme card background

  // Update card background dynamically based on the theme
  const cardStyle = {
    backgroundColor:
      theme === "light" ? cardBackgroundLight : cardBackgroundDark,
  };

  // Rendering the ListingCard component
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)} // Redirecting to listing page on click
      className="col-span-1 cursor-pointer group" // CSS classes for styling
    >
      <div className="flex flex-col gap-2 w-full">
        {" "}
        {/* Container for listing details */}
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
          style={cardStyle}
        >
          <Image // Image component for listing image
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data.imageSrc} // Image source
            alt="Listing" // Alternative text for image
            height={300}
            width={300}
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <HeartButton // HeartButton component for favoriting listings
              listingId={data.id} // ID of the listing
              currentUser={currentUser} // Current user data
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {" "}
          <div className="font-semibold text-lg"> {data.title}</div>
          <div className="font-light text-neutral-500">
            {location?.region}, {location?.label}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          {" "}
          {/* Price and unit */}
          <div className="font-semibold"> $ {price}</div>
          {data.quantityType && (
            <div className="font-light">per {data.quantityType}</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled} // Whether the button is disabled
            small // Small size for the button
            label={actionLabel} // Label for the button
            onClick={handleCancel} // Click handler for the button
          />
        )}
        {onSecondAction &&
          secondActionLabel && ( // Action button if onAction and actionLabel exist
            <Button
              disabled={disabled} // Whether the button is disabled
              small // Small size for the button
              label={secondActionLabel} // Label for the button
              onClick={handleSecondAction} // Click handler for the button
            />
          )}
      </div>
    </div>
  );
};
// Name, price per unit, location
export default ListingCard; // Exporting ListingCard component
