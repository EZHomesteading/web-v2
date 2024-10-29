//display followers page

import Heading from "@/components/Heading";
import Container from "@/components/Container";
import FollowCard from "@/components/follow/FollowCard";
import { getFavCardUser } from "@/actions/getUser";
interface FavoritesClientProps {
  followarr: {
    id: string;
    userId: string;
    follows: string[];
  }[];
  myFollow:
    | {
        id: string;
        userId: string;
        follows: string[];
      }
    | null
    | undefined;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  followarr,
  myFollow,
}) => {
  return (
    <Container>
      <Heading title="Followers" subtitle="List of people following you." />
      <div className="mt-10">
        <div className="flex flex-wrap gap-4 justify-start">
          {followarr.map(async (follow) => {
            const shop = await getFavCardUser({ userId: follow.userId });
            return (
              <FollowCard key={shop?.id} data={shop} followarr={myFollow} />
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default FavoritesClient;
