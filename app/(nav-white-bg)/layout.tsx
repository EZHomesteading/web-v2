//get navbar for home page and pass it the current user
import { getNavUser, NavUser } from "@/actions/getUser";
import Navbar from "@/components/navbar/Navbar";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "white",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getNavUser();
  return (
    <>
      <Navbar bg="bg-white" user={user as unknown as NavUser} />
      {children}
    </>
  );
}
