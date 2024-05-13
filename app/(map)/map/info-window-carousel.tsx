import Cancel from "@/app/components/icons/cancel-svg";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import Image from "next/image";

interface Props {
  images: string[];
  handleInfoWindowClose: () => void;
}

const InfoWindowCarousel = ({ images, handleInfoWindowClose }: Props) => {
  return (
    <Carousel className="relative w-80">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex items-center justify-center relative aspect-video">
                <Image
                  src={image[0]}
                  alt={`Carousel Image ${index + 1}`}
                  fill
                  className="object-cover rounded-t-md"
                />
                <button
                  className="text-black bg-white rounded-full hover:text-gray-700 absolute top-1 right-1 h-5 w-5 flex items-center justify-center"
                  onClick={handleInfoWindowClose}
                >
                  <Cancel />
                </button>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselNext className="absolute top-1/2 right-1" />
          <CarouselPrevious className="absolute top-1/2 left-1" />
        </>
      )}
    </Carousel>
  );
};

export default InfoWindowCarousel;
