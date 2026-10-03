"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const POLICY_NAV_ITEMS = [
  {
    href: "/chinh-sach/chuoi-lanh",
    title: "Quy trình bảo quản chuỗi lạnh 0-4°C",
    shortTitle: "Chuỗi lạnh 0-4°C",
    icon: "❄️",
    badge: "Tiêu chuẩn EU",
    desc: "Quy trình khép kín giữ trọn dinh dưỡng từ trang trại đến bàn ăn",
  },
  {
    href: "/chinh-sach/giao-hang",
    title: "Chính sách giao hàng siêu tốc 2H",
    shortTitle: "Giao siêu tốc 2H",
    icon: "⚡",
    badge: "Hỏa tốc",
    desc: "Đóng gói thùng giữ nhiệt đá gel, giao chuẩn hẹn giờ",
  },
  {
    href: "/chinh-sach/kiem-nghiem-chat-luong",
    title: "Quy chuẩn kiểm nghiệm VietGAP & GlobalGAP",
    shortTitle: "Kiểm nghiệm VietGAP",
    icon: "🛡️",
    badge: "100% An toàn",
    desc: "Kiểm dịch thú y 3 cấp, test nhanh tồn dư kháng sinh & hóa chất",
  },
  {
    href: "/chinh-sach/doi-tra",
    title: "Chính sách đổi trả trong 24 giờ",
    shortTitle: "Đổi trả 24 giờ",
    icon: "🔄",
    badge: "Cam kết vàng",
    desc: "1 đổi 1 hoặc hoàn tiền 100% nếu không hài lòng độ tươi ngon",
  },
  {
    href: "/chinh-sach/huong-dan-thanh-toan",
    title: "Hướng dẫn đặt hàng & thanh toán VNPAY",
    shortTitle: "Thanh toán VNPAY",
    icon: "💳",
    badge: "Bảo mật",
    desc: "4 bước mua sắm dễ dàng, quét VNPAY QR an toàn tức thì",
  },
];

export default function PolicySidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5">
      {/* Menu danh mục chính sách */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Chính Sách & Hỗ Trợ
          </span>
          <Link
            href="/chinh-sach"
            className="text-xs font-medium text-[#195329] dark:text-emerald-400 hover:underline"
          >
            Tổng quan
          </Link>
        </div>

        <nav className="space-y-1.5" aria-label="Policy navigation">
          {POLICY_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-start gap-3 p-3 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#195329] text-white shadow-md shadow-[#195329]/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold truncate">{item.shortTitle}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] line-clamp-1 mt-0.5 ${
                      isActive
                        ? "text-emerald-100"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Box Hotline CSKH */}
      <div className="bg-linear-to-br from-emerald-900 to-[#11381c] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CSKH Trực Tuyến
          </div>
          <div>
            <h4 className="font-bold text-sm">Cần Hỗ Trợ Đơn Hàng?</h4>
            <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
              Đội ngũ chuyên viên Ubofood sẵn sàng giải đáp từ 6:00 - 21:30 hàng ngày.
            </p>
          </div>
          <div className="pt-1 space-y-2">
            <a
              href="tel:19008912"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-[#195329] font-bold text-xs shadow-sm transition-colors"
            >
              <span>📞</span>
              <span>Hotline: 1900 8912</span>
            </a>
            <div className="flex items-center justify-between text-[11px] text-emerald-200/90 px-1">
              <span>✉️ cskh@ubofood.vn</span>
              <span>💬 Zalo OA Ubofood</span>
            </div>
          </div>
        </div>
      </div>

      {/* Liên kết xem hệ thống cửa hàng */}
      <Link
        href="/he-thong-cua-hang"
        className="block bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-dashed border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-center group"
      >
        <span className="text-2xl block mb-1">🏪</span>
        <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#195329] dark:group-hover:text-emerald-400">
          Hệ Thống 18 Điểm Bán
        </span>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          Xem địa chỉ các cửa hàng Ubofood gần bạn nhất →
        </p>
      </Link>
    </aside>
  );
}
