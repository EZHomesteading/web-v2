//create listing server parent element
import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";
const apiKey = process.env.MAPS_KEY as string;
const Page = async () => {
  const user = await currentUser();
  let index = 1;

  return (
    <div>
      {user ? (
        <CreateClient index={index} user={user} apiKey={apiKey} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Page;
