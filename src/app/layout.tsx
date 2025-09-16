import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "舒適的住宅，有質感的苗栗建案",
  description: "向上建設提供專業建築設計服務，致力於創造高品質的住宅空間",
  icons: {
    icon: "/images/icons/icon_uphouse.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${GeistSans.className} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <PerformanceMonitor />
        <Analytics />
      </body>
    </html>
  );
}
