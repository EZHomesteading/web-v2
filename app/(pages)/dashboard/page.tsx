import { ExtendedUser } from "@/next-auth";
import { DashboardComp } from "@/app/components/dashboard/dashboard";

interface UserProps {
  user?: ExtendedUser;
}

const DashboardPage = ({ user }: UserProps) => {
  return <DashboardComp user={user} />;
};

export default DashboardPage;
