import { UserInfo } from "@/next-auth";
import AccountOnboardingUI from "./stripe-onboarding";
import Loading from "../loading";
interface p {
  user: UserInfo;
}
const StepEleven = ({ user }: p) => {
  return (
    <div className="sm:my-10 mb-2 h-fit px-2">
      {user?.stripeAccountId ? (
        <AccountOnboardingUI user={user} />
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default StepEleven;
