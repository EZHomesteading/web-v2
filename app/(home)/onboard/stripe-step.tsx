import AccountOnboardingUI from "./stripe-onboarding";
import { UserInfo } from "@/next-auth";
interface Props {
  user: UserInfo;
  formData: any;
  setFormData: any;
}
const StripeStep = async ({ user, formData, setFormData }: Props) => {
  return <>{user ? <AccountOnboardingUI user={user} /> : <></>}</>;
};

export default StripeStep;
