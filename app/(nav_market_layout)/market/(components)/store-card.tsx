"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { UserInfo } from "next-auth";
import { OutfitFont, WorkFont } from "@/components/fonts";
import { MarketListing } from "./market-component";
import Link from "next/link";
import { StarRating } from "./market-components";

interface StoreLocationCardProps {
  listing: MarketListing;
  user?: UserInfo;
  imageCount: number;
  location?: any;
}

const StoreLocationCard = ({
  location,
  listing,
  imageCount,
}: StoreLocationCardProps) => {
  return (
    <Link
      href={`/listings/${listing.id}`}
      prefetch={true}
      className="block w-full cursor-pointer group mx-auto !z-0"
    >
      <div className="flex flex-col relative w-full z-0">
        <div className="relative overflow-hidden rounded-xl w-full z-0 aspect-square">
          <Carousel className="h-full w-full relative rounded-lg z-0">
            <CarouselContent className="h-full z-0">
              {listing.imageSrc.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center relative aspect-square h-full"
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1} of ${listing.title}`}
                    loading={imageCount++ < 9 ? "eager" : "lazy"}
                    fill
                    className="object-cover rounded-md hover:scale-105 transition-transform duration-200 !z-0"
                    sizes="(max-width: 540px) 100vw, (max-width: 768px) 50vw, (max-width: 1000px) 33.33vw, (max-width: 1280px) 25vw, 20vw"
                    placeholder="blur"
                    blurDataURL="/images/website-images/grey.jpg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {listing.imageSrc.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {listing.imageSrc.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white opacity-90 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </div>
            )}
          </Carousel>
        </div>

        <div className="mt-2 w-full">
          <h3 className={`${OutfitFont.className} text-lg font-semibold`}>
            {listing.title}
          </h3>
          <p
            className={`${WorkFont.className} text-xs font-light text-neutral-500`}
          >
            {location?.address[1]}, {location?.address[2]}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1 w-full">
          <div className={`${WorkFont.className} text-xs`}>
            <span className="font-semibold">${listing.price}</span>
            <span className="font-light pl-1">per {listing.quantityType}</span>
          </div>

          <StarRating
            value={listing.rating.length - 1}
            size={20}
            color="#000"
          />
        </div>
      </div>
    </Link>
  );
};
export { StoreLocationCard };
