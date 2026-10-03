import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quy Chuẩn Kiểm Nghiệm VietGAP & GlobalGAP | Ubofood",
  description:
    "100% nông sản và thịt mát Ubofood đạt chứng nhận VietGAP & GlobalGAP. Kiểm dịch thú y 3 cấp, không tồn dư kháng sinh, minh bạch mã QR truy xuất nguồn gốc.",
};

export default function QualityCertPolicyPage() {
  return (
    <article className="space-y-8">
      {/* Title & Badge */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
            CHỨNG NHẬN QUỐC TẾ
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Quy Chuẩn Kiểm Nghiệm VietGAP & GlobalGAP
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Hệ thống kiểm soát chất lượng 3 cấp độ từ giống, thức ăn chăn nuôi đến thành phẩm khay thực phẩm trên bàn ăn gia đình.
        </p>
      </div>

      {/* 3 Trụ cột kiểm định */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-linear-to-b from-emerald-50/60 to-white dark:from-zinc-800/60 dark:to-zinc-900 border border-emerald-100 dark:border-zinc-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            01
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">VietGAP Nông Nghiệp</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Quy trình thực hành sản xuất nông nghiệp tốt tại Việt Nam, kiểm soát đất, nước tưới và tuyệt đối không tồn dư thuốc bảo vệ thực vật.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-linear-to-b from-blue-50/60 to-white dark:from-zinc-800/60 dark:to-zinc-900 border border-blue-100 dark:border-zinc-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            02
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">GlobalGAP & EU Chill</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Áp dụng đối với dòng thịt bò Úc nhập khẩu chính ngạch và cá hồi Na Uy tươi fillet, đáp ứng các tiêu chuẩn vệ sinh khắt khe của Châu Âu.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-linear-to-b from-purple-50/60 to-white dark:from-zinc-800/60 dark:to-zinc-900 border border-purple-100 dark:border-zinc-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            03
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Kiểm Dịch Thú Y 3 Cấp</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Kiểm tra sức khỏe vật nuôi tại trại $\rightarrow$ Giám sát kiểm dịch trước và sau mổ $\rightarrow$ Kiểm nghiệm vi sinh định kỳ tại phòng Lab.
          </p>
        </div>
      </div>

      {/* Chi tiết 5 chỉ tiêu kiểm nghiệm không thỏa hiệp */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🔬</span>
          <span>5 Chỉ Tiêu Kiểm Nghiệm An Toàn "Không Thỏa Hiệp" Tại Ubofood</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <span className="font-bold text-red-600 dark:text-red-400 block mb-1">
              🚫 0% Chất tạo nạc Salbutamol & Clenbuterol
            </span>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Test nhanh mẫu nước tiểu và mô cơ từng đàn heo trước khi đưa vào lò giết mổ. Cam kết thịt sạch tự nhiên 100%.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <span className="font-bold text-red-600 dark:text-red-400 block mb-1">
              🚫 Không tồn dư kháng sinh vượt ngưỡng
            </span>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Tuân thủ thời gian ngừng sử dụng thuốc trước khi xuất chuồng tối thiểu 14 - 21 ngày theo khuyến nghị của Bộ Nông nghiệp.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <span className="font-bold text-red-600 dark:text-red-400 block mb-1">
              🚫 Không hàn the & chất bảo quản hóa học
            </span>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Thịt xay, đậu mơ và các món sơ chế tuyệt đối không sử dụng phụ gia hóa học độc hại để tạo dai hay giữ màu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              ✅ Kiểm soát vi sinh Salmonella & E.Coli
            </span>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Môi trường phòng lạnh 0-4°C ức chế vi khuẩn sinh sôi, đảm bảo chỉ số vi sinh luôn nằm trong ngưỡng an toàn tuyệt đối.
            </p>
          </div>
        </div>
      </div>

      {/* Minh bạch mã lô QR Batch */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-white dark:from-zinc-800/70 dark:via-zinc-800/50 dark:to-zinc-900 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📱</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Minh Bạch Truy Xuất Nguồn Gốc Qua Mã Lô QR (Batch Number)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mỗi khay thực phẩm Ubofood đều có tem nhãn định danh điện tử rõ ràng.
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Quý khách chỉ cần dùng camera điện thoại quét mã QR trên bao bì để xem toàn bộ thông tin: Trang trại nuôi dưỡng, cơ sở kiểm dịch, ngày giết mổ, nhiệt độ bảo quản và hạn sử dụng khuyến nghị.
        </p>
      </div>

      {/* Danh mục trang trại đối tác liên kết */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🤝</span>
          <span>Hệ Thống Nhà Cung Cấp & Trang Trại Hợp Tác Tiêu Biểu</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
            <h4 className="font-bold text-gray-900 dark:text-white">Tập Đoàn Nông Nghiệp Ba Vì Clean Farm</h4>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">Địa chỉ: Huyện Ba Vì, TP. Hà Nội</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Cung cấp: Thịt bò sạch, Trứng gà ta hữu cơ
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
            <h4 className="font-bold text-gray-900 dark:text-white">Trang Trại Chăn Nuôi Heo VietGAP Hà Nam</h4>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">Địa chỉ: Thị xã Duy Tiên, Tỉnh Hà Nam</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Cung cấp: Thịt heo tươi mát chuẩn VietGAP
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
            <h4 className="font-bold text-gray-900 dark:text-white">HTX Nông Sản Hữu Cơ Mộc Châu</h4>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">Địa chỉ: Mộc Châu, Tỉnh Sơn La</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Cung cấp: Cà chua Beef, Rau củ quả xứ lạnh
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/30">
            <h4 className="font-bold text-gray-900 dark:text-white">Vựa Thủy Hải Sản Cát Bà - Quảng Ninh</h4>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">Địa chỉ: Cảng cá Hạ Long, Tỉnh Quảng Ninh</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Cung cấp: Tôm thẻ sống, Hải sản tự nhiên
            </span>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Tìm hiểu quy trình giữ lạnh thịt mát? Xem <Link href="/chinh-sach/chuoi-lanh" className="text-[#195329] dark:text-emerald-400 font-semibold underline">Chuỗi lạnh 0-4°C</Link>
        </span>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl bg-[#195329] hover:bg-[#134220] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>Mua Nông Sản VietGAP Ngay</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
