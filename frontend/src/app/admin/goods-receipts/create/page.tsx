"use client";

import React from "react";
import Link from "next/link";
import MultiProductGoodsReceiptForm from "@/components/admin/MultiProductGoodsReceiptForm";

export default function CreateMultiProductGoodsReceiptPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-[#1f2e25]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/goods-receipts"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>←</span>
              <span>Danh Sách Phiếu Nhập Kho</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs text-gray-400 font-medium">Tạo Phiếu Mới</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Lập Phiếu Nhập Kho & Mua Hàng</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
              Đa Sản Phẩm
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Chọn nhiều nguyên vật liệu & sản phẩm cùng lúc, kiểm tra xem trước phiếu và tự động cộng dồn tồn kho.
          </p>
        </div>

        <Link
          href="/admin/goods-receipts"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1a261f] hover:bg-gray-200 dark:hover:bg-[#243329] text-gray-700 dark:text-gray-300 text-xs font-bold transition-all"
        >
          <span>✕</span>
          <span>Đóng & Quay Lại</span>
        </Link>
      </div>

      {/* Main Form */}
      <MultiProductGoodsReceiptForm isModal={false} />
    </div>
  );
}
