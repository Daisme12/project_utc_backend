import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrustBadges from "@/components/home/TrustBadges";
import FlashSaleBanner from "@/components/common/FlashSaleBanner";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryIcons from "@/components/home/CategoryIcons";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SupplyChainCommitment from "@/components/home/SupplyChainCommitment";
import RecipesAndReviews from "@/components/home/RecipesAndReviews";
import FloatingCartBar from "@/components/home/FloatingCartBar";

export const metadata: Metadata = {
  title: "Ubofood - Thịt Tươi & Sống Sạch | Chuẩn Mổ Lạnh Châu Âu 0 - 4°C",
  description:
    "Hệ thống thực phẩm tươi sống, thịt heo thịt bò mát công nghệ OxyFresh, rau củ VietGAP giao nhanh 2h tại Hà Nội và TP.HCM.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* 1. Header with announcement, search, categories */}
      <Header />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        {/* Flash Sale Giờ Vàng countdown banner */}
        <FlashSaleBanner />

        {/* 4 Trust Badges banner strip */}
        <TrustBadges />

        {/* Hero 3-box Grid (Ubomeat 0-4°C, Combo Gia Đình, Flash Sale) */}
        <HeroBanner />

        {/* Danh Mục Tươi Sống Trong Ngày (6 circular categories) */}
        <CategoryIcons />

        {/* Thịt Heo Tươi Mát & Thực Phẩm Hôm Nay (5 filter tabs, 10 products grid) */}
        <FeaturedProducts />

        {/* Quy Trình Chuỗi Cung Ứng Khép Kín (4 commitments) */}
        <SupplyChainCommitment />

        {/* Gợi Ý Món Ngon & Phản Hồi Thực Tế (Recipes & Reviews) */}
        <RecipesAndReviews />
      </main>

      {/* 3. Sticky Bottom Floating Cart Bar */}
      <FloatingCartBar />

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
