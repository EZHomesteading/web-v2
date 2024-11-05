import { getNavUser, NavUser } from "@/actions/getUser";
import { outfitFont } from "@/components/fonts";
import Navbar from "@/components/navbar/Navbar";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#fff",
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getNavUser();
  return (
    <>
      <Navbar
        user={user as unknown as NavUser}
        className="hidden sm:block top-0 zmax"
      />
      <div
        className={`${outfitFont.className} relative pl-2 sm:pl-4 md:pl-8 lg:pl-16 2xl:pl-32`}
      >
        {children}
      </div>
    </>
  );
}
