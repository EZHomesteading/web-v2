import Cancel from "@/components/icons/cancel-svg";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
interface Props {
  images: string[];
  handleInfoWindowClose: () => void;
}
const InfoWindowCarousel = ({ images = [], handleInfoWindowClose }: Props) => {
  return (
    <Carousel className="relative w-80">
      <CarouselContent className="rounded-t-md">
        {images?.map((image, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex items-center justify-center relative aspect-video rounded-t-md">
                <Image
                  src={image}
                  alt={`Carousel Image ${index + 1}`}
                  fill
                  className="object-cover rounded-t-md"
                  sizes="(max-width: 640) 100vw, (max-width: 764px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
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
