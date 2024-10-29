//onboarding parent element
import StripeSetup from "./stripesetup";
import { Viewport } from "next";
import authCache from "@/auth-cache";

export const viewport: Viewport = {
  themeColor: "#fff",
};

const Page = async () => {
  const session = await authCache();
  if (!session?.user.id) {
    return;
  }

  console.log(session?.user);
  return (
    <>
      <>{session?.user && <StripeSetup user={session?.user} />}</>
    </>
  );
};

export default Page;
