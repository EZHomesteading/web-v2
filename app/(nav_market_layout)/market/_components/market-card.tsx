import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { UserInfo } from "next-auth";
import { outfitFont, workFont } from "@/components/fonts";
import { MarketListing } from "./market-component";
import Link from "next/link";

interface ListingCardProps {
  listing: MarketListing;
  user?: UserInfo;
}

const StarRating = ({
  value,
  size = 20,
  color = "#000",
}: {
  value: number;
  size: number;
  color: string;
}) => {
  const totalStars = 4;
  const roundedValue = Math.round(value * 2) / 2;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const filled = index < roundedValue;
        const halfFilled = !filled && index < Math.ceil(roundedValue);

        return (
          <span
            key={index}
            className="inline-block"
            style={{ width: size, height: size }}
          >
            {halfFilled ? (
              <svg
                viewBox="0 0 24 24"
                fill={color}
                style={{ width: size, height: size }}
              >
                <path
                  d="M12 2L8.5 8.5L2 9.3L7 14.1L5.5 20.5L12 17.5L18.5 20.5L17 14.1L22 9.3L15.5 8.5L12 2Z"
                  clipPath="inset(0 50% 0 0)"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill={filled ? color : "none"}
                stroke={color}
                strokeWidth="2"
                style={{ width: size, height: size }}
              >
                <path d="M12 2L8.5 8.5L2 9.3L7 14.1L5.5 20.5L12 17.5L18.5 20.5L17 14.1L22 9.3L15.5 8.5L12 2Z" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};

const MarketCard: React.FC<ListingCardProps> = ({ listing, user }) => {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col relative">
        <div className="relative overflow-hidden rounded-xl">
          <Carousel className="relative rounded-lg">
            <CarouselContent>
              {listing.imageSrc.map((src, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex items-center justify-center relative aspect-square h-[16.5rem]">
                      <Image
                        src={src}
                        alt={`Carousel Image ${index + 1}`}
                        fill
                        className="object-cover rounded-md hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) 100vw, (max-width: 764px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        placeholder="blur"
                        blurDataURL="/images/website-images/grey.jpg"
                      />
                    </CardContent>
                  </Card>
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

        <div className="mt-2">
          <h3 className={`${outfitFont.className} text-lg font-semibold`}>
            {listing.title}
          </h3>
          <p
            className={`${workFont.className} text-xs font-light text-neutral-500`}
          >
            {listing?.location?.address[1]}, {listing?.location?.address[2]}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div
            className={`${workFont.className} text-sm flex items-center gap-1`}
          >
            <span className="font-semibold">${listing.price}</span>
            <span className="font-light">per {listing.quantityType}</span>
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

export default MarketCard;
