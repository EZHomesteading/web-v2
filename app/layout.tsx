import { Nunito } from "next/font/google";

import { ThemeProvider } from "./components/theme-provider";
import Navbar from "@/app/components/navbar/Navbar";
import LoginModal from "@/app/components/modals/LoginModal";
import RegisterModal from "@/app/components/modals/RegisterModal";
import SearchModal from "@/app/components/modals/SearchModal";
import RentModal from "@/app/components/modals/ListingModal";

import ToasterProvider from "@/app/providers/ToasterProvider";

import "./globals.css";
import ClientOnly from "./components/client/ClientOnly";
import currentUser from "./actions/getCurrentUser";
import CoopRegisterModal from "./components/modals/CoopRegisterModal";

export const metadata = {
  title: "EZHomesteading",
  description: "",
};

const font = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientOnly>
            <ToasterProvider />
            <LoginModal />
            <RegisterModal />
            <CoopRegisterModal />
            <SearchModal />
            <RentModal />
            <Navbar currentUser={currentUser} />
          </ClientOnly>

          <div className=" pt-25">{children}</div>
        </ThemeProvider>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`}
          defer
        />
      </body>
    </html>
  );
}
