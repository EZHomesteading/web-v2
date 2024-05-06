import { currentUser } from "@/lib/auth";
import Onboarding from "./onboarding";

const Page = async () => {
  const user = await currentUser();
  let index = 1;

  if (user) {
    if (user.hours) {
      index = 2;
    } else {
      index = 1;
    }

    if (user.hours && user.stripeAccountId && user.image) {
      index = 3;
    }
  }
  return <div>{user ? <Onboarding index={index} user={user} /> : <></>}</div>;
};

export default Page;
