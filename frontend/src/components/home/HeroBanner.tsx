"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

/* ─── Hero slide data ─── */
const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1600&q=80",
    badge: "🔥 -25% CHUYÊN THỊT NỘI NGÀY",
    heading: "UBOMEAT • Chuẩn Thịt Tươi Mát Châu Âu",
    sub: "Thịt sạch chuẩn bàn ăn, công nghệ làm lạnh sâu 0-4°C, đóng khay màng co khép kín giữ trọn vị tươi mới.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80",
    badge: "❄️ CHUẨN LẠNH CHÂU ÂU 0-4°C",
    heading: "Sườn & Ba Chỉ OxyFresh Cắt Sáng",
    sub: "Giết mổ lạnh nhân đạo, vận chuyển xe lạnh chuyên dụng, đảm bảo độ tươi nguyên bản đến tay bạn.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    badge: "🥩 THƯỢNG HẠNG VietGAP",
    heading: "Ba Chỉ Heo Truyền Thống Bán Chạy #1",
    sub: "Thịt mát chuẩn VietGAP từ trang trại đối tác, bảo quản nhiệt độ ổn định trong suốt chuỗi cung ứng.",
  },
];

/* ─── Floating particles ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: `${6 + i * 4}px`,
            height: `${6 + i * 4}px`,
            left: `${10 + i * 15}%`,
            bottom: `-10px`,
            animation: `floatUp ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Slide indicator dots ─── */
function SlideDots({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Slide ${i + 1}`}
          className={`rounded-full transition-all duration-500 cursor-pointer ${
            i === current
              ? "w-7 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Main component ─── */
export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [soldPercent, setSoldPercent] = useState(0);
  const [comboHover, setComboHover] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 41,
    seconds: 32,
  });

  // Auto slide
  const goToSlide = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(idx);
        setTimeout(() => setIsTransitioning(false), 600);
      }, 300);
    },
    [isTransitioning]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [currentSlide, goToSlide]);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate sold progress bar on mount
  useEffect(() => {
    const t = setTimeout(() => setSoldPercent(90), 400);
    return () => clearTimeout(t);
  }, []);

  const { addItem } = useCart();
  const slide = HERO_SLIDES[currentSlide];
  const fmt = (v: number) => String(v).padStart(2, "0");

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

  return (
    <section className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* ═══════ MAIN HERO (8 cols) ═══════ */}
      <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-lg min-h-[380px] sm:min-h-[420px] group">
        {/* Stacked background images for crossfade */}
        {HERO_SLIDES.map((s, i) => (
          <Image
            key={i}
            src={s.image}
            alt={s.heading}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className={`object-cover object-center transition-all duration-[1200ms] ease-in-out ${
              i === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        ))}

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-[1]" />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Animated shimmer sweep */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 60%)",
            animation: "shimmerSweep 4s ease-in-out infinite",
          }}
        />

        {/* Content with entrance animations */}
        <div
          className={`absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 ${
            isTransitioning
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="max-w-xl text-white">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-lg shadow-red-900/30 mb-3 animate-[fadeSlideUp_0.5s_ease-out]">
              <span className="animate-[pulse_2s_ease-in-out_infinite]">
                {slide.badge.split(" ")[0]}
              </span>
              <span>{slide.badge.split(" ").slice(1).join(" ")}</span>
            </div>

            {/* Heading with stagger */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg animate-[fadeSlideUp_0.6s_ease-out_0.1s_both]">
              {slide.heading}
            </h1>

            {/* Subtext */}
            <p className="mt-2.5 text-xs sm:text-sm text-gray-200/90 leading-relaxed animate-[fadeSlideUp_0.6s_ease-out_0.2s_both]">
              {slide.sub}
            </p>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4 animate-[fadeSlideUp_0.6s_ease-out_0.3s_both]">
              {/* Primary CTA with glow */}
              <Link
                href="#meat"
                className="group/btn relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#195329] hover:bg-[#12421f] text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Khám phá ngay</span>
                <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                  →
                </span>
                {/* Hover glow ring */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20" />
              </Link>

              {/* Glowing countdown timer */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-inner">
                <span className="text-gray-400 text-xs">Chỉ còn</span>
                <div className="flex items-center gap-1 font-mono font-bold text-sm">
                  {[
                    fmt(timeLeft.hours),
                    fmt(timeLeft.minutes),
                    fmt(timeLeft.seconds),
                  ].map((part, pi) => (
                    <React.Fragment key={pi}>
                      {pi > 0 && (
                        <span className="text-amber-400/60 animate-[pulse_1s_ease-in-out_infinite]">
                          :
                        </span>
                      )}
                      <span className="inline-block min-w-[28px] text-center px-1.5 py-0.5 rounded-md bg-white/10 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                        {part}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-5 right-6 sm:right-8">
            <SlideDots
              total={HERO_SLIDES.length}
              current={currentSlide}
              onSelect={goToSlide}
            />
          </div>
        </div>
      </div>

      {/* ═══════ RIGHT SIDEBAR (4 cols) ═══════ */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* ── Combo Gia Đình Card (Siêu Nổi Bật) ── */}
        <div
          className="flex-1 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#f0fbf3] via-[#e4f7e9] to-[#cbf2d5] dark:from-emerald-950/40 dark:via-emerald-900/30 dark:to-zinc-900 border-2 border-emerald-400/50 dark:border-emerald-600/40 hover:border-emerald-500 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group/combo"
          onMouseEnter={() => setComboHover(true)}
          onMouseLeave={() => setComboHover(false)}
        >
          {/* Glowing Ambient Light */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-emerald-400/25 dark:bg-emerald-400/15 blur-2xl pointer-events-none transition-transform duration-700 group-hover/combo:scale-125" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-emerald-300/20 blur-xl pointer-events-none" />

          <div className="relative z-10">
            {/* Top Bar: Badge & Image Thumbnail */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#195329] text-white text-[11px] font-black uppercase tracking-wider shadow-sm shadow-emerald-900/30 inline-flex items-center gap-1">
                    <span>⚡</span>
                    <span>TIẾT KIỆM 15%</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-zinc-800 text-[#195329] dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-300/80 dark:border-emerald-700 shadow-2xs">
                    Mâm cơm 25p
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-emerald-200 tracking-tight leading-snug">
                  Combo Gia Đình Sơ Chế
                </h2>
              </div>

              {/* Product Image Thumbnail */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md shrink-0 group-hover/combo:scale-105 group-hover/combo:rotate-2 transition-all duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80"
                  alt="Combo Gia Đình Sơ Chế"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white leading-none">
                  1kg
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Đầy đủ rau củ, thịt mát cắt thái sẵn cho mâm cơm 3 - 4 người trong 25 phút.
            </p>

            {/* Quick Feature Pills */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-zinc-800/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                🥗 Rau củ tươi sạch
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-zinc-800/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                🥩 Thịt mát 0-4°C
              </span>
            </div>
          </div>

          {/* Bottom Bar: Price & Add Button */}
          <div className="relative z-10 mt-4 flex items-center justify-between pt-3 border-t border-emerald-300/60 dark:border-emerald-800/50">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 line-through">
                  215.000 đ
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                  -33K
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-[#195329] dark:text-emerald-300 tracking-tight">
                182.000 đ
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddCombo}
              className="group/add relative px-4 py-2.5 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-black transition-all shadow-md shadow-emerald-950/20 hover:shadow-lg hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-1.5 overflow-hidden"
            >
              <span className="relative z-10 text-base leading-none">+</span>
              <span className="relative z-10">Thêm vào giỏ</span>
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 translate-x-[-100%] group-hover/add:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
        </div>

        {/* ── Flash Sale Card (Cực Kỳ Rực Rỡ & Nổi Bật) ── */}
        <div className="flex-1 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fddbb5] dark:from-orange-950/40 dark:via-amber-950/30 dark:to-zinc-900 border-2 border-orange-400/60 dark:border-orange-600/40 hover:border-orange-500 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group/flash">
          {/* Animated Glowing Flare */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-orange-500/25 dark:bg-orange-500/15 blur-2xl pointer-events-none transition-transform duration-700 group-hover/flash:scale-125" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10">
            {/* Top Bar: Flash Sale Badge & Live Mini Countdown */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-red-900/30">
                    <span className="animate-[pulse_1s_infinite] text-xs">🔥</span>
                    <span>FLASH SALE GIỜ VÀNG</span>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#7c2d12] dark:text-amber-200 tracking-tight leading-snug">
                  09:00 – 11:30 Sáng Nay
                </h2>
              </div>

              {/* Product Thumbnail with Sale Ribbon */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md shrink-0 group-hover/flash:scale-105 group-hover/flash:-rotate-2 transition-all duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=300&q=80"
                  alt="Ba chỉ bò Úc Flash Sale"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-red-600 text-[10px] font-black text-white shadow-xs">
                  -35%
                </span>
              </div>
            </div>

            {/* Countdown Badge Live in Card */}
            <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-950/10 dark:bg-black/40 border border-orange-300/60 dark:border-orange-800/40 w-fit">
              <span className="text-[11px] font-extrabold text-orange-900 dark:text-orange-200 flex items-center gap-1">
                <span>⏳ Kết thúc sau:</span>
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-xs text-red-700 dark:text-amber-300">
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-2xs">
                  {fmt(timeLeft.hours)}
                </span>
                <span className="animate-[pulse_1s_infinite] text-red-500">:</span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-2xs">
                  {fmt(timeLeft.minutes)}
                </span>
                <span className="animate-[pulse_1s_infinite] text-red-500">:</span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-2xs text-red-600">
                  {fmt(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Trứng gà ta, Đậu mơ quê mình, Bò Úc mát giảm sâu đến 35%.
            </p>
          </div>

          {/* Bottom Bar: Animated Progress Bar & Săn Ngay Button */}
          <div className="relative z-10 mt-4 flex items-center justify-between gap-3 pt-3 border-t border-orange-300/60 dark:border-orange-800/50">
            {/* Animated progress bar */}
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-black text-orange-900 dark:text-amber-300 mb-1">
                <span className="flex items-center gap-1">
                  <span>🔥 Đã bán {soldPercent}%</span>
                </span>
                <span className="text-red-600 dark:text-red-400 text-[10px] font-bold animate-[pulse_1.5s_infinite]">
                  Sắp bán hết!
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-orange-200/90 dark:bg-zinc-800 overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 relative transition-all duration-1000 ease-out shadow-xs"
                  style={{ width: `${soldPercent}%` }}
                >
                  {/* Shimmer sweep animation on progress bar */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      animation: "shimmerSweep 1.8s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            <Link
              href="/products/san-sale"
              className="group/sale px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-black transition-all shadow-md shadow-orange-700/30 hover:shadow-lg hover:shadow-orange-700/50 cursor-pointer active:scale-95 flex-shrink-0 inline-flex items-center gap-1.5 overflow-hidden relative"
            >
              <span className="relative z-10">Săn ngay</span>
              <span className="relative z-10 transition-transform duration-300 group-hover/sale:translate-x-1 font-bold">
                →
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover/sale:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
