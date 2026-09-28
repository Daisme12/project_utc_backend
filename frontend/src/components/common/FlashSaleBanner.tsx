"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface FlashSaleBannerProps {
  showLinkButton?: boolean;
  className?: string;
}

export default function FlashSaleBanner({
  showLinkButton = true,
  className = "",
}: FlashSaleBannerProps) {
  // Đồng bộ đếm ngược theo khung giờ flash sale (09:00 - 11:30)
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 41,
    seconds: 5,
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
        return { hours: 2, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (val: number) => String(val).padStart(2, "0");

  return (
    <div
      className={`w-full text-white px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs shadow-md transition-all bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 ${className}`}
    >
      {/* 1. Left Announcement Info */}
      <div className="flex items-center gap-2.5 flex-wrap flex-1">
        <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-sm flex-shrink-0 animate-bounce">
          ⚡
        </span>
        <div className="leading-snug">
          <span className="text-amber-200 font-black tracking-wide uppercase mr-1.5 drop-shadow-xs">
            GIỜ VÀNG GIẢM SỐC (09:00 - 11:30):
          </span>
          <span className="font-medium text-white/95">
            Trứng gà ta, Bò Úc, Combo gia đình giảm đến 35% • Số lượng có hạn theo khung giờ
          </span>
        </div>
      </div>

      {/* 2. Middle Countdown Timer */}
      <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 self-stretch sm:self-auto justify-center">
        <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1">
          <span>⏳</span>
          <span className="hidden sm:inline">Kết thúc sau:</span>
        </span>
        <div className="flex items-center gap-1 font-mono font-black text-xs text-white">
          <span className="px-1.5 py-0.5 rounded bg-white/20">
            {formatDigits(timeLeft.hours)}
          </span>
          <span>:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/20">
            {formatDigits(timeLeft.minutes)}
          </span>
          <span>:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/20 text-amber-300">
            {formatDigits(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* 3. Right Assurance & CTA */}
      <div className="flex items-center gap-3 text-[11px] text-white/90 flex-shrink-0 self-end lg:self-auto">
      

        {showLinkButton && (
          <Link
            href="/products/san-sale"
            className="px-3 py-1 rounded-xl bg-white text-red-600 hover:bg-amber-100 font-black text-xs shadow-xs transition-all active:scale-95 inline-flex items-center gap-1"
          >
            <span>Săn ngay</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
