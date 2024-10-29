//admin only disputes page parent element

import ReportComponent from "./reports.client";
import authCache from "@/auth-cache";
import { UserRole } from "@prisma/client";
import getReports from "@/actions/getReports";

const ReportsPage = async () => {
  const session = await authCache();
  const reports = await getReports();
  return (
    <>
      {session?.user?.role === UserRole.ADMIN ? (
        <ReportComponent reports={reports} />
      ) : (
        <div className="bg-black h-screen w-screen flex justify-center items-center text-white">
          Admin Page
        </div>
      )}
    </>
  );
};

export default ReportsPage;
