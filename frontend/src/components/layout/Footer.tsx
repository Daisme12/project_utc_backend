import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200/80 dark:border-zinc-800 bg-[#fbfdfb] dark:bg-zinc-950 pt-12 pb-24 sm:pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#195329] flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
                </svg>
              </div>
              <span className="text-xl font-black text-[#164e27] dark:text-emerald-400">
                Ubofood
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Hệ thống siêu thị thực phẩm tươi sống, thịt mát và nông sản sạch tiêu chuẩn bàn ăn chuẩn Quốc tế, cam kết xuất xứ nguồn gốc rõ ràng.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <p className="flex items-start gap-1.5">
                <span className="text-[#195329] flex-shrink-0">📍</span>
                <span>Trụ sở chính: Tầng 6, Tháp A, Cầu Giấy, Hà Nội</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-[#195329] flex-shrink-0">📞</span>
                <span>Hotline: 1900 8912 (6:00 - 21:30)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-[#195329] flex-shrink-0">✉️</span>
                <span>cskh@ubofood.vn</span>
              </p>
            </div>
          </div>

          {/* Col 2: Policy & Support */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Chính Sách & Hỗ Trợ
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/chinh-sach/chuoi-lanh" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                  Quy trình bảo quản chuỗi lạnh 0-4°C
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach/giao-hang" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                  Chính sách giao hàng siêu tốc 2H
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach/kiem-nghiem-chat-luong" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                  Quy chuẩn kiểm nghiệm VietGAP & GlobalGAP
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach/doi-tra" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                  Chính sách đổi trả trong 24 giờ
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach/huong-dan-thanh-toan" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                  Hướng dẫn đặt hàng & thanh toán VNPAY
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Distribution Network */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Hệ Thống Phân Phối
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>Ubofood Trung Hòa - Cầu Giấy</li>
              <li>Ubofood Times City - Hai Bà Trưng</li>
              <li>Ubofood Royal City - Thanh Xuân</li>
              <li>Ubofood Ciputra - Tây Hồ</li>
              <li className="pt-1">
                <Link href="/he-thong-cua-hang" className="font-bold text-[#195329] dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
                  <span>Xem toàn bộ 18 điểm bán</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: App Download & Loyalty */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Tải Ứng Dụng Đi Chợ Ubofood
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              Nhận ngay voucher <span className="font-bold text-[#195329] dark:text-emerald-400">50.000đ</span> cho đơn hàng đầu tiên trên ứng dụng di động iOS & Android.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>🍏</span>
                <span>Tải trên Apple App Store</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>🤖</span>
                <span>Tải trên Google Play</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-gray-200/60 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © 2026 Ubofood Việt Nam. All rights reserved. Tiêu chuẩn chuỗi cung ứng thực phẩm sạch Quốc gia.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#terms" className="hover:text-gray-600 transition-colors">
              Điều khoản dịch vụ
            </Link>
            <span>•</span>
            <Link href="#sitemap" className="hover:text-gray-600 transition-colors">
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
