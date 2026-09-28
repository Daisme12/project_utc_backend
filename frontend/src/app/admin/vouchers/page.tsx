"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminService, AdminVoucher } from "@/services/adminService";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    badge: "GIẢM 20K",
    title: "",
    discountType: "FIXED_AMOUNT" as "FIXED_AMOUNT" | "PERCENT",
    discountValue: 20000,
    minOrderAmount: 100000,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await adminService.getVouchers();
    setVouchers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      code: "UBO" + Math.floor(10 + Math.random() * 90),
      badge: "ƯU ĐÃI",
      title: "Giảm trực tiếp cho đơn hàng thực phẩm mát",
      discountType: "FIXED_AMOUNT",
      discountValue: 20000,
      minOrderAmount: 150000,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) {
      toast.error("Vui lòng nhập mã code và tiêu đề voucher");
      return;
    }

    const payload = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      startDate: `${formData.startDate}T00:00:00`,
      endDate: `${formData.endDate}T23:59:59`,
    };

    const res = await adminService.createVoucher(payload as any);
    setVouchers((prev) => [res.data, ...prev]);
    toast.success(`Tạo mã voucher ${payload.code} thành công!`);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number, code: string) => {
    if (confirm(`Bạn có chắc muốn vô hiệu hóa mã voucher "${code}"?`)) {
      await adminService.deleteVoucher(id);
      setVouchers((prev) => prev.filter((v) => v.id !== id));
      toast.success(`Đã vô hiệu hóa mã ${code}`);
    }
  };

  const formatVnd = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quản Lý Mã Khuyến Mại & Voucher 🎟️
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Thiết lập mã coupon giảm giá và chính sách miễn phí vận chuyển 2H.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>＋</span>
          <span>Tạo Voucher Mới</span>
        </button>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-gray-400 col-span-3 text-center py-8">Đang tải danh sách voucher...</p>
        ) : (
          vouchers.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Badge top-right */}
              {v.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                  {v.badge}
                </span>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                    {v.code}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(v.code);
                      toast.success(`Đã sao chép mã ${v.code}`);
                    }}
                    className="p-1 text-gray-400 hover:text-emerald-600 text-xs"
                    title="Sao chép mã"
                  >
                    📋
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">
                  {v.title}
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a261f] border border-gray-100 dark:border-[#2b3d32] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mức giảm:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {v.discountType === "PERCENT" ? `${v.discountValue}%` : `-${formatVnd(v.discountValue)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Đơn tối thiểu:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatVnd(v.minOrderAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                  <span>HSD:</span>
                  <span>{v.endDate?.slice(0, 10)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#1f2e25] text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Đang khả dụng
                </span>
                <button
                  onClick={() => handleDelete(v.id, v.code)}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-[11px]"
                >
                  Vô hiệu hóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Voucher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-[#1f2e25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  🎟️
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                    Phát Hành Mã Voucher Khuyến Mại
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tạo mã giảm giá theo số tiền hoặc phần trăm áp dụng cho khách hàng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1f2e25] hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Mã Code Khuyến Mãi (In hoa) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-mono uppercase font-black text-base focus:ring-2 focus:ring-emerald-500"
                    placeholder="FREESHIP2H"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Nhãn Huy Hiệu (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="HOT -50%, FREESHIP..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Tiêu Đề Voucher *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="Giảm 50.000đ cho đơn hàng thịt heo sạch đầu tiên"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Hình Thức Giảm Giá
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="FIXED_AMOUNT">💵 Số tiền cố định (VNĐ)</option>
                    <option value="PERCENT">📊 Theo phần trăm (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Mức Giảm *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-emerald-600 font-black text-base focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Giá Trị Đơn Hàng Tối Thiểu Áp Dụng (VNĐ)
                </label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: 200000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Ngày Bắt Đầu Hiệu Lực
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Ngày Kết Thúc (Hết Hạn)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#1f2e25]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-[#2b3d32] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-[#1f2e25] cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  Kích Hoạt Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
