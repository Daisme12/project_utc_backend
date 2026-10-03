import type { Metadata } from "next";
import Link from "next/link";
import { POLICY_NAV_ITEMS } from "@/components/policy/PolicySidebar";

export const metadata: Metadata = {
  title: "Chính Sách & Hỗ Trợ Khách Hàng | Ubofood",
  description:
    "Tổng hợp chính sách giao hàng siêu tốc 2h, bảo quản chuỗi lạnh 0-4°C, quy chuẩn VietGAP, đổi trả 24h và thanh toán an toàn tại Ubofood.",
};

export default function PolicyOverviewPage() {
  return (
    <article className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-400 text-xs font-bold mb-3">
          <span>🌿</span>
          <span>UBOMEAT & UBOFOOD CAM KẾT CHẤT LƯỢNG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Chính Sách & Quy Chuẩn Phục Vụ
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed max-w-3xl">
          Chào mừng quý khách đến với trung tâm hỗ trợ khách hàng của Ubofood. Chúng tôi xây dựng quy trình khép kín từ trang trại đến bàn ăn nhằm đảm bảo mỗi bữa cơm của gia đình bạn luôn tươi mát, an toàn và trọn vẹn dinh dưỡng nhất.
        </p>
      </div>

      {/* Grid 5 Chính sách trọng tâm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POLICY_NAV_ITEMS.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative bg-gray-50/80 dark:bg-zinc-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-gray-100 dark:border-zinc-800/80 hover:border-emerald-300 dark:hover:border-emerald-700/60 rounded-2xl p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-3xl p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xs border border-gray-100 dark:border-zinc-700/50">
                  {item.icon}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-[#195329] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                  {item.badge}
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#195329] dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs font-semibold text-[#195329] dark:text-emerald-400">
              <span>Xem chi tiết điều khoản</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 4 Cam Kết Vàng */}
      <div className="bg-linear-to-br from-emerald-50 via-white to-emerald-50/30 dark:from-zinc-800/60 dark:via-zinc-900 dark:to-zinc-800/40 rounded-3xl p-6 sm:p-7 border border-emerald-100 dark:border-emerald-900/40">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🏆</span>
          <span>4 Cam Kết Vàng Về Trách Nhiệm Sản Phẩm</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold">✓</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold">100% Thịt mát chuẩn EU:</strong>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">Không sử dụng thịt đông lạnh hay hóa chất tạo màu, rã đông tái cấp.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold">✓</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold">Giao nhanh đúng cam kết 2H:</strong>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">Thùng cách nhiệt chứa đá gel giữ nhiệt độ 0-4°C suốt hành trình di chuyển.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold">✓</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold">Đổi trả ngay trong 24 giờ:</strong>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">Bảo hành 1 đổi 1 hoặc hoàn tiền không cần lý do phức tạp nếu sản phẩm lỗi.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold">✓</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold">Minh bạch truy xuất nguồn gốc:</strong>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">Mỗi khay thực phẩm đều có mã lô Batch Number rõ ràng ngày giết mổ và hạn dùng.</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
