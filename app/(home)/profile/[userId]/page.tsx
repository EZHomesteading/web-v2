import getUserById from "@/actions/user/getUserById";
import ClientOnly from "@/app/components/client/ClientOnly";
import ProfileClient from "@/app/(home)/profile/[userId]/ProfileClient";

interface IParams {
  userId?: string;
}

const ProfilePage = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params);

  return (
    <ClientOnly>
      {user ? <ProfileClient user={user} /> : <>No user found</>}
    </ClientOnly>
  );
};

export default ProfilePage;
