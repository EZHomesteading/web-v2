"use client";

// Importing necessary modules and components
import dynamic from "next/dynamic";
import { IconType } from "react-icons";
import useCountries from "@/app/hooks/useCountries";
import Avatar from "../Avatar"; // Importing Avatar component
import ListingCategory from "./ListingCategory"; // Importing ListingCategory component
import { SafeUser } from "@/app/types";
// Dynamically importing Map component to prevent SSR
const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

// Interface defining props accepted by the ListingInfo component
interface ListingInfoProps {
  user: SafeUser; // User details of the listing host
  description: string; // Description of the listing
  guestCount: number; // Number of guests accommodated
  roomCount: number; // Number of rooms in the listing
  bathroomCount: number; // Number of bathrooms in the listing
  category?: {
    // Category details of the listing
    icon: IconType; // Icon representing the category
    label: string; // Label of the category
    description: string; // Description of the category
  };
  locationValue: string; // Location value of the listing
}

// ListingInfo component
const ListingInfo: React.FC<ListingInfoProps> = ({
  user, // User details of the listing host received as prop
  description, // Description of the listing received as prop
  guestCount, // Number of guests accommodated received as prop
  roomCount, // Number of rooms in the listing received as prop
  bathroomCount, // Number of bathrooms in the listing received as prop
  category, // Category details of the listing received as prop
  locationValue, // Location value of the listing received as prop
}) => {
  const { getByValue } = useCountries(); // Using the useCountries hook to get location details

  const coordinates = getByValue(locationValue)?.latlng; // Getting coordinates based on location value

  return (
    <div className="col-span-4 flex flex-col gap-8">
      {" "}
      {/* Container for listing information */}
      <div className="flex flex-col gap-2">
        {" "}
        {/* Container for host information */}
        {/* Displaying host information */}
        <div
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          <div>Hosted by {user?.name}</div> {/* Displaying host name */}
          <Avatar src={user?.image} /> {/* Avatar component for host image */}
        </div>
        {/* Displaying guest, room, and bathroom count */}
        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr /> {/* Horizontal divider */}
      {/* Displaying listing category if available */}
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label} // Label of the category
          description={category?.description} // Description of the category
        />
      )}
      <hr /> {/* Horizontal divider */}
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {description} {/* Displaying listing description */}
      </div>
      <hr /> {/* Horizontal divider */}
      {/* Map component to display location */}
      <Map center={coordinates} /> {/* Centering map to listing coordinates */}
    </div>
  );
};

export default ListingInfo; // Exporting ListingInfo component
