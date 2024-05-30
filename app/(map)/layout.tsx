//map server side layout
import { getNavUser } from "@/actions/getUser";
import NavbarFind from "./map/NavbarFind";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getNavUser();
  return (
    <div className="h-sreen overflow-hidden touch-none">
      <NavbarFind user={user} />
      <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
        {children};
      </div>
    </div>
  );
}
