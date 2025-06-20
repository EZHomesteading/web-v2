"use client";
//listing card component, can be mapped over to create multiple cards on same page.
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Key, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MdOutlineEdit } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Work_Sans } from "next/font/google";
import { FinalListing } from "@/actions/getListings";
import ReactStars from "react-stars";
import { Popover, PopoverTrigger, PopoverContent } from "./error-popover";
import { BiError } from "react-icons/bi";
import { UserInfo } from "next-auth";
import { outfitFont, workFont } from "@/components/fonts";
import { UserRole } from "@prisma/client";
import { MarketListing } from "@/app/(nav_market_layout)/market/(components)/market-component";

interface ListingCardProps {
  data: MarketListing;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  secondActionId?: string;
  secondActionLabel?: string;
  onSecondAction?: (id: string) => void;
  user?: UserInfo;
  storeUser: {
    id: string;
    role: UserRole;
  };
  priority?: boolean;
  review?: boolean | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  review,
  data,
  onAction,
  disabled,
  actionLabel,
  actionId,
  user,
  secondActionId,
  onSecondAction,
  secondActionLabel,
  storeUser,
  priority,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId || "");
    },
    [disabled, onAction, actionId]
  );

  const handleCardClick = useCallback(() => {
    if (pathname !== "/dashboard/my-store") {
      router.push(`/listings/${data.id}`);
    }
  }, [router, data.id, pathname]);

  const handleSecondAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onSecondAction?.(secondActionId || "");
    },
    [disabled, onSecondAction, secondActionId]
  );

  const hasError = !data.location || !data.location.hours || review;
  return (
    <div className="col-span-1 cursor-pointer group">
      <div className="flex flex-col w-full relative">
        <div
          onClick={handleCardClick}
          className="w-full relative overflow-hidden rounded-xl"
        >
          <Carousel className="relative rounded-lg">
            <CarouselContent>
              {data.imageSrc.map((_: any, index: number) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex items-center justify-center relative aspect-sqaure h-[16.5rem]">
                      <Image
                        src={data.imageSrc[index]}
                        alt={`Carousel Image ${index + 1}`}
                        fill
                        className="object-cover rounded-md hover:scale-105"
                        sizes="(max-width: 640) 100vw, (max-width: 764px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        priority={index === 0 && priority}
                        placeholder="blur"
                        blurDataURL="/images/website-images/grey.jpg"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {data.imageSrc.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {data.imageSrc.map((_: any, index: Key | null | undefined) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-white opacity-90 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </div>
            )}
          </Carousel>
          {hasError && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:justify-start sm:pl-[10%]">
              <Popover>
                <PopoverTrigger className="text-white">
                  <div className="flex flex-col items-center justify-center">
                    <BiError className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center max-w-[150px]">
                      Listing not visible yet, see why
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="center" className="z-50">
                  <div className="text-sm">
                    {!data.location || review
                      ? review
                        ? "This item is under review by Admins as it's title is custom"
                        : "This item has no location set and is not visible to buyers. Go to store settings to set up this location, or change its location."
                      : "This item has no hours set and is not visible to buyers. Go to store settings to set up hours for this location, or change its location."}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="font-semibold text-lg">
          <div className={`${outfitFont.className} text-lg`}>{data.title}</div>
          <div
            className={`font-light text-neutral-500 text-xs ${workFont.className}`}
          >
            {data?.location?.address && (
              <>
                {data?.location?.address[1]}, {data?.location?.address[2]}
              </>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-600 ">
          <ReactStars
            count={4}
            size={20}
            color2={"#000"}
            value={data.rating.length - 1}
            half={true}
            edit={false}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="flex w-full justify-start">
            <div
              className={`flex flex-row items-center gap-1 text-sm ${workFont.className}`}
            >
              <div className="font-semibold"> ${data.price}</div>

              <div className="font-light">per {data.quantityType}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger>
                {onAction && actionLabel && (
                  <Button className="bg-transparent shadow-none text-red-600 text-3xl hover:bg-transparent hover:scale-105 pt-0">
                    <FaDeleteLeft />
                  </Button>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black rounded-lg px-4 py-4 w-fit ">
                <AlertDialogHeader className="text-3xl">
                  Are you sure?
                </AlertDialogHeader>
                <AlertDialogDescription className="text-white pt-2">
                  We cannot recover a listing after it has been deleted, this is
                  irreversible.
                </AlertDialogDescription>
                <AlertDialogFooter className="flex items-center justify-start gap-x-5 pt-3">
                  <AlertDialogAction
                    className="shadow-none bg-red-600 text-3xl hover:bg-red-700 text-md"
                    onClick={handleCancel}
                  >
                    Yes, I&apos;m sure
                  </AlertDialogAction>
                  <AlertDialogCancel className=" shadow-none bg-green-600 text-3xl hover:bg-green-700 text-md text-white border-none hover:text-white m-0">
                    Nevermind
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {onSecondAction && secondActionLabel && (
          <Button
            disabled={disabled}
            onClick={handleSecondAction}
            className="absolute bg-transparent shadow-none text-3xl text-yellow-300 mt-2 ml-2 hover:bg-transparent hover:text-yellow-400"
          >
            <MdOutlineEdit />
          </Button>
        )}{" "}
      </div>
    </div>
  );
};

export default ListingCard;
