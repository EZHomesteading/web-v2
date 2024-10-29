//display people a user is following page
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import FollowCard from "@/components/follow/FollowCard";
import { getFavCardUser } from "@/actions/getUser";

interface FavoritesClientProps {
  follows: string[];
  followarr: {
    id: string;
    userId: string;
    follows: string[];
  };
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  follows,
  followarr,
}) => {
  return (
    <Container>
      <Heading title="Followers" subtitle="List of people following you." />
      <div className="mt-10">
        <div className="flex flex-wrap gap-4 justify-start">
          {follows.map(async (follow: string) => {
            const userId = follow;
            const shop = await getFavCardUser({ userId });
            return (
              <FollowCard key={shop?.id} data={shop} followarr={followarr} />
            );
          })}
        </div>{" "}
      </div>
    </Container>
  );
};

export default FavoritesClient;
