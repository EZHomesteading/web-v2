import { currentUser } from "@/lib/auth";
import ProducerClient from "./producerClient";

const Page = async () => {
  const user = await currentUser();
  let index = 1;

  return (
    <div>{user ? <ProducerClient index={index} user={user} /> : <></>}</div>
  );
};

export default Page;
