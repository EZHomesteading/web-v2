//display followers page

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import FollowCard from "@/app/components/follow/FollowCard";
import { getFavCardUser } from "@/actions/getUser";
interface FavoritesClientProps {
  followarr: any;
  myFollow: any;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  followarr,
  myFollow,
}) => {
  return (
    <Container>
      <Heading title="Followers" subtitle="List of people following you." />
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
        {followarr.map(async (follow: any) => {
          const shop = await getFavCardUser({ userId: follow.userId });
          return (
            <FollowCard
              user={follow.userId}
              key={shop?.id}
              data={shop}
              followarr={myFollow}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default FavoritesClient;
