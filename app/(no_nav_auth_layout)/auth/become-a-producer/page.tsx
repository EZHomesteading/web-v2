//server layout for producer conversion
import { createStripeConnectedAccount } from "@/actions/auth/new-stripe-acc";
import { BecomeProducer } from "@/app/(no_nav_auth_layout)/auth/(components)/become/become-producer-form";
import { currentUser } from "@/lib/auth";

export const metadata = {
  title: "Become an EZH Co-op",
  description:
    "Become an EZH Producer to operate a Virtual Farmer's Market Store from anywhere. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away or buy produce from EZH Producers near you to sell to a community of EZH buyers.",
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
    title: "Become an EZH Co-op",
    description:
      "Become an EZH Producer to operate a Virtual Farmer's Market Store from anywhere. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away or buy produce from EZH Producers near you to sell to a community of EZH buyers.",
    url: "https://www.ezhomesteading.com/auth/become-a-co-op",
    type: "website",
  },
};

const BecomeProducerPage = async () => {
  const user = await currentUser();
  return (
    <BecomeProducer
      user={user}
      createStripeConnectedAccount={createStripeConnectedAccount}
    />
  );
};

export default BecomeProducerPage;
