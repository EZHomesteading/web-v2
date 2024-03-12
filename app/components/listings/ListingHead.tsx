"use client";

import Image from "next/image";

import { SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../ui/HeartButton";

interface ListingHeadProps {
  title: string;
  imageSrc: string;
  id: string;
  city: string;
  state: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  imageSrc,
  id,
  city,
  state,
  currentUser,
}) => {
  return (
    <>
      {" "}
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
        <Image
          src={imageSrc}
          fill
          className="object-cover w-full"
          alt={title}
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
      <div className="mt-2">
        <Heading title={title} subtitle={`${city}, ${state}`} />
      </div>
    </>
  );
};

export default ListingHead;
