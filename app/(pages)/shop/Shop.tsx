import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";
import ClientOnly from "@/components/client/ClientOnly";

interface ShopProps {
  listings: any[];
  user: any;
  emptyState: React.ReactNode;
}

const Shop = ({ listings, user, emptyState }: ShopProps) => {
  return (
    <ClientOnly>
      <Container>
        {emptyState || (
          <div
            className="
              pt-2
              grid 
              grid-cols-2
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4
              xl:grid-cols-5
              gap-4
            "
          >
            {listings.map((listing: any) => (
              <ListingCard user={user} key={listing.id} data={listing} />
            ))}
          </div>
        )}
      </Container>
    </ClientOnly>
  );
};

export default Shop;
