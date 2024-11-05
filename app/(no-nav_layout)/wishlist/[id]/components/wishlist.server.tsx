import { StarRating } from "@/app/(nav_market_layout)/market/_components/market-card";
import { workFont, zillaFont } from "@/components/fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Wishlist_ID_Page } from "wishlist";
import WishlistCounter from "./wishlist.counter";
import PriceBreakdown from "./price-breakdown";
import { Button } from "@/components/ui/button";
import Map from "@/app/(no-nav_layout)/new-location-and-hours/_components/map";
import WishlistButtons from "./wishlist-settings";
import { WishlistLocation } from "@/actions/getUser";
import MessageSeller from "./wishlist-message";
interface p {
  wishlist: Wishlist_ID_Page;
  userLocs: WishlistLocation[] | null;
}
type item = {
  quantity: number;
  price: number;
  listing: {
    id: string;
    title: string;
    quantityType: string;
    imageSrc: string[];
    stock: number;
    price: number;
    minOrder: number;
    shelfLife: string;
    rating: number[];
    createdAt: Date;
  };
};
const WishlistServer = ({ wishlist, userLocs }: p) => {
  // const time_string = week_day_mmm_dd_yy_time(540, )
  const mk = process.env.MAPS_KEY!;
  return (
    <>
      <Link
        href={`/store/${wishlist.location.user.url}/${wishlist.location.id}`}
        className={`text-4xl hover:cursor-pointer`}
      >
        {wishlist.location?.displayName || wishlist.location?.user?.name}
      </Link>
      <WishlistButtons wishlist={wishlist} userLocs={userLocs} />
      <div
        className={`w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 min-h-screen`}
      >
        <div className={`flex flex-col gap-y-2 col-span-1 xl:col-span-2`}>
          {wishlist.items.map((item: item, index: number) => (
            <div key={index} className="flex justify-start items-start gap-2">
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
                  <div
                    className={`h-[3px] w-[3px] rounded-full bg-slate-800`}
                  />
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
          ))}
        </div>
        <div className={`w-full h-full border-l col-span-1 px-1`}>
          <div className="flex flex-col justify-between gap-2 h-fit">
            <div className={`border rounded-md shadow-xl p-2 mb-2`}>
              {[
                {
                  label: "Proposed Pickup Date",
                  value: "May 12th at 5:30PM",
                },
                {
                  label: "Proposed Delivery Location",
                  value: "16901 Rivers Edge Trail W.",
                },
                {
                  label: "Proposed Delivery Date",
                  value: "May 14th at 9:00PM",
                },
                {
                  label: "Notes",
                  value:
                    "If you can deliver the produce in a cool container I would be willing to pay the delivery fee, otherwise I will just come pick up the produce.",
                  isTruncated: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${zillaFont.className} flex justify-between w-full items-start `}
                >
                  <div className={`mb-3 font-semibold text-lg`}>
                    {item.label}
                  </div>
                  <div
                    className={`${
                      item.isTruncated ? "truncate max-w-[200px]" : ""
                    }  underline`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}{" "}
              <MessageSeller wishlist={wishlist} />
            </div>
          </div>
          <div className={` rounded-t-md`}>
            <Map
              mk={mk}
              showSearchBar={false}
              subtitle=""
              center={{
                lat: wishlist.location.coordinates
                  ? wishlist.location.coordinates[1]
                  : 38,
                lng: wishlist.location.coordinates
                  ? wishlist.location.coordinates[0]
                  : -79,
              }}
              maxZ={14}
              minZ={10}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistServer;
