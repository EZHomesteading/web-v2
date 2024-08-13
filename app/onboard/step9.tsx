import { UserInfo } from "@/next-auth";
import AccountOnboardingUI from "./stripe-onboarding";
import Loading from "../loading";
interface p {
  user: UserInfo;
}
const StepNine = ({ user }: p) => {
  return (
    <div className="my-10 h-fit">
      {user?.stripeAccountId ? (
        <AccountOnboardingUI user={user} />
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default StepNine;
