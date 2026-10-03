"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  adminService,
  AdminGoodsReceipt,
  AdminSupplier,
  AdminProduct,
} from "@/services/adminService";
import MultiProductGoodsReceiptForm from "@/components/admin/MultiProductGoodsReceiptForm";

export default function AdminGoodsReceiptsPage() {
  const [receipts, setReceipts] = useState<AdminGoodsReceipt[]>([]);
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false); // Single batch modal
  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false); // Multi-product modal
  const [searchReceiptQuery, setSearchReceiptQuery] = useState("");

  const [formData, setFormData] = useState({
    supplierId: 1,
    productId: 2,
    batchNumber: "LOT-OXY-" + Math.floor(1000 + Math.random() * 9000),
    expDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    quantity: 50,
    importPrice: 65000,
    note: "Nhập thịt mát bảo quản lạnh 0 - 4°C tiêu chuẩn xuất kho",
  });

  const loadData = async () => {
    setLoading(true);
    const [rRes, sRes, pRes] = await Promise.all([
      adminService.getGoodsReceipts(),
      adminService.getSuppliers(),
      adminService.getProducts(),
    ]);
    setReceipts(rRes.data || []);
    setSuppliers(sRes.data || []);
    setProducts(pRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      supplierId: suppliers[0]?.id || 1,
      productId: products[0]?.id || 2,
      batchNumber: "LOT-OXY-" + Math.floor(1000 + Math.random() * 9000),
      expDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      quantity: 50,
      importPrice: 65000,
      note: "Nhập thịt mát bảo quản lạnh 0 - 4°C tiêu chuẩn xuất kho",
    });
    setIsModalOpen(true);
  };

  const handleMultiSuccess = (newReceipts: AdminGoodsReceipt[]) => {
    setReceipts((prev) => [...newReceipts, ...prev]);
    setIsMultiModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptCode = `GR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(10 + Math.random() * 90)}`;
    const totalCost = formData.quantity * formData.importPrice;

    const matchedSupplier = suppliers.find((s) => s.id === Number(formData.supplierId));
    const matchedProduct = products.find((p) => p.id === Number(formData.productId));

    const payload = {
      ...formData,
      receiptCode,
      totalCost,
      supplierName: matchedSupplier?.name,
      productName: matchedProduct?.name,
      createdAt: new Date().toISOString(),
    };

    const res = await adminService.createGoodsReceipt(payload);
    setReceipts((prev) => [res.data, ...prev]);
    toast.success(`Lập phiếu nhập kho ${receiptCode} thành công! Đã cập nhật tồn kho.`);
    setIsModalOpen(false);
  };

  const filteredReceipts = receipts.filter((r) => {
    if (!searchReceiptQuery) return true;
    const q = searchReceiptQuery.toLowerCase();
    return (
      r.receiptCode?.toLowerCase().includes(q) ||
      r.productName?.toLowerCase().includes(q) ||
      r.supplierName?.toLowerCase().includes(q) ||
      r.batchNumber?.toLowerCase().includes(q)
    );
  });

  const formatVnd = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quản Lý Nhập Kho Lô Mát 📥
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kiểm soát nguồn gốc theo lô (Batch LOT), tiêu chuẩn bảo quản nhiệt độ và hạn dùng thịt mát.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick 1-Item LOT modal */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-white dark:bg-[#1a261f] hover:bg-gray-50 dark:hover:bg-[#243329] text-gray-700 dark:text-gray-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>⚡</span>
            <span>Nhập Nhanh 1 Lô</span>
          </button>

          {/* Primary: Multi-product modal */}
          <button
            onClick={() => setIsMultiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>📑</span>
            <span>Lập Phiếu Nhập Nhiều SP</span>
          </button>

          {/* Direct link to dedicated page */}
          <Link
            href="/admin/goods-receipts/create"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span>↗</span>
            <span>Trang Tạo Phiếu</span>
          </Link>
        </div>
      </div>

      {/* Receipts Table with Search */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121a15] border border-gray-200/80 dark:border-[#1f2e25] shadow-sm space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Tìm theo mã phiếu, sản phẩm, NCC, số lô..."
              value={searchReceiptQuery}
              onChange={(e) => setSearchReceiptQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs text-gray-500 font-semibold">
            Tổng cộng: <span className="font-bold text-gray-900 dark:text-white">{filteredReceipts.length}</span> phiếu nhập
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1f2e25] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Mã Phiếu & Thời Gian</th>
                <th className="py-3 px-3">Nhà Cung Cấp</th>
                <th className="py-3 px-3">Mặt Hàng Nhập</th>
                <th className="py-3 px-3">Lô & Hạn Dùng</th>
                <th className="py-3 px-3">Số Lượng</th>
                <th className="py-3 px-3">Đơn Giá Nhập</th>
                <th className="py-3 px-3 text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f2e25]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Đang tải phiếu nhập kho...
                  </td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1a261f]/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-gray-900 dark:text-white font-mono">{r.receiptCode}</p>
                      <p className="text-[11px] text-gray-400">{r.createdAt?.slice(0, 10)}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{r.supplierName || "Nhà cung cấp VietGAP"}</p>
                      {r.note && <p className="text-[10px] text-gray-400 line-clamp-1">{r.note}</p>}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-900 dark:text-white">
                      {r.productName || "Thịt mát nhập khẩu"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        {r.batchNumber}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">HSD: {r.expDate || "7 ngày"}</p>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">
                      +{r.quantity} Khay
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 dark:text-gray-300">
                      {formatVnd(r.importPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      {formatVnd(r.totalCost)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Single Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-6 sm:p-8 space-y-5 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-[#1f2e25]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl">
                  📥
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                    Lập Phiếu Nhập Kho Lô Hàng Mát
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Nhập thông tin lô hàng kiểm định, cộng số lượng tồn kho tự động
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Nhà Cung Cấp Hợp Tác *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Sản Phẩm Cần Nhập Kho *
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Số Lô Kiểm Định (LOT) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                    placeholder="LOT-2026-..."
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Hạn Sử Dụng (EXP) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expDate}
                    onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Số Lượng Nhập (Khay/Hộp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                    Đơn Giá Nhập (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={formData.importPrice}
                    onChange={(e) => setFormData({ ...formData, importPrice: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] font-bold text-base text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                    Tổng chi phí thanh toán lô hàng:
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                    {formatVnd(formData.quantity * formData.importPrice)}
                  </span>
                </div>
                <span className="text-2xl">💰</span>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Ghi Chú Kiểm Định
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-[#2b3d32] bg-gray-50 dark:bg-[#1a261f] text-gray-900 dark:text-white"
                  placeholder="Kiểm định nhiệt độ kho mát 0-4°C, tem chứng nhận VietGAP..."
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
                  Tạo Phiếu & Cộng Tồn Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Product Goods Receipt Modal */}
      {isMultiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white dark:bg-[#121a15] rounded-3xl border border-gray-200 dark:border-[#1f2e25] shadow-2xl p-4 sm:p-6 space-y-4 my-auto max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3.5 border-gray-100 dark:border-[#1f2e25] sticky top-0 bg-white/95 dark:bg-[#121a15]/95 backdrop-blur z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xl shadow-sm">
                  📑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg sm:text-xl text-gray-900 dark:text-white">
                      Lập Phiếu Nhập Kho & Mua Hàng
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      Chọn Nhiều SP
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tick chọn nhiều mặt hàng, điều chỉnh số lượng và tự động cộng dồn tồn kho
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/goods-receipts/create"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#2b3d32] text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <span>Mở toàn màn hình</span>
                  <span>↗</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMultiModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#1f2e25] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Form */}
            <MultiProductGoodsReceiptForm
              isModal={true}
              onClose={() => setIsMultiModalOpen(false)}
              onSuccess={handleMultiSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
