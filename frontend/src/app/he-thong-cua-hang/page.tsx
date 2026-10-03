import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hệ Thống 18 Điểm Bán & Siêu Thị Thực Phẩm Ubofood | Hà Nội",
  description:
    "Tìm kiếm địa chỉ 18 chi nhánh siêu thị thực phẩm tươi sạch Ubofood gần bạn nhất tại Hà Nội. Mở cửa 6:00 - 21:30 hàng ngày.",
};

const STORES = [
  {
    name: "Ubofood Trung Hòa - Cầu Giấy (Flagship Store)",
    district: "Cầu Giấy",
    address: "Số 120 Phố Trung Kính, Phường Trung Hòa, Quận Cầu Giấy, Hà Nội",
    phone: "024 3888 9911",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Dịch Vọng - Cầu Giấy",
    district: "Cầu Giấy",
    address: "Số 45 Trần Thái Tông, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
    phone: "024 3888 9912",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Times City - Hai Bà Trưng",
    district: "Hai Bà Trưng",
    address: "Tòa T8 KĐT Times City, 458 Minh Khai, Quận Hai Bà Trưng, Hà Nội",
    phone: "024 3888 9913",
    hours: "6:30 - 22:00",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Bạch Mai - Hai Bà Trưng",
    district: "Hai Bà Trưng",
    address: "Số 234 Phố Bạch Mai, Quận Hai Bà Trưng, Hà Nội",
    phone: "024 3888 9914",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: false,
  },
  {
    name: "Ubofood Royal City - Thanh Xuân",
    district: "Thanh Xuân",
    address: "Tòa R2 KĐT Royal City, 72A Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    phone: "024 3888 9915",
    hours: "6:30 - 22:00",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Lê Văn Lương - Thanh Xuân",
    district: "Thanh Xuân",
    address: "Tòa Golden Palm, 21 Lê Văn Lương, Quận Thanh Xuân, Hà Nội",
    phone: "024 3888 9916",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Ciputra - Tây Hồ",
    district: "Tây Hồ",
    address: "Tòa L1 KĐT Ciputra Nam Thăng Long, Quận Tây Hồ, Hà Nội",
    phone: "024 3888 9917",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Quảng An - Tây Hồ",
    district: "Tây Hồ",
    address: "Số 68 Phố Xuân Diệu, Phường Quảng An, Quận Tây Hồ, Hà Nội",
    phone: "024 3888 9918",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Đống Đa - Chùa Láng",
    district: "Đống Đa",
    address: "Số 15 Phố Chùa Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội",
    phone: "024 3888 9919",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: false,
  },
  {
    name: "Ubofood Hoàng Cầu - Đống Đa",
    district: "Đống Đa",
    address: "Số 36 Phố Hoàng Cầu, Phường Ô Chợ Dừa, Quận Đống Đa, Hà Nội",
    phone: "024 3888 9920",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Giảng Võ - Ba Đình",
    district: "Ba Đình",
    address: "Số 188 Phố Giảng Võ, Phường Cát Linh, Quận Ba Đình, Hà Nội",
    phone: "024 3888 9921",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Đội Cấn - Ba Đình",
    district: "Ba Đình",
    address: "Số 92 Phố Đội Cấn, Quận Ba Đình, Hà Nội",
    phone: "024 3888 9922",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: false,
  },
  {
    name: "Ubofood Ngoại Giao Đoàn - Bắc Từ Liêm",
    district: "Bắc Từ Liêm",
    address: "Tòa N01-T4 KĐT Ngoại Giao Đoàn, Phường Xuân Tảo, Bắc Từ Liêm, Hà Nội",
    phone: "024 3888 9923",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Mỹ Đình - Nam Từ Liêm",
    district: "Nam Từ Liêm",
    address: "Tòa The Matrix One, Lê Quang Đạo, Phường Mễ Trì, Nam Từ Liêm, Hà Nội",
    phone: "024 3888 9924",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Linh Đàm - Hoàng Mai",
    district: "Hoàng Mai",
    address: "Kiot 12 Tòa VP6 Bán Đảo Linh Đàm, Quận Hoàng Mai, Hà Nội",
    phone: "024 3888 9925",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood ParkCity - Hà Đông",
    district: "Hà Đông",
    address: "KĐT ParkCity Hanoi, Đường Lê Trọng Tấn, Quận Hà Đông, Hà Nội",
    phone: "024 3888 9926",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Vinhomes Riverside - Long Biên",
    district: "Long Biên",
    address: "KĐT Vinhomes Riverside, Phường Phúc Đồng, Quận Long Biên, Hà Nội",
    phone: "024 3888 9927",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: true,
  },
  {
    name: "Ubofood Hoàn Kiếm - Phố Cổ",
    district: "Hoàn Kiếm",
    address: "Số 48 Phố Hàng Bài, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội",
    phone: "024 3888 9928",
    hours: "6:00 - 21:30",
    hasPos: true,
    hasParking: false,
  },
];

export default function StoreNetworkPage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#195329] dark:hover:text-emerald-400 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white font-medium">Hệ thống phân phối</li>
          </ol>
        </nav>

        {/* Hero Title */}
        <div className="border-b border-gray-100 dark:border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-400 text-xs font-bold mb-3">
            <span>🏪</span>
            <span>MẠNG LƯỚI PHỦ RỘNG THỦ ĐÔ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Hệ Thống 18 Điểm Bán & Siêu Thị Ubofood
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed max-w-3xl">
            Tất cả các cửa hàng Ubofood đều được trang bị tủ bảo quản chuỗi lạnh Châu Âu 0-4°C chuyên dụng. Quý khách có thể ghé mua sắm trực tiếp hoặc đặt hàng online giao hỏa tốc 2 giờ từ chi nhánh gần nhất.
          </p>
        </div>

        {/* 3 Cam kết tại quầy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex items-center gap-3">
            <span className="text-2xl p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#195329] dark:text-emerald-400">
              🥩
            </span>
            <div>
              <strong className="text-xs font-bold block text-gray-900 dark:text-white">Thịt Mát Tươi Mới Mỗi Ngày</strong>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Không bán thịt đông, rã đông</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex items-center gap-3">
            <span className="text-2xl p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              💳
            </span>
            <div>
              <strong className="text-xs font-bold block text-gray-900 dark:text-white">Thanh Toán POS & VNPAY</strong>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Quẹt thẻ, quét mã QR tiện lợi</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs flex items-center gap-3">
            <span className="text-2xl p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              ⏰
            </span>
            <div>
              <strong className="text-xs font-bold block text-gray-900 dark:text-white">Mở Cửa Sớm 6:00 - 21:30</strong>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Phục vụ kịp bữa sáng & tối</span>
            </div>
          </div>
        </div>

        {/* Danh sách 18 cửa hàng theo Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📍</span>
              <span>Danh Sách Toàn Bộ 18 Điểm Bán Tại Hà Nội</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Hiển thị: 18 chi nhánh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORES.map((store, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-[#195329] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                      {store.district}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Đang mở cửa
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                    {store.name}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5 leading-relaxed">
                    <span className="shrink-0 text-gray-400">🏠</span>
                    <span>{store.address}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <span>🕒</span>
                      <span>{store.hours}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📞</span>
                      <a href={`tel:${store.phone.replace(/\s+/g, "")}`} className="hover:text-[#195329] dark:hover:text-emerald-400 font-medium">
                        {store.phone}
                      </a>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-[#195329] hover:text-white dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-300 font-semibold text-center transition-colors flex items-center justify-center gap-1.5 text-[11px]"
                    >
                      <span>🗺️</span>
                      <span>Chỉ đường Maps</span>
                    </a>
                    <a
                      href={`tel:${store.phone.replace(/\s+/g, "")}`}
                      className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#195329] dark:text-emerald-400 font-bold hover:bg-[#195329] hover:text-white transition-colors text-[11px]"
                    >
                      Gọi cửa hàng
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
