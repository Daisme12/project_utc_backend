"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { adminService, AdminProduct, AdminCategory } from "@/services/adminService";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    "DEFAULT" | "STOCK_ASC" | "STOCK_DESC" | "PRICE_ASC" | "PRICE_DESC" | "NAME_AZ"
  >("DEFAULT");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP...)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước ảnh tối đa 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const toastId = toast.loading("Đang tải ảnh lên Cloudinary...");
      const uploadedUrl = await adminService.uploadImage(file, "products");
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success("Tải ảnh lên Cloudinary thành công!", { id: toastId });
    } catch (err: any) {
      console.error("Lỗi upload ảnh:", err);
      toast.error("Không thể tải ảnh: " + (err?.message || "Lỗi không xác định"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    categoryId: 1,
    sku: "",
    slug: "",
    price: 50000,
    originalPrice: 60000,
    stockQuantity: 50,
    unit: "Khay",
    packWeight: "Khay 300g",
    standard: "vietgap",
    origin: "Hà Nam",
    brand: "UBOMEAT CHUẨN MÁT",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([
      adminService.getProducts(),
      adminService.getCategories(),
    ]);
    setProducts(pRes.data);
    setCategories(cRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("stock") === "LOW" || params.get("filter") === "low_stock") {
        setStockFilter("LOW");
      }
      if (params.get("search")) {
        setSearchQuery(params.get("search")!);
      }
      if (params.get("category")) {
        setSelectedCategory(params.get("category")!);
      }
      if (params.get("sort")) {
        setSortBy(params.get("sort") as any);
      }
    }
  }, []);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => Number(p.stockQuantity) <= 40).length;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const query = searchQuery.toLowerCase().trim();
        const matchSearch =
          !query ||
          (p.name || "").toLowerCase().includes(query) ||
          (p.sku || "").toLowerCase().includes(query) ||
          (p.brand || "").toLowerCase().includes(query);

        const pCatId = (p as any).category?.id ?? p.categoryId;
        const matchCategory =
          selectedCategory === "ALL" || String(pCatId) === String(selectedCategory);

        const stock = Number(p.stockQuantity) || 0;
        const matchStock =
          stockFilter === "ALL"
            ? true
            : stockFilter === "LOW"
            ? stock <= 40
            : stock > 40;

        return matchSearch && matchCategory && matchStock;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        const stockA = Number(a.stockQuantity) || 0;
        const stockB = Number(b.stockQuantity) || 0;

        if (sortBy === "STOCK_ASC") return stockA - stockB;
        if (sortBy === "STOCK_DESC") return stockB - stockA;
        if (sortBy === "PRICE_ASC") return priceA - priceB;
        if (sortBy === "PRICE_DESC") return priceB - priceA;
        if (sortBy === "NAME_AZ") return (a.name || "").localeCompare(b.name || "", "vi");
        // Mặc định: theo thứ tự ID mới nhất
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      categoryId: categories[0]?.id || 1,
      sku: `UB-${Date.now().toString().slice(-4)}`,
      slug: "",
      price: 50000,
      originalPrice: 60000,
      stockQuantity: 50,
      unit: "Khay",
      packWeight: "Khay 300g",
      standard: "vietgap",
      origin: "Ba Vì, Hà Nội",
      brand: "UBOMEAT CHUẨN MÁT",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categoryId: p.categoryId || 1,
      sku: p.sku,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stockQuantity: p.stockQuantity,
      unit: p.unit,
      packWeight: p.packWeight || "Khay 300g",
      standard: p.standard || "vietgap",
      origin: p.origin || "Việt Nam",
      brand: p.brand || "UBOMEAT",
      imageUrl: p.imageUrl || "",
      isActive: p.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      toast.error("Vui lòng điền đầy đủ tên và mã SKU");
      return;
    }

    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");

    const payload = { ...formData, slug };

    if (editingProduct) {
      await adminService.updateProduct(editingProduct.id, payload);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id ? { ...item, ...payload } : item
        )
      );
      toast.success("Cập nhật sản phẩm thành công!");
    } else {
      const res = await adminService.createProduct(payload);
      setProducts((prev) => [res.data, ...prev]);
      toast.success("Thêm sản phẩm mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa hoặc ngừng kinh doanh sản phẩm "${name}"?`)) {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Đã xóa sản phẩm ${name}`);
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
            Quản Lý Sản Phẩm Thực Phẩm 🥩
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tổng cộng {products.length} sản phẩm thực phẩm mát, chuẩn mổ lạnh 0-4°C & VietGAP.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>＋</span>
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm flex flex-col lg:flex-row items-center gap-3 justify-between">
        {/* Search */}
        <div className="flex-1 w-full lg:max-w-md relative">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SKU, thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls: Category, Button Sắp Hết Hàng, Nút Sort Nhanh, Refresh */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-700 dark:text-gray-300 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Tất Cả Danh Mục ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          {/* Button Sắp Hết Hàng Ra Ngoài Nhanh (1-Click Toggle) */}
          <button
            type="button"
            onClick={() => setStockFilter((prev) => (prev === "LOW" ? "ALL" : "LOW"))}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              stockFilter === "LOW"
                ? "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-300"
            }`}
            title="Bấm để lọc nhanh các món sắp hết hàng (tồn ≤ 40)"
          >
            <span>⚠️</span>
            <span>Sắp Hết Hàng</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                stockFilter === "LOW"
                  ? "bg-white text-amber-800"
                  : "bg-amber-200/80 text-amber-900 dark:bg-amber-800 dark:text-amber-100"
              }`}
            >
              {lowStockCount}
            </span>
          </button>

          {/* Nút Sort Ra Ngoài Nhanh */}
          <select
            id="product-sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-[#1a261f] text-emerald-800 dark:text-emerald-300 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            title="Sắp xếp sản phẩm nhanh"
          >
            <option value="DEFAULT">⚡ Sắp xếp: Mặc định</option>
            <option value="STOCK_ASC">⚠️ Tồn kho: Sắp hết (Ít → Nhiều)</option>
            <option value="STOCK_DESC">📦 Tồn kho: Nhiều nhất</option>
            <option value="PRICE_ASC">💰 Giá bán: Thấp → Cao</option>
            <option value="PRICE_DESC">💎 Giá bán: Cao → Thấp</option>
            <option value="NAME_AZ">🔤 Tên: A → Z</option>
          </select>

          {/* Reset & Refresh Button */}
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setStockFilter("ALL");
              setSortBy("DEFAULT");
              loadData();
              toast.success("Đã làm mới dữ liệu & bộ lọc");
            }}
            className="p-2 rounded-xl border border-gray-200 dark:border-[#2b3d32] hover:bg-gray-100 dark:hover:bg-[#1f2e25] text-xs transition-colors cursor-pointer"
            title="Đặt lại bộ lọc & Tải lại"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1f2e25] text-gray-400 font-bold uppercase tracking-wider select-none">
                <th
                  onClick={() => setSortBy((prev) => (prev === "NAME_AZ" ? "DEFAULT" : "NAME_AZ"))}
                  className="py-3 px-3 cursor-pointer hover:text-emerald-600 transition-colors"
                  title="Bấm để sắp xếp theo tên"
                >
                  <div className="flex items-center gap-1">
                    <span>Sản Phẩm</span>
                    {sortBy === "NAME_AZ" && <span className="text-emerald-600 font-black">🔤</span>}
                  </div>
                </th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Tiêu Chuẩn</th>
                <th
                  onClick={() => setSortBy((prev) => (prev === "PRICE_ASC" ? "PRICE_DESC" : "PRICE_ASC"))}
                  className="py-3 px-3 cursor-pointer hover:text-emerald-600 transition-colors"
                  title="Bấm để sắp xếp theo giá bán"
                >
                  <div className="flex items-center gap-1">
                    <span>Giá Bán</span>
                    {sortBy === "PRICE_ASC" && <span className="text-emerald-600 font-black">▲</span>}
                    {sortBy === "PRICE_DESC" && <span className="text-emerald-600 font-black">▼</span>}
                  </div>
                </th>
                <th
                  onClick={() => setSortBy((prev) => (prev === "STOCK_ASC" ? "STOCK_DESC" : "STOCK_ASC"))}
                  className="py-3 px-3 cursor-pointer hover:text-emerald-600 transition-colors"
                  title="Bấm để sắp xếp theo số lượng tồn kho"
                >
                  <div className="flex items-center gap-1">
                    <span>Tồn Kho</span>
                    {sortBy === "STOCK_ASC" && <span className="text-amber-600 font-black">▲ (Sắp hết)</span>}
                    {sortBy === "STOCK_DESC" && <span className="text-emerald-600 font-black">▼</span>}
                  </div>
                </th>
                <th className="py-3 px-3">Đánh Giá</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f2e25]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1a261f]/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative border border-gray-200/50 dark:border-[#2b3d32]">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                              🥩
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-gray-400">
                            {p.packWeight} • {p.unit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-gray-600 dark:text-gray-300">
                      {p.sku}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                        {p.standard || "vietgap"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-black text-emerald-600 dark:text-emerald-400">{formatVnd(p.price)}</p>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <p className="text-[11px] text-gray-400 line-through">
                          {formatVnd(p.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${
                          p.stockQuantity <= 40
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {p.stockQuantity} {p.unit}
                      </span>
                      {p.stockQuantity <= 40 && (
                        <span className="block text-[10px] text-red-500 font-semibold">⚠️ Sắp hết</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                      ⭐ {p.rating || 5.0} <span className="text-gray-400">({p.reviewCount || 0})</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2e25] dark:hover:bg-[#2c4033] font-semibold text-[11px] transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-[11px] transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1f2e25] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  🥩
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {editingProduct ? "Chỉnh Sửa Thông Tin Sản Phẩm" : "Thêm Sản Phẩm Mới Vào Hệ Thống"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Cập nhật danh mục, giá niêm yết, tiêu chuẩn mổ lạnh và số lượng tồn kho
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Tên Sản Phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-gray-900 dark:text-white"
                    placeholder="Ví dụ: Ba Chỉ Bò Úc Cuộn Nhúng Lẩu Chuẩn Mát"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Danh Mục Sản Phẩm *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Mã Vạch / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-gray-900 dark:text-white"
                    placeholder="BOUC-FS500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Tiêu Chuẩn Thực Phẩm
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="euchill">euchill (Mổ lạnh EU 0-4°C)</option>
                    <option value="vietgap">vietgap (Chuẩn VietGAP)</option>
                    <option value="organic">organic (Hữu cơ chứng nhận)</option>
                    <option value="oxyfresh">oxyfresh (Khay OxyFresh)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Giá Bán Hiện Tại (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-emerald-600 text-base"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Giá Gốc Niêm Yết (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Số Lượng Tồn Kho Ban Đầu *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-base text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Đơn Vị Tính *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    placeholder="Khay, Túi, Hộp, Kg..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Quy Cách Đóng Gói
                  </label>
                  <input
                    type="text"
                    value={formData.packWeight}
                    onChange={(e) => setFormData({ ...formData, packWeight: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    placeholder="Khay 300g, Túi 500g..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-200 mb-1.5">
                    Xuất Xứ / Nguồn Gốc
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    placeholder="Ba Vì, Hà Nam, Nhập khẩu Úc..."
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 bg-gray-50/80 dark:bg-[#1a261f]/70 p-4 rounded-2xl border border-gray-200/80 dark:border-[#2b3d32]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <label className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 text-sm">
                      <span>🖼️ Hình Ảnh Sản Phẩm (Xem Trước & Tải Lên)</span>
                      {formData.imageUrl?.includes("cloudinary") && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          Cloudinary CDN
                        </span>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Đang Tải Lên...</span>
                          </>
                        ) : (
                          <>
                            <span>☁️ Tải Ảnh Lên Cloudinary</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-4 items-center">
                    {/* Live Image Preview Box */}
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className="relative w-full h-[130px] md:w-[130px] rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-[#354a3e] bg-gray-100 dark:bg-[#131d17] flex flex-col items-center justify-center cursor-pointer group hover:border-blue-500 transition-colors shadow-inner"
                      title="Nhấp để chọn ảnh từ máy tính"
                    >
                      {formData.imageUrl ? (
                        <>
                          <img
                            src={formData.imageUrl}
                            alt="Xem trước ảnh sản phẩm"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/400x400?text=Lỗi+Ảnh";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold p-1 text-center backdrop-blur-[1px]">
                            <span>🔄 Đổi Ảnh</span>
                            <span className="text-[9px] opacity-80 mt-0.5">(Cloudinary)</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-2 text-gray-400">
                          <span className="text-2xl block mb-1">📷</span>
                          <span className="text-[11px] font-semibold block">Chưa có ảnh</span>
                          <span className="text-[10px] text-blue-500 underline block mt-0.5">Bấm tải lên</span>
                        </div>
                      )}
                    </div>

                    {/* Image URL Input & Info */}
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full p-3 pr-20 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#15201a] focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900 dark:text-white font-mono"
                          placeholder="https://res.cloudinary.com/... hoặc dán link ảnh trực tiếp"
                        />
                        {formData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                          >
                            Xóa URL
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        💡 <strong className="text-gray-700 dark:text-gray-200">Xem trước ảnh trực tiếp:</strong> Bạn có thể dán đường dẫn ảnh bất kỳ hoặc bấm nút <strong className="text-blue-600 dark:text-blue-400">☁️ Tải Ảnh Lên Cloudinary</strong> để chọn ảnh từ máy tính/điện thoại, hệ thống sẽ lưu trữ và tạo link Cloudinary tốc độ cao tự động.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#1f2e25]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-[#2b3d32] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f2e25] font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  {editingProduct ? "Lưu Thay Đổi Sản Phẩm" : "Tạo Sản Phẩm Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
