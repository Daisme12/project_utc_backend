"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminService, AdminUser } from "@/services/adminService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    role: "CASHIER" as "ADMIN" | "CASHIER" | "CUSTOMER",
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await adminService.getUsers();
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: `staff_${Date.now().toString().slice(-4)}`,
      password: "",
      fullName: "",
      phone: "09",
      email: "",
      role: "CASHIER",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      password: "",
      fullName: u.fullName,
      phone: u.phone || "",
      email: u.email || "",
      role: u.role,
      isActive: u.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.username.trim()) {
      toast.error("Vui lòng điền họ tên và tên đăng nhập");
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      toast.error("Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }

    if (editingUser) {
      await adminService.updateUser(editingUser.id, formData);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      toast.success("Cập nhật thông tin người dùng thành công!");
    } else {
      const res = await adminService.createUser(formData);
      setUsers((prev) => [res.data, ...prev]);
      toast.success(`Tạo tài khoản ${formData.role} thành công!`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number, username: string) => {
    if (confirm(`Bạn có chắc muốn khóa hoặc xóa tài khoản "${username}"?`)) {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`Đã xóa tài khoản ${username}`);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">Quản Trị Viên</span>;
      case "CASHIER":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">Thu Ngân Quầy</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Khách Hàng</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quản Lý Người Dùng & Phân Quyền 👥
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Phân quyền tài khoản Quản trị, Thu ngân POS cửa hàng và Khách hàng tích lũy điểm.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>＋</span>
          <span>Tạo Tài Khoản Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="flex-1 w-full max-w-md relative">
          <input
            type="text"
            placeholder="Tìm theo họ tên, username, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:border-emerald-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Mọi Vai Trò</option>
            <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
            <option value="CASHIER">Thu Ngân Quầy (CASHIER)</option>
            <option value="CUSTOMER">Khách Hàng (CUSTOMER)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1f2e25] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Người Dùng</th>
                <th className="py-3 px-3">Tài Khoản (Username)</th>
                <th className="py-3 px-3">Vai Trò</th>
                <th className="py-3 px-3">Số Điện Thoại</th>
                <th className="py-3 px-3">Điểm Tích Lũy</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f2e25]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1a261f]/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-200 dark:border-emerald-800">
                          {u.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{u.fullName}</p>
                          <p className="text-[11px] text-gray-400">{u.email || "Chưa có email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-gray-700 dark:text-gray-300">
                      @{u.username}
                    </td>
                    <td className="py-3.5 px-3">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 dark:text-gray-300">
                      {u.phone || "---"}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ⭐ {u.accumulatedPoints || 0} điểm
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Hoạt động
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2c4033] font-semibold text-[11px]"
                        >
                          Sửa
                        </button>
                        {u.username !== "admin" && (
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-[11px]"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-[#1f2e25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                    {editingUser ? "Chỉnh Sửa Tài Khoản Người Dùng" : "Tạo Tài Khoản Nhân Viên / Người Dùng"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Phân quyền vai trò Quản trị (Admin), Thu ngân điểm bán (Cashier) hoặc Khách hàng
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
                  Họ Và Tên Đầy Đủ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ví dụ: Trần Thị Thu Ngân"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Tên Đăng Nhập (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    placeholder="thungan01"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Vai Trò Phân Quyền
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="CASHIER">🧑‍💼 Thu Ngân POS (CASHIER)</option>
                    <option value="ADMIN">🛡️ Quản Trị Hệ Thống (ADMIN)</option>
                    <option value="CUSTOMER">🛒 Khách Hàng (CUSTOMER)</option>
                  </select>
                </div>
              </div>

              {!editingUser && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-gray-700 dark:text-gray-200">Mật Khẩu Khởi Tạo *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPass = "Ubo@" + Math.floor(100000 + Math.random() * 900000);
                        setFormData({ ...formData, password: randomPass });
                        toast.info(`Đã tạo mật khẩu ngẫu nhiên: ${randomPass}`);
                      }}
                      className="text-xs text-emerald-600 hover:underline font-bold cursor-pointer"
                    >
                      🎲 Tạo mật khẩu ngẫu nhiên
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập mật khẩu khởi tạo (tối thiểu 6 ký tự)..."
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="0988888888"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Địa Chỉ Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="thungan@ubofood.vn"
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
                  {editingUser ? "Lưu Thay Đổi" : "Tạo Tài Khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
