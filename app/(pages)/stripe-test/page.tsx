import { currentUser } from "@/lib/auth";
import ClientOnly from "@/components/client/ClientOnly";
import ConnectClient from "@/app/(pages)/stripe-test/ConnectClient";

const StripeTestPage = async () => {
  const user = await currentUser();
  return (
    <ClientOnly>
      <ConnectClient user={user} />
    </ClientOnly>
  );
};

export default StripeTestPage;
