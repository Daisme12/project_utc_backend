"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { totalItems, totalPrice, clearCart } = useCart();

  // Chỉ kích hoạt khi cart có ít nhất 1 sản phẩm và không ở trang /cart
  if (totalItems < 1 || pathname === "/cart") {
    return null;
  }

  const handleReset = () => {
    clearCart();
    toast.info("Đã làm mới giỏ hàng tạm tính");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <aside
      aria-label="Giỏ hàng nhanh"
      className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto bg-[#133e1e] text-white rounded-2xl sm:rounded-full p-2.5 sm:px-5 sm:py-3 shadow-2xl border border-emerald-600/40 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ease-out">
        {/* Left Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Bag Icon */}
          <div className="relative w-10 h-10 rounded-full bg-[#195329] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-xs">
            <svg
              className="w-5 h-5 text-emerald-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-scale">
              {totalItems}
            </span>
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>Đã chọn {totalItems} khay thịt mát</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-300 font-extrabold">
                {formatPrice(totalPrice)} đ
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/80">
              Cả đơn tròn: Được tối đa{" "}
              <span className="text-amber-300 font-bold">
                Miễn phí vận chuyển 2h
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-300 hover:text-white underline cursor-pointer transition-colors px-2 py-1"
          >
            Làm mới
          </button>

          <Link
            href="/cart"
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl sm:rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d2a17] font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Xem giỏ hàng & Thanh toán</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
