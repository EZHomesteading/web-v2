//base server side layout for all (pages) children
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#e3eac9",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
