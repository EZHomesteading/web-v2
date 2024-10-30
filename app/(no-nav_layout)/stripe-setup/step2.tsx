import AccountOnboardingUI from "./stripe-onboarding";
import Loading from "@/app/loading";
import { UserInfo } from "next-auth";
import { Dispatch, SetStateAction } from "react";
interface p {
  user: UserInfo;
  setFinish: Dispatch<SetStateAction<boolean>>;
}
const StepTwo = ({ user, setFinish }: p) => {
  return (
    <div className="flex-1 flex items-center justify-center px-6 sm:px-20 mt-16 mb-20">
      <div className="w-full max-w-2xl">
        {user?.stripeAccountId ? (
          <AccountOnboardingUI user={user} setFinish={setFinish} />
        ) : (
          <Loading />
        )}
      </div>{" "}
    </div>
  );
};
export default StepTwo;
