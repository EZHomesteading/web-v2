//render market product cards on server, with toggle cart buttons
import Link from "next/link";
import { UserInfo } from "next-auth";
import { OutfitFont } from "@/components/fonts";
import { UserRole } from "@prisma/client";
import { MarketGrid, MarketCard } from "./market-card";
import Categories from "./categories";
interface DayHours {
  date: string;
  timeSlots: TimeSlot[];
  capacity: number;
}
interface TimeSlot {
  open: number;
  close: number;
}

export interface MarketListing {
  id: string;
  title: string;
  imageSrc: string[];
  price: number;
  rating: number[];
  quantityType?: string;
  stock: number;
  location: {
    displayName: string;
    address: string[];
    role: UserRole;
    hours: {
      pickup?: DayHours[];
      delivery?: DayHours[];
      [key: string]: DayHours[] | undefined;
    };
  } | null;
  minOrder?: number;
  user: {
    id: string;
    name: string;
  };
}

interface ShopProps {
  listings: MarketListing[];
  user?: UserInfo;
  emptyState: React.ReactNode;
  totalPages: number;
  prevPage: number;
  nextPage: number;
  isPageOutOfRange: boolean;
  pageNumbers: number[];
  currentPage: number;
  basketItemIds: string[];
}

const Shop = ({
  listings,
  user,
  emptyState,
  totalPages,
  isPageOutOfRange,
  pageNumbers,
  currentPage,
  basketItemIds,
}: ShopProps) => {
  let imageCount = 0;
  return (
    <>
      {emptyState || (
        <>
          <div className={`sticky top-20 w-full border-b pb-2 bg-white z-10`}>
            <Categories />
          </div>
          <MarketGrid>
            {listings.map((listing, index) => (
              <MarketCard
                user={user}
                key={index}
                listing={listing}
                imageCount={imageCount}
                basketItemIds={basketItemIds}
              />
            ))}
          </MarketGrid>
        </>
      )}
      {totalPages > 1 && (
        <>
          {isPageOutOfRange && (
            <div
              className={`flex justify-center items-end my-4 ${OutfitFont.className}`}
            >
              <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
                {pageNumbers.map((pageNumber, index) => (
                  <Link
                    key={index}
                    className={
                      currentPage === pageNumber
                        ? "bg-emerald-900 fw-bold px-2 rounded-md text-white"
                        : "hover:bg-emerald-800 hover:text-white px-1 rounded-md"
                    }
                    href={`?page=${pageNumber}`}
                  >
                    {pageNumber}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Shop;
