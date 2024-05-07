import GetOrderNotificationInfo from "@/actions/user/getUserNav";
import Navbar from "@/app/components/navbar/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await GetOrderNotificationInfo();
  console.log(user);
  return (
    <>
      <Navbar user={user} />
      <div className=" pt-25">{children}</div>
    </>
  );
}
