//render market product cards on server, with toggle cart buttons
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "../../components/client/ClientOnly";
import Link from "next/link";
import SessionStorageManager from "@/app/components/sessionStorageManager";

interface ShopProps {
  listings: any[];
  user: any;
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
          <div className="pt-2 md:pt-5 grid  grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings.map((listing: any, index) => (
              <ListingCard
                user={user}
                key={listing.id}
                data={listing}
                storeUser={listing.user}
                priority={index === 0}
              />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <>
            {isPageOutOfRange ? (
              <></>
            ) : (
              <div className="flex justify-center items-end mt-16">
                <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
                  {/* builds cards dynamically based on data passed in */}
                  {pageNumbers.map((pageNumber, index) => (
                    <Link
                      key={index}
                      className={
                        currentPage === pageNumber
                          ? "bg-green-600 fw-bold px-2 rounded-md text-black"
                          : "hover:bg-green-600 px-1 rounded-md"
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
