//server layout for login form
import { LoginForm } from "@/app/auth/(components)/login/login-form";
export const metadata = {
  title: "EZHomesteading Login",
  description: "Login to your EZHomesteading Account",
  keywords: [
    "ezhomesteading",
    "produce near me",
    "virtual farmer's market",
    "fresh food",
    "local food",
    "organic food",
    "login",
    "account",
  ],
  openGraph: {
    title: "EZHomesteading Login",
    description: "Login to your EZHomesteading account.",
    url: "https://www.ezhomesteading.com/auth/login",
    type: "website",
  },
};
const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
