import getUserById from "@/actions/user/getUserById";
import ClientOnly from "@/app/components/client/ClientOnly";
import ProfileClient from "@/app/(home)/profile/[userId]/ProfileClient";
import getUserWithBuyReviews from "@/actions/user/getUserWithBuyReviews";
interface IParams {
  userId: string;
}

const ProfilePage = async ({ params }: { params: IParams }) => {
  const { userId } = params;
  const profileUser = await getUserWithBuyReviews({ userId: userId });
  return (
    <ClientOnly>
      {profileUser ? <ProfileClient user={profileUser} /> : <>No user found</>}
    </ClientOnly>
  );
};

export default ProfilePage;
