import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "./client/ClientOnly";

interface ShopProps {
  listings: any[];
  currentUser: any;
  emptyState: React.ReactNode;
}

const Shop = ({ listings, currentUser, emptyState }: ShopProps) => {
  return (
    <ClientOnly>
      <Container>
        {emptyState || (
          <div
            className="
              pt-3
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
              <ListingCard
                currentUser={currentUser}
                key={listing.id}
                data={listing}
              />
            ))}
          </div>
        )}
      </Container>
    </ClientOnly>
  );
};

export default Shop;
