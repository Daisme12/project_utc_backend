import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quy Trình Bảo Quản Chuỗi Lạnh 0 - 4°C | Ubofood",
  description:
    "Tìm hiểu công nghệ bảo quản chuỗi lạnh 0-4°C khép kín chuẩn Châu Âu của Ubofood, đảm bảo thịt mát giữ nguyên độ mềm ngọt và dinh dưỡng tự nhiên.",
};

export default function ColdChainPolicyPage() {
  return (
    <article className="space-y-8">
      {/* Title & Badge */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">❄️</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
            CÔNG NGHỆ CHUỖI LẠNH CHÂU ÂU
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Quy Trình Bảo Quản Chuỗi Lạnh 0 - 4°C
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Áp dụng cho toàn bộ các dòng sản phẩm thịt heo tươi mát, bò Úc chuẩn mát, thủy hải sản và rau củ sơ chế tại Ubofood.
        </p>
      </div>

      {/* Tóm tắt nhanh */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <strong>💡 Thịt mát (Chilled Meat) là gì?</strong> Thịt mát là thịt ngay sau khi giết mổ được làm mát nhanh để hạ nhiệt độ tâm thịt xuống từ <strong>0°C đến 4°C</strong> trong vòng 16 - 24 giờ. Trạng thái lạnh liên tục này giúp ức chế hoàn toàn vi sinh vật phát triển mà không làm phá vỡ cấu trúc sợi thịt như thịt đông lạnh, giữ trọn vị ngọt tự nhiên và độ mềm mọng.
      </div>

      {/* 4 Giai đoạn chuỗi lạnh khép kín */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>⚙️</span>
          <span>4 Bước Kiểm Soát Nghiêm Ngặt Trong Chuỗi Lạnh Ubofood</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bước 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#195329] text-white">
                BƯỚC 1
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Nhiệt độ: 0 - 2°C</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Hạ Nhiệt Tâm Thịt Cấp Tốc Sau Mổ
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Ngay sau quá trình mổ nhân đạo theo chuẩn kiểm định thú y, thân thịt được đưa ngay vào hầm làm lạnh sâu để đưa nhiệt độ tâm thịt về dải an toàn tuyệt đối 0-2°C, ngăn ngừa biến đổi axit lactic.
            </p>
          </div>

          {/* Bước 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#195329] text-white">
                BƯỚC 2
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Nhiệt độ phòng &lt; 4°C</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Pha Lóc & Đóng Khay Phòng Vô Trùng
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Toàn bộ công đoạn cắt thái, định lượng khay (300g, 500g) được thực hiện trong phòng lạnh vô trùng có kiểm soát vi sinh bằng đèn UV. Nhân viên tuân thủ nghiêm ngặt trang phục vô trùng.
            </p>
          </div>

          {/* Bước 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#195329] text-white">
                BƯỚC 3
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Công nghệ OxyFresh 99%</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Đóng Gói Màng Khí Thông Minh OxyFresh
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Sử dụng màng bọc đa lớp thoáng khí chuyên dụng giúp thịt tiếp tục "thở" tự nhiên, giữ màu đỏ hồng tươi tắn mà không cần dùng bất kỳ loại khí biến tính hay hóa chất bảo quản nào.
            </p>
          </div>

          {/* Bước 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#195329] text-white">
                BƯỚC 4
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Thùng giữ nhiệt + Đá Gel</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Vận Chuyển Hỏa Tốc Tận Cửa Khách Hàng
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Xe giao hàng được trang bị thùng xốp cách nhiệt tiêu chuẩn y tế kèm túi đá gel mát lạnh. Dù di chuyển dưới thời tiết nắng nóng, nhiệt độ trong thùng vẫn duy trì từ 0 - 4°C khi trao tận tay khách.
            </p>
          </div>
        </div>
      </div>

      {/* Bảng so sánh thịt mát vs thịt nóng / thịt đông */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📊</span>
          <span>Bảng So Sánh Chất Lượng Giữa Các Loại Thịt</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-100/70 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold uppercase">
              <tr>
                <th className="p-3">Tiêu chí</th>
                <th className="p-3 text-[#195329] dark:text-emerald-400 font-extrabold bg-emerald-50/50 dark:bg-emerald-950/20">
                  Thịt mát Ubofood (0-4°C)
                </th>
                <th className="p-3">Thịt nóng truyền thống (Chợ)</th>
                <th className="p-3">Thịt đông lạnh dài ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-600 dark:text-gray-400">
              <tr>
                <td className="p-3 font-semibold text-gray-900 dark:text-white">An toàn vi sinh</td>
                <td className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 font-semibold text-emerald-700 dark:text-emerald-400">
                  Kiểm soát 100%, không nhiễm khuẩn
                </td>
                <td className="p-3 text-red-600 dark:text-red-400">Dễ nhiễm bụi bẩn, ruồi nhặng</td>
                <td className="p-3">Ổn định nếu bảo quản tốt</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-900 dark:text-white">Độ mềm & dinh dưỡng</td>
                <td className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 font-semibold text-emerald-700 dark:text-emerald-400">
                  Mềm mọng tự nhiên, giữ trọn axit amin
                </td>
                <td className="p-3">Thịt co cứng sau 2-4h giết mổ</td>
                <td className="p-3 text-amber-600 dark:text-amber-400">Chảy nước, hao hụt dinh dưỡng khi rã đông</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-900 dark:text-white">Thời gian bảo quản</td>
                <td className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 font-semibold text-emerald-700 dark:text-emerald-400">
                  3 - 5 ngày ở ngăn mát (0-4°C)
                </td>
                <td className="p-3">Phải nấu ngay trong 4 - 6 giờ</td>
                <td className="p-3">6 - 12 tháng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hướng dẫn bảo quản tại nhà */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🏡</span>
          <span>Mẹo Bảo Quản Thịt Mát Tại Gia Đình Chuẩn Đầu Bếp</span>
        </h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc pl-5">
          <li><strong>Nếu nấu trong 1 - 3 ngày:</strong> Giữ nguyên khay bọc trong ngăn mát tủ lạnh (vùng nhiệt độ 0 - 4°C, thường là ngăn chuyên dụng đựng thịt cá).</li>
          <li><strong>Nếu muốn bảo quản lâu hơn (trên 5 ngày):</strong> Cho nguyên khay vào ngăn đông đá. Khi dùng, rã đông tự nhiên trong ngăn mát từ 4 - 6 tiếng để không làm mất dưỡng chất.</li>
          <li><strong>Lưu ý:</strong> Không rửa thịt bằng nước nóng hoặc để thịt ở nhiệt độ phòng quá 1 giờ trước khi nấu.</li>
        </ul>
      </div>

      {/* CTA mua hàng */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Cần thêm thông tin về kiểm định? Xem ngay <Link href="/chinh-sach/kiem-nghiem-chat-luong" className="text-[#195329] dark:text-emerald-400 font-semibold underline">Quy chuẩn VietGAP</Link>
        </span>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl bg-[#195329] hover:bg-[#134220] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>Xem Danh Sách Thịt Mát Hôm Nay</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
