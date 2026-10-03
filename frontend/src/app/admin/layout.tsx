"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { getUserRole, hasAdminAccess, getRoleBadgeInfo } from "@/lib/permissions";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Tổng Quan", href: "/admin", icon: "📊" },
  { name: "Quầy Thu Ngân POS", href: "/admin/pos", icon: "🏪" },
  { name: "Đơn Hàng", href: "/admin/orders", icon: "📦" },
  { name: "Sản Phẩm", href: "/admin/products", icon: "🥩", badge: "16" },
  { name: "Danh Mục", href: "/admin/categories", icon: "🏷️" },
  { name: "Nhập Kho Lô Mát", href: "/admin/goods-receipts", icon: "📥" },
  { name: "Mã Khuyến Mại", href: "/admin/vouchers", icon: "🎟️" },
  { name: "Nhà Cung Cấp", href: "/admin/suppliers", icon: "🏢" },
  { name: "Người Dùng & Phân Quyền", href: "/admin/users", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    syncUser();
    window.addEventListener("auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleResetAllData = () => {
    setIsRefreshing(true);
    toast.info("Đang làm mới và đồng bộ toàn bộ dữ liệu mới nhất...");
    setTimeout(() => {
      window.location.reload();
    }, 350);
  };

  useEffect(() => {
    adminService.checkBackendHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      adminService.checkBackendHealth().then(setBackendOnline);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  // PHÂN QUYỀN: Chặn truy cập nếu không có quyền ADMIN hoặc CASHIER
  if (authChecked && (!currentUser || !hasAdminAccess(currentUser))) {
    const roleInfo = getRoleBadgeInfo(currentUser);
    return (
      <div className="min-h-screen bg-[#0c120e] text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="max-w-md w-full bg-[#16201a] border border-[#2b3d32] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-red-500/10">
            🛑
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-red-400 uppercase">
              403 • Truy Cập Bị Giới Hạn
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Quyền Quản Trị Hệ Thống
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              Trang quản trị chỉ dành riêng cho tài khoản có vai trò{" "}
              <strong className="text-purple-400">Quản Trị Viên (ADMIN)</strong>{" "}
              hoặc <strong className="text-blue-400">Thu Ngân (CASHIER)</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1a261f] border border-[#2b3d32] text-xs space-y-2 text-left">
            <div className="flex justify-between items-center text-gray-400">
              <span>Tài khoản hiện tại:</span>
              <strong className="text-white">
                {currentUser?.fullName || "Chưa đăng nhập"}
              </strong>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Vai trò hiện tại:</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${roleInfo.badgeBg}`}
              >
                <span>{roleInfo.icon}</span>
                <span>{roleInfo.label}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <span>🛒</span>
              <span>Về Trang Mua Sắm Khách Hàng</span>
            </Link>

            <Link
              href="/login?redirect=/admin"
              className="w-full py-2.5 px-4 rounded-xl border border-[#2b3d32] hover:bg-[#1a261f] text-gray-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔑</span>
              <span>Đăng Nhập Tài Khoản Admin</span>
            </Link>
          </div>

          {/* Công cụ chuyển đổi tài khoản Demo tiện lợi để test phân quyền */}
          <div className="pt-4 border-t border-[#2b3d32] text-[11px] text-gray-400 space-y-2">
            <p className="font-semibold text-gray-400">
              Chuyển nhanh tài khoản để kiểm thử phân quyền:
            </p>
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const adminUser = {
                    id: 1,
                    username: "admin",
                    fullName: "Nguyễn Quản Trị",
                    email: "admin@utc.edu.vn",
                    phone: "0988888888",
                    role: "ADMIN",
                    accumulatedPoints: 500,
                  };
                  localStorage.setItem("user", JSON.stringify(adminUser));
                  window.dispatchEvent(new Event("auth-change"));
                  setCurrentUser(adminUser);
                  toast.success(
                    "Đã chuyển sang tài khoản Quản trị viên (ADMIN)!"
                  );
                }}
                className="px-2.5 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 text-purple-200 font-bold cursor-pointer transition-colors"
              >
                🛡️ Sang ADMIN
              </button>
              <button
                type="button"
                onClick={() => {
                  const cashierUser = {
                    id: 2,
                    username: "thungan01",
                    fullName: "Trần Thị Thu Ngân",
                    email: "cashier01@utc.edu.vn",
                    phone: "0977777777",
                    role: "CASHIER",
                    accumulatedPoints: 100,
                  };
                  localStorage.setItem("user", JSON.stringify(cashierUser));
                  window.dispatchEvent(new Event("auth-change"));
                  setCurrentUser(cashierUser);
                  toast.success(
                    "Đã chuyển sang tài khoản Thu ngân (CASHIER)!"
                  );
                }}
                className="px-2.5 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700 text-blue-200 font-bold cursor-pointer transition-colors"
              >
                🏪 Sang THU NGÂN
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f3] dark:bg-[#0b100d] text-gray-900 dark:text-gray-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Collapsible with smooth transitions) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#121a15] border-r border-gray-200 dark:border-[#1f2e25] flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"} w-72`}
      >
        {/* Brand Header */}
        <div className={`h-16 px-4 border-b border-gray-200 dark:border-[#1f2e25] flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
              U
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <span className="font-extrabold text-lg text-emerald-800 dark:text-emerald-400 tracking-tight whitespace-nowrap">
                  Ubofood
                </span>
                <span className="block text-[11px] font-semibold tracking-wider text-gray-400 uppercase whitespace-nowrap">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>

          {/* Close on Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a261f]"
          >
            ✕
          </button>

          {/* Desktop Collapse Arrow inside header */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a261f] transition-colors"
              title="Thu gọn thanh bên"
            >
              ◀
            </button>
          )}
        </div>

        {/* System Status Strip */}
        <div className={`mx-3 mt-3 px-2.5 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2" title={backendOnline === true ? "Backend Online" : "Dữ liệu Mẫu"}>
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                backendOnline === true
                  ? "bg-emerald-500 animate-pulse"
                  : backendOnline === false
                  ? "bg-amber-500"
                  : "bg-gray-400"
              }`}
            />
            {!isCollapsed && (
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 truncate">
                {backendOnline === true
                  ? "Backend API Online"
                  : backendOnline === false
                  ? "Dữ liệu Mẫu (Fallback)"
                  : "Kiểm tra API..."}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-100">
              v1.0
            </span>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase px-3 pb-1">
              Quản Lý Hệ Thống
            </div>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={item.name}
                className={`flex items-center ${isCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2.5"} rounded-xl font-medium text-sm transition-all duration-150 relative group ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a261f] hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>
                {item.badge && !isCollapsed && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-[#1f2e25] text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {/* Collapsed Tooltip floating bubble */}
                {isCollapsed && (
                  <span className="fixed left-20 ml-2 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-[#1f2e25] space-y-2">
          {/* Nút Reset / Làm Mới Toàn Bộ Dữ Liệu */}
          <button
            type="button"
            onClick={handleResetAllData}
            disabled={isRefreshing}
            title="Làm mới và lấy toàn bộ dữ liệu mới nhất từ hệ thống"
            className={`flex items-center ${
              isCollapsed ? "justify-center p-2.5" : "justify-center gap-2 py-2 px-3"
            } w-full rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-sm active:scale-95 group`}
          >
            <span className={`text-base transition-transform ${isRefreshing ? "animate-spin" : "group-hover:rotate-180 duration-500"}`}>
              🔄
            </span>
            {!isCollapsed && <span>{isRefreshing ? "Đang làm mới..." : "Làm Mới Dữ Liệu"}</span>}
            {isCollapsed && (
              <span className="fixed left-20 ml-2 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                Làm Mới Dữ Liệu
              </span>
            )}
          </button>

          <Link
            href="/"
            title="Vào Cửa Hàng (Storefront)"
            className={`flex items-center ${isCollapsed ? "justify-center p-2.5" : "justify-center gap-2 py-2 px-3"} w-full rounded-xl border border-gray-200 dark:border-[#2b3d32] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a261f] transition-colors`}
          >
            <span className="text-base">🏪</span>
            {!isCollapsed && <span>Vào Cửa Hàng</span>}
          </Link>

          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-3 px-1"
            } pt-1 border-t border-gray-100 dark:border-[#1f2e25] mt-1`}
            title={`${currentUser?.fullName || "Nguyễn Quản Trị"} - ${currentUser?.email || "admin@utc.edu.vn"}`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-200 dark:border-emerald-800 shrink-0">
              {currentUser?.fullName
                ? currentUser.fullName.trim().charAt(0).toUpperCase()
                : "A"}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                    {currentUser?.fullName || "Nguyễn Quản Trị"}
                  </p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/50 shrink-0">
                    {getUserRole(currentUser)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">
                  {currentUser?.email || currentUser?.phone || "admin@utc.edu.vn"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        {/* Topbar with Always-Visible Hamburger Icon */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#121a15]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#1f2e25] px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Works for both Mobile & Desktop) */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-xl border border-gray-200 dark:border-[#2b3d32] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a261f] transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
              title={isCollapsed ? "Mở rộng thanh bên (Sidebar)" : "Thu gọn thanh bên (Sidebar)"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/admin" className="hover:text-emerald-600 font-medium">
                Admin
              </Link>
              <span>/</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {pathname.replace("/admin", "").replace("/", "") || "Tổng Quan"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              ⚡ Hệ thống Quản trị Chuỗi Ubofood
            </span>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Xem Web</span>
              <span>↗</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 w-full mx-auto ${
            pathname === "/admin/pos"
              ? "p-2 sm:p-3 max-w-none"
              : "p-4 sm:p-6 lg:p-8 max-w-7xl"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
