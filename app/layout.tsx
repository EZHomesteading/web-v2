import { Nunito } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar/Navbar";
import RentModal from "@/components/modals/ListingModal";

import ToasterProvider from "@/providers/ToasterProvider";

import "@/app/globals.css";
import ClientOnly from "@/components/client/ClientOnly";

export const metadata = {
  title: "EZHomesteading",
  description: "",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" className={font.className}>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientOnly>
              <ToasterProvider />
              <RentModal />
              <Navbar user={session?.user} />
            </ClientOnly>

            <div className=" pt-25">{children}</div>
          </ThemeProvider>
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`}
            defer
          />
        </body>
      </html>
    </SessionProvider>
  );
}
