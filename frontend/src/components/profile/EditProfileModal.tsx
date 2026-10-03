"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

export interface UserProfileData {
  id?: number;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  shippingAddress?: string;
  accumulatedPoints?: number;
  role?: string;
}

export interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: UserProfileData;
  onClose: () => void;
  onSaved: (updatedUser: UserProfileData) => void;
}

export default function EditProfileModal({
  isOpen,
  currentUser,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || "",
    phone: currentUser.phone || "",
    email: currentUser.email || "",
    address:
      currentUser.address ||
      currentUser.shippingAddress ||
      "Số 3 Cầu Giấy, Láng Thượng, Hà Nội",
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Đang lưu thông tin cá nhân...");

    const updatedUser: UserProfileData = {
      ...currentUser,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      shippingAddress: formData.address.trim(),
    };

    try {
      // 1. Send update to backend API if userId exists
      if (currentUser.id) {
        const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            email: updatedUser.email,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            updatedUser.fullName = json.data.fullName || updatedUser.fullName;
            updatedUser.phone = json.data.phone || updatedUser.phone;
            updatedUser.email = json.data.email || updatedUser.email;
          }
        }
      }

      // 2. Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 3. Dispatch event so Header and Cart update dynamically
      window.dispatchEvent(
        new CustomEvent("userUpdated", { detail: updatedUser })
      );

      toast.success("Cập nhật thông tin thành công!", { id: toastId });
      onSaved(updatedUser);
      onClose();
    } catch (err: any) {
      console.warn("Lỗi cập nhật backend, lưu local storage:", err);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(
        new CustomEvent("userUpdated", { detail: updatedUser })
      );
      toast.success("Đã cập nhật thông tin trên thiết bị!", { id: toastId });
      onSaved(updatedUser);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-zinc-850 dark:to-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-lg">
              ✏️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                Chỉnh sửa thông tin tài khoản
              </h3>
              <p className="text-xs text-gray-500">
                Cập nhật thông tin để nhận hàng và tích điểm thuận tiện
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="0988 888 888"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Email liên hệ
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Địa chỉ giao hàng mặc định
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Số nhà, đường, phường, quận, thành phố..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Lưu thông tin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
