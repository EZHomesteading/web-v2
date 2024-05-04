import Navbar from "@/app/components/navbar/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className=" pt-25">{children}</div>
    </>
  );
}
