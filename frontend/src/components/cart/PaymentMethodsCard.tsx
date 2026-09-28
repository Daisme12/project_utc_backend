"use client";

import React, { useState } from "react";

export default function PaymentMethodsCard({
  selectedMethod,
  onSelectMethod,
}: {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}) {
  const methods = [
    {
      id: "vnpay",
      title: "VNPAY-QR / VietQR Chuyển khoản",
      badge: "Giảm 15k",
      desc: "Quét mã QR qua app Mobile Banking mọi ngân hàng, xác nhận tức thì",
      icon: "📱",
      tags: ["VCB", "MB", "Techcombank"],
    },
    {
      id: "ewallet",
      title: "Ví điện tử MoMo / ZaloPay / ShopeePay",
      desc: "Liên kết ví thanh toán 1 chạm an toàn không mất phí",
      icon: "👛",
      hasArrow: true,
    },
    {
      id: "card",
      title: "Thẻ quốc tế Visa / MasterCard / JCB",
      desc: "Bảo mật mã hóa 3D-Secure 256-bit chuẩn quốc tế",
      icon: "💳",
      tags: ["VISA", "MC"],
    },
    {
      id: "cod",
      title: "Thanh toán khi nhận hàng (COD)",
      desc: "Đồng kiểm tra độ tươi dẻo và nhiệt độ thùng lạnh trước khi thanh toán",
      badge: "Được kiểm hàng",
      badgeType: "green",
      icon: "🚚",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
        <span>💳</span>
        <span>Phương thức thanh toán</span>
      </h2>

      {/* Methods List */}
      <div className="space-y-3">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;

          return (
            <label
              key={m.id}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                isSelected
                  ? "bg-[#f2faf3] dark:bg-emerald-950/30 border-[#195329] dark:border-emerald-600 shadow-xs ring-1 ring-[#195329]"
                  : "bg-white dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={isSelected}
                  onChange={() => onSelectMethod(m.id)}
                  className="mt-1 w-4 h-4 text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                      {m.title}
                    </span>
                    {m.badge && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.badgeType === "green"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {m.desc}
                  </p>
                </div>
              </div>

              {/* Right Tag/Icons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {m.tags &&
                  m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-700 text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                {m.hasArrow && <span className="text-gray-400 text-xs">&gt;</span>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
