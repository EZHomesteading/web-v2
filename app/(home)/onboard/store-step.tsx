import CoOpHoursPage from "@/app/(pages)/co-op-hours/store-hours";
import { currentUser } from "@/lib/auth";
const StoreStep = async ({ formData }: any) => {
  const user = await currentUser();
  return (
    <>
      <div>
        {user ? (
          <CoOpHoursPage user={user} />
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
