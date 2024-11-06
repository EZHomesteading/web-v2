import Link from "next/link";
import { item } from "./server.wishlist";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { workFont } from "@/components/fonts";
import PriceBreakdown from "./price-breakdown";
import { StarRating } from "@/app/(nav_market_layout)/market/_components/market-card";
import WishlistCounter from "./quantity-set.wishlist";

const WishlistCard = ({ item }: { item: item }) => {
  return (
    <>
      <div className="flex justify-start items-start gap-2">
        <Link
          href={`/listings/${item.listing.id}`}
          className="cursor-pointer group"
        >
          <div className="relative overflow-hidden rounded-xl  h-[150px] aspect-square w-[150px]">
            <Carousel className="h-full w-full relative rounded-md">
              <CarouselContent className="h-full">
                {item.listing.imageSrc.map((src, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center relative aspect-square h-full"
                  >
                    <Image
                      src={src}
                      alt={`Carousel Image ${index + 1}`}
                      fill
                      className="object-cover rounded-md hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 540px) 100vw, (max-width: 768px) 50vw, (max-width: 1000px) 33.33vw, (max-width: 1280px) 25vw, 20vw"
                      placeholder="blur"
                      blurDataURL="/images/website-images/grey.jpg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {item.listing.imageSrc.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {item.listing.imageSrc.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-white opacity-90 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </Carousel>
          </div>
        </Link>
        <div className="relative h-full">
          <div>{item.listing.title}</div>
          <div
            className={`${workFont.className} text-sm flex items-center gap-1`}
          >
            <span className="font-semibold">${item.listing.price}</span>
            <span className="font-light">
              per {item.listing.quantityType}
            </span>{" "}
            <div className={`h-[3px] w-[3px] rounded-full bg-slate-800`} />
            <PriceBreakdown
              price={item.listing.price}
              quantity={item.quantity}
              quantityType={item.listing.quantityType}
              total={item.listing.price * item.quantity}
            />
          </div>

          <StarRating
            value={item.listing.rating.length - 1}
            size={20}
            color="#000"
          />
          <WishlistCounter num={item.quantity} />
        </div>
      </div>
    </>
  );
};

export default WishlistCard;
