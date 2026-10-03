"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export interface PaymentMethodsCardProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  totalAmount?: number;
  orderCode?: string;
  onConfirmPayment?: () => void;
  isProcessing?: boolean;
}

export default function PaymentMethodsCard({
  selectedMethod,
  onSelectMethod,
  totalAmount = 0,
  orderCode = "UBO-ORDER",
  onConfirmPayment,
  isProcessing = false,
}: PaymentMethodsCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút (900s)

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "jcb">("visa");

  // Countdown timer cho mã thanh toán VNPAY
  useEffect(() => {
    if (selectedMethod !== "vnpay") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedMethod]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string, key: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedKey(key);
    toast.success(`Đã sao chép ${label}: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Card formatting handlers
  const handleCardNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardNumber(formatted);

    if (cleaned.startsWith("4")) setCardType("visa");
    else if (/^(5[1-5]|2[2-7])/.test(cleaned)) setCardType("mastercard");
    else if (/^(352[89]|35[3-8][0-9])/.test(cleaned)) setCardType("jcb");
    else setCardType("visa");
  };

  const handleExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleCvvChange = (val: string) => {
    setCardCvv(val.replace(/\D/g, "").slice(0, 3));
  };

  const handleFillTestCard = (type: "visa" | "mastercard") => {
    if (type === "visa") {
      setCardNumber("4532 8888 6666 9999");
      setCardHolder("LE VAN MUA HANG");
      setCardExpiry("12/28");
      setCardCvv("888");
      setCardType("visa");
      toast.info("Đã điền thông tin thẻ Visa Test");
    } else {
      setCardNumber("5412 7512 3412 7890");
      setCardHolder("LE VAN MUA HANG");
      setCardExpiry("09/27");
      setCardCvv("321");
      setCardType("mastercard");
      toast.info("Đã điền thông tin thẻ MasterCard Test");
    }
  };

  const handlePayCard = () => {
    const rawNumber = cardNumber.replace(/\s/g, "");
    if (rawNumber.length < 15) {
      toast.error("Vui lòng nhập số thẻ thanh toán hợp lệ (16 chữ số)");
      return;
    }
    if (!cardHolder.trim()) {
      toast.error("Vui lòng nhập tên in trên thẻ");
      return;
    }
    if (cardExpiry.length < 5) {
      toast.error("Vui lòng nhập hạn dùng thẻ dạng MM/YY");
      return;
    }
    if (cardCvv.length < 3) {
      toast.error("Vui lòng nhập mã bảo mật CVV (3 chữ số ở mặt sau)");
      return;
    }

    onConfirmPayment?.();
  };

  // VietQR Dynamic URL (chuẩn Napas247 - VNPAY)
  const qrAmount = Math.max(0, Math.round(totalAmount));
  const qrTransferMemo = orderCode;
  const vietQrUrl = `https://img.vietqr.io/image/VCB-9888899999-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(
    qrTransferMemo
  )}&accountName=CONG%20TY%20CP%20THUC%20PHAM%20UBOFOOD`;

  const methods = [
    {
      id: "vnpay",
      title: "VNPAY-QR / VietQR Chuyển khoản",
      badge: "Giảm 15k",
      desc: "Quét mã QR qua app Mobile Banking mọi ngân hàng, xác nhận tức thì",
      icon: "📱",
      tags: ["VCB", "MB", "Techcombank", "VietinBank"],
    },
    {
      id: "card",
      title: "Thẻ quốc tế Visa / MasterCard / JCB",
      desc: "Bảo mật mã hóa 3D-Secure 256-bit chuẩn quốc tế (Hỗ trợ thẻ nội địa & quốc tế)",
      icon: "💳",
      tags: ["VISA", "MC", "JCB"],
    },
    {
      id: "cod",
      title: "Thanh toán khi nhận hàng (COD)",
      desc: "Đồng kiểm tra độ tươi dẻo và nhiệt độ thùng lạnh trước khi thanh toán",
      badge: "Được kiểm hàng",
      badgeType: "green",
      icon: "🚚",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-xs space-y-4">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-black text-[#113a1b] dark:text-white flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
        <span className="flex items-center gap-2">
          <span>💳</span>
          <span>Phương thức thanh toán</span>
        </span>
        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
          An toàn & Bảo mật 100%
        </span>
      </h2>

      {/* Methods List */}
      <div className="space-y-3">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;

          return (
            <div
              key={m.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isSelected
                  ? "bg-[#f2faf3] dark:bg-emerald-950/20 border-[#195329] dark:border-emerald-600 shadow-xs ring-1 ring-[#195329]"
                  : "bg-white dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700 hover:border-emerald-300"
              }`}
            >
              {/* Radio Header Label */}
              <label
                onClick={() => onSelectMethod(m.id)}
                className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={isSelected}
                    onChange={() => onSelectMethod(m.id)}
                    className="mt-1 w-4 h-4 text-[#195329] focus:ring-emerald-500 border-gray-300 cursor-pointer flex-shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        {m.title}
                      </span>
                      {m.badge && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.badgeType === "green"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-[#195329] dark:text-emerald-300"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {m.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Right Tag/Icons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {m.tags &&
                    m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-700 text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </label>

              {/* EXPANDABLE SECTION FOR VNPAY */}
              {isSelected && m.id === "vnpay" && (
                <div className="px-4 pb-5 pt-1 border-t border-emerald-200/60 dark:border-emerald-900/60 bg-white dark:bg-zinc-900/80 animate-in fade-in duration-200">
                  {/* Status & Timer bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-xs mt-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                      </span>
                      <span className="font-bold text-[#195329] dark:text-emerald-300">
                        Mã QR VNPAY đã sẵn sàng
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-gray-600 dark:text-gray-300">
                      <span>⏱️ Hạn thanh toán:</span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 font-mono font-black text-xs border border-gray-200 dark:border-zinc-700">
                        {formatTimer(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* QR and Transfer Info */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Left: QR Code Box */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-inner text-center">
                      <div className="w-full flex items-center justify-between px-2 pb-2 border-b border-gray-200 dark:border-zinc-700 text-[10px] font-black uppercase text-[#195329] dark:text-emerald-400">
                        <span>VNPAY QR</span>
                        <span className="text-gray-400">VietQR Napas247</span>
                      </div>

                      {/* QR Image Frame */}
                      <div className="relative mt-2 p-2 bg-white rounded-xl shadow-xs border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vietQrUrl}
                          alt="Mã QR thanh toán VNPAY / VietQR"
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg mx-auto"
                        />
                      </div>

                      <p className="mt-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        Mở app Ngân hàng / VNPAY để quét mã
                      </p>
                    </div>

                    {/* Right: Bank Information Breakdown */}
                    <div className="md:col-span-7 space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700 space-y-2">
                        {/* Bank Name */}
                        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-zinc-700">
                          <span className="text-gray-500 dark:text-gray-400">Ngân hàng:</span>
                          <span className="font-extrabold text-gray-900 dark:text-white text-right">
                            Vietcombank (VCB)
                          </span>
                        </div>

                        {/* Account Number */}
                        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-zinc-700">
                          <span className="text-gray-500 dark:text-gray-400">Số tài khoản:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 dark:text-white font-mono text-sm tracking-wider">
                              9888899999
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy("9888899999", "acc", "Số tài khoản")}
                              className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold text-[10px] cursor-pointer"
                            >
                              {copiedKey === "acc" ? "✓ Đã chép" : "Sao chép"}
                            </button>
                          </div>
                        </div>

                        {/* Beneficiary Name */}
                        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-zinc-700">
                          <span className="text-gray-500 dark:text-gray-400">Chủ tài khoản:</span>
                          <span className="font-bold text-gray-900 dark:text-white uppercase text-[11px] text-right">
                            CÔNG TY CP THỰC PHẨM UBOFOOD
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-zinc-700">
                          <span className="text-gray-500 dark:text-gray-400">Số tiền:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-red-600 dark:text-red-400 text-sm">
                              {formatPrice(qrAmount)}đ
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(String(qrAmount), "amount", "Số tiền")}
                              className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold text-[10px] cursor-pointer"
                            >
                              {copiedKey === "amount" ? "✓ Đã chép" : "Sao chép"}
                            </button>
                          </div>
                        </div>

                        {/* Transfer Content / Order Code */}
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-500 dark:text-gray-400">Nội dung CK:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[#195329] dark:text-emerald-400 font-mono text-xs bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300/40">
                              {qrTransferMemo}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(qrTransferMemo, "memo", "Nội dung CK")}
                              className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#195329] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold text-[10px] cursor-pointer"
                            >
                              {copiedKey === "memo" ? "✓ Đã chép" : "Sao chép"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                        💡 <strong>Lưu ý:</strong> Sau khi quét mã chuyển khoản thành công trên app ngân hàng, vui lòng nhấn nút <strong>Xác nhận đã thanh toán</strong> bên dưới để hoàn tất đơn hàng.
                      </p>
                    </div>
                  </div>

                  {/* Primary Action Button: "Xác nhận đã thanh toán" */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      disabled={isProcessing || qrAmount <= 0}
                      onClick={() => onConfirmPayment?.()}
                      className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isProcessing || qrAmount <= 0
                          ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-[#195329] hover:bg-[#12421f] text-white shadow-emerald-950/20 active:scale-98 cursor-pointer"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Đang xác nhận đơn hàng...</span>
                        </>
                      ) : (
                        <>
                          <span>✓</span>
                          <span>XÁC NHẬN ĐÃ THANH TOÁN VNPAY</span>
                          <span>({formatPrice(qrAmount)}đ)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* CARD EXPANDABLE PAYMENT FORM */}
              {isSelected && m.id === "card" && (
                <div className="px-4 pb-5 pt-3 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 space-y-4 animate-in fade-in duration-200">
                  {/* Quick Fill Test Cards */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      💳 Thanh toán trực tuyến an toàn 3D-Secure
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">Điền nhanh:</span>
                      <button
                        type="button"
                        onClick={() => handleFillTestCard("visa")}
                        className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold hover:bg-blue-100 cursor-pointer"
                      >
                        Thẻ Visa Test
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillTestCard("mastercard")}
                        className="px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[10px] font-bold hover:bg-orange-100 cursor-pointer"
                      >
                        MasterCard Test
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Left: Interactive Card Preview */}
                    <div className="md:col-span-5 flex justify-center">
                      <div className="w-full max-w-xs p-5 rounded-2xl bg-gradient-to-tr from-[#0a2311] via-[#123e1e] to-[#1c5a2c] text-white shadow-xl border border-emerald-500/30 space-y-4">
                        <div className="flex justify-between items-center">
                          {/* Chip */}
                          <div className="w-9 h-6 rounded bg-gradient-to-br from-amber-300 to-amber-500 p-1 flex flex-col justify-around shadow-inner">
                            <div className="w-full h-0.5 bg-amber-700/50"></div>
                            <div className="w-full h-0.5 bg-amber-700/50"></div>
                          </div>
                          {/* Brand */}
                          <span className="font-black text-sm tracking-wider uppercase text-emerald-200">
                            {cardType.toUpperCase()}
                          </span>
                        </div>

                        <div className="font-mono text-base tracking-widest text-emerald-100">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </div>

                        <div className="flex justify-between items-end text-xs pt-1">
                          <div>
                            <span className="text-[9px] text-emerald-300/80 block uppercase tracking-wider">
                              CHỦ THẺ
                            </span>
                            <span className="font-bold tracking-wider uppercase text-[11px] truncate max-w-[120px] block">
                              {cardHolder || "TEN CHU THE"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-emerald-300/80 block uppercase tracking-wider">
                              HẠN DÙNG
                            </span>
                            <span className="font-bold font-mono text-[11px]">
                              {cardExpiry || "MM/YY"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Card Inputs */}
                    <div className="md:col-span-7 space-y-3 text-xs">
                      <div>
                        <label className="text-gray-600 dark:text-gray-300 font-bold block mb-1">
                          Số thẻ thanh toán <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="4532 •••• •••• ••••"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
                          />
                          <span className="absolute left-3 top-2.5 text-sm">💳</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-600 dark:text-gray-300 font-bold block mb-1">
                          Tên in trên thẻ (không dấu) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="NGUYEN VAN A"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-bold text-xs uppercase text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-600 dark:text-gray-300 font-bold block mb-1">
                            Ngày hết hạn <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="MM/YY (vd: 12/28)"
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
                          />
                        </div>

                        <div>
                          <label className="text-gray-600 dark:text-gray-300 font-bold block mb-1">
                            Mã bảo mật CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => handleCvvChange(e.target.value)}
                            placeholder="••• (3 số)"
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#195329]"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        🔒 Bảo mật SSL 256-bit chuẩn PCI DSS. Sau khi bấm thanh toán, ngân hàng sẽ gửi mã OTP qua tin nhắn SMS để xác thực giao dịch.
                      </p>
                    </div>
                  </div>

                  {/* Card Payment CTA Button */}
                  <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <button
                      type="button"
                      disabled={isProcessing || qrAmount <= 0}
                      onClick={handlePayCard}
                      className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isProcessing || qrAmount <= 0
                          ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-[#195329] hover:bg-[#12421f] text-white shadow-emerald-950/20 active:scale-98 cursor-pointer"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Đang xác thực bảo mật thẻ...</span>
                        </>
                      ) : (
                        <>
                          <span>💳</span>
                          <span>XÁC NHẬN THANH TOÁN QUA THẺ</span>
                          <span>({formatPrice(qrAmount)}đ)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
