import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCartBar from "@/components/home/FloatingCartBar";
import ProductCatalogClient from "@/components/products/ProductCatalogClient";
import { CATEGORIES } from "@/data/products";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentSlug = slug?.[0];
  const cat = CATEGORIES.find((c) => c.slug === currentSlug);

  return {
    title: cat
      ? `${cat.name} Chuẩn Tươi Sạch 0 - 4°C | Ubofood`
      : "Tất Cả Sản Phẩm Tươi Sống & Hữu Cơ | Ubofood",
    description:
      "Nguồn thịt sạch mổ nhân đạo, bảo quản mát chuẩn lạnh và rau củ thu hoạch trong ngày từ nông trại Đà Lạt & Mộc Châu.",
  };
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { q } = await searchParams;

  const currentSlug = slug?.[0] || "";
  const initialSearch = typeof q === "string" ? q : "";

  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* 1. Navigation Header */}
      <Header />

      {/* 2. Main Catalog Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ProductCatalogClient
          categorySlug={currentSlug}
          initialSearch={initialSearch}
        />
      </main>

      {/* 3. Sticky Bottom Floating Cart Bar */}
      <FloatingCartBar />

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
