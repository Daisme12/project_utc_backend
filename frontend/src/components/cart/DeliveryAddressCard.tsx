"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { DeliveryInfo } from "./OrderConfirmModal";

interface DeliveryAddressCardProps {
  deliveryInfo: DeliveryInfo;
  onUpdateDeliveryInfo: (info: DeliveryInfo) => void;
  isInfoComplete: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export default function DeliveryAddressCard({
  deliveryInfo,
  onUpdateDeliveryInfo,
  isInfoComplete,
  isEditing,
  setIsEditing,
}: DeliveryAddressCardProps) {
  const [tempData, setTempData] = useState<DeliveryInfo>({ ...deliveryInfo });

  // Update temp data when editing state or deliveryInfo changes
  useEffect(() => {
    if (isEditing) {
      setTempData({ ...deliveryInfo });
    }
  }, [isEditing, deliveryInfo]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = tempData.name.trim();
    const cleanPhone = tempData.phone.trim();
    const cleanAddress = tempData.address.trim();

    if (!cleanName || cleanName.length < 2) {
      toast.error("Vui lòng nhập họ và tên người nhận (tối thiểu 2 ký tự)");
      return;
    }

    const digitsOnly = cleanPhone.replace(/[\s.-]/g, "");
    if (!digitsOnly || digitsOnly.length < 9 || digitsOnly.length > 12) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số)");
      return;
    }

    if (!cleanAddress || cleanAddress.length < 5) {
      toast.error("Vui lòng nhập địa chỉ nhận hàng chi tiết (số nhà, tên đường, phường/xã)");
      return;
    }

    const updated: DeliveryInfo = {
      ...tempData,
      name: cleanName,
      phone: digitsOnly,
      address: cleanAddress,
      tag: tempData.tag || "Nhà riêng",
      hubDistance: "1.2 km",
      deliveryInstruction: tempData.deliveryInstruction?.trim() || "Giao tận tay trong túi bảo quản giữ nhiệt 0 - 4°C chuyên dụng.",
    };

    onUpdateDeliveryInfo(updated);
    setIsEditing(false);
    toast.success("Đã lưu thông tin giao hàng thành công!");
  };

  return (
    <div id="delivery-address-section" className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white flex items-center gap-2">
          <span>📍</span>
          <span>Địa chỉ giao hàng</span>
        </h2>
        <button
          type="button"
          onClick={() => {
            setTempData({ ...deliveryInfo });
            setIsEditing(true);
          }}
          className="text-xs sm:text-sm font-bold text-[#195329] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{isInfoComplete ? "✏️" : "➕"}</span>
          <span>{isInfoComplete ? "Thay đổi địa chỉ" : "Nhập thông tin giao hàng"}</span>
        </button>
      </div>

      {/* Incomplete Info Warning Banner */}
      {!isInfoComplete && (
        <div className="p-3 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-xs font-black text-amber-900 dark:text-amber-200">
                Chưa có đủ thông tin nhận hàng
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                Vui lòng điền Họ tên, Số điện thoại và Địa chỉ để có thể đặt hàng và thanh toán.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTempData({ ...deliveryInfo });
              setIsEditing(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-all cursor-pointer flex-shrink-0"
          >
            Nhập ngay
          </button>
        </div>
      )}

      {/* Main Address Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 transition-all ${
          isInfoComplete
            ? "bg-[#f2faf3] dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40"
            : "bg-gray-50/70 dark:bg-zinc-800/40 border-dashed border-gray-300 dark:border-zinc-700"
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {deliveryInfo.name ? (
            <span className="text-sm font-extrabold text-gray-900 dark:text-white">
              {deliveryInfo.name}
            </span>
          ) : (
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
              (Chưa nhập họ tên)
            </span>
          )}

          <span className="px-2 py-0.5 rounded-md bg-[#195329] text-white text-[10px] font-bold">
            {deliveryInfo.tag || "Nhà riêng"}
          </span>

          {deliveryInfo.phone && deliveryInfo.phone !== "Chưa cập nhật SĐT" ? (
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 font-mono">
              {deliveryInfo.phone}
            </span>
          ) : (
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
              (Chưa nhập SĐT)
            </span>
          )}
        </div>

        {deliveryInfo.address ? (
          <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
            {deliveryInfo.address}
          </p>
        ) : (
          <p className="text-xs text-red-500 font-medium italic">
            Chưa có địa chỉ nhận hàng chi tiết
          </p>
        )}

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#195329] dark:text-emerald-400 pt-1">
          <span>🎯</span>
          <span>
            Điểm giao nhận tối ưu trong bán kính kho lạnh Ubo Cầu Giấy ({deliveryInfo.hubDistance || "1.2 km"})
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
          <span>{deliveryInfo.deliveryInstruction || "Giao tận tay trong túi bảo quản giữ nhiệt 0 - 4°C chuyên dụng."}</span>
        </div>
      </div>

      {/* Modal chỉnh sửa địa chỉ */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📍</span>
                <span>Cập nhật thông tin nhận hàng</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempData.name}
                  onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#195329]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">
                  Số điện thoại nhận hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={tempData.phone}
                  onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                  placeholder="Ví dụ: 0988123456"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-mono font-medium focus:outline-none focus:border-[#195329]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">
                  Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={tempData.address}
                  onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                  placeholder="Số nhà, tên đường, ngõ ngách, phường/xã, quận/huyện..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#195329]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">
                  Loại địa chỉ
                </label>
                <div className="flex gap-2">
                  {["Nhà riêng", "Văn phòng"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTempData({ ...tempData, tag: t })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        tempData.tag === t
                          ? "bg-[#195329] text-white border-[#195329]"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-bold">
                  Ghi chú cho Shipper
                </label>
                <input
                  type="text"
                  value={tempData.deliveryInstruction || ""}
                  onChange={(e) => setTempData({ ...tempData, deliveryInstruction: e.target.value })}
                  placeholder="Ví dụ: Gọi trước khi giao, gửi bảo vệ..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:border-[#195329]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#195329] text-white hover:bg-[#12421f] cursor-pointer font-bold shadow-xs active:scale-95"
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
