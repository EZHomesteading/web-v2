import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "../components/ui/sonner";
import "@/app/globals.css";
import ClientOnly from "../components/client/ClientOnly";
import SearchModal from "../components/modals/SearchModal";
import CartModal from "../components/modals/cart-modal";
import { Metadata } from "next";
import { Viewport } from "next";
export const viewport: Viewport = {
  themeColor: "#ced9bb",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EZHomesteading",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-touch-fullscreen": "yes",
    "mobile-web-app-capable": "yes",
  },
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
        <head>
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="apple-touch-icon" sizes="384x384" href="/logo384.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/logo512.png" />
        </head>
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
