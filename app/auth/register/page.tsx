//server layout for consumer/default registration
import { RegisterForm } from "@/app/components/auth/register/register-form";
export const metadata = {
  title: "EZH Registration",
  description:
    "Register to gain access to the EZHomesteading Virtual Farmer's Market. Buy excess fresh, local, and organic food from a community of family scale farmers and gardeners.",
  keywords: [
    "registration",
    "buyer",
    "ezhomesteading",
    "virtual farmer's market",
    "fresh food",
    "local food",
    "organic food",
  ],
  openGraph: {
    title: "EZH Registration",
    description:
      "Register to gain access to the EZHomesteading Virtual Farmer's Market. Buy excess fresh, local, and organic food from a community of family scale farmers and gardeners.",
    url: "https://www.ezhomesteading.com/auth/register",
    type: "website",
  },
};
const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
