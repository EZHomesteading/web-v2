import { BecomeCoop } from "@/app/components/auth/become/become-co-op-form";
import { currentUser } from "@/lib/auth";
const BecomeCoopPage = async () => {
  const user = await currentUser();
  return (
    <>
      <main>
        <BecomeCoop user={user} />
      </main>
    </>
  );
};

export default BecomeCoopPage;
