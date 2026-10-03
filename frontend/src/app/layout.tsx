import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ubofood Thực Phẩm Tươi Sạch",
    default: "Ubofood - Thịt Tươi & Thực Phẩm Sạch Chuẩn Mát 0 - 4°C",
  },
  description:
    "Ubofood - Hệ thống chuỗi cung ứng thịt tươi mát chuẩn mổ lạnh châu Âu 0-4°C, rau củ VietGAP và nông sản sạch trực tiếp từ trang trại.",
};

import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import NavigationProgressBar from "@/components/common/NavigationProgressBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton duration={2000} />
        </CartProvider>
      </body>
    </html>
  );
}
