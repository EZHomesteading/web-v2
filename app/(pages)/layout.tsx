import Navbar from "@/app/components/navbar/Navbar";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <Navbar user={session?.user} />
      {children}
    </>
  );
}
