//stripe setup parent element
import AccountOnboardingUI from "./stripe-onboarding";
import { UserInfo } from "@/next-auth";
interface Props {
  user: UserInfo;
}
const StripeStep = ({ user }: Props) => {
  return <>{user ? <AccountOnboardingUI user={user} /> : <></>}</>;
};

export default StripeStep;
