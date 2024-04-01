import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "@/app/components/client/ClientOnly";

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
        <div className="text-5xl">{storeUser?.name}</div>
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
