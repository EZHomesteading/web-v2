import getCurrentUser from "@/app/actions/getCurrentUserAsync";
import ClientOnly from "@/app/components/client/ClientOnly";
import ConnectClient from "./ConnectClient";

const StripeTestPage = async () => {
  const currentUser = await getCurrentUser();
  return (
    <ClientOnly>
      <ConnectClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default StripeTestPage;
