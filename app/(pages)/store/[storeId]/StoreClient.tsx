import { SafeListing } from "@/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import { UserInfo } from "@/next-auth";

interface PropertiesClientProps {
  listings: SafeListing[];
  user?: UserInfo | null;
  storeId: string;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  user,
  storeId,
}) => {
  const userSpecificListings = listings.filter(
    (listing) => listing.userId === storeId
  );

  return (
    <Container>
      <Heading
        title={`${user?.name}'s Store`}
        subtitle="List of this user's homesteading & self-sufficiency items"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {userSpecificListings.map((listing) => (
          <ListingCard key={listing.id} data={listing} user={user} />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
