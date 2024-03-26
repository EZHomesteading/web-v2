import { currentUser } from "@/lib/auth";
import { UserInfoPage } from "@/app/components/user-info";

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfoPage label="💻 Server component" user={user} />;
};

export default ServerPage;
