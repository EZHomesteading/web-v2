import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "../../components/client/ClientOnly";
import Link from "next/link";

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
  prevPage,
  nextPage,
  isPageOutOfRange,
  pageNumbers,
  currentPage,
}: ShopProps) => {
  return (
    <ClientOnly>
      <Container>
        {emptyState || (
          <div
            className="
            pt-5
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-5
            xl:grid-cols-6
            2xl:grid-cols-7
            gap-8
            "
          >
            {listings.map((listing: any) => (
              <ListingCard user={user} key={listing.id} data={listing} />
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
                  {currentPage === 1 ? (
                    <div className="opacity-60" aria-disabled="true">
                      Previous
                    </div>
                  ) : (
                    <Link href={`?page=${prevPage}`} aria-label="Previous Page">
                      Previous
                    </Link>
                  )}
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
                  {currentPage === totalPages ? (
                    <div className="opacity-60" aria-disabled="true">
                      Next
                    </div>
                  ) : (
                    <Link href={`?page=${nextPage}`} aria-label="Next Page">
                      Next
                    </Link>
                  )}
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
