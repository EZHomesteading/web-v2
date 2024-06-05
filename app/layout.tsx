import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "./components/ui/sonner";
import "@/app/globals.css";
import ClientOnly from "./components/client/ClientOnly";
import SearchModal from "./components/modals/SearchModal";
import CartModal from "./components/modals/cart-modal";
import { Metadata } from "next";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "green",
};
export const metadata: Metadata = {
  title:
    "EZHomesteading - Fresh, Local, Organic Produce | Virtual Farmer's Market",
  description:
    "Easily find fresh, local, organic produce near you. Join a community of family scale farmers and gardeners. Sell your excess honestly organic produce that would otherwise get thrown away, canned, or given away.",
  keywords: [
    "ezhomesteading",
    "produce near me",
    "virtual farmer's market",
    "fresh food",
    "local food",
    "organic food",
  ],
  openGraph: {
    title: "EZHomesteading - Fresh, Local, Organic Produce",
    description:
      "Easily find fresh, local, organic produce near you. Join a community of family scale farmers and gardeners. Sell your excess honestly organic produce that would otherwise get thrown away, canned, or given away.",
    url: "https://www.ezhomesteading.com/",
    type: "website",
  },
  manifest: "/manifest.json",
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
