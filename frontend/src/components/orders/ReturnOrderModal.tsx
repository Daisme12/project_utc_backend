"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export interface ReturnOrderModalProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
}

export default function ReturnOrderModal({
  isOpen,
  order,
  onClose,
}: ReturnOrderModalProps) {
  const [reason, setReason] = useState("cold_chain");
  const [note, setNote] = useState("");
  const [refundMethod, setRefundMethod] = useState("original");
  const [bankInfo, setBankInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const formatPrice = (price: number | undefined) => {
    if (!price) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ";
  };

  const reasons = [
    {
      id: "cold_chain",
      label: "Thực phẩm không đạt nhiệt độ lạnh 0 - 4°C khi nhận",
      desc: "Thịt/thực phẩm bị ấm hoặc đá gel tan chảy hoàn toàn",
    },
    {
      id: "quality",
      label: "Chất lượng không đạt (màu sắc lạ, mùi lạ, dập nát)",
      desc: "Bao bì rách, hở khí, thực phẩm mất độ tươi dẻo",
    },
    {
      id: "wrong_items",
      label: "Giao sai hoặc giao thiếu sản phẩm so với đơn",
      desc: "Thiếu món hoặc nhầm sang loại thực phẩm khác",
    },
    {
      id: "other",
      label: "Lý do khác",
      desc: "Thay đổi nhu cầu hoặc đơn giao quá thời gian cam kết 2H",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success(
        `Đã tiếp nhận yêu cầu hoàn tiền cho đơn #${order.orderCode}!`
      );
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setReason("cold_chain");
    setNote("");
    setRefundMethod("original");
    setBankInfo("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-red-50/60 via-orange-50/40 to-white dark:from-red-950/30 dark:via-zinc-850 dark:to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center text-xl shadow-xs">
              ↩️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>Yêu cầu Trả hàng & Hoàn tiền</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Đơn hàng:{" "}
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  #{order.orderCode}
                </span>{" "}
                • Giá trị:{" "}
                <strong className="text-red-600 dark:text-red-400">
                  {formatPrice(order.finalAmount || order.totalAmount)}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-sm">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white">
                Đã tiếp nhận yêu cầu hoàn tiền thành công!
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto leading-relaxed">
                Mã yêu cầu hoàn tiền cho đơn{" "}
                <strong className="text-gray-900 dark:text-white">
                  #{order.orderCode}
                </strong>{" "}
                đã được gửi đến Trưởng bộ phận Chăm Sóc Khách Hàng. Chúng tôi sẽ
                liên hệ với bạn qua số điện thoại/Zalo{" "}
                <strong className="text-[#195329] dark:text-emerald-400">
                  {order.customerPhone || "đã đăng ký"}
                </strong>{" "}
                trong vòng <strong>15 phút</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền dự kiến hoàn:</span>
                <span className="font-extrabold text-red-600 dark:text-red-400">
                  {formatPrice(order.finalAmount || order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kênh giải quyết:</span>
                <span className="font-bold text-[#195329] dark:text-emerald-300">
                  Hotline & Zalo CSKH 24/7
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian hoàn tất:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Trong vòng 2 - 24 giờ làm việc
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:19008912"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>📞</span>
                <span>Gọi Hotline 1900 8912 ngay</span>
              </a>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        ) : (
          /* FORM & CONTACT DETAILS */
          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto"
          >
            {/* 1. Ubofood 100% Quality Assurance Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-zinc-850 border border-emerald-200/80 dark:border-emerald-800/50 text-xs space-y-1">
              <span className="font-black text-[#195329] dark:text-emerald-300 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Cam kết 100% hoàn tiền từ Ubofood:</span>
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                Quý khách được quyền hoàn tiền 100% không phát sinh chi phí nếu thịt
                tươi mát không đạt nhiệt độ 0 - 4°C, giao sai sản phẩm, hoặc thực
                phẩm bị hỏng do khâu vận chuyển.
              </p>
            </div>

            {/* 2. Direct Support Channels Box */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 space-y-2.5 text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300 block text-[11px] uppercase tracking-wider">
                📞 Liên hệ nhanh với bộ phận đổi trả & hoàn tiền:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="tel:19008912"
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-emerald-400 flex items-center gap-2.5 transition-all group"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                    📞
                  </span>
                  <div>
                    <span className="text-[10px] text-gray-400 block">
                      Hotline 24/7 (Miễn phí)
                    </span>
                    <span className="font-black text-[#195329] dark:text-emerald-400 group-hover:underline text-xs">
                      1900 8912
                    </span>
                  </div>
                </a>

                <a
                  href="https://zalo.me/0966666666"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-blue-400 flex items-center gap-2.5 transition-all group"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                    💬
                  </span>
                  <div>
                    <span className="text-[10px] text-gray-400 block">
                      Zalo CSKH nhận ảnh/video
                    </span>
                    <span className="font-black text-blue-600 dark:text-blue-400 group-hover:underline text-xs">
                      0966 666 666
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* 3. Reason Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                Chọn lý do bạn muốn hoàn hàng: <span className="text-red-500">*</span>
              </label>

              <div className="space-y-1.5">
                {reasons.map((r) => {
                  const isChecked = reason === r.id;
                  return (
                    <label
                      key={r.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800 ring-1 ring-red-400/40"
                          : "bg-white dark:bg-zinc-800/40 border-gray-200 dark:border-zinc-700 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="returnReason"
                        checked={isChecked}
                        onChange={() => setReason(r.id)}
                        className="mt-0.5 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {r.label}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {r.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Note input */}
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Mô tả chi tiết tình trạng thực phẩm:
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Khay thịt bị thủng túi hút chân không, nhiệt độ không còn mát..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
              />
            </div>

            {/* 5. Refund method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                Phương thức nhận lại tiền:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${
                    refundMethod === "original"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-[#195329] text-[#195329] font-bold"
                      : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="refundMethod"
                    checked={refundMethod === "original"}
                    onChange={() => setRefundMethod("original")}
                    className="text-[#195329]"
                  />
                  <span>Hoàn về nguồn thanh toán gốc</span>
                </label>

                <label
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${
                    refundMethod === "bank"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-[#195329] text-[#195329] font-bold"
                      : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="refundMethod"
                    checked={refundMethod === "bank"}
                    onChange={() => setRefundMethod("bank")}
                    className="text-[#195329]"
                  />
                  <span>Chuyển khoản qua số tài khoản khác</span>
                </label>
              </div>

              {refundMethod === "bank" && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                    placeholder="Ngân hàng - Số tài khoản - Tên chủ tài khoản..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang gửi yêu cầu...</span>
                  </>
                ) : (
                  <>
                    <span>↩️</span>
                    <span>Gửi yêu cầu hoàn hàng</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
