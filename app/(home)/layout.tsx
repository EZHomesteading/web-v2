import NavbarHome from "../components/navbar/NavbarHome";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <NavbarHome user={session?.user} />
      <div className="">{children}</div>
    </>
  );
}
