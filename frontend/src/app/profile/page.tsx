"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState<{ fullName: string; email?: string; phone?: string }>({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0912 345 678",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#195329]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            Hồ sơ tài khoản
          </span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-2xl font-black text-[#195329] dark:text-emerald-400 shadow-sm">
                {user.fullName ? user.fullName.trim().charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#113a1b] dark:text-white">
                  {user.fullName}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Thành viên thân thiết Ubofood • Điểm tích lũy: <span className="font-bold text-[#195329]">240 điểm</span>
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 text-xs font-bold">
              ✓ Đã xác thực
            </span>
          </div>

          {/* User Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700">
              <span className="text-gray-400 text-xs block mb-1">Họ và tên</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">{user.fullName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700">
              <span className="text-gray-400 text-xs block mb-1">Số điện thoại</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">{user.phone || "0912 345 678"}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700">
              <span className="text-gray-400 text-xs block mb-1">Email liên hệ</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">{user.email || "nguyenvana@gmail.com"}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700">
              <span className="text-gray-400 text-xs block mb-1">Địa chỉ giao hàng mặc định</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">Cầu Giấy, Hà Nội</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/cart"
              className="px-4 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all shadow-xs"
            >
              🛒 Xem giỏ hàng
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all"
            >
              Tiếp tục đi chợ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
