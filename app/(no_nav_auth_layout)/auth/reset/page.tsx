//server layout for reset password
import { ResetForm } from "@/app/(no_nav_auth_layout)/auth/(components)/reset-form";

const ResetPage = () => {
  const API_URL = process.env.API_URL;
  return <ResetForm />;
};

export default ResetPage;
