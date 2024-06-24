//onboarding parent element
import { currentUser } from "@/lib/auth";
import Onboarding from "./onboarding";
import { Viewport } from "next";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};
const apiKey = process.env.MAPS_KEY;
const Page = async () => {
  const user = await currentUser();
  let index = 1;

  return (
    <div>
      {user ? <Onboarding index={index} user={user} apiKey={apiKey} /> : <></>}
    </div>
  );
};

export default Page;
