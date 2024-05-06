import { auth } from "@/auth";
import NavbarFind from "./map/NavbarFind";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <NavbarFind user={session?.user} />
      {children};
    </>
  );
}
