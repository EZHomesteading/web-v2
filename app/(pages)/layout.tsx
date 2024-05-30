//base server side layout for all (pages) children
import { getNavUser } from "@/actions/getUser";
import Navbar from "@/app/components/navbar/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getNavUser();
  return (
    <>
      <Navbar user={user} />
      <div className=" pt-25">{children}</div>
    </>
  );
}
