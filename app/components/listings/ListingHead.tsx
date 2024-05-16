"use client";
import Image from "next/image";
import { SafeUser } from "@/types";
import Heading from "../Heading";
import HeartButton from "./heart-button";
import { Location } from "@prisma/client";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

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
        <Carousel>
          <CarouselContent className="h-[60vh]">
            {imageSrc.map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex items-center justify-center relative aspect-sqaure h-[60vh]">
                    <Image
                      src={imageSrc[index]}
                      fill
                      className="object-cover w-full"
                      alt={title}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

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
