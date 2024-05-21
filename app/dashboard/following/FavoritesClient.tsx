import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import FollowCard from "@/app/components/follow/FollowCard";
import getUserById from "@/actions/user/getUserById";
import { UserInfo } from "@/next-auth";

interface FavoritesClientProps {
  follows: any;
  user?: UserInfo | null;
  followarr: any;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  follows,
  followarr,
  user,
}) => {
  return (
    <Container>
      <Heading title="Following" subtitle="List of stores you're following!" />
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
        {follows.map(async (follow: any) => {
          const userId = follow;
          const shop = await getUserById({ userId });
          return (
            <FollowCard
              user={user}
              key={shop?.id}
              data={shop}
              followarr={followarr}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default FavoritesClient;
