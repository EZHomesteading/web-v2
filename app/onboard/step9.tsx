import { UserInfo } from "@/next-auth"
import AccountOnboardingUI from "./stripe-onboarding"
interface p {
    user:UserInfo
}
const StepNine= ({user}:p) => {
    return (
        <div className="my-10 h-fit">           
            <AccountOnboardingUI user={user} />
        </div>
        )
    }
export default StepNine