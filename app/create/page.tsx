//create listing server parent element
import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";
import type { Viewport } from "next";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
};
const Page = async () => {
  const user = await currentUser();
  let index = 1;
  return <div>{user ? <CreateClient index={index} user={user} /> : <></>}</div>;
};

export default Page;
