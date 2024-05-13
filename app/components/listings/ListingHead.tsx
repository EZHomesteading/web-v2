"use client";
import Image from "next/image";
import { SafeUser } from "@/types";
import Heading from "../Heading";
import HeartButton from "./heart-button";
import { Location } from "@prisma/client";

interface ListingHeadProps {
  title: string;
  imageSrc: string[];
  id: string;
  location: Location | null;
  user?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  imageSrc,
  id,
  location,
  user,
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
          src={imageSrc[0]}
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
          <HeartButton listingId={id} user={user} />
        </div>
      </div>
      <div className="mt-2">
        <Heading
          title={title}
          subtitle={`${location?.address[1]}, ${location?.address[2]}`}
        />
      </div>
    </>
  );
};

export default ListingHead;
