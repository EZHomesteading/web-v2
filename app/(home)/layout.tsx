//get navbar for home page and pass it the current user
import { getNavUser } from "@/actions/getUser";
import NavbarHome from "../components/navbar/NavbarHome";
import type { Viewport } from "next";

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
      <NavbarHome user={user} />
      {children}
    </>
  );
}
