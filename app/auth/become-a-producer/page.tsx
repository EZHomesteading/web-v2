//server layout for producer conversion
import { BecomeProducer } from "@/app/components/auth/become/become-producer-form";
import { currentUser } from "@/lib/auth";

const BecomeProducerPage = async () => {
  const user = await currentUser();
  return (
    <>
      <main>
        <BecomeProducer user={user} />
      </main>
    </>
  );
};

export default BecomeProducerPage;
