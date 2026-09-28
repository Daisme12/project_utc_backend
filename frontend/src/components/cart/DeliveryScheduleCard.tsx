"use client";

import React, { useState } from "react";

export default function DeliveryScheduleCard() {
  const [selectedMethod, setSelectedMethod] = useState<"fast2h" | "scheduled">("fast2h");

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white flex items-center gap-2">
          <span>❄️</span>
          <span>Phương thức bảo quản & Thời gian giao</span>
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Quy trình vận tải lạnh khép kín OxyFresh chuyên nghiệp từ kho đến cửa nhà
        </p>
      </div>

      {/* 2 Radio Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Option 1: Giao siêu tốc 2H */}
        <label
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
            selectedMethod === "fast2h"
              ? "bg-[#f2faf3] dark:bg-emerald-950/30 border-[#195329] dark:border-emerald-600 shadow-xs ring-1 ring-[#195329]"
              : "bg-white dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700 hover:border-emerald-300"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={selectedMethod === "fast2h"}
                  onChange={() => setSelectedMethod("fast2h")}
                  className="w-4 h-4 text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                  <span>⚡ Giao siêu tốc 2H</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#195329] text-white text-[10px] font-bold">
                Miễn phí
              </span>
            </div>

            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              Thùng giữ nhiệt lạnh OxyFresh 0 - 4°C
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Dự kiến nhận hàng: <span className="font-bold text-gray-800 dark:text-gray-200">10:30 - 11:30 Hôm nay</span>
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] font-semibold text-[#195329] dark:text-emerald-400 flex items-center gap-1">
            <span>🛡️</span>
            <span>Đảm bảo thịt mát không bị tái sinh nhiệt</span>
          </div>
        </label>

        {/* Option 2: Hẹn giờ giao định kỳ */}
        <label
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
            selectedMethod === "scheduled"
              ? "bg-[#f2faf3] dark:bg-emerald-950/30 border-[#195329] dark:border-emerald-600 shadow-xs ring-1 ring-[#195329]"
              : "bg-white dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700 hover:border-emerald-300"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={selectedMethod === "scheduled"}
                  onChange={() => setSelectedMethod("scheduled")}
                  className="w-4 h-4 text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                  <span>⏰ Hẹn giờ giao định kỳ</span>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                0đ
              </span>
            </div>

            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              Chọn khung giờ chiều tiện nấu bữa tối
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Khung giờ: <span className="font-bold text-gray-800 dark:text-gray-200">16:00 - 18:00 Chiều nay</span>
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-zinc-700 text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <span>🍲</span>
            <span>Giao đúng giờ hẹn cơm nước gia đình</span>
          </div>
        </label>
      </div>
    </div>
  );
}
