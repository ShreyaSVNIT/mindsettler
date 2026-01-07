import type { Metadata } from "next";
import localFont from "next/font/local";
import { Imbue, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ClientLayout from "@/components/ClientLayout";
import ContactOverlay from "@/components/ContactOverlay";

const imbue = Imbue({
  variable: "--font-title",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const ivyPresto = localFont({
  src: "../public/fonts/IvyPresto.otf",
  variable: "--font-ivy",
  weight: "400",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${imbue.variable} ${playfair.variable} ${ivyPresto.variable}`}>
      <body className="bg-bg-app text-text-body antialiased">
        <ClientLayout>
          <Header />

          <main className="min-h-[100dvh]">
            {children}
          </main>

          <Footer />
          <ContactOverlay />
        </ClientLayout>
      </body>
    </html>
  );
}
