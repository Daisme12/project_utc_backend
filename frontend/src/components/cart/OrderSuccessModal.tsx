"use client";

import React from "react";
import Link from "next/link";

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderCode: string;
  totalAmount: number;
  deliveryTime: string;
  onClose: () => void;
}

export default function OrderSuccessModal({
  isOpen,
  orderCode,
  totalAmount,
  deliveryTime,
  onClose,
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-zinc-800 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-sm animate-bounce">
          ✓
        </div>

        <div>
          <span className="text-[11px] font-bold text-[#195329] uppercase tracking-wider block">
            ĐẶT HÀNG THÀNH CÔNG
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
            Cảm ơn bạn đã tin chọn Ubofood!
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Mã đơn hàng: <strong className="text-gray-900 dark:text-white">#{orderCode}</strong>
          </p>
        </div>

        {/* Details Box */}
        <div className="p-4 rounded-2xl bg-[#f2faf3] dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Dự kiến giao hàng:</span>
            <span className="font-bold text-[#195329] dark:text-emerald-300">
              {deliveryTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tổng thanh toán:</span>
            <span className="font-extrabold text-gray-900 dark:text-white">
              {formatPrice(totalAmount)}đ
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Bảo quản:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Thùng giữ nhiệt lạnh OxyFresh 0 - 4°C
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <Link
            href="/products"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#195329] hover:bg-[#12421f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
          >
            <span>Tiếp tục đi chợ</span>
            <span>→</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
