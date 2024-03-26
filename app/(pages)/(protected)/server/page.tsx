import { currentUser } from "@/lib/auth";
import { UserInfo } from "@/app/components/user-info";

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo label="💻 Server component" user={user} />;
};

export default ServerPage;
