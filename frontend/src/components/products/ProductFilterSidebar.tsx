"use client";

import React from "react";
import Link from "next/link";
import { CategoryItem, Product } from "@/types/product";

export interface FilterState {
  categorySlug: string;
  standards: string[]; // "vietgap" | "organic" | "euchill" | "oxyfresh"
  priceRange: "all" | "under50" | "50to100" | "100to200" | "over200";
  minPrice: string;
  maxPrice: string;
  weights: string[]; // "300g" | "500g" | "1kg"
}

interface ProductFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  filteredCount: number;
  categories?: CategoryItem[];
  products?: Product[];
}

export default function ProductFilterSidebar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  categories = [],
  products= [],
}: ProductFilterSidebarProps) {
  const toggleStandard = (key: string) => {
    const next = filters.standards.includes(key)
      ? filters.standards.filter((s) => s !== key)
      : [...filters.standards, key];
    onFilterChange({ ...filters, standards: next });
  };

  const toggleWeight = (key: string) => {
    const next = filters.weights.includes(key)
      ? filters.weights.filter((w) => w !== key)
      : [...filters.weights, key];
    onFilterChange({ ...filters, weights: next });
  };

  const handlePriceChip = (range: FilterState["priceRange"]) => {
    let min = "";
    let max = "";
    if (range === "under50") {
      max = "50000";
    } else if (range === "50to100") {
      min = "50000";
      max = "100000";
    } else if (range === "100to200") {
      min = "100000";
      max = "200000";
    } else if (range === "over200") {
      min = "200000";
    }
    onFilterChange({ ...filters, priceRange: range, minPrice: min, maxPrice: max });
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#113a1b] dark:text-emerald-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span>Bộ Lọc Tìm Kiếm</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-[#195329] dark:hover:text-emerald-400 font-semibold cursor-pointer transition-colors"
          >
            Mặc định
          </button>
        </div>

        {/* 1. Danh Mục Thực Phẩm */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Danh Mục Thực Phẩm</span>
            <span className="text-[10px] text-gray-400">▲</span>
          </h3>
      
          <div className="space-y-1">
            <Link
              href="/products"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                !filters.categorySlug
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-300 font-bold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🛒</span>
                <span>Tất cả sản phẩm</span>
              </span>
              <span className="text-[11px] text-gray-400">{products.length}</span>
            </Link>
            

            {categories.map((cat) => {
              const isActive = filters.categorySlug === cat.slug;

              const totalProducts = products.filter((product) => product?.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-300 font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="line-clamp-1">{cat.name}</span>
                  </span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#195329] text-white" : "text-gray-400"}`}>
                  {totalProducts}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 2. Tiêu Chuẩn & Kiểm Định */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2.5">
            Tiêu Chuẩn & Kiểm Định
          </h3>
          <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            {[
              { id: "vietgap", label: "100% Chuẩn VietGAP" },
              { id: "organic", label: "Hữu cơ Organic / Non-GMO" },
              { id: "euchill", label: "Thịt Mát Châu Âu (0 - 4°C)" },
              { id: "oxyfresh", label: "Đóng màng co khí OxyFresh" },
            ].map((std) => (
              <label key={std.id} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.standards.includes(std.id)}
                  onChange={() => toggleStandard(std.id)}
                  className="w-4 h-4 rounded text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
                <span>{std.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Mức Giá */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2.5">
            Mức Giá
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: "under50", label: "Dưới 50.000đ" },
              { id: "50to100", label: "50k - 100.000đ" },
              { id: "100to200", label: "100k - 200.000đ" },
              { id: "over200", label: "Trên 200.000đ" },
            ].map((chip) => {
              const isSelected = filters.priceRange === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handlePriceChip(chip.id as FilterState["priceRange"])}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#195329] text-white border-[#195329] shadow-xs"
                      : "bg-emerald-50/60 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-emerald-100 dark:border-zinc-700 hover:border-emerald-300"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Custom Range Inputs */}
          <div className="flex items-center gap-1.5 text-xs">
            <input
              type="number"
              placeholder="Từ đ"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value, priceRange: "all" })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-xs focus:outline-none focus:border-[#195329]"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Đến đ"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value, priceRange: "all" })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-xs focus:outline-none focus:border-[#195329]"
            />
          </div>
        </div>

        {/* 4. Quy Cách Khay / Gói */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2.5">
            Quy Cách Khay/Gói
          </h3>
          <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            {[
              { id: "300g", label: "Hộp/Khay 300g (2 - 3 người)" },
              { id: "500g", label: "Hộp/Khay 500g (Gia đình)" },
              { id: "1kg", label: "Gói/Túi 1kg (Tiết kiệm)" },
            ].map((w) => (
              <label key={w.id} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.weights.includes(w.id)}
                  onChange={() => toggleWeight(w.id)}
                  className="w-4 h-4 rounded text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
                <span>{w.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-3 space-y-2">
          <button
            type="button"
            className="w-full py-2.5 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>✓</span>
            <span>Áp Dụng Bộ Lọc ({filteredCount})</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full py-1 text-center text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
          >
            Xóa Lựa Chọn
          </button>
        </div>
      </div>
    </aside>
  );
}
