//server layout for reset password
import { ResetForm } from "@/app/(no_nav_auth_layout)/auth/(components)/reset-form";

const ResetPage = () => {
  const apiUrl = process.env.API_URL!;
  return <ResetForm apiUrl={apiUrl} />;
};

export default ResetPage;
