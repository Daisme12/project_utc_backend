"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { logoutAction, checkAuthAction } from "@/actions/auth";
import { CATEGORIES } from "@/data/products";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLocation, setSelectedLocation] = useState("Hà Nội, Cầu Giấy");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items, totalItems, totalPrice, removeItem } = useCart();

  // Trạng thái tài khoản người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email?: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Trạng thái sao chép mã ưu đãi
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  const promoVouchers = [
    {
      code: "GIAM50K",
      title: "Giảm 50.000đ cho đơn đầu tiên",
      condition: "Đơn hàng thịt mát từ 150.000đ",
      badge: "HOT -50%",
      badgeColor: "bg-red-600 text-white",
      expiry: "HSD: 23:59 hôm nay",
    },
    {
      code: "FREESHIP2H",
      title: "Miễn phí vận chuyển 2H (-25.000đ)",
      condition: "Đơn hàng chỉ từ 150.000đ",
      badge: "FREESHIP",
      badgeColor: "bg-emerald-600 text-white",
      expiry: "Ưu đãi toàn sàn",
    },
    {
      code: "UBOMEAT",
      title: "Giảm 20.000đ thịt bò Úc & heo mát",
      condition: "Áp dụng cho thịt mát Ubomeat",
      badge: "-20K",
      badgeColor: "bg-orange-500 text-white",
      expiry: "Hạn dùng 30 ngày",
    },
    {
      code: "UBOCHAOXUAN",
      title: "Giảm 10.000đ chào bạn mới",
      condition: "Không giới hạn giá trị đơn hàng",
      badge: "-10K",
      badgeColor: "bg-amber-500 text-white",
      expiry: "Khách hàng mới",
    },
  ];

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    toast.success(`Đã sao chép mã "${code}"! Dán tại giỏ hàng để nhận ưu đãi.`);
    setTimeout(() => {
      setCopiedVoucher((prev) => (prev === code ? null : prev));
    }, 2000);
  };

  const checkAuth = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
        return;
      }
      if (storedToken) {
        setIsLoggedIn(true);
        setUser({ fullName: "Nguyễn Văn A" });
        return;
      }
    } catch {}

    try {
      const res = await checkAuthAction();
      if (res.isLoggedIn) {
        setIsLoggedIn(true);
        setUser({ fullName: "Nguyễn Văn A" });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [checkAuth]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      setIsUserMenuOpen(false);
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Đăng xuất thành công!", { duration: 2000 });
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const locations = [
    "Hà Nội, Cầu Giấy",
    "Hà Nội, Nam Từ Liêm",
    "Hà Nội, Đống Đa",
    "Hà Nội, Thanh Xuân",
    "Hà Nội, Hai Bà Trưng",
    "TP. Hồ Chí Minh, Quận 1",
    "TP. Hồ Chí Minh, Bình Thạnh",
  ];

  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors">
      {/* 1. TOP UTILITY ANNOUNCEMENT BAR */}
      <div className="bg-[#195329] text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          {/* Left features */}
          <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-4 text-[#dcfce7]">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75a2.25 2.25 0 0 0 2.25 2.25h1.5" />
              </svg>
              Giao siêu tốc 2h
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              Cắt mổ xẻ đóng gói 0 - 4°C
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              100% Chuẩn VietGAP
            </span>
          </div>

          {/* Right contacts */}
          <div className="flex items-center gap-3 sm:gap-4 text-[#e2f8eb] text-[11px]">
            <a href="tel:19008912" className="hover:text-white flex items-center gap-1">
              <span>📞 CSKH: 1900 8912</span>
            </a>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <span>📍 18 Cửa hàng Toàn Quốc</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-[#195329] flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-[#164e27] dark:text-emerald-400">
              Ubofood
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 font-semibold tracking-wide">
              Thịt Tươi & Sống Sạch
            </div>
          </div>
        </Link>

        {/* Location Selector */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700/80 border border-gray-200/70 dark:border-zinc-700 text-left transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#195329] dark:text-emerald-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400 font-medium">Giao đến:</div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1">
                <span>{selectedLocation}</span>
                <span className="text-[10px] text-gray-400">▼</span>
              </div>
            </div>
          </button>

          {isLocationOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 py-1 z-50">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors ${
                    selectedLocation === loc ? "font-bold text-[#195329] dark:text-emerald-400" : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 pl-3 pr-1 py-1 focus-within:border-[#195329] focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all"
          >
            <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm thịt heo CP, bò Úc mát..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-[#195329] hover:bg-[#12421f] text-white text-xs font-semibold shadow-xs transition-colors flex-shrink-0 cursor-pointer"
            >
              Tìm Kiếm
            </button>
          </form>
        </div>

        {/* Right CTA Actions: Promo, Cart, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Promo Pill with Hover Dropdown */}
          <div className="relative group hidden md:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold cursor-pointer hover:bg-orange-100 transition-colors select-none">
              <span>🏷️</span>
              <span>Giảm 50%</span>
              <span className="text-[9px] text-orange-500 transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </div>

            {/* Dropdown Menu on Hover */}
            <div className="absolute top-full right-0 pt-2 w-80 sm:w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-3 space-y-2.5">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#113a1b] dark:text-emerald-400 uppercase tracking-wide">
                    <span>🎁</span>
                    <span>Kho Mã Ưu Đãi Ubofood</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Bấm &quot;Sao chép&quot; để dùng
                  </span>
                </div>

                {/* Vouchers List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                  {promoVouchers.map((voucher) => {
                    const isCopied = copiedVoucher === voucher.code;
                    return (
                      <div
                        key={voucher.code}
                        className="p-2.5 rounded-xl border border-dashed border-orange-200 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-all flex items-center justify-between gap-2.5"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-black text-orange-900 dark:text-orange-200 tracking-wide">
                              {voucher.code}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${voucher.badgeColor}`}
                            >
                              {voucher.badge}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                            {voucher.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                            <span>{voucher.condition}</span>
                            <span>•</span>
                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                              {voucher.expiry}
                            </span>
                          </div>
                        </div>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(voucher.code, e)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex-shrink-0 cursor-pointer shadow-xs active:scale-95 ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-[#195329] hover:bg-[#12421f] text-white"
                          }`}
                        >
                          {isCopied ? "✓ Đã chép" : "Sao chép"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Link */}
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <Link
                    href="/cart"
                    className="w-full py-2 px-3 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>👉 Đi tới giỏ hàng để áp dụng mã</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Icon with Hover Dropdown */}
          <div className="relative group">
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors block cursor-pointer"
              aria-label="Giỏ hàng"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#195329] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-scale">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Dropdown Menu on Hover */}
            <div className="absolute top-full right-0 pt-2 w-80 sm:w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-3.5 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#113a1b] dark:text-emerald-400">
                    <span>🛒</span>
                    <span>Giỏ Hàng Tươi Sạch ({totalItems})</span>
                  </div>
                  <Link
                    href="/cart"
                    className="text-[11px] font-bold text-[#195329] dark:text-emerald-400 hover:underline"
                  >
                    Xem chi tiết &gt;
                  </Link>
                </div>

                {/* Items List or Empty State */}
                {items.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <span className="text-3xl block">🧺</span>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Giỏ hàng của bạn đang trống
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Chọn thêm thịt mát chuẩn EU và rau củ VietGAP nhé!
                    </p>
                    <Link
                      href="/products"
                      className="inline-block mt-1 px-4 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-zinc-800">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="pt-2 first:pt-0 flex items-center justify-between gap-3 group/item"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800 flex-shrink-0 border border-gray-100 dark:border-zinc-700">
                              <Image
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"
                                }
                                alt={item.name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {item.packWeight || "Khay 300g"} • SL: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-black text-[#195329] dark:text-emerald-400">
                              {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)}đ
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(item.id);
                                toast.info(`Đã xóa ${item.name}`);
                              }}
                              className="text-gray-300 hover:text-red-500 text-xs p-1 transition-colors cursor-pointer"
                              title="Xóa"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Freeship Progress Hint */}
                    <div className="p-2 rounded-xl bg-[#f2faf3] dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px]">
                      {totalPrice >= 150000 ? (
                        <span className="font-bold text-[#195329] dark:text-emerald-300 flex items-center gap-1">
                          <span>🎉</span>
                          <span>Đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN 2H!</span>
                        </span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300">
                          Mua thêm{" "}
                          <strong className="text-red-600 font-extrabold">
                            {new Intl.NumberFormat("vi-VN").format(150000 - totalPrice)}đ
                          </strong>{" "}
                          để được Freeship 2H
                        </span>
                      )}
                    </div>

                    {/* Subtotal & CTA */}
                    <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-gray-500">Tạm tính giỏ hàng:</span>
                        <span className="text-sm font-black text-[#195329] dark:text-emerald-400">
                          {new Intl.NumberFormat("vi-VN").format(totalPrice)}đ
                        </span>
                      </div>

                      <Link
                        href="/cart"
                        className="w-full py-2.5 px-3 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 active:scale-98"
                      >
                        <span>XEM GIỎ HÀNG & THANH TOÁN</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User Account / Auth Buttons */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl border border-[#195329] text-[#195329] dark:text-emerald-400 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-zinc-800 text-xs font-bold transition-all shadow-xs"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all shadow-xs"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                aria-expanded={isUserMenuOpen}
                aria-label="Menu tài khoản"
              >
                {/* Circular Avatar exactly matching screenshot */}
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-white dark:bg-zinc-900 flex items-center justify-center text-xs font-black text-[#195329] dark:text-emerald-400 shadow-xs flex-shrink-0">
                  {user?.fullName ? user.fullName.trim().charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] text-gray-400 leading-none">Tài khoản</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {user?.fullName || "Nguyễn Văn A"}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 hidden sm:inline">▼</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user?.fullName || "Nguyễn Văn A"}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-semibold text-[#195329] dark:text-emerald-300">
                      Thành viên Ubofood
                    </span>
                  </div>

                  <div className="py-1 text-xs text-gray-700 dark:text-gray-300">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-850 transition-colors"
                    >
                      <span className="text-sm">👤</span>
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <Link
                      href="/cart"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-850 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-sm">🛒</span>
                        <span>Giỏ hàng</span>
                      </span>
                      {totalItems > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 text-[10px] font-bold">
                          {totalItems}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-850 transition-colors"
                    >
                      <span className="text-sm">📦</span>
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">🚪</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. SUB-NAV / CATEGORIES HORIZONTAL BAR */}
      <div className="border-t border-gray-100 dark:border-zinc-800 relative z-30 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 sm:gap-6 text-xs font-semibold py-2">
          {/* Button: Danh Mục Nông Sản with Hover Dropdown */}
          <div className="relative group flex-shrink-0">
            <Link
              href="/products"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#195329] hover:bg-[#12421f] text-white font-bold transition-all shadow-xs cursor-pointer select-none"
            >
              <span className="text-sm">☰</span>
              <span>Danh Mục Nông Sản</span>
              <span className="text-[10px] text-emerald-200 transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </Link>

            {/* Dropdown Menu on Hover */}
            <div className="absolute top-full left-0 pt-2 w-72 sm:w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Khám phá theo danh mục
                </div>

                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-800 dark:text-gray-200 transition-all group/item"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-base flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        {cat.icon}
                      </span>
                      <div>
                        <span className="text-xs font-bold block leading-tight text-gray-900 dark:text-gray-100 group-hover/item:text-[#195329] dark:group-hover/item:text-emerald-400">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {cat.slug === "san-sale"
                            ? "Giờ vàng giảm sốc -35%"
                            : `${cat.count} sản phẩm tươi`}
                        </span>
                      </div>
                    </div>
                    {cat.slug === "san-sale" ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black">
                        HOT
                      </span>
                    ) : (
                      <span className="text-gray-400 group-hover/item:text-[#195329] text-xs font-bold transition-transform group-hover/item:translate-x-0.5">
                        →
                      </span>
                    )}
                  </Link>
                ))}

                <div className="pt-1.5 border-t border-gray-100 dark:border-zinc-800">
                  <Link
                    href="/products"
                    className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[#195329] dark:text-emerald-300 text-xs font-bold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>🛒</span>
                      <span>Xem tất cả 140+ sản phẩm</span>
                    </span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal scrollable links */}
          <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-none whitespace-nowrap text-gray-600 dark:text-gray-300">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === "/"
                  ? "text-[#195329] dark:text-emerald-400 font-bold"
                  : "hover:text-[#195329]"
              }`}
            >
              Trang Chủ
            </Link>

            <Link
              href="/products"
              className={`px-3 py-1 rounded-xl transition-all ${
                pathname === "/products"
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-[#195329] dark:text-emerald-300 font-bold border border-emerald-300/60"
                  : "hover:text-[#195329]"
              }`}
            >
              Tất Cả Sản Phẩm
            </Link>

            <Link
              href="/products/thit-heo-tuoi-mat"
              className={`transition-colors ${
                pathname.includes("thit-heo")
                  ? "text-[#195329] dark:text-emerald-400 font-bold"
                  : "hover:text-[#195329]"
              }`}
            >
              Thịt Mát & Tươi Sống
            </Link>

            <Link
              href="/products/thuy-hai-san-tuoi"
              className={`transition-colors ${
                pathname.includes("thuy-hai-san")
                  ? "text-[#195329] dark:text-emerald-400 font-bold"
                  : "hover:text-[#195329]"
              }`}
            >
              Thủy Hải Sản Tươi
            </Link>

            <Link
              href="/products/rau-cu-vietgap"
              className={`transition-colors ${
                pathname.includes("rau-cu")
                  ? "text-[#195329] dark:text-emerald-400 font-bold"
                  : "hover:text-[#195329]"
              }`}
            >
              Rau Củ VietGAP
            </Link>

            <Link
              href="/products/thit-bo-uc"
              className={`transition-colors ${
                pathname.includes("thit-bo")
                  ? "text-[#195329] dark:text-emerald-400 font-bold"
                  : "hover:text-[#195329]"
              }`}
            >
              Thịt Bò Úc Mát
            </Link>

            <Link
              href="/products/dau-hu-so-che"
              className={`transition-colors ${
                pathname.includes("dau-hu")
                  ? "text-[#195329] dark:text-emerald-400 font-bold"
                  : "hover:text-[#195329]"
              }`}
            >
              Combo Sơ Chế
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
