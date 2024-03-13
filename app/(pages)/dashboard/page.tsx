import DashboardComp from "@/app/components/dashboard/dashboard";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}
const DashboardPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  return <DashboardComp currentUser={currentUser} />;
};

export default DashboardPage;
