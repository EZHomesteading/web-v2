//create listing server parent element
import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";
import type { Viewport } from "next";
import CreatePopup from "../(home)/info-modals/create-info-modal";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};
const Page = async () => {
  const user = await currentUser();
  let index = 1;
  return <div>{user ?<><CreateClient index={index} user={user} /><CreatePopup /></>  : <></>}</div>;
};

export default Page;
