import { auth } from "@/auth";
import NavbarFind from "./map/NavbarFind";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="h-sreen overflow-hidden touch-none">
      <NavbarFind user={session?.user} />
      <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
        {children};
      </div>
    </div>
  );
}
