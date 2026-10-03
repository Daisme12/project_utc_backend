"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { adminService, AdminOrder, AdminProduct } from "@/services/adminService";
import DateRangePicker from "@/components/common/DateRangePicker";
import {
  ADMIN_ORDER_TABS,
  matchesOrderStatus,
  normalizeOrderStatus,
  getOrderStatusInfo,
} from "@/lib/orderStatus";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");

  // Selected Order for Detail / Print
  const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);
  const [printingOrder, setPrintingOrder] = useState<AdminOrder | null>(null);

  // Categories for POS filter
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [posSelectedCategory, setPosSelectedCategory] = useState<string>("ALL");
  const [posCashReceived, setPosCashReceived] = useState<number | "">("");
  const [posProductSort, setPosProductSort] = useState<
    "DEFAULT" | "PRICE_ASC" | "PRICE_DESC" | "STOCK_DESC" | "STOCK_ASC" | "NAME_AZ" | "NAME_ZA"
  >("DEFAULT");

  // Date Range Filters & Smart Priority Sort
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"PRIORITY" | "NEWEST" | "OLDEST" | "AMOUNT_DESC">("PRIORITY");

  // Pagination (Default 50 items per page, cho phép chọn 20, 50, 100, 200)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Create Order at Store (POS) Modal
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isPosModalFullscreen, setIsPosModalFullscreen] = useState(false);
  const [posProductSearch, setPosProductSearch] = useState("");
  const [posCart, setPosCart] = useState<{ product: AdminProduct; quantity: number }[]>([]);
  const [posCustomer, setPosCustomer] = useState({
    name: "Khách Mua Tại Quầy",
    phone: "0966666666",
    shippingAddress: "Mua trực tiếp tại quầy Ubofood Cầu Giấy",
    paymentMethod: "CASH",
    channel: "POS" as "POS" | "WEB",
    deliveryMethod: "TAKE_AWAY",
    note: "Bán trực tiếp tại quầy thu ngân",
    status: "COMPLETED" as AdminOrder["orderStatus"],
  });

  const loadData = async () => {
    setLoading(true);
    const [ordersRes, productsRes, catsRes] = await Promise.all([
      adminService.getOrders(),
      adminService.getProducts(),
      adminService.getCategories(),
    ]);
    setOrders(ordersRes.data);
    setProducts(productsRes.data);
    setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true" || params.get("pos") === "true") {
        setIsCreateOrderOpen(true);
      }
      if (params.get("status")) {
        setStatusFilter(params.get("status")!);
      }
      if (params.get("code")) {
        setSearchQuery(params.get("code")!);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPosModalFullscreen) {
        setIsPosModalFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPosModalFullscreen]);

  // Operational KPI Statistics for Urgent Prioritization
  const operationalStats = useMemo(() => {
    let pending = 0;
    let processing = 0;
    let delivering = 0;
    let completed = 0;
    let cancelled = 0;
    let todayRevenue = 0;

    orders.forEach((o) => {
      const canonical = normalizeOrderStatus(o.orderStatus);
      if (canonical === "PENDING") pending++;
      else if (canonical === "PROCESSING") processing++;
      else if (canonical === "DELIVERING") delivering++;
      else if (canonical === "COMPLETED") {
        completed++;
        todayRevenue += Number(o.finalAmount) || 0;
      } else if (canonical === "CANCELLED") cancelled++;
    });

    return {
      pending,
      processing,
      delivering,
      completed,
      cancelled,
      todayRevenue,
    };
  }, [orders]);

  // Reset page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, channelFilter, startDate, endDate, sortOrder, pageSize]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchSearch =
          o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.customerPhone && o.customerPhone.includes(searchQuery));
        const matchStatus = matchesOrderStatus(o.orderStatus, statusFilter);
        const matchChannel =
          channelFilter === "ALL" || o.channel === channelFilter;

        // Robust date & time parser for ISO string, Jackson array, or fallback
        const parseOrderTime = (item: AdminOrder) => {
          if (!item) return 0;
          if (typeof item.createdAt === "string") {
            const parsed = new Date(item.createdAt).getTime();
            if (!isNaN(parsed)) return parsed;
          } else if (Array.isArray(item.createdAt)) {
            const [y, m, d, h = 0, min = 0, s = 0] = item.createdAt as any;
            return new Date(y, m - 1, d, h, min, s).getTime();
          }
          return 0;
        };

        // Date Range Filter (sử dụng component DateRangePicker chuẩn)
        let matchDate = true;
        const itemTime = parseOrderTime(o);
        if (startDate) {
          const startTimestamp = new Date(`${startDate}T00:00:00`).getTime();
          matchDate = matchDate && itemTime >= startTimestamp;
        }
        if (endDate) {
          const endTimestamp = new Date(`${endDate}T23:59:59.999`).getTime();
          matchDate = matchDate && itemTime <= endTimestamp;
        }

        return matchSearch && matchStatus && matchChannel && matchDate;
      })
      .sort((a, b) => {
        const parseOrderTime = (item: AdminOrder) => {
          if (!item) return 0;
          if (typeof item.createdAt === "string") {
            const parsed = new Date(item.createdAt).getTime();
            if (!isNaN(parsed)) return parsed;
          } else if (Array.isArray(item.createdAt)) {
            const [y, m, d, h = 0, min = 0, s = 0] = item.createdAt as any;
            return new Date(y, m - 1, d, h, min, s).getTime();
          }
          return 0;
        };

        const tA = parseOrderTime(a);
        const tB = parseOrderTime(b);

        // Smart Priority Sort: Đơn PENDING (chờ duyệt) và PROCESSING (đang sơ chế) lên đầu!
        if (sortOrder === "PRIORITY") {
          const getRank = (status: string) => {
            const canonical = normalizeOrderStatus(status);
            switch (canonical) {
              case "PENDING":
                return 1; // Ưu tiên số 1: Đơn mới cần duyệt gấp!
              case "PROCESSING":
                return 2; // Ưu tiên số 2: Đang sơ chế lạnh, cần chuẩn bị & giao 2H
              case "DELIVERING":
                return 3; // Ưu tiên số 3: Đang trên đường giao
              case "COMPLETED":
                return 4; // Hoàn tất
              case "CANCELLED":
                return 5; // Đã hủy
              default:
                return 6;
            }
          };

          const rankA = getRank(a.orderStatus);
          const rankB = getRank(b.orderStatus);

          if (rankA !== rankB) {
            return rankA - rankB; // Rank nhỏ hơn lên đầu
          }

          // Cùng PENDING hoặc PROCESSING: đơn đặt trước xếp trước để kịp giao 2H
          if (rankA === 1 || rankA === 2) {
            return tA - tB;
          }

          // Mặc định: mới nhất lên đầu
          return tB - tA;
        }

        if (sortOrder === "NEWEST") {
          return tB - tA;
        }
        if (sortOrder === "OLDEST") {
          return tA - tB;
        }
        if (sortOrder === "AMOUNT_DESC") {
          return (Number(b.finalAmount) || 0) - (Number(a.finalAmount) || 0);
        }

        return tB - tA;
      });
  }, [orders, searchQuery, statusFilter, channelFilter, startDate, endDate, sortOrder]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // POS Product Filtering & Sorting (Hỗ trợ lọc category đa chiều và sắp xếp linh hoạt)
  const posFilteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const pCatId = (p as any).category?.id ?? (p as any).categoryId;
        const pCatSlug = (p as any).category?.slug ?? (p as any).categorySlug;
        const pCatName = (p as any).category?.name ?? (p as any).categoryName;

        const matchCat =
          posSelectedCategory === "ALL" ||
          String(pCatId) === String(posSelectedCategory) ||
          (pCatSlug && String(pCatSlug) === String(posSelectedCategory)) ||
          (pCatName && String(pCatName).toLowerCase() === String(posSelectedCategory).toLowerCase());

        const query = posProductSearch.toLowerCase().trim();
        const matchSearch =
          !query ||
          (p.name || "").toLowerCase().includes(query) ||
          (p.sku || "").toLowerCase().includes(query) ||
          (p.brand || "").toLowerCase().includes(query);

        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        const stockA = Number(a.stockQuantity) || 0;
        const stockB = Number(b.stockQuantity) || 0;

        if (posProductSort === "PRICE_ASC") return priceA - priceB;
        if (posProductSort === "PRICE_DESC") return priceB - priceA;
        if (posProductSort === "STOCK_DESC") return stockB - stockA;
        if (posProductSort === "STOCK_ASC") return stockA - stockB;
        if (posProductSort === "NAME_AZ") return (a.name || "").localeCompare(b.name || "", "vi");
        if (posProductSort === "NAME_ZA") return (b.name || "").localeCompare(a.name || "", "vi");
        // Mặc định: theo thứ tự ID mới nhất hoặc ưu tiên còn hàng
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
  }, [products, posSelectedCategory, posProductSearch, posProductSort]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await adminService.updateOrderStatus(id, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus as any } : o))
    );
    if (viewingOrder && viewingOrder.id === id) {
      setViewingOrder({ ...viewingOrder, orderStatus: newStatus as any });
    }
    toast.success(`Đã cập nhật trạng thái đơn sang "${newStatus}"`);
  };

  // 1-Click Quick Approve for PENDING orders
  const handleQuickApprove = async (order: AdminOrder) => {
    await adminService.updateOrderStatus(order.id, "PROCESSING");
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, orderStatus: "PROCESSING" } : o))
    );
    if (viewingOrder && viewingOrder.id === order.id) {
      setViewingOrder({ ...viewingOrder, orderStatus: "PROCESSING" });
    }
    toast.success(`⚡ Đã duyệt thành công đơn hàng #${order.orderCode}! Chuyển sang "Đang Xử Lý".`);
  };

  const handlePrint = async (order: AdminOrder) => {
    await adminService.markOrderAsPrinted(order.id);
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, isPrinted: true } : o))
    );
    setViewingOrder(null); // Đóng modal chi tiết nếu đang mở
    setPrintingOrder({ ...order, isPrinted: true });
  };

  // POS Actions
  const handleAddToCart = (product: AdminProduct) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: number, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: AdminProduct; quantity: number }[]
    );
  };

  const posTotalAmount = useMemo(() => {
    return posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [posCart]);

  const handleCreatePosOrder = async (shouldPrint: boolean) => {
    if (posCart.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm vào đơn hàng");
      return;
    }

    const orderCode = `UBO-POS-${Date.now().toString().slice(-4)}`;
    const items = posCart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      packWeight: item.product.packWeight || "Khay 300g",
      unit: item.product.unit || "Khay",
      quantity: item.quantity,
      unitPrice: item.product.price,
      subtotal: item.product.price * item.quantity,
      imageUrl: item.product.imageUrl,
    }));

    const newOrderPayload: Partial<AdminOrder> = {
      orderCode,
      channel: posCustomer.channel,
      customerName: posCustomer.name || "Khách lẻ tại quầy",
      customerPhone: posCustomer.phone || "0966666666",
      shippingAddress: posCustomer.shippingAddress,
      deliveryMethod: posCustomer.deliveryMethod,
      note: posCustomer.note,
      totalAmount: posTotalAmount,
      shippingFee: posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0,
      finalAmount: posTotalAmount + (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0),
      paymentMethod: posCustomer.paymentMethod,
      orderStatus: posCustomer.status,
      isPrinted: shouldPrint,
      createdAt: new Date().toISOString(),
      items,
      vouchers: [],
    };

    const res = await adminService.createOrder(newOrderPayload);
    setOrders((prev) => [res.data, ...prev]);
    toast.success(`Đã tạo thành công đơn hàng ${orderCode}!`);
    setIsCreateOrderOpen(false);
    setPosCart([]);

    if (shouldPrint) {
      handlePrint(res.data);
    }
  };

  const formatVnd = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const formatDate = (dateVal: any) => {
    try {
      if (!dateVal) return "";
      let d: Date;
      if (Array.isArray(dateVal)) {
        const [y, m, day, h = 0, min = 0, s = 0] = dateVal;
        d = new Date(y, m - 1, day, h, min, s);
      } else {
        d = new Date(dateVal);
      }
      if (isNaN(d.getTime())) return String(dateVal);
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${hours}:${minutes} ${day}-${month}`;
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quản Lý Đơn Hàng & Vận Hành 2H 📦
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Điều phối phê duyệt đơn hàng Web 2H, giám sát sơ chế thực phẩm mát và thanh toán quầy thu ngân.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a261f] transition-all shadow-xs cursor-pointer"
          >
            <span>🔄</span>
            <span>{loading ? "Đang đồng bộ..." : "Làm mới"}</span>
          </button>
          <button
            onClick={() => setIsCreateOrderOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>＋</span>
            <span>Tạo Đơn Nhanh (POS)</span>
          </button>
          <Link
            href="/admin/pos"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>🏪</span>
            <span>Mở Quầy POS ↗</span>
          </Link>
        </div>
      </div>

      {/* 4 Chỉ Số Vận Hành Ưu Tiên - Giúp Quản Trị Viên Biết Ngay Đơn Nào Cần Duyệt & Xử Lý */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Cần Duyệt Gấp (PENDING) */}
        <div
          onClick={() => setStatusFilter("PENDING")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            statusFilter === "PENDING"
              ? "bg-red-500/10 border-red-500 shadow-md ring-2 ring-red-400/50"
              : "bg-white dark:bg-[#121a15] border-gray-200/80 dark:border-[#1f2e25] hover:border-red-400 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              1. CẦN DUYỆT GẤP ⚡
            </span>
            <span className="text-xl">🚨</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-mono">
              {operationalStats.pending}
            </span>
            <span className="text-xs font-bold text-gray-500">đơn chờ phê duyệt</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
            {operationalStats.pending > 0
              ? "🔥 Có đơn khách đặt mới! Bấm để duyệt ngay"
              : "Đã duyệt hết, không có đơn chờ"}
          </p>
          {statusFilter === "PENDING" && (
            <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />
          )}
        </div>

        {/* Card 2: Đang Sơ Chế Lạnh (PROCESSING) */}
        <div
          onClick={() => setStatusFilter("PROCESSING")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            statusFilter === "PROCESSING"
              ? "bg-blue-500/10 border-blue-500 shadow-md ring-2 ring-blue-400/50"
              : "bg-white dark:bg-[#121a15] border-gray-200/80 dark:border-[#1f2e25] hover:border-blue-400 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              2. ĐANG SƠ CHẾ & ĐÓNG GÓI
            </span>
            <span className="text-xl">🥩</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {operationalStats.processing}
            </span>
            <span className="text-xs font-bold text-gray-500">đơn đang chuẩn bị</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
            Cắt thịt mát 0-4°C & đóng khay giao cam kết 2H
          </p>
          {statusFilter === "PROCESSING" && (
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500" />
          )}
        </div>

        {/* Card 3: Đang Giao Hỏa Tốc 2H (DELIVERING) */}
        <div
          onClick={() => setStatusFilter("DELIVERING")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            statusFilter === "DELIVERING"
              ? "bg-purple-500/10 border-purple-500 shadow-md ring-2 ring-purple-400/50"
              : "bg-white dark:bg-[#121a15] border-gray-200/80 dark:border-[#1f2e25] hover:border-purple-400 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              3. ĐANG GIAO HỎA TỐC 2H
            </span>
            <span className="text-xl">🚚</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {operationalStats.delivering}
            </span>
            <span className="text-xs font-bold text-gray-500">đơn trên đường</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
            Shipper đang vận chuyển trong thùng bảo ôn
          </p>
          {statusFilter === "DELIVERING" && (
            <div className="absolute top-0 right-0 w-2 h-full bg-purple-500" />
          )}
        </div>

        {/* Card 4: Hoàn Tất & Doanh Thu */}
        <div
          onClick={() => setStatusFilter("COMPLETED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            statusFilter === "COMPLETED"
              ? "bg-emerald-500/10 border-emerald-500 shadow-md ring-2 ring-emerald-400/50"
              : "bg-white dark:bg-[#121a15] border-gray-200/80 dark:border-[#1f2e25] hover:border-emerald-400 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              4. HOÀN TẤT & DOANH THU
            </span>
            <span className="text-xl">✅</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {operationalStats.completed}
            </span>
            <span className="text-xs font-bold text-gray-500">đơn thành công</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 line-clamp-1">
            Tổng: {formatVnd(operationalStats.todayRevenue)}
          </p>
          {statusFilter === "COMPLETED" && (
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
          )}
        </div>
      </div>

      {/* Cảnh Báo Khẩn Cấp Nếu Có Đơn Chờ Duyệt */}
      {operationalStats.pending > 0 && statusFilter !== "PENDING" && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-red-600/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🚨</span>
            <div>
              <p className="font-black text-sm">
                Cảnh báo vận hành: Có {operationalStats.pending} đơn hàng mới đang CHỜ DUYỆT!
              </p>
              <p className="text-xs text-red-100 mt-0.5">
                Đơn hàng online có cam kết giao trong 2 giờ. Cần phê duyệt ngay để bếp và kho lạnh cắt thịt!
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className="px-4 py-2 rounded-xl bg-white text-red-600 font-black text-xs hover:bg-red-50 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
          >
            Lọc & Duyệt Ngay ⚡
          </button>
        </div>
      )}

      {/* Bộ Lọc Hiện Đại (Có DateRangePicker & Sắp Xếp Ưu Tiên) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm space-y-4">
        {/* Status Tabs with Live Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-100 dark:border-[#1f2e25] scrollbar-none">
          {[
            { id: "ALL", label: "Tất Cả Đơn", count: orders.length, color: "gray" },
            { id: "PENDING", label: "🚨 Chờ Duyệt Gấp", count: operationalStats.pending, color: "red" },
            { id: "PROCESSING", label: "🥩 Đang Sơ Chế", count: operationalStats.processing, color: "blue" },
            { id: "DELIVERING", label: "🚚 Đang Giao 2H", count: operationalStats.delivering, color: "purple" },
            { id: "COMPLETED", label: "✅ Hoàn Thành", count: operationalStats.completed, color: "emerald" },
            { id: "CANCELLED", label: "✕ Đã Hủy", count: operationalStats.cancelled, color: "gray" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? tab.color === "red"
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-[#195329] text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f2e25]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? "bg-white/20 text-white"
                      : tab.color === "red" && tab.count > 0
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse"
                      : tab.color === "blue" && tab.count > 0
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, DateRangePicker, Channel, and Priority Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* 1. Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm theo mã đơn (#UBO-...), tên khách, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400 font-medium transition-all"
            />
            <span className="absolute left-3 top-3 text-gray-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* 2. DateRangePicker Component */}
          <div className="w-full lg:w-auto">
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
              placeholder="Lọc khoảng thời gian..."
              className="w-full lg:w-[260px]"
            />
          </div>

          {/* 3. Kênh Bán Hàng */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-xs py-2.5 px-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-700 dark:text-gray-300 focus:outline-none focus:border-emerald-500 font-bold cursor-pointer"
          >
            <option value="ALL">Mọi Kênh Bán Hàng</option>
            <option value="WEB">🌐 Kênh Online (Giao 2H)</option>
            <option value="POS">🏪 Kênh POS (Quầy Thu Ngân)</option>
          </select>

          {/* 4. Sắp Xếp Thông Minh (Mặc định: Ưu tiên đơn cần xử lý!) */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs py-2.5 px-3 rounded-xl border border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="PRIORITY">⚡ Ưu Tiên Cần Xử Lý</option>
            <option value="NEWEST">⏱️ Mới Nhất Trước</option>
            <option value="OLDEST">⏳ Cũ Nhất Trước</option>
            <option value="AMOUNT_DESC">💰 Tổng Tiền Cao Nhất</option>
          </select>

          {/* 5. Nút Xóa Lọc */}
          {(searchQuery || startDate || endDate || channelFilter !== "ALL" || statusFilter !== "ALL" || sortOrder !== "PRIORITY") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStartDate("");
                setEndDate("");
                setChannelFilter("ALL");
                setStatusFilter("ALL");
                setSortOrder("PRIORITY");
              }}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-1 whitespace-nowrap cursor-pointer"
            >
              Đặt lại ✕
            </button>
          )}
        </div>
      </div>

      {/* Orders Table với Đánh Dấu Ưu Tiên Rõ Rệt */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm overflow-hidden space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Tìm thấy <strong>{filteredOrders.length}</strong> đơn hàng
            {sortOrder === "PRIORITY" && (
              <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">
                (Đang xếp theo: ⚡ Ưu tiên đơn Chờ Duyệt & Đang Sơ Chế lên đầu)
              </span>
            )}
          </span>
          <span className="text-[11px] text-gray-400">Trang {currentPage} / {totalPages}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1f2e25] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Mã Đơn / Thời Gian</th>
                <th className="py-3 px-3">Khách Hàng & Địa Chỉ</th>
                <th className="py-3 px-3">Kênh / Giao Hàng</th>
                <th className="py-3 px-3">Tổng Tiền</th>
                <th className="py-3 px-3">Thanh Toán</th>
                <th className="py-3 px-3">Trạng Thái & Hành Động</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f2e25]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <span className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Đang tải dữ liệu đơn hàng Ubofood...</p>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => {
                  const canonicalStatus = normalizeOrderStatus(o.orderStatus);
                  const isPending = canonicalStatus === "PENDING";
                  const isProcessing = canonicalStatus === "PROCESSING";
                  const isDelivering = canonicalStatus === "DELIVERING";
                  const isCompleted = canonicalStatus === "COMPLETED";

                  return (
                    <tr
                      key={o.id}
                      className={`transition-colors ${
                        isPending
                          ? "bg-red-50/50 dark:bg-red-950/25 hover:bg-red-100/50 border-l-4 border-l-red-500"
                          : isProcessing
                          ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-100/40 border-l-4 border-l-blue-500"
                          : isDelivering
                          ? "bg-purple-50/25 dark:bg-purple-950/15 hover:bg-purple-100/30 border-l-4 border-l-purple-500"
                          : isCompleted
                          ? "border-l-4 border-l-emerald-500/60 hover:bg-gray-50/60 dark:hover:bg-[#1a261f]/50"
                          : "border-l-4 border-l-gray-300 dark:border-l-gray-700 opacity-70 hover:bg-gray-50/50"
                      }`}
                    >
                      {/* 1. Mã đơn & Thời gian */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-black text-sm text-gray-900 dark:text-white">
                            {o.orderCode}
                          </span>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-xs animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              CẦN DUYỆT GẤP ⚡
                            </span>
                          )}
                          {isProcessing && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                              🥩 ĐANG SƠ CHẾ (2H)
                            </span>
                          )}
                          {isDelivering && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                              🚚 ĐANG GIAO HÀNG
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <span>⏱️ {formatDate(o.createdAt)}</span>
                          {o.isPrinted && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500">
                              Đã in HĐ
                            </span>
                          )}
                        </p>
                      </td>

                      {/* 2. Khách hàng & Địa chỉ */}
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                          {o.customerName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">{o.customerPhone || "Khách tại quầy"}</p>
                        {o.shippingAddress && (
                          <p className="text-[10px] text-gray-500 line-clamp-1 max-w-xs mt-0.5" title={o.shippingAddress}>
                            📍 {o.shippingAddress}
                          </p>
                        )}
                        {o.note && (
                          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium line-clamp-1 max-w-xs mt-0.5">
                            📝 {o.note}
                          </p>
                        )}
                      </td>

                      {/* 3. Kênh & Giao hàng */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.channel === "WEB"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                          }`}
                        >
                          {o.channel}
                        </span>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-1 font-semibold">
                          {o.deliveryMethod === "FAST_2H" ? "⚡ Giao 2H" : o.deliveryMethod || "Tại quầy"}
                        </p>
                      </td>

                      {/* 4. Tổng tiền */}
                      <td className="py-3.5 px-3">
                        <p className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                          {formatVnd(o.finalAmount)}
                        </p>
                        {o.vouchers && o.vouchers.length > 0 && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                            Giảm voucher
                          </span>
                        )}
                      </td>

                      {/* 5. Thanh toán */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-gray-800 dark:text-gray-200 block text-xs">
                          {o.paymentMethod}
                        </span>
                        {canonicalStatus === "CANCELLED" ? (
                          <span className="block text-[10px] text-gray-400 font-medium">Đã hủy</span>
                        ) : o.paymentMethod === "COD" && (isPending || isProcessing) ? (
                          <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-bold">Thu COD khi giao</span>
                        ) : (
                          <span className="block text-[10px] text-emerald-600 font-bold">Đã thanh toán</span>
                        )}
                      </td>

                      {/* 6. Trạng thái & Hành động ưu tiên */}
                      <td className="py-3.5 px-3">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuickApprove(o)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-pulse whitespace-nowrap"
                              title="Duyệt đơn ngay để chuyển sang khâu sơ chế!"
                            >
                              <span>⚡</span>
                              <span>Duyệt Ngay</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(o.id, "CANCELLED")}
                              className="text-xs text-gray-400 hover:text-red-600 font-bold px-1.5 py-1 rounded hover:bg-red-50 transition-colors"
                              title="Hủy đơn này"
                            >
                              ✕
                            </button>
                          </div>
                        ) : isProcessing ? (
                          <div className="flex flex-col gap-1 min-w-[130px]">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(o.id, "DELIVERING")}
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all hover:scale-102 active:scale-95 cursor-pointer whitespace-nowrap"
                              title="Sơ chế xong -> Bắt đầu giao hàng 2H"
                            >
                              <span>🚚</span>
                              <span>Giao Hàng 2H</span>
                            </button>
                            <select
                              value={canonicalStatus}
                              onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                              className="text-[11px] font-bold py-0.5 px-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 focus:outline-none cursor-pointer"
                            >
                              <option value="PROCESSING">Đang Xử Lý</option>
                              <option value="DELIVERING">Đang Giao 2H</option>
                              <option value="COMPLETED">Hoàn Thành</option>
                              <option value="CANCELLED">Hủy Đơn</option>
                            </select>
                          </div>
                        ) : isDelivering ? (
                          <div className="flex flex-col gap-1 min-w-[130px]">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(o.id, "COMPLETED")}
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all hover:scale-102 active:scale-95 cursor-pointer whitespace-nowrap"
                              title="Khách đã nhận -> Hoàn tất đơn"
                            >
                              <span>✅</span>
                              <span>Hoàn Tất Đơn</span>
                            </button>
                            <select
                              value={canonicalStatus}
                              onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                              className="text-[11px] font-bold py-0.5 px-1.5 rounded-lg border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 focus:outline-none cursor-pointer"
                            >
                              <option value="DELIVERING">Đang Giao 2H</option>
                              <option value="COMPLETED">Hoàn Thành</option>
                              <option value="PROCESSING">Quay lại sơ chế</option>
                              <option value="CANCELLED">Hủy Đơn</option>
                            </select>
                          </div>
                        ) : (
                          <select
                            value={canonicalStatus}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                            className={`text-xs font-bold py-1 px-2.5 rounded-full border-none focus:outline-none cursor-pointer ${
                              getOrderStatusInfo(o.orderStatus, "admin").fullBadgeClass
                            }`}
                          >
                            <option value="PENDING">Chờ Duyệt</option>
                            <option value="PROCESSING">Đang Xử Lý</option>
                            <option value="DELIVERING">Đang Giao 2H</option>
                            <option value="COMPLETED">Hoàn Thành</option>
                            <option value="CANCELLED">Hủy Đơn</option>
                          </select>
                        )}
                      </td>

                      {/* 7. Thao tác */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingOrder(o)}
                            className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2c4033] font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Chi Tiết
                          </button>
                          <button
                            onClick={() => handlePrint(o)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            🖨️ In
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar (Cho chọn 50, 100, 200...) */}
        <div className="pt-4 mt-3 border-t border-gray-100 dark:border-[#1f2e25] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-3 text-gray-500">
            <span>
              Hiển thị{" "}
              <strong className="text-gray-900 dark:text-white">
                {filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-gray-900 dark:text-white">
                {Math.min(currentPage * pageSize, filteredOrders.length)}
              </strong>{" "}
              trong{" "}
              <strong className="text-gray-900 dark:text-white">{filteredOrders.length}</strong> đơn hàng
            </span>

            <div className="flex items-center gap-1.5">
              <span>| Số đơn/trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] font-semibold hover:bg-gray-100 dark:hover:bg-[#1f2e25] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Trang đầu"
            >
              « Đầu
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] font-semibold hover:bg-gray-100 dark:hover:bg-[#1f2e25] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹ Trước
            </button>
            <span className="px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] font-semibold hover:bg-gray-100 dark:hover:bg-[#1f2e25] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tiếp ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] font-semibold hover:bg-gray-100 dark:hover:bg-[#1f2e25] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Trang cuối"
            >
              Cuối »
            </button>
          </div>
        </div>
      </div>

      {/* POS In-Store Order Creation Modal (Enlarged & Spacious) */}
      {isCreateOrderOpen && (
        <div
          className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center overflow-hidden transition-all duration-200 ${
            isPosModalFullscreen ? "p-0" : "p-2 sm:p-4"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateOrderOpen(false);
          }}
        >
          <div
            className={`bg-white dark:bg-[#121a15] border border-gray-200 dark:border-[#1f2e25] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              isPosModalFullscreen
                ? "w-screen h-screen max-w-none max-h-none rounded-none p-2 sm:p-3"
                : "w-[98vw] max-w-[1520px] h-[95vh] max-h-[960px] rounded-3xl"
            }`}
          >
            {/* Modal Header: Ẩn đi khi Full màn để "CHỈ HIỆN BÊN TRONG NÀY THÔI" */}
            {!isPosModalFullscreen && (
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 dark:border-[#1f2e25] bg-gray-50/50 dark:bg-[#16201a]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/30">
                    🏪
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <span>Tạo Đơn Hàng Điểm Bán / Quầy Thu Ngân POS</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Ubofood Store
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Chọn nhanh thực phẩm mát, lên giỏ hàng và xuất hóa đơn nhiệt trực tiếp tại điểm bán
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPosModalFullscreen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Toàn màn hình - Chỉ hiện quầy thu ngân bên trong"
                  >
                    <span>⛶</span>
                    <span>Full màn</span>
                  </button>
                  <Link
                    href="/admin/pos"
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-800/60"
                    title="Mở toàn màn hình trong trang riêng"
                  >
                    <span>↗</span>
                    <span>Mở trang riêng</span>
                  </Link>
                  <button
                    onClick={() => setIsCreateOrderOpen(false)}
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2c4033] flex items-center justify-center text-gray-500 font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body - 2 Columns (50% Sản phẩm / 50% Thanh Toán To Rõ) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* Product Catalog Picker (Left 6 Cols) */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col p-4 sm:p-5 border-r border-gray-100 dark:border-[#1f2e25] overflow-hidden space-y-3.5">
                {/* Search Bar & Prominent Sort Dropdown Side-by-Side */}
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Tìm theo tên thịt mát, mã SKU (ba chỉ, sườn non...)"
                      value={posProductSearch}
                      onChange={(e) => setPosProductSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    {posProductSearch && (
                      <button
                        onClick={() => setPosProductSearch("")}
                        className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Sắp xếp - Luôn cố định, hiển thị rõ ràng */}
                  <div className="shrink-0">
                    <select
                      id="pos-sort-selector"
                      value={posProductSort}
                      onChange={(e) => setPosProductSort(e.target.value as any)}
                      className="px-3 py-2.5 text-xs font-bold rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-[#1a261f] text-emerald-800 dark:text-emerald-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      title="Sắp xếp sản phẩm"
                    >
                      <option value="DEFAULT">⚡ Sắp xếp: Mặc định</option>
                      <option value="PRICE_ASC">💰 Giá: Thấp → Cao</option>
                      <option value="PRICE_DESC">💎 Giá: Cao → Thấp</option>
                      <option value="STOCK_DESC">📦 Tồn kho: Nhiều nhất</option>
                      <option value="STOCK_ASC">⚠️ Tồn kho: Sắp hết</option>
                      <option value="NAME_AZ">🔤 Tên: A → Z</option>
                      <option value="NAME_ZA">🔤 Tên: Z → A</option>
                    </select>
                  </div>

                  {/* Nút Full màn trực tiếp bên trong toolbar */}
                  <button
                    type="button"
                    onClick={() => setIsPosModalFullscreen(!isPosModalFullscreen)}
                    className={`px-3 py-2.5 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-95 ${
                      isPosModalFullscreen
                        ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                        : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                    }`}
                    title={isPosModalFullscreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình - Chỉ hiện bên trong này"}
                  >
                    <span className="text-sm">{isPosModalFullscreen ? "🗗" : "⛶"}</span>
                    <span>{isPosModalFullscreen ? "Thu nhỏ" : "Full màn"}</span>
                  </button>
                </div>

                {/* Category Pills Strip - Cuộn ngang độc lập, không làm trôi nút sort */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setPosSelectedCategory("ALL")}
                    className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                      posSelectedCategory === "ALL"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-[#1a261f] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả ({products.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPosSelectedCategory(c.id.toString())}
                      className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                        posSelectedCategory === c.id.toString()
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-gray-100 dark:bg-[#1a261f] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {posFilteredProducts.map((p) => {
                      const inCart = posCart.find((it) => it.product.id === p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleAddToCart(p)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group hover:shadow-md ${
                            inCart
                              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                              : "border-gray-200/80 dark:border-[#1f2e25] bg-white dark:bg-[#1a261f] hover:border-emerald-400"
                          }`}
                        >
                          {inCart && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                              {inCart.quantity}
                            </span>
                          )}
                          <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {p.imageUrl ? (
                              <Image
                                src={p.imageUrl}
                                alt={p.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="200px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">🥩</div>
                            )}
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
                              Còn {p.stockQuantity}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-xs line-clamp-2 text-gray-900 dark:text-white leading-tight min-h-[32px]">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{p.packWeight}</p>
                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 dark:border-[#2b3d32]">
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                {formatVnd(p.price)}
                              </span>
                              <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                +
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cart & Payment Panel (Right 6 Cols - TO RỘNG 50% & CỐ ĐỊNH NÚT BẤM) */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col h-full bg-gray-50/90 dark:bg-[#152019] overflow-hidden">
                {/* Phần cuộn: Giỏ hàng, Thông tin khách, Máy tính tiền khách đưa */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Cart Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-200 dark:border-[#2b3d32]">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-gray-900 dark:text-white tracking-wide">
                        GIỎ HÀNG QUẦY
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {posCart.reduce((sum, it) => sum + it.quantity, 0)} món
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {posCart.length > 0 && (
                        <button
                          onClick={() => setPosCart([])}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          Xóa tất cả
                        </button>
                      )}
                      {isPosModalFullscreen && (
                        <button
                          type="button"
                          onClick={() => setIsPosModalFullscreen(false)}
                          className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Thoát full màn (Esc)"
                        >
                          <span>🗗</span>
                          <span>Thoát</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {posCart.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-xs">
                        <span className="text-3xl block mb-2">🛒</span>
                        Chưa chọn sản phẩm nào.<br />Bấm vào các mặt hàng bên trái để thêm!
                      </div>
                    ) : (
                      posCart.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#1a261f] border border-gray-200/80 dark:border-[#2b3d32] flex items-center justify-between gap-2 shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              {formatVnd(item.product.price)} x {item.quantity} = {formatVnd(item.product.price * item.quantity)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.product.id, -1)}
                              className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#2b3d32] font-bold flex items-center justify-center text-xs hover:bg-gray-200 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-black text-xs min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.product.id, 1)}
                              className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs hover:bg-emerald-700 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-3.5 pt-3.5 border-t border-gray-200 dark:border-[#2b3d32]">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tên Khách Hàng</label>
                        <input
                          type="text"
                          value={posCustomer.name}
                          onChange={(e) => setPosCustomer({ ...posCustomer, name: e.target.value })}
                          className="w-full px-3.5 py-3 text-sm font-semibold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
                          placeholder="Khách lẻ tại quầy"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Số Điện Thoại</label>
                        <input
                          type="text"
                          value={posCustomer.phone}
                          onChange={(e) => setPosCustomer({ ...posCustomer, phone: e.target.value })}
                          className="w-full px-3.5 py-3 text-sm font-semibold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
                          placeholder="SĐT tích điểm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Hình Thức Thanh Toán</label>
                        <select
                          value={posCustomer.paymentMethod}
                          onChange={(e) => setPosCustomer({ ...posCustomer, paymentMethod: e.target.value })}
                          className="w-full px-3.5 py-3 text-sm font-bold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
                        >
                          <option value="CASH">💵 Tiền mặt (CASH)</option>
                          <option value="VNPAY">📱 Quét QR VNPAY</option>
                          <option value="CARD">💳 Quẹt thẻ ngân hàng</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Kênh / Giao Hàng</label>
                        <select
                          value={posCustomer.deliveryMethod}
                          onChange={(e) => setPosCustomer({ ...posCustomer, deliveryMethod: e.target.value })}
                          className="w-full px-3.5 py-3 text-sm font-bold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-sm"
                        >
                          <option value="TAKE_AWAY">🛍️ Mang về (Tại quầy)</option>
                          <option value="FAST_2H">⚡ Giao hỏa tốc 2H (+25k)</option>
                        </select>
                      </div>
                    </div>

                    {/* Cash Tender & Change Return Calculator */}
                    {posCustomer.paymentMethod === "CASH" && (
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/80 space-y-2.5 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
                            Tiền Khách Đưa (VNĐ):
                          </label>
                          <div className="flex gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setPosCashReceived(posTotalAmount + (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0))}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-sm cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                            >
                              Đúng tiền
                            </button>
                            <button
                              type="button"
                              onClick={() => setPosCashReceived(100000)}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-sm cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                            >
                              100k
                            </button>
                            <button
                              type="button"
                              onClick={() => setPosCashReceived(200000)}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-sm cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                            >
                              200k
                            </button>
                            <button
                              type="button"
                              onClick={() => setPosCashReceived(500000)}
                              className="px-3 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-sm cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                            >
                              500k
                            </button>
                          </div>
                        </div>
                        <input
                          type="number"
                          placeholder="Nhập số tiền khách đưa..."
                          value={posCashReceived}
                          onChange={(e) => setPosCashReceived(e.target.value ? Number(e.target.value) : "")}
                          className="w-full px-4 py-3.5 text-base sm:text-lg font-black rounded-xl border-2 border-amber-400 dark:border-amber-700 bg-white dark:bg-[#121a15] text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm transition-all"
                        />
                        {typeof posCashReceived === "number" && posCashReceived > 0 && (
                          <div className="flex justify-between items-center text-xs sm:text-sm font-bold pt-1.5 border-t border-amber-200/80 dark:border-amber-900/40">
                            <span className="text-gray-700 dark:text-gray-300">Tiền thối lại khách:</span>
                            <span className={`text-lg sm:text-xl font-black ${
                              posCashReceived - (posTotalAmount + (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0)) >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600"
                            }`}>
                              {formatVnd(posCashReceived - (posTotalAmount + (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0)))}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thanh Toán & Nút Bấm - CỐ ĐỊNH Ở ĐÁY, LUÔN HIỂN THỊ RÕ RÀNG, DỄ BẤM */}
                <div className="p-4 sm:p-5 bg-white dark:bg-[#121a15] border-t-2 border-emerald-500/20 dark:border-[#2b3d32] shadow-[0_-8px_25px_rgba(0,0,0,0.08)] shrink-0 space-y-3 z-10">
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Tạm tính tiền hàng:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{formatVnd(posTotalAmount)}</span>
                    </div>
                    {posCustomer.deliveryMethod === "FAST_2H" && (
                      <div className="flex justify-between text-gray-500">
                        <span>Phí giao hàng 2H:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+ 25.000 đ</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-[#2b3d32]">
                      <span className="font-black text-gray-900 dark:text-white text-sm sm:text-base tracking-wide">
                        TỔNG THANH TOÁN:
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatVnd(posTotalAmount + (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0))}
                      </span>
                    </div>
                  </div>

                  {/* 2 Nút Hành Động To, Dày, Nổi Bật, Dễ Nhấn */}
                  <div className="grid grid-cols-2 gap-3.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCreatePosOrder(false)}
                      className="py-3.5 sm:py-4 px-4 rounded-2xl border-2 border-emerald-600 text-emerald-700 dark:text-emerald-300 font-black text-xs sm:text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">💾</span>
                      <span>Lưu Đơn Quầy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreatePosOrder(true)}
                      className="py-3.5 sm:py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">🖨️</span>
                      <span>Hoàn Tất & In HĐ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingOrder(null);
          }}
        >
          <div className="w-full max-w-3xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1f2e25] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                      Chi Tiết Đơn Hàng #{viewingOrder.orderCode}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        getOrderStatusInfo(viewingOrder.orderStatus, "admin").fullBadgeClass
                      }`}
                    >
                      {getOrderStatusInfo(viewingOrder.orderStatus, "admin").adminLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Thời gian đặt: {formatDate(viewingOrder.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1f2e25] hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Progress Stepper in Admin Detail Modal */}
            {normalizeOrderStatus(viewingOrder.orderStatus) !== "CANCELLED" && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#195329] dark:text-emerald-300">
                    Tiến độ xử lý đơn hàng
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">
                    Trạng thái: {getOrderStatusInfo(viewingOrder.orderStatus, "admin").adminLabel}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                  {[
                    { step: 1, title: "Đã đặt hàng", icon: "📝" },
                    { step: 2, title: "Sơ chế lạnh", icon: "🥩" },
                    { step: 3, title: "Đang giao 2H", icon: "🚚" },
                    { step: 4, title: "Hoàn tất", icon: "✅" },
                  ].map((s) => {
                    const currentStep = getOrderStatusInfo(viewingOrder.orderStatus).step;
                    const isDone = currentStep >= s.step;
                    const isCurrent = currentStep === s.step;
                    return (
                      <div key={s.step} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                            isDone
                              ? "bg-[#195329] text-white shadow-xs"
                              : "bg-gray-200 dark:bg-zinc-800 text-gray-400"
                          } ${isCurrent ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}
                        >
                          {isDone ? s.icon : s.step}
                        </div>
                        <span
                          className={`font-semibold text-[11px] leading-tight ${
                            isDone
                              ? "text-[#195329] dark:text-emerald-300"
                              : "text-gray-400"
                          }`}
                        >
                          {s.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer & Delivery Info - 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#1a261f] border border-gray-100 dark:border-[#2b3d32] text-xs sm:text-sm">
              <div className="space-y-1.5">
                <p>
                  <strong className="text-gray-500 block text-[11px] uppercase">Khách hàng</strong>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {viewingOrder.customerName} ({viewingOrder.customerPhone || "Khách tại quầy"})
                  </span>
                </p>
                <p>
                  <strong className="text-gray-500 block text-[11px] uppercase">Kênh mua hàng</strong>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {viewingOrder.channel === "POS" ? "🏪 Tại quầy thu ngân" : "🌐 Website đặt hàng online"}
                  </span>
                </p>
              </div>
              <div className="space-y-1.5">
                <p>
                  <strong className="text-gray-500 block text-[11px] uppercase">Địa chỉ giao hàng</strong>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {viewingOrder.shippingAddress || "Mua mang về trực tiếp"}
                  </span>
                </p>
                {viewingOrder.note && (
                  <p className="text-amber-700 dark:text-amber-400">
                    <strong className="text-gray-500 block text-[11px] uppercase">Ghi chú</strong>
                    <span>{viewingOrder.note}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Danh Sách Mặt Hàng</h4>
              <div className="divide-y divide-gray-100 dark:divide-[#1f2e25] border border-gray-100 dark:border-[#1f2e25] rounded-2xl overflow-hidden max-h-[260px] overflow-y-auto">
                {viewingOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs sm:text-sm bg-white dark:bg-[#121a15]">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{item.productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.packWeight} • Đơn giá: {formatVnd(item.unitPrice)} • SL: {item.quantity} {item.unit}</p>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white text-sm">
                      {formatVnd(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vouchers applied */}
            {viewingOrder.vouchers && viewingOrder.vouchers.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs sm:text-sm space-y-1">
                <span className="font-bold text-red-700 dark:text-red-300">🎟️ Voucher Đã Áp Dụng:</span>
                {viewingOrder.vouchers.map((v, i) => (
                  <div key={i} className="flex justify-between text-red-600 dark:text-red-400 font-bold">
                    <span>Mã {v.voucherCode}</span>
                    <span>-{formatVnd(v.discountAmount)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Summary */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100 dark:border-[#1f2e25] text-xs sm:text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Tổng tiền hàng:</span>
                <span className="font-bold">{formatVnd(viewingOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển:</span>
                <span className="font-bold">{formatVnd(viewingOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 pt-1 border-t border-gray-100 dark:border-[#1f2e25]">
                <span>Thanh toán thực tế:</span>
                <span>{formatVnd(viewingOrder.finalAmount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-[#1f2e25]">
              <div className="flex flex-wrap items-center gap-2.5">
                {viewingOrder.orderStatus === "PENDING" && (
                  <button
                    onClick={() => handleQuickApprove(viewingOrder)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>⚡</span>
                    <span>Duyệt Đơn Này</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a261f] px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2b3d32]">
                  <span className="text-[11px] font-bold text-gray-500">Đổi trạng thái:</span>
                  <select
                    value={normalizeOrderStatus(viewingOrder.orderStatus)}
                    onChange={(e) => handleUpdateStatus(viewingOrder.id, e.target.value)}
                    className="text-xs font-bold bg-transparent text-gray-800 dark:text-gray-200 border-none focus:outline-none cursor-pointer"
                  >
                    <option value="PENDING">Chờ Duyệt</option>
                    <option value="PROCESSING">Đang Xử Lý</option>
                    <option value="DELIVERING">Đang Giao 2H</option>
                    <option value="COMPLETED">Hoàn Thành</option>
                    <option value="CANCELLED">Hủy Đơn</option>
                  </select>
                </div>

                <button
                  onClick={() => handlePrint(viewingOrder)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>🖨️</span>
                  <span>In Hóa Đơn Bán Hàng</span>
                </button>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2b3d32] text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f2e25] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Print Preview Modal */}
      {printingOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPrintingOrder(null);
          }}
        >
          <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl p-6 space-y-4 font-mono text-xs my-8 border border-gray-200">
            {/* Header */}
            <div className="text-center space-y-1 border-b pb-4">
              <h2 className="text-lg font-black tracking-tight">HỆ THỐNG THỰC PHẨM UBOFOOD</h2>
              <p className="text-[11px] text-gray-600">Thịt Tươi Mổ Lạnh 0 - 4°C Chuẩn Châu Âu</p>
              <p className="text-[10px] text-gray-500">Cửa hàng: Số 3 Cầu Giấy, Láng Thượng, Đống Đa, Hà Nội</p>
              <p className="text-[10px] text-gray-500">Hotline: 024.3888.999 • www.ubofood.vn</p>
            </div>

            {/* Invoice Meta */}
            <div className="space-y-1 text-[11px] border-b pb-3">
              <div className="flex justify-between">
                <span>Số HĐ: <strong>{printingOrder.orderCode}</strong></span>
                <span>Kênh: <strong>{printingOrder.channel}</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Ngày in: {new Date().toLocaleString("vi-VN")}</span>
              </div>
              <div>
                <span>Khách hàng: <strong>{printingOrder.customerName}</strong> ({printingOrder.customerPhone})</span>
              </div>
              {printingOrder.shippingAddress && (
                <div className="text-[10px] text-gray-600">
                  Địa chỉ: {printingOrder.shippingAddress}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 border-b pb-3">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-1">Mặt hàng</th>
                    <th className="pb-1 text-center">SL</th>
                    <th className="pb-1 text-right">T.Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                  {printingOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1">
                        <div className="font-bold">{it.productName}</div>
                        <div className="text-[10px] text-gray-500">{it.packWeight} • {formatVnd(it.unitPrice)}</div>
                      </td>
                      <td className="py-1 text-center font-bold">{it.quantity}</td>
                      <td className="py-1 text-right font-bold">{formatVnd(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-1 text-[11px] border-b pb-3">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span>{formatVnd(printingOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{formatVnd(printingOrder.shippingFee)}</span>
              </div>
              {printingOrder.vouchers?.map((v, i) => (
                <div key={i} className="flex justify-between text-red-600">
                  <span>Voucher {v.voucherCode}:</span>
                  <span>-{formatVnd(v.discountAmount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-black pt-1 border-t">
                <span>TỔNG CỘNG:</span>
                <span>{formatVnd(printingOrder.finalAmount)}</span>
              </div>
            </div>

            {/* Barcode / Thank you */}
            <div className="text-center pt-2 space-y-1">
              <p className="text-[11px] font-bold">Cảm ơn quý khách đã mua sắm tại Ubofood!</p>
              <p className="text-[10px] text-gray-500">Quét mã QR để theo dõi hành trình giao hàng hỏa tốc 2h</p>
              <div className="h-8 bg-gray-100 flex items-center justify-center tracking-[6px] font-bold text-gray-700 text-xs rounded">
                |||| | ||||| |||| |||
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                In Ngay (Print)
              </button>
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
