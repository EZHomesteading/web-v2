//get navbar for home page and pass it the current user
import { getNavUser } from "@/actions/getUser";
import Navbar from "../components/navbar/Navbar";
import type { Viewport } from "next";
import { navUser } from "@/next-auth";

export const viewport: Viewport = {
  themeColor: "black",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getNavUser();
  return (
    <>
      <Navbar isHome={true} user={user as unknown as navUser} />
      {children}
    </>
  );
}
