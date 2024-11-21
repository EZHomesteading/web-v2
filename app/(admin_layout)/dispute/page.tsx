//admin only disputes page parent element
import getDisputes from "@/actions/getDisputes";
import authCache from "@/auth-cache";
import { UserRole } from "@prisma/client";
import DisputeComponent from "./(components)/dispute.client";

const DisputePage = async () => {
  const session = await authCache();
  const disputes = await getDisputes();
  return (
    <>
      {session?.user?.role === UserRole.ADMIN ? (
        <DisputeComponent disputes={disputes} />
      ) : (
        <div className="bg-black h-screen w-screen flex justify-center items-center text-white">
          Admin Page
        </div>
      )}
    </>
  );
};

export default DisputePage;
