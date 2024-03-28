import { currentUser } from "@/lib/auth";
import { DashboardComp } from "@/components/dashboard/dashboard";

const DashboardPage = async () => {
  const user = await currentUser();
  return <DashboardComp user={user} />;
};

export default DashboardPage;
