//base server side layout for all (pages) children
import { NavUser, getNavUser } from "@/actions/getUser";
import Navbar from "@/app/components/navbar/Navbar";
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
      <Navbar user={user as unknown as NavUser} />
      <div className="pt-25">{children}</div>
    </>
  );
}
