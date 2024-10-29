//server layout for coop registration
import { ProducerRegisterForm } from "@/app/(no_nav_auth_layout)/auth/(components)/register/producer-register-form";
export const metadata = {
  title: "EZH Producer Registration",
  description:
    "Register as an EZHomesteading Producer to operate a Virtual Farmer's Market Store from anywhere without dealing with direct customer interaction. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away. ",
  keywords: [
    "registration",
    "seller",
    "vendor",
    "ezhomesteading",
    "produce near me",
    "virtual farmer's market",
    "fresh food",
    "local food",
    "organic food",
  ],
  openGraph: {
    title: "EZH Producer Registration",
    description:
      "Register as an EZHomesteading Producer to operate a Virtual Farmer's Market Store from anywhere without dealing with direct customer interaction. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away. ",
    url: "https://www.ezhomesteading.com/auth/register-producer",
    type: "website",
  },
};
const RegisterPage = () => {
  return <ProducerRegisterForm />;
};

export default RegisterPage;
