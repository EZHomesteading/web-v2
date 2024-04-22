import { auth } from "@/auth";
import NavbarFind from "./NavbarFind";

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
