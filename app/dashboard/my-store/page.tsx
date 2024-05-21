import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/client/ClientOnly";

import { currentUser } from "@/lib/auth";
import getListingsByUserId from "@/actions/listing/getListingsByUserId";

import PropertiesClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const user = await currentUser();
  if (!user) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const listings = await getListingsByUserId({ userId: user.id });
  console.log("COOP IN STORE", user?.hours);
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
      <PropertiesClient listings={listings} user={user} />
    </ClientOnly>
  );
};

export default PropertiesPage;
