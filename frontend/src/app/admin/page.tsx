"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminService } from "@/services/adminService";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await adminService.getDashboardStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatVnd = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Hoàn Thành</span>;
      case "PROCESSING":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">Đang Xử Lý</span>;
      case "DELIVERING":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">Đang Giao</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">Đã Hủy</span>;
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Chờ Duyệt ⚡
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Chờ Duyệt</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Bảng Điều Khiển Tổng Quan 🥩
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Theo dõi doanh thu chuỗi thực phẩm mát, đơn đặt hàng Web 2H và POS tại quầy.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a261f] transition-all shadow-sm"
          >
            <span>🔄</span>
            <span>{loading ? "Đang đồng bộ..." : "Làm mới dữ liệu"}</span>
          </button>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2b3d32] text-gray-800 dark:text-gray-200 text-xs font-bold transition-all"
          >
            <span>📦</span>
            <span>Duyệt Đơn Hàng</span>
          </Link>

          <Link
            href="/admin/orders?create=true"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>🏪</span>
            <span>Tạo Đơn Nhanh (POS)</span>
          </Link>
        </div>
      </div>

      {/* Quick Jump Navigation Hub - Truy Cập Nhanh Đến Tất Cả Các Trang */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 dark:border-[#1f2e25] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm">
              ⚡ TRUY CẬP NHANH CÁC PHÂN HỆ:
            </span>
            <span className="text-[11px] text-gray-400">Chọn nhanh để chuyển ngay đến trang nghiệp vụ</span>
          </div>
          <span className="text-[10px] text-gray-400">Ubofood Management Hub</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            {
              name: "Tạo Đơn POS",
              icon: "🏪",
              href: "/admin/orders?create=true",
              badge: "Quầy",
              color: "hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
            },
            {
              name: "Đơn Hàng",
              icon: "📦",
              href: "/admin/orders",
              badge: stats?.pendingOrders ? `${stats.pendingOrders} chờ` : "Xem",
              color: "hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 text-blue-700 dark:text-blue-400",
            },
            {
              name: "Kho Sản Phẩm",
              icon: "🥩",
              href: "/admin/products",
              badge: "16 món",
              color: "hover:border-purple-500 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-400",
            },
            {
              name: "Danh Mục",
              icon: "📑",
              href: "/admin/categories",
              badge: "7 nhóm",
              color: "hover:border-amber-500 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-400",
            },
            {
              name: "Nhập Kho Lô",
              icon: "❄️",
              href: "/admin/goods-receipts",
              badge: "Hạn 0-4°C",
              color: "hover:border-cyan-500 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400",
            },
            {
              name: "Mã Voucher",
              icon: "🎟️",
              href: "/admin/vouchers",
              badge: "Ưu đãi",
              color: "hover:border-rose-500 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400",
            },
            {
              name: "Nhà Cung Cấp",
              icon: "🚚",
              href: "/admin/suppliers",
              badge: "Trang trại",
              color: "hover:border-indigo-500 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400",
            },
            {
              name: "Nhân Viên & NV",
              icon: "👥",
              href: "/admin/users",
              badge: "Phân quyền",
              color: "hover:border-teal-500 hover:bg-teal-50/60 dark:hover:bg-teal-950/30 text-teal-700 dark:text-teal-400",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`p-3 rounded-2xl border border-gray-100 dark:border-[#1f2e25] bg-gray-50/60 dark:bg-[#1a261f]/40 flex flex-col items-center justify-between text-center gap-1.5 transition-all group hover:scale-[1.03] active:scale-[0.98] shadow-sm ${item.color}`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-xs font-black leading-tight text-gray-800 dark:text-gray-200">
                {item.name}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-gray-500">
                {item.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4 Stat KPI Cards (Clickable Links to Corresponding Pages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Doanh thu -> Orders */}
        <Link
          href="/admin/orders"
          className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-emerald-600 transition-colors">
              Doanh Thu Đã Thu →
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
              💰
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {stats ? formatVnd(stats.totalRevenue) : "..."}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>↑ 18.5%</span>
              <span className="text-gray-400 font-normal">so với tuần trước</span>
            </div>
          </div>
        </Link>

        {/* Tổng đơn hàng -> Orders (Pending filter) */}
        <Link
          href="/admin/orders?status=PENDING"
          className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm hover:border-amber-500 hover:shadow-md transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-amber-600 transition-colors">
              Tổng Đơn Hàng →
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
              🛍️
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {stats ? `${stats.totalOrders} Đơn` : "..."}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <span className="animate-pulse">⏳ {stats ? stats.pendingOrders : 0} đơn</span>
              <span className="text-gray-400 font-normal">cần xử lý ngay</span>
            </div>
          </div>
        </Link>

        {/* Sản phẩm -> Products */}
        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm hover:border-purple-500 hover:shadow-md transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-purple-600 transition-colors">
              Sản Phẩm Tươi Mát →
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
              🥩
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {stats ? `${stats.totalProducts} Mặt hàng` : "..."}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <span>7 Danh mục</span>
              <span className="text-gray-400 font-normal">chuẩn VietGAP & mát</span>
            </div>
          </div>
        </Link>

        {/* Cảnh báo kho -> Products (Low stock filter) */}
        <Link
          href="/admin/products?stock=LOW"
          className="p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm hover:border-red-500 hover:shadow-md transition-all group block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-red-600 transition-colors">
              Cảnh Báo Tồn Kho →
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform">
              ⚠️
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400">
              {stats ? `${stats.lowStockProducts} Mặt hàng` : "..."}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600 dark:text-red-400 font-semibold">
              <span>Tồn dưới 40 khay</span>
              <span className="text-gray-400 font-normal">cần nhập kho</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Grid: Biểu đồ doanh thu 7 ngày & Kênh bán hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ doanh thu 7 ngày */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Tăng trưởng ổn định từ chuỗi thịt heo & bò mát</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Tuần Này
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-gray-100 dark:border-[#1f2e25]">
            {[
              { day: "T2", amount: "1.250k", height: "45%" },
              { day: "T3", amount: "1.890k", height: "65%" },
              { day: "T4", amount: "1.420k", height: "50%" },
              { day: "T5", amount: "2.100k", height: "75%" },
              { day: "T6", amount: "2.650k", height: "90%" },
              { day: "T7", amount: "3.200k", height: "100%", isMax: true },
              { day: "CN", amount: "2.800k", height: "85%" },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors">
                  {col.amount}
                </span>
                <div className="w-full max-w-[38px] bg-emerald-100 dark:bg-[#1a2d21] rounded-t-xl overflow-hidden flex items-end h-full">
                  <div
                    style={{ height: col.height }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      col.isMax
                        ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/30"
                        : "bg-emerald-500 group-hover:bg-emerald-600"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-around text-xs text-gray-500 dark:text-gray-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Đơn hàng Web giao nhanh 2h (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-800" />
              <span>Đơn POS bán trực tiếp quầy (35%)</span>
            </div>
          </div>
        </div>

        {/* Phím tắt thao tác nhanh */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Thao Tác Nhanh
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Truy cập nhanh các nghiệp vụ cửa hàng</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-[#1f2e25] hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🥩</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Thêm Sản Phẩm Mới</h4>
                  <p className="text-[11px] text-gray-400">Nhập SKU, giá, trọng lượng</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/goods-receipts"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-[#1f2e25] hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📥</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Lập Phiếu Nhập Kho Lô Mát</h4>
                  <p className="text-[11px] text-gray-400">Cập nhật lô hàng & hạn sử dụng</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/vouchers"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-[#1f2e25] hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎟️</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Phát Hành Mã Giảm Giá</h4>
                  <p className="text-[11px] text-gray-400">Freeship, Voucher 50k</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-[#1f2e25] hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👥</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Phân Quyền Thu Ngân</h4>
                  <p className="text-[11px] text-gray-400">Tạo tài khoản POS quầy</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-[11px] text-emerald-800 dark:text-emerald-300">
            💡 <strong>Mẹo vận hành:</strong> Các đơn hàng đặt trên Web có thời gian giao hàng cam kết 2 giờ. Hãy kiểm tra mục Đơn Hàng thường xuyên!
          </div>
        </div>
      </div>

      {/* Đơn hàng mới nhất cần xử lý */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Đơn Đặt Hàng Mới Nhất
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Danh sách đơn từ Website và Quầy POS</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Xem tất cả đơn hàng →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1f2e25] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Mã Đơn</th>
                <th className="py-3 px-3">Khách Hàng</th>
                <th className="py-3 px-3">Kênh</th>
                <th className="py-3 px-3">Tổng Tiền</th>
                <th className="py-3 px-3">Thanh Toán</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f2e25]">
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1a261f]/50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">
                    {order.orderCode}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{order.customerName}</p>
                    <p className="text-[11px] text-gray-400">{order.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.channel === "WEB" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    }`}>
                      {order.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-black text-emerald-600 dark:text-emerald-400">
                    {formatVnd(order.finalAmount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{order.paymentMethod}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/admin/orders?code=${order.orderCode}`}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2c4033] font-semibold text-[11px] transition-colors"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
