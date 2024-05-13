import Home from "@/app/(home)/consumer-home";
import CoopHome from "./coop-home";
import ProducerHome from "./proucer-home";
import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";

const HomePage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        user?.role == UserRole.COOP ? (
          <CoopHome user={user} />
        ) : user?.role == UserRole.PRODUCER ? (
          <ProducerHome user={user} />
        ) : (
          <Home />
        )
      ) : (
        <Home />
      )}
    </>
  );
};

export default HomePage;
