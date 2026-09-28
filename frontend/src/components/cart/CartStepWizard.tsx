import React from "react";

interface CartStepWizardProps {
  currentStep?: number;
  totalPrice: number;
}

export default function CartStepWizard({
  currentStep = 2,
  totalPrice,
}: CartStepWizardProps) {
  const isFreeShipUnlocked = totalPrice >= 150000;
  const progressPercent = Math.min(100, Math.round((totalPrice / 150000) * 100));

  return (
    <div className="space-y-4">
      {/* 1. 3-Step Wizard Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
              ✓
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                BƯỚC 1
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                1. Giỏ hàng tươi sạch
              </span>
            </div>
          </div>

          {/* Step 2 (Active) */}
          <div className="flex items-center gap-3 sm:border-l sm:border-r border-gray-100 dark:border-zinc-800 sm:px-4">
            <div className="w-8 h-8 rounded-full bg-[#195329] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-950/20 flex-shrink-0">
              2
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#195329] dark:text-emerald-400 block uppercase tracking-wider">
                ĐANG THỰC HIỆN
              </span>
              <span className="text-xs font-black text-gray-900 dark:text-white">
                2. Giao hàng & Khung giờ
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 sm:pl-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                BƯỚC TIẾP THEO
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                3. Thanh toán an toàn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Freeship & Gift Box Progress Banner */}
      <div
        className={`rounded-2xl p-3.5 sm:px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs border transition-all ${
          isFreeShipUnlocked
            ? "bg-[#f2faf3] dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50"
            : "bg-[#fffbeb] dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/50"
        }`}
      >
        <div className="flex items-start sm:items-center gap-3">
          <span className="text-2xl flex-shrink-0">
            {isFreeShipUnlocked ? "🎉" : "🚚"}
          </span>
          <div>
            {totalPrice === 0 ? (
              <>
                <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 leading-snug">
                  Chưa chọn món nào •{" "}
                  <span className="text-[#195329] dark:text-emerald-400 font-extrabold">
                    Tích chọn sản phẩm để tính phí & ưu đãi
                  </span>
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  Đơn hàng từ 150.000đ được MIỄN PHÍ VẬN CHUYỂN 2H + Tặng kèm túi giữ nhiệt đá gel OxyFresh chuyên dụng.
                </p>
              </>
            ) : isFreeShipUnlocked ? (
              <>
                <p className="text-xs sm:text-sm font-bold text-[#113a1b] dark:text-emerald-200 leading-snug">
                  Chúc mừng bạn! Đơn hàng đã đạt{" "}
                  <span className="text-[#195329] dark:text-emerald-400 font-extrabold">
                    {new Intl.NumberFormat("vi-VN").format(totalPrice)}đ
                  </span>
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  Đủ điều kiện{" "}
                  <span className="font-extrabold text-[#195329] dark:text-emerald-400">
                    MIỄN PHÍ VẬN CHUYỂN 2H
                  </span>{" "}
                  + Tặng kèm túi giữ nhiệt đá gel OxyFresh chuyên dụng.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 leading-snug">
                  Mua thêm{" "}
                  <span className="text-red-600 dark:text-red-400 font-extrabold">
                    {new Intl.NumberFormat("vi-VN").format(150000 - totalPrice)}đ
                  </span>{" "}
                  để được <span className="text-[#195329] font-extrabold">MIỄN PHÍ VẬN CHUYỂN 2H</span>!
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                  Đơn hàng từ 150.000đ được tặng kèm túi giữ nhiệt đá gel OxyFresh chuyên dụng.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Progress Pill Right */}
        <div className="self-end md:self-auto flex items-center gap-2">
          {isFreeShipUnlocked ? (
            <div className="px-3.5 py-1.5 rounded-full bg-[#195329] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs whitespace-nowrap">
              <span>Đã mở khóa 100%</span>
              <span>🎁 Freeship</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-amber-200 dark:border-zinc-700">
              <div className="w-24 sm:w-28 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#195329] whitespace-nowrap">
                {progressPercent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
