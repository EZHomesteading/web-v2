//coop hours parent element
import CoOpHoursPage from "@/app/components/co-op-hours/co-op-hours-page";
import { UserInfo } from "@/next-auth";

interface Props {
  user: UserInfo;
  apiKey?: string;
}

const StepThree = ({ user, apiKey }: Props) => {
  return (
    <div className="flex justify-center items-center h-full">
      {user ? (
        <div>{apiKey && <CoOpHoursPage user={user} apiKey={apiKey} />}</div>
      ) : (
        <div className="flex items-center justify-center">
          You must be logged in as a co-op to access this page
        </div>
      )}
    </div>
  );
};

export default StepThree;
