import NavbarInfo from "@/app/(info_support_layout)/info/(components)/navbar-info";

export const metadata = {
  title: "EZHomesteading Info",
  description:
    "Info on everything EZHomesteading related. From general virtual farmers market info to optimizing your EZH store to efficient search for fresh, local, organic, and organic produce near you.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="sheet relative min-h-screen">
        <NavbarInfo />
        {children}
      </main>
    </>
  );
}
