import GetOrderNotificationInfo from "@/actions/user/getUserNav";
import NavbarHome from "../components/navbar/NavbarHome";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await GetOrderNotificationInfo();
  return (
    <>
      <NavbarHome user={user} />
      {children}
    </>
  );
}
