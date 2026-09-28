"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Recipe } from "./RecipeDetailModal";

interface AllRecipesModalProps {
  isOpen: boolean;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onClose: () => void;
}

export default function AllRecipesModal({
  isOpen,
  recipes,
  onSelectRecipe,
  onClose,
}: AllRecipesModalProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "Tất cả công thức (120+)" },
    { id: "heo", label: "Món Heo Tươi Mát" },
    { id: "bo", label: "Món Bò Úc" },
    { id: "canh", label: "Món Canh & Hầm" },
    { id: "quick", label: "Nhanh dưới 25p" },
  ];

  const filteredRecipes = recipes.filter((r) => {
    if (filterCategory === "heo") return r.tag.includes("Heo");
    if (filterCategory === "bo") return r.tag.includes("Bò");
    if (filterCategory === "canh") return r.title.includes("Canh") || r.title.includes("Hầm");
    if (filterCategory === "quick") return parseInt(r.time) <= 25;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📖</span>
              <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white">
                Sổ Tay 120+ Món Ngon Gia Đình
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Gợi ý thực đơn tươi ngon mỗi ngày từ thịt mát chuẩn châu Âu và rau sạch VietGAP
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter categories tabs */}
        <div className="px-4 sm:px-5 py-3 bg-gray-50/70 dark:bg-zinc-800/40 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === c.id
                  ? "bg-[#195329] text-white shadow-xs"
                  : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-emerald-400"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative w-full h-36 bg-gray-100 dark:bg-zinc-800">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    ⏱️ {item.time}
                  </span>
                </div>

                <div className="p-3.5">
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {item.tag}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5 line-clamp-1 group-hover:text-[#195329] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectRecipe(item);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-[#195329] hover:text-white text-[#195329] dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  📖 Đọc công thức chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 dark:bg-zinc-800/60 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400 text-[11px]">
            Công thức được phát triển bởi các đầu bếp dinh dưỡng Ubofood
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#195329] text-white font-bold cursor-pointer hover:bg-[#12421f] transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
