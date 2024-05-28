//get navbar for home page and pass it the current user
import GetNavUser from "@/actions/user/getUserNav";
import NavbarHome from "../components/navbar/NavbarHome";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await GetNavUser();
  return (
    <>
      <NavbarHome user={user} />
      {children}
    </>
  );
}
