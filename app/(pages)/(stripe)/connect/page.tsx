//server side page layout for the stripe/connect routs
import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";
import ConnectClient from "./ConnectClient";
const StripeTestPage = async () => {
  const user = await currentUser();
  return (
    <ClientOnly>
      <ConnectClient user={user} />
    </ClientOnly>
  );
};

export default StripeTestPage;
