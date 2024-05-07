import getUserById from "@/actions/user/getUserById";
import ClientOnly from "@/app/components/client/ClientOnly";
import ProfileClient from "@/app/(home)/profile/[userId]/ProfileClient";
import getBuyerReviews from "@/actions/reviews/getBuyerReviews";
import getBuyerAvg from "@/actions/reviews/getBuyerAvg";

interface IParams {
  userId: string;
}

const ProfilePage = async ({ params }: { params: IParams }) => {
  const { userId } = params;
  const buyerRevs = await getBuyerReviews({ reviewedId: userId });
  const profileUser = await getUserById({ userId: userId });
  const average = getBuyerAvg({ reviewedId: userId });
  return (
    <ClientOnly>
      {buyerRevs ? (
        <ProfileClient
          buyerRevs={buyerRevs}
          user={profileUser}
          average={average}
        />
      ) : (
        <>No user found</>
      )}
    </ClientOnly>
  );
};

export default ProfilePage;
