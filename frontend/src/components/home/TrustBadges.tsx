import React from "react";

export default function TrustBadges() {
  const badges = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#195329] dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ),
      title: "Giữ mát đá gel 0 - 4°C",
      desc: "Bảo toàn vị tươi ngọt tự nhiên",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#195329] dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      title: "100% Chuẩn VietGAP",
      desc: "Kiểm định thú y 3 cấp nghiêm ngặt",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#195329] dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75a2.25 2.25 0 0 0 2.25 2.25h1.5" />
        </svg>
      ),
      title: "Giao bảo tồn 2h tận cửa",
      desc: "Xe nhiệt chuyên dụng giữ lạnh",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#195329] dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      title: "Đổi trả hoàn tiền trong 24H",
      desc: "Nếu không ưng ý dù bất kỳ lí do",
    },
  ];

  return (
    <section className="mt-4 rounded-2xl bg-[#eef7f0] dark:bg-emerald-950/20 border border-[#d3ecd8] dark:border-emerald-900/30 px-4 py-3 sm:py-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-200/60 dark:divide-emerald-900/40">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 ${idx !== 0 ? "pt-2 sm:pt-0 sm:pl-4" : ""}`}
          >
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 shadow-xs border border-emerald-100 dark:border-zinc-700">
              {badge.icon}
            </div>
            <div>
              <h3 className="text-xs sm:text-[13px] font-bold text-[#144723] dark:text-emerald-300 leading-tight">
                {badge.title}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                {badge.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
