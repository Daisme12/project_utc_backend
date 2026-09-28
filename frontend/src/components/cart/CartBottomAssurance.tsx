import React from "react";

export default function CartBottomAssurance() {
  return (
    <div className="mt-8 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#195329] text-xl flex-shrink-0">
          🔄
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
            Đổi trả nhanh trong 24 giờ
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Chụp hình thịt gửi qua Zalo/App là được đổi ngay khay mới, không cần thủ tục phức tạp.
          </p>
        </div>
      </div>

      <a
        href="https://zalo.me"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
      >
        <span>💬</span>
        <span>Chat Zalo với Chuyên Viên Tươi Sống</span>
      </a>
    </div>
  );
}
