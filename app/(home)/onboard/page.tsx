import { currentUser } from "@/lib/auth";
import Onboarding from "./onboarding";

const Page = async () => {
  const user = await currentUser();
  return (
    <div>
      <Onboarding user={user} />
    </div>
  );
};

export default Page;
