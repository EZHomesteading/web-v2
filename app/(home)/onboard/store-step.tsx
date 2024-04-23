import CoOpHoursPage from "@/app/(pages)/co-op-hours/co-op-hours-page";
import { UserInfo } from "@/next-auth";
import { Hours } from "@prisma/client";

interface ExtendedHours extends Hours {
  [key: number]: { open: number; close: number }[];
}

interface Props {
  coOpHours: ExtendedHours;
  setCoOpHours: React.Dispatch<React.SetStateAction<ExtendedHours>>;
  user: UserInfo;
}

const StoreStep = ({ coOpHours, setCoOpHours, user }: Props) => {
  return (
    <>
      <div>
        {user ? (
          <CoOpHoursPage
            coOpHours={coOpHours}
            setCoOpHours={setCoOpHours}
            user={user}
          />
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
