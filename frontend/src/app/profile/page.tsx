"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditProfileModal, { UserProfileData } from "@/components/profile/EditProfileModal";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import ReturnOrderModal from "@/components/orders/ReturnOrderModal";
import { API_URL } from "@/lib/constants";
import { getUserRole, hasAdminAccess, getRoleBadgeInfo } from "@/lib/permissions";
import { getOrderStatusInfo } from "@/lib/orderStatus";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfileData>({
    fullName: "Khách Hàng",
    email: "customer@gmail.com",
    phone: "0912 345 678",
    address: "Số 3 Cầu Giấy, Láng Thượng, Hà Nội",
    accumulatedPoints: 150,
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [returnOrder, setReturnOrder] = useState<any | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Hồ sơ tài khoản | Ubofood Thực Phẩm Tươi Sạch";
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);

        // Fetch fresh info from backend API if userId exists
        if (parsed.id) {
          fetch(`${API_URL}/users/${parsed.id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data?.data) {
                setUser((prev) => ({
                  ...prev,
                  ...data.data,
                  address: prev.address || prev.shippingAddress || "Số 3 Cầu Giấy, Láng Thượng, Hà Nội",
                }));
              }
            })
            .catch(() => {});

          // Fetch user orders from API
          setLoadingOrders(true);
          fetch(`${API_URL}/orders/user/${parsed.id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data?.data && Array.isArray(data.data)) {
                setOrders(data.data);
              }
            })
            .catch(() => {})
            .finally(() => setLoadingOrders(false));
        }
      }
    } catch {}

    const handleUserUpdated = (e: any) => {
      if (e.detail) setUser(e.detail);
    };
    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, []);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#195329]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            Hồ sơ tài khoản
          </span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-2xl font-black text-[#195329] dark:text-emerald-400 shadow-sm">
                {user.fullName ? user.fullName.trim().charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#113a1b] dark:text-white">
                  {user.fullName}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Thành viên thân thiết Ubofood • Điểm tích lũy:{" "}
                  <span className="font-bold text-[#195329] dark:text-emerald-400">
                    {user.accumulatedPoints ?? 250} điểm
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {(() => {
                const roleInfo = getRoleBadgeInfo(user);
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.badgeBg}`}
                  >
                    <span>{roleInfo.icon}</span>
                    <span>{roleInfo.label}</span>
                  </span>
                );
              })()}

              {hasAdminAccess(user) && (
                <Link
                  href="/admin"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <span>⚡</span>
                  <span>Vào Quản Trị Admin ↗</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-gray-700 dark:text-gray-200 hover:text-[#195329] dark:hover:text-emerald-300 border border-gray-200 dark:border-zinc-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              >
                <span>✏️</span>
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>

          {/* User Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs block mb-1">Họ và tên</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {user.fullName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] text-[#195329] dark:text-emerald-400 font-semibold hover:underline"
              >
                Sửa
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs block mb-1">Số điện thoại</span>
                <span className="font-bold text-gray-800 dark:text-gray-100 font-mono">
                  {user.phone || "0966666666"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] text-[#195329] dark:text-emerald-400 font-semibold hover:underline"
              >
                Sửa
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs block mb-1">Email liên hệ</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {user.email || "customer01@gmail.com"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] text-[#195329] dark:text-emerald-400 font-semibold hover:underline"
              >
                Sửa
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs block mb-1">
                  Địa chỉ giao hàng mặc định
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-100 leading-snug">
                  {user.address || user.shippingAddress || "Số 3 Cầu Giấy, Láng Thượng, Hà Nội"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] text-[#195329] dark:text-emerald-400 font-semibold hover:underline flex-shrink-0 ml-2"
              >
                Sửa
              </button>
            </div>
          </div>

          {/* User Orders History from API */}
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                <span>📦 Đơn Hàng Của Bạn</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 text-xs font-bold">
                  {orders.length}
                </span>
              </h3>

              <Link
                href="/orders"
                className="text-xs font-bold text-[#195329] dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả đơn hàng</span>
                <span>→</span>
              </Link>
            </div>

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-gray-400">
                <span className="inline-block w-4 h-4 border-2 border-[#195329] border-t-transparent rounded-full animate-spin mr-2"></span>
                Đang tải dữ liệu đơn hàng...
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-2.5">
                {orders.map((ord: any) => (
                  <div
                    key={ord.id || ord.orderCode}
                    onClick={() => handleOpenDetail(ord)}
                    className="p-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 hover:bg-emerald-50/40 dark:hover:bg-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all flex flex-wrap items-center justify-between gap-3 text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#195329] dark:text-emerald-400 font-mono text-sm group-hover:underline">
                          {ord.orderCode}
                        </span>
                        {(() => {
                          const statusInfo = getOrderStatusInfo(ord.orderStatus);
                          return (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.fullBadgeClass}`}
                            >
                              {statusInfo.label}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-gray-400 mt-1 text-[11px]">
                        Ngày tạo:{" "}
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleString("vi-VN")
                          : "Hôm nay"}{" "}
                        • {ord.items?.length || 1} món hàng
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-black text-red-600 dark:text-red-400 block">
                          {new Intl.NumberFormat("vi-VN").format(
                            ord.finalAmount || ord.totalAmount
                          )}
                          đ
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {ord.paymentMethod || "COD"}
                        </span>
                      </div>

                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 group-hover:bg-[#195329] group-hover:text-white font-bold text-xs shadow-2xs transition-all border border-gray-200 dark:border-zinc-600">
                        Chi tiết →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 text-center text-xs text-gray-500">
                Bạn chưa có đơn hàng nào.
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/orders"
              className="px-4 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all shadow-xs"
            >
              📦 Trang đơn hàng của tôi
            </Link>
            <Link
              href="/cart"
              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-all"
            >
              🛒 Xem giỏ hàng
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all"
            >
              Tiếp tục đi chợ
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        currentUser={user}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={(updated) => setUser(updated)}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        onRequestReturn={(ord) => {
          setReturnOrder(ord);
          setIsReturnModalOpen(true);
        }}
      />

      {/* Return & Refund Modal */}
      <ReturnOrderModal
        isOpen={isReturnModalOpen}
        order={returnOrder}
        onClose={() => {
          setIsReturnModalOpen(false);
          setReturnOrder(null);
        }}
      />
    </div>
  );
}
