import ResetForm from "./reset-password.client";

const ResetPasswordPage = () => {
  const apiUrl = process.env.API_URL!;
  return <ResetForm apiUrl={apiUrl} />;
};

export default ResetPasswordPage;
