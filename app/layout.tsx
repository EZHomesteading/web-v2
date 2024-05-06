import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import RentModal from "@/app/components/modals/listing-modal";
import ToasterProvider from "@/providers/ToasterProvider";

import "@/app/globals.css";
import ClientOnly from "./components/client/ClientOnly";
import SearchModal from "./components/modals/SearchModal";
import CartModal from "./components/modals/cart-modal";

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
            <SearchModal />
            <CartModal />
          </ClientOnly>
          <main>{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
