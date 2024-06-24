//coop hours parent element
import CoOpHoursPage from "@/app/components/co-op-hours/co-op-hours-page";
import { UserInfo } from "@/next-auth";
import HoursLocationContainer from "../dashboard/my-store/settings/location-hours-container";

interface Props {
  user: UserInfo;
  apiKey?: string;
}

const StoreStep = ({ user, apiKey }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center w-full pt-2">
        {user ? (
          <div>{apiKey && <CoOpHoursPage user={user} apiKey={apiKey} />}</div>
        ) : (
          <div className="flex h-screen items-center justify-center">
            You must be logged in as a co-op to access this page
          </div>
        )}
      </div>
    </>
  );
};

export default StoreStep;
