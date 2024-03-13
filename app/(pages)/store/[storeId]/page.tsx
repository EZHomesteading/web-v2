import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import getListings from "@/app/actions/getListings";
import currentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/client/ClientOnly";
import getUserById from "@/app/actions/getUserById";

const StorePage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  const listings = await getListings({ userId: storeId });
  const user = await getUserById({ userId: storeId });
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="text-5xl">{user?.name}</div>
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
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default StorePage;
