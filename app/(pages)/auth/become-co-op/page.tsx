import CoOpUpdateForm from "@/app/components/auth/update-role/co-op-form";
import { currentUser } from "@/lib/auth";

const BecomeCoopPage = () => {
  const user = currentUser();
  return (
    <>
      <div>
        <CoOpUpdateForm user={user} />
      </div>
    </>
  );
};

export default BecomeCoopPage;
