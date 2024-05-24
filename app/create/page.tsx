import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";

const Page = async () => {
  const user = await currentUser();
  let index = 1;

  return <div>{user ? <CreateClient index={index} user={user} /> : <></>}</div>;
};

export default Page;
