import GetNavUser from "@/actions/user/getUserNav";
import NavbarFind from "./map/NavbarFind";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await GetNavUser();
  return (
    <div className="h-sreen overflow-hidden touch-none">
      <NavbarFind user={user} />
      <div className="h-[calc(100vh-64px)] overflow-hidden touch-none">
        {children};
      </div>
    </div>
  );
}
