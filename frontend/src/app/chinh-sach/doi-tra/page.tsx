import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính Sách Đổi Trả Trong 24 Giờ | Ubofood",
  description:
    "Cam kết 1 đổi 1 hoặc hoàn tiền 100% trong vòng 24 giờ nếu khách hàng không hài lòng với độ tươi ngon của sản phẩm Ubofood. Miễn phí thu hồi đổi hàng tận nhà.",
};

export default function RefundPolicyPage() {
  return (
    <article className="space-y-8">
      {/* Title & Badge */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔄</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-400">
            BẢO HÀNH TƯƠI NGON 100%
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Chính Sách Đổi Trả & Hoàn Tiền Trong 24 Giờ
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Ubofood cam kết đặt quyền lợi và sự an tâm của bữa cơm gia đình bạn lên hàng đầu với chính sách đổi trả nhanh chóng và tiện lợi nhất.
        </p>
      </div>

      {/* Cam kết vàng */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-emerald-900 to-[#144221] text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
          <span>🌟</span>
          <span>CAM KẾT BẢO HÀNH ĐỘ TƯƠI NGON</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold leading-snug">
          "1 Đổi 1 Miễn Phí Hoặc Hoàn Tiền 100% Trong Vòng 24 Giờ"
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
          Nếu vì bất kỳ lý do nào mà sản phẩm thịt mát, hải sản hay rau củ bạn nhận được không đạt độ tươi ngon như kỳ vọng, Ubofood sẽ đổi ngay sản phẩm mới tận nhà hoặc hoàn lại toàn bộ số tiền bạn đã thanh toán.
        </p>
      </div>

      {/* Các trường hợp được đổi trả */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📋</span>
          <span>Các Trường Hợp Được Áp Dụng Đổi Trả Miễn Phí</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
            <span className="text-xl">🥩</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold mb-0.5">
                Chất lượng thịt không tươi ngon
              </strong>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Thịt có mùi lạ, màu sắc biến đổi, không đạt nhiệt độ lạnh 0-4°C khi nhận, hoặc màng bọc OxyFresh bị rách hở khí.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
            <span className="text-xl">🥬</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold mb-0.5">
                Rau củ dập nát, héo úa
              </strong>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Rau củ quả bị dập nát do quá trình vận chuyển, sâu hỏng bên trong hoặc không đạt độ tươi mới như mô tả.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
            <span className="text-xl">📦</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold mb-0.5">
                Giao sai sản phẩm hoặc thiếu hàng
              </strong>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Giao nhầm loại thịt, sai quy cách đóng gói (khay 300g/500g) hoặc thiếu các mặt hàng đã thanh toán trong đơn.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
            <span className="text-xl">🏷️</span>
            <div>
              <strong className="text-gray-900 dark:text-white block font-semibold mb-0.5">
                Lỗi hạn sử dụng / Mã lô
              </strong>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Sản phẩm cận date (dưới 24h đối với thịt mát tươi), tem nhãn mờ hoặc không quét được mã truy xuất nguồn gốc QR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Bước đổi trả siêu đơn giản */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>⚡</span>
          <span>3 Bước Đổi Trả Đơn Giản Trong 24 Giờ</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 relative">
            <span className="text-3xl font-black text-gray-200 dark:text-zinc-700 absolute top-3 right-4">
              01
            </span>
            <span className="text-2xl block mb-2">📸</span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
              Chụp Ảnh / Video
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Chụp ảnh tình trạng sản phẩm lỗi kèm theo tem nhãn dán trên khay thực phẩm để nhân viên đối soát mã lô.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 relative">
            <span className="text-3xl font-black text-gray-200 dark:text-zinc-700 absolute top-3 right-4">
              02
            </span>
            <span className="text-2xl block mb-2">📞</span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
              Gửi Thông Tin CSKH
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Gọi Hotline <strong>1900 8912</strong> hoặc gửi tin nhắn qua Zalo OA Ubofood kèm Mã đơn hàng của bạn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 relative">
            <span className="text-3xl font-black text-gray-200 dark:text-zinc-700 absolute top-3 right-4">
              03
            </span>
            <span className="text-2xl block mb-2">🛵</span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
              Đổi Mới Tận Cửa 1-2H
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Shipper Ubofood mang sản phẩm mới tinh đến đổi tận nhà, hoặc hoàn tiền vào tài khoản ngân hàng trong ngày.
            </p>
          </div>
        </div>
      </div>

      {/* Phương thức hoàn tiền */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-2 text-xs text-gray-600 dark:text-gray-400">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>💳</span>
          <span>Quy Định & Thời Gian Hoàn Tiền</span>
        </h3>
        <ul className="space-y-1.5 list-disc pl-5 leading-relaxed">
          <li><strong>Thanh toán tiền mặt COD:</strong> Shipper hoàn lại tiền mặt ngay khi đến thu hồi sản phẩm, hoặc chuyển khoản ngân hàng ngay trong 2 giờ.</li>
          <li><strong>Thanh toán qua cổng VNPAY / Thẻ ATM:</strong> Tiền sẽ được hoàn trả tự động vào tài khoản nguồn của quý khách trong vòng 1 - 3 ngày làm việc theo quy định ngân hàng.</li>
          <li><strong>Điểm tích lũy & Voucher:</strong> Mã voucher đã sử dụng cho đơn hàng lỗi sẽ được hoàn lại nguyên trạng vào tài khoản thành viên của quý khách.</li>
        </ul>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Cần hỗ trợ đổi hàng ngay bây giờ? Liên hệ Hotline <strong>1900 8912</strong> (6:00 - 21:30)
        </span>
        <a
          href="tel:19008912"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>Gọi Hotline Đổi Trả Ngay</span>
          <span>📞</span>
        </a>
      </div>
    </article>
  );
}
