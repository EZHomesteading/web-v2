import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import RentModal from "@/app/components/modals/ListingModal";
import ToasterProvider from "@/providers/ToasterProvider";

import "@/app/globals.css";
import ClientOnly from "./components/client/ClientOnly";

export const metadata = {
  title: "EZHomesteading",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body>
          <ClientOnly>
            <ToasterProvider />
            <RentModal />
          </ClientOnly>
          <main>{children}</main>
          <script
            async
            defer
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&loading=async&libraries=places`}
          ></script>
        </body>
      </html>
    </SessionProvider>
  );
}
