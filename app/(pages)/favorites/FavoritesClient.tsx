import { SafeListing } from "@/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import { UserInfo } from "@/next-auth";

interface FavoritesClientProps {
  listings: SafeListing[];
  user?: UserInfo | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings,
  user,
}) => {
  return (
    <Container>
      <Heading title="Favorites" subtitle="List of produce you favorited!" />
      <div
        className="
          mt-10
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
          <ListingCard user={user} key={listing.id} data={listing} />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
