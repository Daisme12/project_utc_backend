"use client";

import React from "react";
import Image from "next/image";
import { CartItem } from "@/context/CartContext";

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  tag: string;
  hubDistance?: string;
  deliveryInstruction?: string;
}

interface OrderConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  selectedItems: CartItem[];
  deliveryInfo: DeliveryInfo;
  deliverySchedule: "fast2h" | "scheduled";
  deliveryTime: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  totalDiscount: number;
  finalTotal: number;
  voucherCode?: string;
}

export default function OrderConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  selectedItems,
  deliveryInfo,
  deliverySchedule,
  deliveryTime,
  paymentMethod,
  subtotal,
  shippingFee,
  totalDiscount,
  finalTotal,
  voucherCode,
}: OrderConfirmModalProps) {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod.toLowerCase()) {
      case "vnpay":
        return {
          title: "VNPAY-QR / VietQR Chuyển khoản",
          icon: "📱",
          desc: "Quét mã QR qua ứng dụng ngân hàng",
        };
      case "card":
        return {
          title: "Thẻ quốc tế Visa / MasterCard",
          icon: "💳",
          desc: "Thanh toán an toàn qua cổng thẻ",
        };
      default:
        return {
          title: "Tiền mặt khi nhận hàng (COD)",
          icon: "💵",
          desc: "Thanh toán cho shipper khi nhận thực phẩm",
        };
    }
  };

  const paymentInfo = getPaymentMethodDisplay();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#195329] text-white flex items-center justify-center text-lg shadow-sm">
              📋
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white">
                Xác nhận đơn hàng & Thanh toán
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vui lòng kiểm tra lại thông tin đơn hàng lần cuối
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* 1. Recipient & Delivery Info */}
          <div className="p-4 rounded-2xl bg-[#f2faf3] dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#195329] dark:text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>📍</span>
                <span>Thông tin giao nhận</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#195329] text-white text-[10px] font-bold">
                {deliveryInfo.tag || "Nhà riêng"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-gray-900 dark:text-white">
                {deliveryInfo.name}
              </span>
              <span className="text-gray-300 dark:text-zinc-700">•</span>
              <span className="font-bold text-gray-700 dark:text-gray-200 font-mono">
                {deliveryInfo.phone}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {deliveryInfo.address}
            </p>

            <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1 text-[#195329] dark:text-emerald-400 font-semibold">
                <span>{deliverySchedule === "fast2h" ? "⚡" : "⏰"}</span>
                <span>Khung giờ: {deliveryTime}</span>
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <span>❄️ Thùng giữ nhiệt lạnh OxyFresh 0-4°C</span>
              </span>
            </div>

            {deliveryInfo.deliveryInstruction && (
              <p className="text-[11px] text-gray-500 italic bg-white/60 dark:bg-zinc-800/60 p-2 rounded-xl">
                Ghi chú: {deliveryInfo.deliveryInstruction}
              </p>
            )}
          </div>

          {/* 2. Payment Method Card */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{paymentInfo.icon}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {paymentInfo.title}
                </p>
                <p className="text-[11px] text-gray-500">{paymentInfo.desc}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#195329] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60">
              {paymentMethod.toUpperCase()}
            </span>
          </div>

          {/* 3. Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-gray-700 dark:text-gray-300 text-xs">
              <span>Sản phẩm đặt mua ({selectedItems.length})</span>
              <span className="text-gray-400 text-[11px]">
                Tổng số lượng: {selectedItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800 max-h-48 overflow-y-auto pr-1 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-sm">🥩</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.packWeight} • x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 dark:text-white flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Price Breakdown */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tạm tính hàng tươi:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatPrice(subtotal)}đ
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Phí vận chuyển 2H:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {shippingFee > 0 ? `${formatPrice(shippingFee)}đ` : "Miễn phí"}
              </span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-orange-600 dark:text-orange-400 font-semibold">
                <span>Giảm giá khuyến mại {voucherCode ? `(${voucherCode})` : ""}:</span>
                <span>-{formatPrice(totalDiscount)}đ</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex items-baseline justify-between">
              <span className="text-sm font-black text-gray-900 dark:text-white uppercase">
                TỔNG THANH TOÁN:
              </span>
              <span className="text-xl font-black text-[#195329] dark:text-emerald-400">
                {formatPrice(finalTotal)}đ
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/90 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer text-xs sm:text-sm disabled:opacity-50"
          >
            Quay lại kiểm tra
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onConfirm}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#195329] hover:bg-[#12421f] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Đang xử lý đặt hàng...</span>
              </>
            ) : (
              <>
                <span>XÁC NHẬN ĐẶT HÀNG</span>
                <span>({formatPrice(finalTotal)}đ)</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
