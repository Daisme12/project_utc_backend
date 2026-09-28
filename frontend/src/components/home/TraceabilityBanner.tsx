import Link from "next/link";

export default function TraceabilityBanner() {
  return (
    <section id="traceability" className="mt-14 sm:mt-20">
      <div className="w-full rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Information */}
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-extrabold uppercase tracking-wider text-[#0f5b28] dark:text-emerald-400">
            MÃ TRUY XUẤT NGUỒN GỐC TỪNG LÔ HÀNG
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0d2a17] dark:text-white tracking-tight">
            Kiểm tra nhật ký canh tác thực tế
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Mỗi túi rau giao tới quý khách đều có tem QR truy xuất: ngày xuống giống,
            nguồn nước tưới thủy canh Đà Lạt, kỹ sư giám sát và giờ cắt tươi.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-[#0f5b28] dark:text-emerald-400">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>Không biến đổi gen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>Không chất bảo quản</span>
            </div>
          </div>
        </div>

        {/* Right QR Box */}
        <div className="rounded-2xl bg-[#ebf7ee] dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 p-4 sm:p-5 flex items-center gap-4 flex-shrink-0">
          {/* QR Icon */}
          <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-800 p-2 shadow-xs flex items-center justify-center flex-shrink-0 text-[#0f5b28] dark:text-emerald-400">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h3.75m0 3.75h3.75m-3.75 3.75h3.75M13.5 17.25h.75v.75h-.75v-.75ZM17.25 13.5h.75v.75h-.75v-.75Z"
              />
            </svg>
          </div>

          {/* Lot info */}
          <div>
            <span className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              LÔ HÀNG HÔM NAY: #DL-2024-04
            </span>
            <span className="block text-sm sm:text-base font-bold text-[#0d2a17] dark:text-white mt-0.5">
              Vườn rau công nghệ cao Langbiang
            </span>
            <Link
              href="#video"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f5b28] dark:text-emerald-400 hover:underline mt-1"
            >
              <span>Xem video trực tiếp từ farm</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
