import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hướng Dẫn Đặt Hàng & Thanh Toán VNPAY | Ubofood",
  description:
    "Hướng dẫn chi tiết quy trình mua thực phẩm online tại Ubofood và quét mã thanh toán VNPAY QR an toàn, tiện lợi qua 30+ ứng dụng ngân hàng.",
};

export default function PaymentGuidePolicyPage() {
  return (
    <article className="space-y-8">
      {/* Title & Badge */}
      <div className="border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💳</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
            CỔNG THANH TOÁN QUỐC GIA VNPAY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Hướng Dẫn Đặt Hàng & Thanh Toán VNPAY
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Mua sắm tiện lợi với đa dạng hình thức thanh toán: VNPAY QR, Thẻ nội địa/Quốc tế hoặc Tiền mặt khi nhận hàng (COD).
        </p>
      </div>

      {/* 4 Bước Đặt Hàng Online Siêu Nhanh */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🛒</span>
          <span>4 Bước Đặt Mua Thực Phẩm Tươi Sạch Tại Ubofood</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#195329] text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Chọn Sản Phẩm</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Duyệt qua các danh mục thịt heo, bò Úc, cá tươi hoặc combo mâm cơm 25 phút và bấm "Thêm vào giỏ".
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#195329] text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Áp Mã Giảm Giá</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Vào giỏ hàng kiểm tra số lượng và áp dụng mã <strong>GIAM50K</strong> hoặc <strong>FREESHIP2H</strong> để giảm trừ trực tiếp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#195329] text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Điền Địa Chỉ & Giờ</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Nhập họ tên, số điện thoại, địa chỉ nhận hàng và chọn giao hỏa tốc 2 giờ hoặc hẹn giờ trước.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#195329] text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Thanh Toán & Nhận</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Chọn thanh toán qua VNPAY hoặc nhận hàng thanh toán tiền mặt (COD). Kiểm tra hàng và thưởng thức!
            </p>
          </div>
        </div>
      </div>

      {/* Hướng Dẫn Chi Tiết Thanh Toán VNPAY */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-br from-blue-50/80 via-white to-blue-50/30 dark:from-zinc-800/70 dark:via-zinc-800/40 dark:to-zinc-900 border border-blue-200/80 dark:border-blue-900/40 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#005baa] text-white flex items-center justify-center font-black text-xl shadow-md">
            VNPAY
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Hướng Dẫn Quét Mã VNPAY-QR Nhanh Chóng Trong 30 Giây
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hỗ trợ hơn 30 ứng dụng Mobile Banking của các ngân hàng lớn tại Việt Nam.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-blue-100 dark:border-zinc-700/60 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-semibold text-xs">
              Bước 1: Chọn Cổng VNPAY
            </strong>
            <p className="leading-relaxed">
              Tại bước thanh toán đơn hàng, tích chọn phương thức <strong>"Thanh toán qua VNPAY"</strong> và nhấn "Đặt Hàng".
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-blue-100 dark:border-zinc-700/60 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-semibold text-xs">
              Bước 2: Mở App Ngân Hàng
            </strong>
            <p className="leading-relaxed">
              Mở ứng dụng ngân hàng của bạn (VCB, BIDV, Techcombank, MB, VPBank,...) và chọn tính năng <strong>Quét mã QR</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-blue-100 dark:border-zinc-700/60 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-semibold text-xs">
              Bước 3: Quét Mã & Xác Nhận
            </strong>
            <p className="leading-relaxed">
              Quét mã QR hiển thị trên màn hình, kiểm tra số tiền và nhập mã OTP để hoàn tất. Đơn hàng sẽ lập tức chuyển sang trạng thái "Đã thanh toán".
            </p>
          </div>
        </div>

        {/* Logo các ngân hàng hỗ trợ */}
        <div className="pt-2 border-t border-blue-100 dark:border-zinc-700/60">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-2">
            Ngân hàng & Ví điện tử liên kết:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-700 dark:text-gray-300">
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">Vietcombank</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">BIDV</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">VietinBank</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">Agribank</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">MB Bank</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">Techcombank</span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">Ví VNPAY</span>
          </div>
        </div>
      </div>

      {/* Các Phương Thức Thanh Toán Khác */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>💵</span>
          <span>Các Phương Thức Thanh Toán Khác Có Tại Ubofood</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-semibold text-sm">
              💵 Tiền Mặt Khi Nhận Hàng (COD)
            </strong>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Quý khách chỉ phải thanh toán sau khi shipper giao hàng tận nơi và đã kiểm tra đúng số lượng, chất lượng khay thực phẩm tươi mát.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-semibold text-sm">
              💳 Quẹt Thẻ POS Tại Cửa Hàng
            </strong>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Khi ghé mua trực tiếp tại 18 chi nhánh siêu thị Ubofood, quý khách có thể quẹt thẻ ATM, thẻ tín dụng Visa/Mastercard hoặc Apple Pay.
            </p>
          </div>
        </div>
      </div>

      {/* Câu hỏi thường gặp */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-3 text-xs text-gray-600 dark:text-gray-400">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>❓</span>
          <span>Câu Hỏi Thường Gặp Khi Thanh Toán</span>
        </h3>
        <div className="space-y-2">
          <div>
            <strong className="text-gray-900 dark:text-white block">Tài khoản đã bị trừ tiền nhưng website chưa cập nhật đơn hàng thành công?</strong>
            <p className="mt-0.5 leading-relaxed">
              Trường hợp hiếm gặp do nghẽn mạng ngân hàng, hệ thống VNPAY sẽ tự động gửi thông báo IPN cập nhật đơn trong vòng 1-3 phút. Nếu sau 5 phút chưa thấy thay đổi, quý khách hãy liên hệ Hotline <strong>1900 8912</strong> để nhân viên kích hoạt đơn ngay lập tức.
            </p>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white block">Hủy đơn thanh toán VNPAY thì bao lâu nhận lại tiền?</strong>
            <p className="mt-0.5 leading-relaxed">
              Ubofood sẽ tạo lệnh hoàn tiền tự động qua cổng VNPAY trong vòng 2 giờ. Quý khách sẽ nhận lại tiền vào tài khoản thẻ trong 1 - 3 ngày làm việc tùy chính sách của từng ngân hàng.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-zinc-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Chưa rõ quy trình giao hàng? Xem <Link href="/chinh-sach/giao-hang" className="text-[#195329] dark:text-emerald-400 font-semibold underline">Chính sách giao 2H</Link>
        </span>
        <Link
          href="/cart"
          className="px-5 py-2.5 rounded-xl bg-[#195329] hover:bg-[#134220] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>Tiến Hành Đặt Hàng Ngay</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
