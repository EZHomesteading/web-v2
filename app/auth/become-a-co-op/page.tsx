//server layout for coop conversion
import { BecomeCoop } from "@/app/components/auth/become/become-co-op-form";
import { currentUser } from "@/lib/auth";
export const metadata = {
  title: "Become an EZH Co-op",
  description:
    "Become an EZHomesteading Co-op to operate a Virtual Farmer's Market Store from anywhere without dealing with direct customer interaction. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away. ",
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
    title: "Become an EZH Co-op",
    description:
      "Become an EZHomesteading Co-op to operate a Virtual Farmer's Market Store from anywhere without dealing with direct customer interaction. Sell your excess fresh and honestly organic produce you would otherwise be forced to throw away, can, or give away. ",
    url: "https://www.ezhomesteading.com/auth/become-a-producer",
    type: "website",
  },
};
const BecomeCoopPage = async () => {
  const user = await currentUser();
  return (
    <>
      <main>
        <BecomeCoop user={user} />
      </main>
    </>
  );
};

export default BecomeCoopPage;
