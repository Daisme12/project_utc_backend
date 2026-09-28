import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#dfffdf] dark:bg-[#0e1610] p-3 sm:p-4">
      {/* Nút quay về trang chủ */}
      <div className="w-full max-w-[500px] mb-2 flex justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#11311b] dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-zinc-700 shadow-sm hover:shadow active:scale-[0.98]"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span>Về trang chủ</span>
        </Link>
      </div>

      <div className="w-full max-w-[500px]">
        {children}
      </div>
    </div>
  );
}
