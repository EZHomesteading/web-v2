import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import RentModal from "@/app/components/modals/listing-modal";
import { Toaster } from "./components/ui/sonner";
import "@/app/globals.css";
import ClientOnly from "./components/client/ClientOnly";
import SearchModal from "./components/modals/SearchModal";
import CartModal from "./components/modals/cart-modal";

export const metadata = {
  title: "EZHomesteading",
  description:
    "Easily find fresh, local, and organic producer grown by people in your area.",
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
            <RentModal />
            <SearchModal />
            <CartModal />
          </ClientOnly>
          <main>{children}</main>
          <Toaster theme="dark" />
        </body>
      </html>
    </SessionProvider>
  );
}
