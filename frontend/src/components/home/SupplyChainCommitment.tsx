import React from "react";
import Link from "next/link";

export default function SupplyChainCommitment() {
  const steps = [
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ),
      title: "Làm mát sâu 0 - 4°C",
      desc: "Thịt được làm mát ngay sau giết mổ nhằm duy trì cơ chế vi sinh và giữ cấu trúc thịt tươi mềm ngọt tự nhiên.",
      linkText: "Tiêu chuẩn EU Chill →",
      href: "#eu-chill",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
      title: "Màng co kháng khuẩn OxyFresh",
      desc: "Hút chân không hoặc định lượng màng co chuyên dụng, ngăn ngừa nhiễm khuẩn chéo hoàn toàn trong không khí.",
      linkText: "Khay sinh học phân hủy →",
      href: "#oxyfresh",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75a2.25 2.25 0 0 0 2.25 2.25h1.5" />
        </svg>
      ),
      title: "Xe lạnh & Túi gel giao 2H",
      desc: "Shipper chuyên nghiệp với thùng giữ nhiệt 3 lớp, đảm bảo nhiệt độ chuẩn khi tới tay người nội trợ.",
      linkText: "Nhiệt độ ổn định < 4°C →",
      href: "#gel-pack",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
        </svg>
      ),
      title: "Minh bạch truy xuất QR Code",
      desc: "Quét mã trên từng bao bì để biết rõ trang trại nuôi, nguồn thức ăn sinh học và ngày giờ xuất xưởng.",
      linkText: "Dữ liệu thời gian thực →",
      href: "#qr-trace",
    },
  ];

  return (
    <section className="mt-14 sm:mt-16 rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
      {/* Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-bold text-[#195329] dark:text-emerald-400 uppercase tracking-widest">
          QUY TRÌNH CHUỖI CUNG ỨNG KHÉP KÍN
        </span>
        <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#113a1b] dark:text-white tracking-tight">
          Cam Kết Chuẩn Sạch Từ Nông Trại Đến Bàn Ăn
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Mỗi khay thịt tại Ubofood trải qua quy chuẩn kiểm soát nghiêm ngặt bằng công nghệ làm mát Châu Âu tiên tiến.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-4 sm:p-5 bg-[#f6fbf7] dark:bg-zinc-800/60 border border-emerald-100/80 dark:border-zinc-700/60 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 shadow-xs flex items-center justify-center border border-emerald-100 dark:border-zinc-700 mb-3">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <Link
              href={item.href}
              className="mt-4 text-xs font-semibold text-[#195329] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{item.linkText}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
