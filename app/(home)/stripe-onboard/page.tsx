import AccountOnboardingUI from "@/app/(home)/onboard/stripe-onboarding";
import { currentUser } from "@/lib/auth";

const StripeStep = async () => {
  const user = await currentUser();
  return <AccountOnboardingUI user={user} />;
};

export default StripeStep;
