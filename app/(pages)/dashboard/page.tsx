import DashboardComp from "@/app/components/dashboard/dashboard";
import currentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}
const DashboardPage = async ({ params }: { params: IParams }) => {
  return <DashboardComp currentUser={currentUser} />;
};

export default DashboardPage;
