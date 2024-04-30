import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "@/app/components/client/ClientOnly";
import OpenStatus from "@/app/(pages)/store/[storeId]/status";
import Avatar from "@/app/components/Avatar";
import { Outfit } from "next/font/google";
import Bio from "./bio";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  style: "normal",
});
interface StorePageProps {
  listings: any[];
  storeUser: any;
  user: any;
  emptyState: React.ReactNode;
}

const StorePage = ({
  listings,
  storeUser,
  user,
  emptyState,
}: StorePageProps) => {
  return (
    <ClientOnly>
      <Container>
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            <Avatar />
            <div
              className={`${outfit.className} weight-100 flex flex-col ml-2`}
            >
              <div className="flex flex-row items-center gap-x-2">
                <div className="font-bold text-2xl lg:text-4xl">
                  {storeUser?.name}
                </div>
                <OpenStatus hours={storeUser.hours} />
              </div>
              <div>{storeUser?.firstName}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Bio user={storeUser} />
          </div>
        </div>

        {emptyState || (
          <div
            className="
              pt-2
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
              gap-8
            "
          >
            {listings.map((listing: any) => (
              <ListingCard user={storeUser} key={listing.id} data={listing} />
            ))}
          </div>
        )}
      </Container>
    </ClientOnly>
  );
};

export default StorePage;
