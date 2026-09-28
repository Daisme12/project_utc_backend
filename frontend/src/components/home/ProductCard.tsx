"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";

export interface MeatProduct {
  id: number;
  name: string;
  category: "all" | "small" | "large" | "best" | "combo";
  price: number;
  originalPrice?: number;
  unitPrice: string; // e.g. "Đơn giá: 238.700 đ/kg"
  packWeight: string; // e.g. "Hộp 300g"
  stockStatus: string; // e.g. "Còn 12 khay sáng"
  discountBadge?: string; // e.g. "-8%"
  tagBadge: string; // e.g. "VietGAP", "Bán chạy #1"
  image: string;
}

export default function ProductCard({ product }: { product: MeatProduct }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    setIsAdded(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      packWeight: product.packWeight,
      image: product.image,
    });

    toast.success("Đã thêm vào giỏ hàng!", {
      description: `${product.name} • ${product.packWeight}`,
      duration: 2000,
      position: "top-right",
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-gray-100 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Left Badges: Discount + Quality tag */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discountBadge && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black text-white bg-red-600 shadow-xs">
                {product.discountBadge}
              </span>
            )}
            {product.tagBadge && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/90 backdrop-blur-xs shadow-xs">
                {product.tagBadge}
              </span>
            )}
          </div>

          {/* Favorite Heart Button Top Right */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-xs z-10 cursor-pointer"
            aria-label="Thêm vào danh sách yêu thích"
          >
            <svg
              className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>

          {/* Pack Weight Bottom Right */}
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs shadow-xs">
            {product.packWeight}
          </span>
        </div>

        {/* Stock / Freshness Indicator */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span className="font-medium truncate">{product.stockStatus}</span>
        </div>

        {/* Product Title */}
        <h3 className="mt-1 text-xs sm:text-[13px] font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#195329] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Unit Price */}
        <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5">
          {product.unitPrice}
        </p>
      </div>

      {/* Price & Action Button */}
      <div className="mt-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-extrabold text-[#195329] dark:text-emerald-400">
            {formatPrice(product.price)} đ
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatPrice(product.originalPrice)} đ
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-2 w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer ${
            isAdded
              ? "bg-emerald-800 text-white"
              : "bg-[#195329] hover:bg-[#12421f] text-white"
          }`}
        >
          {isAdded ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>Đã chọn</span>
            </>
          ) : (
            <>
              <span>+ Chọn mua</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
