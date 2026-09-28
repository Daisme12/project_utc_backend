"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminService, AdminSupplier } from "@/services/adminService";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await adminService.getSuppliers();
    setSuppliers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      phone: "0243",
      address: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên nhà cung cấp");
      return;
    }

    const res = await adminService.createSupplier(formData);
    setSuppliers((prev) => [...prev, res.data]);
    toast.success(`Thêm nhà cung cấp "${formData.name}" thành công!`);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc muốn ngừng hợp tác với nhà cung cấp "${name}"?`)) {
      await adminService.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      toast.success(`Đã xóa nhà cung cấp ${name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quản Lý Nhà Cung Cấp Chuỗi Nông Sản 🏢
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Đối tác cung ứng thịt heo VietGAP, bò Úc mát, hải sản tươi và rau củ hữu cơ.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>＋</span>
          <span>Thêm Nhà Cung Cấp</span>
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-xs text-gray-400 col-span-2 text-center py-8">Đang tải danh sách đối tác...</p>
        ) : (
          suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{sup.name}</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      📞 {sup.phone || "Chưa có SĐT"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Đối tác chính thức
                </span>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5 bg-gray-50 dark:bg-[#1a261f] p-3 rounded-xl">
                <span>📍</span>
                <span>{sup.address || "Địa chỉ trang trại chưa cập nhật"}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#1f2e25] text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Đang cung ứng hàng
                </span>
                <button
                  onClick={() => handleDelete(sup.id, sup.name)}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-[11px]"
                >
                  Ngừng hợp tác
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-[#1f2e25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  🏭
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                    Thêm Nhà Cung Cấp / Đối Tác Mới
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Quản lý danh sách trang trại chăn nuôi, vùng trồng hữu cơ và nhà phân phối
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
              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Tên Trang Trại / Nhà Cung Cấp *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: Trang Trại Chăn Nuôi Heo Chuẩn VietGAP Ba Vì..."
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Số Điện Thoại Liên Hệ *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="0243.888.999 / 0988.123.456"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Địa Chỉ Vùng Trồng / Kho Lạnh
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Xã Vân Hòa, Huyện Ba Vì, TP. Hà Nội"
                />
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
                  Lưu Đối Tác Cung Cấp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
