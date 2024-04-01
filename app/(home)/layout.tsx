import { auth } from "@/auth";
import NavbarHome from "../components/navbar/NavbarHome";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <NavbarHome user={session?.user} />
      <div className=" pt-25">{children}</div>
    </>
  );
}
