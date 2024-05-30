//phone view emulator
import { QuantityTypeValue } from "./UnitSelect";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/components/ui/carousel";
import { Card, CardContent } from "@/app/components/ui/card";
import Image from "next/image";
import Heading from "@/app/components/Heading";
import { UserInfo } from "@/next-auth";
import Avatar from "@/app/components/Avatar";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
interface EmulatorProps {
  product?: any;
  description?: string;
  stock?: number;
  quantityType: QuantityTypeValue | undefined;
  price?: number;
  imageSrc: string[];
  user?: UserInfo;
  shelfLife?: number;
  city?: string;
  state?: string;
}

const Emulator = ({
  product,
  description,
  stock,
  quantityType,
  price,
  imageSrc = [],
  user,
  shelfLife,
  city,
  state,
}: EmulatorProps) => {
  let expiryDate = "";
  if (shelfLife) {
    const endDate = addDays(new Date(), shelfLife);
    expiryDate = format(endDate, "MMM d, yyyy");
  }
  const [showOverlay, setShowOverlay] = useState(false);
  const [v, setV] = useState(false);
  const handleMouseEnter = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
    }, 500);
  };

  return (
    <>
      {v === false && (
        <Button
          onClick={() => {
            setV(true);
          }}
        >
          Show Mobile Preview
        </Button>
      )}
      <div
        className="relative w-full max-w-xs mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowOverlay(false)}
        onClick={() => {
          setV(false);
        }}
      >
        {v && (
          <div className="relative w-full max-w-xs mx-auto">
            <div className="absolute inset-0 bg-black rounded-3xl"></div>
            <div className="relative bg-white shadow-lg rounded-[30px] mx-2 my-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-12 bg-black rounded-t-[30px] flex justify-center items-center z-10">
                <div className="w-24 h-1 bg-gray-400 rounded"></div>
              </div>
              <div className="pt-12 pb-12 h-[600px] overflow-y-auto">
                <div className="w-full h-[30vh] overflow-hidden rounded-xl relative px-1 pt-1">
                  {Array.isArray(imageSrc) && imageSrc.length > 0 && (
                    <Carousel>
                      <CarouselContent className="h-[30vh]">
                        {imageSrc.map((_, index) => (
                          <CarouselItem key={index}>
                            <Card>
                              <CardContent className="flex items-center justify-center relative aspect-square h-[30vh]">
                                <Image
                                  src={imageSrc[index]}
                                  fill
                                  className="object-cover w-full rounded-lg"
                                  alt={product?.label}
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
                  )}
                </div>
                <div className="mt-2 px-4">
                  <Heading
                    title={product?.label}
                    subtitle={
                      city && state ? `${city}, ${state}` : city || state || ""
                    }
                  />
                  <div className="col-span-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                      <div className="text-md font-semibold flex flex-row items-center">
                        <span style={{ marginRight: "5px" }}>Sold by</span>
                        <span className="flex items-center gap-1 hover:cursor-pointer">
                          <span className="mt-3">
                            <Avatar image={user?.image} />
                          </span>
                          <span>{user?.name}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-light text-neutral-500 p-1 break-words">
                    {description}
                  </div>
                  <hr />
                  <div className="flex flex-row items-center p-1">
                    {stock} {quantityType?.value} remaining at ${price}
                    {quantityType && (
                      <div className="font-light pl-[5px]">
                        per {quantityType.value}
                      </div>
                    )}
                  </div>
                  <hr />
                  {shelfLife ? (
                    <div className="p-1">
                      Expected Expiry Date: {expiryDate}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black rounded-b-[30px] z-10"></div>
            </div>
            <div className="absolute top-14 right-0 w-1 h-10 bg-black rounded-l z-20"></div>
            <div className="absolute top-40 right-0 w-1 h-20 bg-black rounded-l z-20"></div>
          </div>
        )}

        <div
          className={`absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-30 mx-2 my-6 transition-opacity duration-300 ease-in-out ${
            showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="text-white text-xl">Click to hide</span>
        </div>
      </div>
    </>
  );
};

export default Emulator;
