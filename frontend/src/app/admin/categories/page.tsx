"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminService, AdminCategory } from "@/services/adminService";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "🥩",
    description: "",
    displayOrder: 1,
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await adminService.getCategories();
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      icon: "🥩",
      description: "",
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: AdminCategory) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      icon: c.icon || "🥩",
      description: c.description || "",
      displayOrder: c.displayOrder || 1,
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

    const payload = { ...formData, slug };

    if (editingCategory) {
      await adminService.updateCategory(editingCategory.id, payload);
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...payload } : c))
      );
      toast.success("Cập nhật danh mục thành công!");
    } else {
      const res = await adminService.createCategory(payload);
      setCategories((prev) => [...prev, res.data]);
      toast.success("Thêm danh mục mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc muốn vô hiệu hóa danh mục "${name}"?`)) {
      await adminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Đã vô hiệu hóa danh mục ${name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quản Lý Danh Mục Thực Phẩm 🏷️
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Thiết lập danh mục đồng bộ hiển thị với Website và Menu tại quầy thu ngân.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>＋</span>
          <span>Tạo Danh Mục Mới</span>
        </button>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-gray-400 col-span-3 text-center py-8">Đang tải danh mục...</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                    {cat.icon || "🥩"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cat.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">slug: /{cat.slug}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                  Thứ tự #{cat.displayOrder || 1}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {cat.description || "Không có mô tả chi tiết."}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#1f2e25] text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Đang hoạt động
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2c4033] font-semibold text-[11px]"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-[11px]"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-[#1f2e25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  🏷️
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                    {editingCategory ? "Chỉnh Sửa Danh Mục Sản Phẩm" : "Tạo Danh Mục Sản Phẩm Mới"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Quản lý danh mục phân loại thực phẩm trên trang chủ và POS
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
                  Tên Danh Mục Thực Phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: Thịt Heo Tươi Mát Chuẩn VietGAP"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Biểu Tượng Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white text-center text-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="🥩, 🦐, 🥬..."
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Thứ Tự Ưu Tiên Hiển Thị
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Đường Dẫn Slug URL
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                  placeholder="thit-heo-tuoi-mat"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Mô Tả Danh Mục
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="Mô tả tiêu chuẩn bảo quản lạnh 0-4°C, nguồn gốc trang trại..."
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
                  {editingCategory ? "Lưu Thay Đổi" : "Tạo Danh Mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
