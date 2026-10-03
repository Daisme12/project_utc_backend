"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

import { getOrderStatusInfo } from "@/lib/orderStatus";

export interface OrderDetailModalProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
  onRequestReturn?: (order: any) => void;
}

export default function OrderDetailModal({
  isOpen,
  order,
  onClose,
  onRequestReturn,
}: OrderDetailModalProps) {
  const { addItem } = useCart();

  if (!isOpen || !order) return null;

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ";
  };

  const getPaymentBadge = (method: string) => {
    switch (method?.toUpperCase()) {
      case "VNPAY":
        return { label: "VNPAY-QR (Đã xác nhận)", color: "text-[#195329] dark:text-emerald-300" };
      case "CARD":
        return { label: "Thẻ quốc tế (Visa/MasterCard)", color: "text-blue-600 dark:text-blue-400" };
      case "MOMO":
        return { label: "Ví điện tử MoMo", color: "text-pink-600 dark:text-pink-400" };
      case "CASH":
        return { label: "Tiền mặt tại quầy (POS)", color: "text-gray-700 dark:text-gray-300" };
      default:
        return { label: "Thanh toán khi nhận hàng (COD)", color: "text-orange-600 dark:text-orange-400" };
    }
  };

  const handleReorder = () => {
    if (!order.items || order.items.length === 0) {
      toast.info("Đơn hàng không có sản phẩm để mua lại");
      return;
    }

    order.items.forEach((item: any) => {
      addItem(
        {
          id: item.productId || item.id || Math.floor(Math.random() * 1000),
          name: item.productName || "Sản phẩm Ubofood",
          price: Number(item.unitPrice) || 0,
          packWeight: item.packWeight || "Khay 300g",
          image:
            item.imageUrl ||
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        },
        Number(item.quantity) || 1
      );
    });

    toast.success(`Đã thêm ${order.items.length} món vào giỏ hàng!`);
  };

  const statusInfo = getOrderStatusInfo(order.orderStatus);
  const paymentInfo = getPaymentBadge(order.paymentMethod || "COD");

  // Determine current timeline step
  const currentStep = statusInfo.step;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-zinc-850 dark:to-zinc-900">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-gray-500">Mã đơn hàng:</span>
              <span className="text-base sm:text-lg font-black text-[#195329] dark:text-emerald-400 font-mono tracking-wide">
                #{order.orderCode}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusInfo.fullBadgeClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Đặt lúc:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Hôm nay"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 1. Status Stepper */}
          {order.orderStatus !== "CANCELLED" && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-xs font-bold text-[#195329] dark:text-emerald-300 block mb-3">
                Tiến độ xử lý đơn hàng
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                {[
                  { step: 1, title: "Đã đặt hàng", icon: "📝" },
                  { step: 2, title: "Sơ chế lạnh", icon: "🥩" },
                  { step: 3, title: "Đang giao 2H", icon: "🚚" },
                  { step: 4, title: "Hoàn tất", icon: "✅" },
                ].map((s) => {
                  const isDone = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;

                  return (
                    <div key={s.step} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                          isDone
                            ? "bg-[#195329] text-white shadow-xs"
                            : "bg-gray-200 dark:bg-zinc-800 text-gray-400"
                        } ${isCurrent ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}
                      >
                        {isDone ? s.icon : s.step}
                      </div>
                      <span
                        className={`font-semibold leading-tight ${
                          isDone
                            ? "text-[#195329] dark:text-emerald-300"
                            : "text-gray-400"
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 space-y-1.5">
              <span className="font-bold text-gray-500 dark:text-gray-400 block text-[11px]">
                👤 Thông tin người nhận
              </span>
              <p className="font-black text-gray-900 dark:text-white text-sm">
                {order.customerName || "Khách Hàng"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                📞 {order.customerPhone || "0988 888 888"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 pt-1 leading-snug">
                📍 {order.shippingAddress || "Số 3 Cầu Giấy, Láng Thượng, Hà Nội"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 space-y-1.5">
              <span className="font-bold text-gray-500 dark:text-gray-400 block text-[11px]">
                💳 Thanh toán & Vận chuyển
              </span>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-gray-500">Hình thức:</span>
                <span className={`font-bold ${paymentInfo.color}`}>
                  {paymentInfo.label}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-gray-500">Giao hàng:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {order.deliveryMethod === "FAST_2H"
                    ? "Hỏa tốc 2H (0-4°C)"
                    : "Giao tiêu chuẩn"}
                </span>
              </div>
              {order.note && (
                <div className="pt-1 text-[11px] text-gray-500 border-t border-gray-200 dark:border-zinc-700">
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* 3. Items List */}
          <div>
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Sản phẩm trong đơn ({order.items?.length || 0})</span>
              <span className="text-[11px] font-normal text-gray-400">
                Đóng gói khay tiệt trùng OxyFresh
              </span>
            </h4>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-zinc-850/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.imageUrl ||
                          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={item.productName || "Sản phẩm"}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-zinc-700 flex-shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                          {item.productName || "Sản phẩm tươi"}
                        </h5>
                        <p className="text-[11px] text-gray-400">
                          {item.packWeight || "Khay 300g"} • Đơn giá:{" "}
                          {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-gray-500 block">
                        x{item.quantity || 1}
                      </span>
                      <span className="font-black text-[#195329] dark:text-emerald-400 text-xs">
                        {formatPrice(
                          item.subtotal ||
                            (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1)
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  Không có chi tiết sản phẩm
                </div>
              )}
            </div>
          </div>

          {/* 4. Financial Breakdown */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatPrice(order.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Phí vận chuyển & giữ nhiệt lạnh:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatPrice(order.shippingFee || 0)}
              </span>
            </div>

            {order.totalAmount &&
              order.finalAmount &&
              Number(order.totalAmount) + Number(order.shippingFee || 0) >
                Number(order.finalAmount) && (
                <div className="flex justify-between text-[#195329] dark:text-emerald-400 font-bold">
                  <span>Ưu đãi giảm giá / Voucher:</span>
                  <span>
                    -
                    {formatPrice(
                      Number(order.totalAmount) +
                        Number(order.shippingFee || 0) -
                        Number(order.finalAmount)
                    )}
                  </span>
                </div>
              )}

            <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-baseline">
              <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase">
                Tổng thanh toán:
              </span>
              <span className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">
                {formatPrice(order.finalAmount || order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900 flex flex-wrap items-center justify-end gap-2.5">
          {onRequestReturn && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestReturn(order);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-900 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>↩️</span>
              <span>Yêu cầu hoàn hàng</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReorder}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>Mua lại đơn này</span>
          </button>

          <Link
            href="/cart"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>🛒</span>
            <span>Vào giỏ hàng</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
