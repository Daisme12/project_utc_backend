"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  adminService,
  AdminOrder,
  AdminProduct,
  AdminCategory,
} from "@/services/adminService";

export default function AdminPosPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fullscreen state: Khi bật full màn, CHỈ HIỆN BÊN TRONG KHUNG NÀY THÔI (tràn viền toàn màn hình)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search & Filter state
  const [posProductSearch, setPosProductSearch] = useState("");
  const [posProductSort, setPosProductSort] = useState<
    | "DEFAULT"
    | "PRICE_ASC"
    | "PRICE_DESC"
    | "STOCK_DESC"
    | "STOCK_ASC"
    | "NAME_AZ"
    | "NAME_ZA"
  >("DEFAULT");
  const [posSelectedCategory, setPosSelectedCategory] = useState<string>("ALL");

  // Cart state
  const [posCart, setPosCart] = useState<
    { product: AdminProduct; quantity: number }[]
  >([]);

  // Customer info & tender
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
  const [posCashReceived, setPosCashReceived] = useState<number | "">("");

  // Receipt printing modal
  const [printingOrder, setPrintingOrder] = useState<AdminOrder | null>(null);

  // Load products & categories
  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, catsRes] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
      ]);
      setProducts(productsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu POS:", err);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Quầy Thu Ngân POS | Ubofood";
    loadData();
  }, []);

  // Fullscreen Toggle Handler (Hỗ trợ cả CSS Fullscreen Overlay & Native Browser Fullscreen)
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {}
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {}
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  // Filter & Sort Products
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
          (pCatName &&
            String(pCatName).toLowerCase() ===
              String(posSelectedCategory).toLowerCase());

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
        if (posProductSort === "NAME_AZ")
          return (a.name || "").localeCompare(b.name || "", "vi");
        if (posProductSort === "NAME_ZA")
          return (b.name || "").localeCompare(a.name || "", "vi");
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
  }, [products, posSelectedCategory, posProductSearch, posProductSort]);

  // Cart operations
  const handleAddToCart = (product: AdminProduct) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
    return posCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
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
      finalAmount:
        posTotalAmount + (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0),
      paymentMethod: posCustomer.paymentMethod,
      orderStatus: posCustomer.status,
      isPrinted: shouldPrint,
      createdAt: new Date().toISOString(),
      items,
      vouchers: [],
    };

    try {
      const res = await adminService.createOrder(newOrderPayload);
      toast.success(`Đã tạo thành công đơn hàng ${orderCode}!`);
      setPosCart([]);
      setPosCashReceived("");

      if (shouldPrint) {
        setPrintingOrder({ ...res.data, isPrinted: true });
        await adminService.markOrderAsPrinted(res.data.id);
      }
    } catch (err) {
      console.error("Lỗi tạo đơn POS:", err);
      toast.error("Không thể tạo đơn hàng POS");
    }
  };

  const formatVnd = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-[#f8faf9] dark:bg-[#0c120e] p-2 sm:p-3 w-screen h-screen flex flex-col overflow-hidden"
          : "space-y-3"
      }`}
    >
      {/* Khi KHÔNG Full màn: Thanh điều hướng gọn gàng */}
      {!isFullscreen && (
        <div className="flex items-center justify-between gap-3 px-1 py-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders"
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#121a15] text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>←</span>
              <span>Quản lý đơn hàng</span>
            </Link>
            <span className="text-xs font-bold text-gray-400">/</span>
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-400">
              Quầy Thu Ngân Điểm Bán POS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
              title="Mở toàn màn hình (chỉ hiện quầy thu ngân)"
            >
              <span className="text-sm">⛶</span>
              <span>Full màn</span>
            </button>
            <button
              type="button"
              onClick={loadData}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#121a15] text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 transition-all shadow-2xs"
              title="Đồng bộ sản phẩm"
            >
              🔄
            </button>
          </div>
        </div>
      )}

      {/* Main POS Interface (2 Columns Workspace: CHỈ HIỆN BÊN TRONG NÀY THÔI) */}
      <div
        className={`bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 ${
          isFullscreen ? "flex-1 h-full min-h-0" : "min-h-[750px]"
        }`}
      >
        {/* Product Catalog Picker (Left 6 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col p-3.5 sm:p-4 border-r border-gray-100 dark:border-[#1f2e25] overflow-hidden space-y-3">
          {/* Search Bar & Sort Dropdown & Fullscreen Button Side-by-Side */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm theo tên thịt mát, mã SKU (ba chỉ, sườn non...)"
                value={posProductSearch}
                onChange={(e) => setPosProductSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
              />
              <span className="absolute left-3 top-2 text-gray-400 text-sm">
                🔍
              </span>
              {posProductSearch && (
                <button
                  type="button"
                  onClick={() => setPosProductSearch("")}
                  className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sắp xếp Dropdown */}
            <div className="shrink-0">
              <select
                id="pos-sort-selector-page"
                value={posProductSort}
                onChange={(e) => setPosProductSort(e.target.value as any)}
                className="px-2.5 py-2 text-xs font-bold rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-[#1a261f] text-emerald-800 dark:text-emerald-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
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
              onClick={toggleFullscreen}
              className={`px-3 py-2 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95 ${
                isFullscreen
                  ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                  : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
              }`}
              title={isFullscreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình - Chỉ hiện quầy thu ngân"}
            >
              <span className="text-sm">{isFullscreen ? "🗗" : "⛶"}</span>
              <span>{isFullscreen ? "Thu nhỏ" : "Full màn"}</span>
            </button>
          </div>

          {/* Category Pills Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs shrink-0">
            <button
              type="button"
              onClick={() => setPosSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                posSelectedCategory === "ALL"
                  ? "bg-emerald-600 text-white shadow-2xs"
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
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-gray-100 dark:bg-[#1a261f] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div
            className={`flex-1 overflow-y-auto pr-1 ${
              isFullscreen ? "max-h-full" : "max-h-[620px]"
            }`}
          >
            {loading ? (
              <div className="py-20 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Đang tải thực phẩm điểm bán...
              </div>
            ) : posFilteredProducts.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-xs">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            ) : (
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
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🥩
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
                          Còn {p.stockQuantity}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs line-clamp-2 text-gray-900 dark:text-white leading-tight min-h-[32px]">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {p.packWeight}
                        </p>
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
            )}
          </div>
        </div>

        {/* Cart & Payment Panel (Right 6 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col h-full bg-gray-50/90 dark:bg-[#152019] overflow-hidden">
          {/* Scrollable: Cart List, Customer Form, Cash Calculator */}
          <div
            className={`flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 ${
              isFullscreen ? "max-h-full" : "max-h-[580px]"
            }`}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-[#2b3d32]">
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
                    type="button"
                    onClick={() => setPosCart([])}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
                {isFullscreen && (
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(false)}
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
            <div
              className={`space-y-2 overflow-y-auto pr-1 ${
                isFullscreen ? "max-h-[260px]" : "max-h-[180px]"
              }`}
            >
              {posCart.length === 0 ? (
                <div className="py-6 text-center text-gray-400 text-xs">
                  <span className="text-3xl block mb-1">🛒</span>
                  Chưa chọn sản phẩm nào.
                  <br />
                  Bấm vào các mặt hàng bên trái để thêm!
                </div>
              ) : (
                posCart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#1a261f] border border-gray-200/80 dark:border-[#2b3d32] flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {formatVnd(item.product.price)} x {item.quantity} ={" "}
                        {formatVnd(item.product.price * item.quantity)}
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
            <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-[#2b3d32]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Tên Khách Hàng
                  </label>
                  <input
                    type="text"
                    value={posCustomer.name}
                    onChange={(e) =>
                      setPosCustomer({ ...posCustomer, name: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                    placeholder="Khách lẻ tại quầy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={posCustomer.phone}
                    onChange={(e) =>
                      setPosCustomer({ ...posCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                    placeholder="SĐT tích điểm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Hình Thức Thanh Toán
                  </label>
                  <select
                    value={posCustomer.paymentMethod}
                    onChange={(e) =>
                      setPosCustomer({
                        ...posCustomer,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                  >
                    <option value="CASH">💵 Tiền mặt (CASH)</option>
                    <option value="VNPAY">📱 Quét QR VNPAY</option>
                    <option value="CARD">💳 Quẹt thẻ ngân hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Kênh / Giao Hàng
                  </label>
                  <select
                    value={posCustomer.deliveryMethod}
                    onChange={(e) =>
                      setPosCustomer({
                        ...posCustomer,
                        deliveryMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-gray-300 dark:border-[#2b3d32] bg-white dark:bg-[#121a15] text-gray-900 dark:text-white cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-2xs"
                  >
                    <option value="TAKE_AWAY">🛍️ Mang về (Tại quầy)</option>
                    <option value="FAST_2H">⚡ Giao hỏa tốc 2H (+25k)</option>
                  </select>
                </div>
              </div>

              {/* Cash Tender & Change Calculator */}
              {posCustomer.paymentMethod === "CASH" && (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/80 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-black text-amber-900 dark:text-amber-200">
                      Tiền Khách Đưa (VNĐ):
                    </label>
                    <div className="flex gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          setPosCashReceived(
                            posTotalAmount +
                              (posCustomer.deliveryMethod === "FAST_2H"
                                ? 25000
                                : 0)
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-2xs cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                      >
                        Đúng tiền
                      </button>
                      <button
                        type="button"
                        onClick={() => setPosCashReceived(100000)}
                        className="px-2.5 py-1 rounded-lg text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-2xs cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                      >
                        100k
                      </button>
                      <button
                        type="button"
                        onClick={() => setPosCashReceived(200000)}
                        className="px-2.5 py-1 rounded-lg text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-2xs cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                      >
                        200k
                      </button>
                      <button
                        type="button"
                        onClick={() => setPosCashReceived(500000)}
                        className="px-2.5 py-1 rounded-lg text-xs font-black bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-amber-300 shadow-2xs cursor-pointer hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                      >
                        500k
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="Nhập số tiền khách đưa..."
                    value={posCashReceived}
                    onChange={(e) =>
                      setPosCashReceived(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full px-3.5 py-2.5 text-base sm:text-lg font-black rounded-xl border-2 border-amber-400 dark:border-amber-700 bg-white dark:bg-[#121a15] text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-2xs transition-all"
                  />
                  {typeof posCashReceived === "number" && posCashReceived > 0 && (
                    <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-amber-200/80 dark:border-amber-900/40">
                      <span className="text-gray-700 dark:text-gray-300">
                        Tiền thối lại khách:
                      </span>
                      <span
                        className={`text-base sm:text-lg font-black ${
                          posCashReceived -
                            (posTotalAmount +
                              (posCustomer.deliveryMethod === "FAST_2H"
                                ? 25000
                                : 0)) >=
                          0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600"
                        }`}
                      >
                        {formatVnd(
                          posCashReceived -
                            (posTotalAmount +
                              (posCustomer.deliveryMethod === "FAST_2H"
                                ? 25000
                                : 0))
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Checkout & Action Buttons Panel (Fixed at Bottom) */}
          <div className="p-3.5 sm:p-4 bg-white dark:bg-[#121a15] border-t-2 border-emerald-500/20 dark:border-[#2b3d32] shadow-[0_-8px_25px_rgba(0,0,0,0.08)] shrink-0 space-y-2.5 z-10">
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {formatVnd(posTotalAmount)}
                </span>
              </div>
              {posCustomer.deliveryMethod === "FAST_2H" && (
                <div className="flex justify-between text-gray-500">
                  <span>Phí giao hàng 2H:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    + 25.000 đ
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-[#2b3d32]">
                <span className="font-black text-gray-900 dark:text-white text-sm sm:text-base tracking-wide">
                  TỔNG THANH TOÁN:
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatVnd(
                    posTotalAmount +
                      (posCustomer.deliveryMethod === "FAST_2H" ? 25000 : 0)
                  )}
                </span>
              </div>
            </div>

            {/* 2 Big Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              <button
                type="button"
                onClick={() => handleCreatePosOrder(false)}
                className="py-3 px-3 rounded-2xl border-2 border-emerald-600 text-emerald-700 dark:text-emerald-300 font-black text-xs sm:text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="text-base">💾</span>
                <span>Lưu Đơn Quầy</span>
              </button>
              <button
                type="button"
                onClick={() => handleCreatePosOrder(true)}
                className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <span className="text-base">🖨️</span>
                <span>Hoàn Tất & In HĐ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Receipt Printing Modal */}
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
              <h2 className="text-lg font-black tracking-tight">
                HỆ THỐNG THỰC PHẨM UBOFOOD
              </h2>
              <p className="text-[11px] text-gray-600">
                Thịt Tươi Mổ Lạnh 0 - 4°C Chuẩn Châu Âu
              </p>
              <p className="text-[10px] text-gray-500">
                Cửa hàng: Số 3 Cầu Giấy, Láng Thượng, Đống Đa, Hà Nội
              </p>
              <p className="text-[10px] text-gray-500">
                Hotline: 024.3888.999 • www.ubofood.vn
              </p>
            </div>

            {/* Invoice Meta */}
            <div className="space-y-1 text-[11px] border-b pb-3">
              <div className="flex justify-between">
                <span>
                  Số HĐ: <strong>{printingOrder.orderCode}</strong>
                </span>
                <span>
                  Kênh: <strong>{printingOrder.channel}</strong>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ngày in: {new Date().toLocaleString("vi-VN")}</span>
              </div>
              <div>
                <span>
                  Khách hàng: <strong>{printingOrder.customerName}</strong> (
                  {printingOrder.customerPhone})
                </span>
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
                        <div className="text-[10px] text-gray-500">
                          {it.packWeight} • {formatVnd(it.unitPrice)}
                        </div>
                      </td>
                      <td className="py-1 text-center font-bold">
                        {it.quantity}
                      </td>
                      <td className="py-1 text-right font-bold">
                        {formatVnd(it.subtotal)}
                      </td>
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
                <span>{formatVnd(printingOrder.shippingFee || 0)}</span>
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
              <p className="text-[11px] font-bold">
                Cảm ơn quý khách đã mua sắm tại Ubofood!
              </p>
              <p className="text-[10px] text-gray-500">
                Quét mã QR để theo dõi hành trình giao hàng hỏa tốc 2h
              </p>
              <div className="h-8 bg-gray-100 flex items-center justify-center tracking-[6px] font-bold text-gray-700 text-xs rounded">
                |||| | ||||| |||| |||
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => window.print()}
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
