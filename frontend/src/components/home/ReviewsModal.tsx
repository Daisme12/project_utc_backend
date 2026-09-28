"use client";

import React, { useState } from "react";

export interface ReviewItem {
  id: number;
  name: string;
  location: string;
  avatarText: string;
  rating: number;
  date: string;
  verified: boolean;
  dishPhoto?: string;
  productName: string;
  content: string;
  likes: number;
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewsModal({ isOpen, onClose }: ReviewsModalProps) {
  const [filterTab, setFilterTab] = useState<"all" | "5star" | "meat" | "delivery">("all");

  if (!isOpen) return null;

  const allReviews: ReviewItem[] = [
    {
      id: 1,
      name: "Chị Trần Thu Hà",
      location: "Khu đô thị Ngoại Giao Đoàn, Bắc Từ Liêm, Hà Nội",
      avatarText: "TH",
      rating: 5,
      date: "Hôm qua lúc 18:24",
      verified: true,
      productName: "Sườn Thăn Heo & Ba Chỉ Heo Ubomeat",
      content:
        "Thịt mát Ubofood luộc lên không hề nổi bọt tanh như thịt mua ngoài chợ truyền thống, nước luộc trong veo ngọt lịm. Shipper giao tới nơi đá gel vẫn cứng ngắc. Cả nhà mình giờ chỉ tin dùng thịt ở đây!",
      likes: 42,
    },
    {
      id: 2,
      name: "Anh Nguyễn Hoàng Vũ",
      location: "Chung cư Times City, Minh Khai, Hai Bà Trưng",
      avatarText: "HV",
      rating: 5,
      date: "2 ngày trước",
      verified: true,
      productName: "Combo Gia Đình Sơ Chế & Thăn Bò Úc",
      content:
        "Đặt combo sơ chế sẵn cho tối thứ 6 rất tiện, không mất công rửa thái. Thịt thăn bò làm bít tết thơm mềm, chuẩn vị thịt tươi chứ không bị dai khô. Giao hàng chuẩn xác 45 phút, đóng thùng OxyFresh rất cẩn thận.",
      likes: 38,
    },
    {
      id: 3,
      name: "Bác Lê Đình Trọng",
      location: "Phố Hoàng Cầu, Đống Đa, Hà Nội",
      avatarText: "ĐT",
      rating: 5,
      date: "3 ngày trước",
      verified: true,
      productName: "Thịt Xay Heo Sạch Cho Bé Ăn Dặm",
      content:
        "Tôi đặt mua về nấu cháo cho cháu ngoại ăn dặm. Thịt thơm dẻo nguyên tảng, xay rất đều và sạch sẽ, không có mùi chất tạo nạc hay kháng sinh. Người lớn tuổi như tôi kiểm tra chất lượng rất khắt khe mà cũng phải chấm 10 điểm.",
      likes: 56,
    },
    {
      id: 4,
      name: "Chị Phạm Thanh Mai",
      location: "Căn hộ Vinhomes Smart City, Nam Từ Liêm",
      avatarText: "TM",
      rating: 5,
      date: "5 ngày trước",
      verified: true,
      productName: "Ba Chỉ Heo Nướng & Trứng Gà Ta",
      content:
        "Bì giòn rụm khi nướng nồi chiên không dầu. Shipper giao siêu tốc chỉ 32 phút sau khi bấm đặt hàng. Túi giữ nhiệt đá gel dày dặn được tặng kèm theo chính sách Freeship rất hữu ích.",
      likes: 29,
    },
    {
      id: 5,
      name: "Anh Đặng Quốc Bảo",
      location: "Khu đô thị Ecopark, Văn Giang",
      avatarText: "QB",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      productName: "Combo Nấu Lẩu Bò Úc Cuộn",
      content:
        "Thịt bò mềm ngậy, nhúng lẩu ăn rất ngọt. Mình làm việc bận rộn nên có dịch vụ giao tận cửa thùng lạnh thế này đỡ phải đi siêu thị chen chúc cuối tuần.",
      likes: 19,
    },
    {
      id: 6,
      name: "Chị Ngô Diệu Linh",
      location: "Khu tập thể Nghĩa Tân, Cầu Giấy",
      avatarText: "DL",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      productName: "Rau Củ VietGAP & Đậu Mơ Quê Mình",
      content:
        "Rau cải bó xôi và đậu hũ tươi ngon xuất sắc. Đậu béo ngậy ăn sống hay rán đều ngon, rau rửa không hề có sạn đất. Rất mong Ubofood mở rộng thêm nhiều cơ sở hơn nữa.",
      likes: 24,
    },
  ];

  const filteredReviews = allReviews.filter((r) => {
    if (filterTab === "5star") return r.rating === 5;
    if (filterTab === "meat") return r.content.includes("thịt") || r.content.includes("Thịt");
    if (filterTab === "delivery") return r.content.includes("Giao") || r.content.includes("giao");
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white">
                Đánh Giá Thực Tế Từ Khách Hàng
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Hơn 19.820 khách hàng đã mua và đánh giá trải nghiệm tại Ubofood
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 2. Rating Score Overview Bar */}
        <div className="p-4 bg-[#f4faf5] dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-[#195329] dark:text-emerald-400">
              4.9
            </span>
            <div>
              <div className="flex text-amber-400 text-sm">
                {"★★★★★"}
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                19.820 lượt đánh giá hài lòng (98.4%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-[#195329] text-white shadow-xs"
                  : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
              }`}
            >
              Tất cả (6)
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("meat")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === "meat"
                  ? "bg-[#195329] text-white shadow-xs"
                  : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
              }`}
            >
              🥩 Chất lượng thịt
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("delivery")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === "delivery"
                  ? "bg-[#195329] text-white shadow-xs"
                  : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
              }`}
            >
              🚚 Giao nhanh 2H
            </button>
          </div>
        </div>

        {/* 3. Scrollable Reviews List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-gray-100 dark:divide-zinc-800">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="pt-3.5 first:pt-0 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 font-black text-xs flex items-center justify-center flex-shrink-0">
                    {rev.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                        {rev.name}
                      </h4>
                      {rev.verified && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[#195329] dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold">
                          ✓ Đã mua hàng
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">{rev.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex text-amber-400 text-xs justify-end">
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
              </div>

              {/* Product badge */}
              <div className="inline-block px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                📦 {rev.productName}
              </div>

              {/* Content */}
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                &ldquo;{rev.content}&rdquo;
              </p>

              {/* Likes & feedback helpful */}
              <div className="flex items-center justify-end text-[11px] text-gray-400 gap-1.5 pt-1">
                <span>Hữu ích?</span>
                <button
                  type="button"
                  className="hover:text-[#195329] cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <span>👍</span>
                  <span>{rev.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Footer */}
        <div className="p-3.5 sm:p-4 bg-gray-50 dark:bg-zinc-800/60 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400 text-[11px]">
            Tất cả đánh giá đều được xác thực qua số điện thoại đặt hàng
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#195329] text-white font-bold cursor-pointer hover:bg-[#12421f] transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
