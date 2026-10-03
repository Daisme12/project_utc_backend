"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProductListingCard from "./ProductListingCard";
import { Product } from "@/types/product";
import { FilterState } from "./ProductFilterSidebar";

interface ProductGridAreaProps {
  products: Product[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ProductGridArea({
  products,
  filters,
  onFilterChange,
  onReset,
  searchQuery,
  onSearchChange,
}: ProductGridAreaProps) {
  const [sortBy, setSortBy] = useState<string>("best_seller");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Lọc và Sắp xếp sản phẩm
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // 2. Standards
    if (filters.standards.length > 0) {
      result = result.filter((p) => !!p.standard && filters.standards.includes(p.standard));
    }

    // 3. Price Range
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // 4. Weights
    if (filters.weights.length > 0) {
      result = result.filter((p) => !!p.weightCategory && filters.weights.includes(p.weightCategory));
    }

    // 5. Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else {
      // Default: best_seller
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Tự động reset về trang 1 khi thay đổi tìm kiếm, bộ lọc hoặc sắp xếp
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy, itemsPerPage]);

  // Điều chỉnh currentPage nếu vượt quá totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Phân trang sản phẩm thực tế
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 250, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  // Active filters list to display tags
  const activeTags = useMemo(() => {
    const tags: { id: string; label: string; onRemove: () => void }[] = [];

    if (searchQuery) {
      tags.push({
        id: "search",
        label: `Tìm: "${searchQuery}"`,
        onRemove: () => onSearchChange(""),
      });
    }

    const standardNames: Record<string, string> = {
      vietgap: "VietGAP 100%",
      organic: "Hữu cơ Organic",
      euchill: "Thịt Mát Châu Âu",
      oxyfresh: "Khí OxyFresh",
    };
    filters.standards.forEach((s) => {
      tags.push({
        id: `std-${s}`,
        label: standardNames[s] || s,
        onRemove: () =>
          onFilterChange({
            ...filters,
            standards: filters.standards.filter((item) => item !== s),
          }),
      });
    });

    const weightNames: Record<string, string> = {
      "300g": "Khay 300g",
      "500g": "Khay 500g",
      "1kg": "Gói 1kg",
    };
    filters.weights.forEach((w) => {
      tags.push({
        id: `w-${w}`,
        label: weightNames[w] || w,
        onRemove: () =>
          onFilterChange({
            ...filters,
            weights: filters.weights.filter((item) => item !== w),
          }),
      });
    });

    if (filters.minPrice || filters.maxPrice) {
      tags.push({
        id: "price",
        label: `Giá: ${filters.minPrice || "0"}đ - ${filters.maxPrice || "..."}đ`,
        onRemove: () =>
          onFilterChange({
            ...filters,
            minPrice: "",
            maxPrice: "",
            priceRange: "all",
          }),
      });
    }

    return tags;
  }, [searchQuery, filters, onFilterChange, onSearchChange]);

  return (
    <div className="flex-1 space-y-4">
      {/* Top Filter Controls & Sort Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-3">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Results Count & Search Input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm sản phẩm theo tên, loại..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:border-[#195329]"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="sort-select" className="text-gray-500 whitespace-nowrap">Sắp xếp:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#195329] cursor-pointer"
              >
                <option value="best_seller">Bán chạy hôm nay</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Hàng mới về</option>
              </select>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-700 text-[#195329] dark:text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="Lưới"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-zinc-700 text-[#195329] dark:text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="Danh sách"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Tags Row */}
        {activeTags.length > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-gray-500 font-medium">Đang lọc theo:</span>
            {activeTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200/60"
              >
                <span>{tag.label}</span>
                <button
                  type="button"
                  onClick={tag.onRemove}
                  className="w-3.5 h-3.5 rounded-full hover:bg-emerald-200 text-emerald-800 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={onReset}
              className="text-red-500 hover:underline text-[11px] font-semibold ml-1 cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Product Results Info & Page Size Selector */}
      <div className="text-xs text-gray-500 dark:text-gray-400 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          {totalItems > 0 ? (
            <>
              Hiển thị <span className="font-semibold text-gray-800 dark:text-gray-200">{startIndex + 1} - {endIndex}</span> trong tổng số{" "}
              <span className="font-bold text-[#195329] dark:text-emerald-400">
                {totalItems} sản phẩm
              </span>
            </>
          ) : (
            <span>Không tìm thấy sản phẩm nào</span>
          )}
        </div>

        {totalItems > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Hiển thị:</span>
            {[8, 12, 16].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setItemsPerPage(size)}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-colors cursor-pointer ${
                  itemsPerPage === size
                    ? "bg-[#195329] text-white shadow-xs"
                    : "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {size} / trang
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid / List */}
      {displayedProducts.length > 0 ? (
        <div
          className={`grid gap-3 sm:gap-4 ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {displayedProducts.map((p) => (
            <ProductListingCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-8 space-y-3">
          <div className="text-4xl">🥩🔍</div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Vui lòng thử điều chỉnh lại bộ lọc giá, tiêu chuẩn hoặc từ khóa tìm kiếm của bạn.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-[#195329] text-white text-xs font-bold hover:bg-[#12421f] transition-all cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Pagination Bar */}
      {totalItems > 0 && (
        <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-500">
          <div>
            Trang <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> trên{" "}
            <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span> trang ({totalItems} sản phẩm)
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Trang trước"
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer font-bold text-gray-700 dark:text-gray-300 transition-colors"
              >
                &lt;
              </button>

              {getPageNumbers().map((item, idx) => {
                if (item === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="w-6 text-center text-gray-400 select-none font-bold"
                    >
                      ...
                    </span>
                  );
                }
                const pageNum = Number(item);
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#195329] text-white shadow-xs"
                        : "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer font-bold text-gray-700 dark:text-gray-300 transition-colors"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
