import getUserWithOrders from "@/actions/user/getUserNav";
import Navbar from "@/app/components/navbar/Navbar";
import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className=" pt-25">{children}</div>
    </>
  );
}
