import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Khmer } from "next/font/google";

import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-khmer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rural Finance Hub Cambodia | ហាបហ្វាយណែនស៍ហិរញ្ញវត្ថុជនបទ",
  description:
    "Compare loans, find financial services, and learn about money — in Khmer and English.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B22222",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansKhmer.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
