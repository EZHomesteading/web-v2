import NavbarHome from "../components/navbar/NavbarHome";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarHome />
      {children}
    </>
  );
}
