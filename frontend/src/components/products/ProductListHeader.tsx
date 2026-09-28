import React from "react";
import Link from "next/link";
import FlashSaleBanner from "@/components/common/FlashSaleBanner";

interface ProductListHeaderProps {
  categoryTitle?: string;
  totalCount: number;
}

export default function ProductListHeader({
  categoryTitle,
  totalCount,
}: ProductListHeaderProps) {
  const isSaleCategory = categoryTitle?.includes("Sale");
  const displayTitle = isSaleCategory
    ? "🔥 Săn Sale Giờ Vàng (Giảm Đến 35%)"
    : categoryTitle || "Tất Cả Sản Phẩm Tươi Sống & Hữu Cơ";

  return (
    <div className="space-y-4">
      {/* 1. Announcement Banner */}
      {isSaleCategory ? (
        <FlashSaleBanner showLinkButton={false} />
      ) : (
        <div className="w-full bg-[#185329] text-[#e8f7ec] px-4 py-2.5 rounded-2xl text-xs flex flex-col md:flex-row items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="text-base">🎁</span>
            <span className="font-semibold">
              <span className="text-amber-300 font-extrabold uppercase">
                ƯU ĐÃI ĐẶC QUYỀN HÔM NAY:
              </span>{" "}
              Freeship giao siêu tốc 2H cho đơn từ 150.000đ + Tặng kèm túi giữ nhiệt đá gel OxyFresh
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#cbead3] flex-shrink-0">
            <span>❄️ Bảo quản lạnh 0°C - 4°C</span>
            <span>•</span>
            <span>🛡️ Chuẩn VietGAP & GlobalGAP</span>
          </div>
        </div>
      )}

      {/* 2. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-[#195329] transition-colors flex items-center gap-1">
          <span>🏠</span>
          <span>Trang chủ</span>
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#195329] transition-colors">
          Danh mục
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-semibold">
          {categoryTitle || "Tất cả sản phẩm"}
        </span>
      </nav>

      {/* 3. Title & Total Counter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#113a1b] dark:text-white tracking-tight flex items-center gap-2">
            <span>{displayTitle}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            {isSaleCategory
              ? "Cơ hội săn thực phẩm mát tiêu chuẩn EU và VietGAP với mức giá ưu đãi nhất trong ngày. Đặt nhanh trước khi hết hàng!"
              : "Nguồn thịt sạch mổ nhân đạo, bảo quản mát chuẩn lạnh và rau củ thu hoạch trong ngày từ nông trại Đà Lạt & Mộc Châu."}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold text-[#195329] dark:text-emerald-300 whitespace-nowrap">
          {totalCount} sản phẩm có sẵn hôm nay
        </div>
      </div>
    </div>
  );
}
