import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính Sách Giao Hàng Siêu Tốc 2H | Ubofood",
  description:
    "Giao hàng thực phẩm tươi sống hỏa tốc 2 giờ nội thành. Thùng xốp cách nhiệt giữ lạnh đá gel 0-4°C, miễn phí vận chuyển cho đơn từ 150.000đ.",
};

export default function ShippingPolicyPage() {
  return (
    <article className="space-y-8">
      {/* Title & Badge */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
            HỎA TỐC NỘI THÀNH
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Chính Sách Giao Hàng Siêu Tốc 2H
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Cam kết thực phẩm luôn tươi rói, chuẩn lạnh 0-4°C khi đến tay bạn trong khung giờ giao hàng linh hoạt mỗi ngày.
        </p>
      </div>

      {/* 3 Điểm Nổi Bật Về Dịch Vụ Giao Hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 text-center">
          <span className="text-3xl block mb-2">⏱️</span>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Giao Đúng Trong 2H</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Đặt trước 19h30, nhận hàng ngay trước bữa cơm gia đình.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 text-center">
          <span className="text-3xl block mb-2">🧊</span>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Thùng Cách Nhiệt + Đá Gel</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Đảm bảo chuỗi lạnh 0-4°C không bị ngắt quãng giữa đường.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 text-center">
          <span className="text-3xl block mb-2">🎁</span>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Mã FREESHIP2H</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tặng voucher freeship 25.000đ cho đơn hàng từ 150.000đ.
          </p>
        </div>
      </div>

      {/* Bảng Biểu Phí Vận Chuyển Chi Tiết */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📦</span>
          <span>Bảng Biểu Phí Vận Chuyển Chi Tiết</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100/70 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold uppercase">
              <tr>
                <th className="p-3">Gói Dịch Vụ</th>
                <th className="p-3">Thời Gian Giao</th>
                <th className="p-3">Phí Vận Chuyển</th>
                <th className="p-3">Ưu Đãi Áp Dụng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-600 dark:text-gray-400">
              <tr>
                <td className="p-3 font-semibold text-gray-900 dark:text-white">
                  Giao Siêu Tốc 2 Giờ (Nội Thành)
                </td>
                <td className="p-3">Trong vòng 120 phút từ khi duyệt đơn</td>
                <td className="p-3 font-semibold text-[#195329] dark:text-emerald-400">25.000đ</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    Nhập mã FREESHIP2H: Giảm 25.000đ (Đơn từ 150K)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-900 dark:text-white">
                  Giao Hẹn Giờ Tiêu Chuẩn (Sáng / Chiều)
                </td>
                <td className="p-3">Chọn trước khung giờ (8h-11h hoặc 14h-18h)</td>
                <td className="p-3 font-semibold text-[#195329] dark:text-emerald-400">18.000đ</td>
                <td className="p-3">Miễn phí cho đơn hàng từ 300.000đ</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-900 dark:text-white">
                  Đơn Hàng Lớn / Tiệc Gia Đình (&gt; 5kg)
                </td>
                <td className="p-3">Giao xe tải lạnh chuyên dụng 0-4°C</td>
                <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">Miễn phí 100%</td>
                <td className="p-3">Tự động miễn phí toàn bộ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Khu vực phục vụ */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📍</span>
          <span>Khu Vực Phục Vụ Giao Hàng Siêu Tốc</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <strong className="text-gray-900 dark:text-white block font-semibold mb-1">
              Thủ đô Hà Nội (Tất cả 12 quận nội thành):
            </strong>
            <p className="leading-relaxed">
              Cầu Giấy, Nam Từ Liêm, Bắc Từ Liêm, Đống Đa, Ba Đình, Thanh Xuân, Tây Hồ, Hai Bà Trưng, Hoàn Kiếm, Hoàng Mai, Long Biên, Hà Đông.
            </p>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white block font-semibold mb-1">
              Thời gian nhận đơn và giao hàng:
            </strong>
            <p className="leading-relaxed">
              Hoạt động liên tục từ <strong>6:30 đến 21:00</strong> tất cả các ngày trong tuần (kể cả Thứ 7, Chủ Nhật và ngày lễ).
            </p>
          </div>
        </div>
      </div>

      {/* Quy định đồng kiểm */}
      <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <span>🤝</span>
          <span>Chính Sách Đồng Kiểm Trước Khi Thanh Toán</span>
        </h3>
        <p>
          Khách hàng có quyền <strong>mở kiện hàng và kiểm tra trực tiếp</strong> tình trạng bên ngoài của sản phẩm (khay thịt còn lạnh, bao bì OxyFresh nguyên vẹn, rau củ tươi xanh, đúng số lượng theo phiếu giao hàng) trước khi ký nhận hoặc thanh toán cho nhân viên giao hàng.
        </p>
        <p>
          Nếu phát hiện bất kỳ sản phẩm nào không đạt tiêu chuẩn, quý khách có quyền từ chối nhận món hàng đó mà không phải chịu thêm bất kỳ chi phí nào.
        </p>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Nếu có thắc mắc khi nhận hàng? Xem ngay <Link href="/chinh-sach/doi-tra" className="text-[#195329] dark:text-emerald-400 font-semibold underline">Chính sách đổi trả 24h</Link>
        </span>
        <Link
          href="/cart"
          className="px-5 py-2.5 rounded-xl bg-[#195329] hover:bg-[#134220] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>Kiểm Tra Giỏ Hàng Của Bạn</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
