import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Giỏ Hàng & Thanh Toán | Ubofood Thực Phẩm Tươi Sạch",
  description:
    "Thanh toán an toàn, giao siêu tốc 2h bảo quản thùng giữ nhiệt đá gel OxyFresh 0-4°C tại Ubofood.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <CartPageClient />
      </main>

      <Footer />
    </div>
  );
}
