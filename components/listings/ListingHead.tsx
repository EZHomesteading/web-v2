import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
interface ListingHeadProps {
  listing: any;
}

const ListingHead = ({ listing }: ListingHeadProps) => {
  return (
    <>
      <div
        className="
          w-full
          h-[60vh]
          overflow-hidden 
          relative
          pt-16
        "
      >
        <Carousel>
          <CarouselContent className="h-[60vh]">
            {listing.imageSrc.map((_: any, index: number) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center relative aspect-sqaure h-[60vh] lg:rounded-md"
              >
                <Image
                  src={listing.imageSrc[index]}
                  fill
                  className="object-cover w-full lg:border"
                  alt={listing.title}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {listing.imageSrc.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {listing.imageSrc.map((_: any, index: number) => (
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
        />
      </div>
    </>
  );
};

export default ListingHead;
