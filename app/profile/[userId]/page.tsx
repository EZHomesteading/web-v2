//user profile page parent element
import ClientOnly from "@/app/components/client/ClientOnly";
import ProfileClient from "./ProfileClient";
import { getUserWithBuyReviews } from "@/actions/getUser";
interface IParams {
  userId: string;
}

const ProfilePage = async ({ params }: { params: IParams }) => {
  const { userId } = params;
  const data = await getUserWithBuyReviews({ userId: userId });
  if (!data) {
    return <div>No user found</div>;
  }

  const { user, reviews } = data;
  if (!user) {
    return <div></div>;
  }
  return (
    <ClientOnly>
      <ProfileClient user={user} reviews={reviews} />
    </ClientOnly>
  );
};

export default ProfilePage;
