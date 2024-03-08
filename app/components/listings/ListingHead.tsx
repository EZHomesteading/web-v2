"use client";

// Importing necessary modules and components
import Image from "next/image";

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
  imageSrc, // Image source URL of the listing received as prop
  id, // ID of the listing received as prop
  currentUser, // Current user details received as prop
}) => {
  return (
    <>
      {" "}
      <Heading
        title={title}
        // subtitle={`${data?.city}, ${data?.state}`}
      />
      <div
        className="
          w-1/2
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        {" "}
        <Image
          src={imageSrc}
          width={400}
          height={400}
          className="object-cover w-full"
          alt="Image"
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          {" "}
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ListingHead; // Exporting ListingHead component
