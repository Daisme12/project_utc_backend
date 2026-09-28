"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart, CartItem } from "@/context/CartContext";
import CartStepWizard from "./CartStepWizard";
import CartItemList from "./CartItemList";
import DeliveryAddressCard from "./DeliveryAddressCard";
import DeliveryScheduleCard from "./DeliveryScheduleCard";
import PaymentMethodsCard from "./PaymentMethodsCard";
import OrderSummarySidebar from "./OrderSummarySidebar";
import CartBottomAssurance from "./CartBottomAssurance";
import OrderSuccessModal from "./OrderSuccessModal";

export default function CartPageClient() {
  const { items, addItem, removeItem, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    orderCode: string;
    totalAmount: number;
    deliveryTime: string;
  }>({
    isOpen: false,
    orderCode: "",
    totalAmount: 0,
    deliveryTime: "10:30 - 11:30 Hôm nay",
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initializedSelection, setInitializedSelection] = useState(false);

  // Khởi tạo 3 sản phẩm mẫu chuẩn theo thiết kế nếu giỏ hàng ban đầu trống
  useEffect(() => {
    if (items.length === 0) {
      addItem(
        {
          id: 1,
          name: "Sườn Thăn Heo Truyền Thống Ubomeat",
          price: 71600,
          packWeight: "Khay 300g",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        },
        1
      );
      addItem(
        {
          id: 2,
          name: "Ba Chỉ Heo Truyền Thống Ubomeat",
          price: 67400,
          packWeight: "Khay 300g",
          image:
            "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=80",
        },
        1
      );
      addItem(
        {
          id: 3,
          name: "Thịt Xay Heo Truyền Thống Ubomeat",
          price: 53700,
          packWeight: "Khay 300g",
          image:
            "https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=400&q=80",
        },
        1
      );
    }
  }, []); // Run once on mount

  // Tự động chọn tất cả sản phẩm khi lần đầu mở giỏ hàng
  useEffect(() => {
    if (!initializedSelection && items.length > 0) {
      setSelectedIds(items.map((i) => i.id));
      setInitializedSelection(true);
    }
  }, [items, initializedSelection]);

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

  const handlePlaceOrder = (finalTotal: number) => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng tích chọn ít nhất 1 sản phẩm để đặt hàng!");
      return;
    }
    const randomCode = `UBO-${Math.floor(1000 + Math.random() * 9000)}`;
    setSuccessModalData({
      isOpen: true,
      orderCode: randomCode,
      totalAmount: finalTotal,
      deliveryTime: "10:30 - 11:30 Hôm nay",
    });
    // Chỉ xóa các sản phẩm đã đặt
    selectedIds.forEach((id) => removeItem(id));
    setSelectedIds([]);
    toast.success("Đặt hàng thành công!");
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
      <CartStepWizard currentStep={2} totalPrice={selectedSubtotal} />

      {/* 3. Main 2-Column Content */}
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
          <DeliveryAddressCard />

          {/* Delivery Time & Preservation Method */}
          <DeliveryScheduleCard />

          {/* Payment Methods */}
          <PaymentMethodsCard
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
          />
        </div>

        {/* Right Column (Summary & Assurances) */}
        <OrderSummarySidebar
          subtotal={selectedSubtotal}
          itemCount={selectedItemCount}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>

      {/* 4. Bottom Assurance Bar */}
      <CartBottomAssurance />

      {/* 5. Success Order Modal */}
      <OrderSuccessModal
        isOpen={successModalData.isOpen}
        orderCode={successModalData.orderCode}
        totalAmount={successModalData.totalAmount}
        deliveryTime={successModalData.deliveryTime}
        onClose={() => setSuccessModalData({ ...successModalData, isOpen: false })}
      />
    </div>
  );
}
