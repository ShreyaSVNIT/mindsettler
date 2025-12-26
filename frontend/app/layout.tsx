import type { Metadata } from "next";
import { Imbue, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ClientLayout from "@/components/ClientLayout";

const imbue = Imbue({
  variable: "--font-title",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-body",
  weight: ["700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${imbue.variable} ${playfair.variable}`}>
      <body className="bg-bg-app text-text-body font-body antialiased">
        <ClientLayout>
          <Header />

          <main
            className="
              pt-[var(--header-h)]
              min-h-[100dvh]
            "
          >
            {children}
          </main>

          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
