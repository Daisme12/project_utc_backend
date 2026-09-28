"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storeService } from "@/services/storeService";

interface UICategoryItem {
  id: string;
  slug?: string;
  name: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  badge?: string;
  icon?: React.ReactNode;
}

export default function CategoryIcons() {
  const [apiCategories, setApiCategories] = useState<UICategoryItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    storeService.getCategories().then((cats) => {
      if (!isMounted || !cats || cats.length === 0) return;
      const formatted: UICategoryItem[] = cats.map((c, idx) => {
        let emoji = c.icon || "🥩";
        let bg = "bg-emerald-50 dark:bg-emerald-950/30";
        let subtitle = "100% Tươi Mới";
        let badge: string | undefined = undefined;

        if (c.slug === "san-sale") {
          bg = "bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/40";
          badge = "HOT -35%";
          subtitle = "Giảm sâu đến 35%";
          emoji = "🔥";
        } else if (c.slug.includes("bo")) {
          bg = "bg-red-50 dark:bg-red-950/30";
          subtitle = "Mềm Ngọt Chuẩn Viện";
          emoji = "🥩";
        } else if (c.slug.includes("trung") || c.slug.includes("cam")) {
          bg = "bg-amber-50 dark:bg-amber-950/30";
          subtitle = "Trứng gà ta thả vườn";
          emoji = "🥚";
        } else if (c.slug.includes("hai-san") || c.slug.includes("thuy")) {
          bg = "bg-cyan-50 dark:bg-cyan-950/30";
          subtitle = "Đánh bắt trong ngày";
          emoji = "🦐";
        } else if (c.slug.includes("rau")) {
          bg = "bg-green-50 dark:bg-green-950/30";
          subtitle = "Hái tại nông trại";
          emoji = "🥬";
        } else if (c.slug.includes("dau-hu")) {
          bg = "bg-yellow-50 dark:bg-yellow-950/30";
          subtitle = "Nấu nhanh 15 phút";
          emoji = "🥢";
        }

        return {
          id: c.slug,
          slug: c.slug,
          name: c.name,
          subtitle,
          emoji,
          bgColor: bg,
          badge,
        };
      });
      setApiCategories(formatted);
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultCategories: UICategoryItem[] = [
    {
      id: "sale",
      name: "Săn Sale Giờ Vàng",
      subtitle: "Giảm sâu đến 35%",
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
      emoji: "🔥",
      bgColor: "bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/40",
      badge: "HOT -35%",
    },
    {
      id: "pork",
      name: "Thịt Heo Tươi Mới",
      subtitle: "100% Cắt Mới",
      icon: (
        <svg className="w-6 h-6 text-[#195329]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-9 5a4.5 4.5 0 0 0 6 0" />
        </svg>
      ),
      emoji: "🥩",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      id: "beef",
      name: "Thịt Bò Úc Mát",
      subtitle: "Mềm Ngọt Chuẩn Viện",
      icon: (
        <svg className="w-6 h-6 text-[#195329]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      emoji: "🥩",
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
    {
      id: "poultry",
      name: "Trứng & Gia Cầm",
      subtitle: "Trứng gà ta thả vườn",
      icon: (
        <svg className="w-6 h-6 text-[#195329]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9 0 3.87 3.13 7 7 7h4c3.87 0 7-3.13 7-7 0-4.97-4.03-9-9-9Z" />
        </svg>
      ),
      emoji: "🥚",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      id: "seafood",
      name: "Thủy Hải Sản",
      subtitle: "Đánh bắt trong ngày",
      icon: (
        <svg className="w-6 h-6 text-[#195329]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      emoji: "🦐",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      id: "veggies",
      name: "Rau Củ VietGAP",
      subtitle: "Xanh tươi hữu cơ",
      icon: (
        <svg className="w-6 h-6 text-[#195329]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
      ),
      emoji: "🥬",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      id: "tofu",
      name: "Đậu Hũ & Sơ Chế",
      subtitle: "Đậu Mơ truyền thống",
      icon: (
        <svg className="w-6 h-6 text-[#195329]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      emoji: "🥢",
      bgColor: "bg-lime-50 dark:bg-lime-950/30",
    },
  ];

  const activeCategories = apiCategories.length > 0 ? apiCategories : defaultCategories;

  return (
    <section className="mt-8 sm:mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-extrabold text-[#113a1b] dark:text-white flex items-center gap-2">
          <span>Danh Mục Tươi Sống Trong Ngày</span>
        </h2>
        <Link
          href="/products"
          className="text-xs font-semibold text-[#195329] dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả</span>
          <span>&gt;</span>
        </Link>
      </div>

      {/* Category Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {activeCategories.map((cat) => {
          const targetSlug = cat.slug || cat.id;

          return (
            <Link
              key={cat.id}
              href={`/products/${targetSlug}`}
              className="flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all group relative"
            >
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full ${cat.bgColor} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs mb-2.5`}
                >
                  {cat.emoji}
                </div>
                {cat.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-red-600 text-[9px] font-black text-white shadow-xs">
                    {cat.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xs sm:text-[13px] font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#195329] dark:group-hover:text-emerald-400 transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-gray-400 dark:text-gray-400 mt-1">
                {cat.subtitle}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
