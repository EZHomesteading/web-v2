//my listing page parent element
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";
import { currentUser } from "@/lib/auth";
import { GetListingsByUserId } from "@/actions/getListings";
import ListingsClient from "./ListingsClient";

const PropertiesPage = async () => {
  const user = await currentUser();
  if (!user) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const listings = await GetListingsByUserId({ userId: user.id });
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No products found"
          subtitle="You dont have any items in your store"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingsClient listings={listings} user={user} />
    </ClientOnly>
  );
};

export default PropertiesPage;
