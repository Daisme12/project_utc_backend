"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function DeliveryAddressCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "Nguyễn Minh Châu",
    tag: "Văn phòng",
    phone: "0989 123 456",
    address: "Tầng 18, Tòa Keangnam Landmark 72, Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, TP. Hà Nội",
    hubDistance: "1.8 km",
    deliveryInstruction: "Gửi bảo vệ sảnh A, gọi điện trước khi đến 5 phút để bảo quản tủ lạnh ngay.",
  });

  const [tempData, setTempData] = useState({ ...addressData });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressData({ ...tempData });
    setIsEditing(false);
    toast.success("Đã cập nhật địa chỉ giao hàng!");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white flex items-center gap-2">
          <span>📍</span>
          <span>Địa chỉ giao hàng</span>
        </h2>
        <button
          type="button"
          onClick={() => {
            setTempData({ ...addressData });
            setIsEditing(true);
          }}
          className="text-xs font-bold text-[#195329] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>✏️</span>
          <span>Thay đổi địa chỉ</span>
        </button>
      </div>

      {/* Main Address Card (Mint tinted background) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#f2faf3] dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
            {addressData.name}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#195329] text-white text-[10px] font-bold">
            {addressData.tag}
          </span>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {addressData.phone}
          </span>
        </div>

        <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
          {addressData.address}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#195329] dark:text-emerald-400 pt-1">
          <span>🎯</span>
          <span>
            Điểm giao nhận tối ưu trong bán kính kho lạnh Ubo Cầu Giấy ({addressData.hubDistance})
          </span>
        </div>
      </div>

      {/* Shipping Instruction Note */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
          Ghi chú vận chuyển tươi sống
        </span>
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-xs text-gray-700 dark:text-gray-300">
          <span>🛵</span>
          <span>{addressData.deliveryInstruction}</span>
        </div>
      </div>

      {/* Modal chỉnh sửa địa chỉ */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Cập nhật địa chỉ nhận hàng
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Họ và tên</label>
                <input
                  type="text"
                  value={tempData.name}
                  onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Số điện thoại</label>
                <input
                  type="text"
                  value={tempData.phone}
                  onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Địa chỉ chi tiết</label>
                <textarea
                  value={tempData.address}
                  onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Ghi chú cho Shipper</label>
                <input
                  type="text"
                  value={tempData.deliveryInstruction}
                  onChange={(e) => setTempData({ ...tempData, deliveryInstruction: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#195329] text-white hover:bg-[#12421f] cursor-pointer font-bold shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
