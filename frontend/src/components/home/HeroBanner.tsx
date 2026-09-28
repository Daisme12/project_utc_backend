"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function HeroBanner() {
  // Countdown timer state for "02:41:32"
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 41,
    seconds: 32,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { addItem } = useCart();

  const handleAddCombo = () => {
    addItem({
      id: 999,
      name: "Combo Gia Đình Sơ Chế",
      price: 182000,
      packWeight: "Khay 3-4 người",
    });
    toast.success("Đã thêm Combo Gia Đình vào giỏ hàng!", {
      description: "182.000 đ • Đủ rau củ & thịt thái sẵn",
      duration: 2000,
    });
  };

  const formatDigits = (val: number) => String(val).padStart(2, "0");

  return (
    <section className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. MAIN LARGE HERO CARD (8 cols) */}
      <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-md flex flex-col justify-end min-h-[380px] sm:min-h-[420px] p-6 sm:p-8 group">
        {/* Background Image: Fresh meat display butcher counter */}
        <Image
          src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1600&q=80"
          alt="UBOMEAT Thịt Tươi Mát Châu Âu"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />

        {/* Content */}
        <div className="relative z-10 max-w-xl text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs mb-3">
            <span>🔥</span>
            <span>-25% CHUYÊN THỊT NỘI NGÀY</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            UBOMEAT • Chuẩn Thịt Tươi Mát Châu Âu
          </h1>

          {/* Subtext */}
          <p className="mt-2.5 text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            Thịt sạch chuẩn bàn ăn, công nghệ làm lạnh sâu 0-4°C, đóng khay màng co
            khép kín giữ trọn vị tươi mới trong từng thớ thịt.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="#meat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#195329] hover:bg-[#12421f] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/30 transition-all active:scale-95"
            >
              <span>Khám phá ngay</span>
              <span>→</span>
            </Link>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white font-medium">
              <span className="text-gray-300">Chỉ còn</span>
              <span className="font-mono font-bold text-amber-300">
                {formatDigits(timeLeft.hours)}:{formatDigits(timeLeft.minutes)}:
                {formatDigits(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDEBAR CARDS (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Top Card: Combo Gia Đình Sơ Chế */}
        <div className="flex-1 rounded-3xl p-5 sm:p-6 bg-[#ebf7ee] dark:bg-emerald-950/30 border border-[#cbe6d2] dark:border-emerald-900/40 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#195329] text-white text-[11px] font-bold uppercase tracking-wider">
                TIẾT KIỆM 15%
              </span>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-[#195329] shadow-xs">
                🍲
              </div>
            </div>

            <h2 className="mt-3 text-base sm:text-lg font-bold text-[#113a1b] dark:text-emerald-300">
              Combo Gia Đình Sơ Chế
            </h2>

            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Đầy đủ rau củ, thịt mát cắt thái sẵn cho mâm cơm 3 - 4 người trong 25 phút.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40">
            <div>
              <span className="text-[11px] text-gray-400 line-through block">
                215.000 đ
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#195329] dark:text-emerald-400">
                182.000 đ
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddCombo}
              className="px-4 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>+ Thêm</span>
            </button>
          </div>
        </div>

        {/* Bottom Card: Flash Sale Giờ Vàng */}
        <div className="flex-1 rounded-3xl p-5 sm:p-6 bg-[#fef5ec] dark:bg-amber-950/20 border border-[#fed7aa]/60 dark:border-amber-900/30 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span>⚡</span>
                <span>FLASH SALE GIỜ VÀNG</span>
              </span>
              <span className="text-lg">⏳</span>
            </div>

            <h2 className="mt-2 text-sm sm:text-base font-extrabold text-orange-950 dark:text-amber-200">
              09:00 – 11:30 Sáng Nay
            </h2>

            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Trứng gà ta, Đậu mơ quê mình, Bò Úc mát giảm sâu đến 35%.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-orange-200/60 dark:border-amber-900/40">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-bold text-orange-800 dark:text-amber-300 mb-1">
                <span>Đã bán 78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-orange-200 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-[78%]" />
              </div>
            </div>

            <Link
              href="/products/san-sale"
              className="px-4 py-2 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0 inline-flex items-center gap-1"
            >
              <span>Săn ngay</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
