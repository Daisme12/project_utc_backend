"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import ReturnOrderModal from "@/components/orders/ReturnOrderModal";
import DateRangePicker from "@/components/common/DateRangePicker";
import { useCart } from "@/context/CartContext";
import { API_URL } from "@/lib/constants";
import {
  CUSTOMER_ORDER_TABS,
  matchesOrderStatus,
  normalizeOrderStatus,
  getOrderStatusInfo,
} from "@/lib/orderStatus";

export default function MyOrdersPage() {
  const { addItem } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [dateFilterPreset, setDateFilterPreset] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [returnOrder, setReturnOrder] = useState<any | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Helper format YYYY-MM-DD using local time (avoids UTC timezone shift)
  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDisplay = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  useEffect(() => {
    document.title = "Đơn hàng của tôi | Ubofood Thực Phẩm Tươi Sạch";
    let userId: number | undefined;
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        userId = parsed.id;
      }
    } catch {}

    const fetchOrders = async () => {
      setLoading(true);
      try {
        let endpoint = `${API_URL}/orders`;
        if (userId) {
          endpoint = `${API_URL}/orders/user/${userId}`;
        }

        const res = await fetch(endpoint, {
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          const list = json?.data || json;
          if (Array.isArray(list)) {
            setOrders(list);
          }
        }
      } catch (err) {
        console.warn("Lỗi tải danh sách đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const tabs = CUSTOMER_ORDER_TABS;

  // Preset Date Filter handler using local date
  const handlePresetDate = (preset: string) => {
    setDateFilterPreset(preset);
    const now = new Date();

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "today") {
      const todayStr = formatLocalDate(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === "7days") {
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      setStartDate(formatLocalDate(past));
      setEndDate(formatLocalDate(now));
    } else if (preset === "30days") {
      const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      setStartDate(formatLocalDate(past));
      setEndDate(formatLocalDate(now));
    }
  };

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Status Filter (Hợp nhất canonical status)
      if (activeTab !== "ALL") {
        if (!matchesOrderStatus(ord.orderStatus, activeTab)) {
          return false;
        }
      }

      // 2. Keyword Filter (Order code, recipient, product name)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const codeMatch = (ord.orderCode || "").toLowerCase().includes(kw);
        const nameMatch = (ord.customerName || "").toLowerCase().includes(kw);
        const itemMatch = ord.items?.some((i: any) =>
          (i.productName || "").toLowerCase().includes(kw)
        );
        if (!codeMatch && !nameMatch && !itemMatch) return false;
      }

      // 3. Date Range Filter (Local Date String comparison YYYY-MM-DD)
      if (startDate || endDate) {
        if (!ord.createdAt) return false;
        const ordDateObj = new Date(ord.createdAt);
        if (isNaN(ordDateObj.getTime())) return false;
        const ordDateStr = formatLocalDate(ordDateObj);

        if (startDate && ordDateStr < startDate) return false;
        if (endDate && ordDateStr > endDate) return false;
      }

      return true;
    });
  }, [orders, activeTab, searchKeyword, startDate, endDate]);

  // Statistics
  const totalSpent = useMemo(() => {
    return orders.reduce(
      (sum, ord) => sum + (Number(ord.finalAmount || ord.totalAmount) || 0),
      0
    );
  }, [orders]);

  const activeProcessingCount = useMemo(() => {
    return orders.filter((o) => {
      const canonical = normalizeOrderStatus(o.orderStatus);
      return ["PENDING", "PROCESSING", "DELIVERING"].includes(canonical);
    }).length;
  }, [orders]);

  const completedCount = useMemo(() => {
    return orders.filter(
      (o) => normalizeOrderStatus(o.orderStatus) === "COMPLETED"
    ).length;
  }, [orders]);

  const formatPrice = (price: number | undefined) => {
    if (!price) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ";
  };

  const handleReorder = (order: any) => {
    if (!order.items || order.items.length === 0) {
      toast.info("Đơn hàng không có sản phẩm");
      return;
    }

    order.items.forEach((item: any) => {
      addItem(
        {
          id: item.productId || item.id || Math.floor(Math.random() * 1000),
          name: item.productName || "Sản phẩm Ubofood",
          price: Number(item.unitPrice) || 0,
          packWeight: item.packWeight || "Khay 300g",
          image:
            item.imageUrl ||
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        },
        Number(item.quantity) || 1
      );
    });

    toast.success(`Đã thêm ${order.items.length} món vào giỏ hàng!`);
  };

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleOpenReturnModal = (order: any) => {
    setReturnOrder(order);
    setIsReturnModalOpen(true);
  };

  const handleResetFilters = () => {
    setActiveTab("ALL");
    setSearchKeyword("");
    setDateFilterPreset("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] dark:bg-[#0c120e] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#195329] flex items-center gap-1">
            <span>🏠</span>
            <span>Trang chủ</span>
          </Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-[#195329]">
            Hồ sơ tài khoản
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            Đơn hàng của tôi
          </span>
        </nav>

        {/* 2. Hero Dashboard Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0d3016] via-[#154621] to-[#0a2310] text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-radial from-emerald-500/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 uppercase tracking-wider">
                  QUẢN LÝ ĐƠN HÀNG
                </span>
                <span className="text-xs text-gray-300">
                  Chuẩn nhiệt độ lạnh 0 - 4°C
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Lịch Sử Đơn Hàng Của Bạn
              </h1>
              <p className="text-xs text-gray-200 leading-relaxed">
                Theo dõi hành trình thực phẩm tươi sống từ xưởng sơ chế đến tận tay, yêu cầu hoàn hàng 100% trong 24H hoặc mua lại nhanh chóng chỉ với 1 chạm.
              </p>
            </div>

            {/* Support hotline pill */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <a
                href="tel:19008912"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <span>📞</span>
                <span>Hotline hoàn tiền: <strong>1900 8912</strong></span>
              </a>
            </div>
          </div>

          {/* 4 Mini KPI Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-300 text-[11px] block">Tổng số đơn</span>
              <span className="text-lg font-black text-white font-mono">
                {orders.length} đơn
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-300 text-[11px] block">Đang xử lý / giao</span>
              <span className="text-lg font-black text-amber-300 font-mono">
                {activeProcessingCount} đơn
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-300 text-[11px] block">Đã hoàn thành</span>
              <span className="text-lg font-black text-emerald-300 font-mono">
                {completedCount} đơn
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-300 text-[11px] block">Chi tiêu tích lũy</span>
              <span className="text-lg font-black text-white font-mono truncate block">
                {formatPrice(totalSpent)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Unified Search Bar with Integrated Date Filter */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
          {/* Main search and date filter toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-3 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm mã đơn (#UBO-...), tên món ăn, người nhận..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800/80 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#195329] focus:bg-white dark:focus:bg-zinc-800 transition-all shadow-2xs"
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Custom Date Range Picker (matches user screenshot) */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClear={() => {
                setStartDate("");
                setEndDate("");
              }}
            />

            {(searchKeyword || startDate || endDate) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3.5 py-2.5 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs"
              >
                Xóa lọc ✕
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-gray-100 dark:border-zinc-800 pt-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const count =
                tab.id === "ALL"
                  ? orders.length
                  : orders.filter((o) => matchesOrderStatus(o.orderStatus, tab.id)).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#195329] text-white shadow-xs"
                      : "bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white font-extrabold"
                        : "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Active Filter Summary */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Tìm thấy <strong>{filteredOrders.length}</strong> đơn hàng
            {searchKeyword ? ` cho "${searchKeyword}"` : ""}
            {startDate || endDate
              ? ` (${startDate === endDate ? `ngày ${startDate}` : `${startDate || "trước"} đến ${endDate || "nay"}`})`
              : ""}
          </span>

          {(activeTab !== "ALL" ||
            searchKeyword ||
            startDate ||
            endDate ||
            dateFilterPreset !== "all") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#195329] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Đặt lại tất cả bộ lọc ✕
            </button>
          )}
        </div>

        {/* 5. Orders List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
            <span className="inline-block w-6 h-6 border-2 border-[#195329] border-t-transparent rounded-full animate-spin mb-2"></span>
            <p>Đang tải danh sách đơn hàng từ hệ thống...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((ord: any) => {
              const statusInfo = getOrderStatusInfo(ord.orderStatus);
              const itemCount =
                ord.items?.reduce(
                  (sum: number, item: any) =>
                    sum + (Number(item.quantity) || 1),
                  0
                ) || ord.items?.length || 1;

              return (
                <div
                  key={ord.id || ord.orderCode}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs hover:border-emerald-300/80 dark:hover:border-emerald-800/80 hover:shadow-md transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm sm:text-base text-[#195329] dark:text-emerald-400">
                        #{ord.orderCode}
                      </span>
                      <span className="text-gray-300 dark:text-zinc-700">•</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Hôm nay"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status badge with animated dot */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.fullBadgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`}
                        ></span>
                        <span>{statusInfo.label}</span>
                      </span>

                      {/* Payment method badge */}
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {ord.paymentMethod || "COD"}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-2.5">
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.slice(0, 3).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                item.imageUrl ||
                                "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                              }
                              alt={item.productName || "Sản phẩm"}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-zinc-700 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                                {item.productName}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>{item.packWeight || "Khay 300g"}</span>
                                <span>•</span>
                                <span>SL: x{item.quantity || 1}</span>
                              </div>
                            </div>
                          </div>

                          <span className="font-bold text-gray-900 dark:text-white flex-shrink-0 ml-3">
                            {formatPrice(
                              item.subtotal ||
                                (Number(item.unitPrice) || 0) *
                                  (Number(item.quantity) || 1)
                            )}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">
                        1 giỏ hàng thực phẩm tươi sạch Ubofood
                      </p>
                    )}

                    {ord.items && ord.items.length > 3 && (
                      <p className="text-[11px] text-gray-400 font-semibold pt-0.5">
                        + và thêm {ord.items.length - 3} sản phẩm tươi sống khác
                      </p>
                    )}
                  </div>

                  {/* Card Footer with 3 Actions */}
                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-500">
                        Tổng thanh toán ({itemCount} món):
                      </span>
                      <span className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">
                        {formatPrice(ord.finalAmount || ord.totalAmount)}
                      </span>
                    </div>

                    {/* ACTION BUTTONS GROUP */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 1. NÚT HOÀN HÀNG */}
                      <button
                        type="button"
                        onClick={() => handleOpenReturnModal(ord)}
                        className="px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Yêu cầu trả hàng & hoàn tiền 100%"
                      >
                        <span>↩️</span>
                        <span>Hoàn hàng</span>
                      </button>

                      {/* 2. NÚT MUA LẠI */}
                      <button
                        type="button"
                        onClick={() => handleReorder(ord)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>🔄</span>
                        <span>Mua lại</span>
                      </button>

                      {/* 3. NÚT XEM CHI TIẾT */}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(ord)}
                        className="px-4 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <span>Xem chi tiết</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-10 sm:p-14 border border-gray-100 dark:border-zinc-800 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Không tìm thấy đơn hàng nào phù hợp
              </h3>
              <p className="text-xs text-gray-500">
                {searchKeyword
                  ? `Không có kết quả khớp với từ khóa "${searchKeyword}"`
                  : startDate || endDate
                  ? `Không có đơn hàng nào trong khoảng thời gian đã chọn.`
                  : activeTab !== "ALL"
                  ? "Không có đơn hàng nào ở trạng thái này."
                  : "Bạn chưa có đơn hàng nào tại Ubofood."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Xóa bộ lọc
              </button>
              <Link
                href="/products"
                className="px-4 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Đi chợ ngay →
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Detail Modal */}
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
