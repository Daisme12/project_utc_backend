"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  adminService,
  AdminGoodsReceipt,
  AdminSupplier,
  AdminProduct,
} from "@/services/adminService";
import { numberToVietnameseWords } from "@/lib/vietnameseNumberWords";

export interface SelectedReceiptItem {
  productId: number;
  name: string;
  sku: string;
  categoryName: string;
  unit: string;
  supplierId: number;
  quantity: number;
  importPrice: number;
  batchNumber?: string;
  expDate?: string;
}

interface Props {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: (created: AdminGoodsReceipt[]) => void;
}

export default function MultiProductGoodsReceiptForm({ isModal = false, onClose, onSuccess }: Props) {
  const router = useRouter();

  // Master Data
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [warehouseType, setWarehouseType] = useState("Kho Thịt Mát 0 - 4°C");
  const [receiptDate, setReceiptDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [autoImportStock, setAutoImportStock] = useState(true);
  const [note, setNote] = useState("");
  const [vatPercent, setVatPercent] = useState(0);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Selected Products
  const [selectedItems, setSelectedItems] = useState<SelectedReceiptItem[]>([]);

  // Add Supplier Modal
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", address: "" });
  const [savingSupplier, setSavingSupplier] = useState(false);

  // Load suppliers and products from backend
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [sRes, pRes] = await Promise.all([
          adminService.getSuppliers(),
          adminService.getProducts(),
        ]);

        setSuppliers(sRes.data || []);

        // Normalize product list from database
        const rawProds = pRes.data || [];
        const normalizedProds = rawProds.map((p: any) => ({
          id: p.id,
          sku: p.sku || `SP${p.id}`,
          name: p.name,
          categoryName: p.categoryName || p.category?.name || "Thịt Mát & Thực Phẩm",
          unit: p.unit || "Khay",
          stockQuantity: p.stockQuantity ?? 0,
          defaultPrice: Math.round(((p.price || 50000) * 0.75) / 1000) * 1000,
        }));

        setProducts(normalizedProds);
      } catch (err) {
        console.error("Failed to load receipt form data:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === "ALL" || p.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchQuery && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Unique categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.categoryName) set.add(p.categoryName);
    });
    return Array.from(set);
  }, [products]);

  // Handle toggle product selection
  const handleToggleProduct = (product: any) => {
    const isSelected = selectedItems.some((item) => item.productId === product.id);

    if (isSelected) {
      setSelectedItems((prev) => prev.filter((item) => item.productId !== product.id));
    } else {
      const defaultSupplier = suppliers[0]?.id || 1;
      const newItem: SelectedReceiptItem = {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        categoryName: product.categoryName,
        unit: product.unit || "Khay",
        supplierId: defaultSupplier,
        quantity: 1,
        importPrice: product.defaultPrice || 10000,
        batchNumber: `LOT-${product.sku.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        expDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      };
      setSelectedItems((prev) => [...prev, newItem]);
    }
  };

  // Select all currently filtered products
  const handleSelectAllFiltered = () => {
    const currentIds = new Set(selectedItems.map((i) => i.productId));
    const defaultSupplier = suppliers[0]?.id || 1;
    const toAdd = filteredProducts
      .filter((p) => !currentIds.has(p.id))
      .map((p) => ({
        productId: p.id,
        name: p.name,
        sku: p.sku,
        categoryName: p.categoryName,
        unit: p.unit || "Khay",
        supplierId: defaultSupplier,
        quantity: 1,
        importPrice: p.defaultPrice || 10000,
        batchNumber: `LOT-${p.sku.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        expDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      }));

    setSelectedItems((prev) => [...prev, ...toAdd]);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  // Update item field
  const updateSelectedItem = (index: number, field: keyof SelectedReceiptItem, value: any) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Quantity helpers
  const incrementQty = (index: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: (next[index].quantity || 0) + 1 };
      return next;
    });
  };

  const decrementQty = (index: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      if (next[index].quantity > 1) {
        next[index] = { ...next[index], quantity: next[index].quantity - 1 };
      }
      return next;
    });
  };

  // Remove single item
  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Apply supplier to all selected items
  const handleApplySupplierToAll = (supplierId: number) => {
    setSelectedItems((prev) => prev.map((item) => ({ ...item, supplierId })));
    const supName = suppliers.find((s) => s.id === supplierId)?.name || "NCC";
    toast.info(`Đã áp dụng NCC "${supName}" cho tất cả ${selectedItems.length} sản phẩm.`);
  };

  // Financial calculations
  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.importPrice || 0), 0);
  }, [selectedItems]);

  const vatAmount = useMemo(() => {
    return Math.round((subtotal * vatPercent) / 100);
  }, [subtotal, vatPercent]);

  const totalAmount = useMemo(() => {
    return subtotal + vatAmount;
  }, [subtotal, vatAmount]);

  // Primary supplier name for table preview banner
  const primarySupplierName = useMemo(() => {
    if (selectedItems.length === 0) return "Chưa chọn NCC";
    const firstSupId = selectedItems[0].supplierId;
    const sup = suppliers.find((s) => s.id === firstSupId);
    return sup?.name || "Nhà Cung Cấp Hợp Tác";
  }, [selectedItems, suppliers]);

  // Quick Add Supplier
  const handleSaveNewSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name.trim()) {
      toast.error("Vui lòng nhập tên nhà cung cấp");
      return;
    }
    setSavingSupplier(true);
    try {
      const res = await adminService.createSupplier({
        name: newSupplier.name.trim(),
        phone: newSupplier.phone.trim(),
        address: newSupplier.address.trim(),
        isActive: true,
      });
      const created = res.data;
      setSuppliers((prev) => [created, ...prev]);

      // Automatically select this new supplier for currently selected items
      if (selectedItems.length > 0) {
        handleApplySupplierToAll(created.id);
      }

      toast.success(`Đã thêm nhà cung cấp "${created.name}" thành công!`);
      setNewSupplier({ name: "", phone: "", address: "" });
      setShowAddSupplierModal(false);
    } catch {
      toast.error("Không thể lưu nhà cung cấp. Vui lòng thử lại.");
    } finally {
      setSavingSupplier(false);
    }
  };

  // Submit Goods Receipts
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để lập phiếu nhập kho!");
      return;
    }

    setSubmitting(true);
    const dateStr = receiptDate.replace(/-/g, "");
    const baseCode = `GR-${dateStr}-${Math.floor(100 + Math.random() * 900)}`;

    const createdReceipts: AdminGoodsReceipt[] = [];

    try {
      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const itemCode = selectedItems.length === 1 ? baseCode : `${baseCode}-${String(i + 1).padStart(2, "0")}`;
        const itemTotal = (item.quantity || 1) * (item.importPrice || 0);
        const supplierObj = suppliers.find((s) => s.id === item.supplierId);

        const payload = {
          receiptCode: itemCode,
          supplierId: item.supplierId,
          supplierName: supplierObj?.name,
          productId: item.productId,
          productName: item.name,
          batchNumber: item.batchNumber || `LOT-${item.sku}-${dateStr}`,
          expDate: item.expDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
          quantity: item.quantity,
          importPrice: item.importPrice,
          totalCost: itemTotal,
          note: `${warehouseType}: ${note || "Nhập hàng theo đơn mua hàng đa sản phẩm"}`,
          createdAt: new Date(receiptDate).toISOString(),
        };

        const res = await adminService.createGoodsReceipt(payload);
        createdReceipts.push(res.data);
      }

      toast.success(
        `✓ Đã tạo thành công ${createdReceipts.length} phiếu nhập cho đơn hàng ${baseCode}! ${
          autoImportStock ? "Tồn kho đã được tự động cộng dồn." : "Đã lưu nháp phiếu mua hàng."
        }`
      );

      if (onSuccess) {
        onSuccess(createdReceipts);
      }

      if (isModal && onClose) {
        onClose();
      } else {
        router.push("/admin/goods-receipts");
      }
    } catch (err: any) {
      console.error("Error creating multi receipts:", err);
      toast.error(err.message || "Có lỗi xảy ra khi tạo phiếu nhập kho.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatVndNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  return (
    <div className={`space-y-6 ${isModal ? "p-1" : "max-w-6xl mx-auto pb-16"}`}>
      {/* 1. TOP CONTROL BAR (Loại Kho, Chọn Ngày, Checkbox tạo phiếu, Nút Thêm NCC) */}
      <div className="bg-white dark:bg-[#121a15] rounded-2xl border border-gray-200/90 dark:border-[#1f2e25] p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loại Kho */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              LOẠI KHO <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🏢</span>
              <select
                value={warehouseType}
                onChange={(e) => setWarehouseType(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
              >
                <option value="Kho Nguyên Vật Liệu">Kho Nguyên Vật Liệu</option>
                <option value="Kho Thịt Mát 0 - 4°C">Kho Thịt Mát 0 - 4°C (Chuẩn OxyFresh)</option>
                <option value="Kho Thành Phẩm Sơ Chế">Kho Thành Phẩm Sơ Chế Tiện Lợi</option>
                <option value="Kho Thủy Hải Sản Tươi Mát">Kho Thủy Hải Sản Tươi Mát</option>
                <option value="Kho Gia Vị & Nước Chấm">Kho Gia Vị & Nước Chấm</option>
                <option value="Kho Bao Bì & Tem Nhãn">Kho Bao Bì & Tem Nhãn</option>
              </select>
            </div>
          </div>

          {/* Chọn Ngày */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              CHỌN NGÀY <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">📅</span>
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Sub row: Checkbox tạo phiếu nhập kho luôn + Thêm NCC Mới */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-[#1f2e25]">
          <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200 select-none">
            <input
              type="checkbox"
              checked={autoImportStock}
              onChange={(e) => setAutoImportStock(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
            <span className="flex items-center gap-1.5">
              <span>📥</span>
              <span>Tạo phiếu nhập kho luôn (Tự động cộng dồn số lượng tồn kho)</span>
            </span>
          </label>

          <button
            type="button"
            onClick={() => setShowAddSupplierModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>⚙️</span>
            <span>+ THÊM NCC MỚI</span>
          </button>
        </div>
      </div>

      {/* 2. CHỌN SẢN PHẨM (Search & Multi-Checklist) */}
      <div className="bg-white dark:bg-[#121a15] rounded-2xl border border-gray-200/90 dark:border-[#1f2e25] shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-5 py-3.5 bg-blue-50/70 dark:bg-[#15232c] border-b border-blue-100 dark:border-[#1f2e25] flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm tracking-wide uppercase">
            <span>📑</span>
            <span>CHỌN SẢN PHẨM</span>
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 lowercase">
              ({filteredProducts.length} mặt hàng trong kho)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Chọn tất cả
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
            >
              Bỏ chọn ({selectedItems.length})
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm NVL / SP theo mã hoặc tên..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-gray-100 dark:bg-[#1f2e25] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Tất cả mặt hàng
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-gray-100 dark:bg-[#1f2e25] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Checklist Table / Rows */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-[#1f2e25] border border-gray-100 dark:border-[#1f2e25] rounded-xl">
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400">Đang tải danh sách mặt hàng...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                Không tìm thấy mặt hàng nào khớp với "{searchQuery}"
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isChecked = selectedItems.some((item) => item.productId === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleProduct(p)}
                    className={`flex items-center justify-between p-3 cursor-pointer select-none transition-colors ${
                      isChecked
                        ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70"
                        : "hover:bg-gray-50/80 dark:hover:bg-[#1a261f]/50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0 pr-3">
                      <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                        {p.name}
                      </span>

                      {/* SKU Badge */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
                        {p.sku}
                      </span>

                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
                        {p.categoryName}
                      </span>

                      {/* Unit Badge */}
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {p.unit}
                      </span>

                      {/* Current Stock (SL) */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                        SL: {p.stockQuantity}
                      </span>

                      {/* Import Price (GN) */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                        GN: {formatVndNumber(p.defaultPrice)}
                      </span>
                    </div>

                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. SẢN PHẨM ĐÃ CHỌN (N) */}
      <div className="bg-white dark:bg-[#121a15] rounded-2xl border border-gray-200/90 dark:border-[#1f2e25] shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-5 py-3.5 bg-blue-50/70 dark:bg-[#15232c] border-b border-blue-100 dark:border-[#1f2e25] flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm tracking-wide uppercase">
            <span>⚙️</span>
            <span>SẢN PHẨM ĐÃ CHỌN ({selectedItems.length})</span>
          </div>

          {selectedItems.length > 0 && suppliers.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Đồng bộ NCC:</span>
              <select
                onChange={(e) => handleApplySupplierToAll(Number(e.target.value))}
                value=""
                className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] text-gray-700 dark:text-gray-200 font-medium text-xs cursor-pointer"
              >
                <option value="" disabled>
                  Chọn NCC áp dụng tất cả...
                </option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          {selectedItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 border border-dashed border-gray-200 dark:border-[#2b3d32] rounded-xl space-y-2">
              <span className="text-3xl block">🛒</span>
              <p className="font-semibold text-gray-600 dark:text-gray-300">
                Chưa có sản phẩm nào được chọn
              </p>
              <p className="text-xs text-gray-400">
                Hãy tick vào ô checkbox ở phần "CHỌN SẢN PHẨM" phía trên để thêm nhiều mặt hàng cùng lúc.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedItems.map((item, idx) => (
                <div
                  key={item.productId}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200/90 dark:border-[#2b3d32] bg-gray-50/50 dark:bg-[#1a261f]/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  {/* Left: Index + Product Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {idx + 1}
                    </div>

                    <div className="relative flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={item.name}
                        className="w-full text-xs font-bold text-gray-900 dark:text-white bg-transparent border-0 p-0 focus:ring-0 truncate"
                      />
                    </div>
                  </div>

                  {/* Middle 1: Supplier Selector */}
                  <div className="min-w-[200px] flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Nhà cung cấp
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">🏪</span>
                      <select
                        value={item.supplierId}
                        onChange={(e) => updateSelectedItem(idx, "supplierId", Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
                      >
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Middle 2: Quantity Stepper */}
                  <div className="w-28 flex-shrink-0">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Số lượng *
                    </label>
                    <div className="flex items-center rounded-lg border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrementQty(idx)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateSelectedItem(idx, "quantity", Math.max(1, Number(e.target.value) || 1))}
                        className="w-12 text-center text-xs font-bold text-gray-900 dark:text-white bg-transparent border-0 p-0 focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => incrementQty(idx)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Middle 3: Import Price */}
                  <div className="w-32 flex-shrink-0">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      Giá nhập *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={item.importPrice}
                      onChange={(e) => updateSelectedItem(idx, "importPrice", Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] text-gray-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Right: Delete Action */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      title="Xóa khỏi danh sách"
                      className="w-8 h-8 rounded-lg border border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <span>ℹ️</span>
                <span>
                  {selectedItems.length} sản phẩm →{" "}
                  {new Set(selectedItems.map((i) => i.supplierId)).size === 1
                    ? "1 phiếu mua hàng chung"
                    : `${new Set(selectedItems.map((i) => i.supplierId)).size} phiếu theo từng NCC`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. XEM TRƯỚC PHIẾU MUA HÀNG (Dark Banner & Live Table) */}
      <div className="bg-white dark:bg-[#121a15] rounded-2xl border border-gray-200/90 dark:border-[#1f2e25] shadow-sm overflow-hidden">
        {/* Dark Navy Banner Header */}
        <div className="px-5 py-3.5 bg-[#0f172a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
            <span>👁️</span>
            <span>
              Xem trước phiếu mua hàng — {primarySupplierName} ({selectedItems.length} SP)
            </span>
          </div>

          <div className="text-xs text-slate-300">
            Ngày lập: {new Date(receiptDate).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1f2e25] bg-gray-50/70 dark:bg-[#1a261f]/70 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 w-28">MÃ</th>
                <th className="py-3 px-4">TÊN</th>
                <th className="py-3 px-4 w-20 text-center">SL</th>
                <th className="py-3 px-4 w-20 text-center">ĐVT</th>
                <th className="py-3 px-4 text-right">GIÁ NHẬP</th>
                <th className="py-3 px-4 text-right">TỔNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f2e25]">
              {selectedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Chưa có mặt hàng nào trong phiếu mua hàng.
                  </td>
                </tr>
              ) : (
                selectedItems.map((item, index) => {
                  const lineTotal = item.quantity * item.importPrice;
                  return (
                    <tr
                      key={item.productId}
                      className="hover:bg-gray-50/50 dark:hover:bg-[#1a261f]/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-gray-700 dark:text-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.sku}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-500">
                        {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-700 dark:text-gray-300">
                        {formatVndNumber(item.importPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                        {formatVndNumber(lineTotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Totals & Number in Words */}
        <div className="p-5 border-t border-gray-100 dark:border-[#1f2e25] bg-gray-50/30 dark:bg-[#1a261f]/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-y-2 text-xs">
            <div className="w-full sm:w-80 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tổng giá trị trước thuế:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatVndNumber(subtotal)} VNĐ
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span>Thuế GTGT:</span>
                  <select
                    value={vatPercent}
                    onChange={(e) => setVatPercent(Number(e.target.value))}
                    className="py-0.5 px-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-bold"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatVndNumber(vatAmount)} VNĐ
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-[#2b3d32]">
                <span>Tổng giá trị đơn hàng:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {formatVndNumber(totalAmount)} VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* Số tiền bằng chữ */}
          <div className="text-right text-xs text-gray-500 dark:text-gray-400 italic pt-1">
            Số tiền bằng chữ:{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {numberToVietnameseWords(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. GHI CHÚ */}
      <div className="bg-white dark:bg-[#121a15] rounded-2xl border border-gray-200/90 dark:border-[#1f2e25] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-blue-50/70 dark:bg-[#15232c] border-b border-blue-100 dark:border-[#1f2e25] text-blue-700 dark:text-blue-400 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
          <span>📝</span>
          <span>GHI CHÚ</span>
        </div>
        <div className="p-4">
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú điều kiện bảo quản nhiệt độ (0 - 4°C), mã tem VietGAP kiểm định, tình trạng lô hàng..."
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] text-gray-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 6. BOTTOM ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (isModal && onClose) onClose();
            else router.push("/admin/goods-receipts");
          }}
          className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span>✕</span>
          <span>HỦY BỎ</span>
        </button>

        <button
          type="button"
          disabled={submitting || selectedItems.length === 0}
          onClick={handleSubmit}
          className="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin text-base">⏳</span>
              <span>Đang Lập Phiếu...</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>
                {autoImportStock ? "TẠO — PHIẾU NHẬP KHO" : "TẠO — PHIẾU MUA HÀNG"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* MODAL: THÊM NHÀ CUNG CẤP MỚI */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#121a15] rounded-2xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-[#1f2e25]">
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <span>🏢</span>
                <span>Thêm Nhà Cung Cấp Mới</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddSupplierModal(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewSupplier} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1 text-gray-700 dark:text-gray-200">
                  Tên Nhà Cung Cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bánh Mỳ - A Biên, Nông Trại Ba Vì..."
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-gray-700 dark:text-gray-200">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  placeholder="0912345678"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-gray-700 dark:text-gray-200">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  placeholder="Quận Cầu Giấy, Hà Nội..."
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-[#1f2e25]">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2b3d32] text-gray-600 dark:text-gray-300 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={savingSupplier}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {savingSupplier ? "Đang lưu..." : "Lưu Nhà Cung Cấp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
