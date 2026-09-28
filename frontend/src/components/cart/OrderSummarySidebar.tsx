"use client";

import React, { useState } from "react";
import { toast } from "sonner";

interface OrderSummarySidebarProps {
  subtotal: number;
  itemCount: number;
  onPlaceOrder: (finalTotal: number) => void;
}

export default function OrderSummarySidebar({
  subtotal,
  itemCount,
  onPlaceOrder,
}: OrderSummarySidebarProps) {
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
    label: string;
  } | null>(null);
  const [useUboPoint, setUseUboPoint] = useState(false);

  // Calculations: Nếu chưa chọn món nào (subtotal === 0) thì toàn bộ phí = 0
  const hasItems = subtotal > 0 && itemCount > 0;
  const shippingFee = hasItems ? 25000 : 0;
  const shippingDiscount = subtotal >= 150000 ? 25000 : 0;
  const voucherDiscount = hasItems && appliedVoucher ? appliedVoucher.discount : 0;
  const pointDiscount = hasItems && useUboPoint ? Math.min(15000, subtotal) : 0;

  const totalDiscount = shippingDiscount + voucherDiscount + pointDiscount;
  const finalTotal = hasItems
    ? Math.max(0, subtotal + shippingFee - totalDiscount)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherInput.trim().toUpperCase();
    if (!code) {
      toast.error("Vui lòng nhập mã khuyến mại");
      return;
    }
    if (!hasItems) {
      toast.error("Vui lòng tích chọn sản phẩm trong giỏ trước khi áp mã!");
      return;
    }
    if (code === "GIAM50K" || code === "UBOSALE50") {
      setAppliedVoucher({
        code,
        discount: 50000,
        label: "Giảm 50% đơn mới (tối đa 50k)",
      });
      toast.success(`Áp dụng mã ${code} thành công! Giảm 50.000đ`);
    } else if (code === "UBOCHAOXUAN") {
      setAppliedVoucher({
        code: "UBOCHAOXUAN",
        discount: 10000,
        label: "Giảm đơn mới",
      });
      toast.success("Áp dụng mã UBOCHAOXUAN thành công! Giảm 10.000đ");
    } else if (code === "UBOMEAT" || code === "UBOFOOD") {
      setAppliedVoucher({
        code,
        discount: 20000,
        label: "Ưu đãi khách hàng thân thiết",
      });
      toast.success(`Áp dụng mã ${code} thành công! Giảm 20.000đ`);
    } else {
      setAppliedVoucher({
        code,
        discount: 15000,
        label: "Mã khuyến mại ưu đãi",
      });
      toast.success(`Áp dụng mã ${code} thành công! Giảm 15.000đ`);
    }
  };

  return (
    <aside className="w-full lg:w-96 flex-shrink-0 space-y-5">
      {/* 1. MAIN SUMMARY CARD */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white pb-3 border-b border-gray-100 dark:border-zinc-800">
          Tóm tắt đơn hàng
        </h2>

        {/* Voucher Form */}
        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
            Mã khuyến mại Ubofood
          </label>
          <form onSubmit={handleApplyVoucher} className="flex items-center gap-2">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
              placeholder="Nhập mã voucher (vd: UBOCHAOXUAN)..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold uppercase text-[#195329] dark:text-emerald-400 placeholder:normal-case placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#195329]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#195329] hover:bg-[#12421f] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Áp dụng
            </button>
          </form>

          {/* Applied Vouchers Tags */}
          <div className="mt-2.5 space-y-1.5">
            {shippingDiscount > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#eaf7ee] dark:bg-emerald-950/40 text-[11px] text-[#195329] dark:text-emerald-300 font-bold border border-emerald-200/60">
                <span className="flex items-center gap-1">
                  <span>⚡ FREESHIP2H :</span>
                  <span>Miễn phí vận chuyển</span>
                </span>
                <span>-25.000đ</span>
              </div>
            )}

            {appliedVoucher && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[11px] text-orange-800 dark:text-orange-300 font-bold border border-orange-200/60">
                <span className="flex items-center gap-1">
                  <span>🏷️ {appliedVoucher.code} :</span>
                  <span>{appliedVoucher.label}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>-{formatPrice(appliedVoucher.discount)}đ</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedVoucher(null);
                      toast.info("Đã gỡ mã khuyến mại");
                    }}
                    className="text-gray-400 hover:text-red-500 cursor-pointer text-xs"
                    title="Gỡ mã"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Price Lines */}
        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tạm tính ({itemCount} món đã chọn):</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(subtotal)}đ
            </span>
          </div>

          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Phí đóng gói & vận chuyển 2H:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {hasItems ? `${formatPrice(shippingFee)}đ` : "0đ"}
            </span>
          </div>

          {shippingDiscount > 0 && (
            <div className="flex justify-between text-[#195329] dark:text-emerald-400 font-medium">
              <span>🚚 Giảm phí vận chuyển:</span>
              <span className="font-bold">-{formatPrice(shippingDiscount)}đ</span>
            </div>
          )}

          {voucherDiscount > 0 && (
            <div className="flex justify-between text-orange-600 dark:text-orange-400 font-medium">
              <span>🏷️ Voucher giảm giá:</span>
              <span className="font-bold">-{formatPrice(voucherDiscount)}đ</span>
            </div>
          )}

          {/* UboPoint Checkbox */}
          <div className="pt-1">
            <label
              className={`flex items-center justify-between p-2 rounded-xl border border-gray-100 dark:border-zinc-700 transition-colors select-none ${
                hasItems
                  ? "bg-gray-50 dark:bg-zinc-800/80 cursor-pointer"
                  : "bg-gray-50/50 dark:bg-zinc-800/40 opacity-60 cursor-not-allowed"
              }`}
            >
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <input
                  type="checkbox"
                  disabled={!hasItems}
                  checked={useUboPoint}
                  onChange={(e) => setUseUboPoint(e.target.checked)}
                  className="w-4 h-4 rounded text-[#195329] focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <span>Dùng 1.500 UboPoint (Ví có 2.300đ)</span>
              </span>
              <span className="font-bold text-[#195329] dark:text-emerald-400">
                {useUboPoint && hasItems ? "-15.000đ" : "0đ"}
              </span>
            </label>
          </div>
        </div>

        {/* Final Total Calculation */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-baseline justify-between">
            <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
              TỔNG THANH TOÁN
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#195329] dark:text-emerald-400">
              {formatPrice(finalTotal)}đ
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-0.5">
            <span>Đã gồm VAT & bảo quản đá gel OxyFresh</span>
            {totalDiscount > 0 && (
              <span className="font-bold text-red-600">
                Tiết kiệm {formatPrice(totalDiscount)}đ
              </span>
            )}
          </div>
        </div>

        {/* Big Action CTA Button */}
        <button
          type="button"
          disabled={!hasItems}
          onClick={() => onPlaceOrder(finalTotal)}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
            !hasItems
              ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none"
              : "bg-[#195329] hover:bg-[#12421f] text-white shadow-emerald-950/20 active:scale-98 cursor-pointer"
          }`}
        >
          {!hasItems ? (
            <span>VUI LÒNG CHỌN MÓN ĐỂ ĐẶT HÀNG</span>
          ) : (
            <>
              <span>TIẾN HÀNH ĐẶT HÀNG</span>
              <span>({formatPrice(finalTotal)}đ)</span>
              <span>→</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-gray-400 leading-tight">
          Nhấn Đặt Hàng đồng nghĩa với việc bạn đồng ý với Điều Khoản Mua Sắm Thực Phẩm Tươi Ubofood
        </p>
      </div>

      {/* 2. QUALITY GUARANTEE CARD */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-3 text-xs">
        <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-gray-100 dark:border-zinc-800">
          <span>🛡️</span>
          <span>Cam kết chất lượng từ Ubofood</span>
        </h3>

        <div className="space-y-2.5 text-gray-600 dark:text-gray-300">
          <p className="flex items-start gap-2">
            <span className="text-[#195329] flex-shrink-0">✓</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-100">100% Hoàn tiền tức thì:</strong> Nếu thịt không giữ chuẩn nhiệt độ 0 - 4°C hoặc xuất hiện mùi vị lạ.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-[#195329] flex-shrink-0">✓</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-100">Thùng giữ lạnh OxyFresh:</strong> Gel đá hữu cơ phân hủy sinh học, bảo quản an toàn đến 4 giờ liên tục.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-[#195329] flex-shrink-0">✓</span>
            <span>
              <strong className="text-gray-800 dark:text-gray-100">Hóa đơn điện tử VAT:</strong> Tự động xuất theo mã số thuế doanh nghiệp ngay sau khi giao thành công.
            </span>
          </p>

          <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
            <span>📞 Hotline kiểm tra đơn hàng:</span>
            <span className="text-[#195329] dark:text-emerald-400 font-extrabold">1900 8912 (24/7)</span>
          </div>
        </div>
      </div>

      {/* 3. EU STANDARD BANNER */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#123e1e] to-[#0a2311] text-white shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-black text-emerald-300 uppercase">
            TIÊU CHUẨN EU
          </span>
          <span className="text-[10px] text-gray-300 font-medium">
            HACCP & ISO 22000
          </span>
        </div>

        <h4 className="text-sm font-black text-white">
          Thịt Mát Ubomeat - Tươi Sạch Từ Trang Trại
        </h4>

        <p className="text-[11px] text-gray-200 leading-relaxed">
          Được làm mát ngay sau khi sơ chế, duy trì liên tục ở dải nhiệt độ tối ưu giúp thớ thịt luôn mềm dẻo và giữ trọn vẹn vị ngọt thanh tự nhiên.
        </p>
      </div>
    </aside>
  );
}
