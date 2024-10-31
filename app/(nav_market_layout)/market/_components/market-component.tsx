//render market product cards on server, with toggle cart buttons
import Container from "@/components/Container";
import ClientOnly from "@/components/client/ClientOnly";
import Link from "next/link";
import SessionStorageManager from "@/components/sessionStorageManager";
import { UserInfo } from "next-auth";
import { outfitFont } from "@/components/fonts";
import { UserRole } from "@prisma/client";
import MarketCard from "./market-card";

export interface MarketListing {
  id: string;
  title: string;
  imageSrc: string[];
  price: number;
  rating: number[];
  quantityType?: string;
  location: {
    address: string[];
    role: UserRole;
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
}

const Shop = ({
  listings,
  user,
  emptyState,
  totalPages,
  isPageOutOfRange,
  pageNumbers,
  currentPage,
}: ShopProps) => {
  return (
    <ClientOnly>
      <SessionStorageManager />
      <Container>
        {emptyState || (
          <div className="pt-[140px] pb-[90px] sm:pb-0 md:pt-5 grid  grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings.map((listing, index) => (
              <MarketCard user={user} key={index} listing={listing} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <>
            {isPageOutOfRange && (
              <div
                className={`flex justify-center items-end my-4 ${outfitFont.className}`}
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
      </Container>
    </ClientOnly>
  );
};

export default Shop;
