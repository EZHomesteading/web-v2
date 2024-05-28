"use client";
import Image from "next/image";
import { SafeUser } from "@/types";
import Heading from "../Heading";
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
          {imageSrc.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageSrc.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white opacity-90 transition-opacity duration-200"
                />
              ))}
            </div>
          )}
        </Carousel>

        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          {" "}
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
