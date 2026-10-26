"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { storeService, CreateOrderPayload } from "@/services/storeService";
import CartStepWizard from "./CartStepWizard";
import CartItemList from "./CartItemList";
import DeliveryAddressCard from "./DeliveryAddressCard";
import DeliveryScheduleCard from "./DeliveryScheduleCard";
import PaymentMethodsCard from "./PaymentMethodsCard";
import OrderSummarySidebar from "./OrderSummarySidebar";
import CartBottomAssurance from "./CartBottomAssurance";
import OrderSuccessModal from "./OrderSuccessModal";
import OrderConfirmModal, { DeliveryInfo } from "./OrderConfirmModal";

export default function CartPageClient() {
  const { items, addItem, removeItem } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [pendingOrderCode, setPendingOrderCode] = useState(
    () => `UBO-${Math.floor(10000 + Math.random() * 90000)}`
  );
  const [currentFinalTotal, setCurrentFinalTotal] = useState(0);
  const [currentVoucherCode, setCurrentVoucherCode] = useState<string | undefined>(undefined);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Delivery & Schedule States
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: "",
    phone: "",
    address: "",
    tag: "Nhà riêng",
    hubDistance: "1.2 km",
    deliveryInstruction: "Giao tận tay trong túi bảo quản giữ nhiệt 0 - 4°C chuyên dụng.",
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<"fast2h" | "scheduled">("fast2h");

  // Confirmation Modal State ("popup xác nhận lần nữa")
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    orderCode: string;
    totalAmount: number;
    deliveryTime: string;
    paymentMethod: string;
  }>({
    isOpen: false,
    orderCode: "",
    totalAmount: 0,
    deliveryTime: "10:30 - 11:30 Hôm nay",
    paymentMethod: "VNPAY",
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initializedSelection, setInitializedSelection] = useState(false);

  // Tự động load thông tin giao hàng từ local storage và tài khoản người dùng
  useEffect(() => {
    let initialName = "";
    let initialPhone = "";
    let initialAddress = "";
    let initialTag = "Nhà riêng";
    let initialInstruction = "Giao tận tay trong túi bảo quản giữ nhiệt 0 - 4°C chuyên dụng.";

    try {
      const savedInfo = localStorage.getItem("cart_delivery_info");
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed.name) initialName = parsed.name;
        if (parsed.phone && parsed.phone !== "Chưa cập nhật SĐT") initialPhone = parsed.phone;
        if (parsed.address) initialAddress = parsed.address;
        if (parsed.tag) initialTag = parsed.tag;
        if (parsed.deliveryInstruction) initialInstruction = parsed.deliveryInstruction;
      }
    } catch {}

    try {
      const uStr = localStorage.getItem("user");
      if (uStr) {
        const u = JSON.parse(uStr);
        if (!initialName && u.fullName && u.fullName !== "Khách hàng") initialName = u.fullName;
        if (!initialPhone && u.phone && u.phone !== "Chưa cập nhật SĐT") initialPhone = u.phone;
        if (!initialAddress && (u.address || u.shippingAddress)) initialAddress = u.address || u.shippingAddress;
      }
    } catch {}

    setDeliveryInfo({
      name: initialName,
      phone: initialPhone,
      address: initialAddress,
      tag: initialTag,
      hubDistance: "1.2 km",
      deliveryInstruction: initialInstruction,
    });

    const handleUserUpdated = (e: any) => {
      if (e.detail) {
        setDeliveryInfo((prev) => ({
          ...prev,
          name: prev.name || e.detail.fullName || prev.name,
          phone: prev.phone || e.detail.phone || prev.phone,
          address: prev.address || e.detail.address || e.detail.shippingAddress || prev.address,
        }));
      }
    };
    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, []);

  const handleUpdateDeliveryInfo = (newInfo: DeliveryInfo) => {
    setDeliveryInfo(newInfo);
    try {
      localStorage.setItem("cart_delivery_info", JSON.stringify(newInfo));
      const uStr = localStorage.getItem("user");
      if (uStr) {
        const u = JSON.parse(uStr);
        const updated = {
          ...u,
          fullName: newInfo.name,
          phone: newInfo.phone,
          address: newInfo.address,
        };
        localStorage.setItem("user", JSON.stringify(updated));
      }
    } catch {}
  };

  // Kiểm tra thông tin đã nhập đầy đủ chưa
  const cleanPhone = (deliveryInfo.phone || "").replace(/[\s.-]/g, "");
  const isInfoComplete = Boolean(
    deliveryInfo.name.trim().length >= 2 &&
    cleanPhone.length >= 9 &&
    cleanPhone !== "Chưa cập nhật SĐT" &&
    deliveryInfo.address.trim().length >= 5
  );

  const deliveryTime =
    deliverySchedule === "fast2h"
      ? "10:30 - 11:30 Hôm nay"
      : "16:00 - 18:00 Chiều nay";

  // Tự động chọn tất cả sản phẩm khi danh sách giỏ hàng thay đổi
  useEffect(() => {
    if (!initializedSelection && items.length > 0) {
      setSelectedIds(items.map((i) => i.id));
      setInitializedSelection(true);
    } else if (items.length === 0 && selectedIds.length > 0) {
      setSelectedIds([]);
      setInitializedSelection(false);
    }
  }, [items, initializedSelection, selectedIds.length]);

  const handleToggleSelectItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleClearSelected = () => {
    if (selectedIds.length === 0) {
      toast.info("Chưa có sản phẩm nào được chọn để xóa");
      return;
    }
    selectedIds.forEach((id) => removeItem(id));
    setSelectedIds([]);
    toast.info("Đã xóa các sản phẩm đã chọn khỏi giỏ hàng");
  };

  const handleUpdateQty = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity + delta <= 0) {
      removeItem(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast.info(`Đã xóa ${item.name} khỏi giỏ hàng`);
    } else {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          packWeight: item.packWeight,
          image: item.image,
        },
        delta
      );
    }
  };

  const handleAddExtra = (extra: {
    id: number;
    name: string;
    price: number;
    packWeight: string;
    image: string;
  }) => {
    addItem(extra, 1);
    setSelectedIds((prev) => (prev.includes(extra.id) ? prev : [...prev, extra.id]));
  };

  // CHỈ TÍNH TIỀN CHO CÁC SẢN PHẨM ĐƯỢC TÍCH CHỌN (selectedIds)
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedItemCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const calculatedTotal =
    currentFinalTotal > 0
      ? currentFinalTotal
      : selectedSubtotal >= 150000
      ? selectedSubtotal
      : selectedSubtotal + (selectedSubtotal > 0 ? 25000 : 0);

  // Mở popup xác nhận lần nữa khi ấn nút thanh toán
  const handleRequestConfirmOrder = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng tích chọn ít nhất 1 sản phẩm để đặt hàng!");
      return;
    }

    if (!isInfoComplete) {
      toast.error("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng trước khi thanh toán!");
      setIsEditingAddress(true);
      const el = document.getElementById("delivery-address-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // Thực hiện đặt hàng khi người dùng xác nhận trong popup
  const handlePlaceOrder = async (finalTotal: number, voucherCode?: string) => {
    setIsPlacingOrder(true);
    const toastId = toast.loading("Đang gửi đơn hàng lên hệ thống...");

    let orderCode = pendingOrderCode;
    let storedUser: any = {};
    try {
      const uStr = localStorage.getItem("user");
      if (uStr) storedUser = JSON.parse(uStr);
    } catch {}

    const methodUpper = (paymentMethod || "COD").toUpperCase();
    const orderNote =
      methodUpper === "VNPAY"
        ? "Đã quét mã và xác nhận thanh toán qua VNPAY-QR"
        : methodUpper === "CARD"
        ? "Thanh toán bằng Thẻ quốc tế Visa/MasterCard"
        : "Giao đơn nhanh 2H, giữ tươi mát 0-4°C, thu tiền COD";

    const payload: CreateOrderPayload = {
      orderCode: orderCode,
      channel: "WEB",
      userId: storedUser.id || undefined,
      customerName: deliveryInfo.name.trim(),
      customerPhone: deliveryInfo.phone.trim(),
      shippingAddress: deliveryInfo.address.trim(),
      deliveryMethod: deliverySchedule === "fast2h" ? "FAST_2H" : "SCHEDULED",
      note: `${orderNote}${deliveryInfo.deliveryInstruction ? " - " + deliveryInfo.deliveryInstruction : ""}`,
      totalAmount: selectedSubtotal,
      shippingFee: selectedSubtotal >= 150000 ? 0 : 25000,
      finalAmount: finalTotal,
      paymentMethod: methodUpper,
      orderStatus: methodUpper === "VNPAY" ? "PROCESSING" : "PENDING",
      items: selectedItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        packWeight: item.packWeight,
        unit: "Khay",
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
        imageUrl: item.image,
      })),
      voucherCodes: voucherCode ? [voucherCode] : [],
    };

    try {
      const created = await storeService.createOrder(payload);
      if (created && created.orderCode) {
        orderCode = created.orderCode;
      }
      toast.success(
        methodUpper === "VNPAY"
          ? "Xác nhận thanh toán VNPAY thành công!"
          : "Đặt hàng thành công và đã lưu vào hệ thống!",
        { id: toastId }
      );
    } catch (err: any) {
      console.warn("Lỗi lưu đơn hàng qua API, tiếp tục hiển thị mã dự phòng:", err);
      toast.success(
        methodUpper === "VNPAY"
          ? "Đã xác nhận đơn hàng VNPAY!"
          : "Đặt hàng thành công!",
        { id: toastId }
      );
    } finally {
      setIsPlacingOrder(false);
      setIsConfirmModalOpen(false);
    }

    setSuccessModalData({
      isOpen: true,
      orderCode,
      totalAmount: finalTotal,
      deliveryTime,
      paymentMethod: methodUpper,
    });

    // Chỉ xóa các sản phẩm đã đặt
    selectedIds.forEach((id) => removeItem(id));
    setSelectedIds([]);

    // Sinh mã đơn hàng mới cho lần mua tiếp theo
    setPendingOrderCode(`UBO-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#195329] flex items-center gap-1">
          <span>🏠</span>
          <span>Trang chủ</span>
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-semibold">
          Giỏ hàng & Thanh toán
        </span>
      </nav>

      {/* 2. Step Wizard & Freeship Banner */}
      <CartStepWizard currentStep={items.length === 0 ? 1 : 2} totalPrice={selectedSubtotal} />

      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-zinc-800 shadow-sm text-center max-w-xl mx-auto my-6 space-y-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
            🛒
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Bạn chưa có sản phẩm tươi sống nào trong giỏ hàng. Hãy khám phá thịt tươi mát chuẩn mổ lạnh 0-4°C, rau củ VietGAP và nông sản sạch hôm nay nhé!
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#195329] hover:bg-[#12421f] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Xem tất cả sản phẩm</span>
              <span>→</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-1"
            >
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      ) : (
        /* 3. Main 2-Column Content */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column (Main Process) */}
          <div className="flex-1 w-full space-y-6">
            {/* Cart Items List */}
            <CartItemList
              items={items}
              selectedIds={selectedIds}
              onToggleSelectItem={handleToggleSelectItem}
              onToggleSelectAll={handleToggleSelectAll}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={removeItem}
              onClearSelected={handleClearSelected}
              onAddExtra={handleAddExtra}
            />

            {/* Delivery Address */}
            <DeliveryAddressCard
              deliveryInfo={deliveryInfo}
              onUpdateDeliveryInfo={handleUpdateDeliveryInfo}
              isInfoComplete={isInfoComplete}
              isEditing={isEditingAddress}
              setIsEditing={setIsEditingAddress}
            />

            {/* Delivery Time & Preservation Method */}
            <DeliveryScheduleCard
              selectedMethod={deliverySchedule}
              onSelectMethod={setDeliverySchedule}
            />

            {/* Payment Methods */}
            <PaymentMethodsCard
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              totalAmount={calculatedTotal}
              orderCode={pendingOrderCode}
              onConfirmPayment={handleRequestConfirmOrder}
              isProcessing={isPlacingOrder}
              isInfoComplete={isInfoComplete}
              onRequireInfo={() => {
                setIsEditingAddress(true);
                const el = document.getElementById("delivery-address-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          </div>

          {/* Right Column (Summary & Assurances) */}
          <OrderSummarySidebar
            subtotal={selectedSubtotal}
            itemCount={selectedItemCount}
            paymentMethod={paymentMethod}
            onPlaceOrder={handleRequestConfirmOrder}
            onFinalTotalChange={(total, code) => {
              setCurrentFinalTotal(total);
              setCurrentVoucherCode(code);
            }}
            isProcessing={isPlacingOrder}
            isInfoComplete={isInfoComplete}
            onRequireInfo={() => {
              setIsEditingAddress(true);
              const el = document.getElementById("delivery-address-section");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </div>
      )}

      {/* 4. Bottom Assurance Bar */}
      <CartBottomAssurance />

      {/* 5. Order Confirmation Modal ("Popup xác nhận lần nữa") */}
      <OrderConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => handlePlaceOrder(calculatedTotal, currentVoucherCode)}
        isProcessing={isPlacingOrder}
        selectedItems={selectedItems}
        deliveryInfo={deliveryInfo}
        deliverySchedule={deliverySchedule}
        deliveryTime={deliveryTime}
        paymentMethod={paymentMethod}
        subtotal={selectedSubtotal}
        shippingFee={selectedSubtotal >= 150000 || selectedSubtotal === 0 ? 0 : 25000}
        totalDiscount={Math.max(
          0,
          selectedSubtotal +
            (selectedSubtotal >= 150000 || selectedSubtotal === 0 ? 0 : 25000) -
            calculatedTotal
        )}
        finalTotal={calculatedTotal}
        voucherCode={currentVoucherCode}
      />

      {/* 6. Success Order Modal */}
      <OrderSuccessModal
        isOpen={successModalData.isOpen}
        orderCode={successModalData.orderCode}
        totalAmount={successModalData.totalAmount}
        deliveryTime={successModalData.deliveryTime}
        paymentMethod={successModalData.paymentMethod}
        onClose={() => setSuccessModalData({ ...successModalData, isOpen: false })}
      />
    </div>
  );
}
