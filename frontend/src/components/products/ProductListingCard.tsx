"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

export default function ProductListingCard({ product }: { product: Product }) {
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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-gray-100 dark:border-zinc-800 shadow-xs hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discountBadge && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black text-white bg-red-600 shadow-xs">
                {product.discountBadge}
              </span>
            )}
            {product.badge && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/90 backdrop-blur-xs shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Top Right Favorite Button */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-xs z-10 cursor-pointer"
            aria-label="Yêu thích"
          >
            <svg
              className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          {/* Bottom Bar Inside Image: Pack weight & Stock / freshness info */}
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs px-2 py-1 flex items-center justify-between text-[10px] text-white font-medium">
            <span>{product.packWeight}</span>
            <span className="text-emerald-300 font-bold truncate max-w-[120px]">
              {product.stockStatus}
            </span>
          </div>
        </div>

        {/* Brand Subline */}
        <div className="mt-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {product.brand}
        </div>

        {/* Product Title */}
        <h3 className="mt-0.5 text-xs sm:text-[13px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#195329] dark:group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[34px]">
          {product.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="text-amber-400">★</span>
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {product.rating}
          </span>
          <span>({product.reviewCount} đánh giá)</span>
        </div>
      </div>

      {/* Price & Cart Action */}
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through block -mb-0.5">
              {formatPrice(product.originalPrice)}đ
            </span>
          )}
          <div className="text-sm sm:text-base font-extrabold text-[#195329] dark:text-emerald-400 leading-tight">
            {formatPrice(product.price)}đ
          </div>
          <span className="text-[10px] text-gray-400 block">
            {product.unitPrice}
          </span>
        </div>

        {/* Round Green Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm transition-all active:scale-95 cursor-pointer flex-shrink-0 ${
            isAdded
              ? "bg-emerald-800"
              : "bg-[#195329] hover:bg-[#12421f]"
          }`}
          aria-label="Thêm vào giỏ"
        >
          {isAdded ? (
            <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
