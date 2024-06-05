//create listing server parent element
import { currentUser } from "@/lib/auth";
import CreateClient from "./CreateClient";

const Page = async () => {
  const user = await currentUser();
  let index = 1;
  const apiKey = process.env.MAPS_KEY as string;
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
