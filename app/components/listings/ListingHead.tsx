"use client";

// Importing necessary modules and components
import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";

// Interface defining props accepted by the ListingHead component
interface ListingHeadProps {
  title: string; // Title of the listing
  locationValue: string; // Location value of the listing
  imageSrc: string; // Image source URL of the listing
  id: string; // ID of the listing
  currentUser?: SafeUser | null; // Current user details
}

// ListingHead component
const ListingHead: React.FC<ListingHeadProps> = ({
  title, // Title of the listing received as prop
  locationValue, // Location value of the listing received as prop
  imageSrc, // Image source URL of the listing received as prop
  id, // ID of the listing received as prop
  currentUser, // Current user details received as prop
}) => {
  const { getByValue } = useCountries(); // Using the useCountries hook to get location details

  const location = getByValue(locationValue); // Getting location details based on location value

  return (
    <>
      {" "}
      {/* Fragment for grouping elements */}
      {/* Heading component to display title and location */}
      <Heading
        title={title} // Title of the listing
        subtitle={`${location?.region}, ${location?.label}`} // Location of the listing
      />
      <div
        className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        {" "}
        {/* Container for image */}
        {/* Image component to display listing image */}
        <Image
          src={imageSrc} // Image source URL
          fill // Fill mode for the image
          className="object-cover w-full" // Styling for the image
          alt="Image" // Alt text for the image
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          {" "}
          {/* Container for heart button */}
          {/* HeartButton component to add listing to favorites */}
          <HeartButton
            listingId={id} // ID of the listing
            currentUser={currentUser} // Current user details
          />
        </div>
      </div>
    </>
  );
};

export default ListingHead; // Exporting ListingHead component
