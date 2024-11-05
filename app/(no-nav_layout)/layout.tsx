// server side layour for chat page
import type { Viewport } from "next";
//import { UserInfo, navUser } from "@/next-auth";

export const viewport: Viewport = {
  themeColor: "#fff",
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
