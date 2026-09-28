"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CartItem } from "@/context/CartContext";

interface CartItemListProps {
  items: CartItem[];
  selectedIds: number[];
  onToggleSelectItem: (id: number) => void;
  onToggleSelectAll: () => void;
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onClearSelected: () => void;
  onAddExtra: (item: { id: number; name: string; price: number; packWeight: string; image: string }) => void;
}

export default function CartItemList({
  items,
  selectedIds,
  onToggleSelectItem,
  onToggleSelectAll,
  onUpdateQty,
  onRemoveItem,
  onClearSelected,
  onAddExtra,
}: CartItemListProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [orderNote, setOrderNote] = useState("");

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    toast.info("Đã cập nhật danh sách yêu thích");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Cross-sell items
  const extras = [
    {
      id: 901,
      name: "Đậu Mơ Tươi Quê Mình (Bìa 3 miếng)",
      price: 20800,
      packWeight: "Bìa 3 miếng",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 902,
      name: "Cải Bó Xôi Thủy Canh (Gói 300g)",
      price: 28000,
      packWeight: "Gói 300g",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-5">
      {/* 1. Header with Checkbox All & Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={selectedIds.length === items.length && items.length > 0}
            onChange={onToggleSelectAll}
            className="w-4 h-4 rounded text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer"
          />
          <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white flex items-center gap-2">
            <span>Giỏ hàng của bạn</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 text-xs font-bold">
              {items.length} sản phẩm
            </span>
          </h2>
        </label>

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Đã chọn {selectedIds.length}/{items.length} món tươi mát
          </span>
          <span>•</span>
          <button
            type="button"
            onClick={onClearSelected}
            className="hover:text-red-500 font-semibold cursor-pointer transition-colors"
          >
            🗑️ Xóa đã chọn
          </button>
        </div>
      </div>

      {/* 2. Items List */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800 space-y-4">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isFav = favorites.includes(item.id);

          return (
            <div
              key={item.id}
              className={`pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                isSelected ? "opacity-100" : "opacity-60"
              }`}
            >
              {/* Left: Checkbox + Image + Details */}
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelectItem(item.id)}
                  className="mt-3 w-4 h-4 rounded text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer flex-shrink-0"
                />

                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800 flex-shrink-0 border border-gray-100 dark:border-zinc-700">
                  <Image
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    0-4°C
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-[#195329] dark:bg-emerald-950 dark:text-emerald-300">
                      VietGAP
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.packWeight || "Khay 300g"}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    Thịt mát chuẩn EU 0 - 4°C • Tươi dẻo nguyên tảng
                  </p>
                </div>
              </div>

              {/* Right: Price + Quantity Counter + Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pl-7 sm:pl-0">
                {/* Price */}
                <div className="text-left sm:text-right">
                  <div className="text-sm sm:text-base font-black text-[#195329] dark:text-emerald-400">
                    {formatPrice(item.price * item.quantity)}đ
                  </div>
                  <span className="text-[10px] text-gray-400 line-through block">
                    {formatPrice(Math.round(item.price * item.quantity * 1.1))}đ
                  </span>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-xs shadow-2xs active:scale-95 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-800 dark:text-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-xs shadow-2xs active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Actions: Favorite & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    aria-label="Yêu thích"
                  >
                    <svg
                      className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "fill-none"}`}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    aria-label="Xóa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Packer Note Input */}
      <div className="pt-2">
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/70 dark:border-zinc-700">
          <span className="text-gray-400 text-sm">📝</span>
          <input
            type="text"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Ghi chú cho nhân viên chọn thực phẩm (ví dụ: Chọn khay date mới nhất trong ngày, chia đôi túi...)"
            className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Upsell / Cross-sell: "Ưu đãi mua kèm món tươi" */}
      <div className="p-3.5 rounded-2xl bg-[#f2faf3] dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#144723] dark:text-emerald-300">
          <span>🍃</span>
          <span>Ưu đãi mua kèm món tươi</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extras.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                onAddExtra(ex);
                toast.success(`Đã thêm kèm ${ex.name}`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-200/80 dark:border-zinc-700 text-xs text-gray-800 dark:text-gray-200 hover:border-emerald-500 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <span>{ex.name}</span>
              <span className="font-extrabold text-[#195329] dark:text-emerald-400">
                +{formatPrice(ex.price)}đ
              </span>
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                +
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
