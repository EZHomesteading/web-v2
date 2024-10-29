//server layout for coop registration
import { CoOpRegisterForm } from "@/app/(no_nav_auth_layout)/auth/(components)/register/co-op-register-form";
export const metadata = {
  title: "EZH Co-op Registration",
  description:
    "Register as an EZHomesteading Co-op to operate a Virtual Farmer's Market Store from anywhere. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away or buy produce from EZH Producers near you to sell to a community of EZH buyers.",
  keywords: [
    "registration",
    "seller",
    "vendor",
    "ezhomesteading",
    "virtual farmer's market",
    "fresh food",
    "local food",
    "organic food",
  ],
  openGraph: {
    title: "EZH Registration",
    description:
      "Register as an EZHomesteading Co-op to operate a Virtual Farmer's Market Store from anywhere. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away or buy produce from EZH Producers near you to sell to a community of EZH buyers.",
    url: "https://www.ezhomesteading.com/auth/register-co-op",
    type: "website",
  },
};

const RegisterPage = () => {
  return <CoOpRegisterForm />;
};

export default RegisterPage;
