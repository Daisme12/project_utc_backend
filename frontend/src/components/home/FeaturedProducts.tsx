"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard, { MeatProduct } from "./ProductCard";
import { storeService, mapProductToMeatProduct } from "@/services/storeService";

export default function FeaturedProducts() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [apiProducts, setApiProducts] = useState<MeatProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10; // 5 sản phẩm tương ứng với 1 hàng đầy đủ trên desktop (lg:grid-cols-5)

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    storeService.getProducts()
      .then((res) => {
        if (isMounted) {
          if (res && res.length > 0) {
            setApiProducts(res.map(mapProductToMeatProduct));
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải sản phẩm từ database:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc sản phẩm theo từ khóa tìm kiếm trực tiếp từ database
  const filteredProducts = apiProducts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.tagBadge && p.tagBadge.toLowerCase().includes(q)) ||
      (p.packWeight && p.packWeight.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  // Tính toán phân trang
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const displayedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  return (
    <section id="meat" className="mt-10 sm:mt-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#195329] dark:text-emerald-400 tracking-wider uppercase">
            <span>❄️</span>
            <span>TIÊU CHUẨN MỔ LẠNH KHÉP KÍN 0 - 4°C</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#113a1b] dark:text-white tracking-tight">
            Thịt Heo Tươi Mát & Thực Phẩm Hôm Nay
          </h2>
        </div>

        {/* Thanh Search & Nút Xem tất cả sản phẩm (thay thế nút bộ lọc) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Thanh Search */}
          <div className="relative flex-1 sm:w-64 md:w-72">
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm thịt, thực phẩm tươi..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#195329] focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold"
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Nút Xem tất cả sản phẩm */}
          <Link
            href="/products"
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap bg-[#195329] hover:bg-[#134220] text-white transition-all shrink-0 inline-flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer group"
          >
            <span>Xem tất cả sản phẩm</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* 5-Column Product Grid */}
      {loading ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-gray-100 dark:border-zinc-800 animate-pulse space-y-3"
            >
              <div className="w-full aspect-square bg-gray-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 py-12 text-center bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {searchQuery
              ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
              : "Chưa có sản phẩm nào trong hệ thống."}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-[#195329] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      )}

      {/* Phân Trang Cho Đoạn Này */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hiển thị{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {(safeCurrentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(safeCurrentPage * itemsPerPage, filteredProducts.length)}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-[#195329] dark:text-emerald-400">
              {filteredProducts.length}
            </span>{" "}
            sản phẩm
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              aria-label="Trang trước"
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer font-bold text-gray-700 dark:text-gray-300 transition-colors text-xs"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                  safeCurrentPage === pageNum
                    ? "bg-[#195329] text-white shadow-xs"
                    : "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              aria-label="Trang sau"
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer font-bold text-gray-700 dark:text-gray-300 transition-colors text-xs"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
