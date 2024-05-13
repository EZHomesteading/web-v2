import { currentUser } from "@/lib/auth";
import ClientOnly from "@/app/components/client/ClientOnly";
import ConnectClient from "./ConnectClient";
import { getSession } from "next-auth/react";
const StripeTestPage = async () => {
  // const session = getSession();
  // const user = session?.user;
  const user = await currentUser();
  return (
    <ClientOnly>
      <ConnectClient user={user} />
    </ClientOnly>
  );
};

export default StripeTestPage;
