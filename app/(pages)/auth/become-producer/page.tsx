import ProducerUpdateForm from "@/components/auth/update-role/producer-form";
import { currentUser } from "@/lib/auth";

const BecomeProducerPage = () => {
  const user = currentUser();
  return (
    <>
      <div>
        <ProducerUpdateForm user={user} />
      </div>
    </>
  );
};

export default BecomeProducerPage;
