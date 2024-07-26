import { UserInfo } from "@/next-auth"
import AccountOnboardingUI from "./stripe-onboarding"
interface p {
    user:UserInfo
}
const StepNine= ({user}:p) => {
    return (
        <div className="mt-10">           
            <AccountOnboardingUI user={user} />
        </div>
        )
    }
export default StepNine