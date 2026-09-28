"use client";

import React, { useState, useEffect } from "react";
import ProductCard, { MeatProduct } from "./ProductCard";
import { storeService, mapProductToMeatProduct } from "@/services/storeService";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [apiProducts, setApiProducts] = useState<MeatProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    storeService.getProducts().then((res) => {
      if (isMounted && res && res.length > 0) {
        setApiProducts(res.map(mapProductToMeatProduct));
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    { id: "all", label: `Tất cả sản phẩm (${apiProducts.length || 24})` },
    { id: "sale", label: "🔥 Săn Sale Giờ Vàng" },
    { id: "small", label: "Khay nhỏ 300g" },
    { id: "large", label: "Khay lớn 500g" },
    { id: "best", label: "Thịt mát bán chạy" },
    { id: "combo", label: "Ưu đãi combo" },
  ];

  const defaultProducts: MeatProduct[] = [
    {
      id: 1,
      name: "Sườn Thăn Heo Truyền Thống",
      category: "small",
      discountBadge: "-8%",
      tagBadge: "VietGAP",
      packWeight: "Hộp 300g",
      stockStatus: "Còn 12 khay sáng",
      unitPrice: "Đơn giá: 238.700 đ/kg",
      price: 71600,
      originalPrice: 78000,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Ba Chỉ Heo Truyền Thống",
      category: "best",
      discountBadge: "-9%",
      tagBadge: "Bán chạy #1",
      packWeight: "Hộp 300g",
      stockStatus: "Còn 18 khay",
      unitPrice: "Đơn giá: 224.700 đ/kg",
      price: 67400,
      originalPrice: 74000,
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Thịt Xay Heo Truyền Thống",
      category: "small",
      tagBadge: "Tiện lợi",
      packWeight: "Hộp 300g",
      stockStatus: "Còn 21 khay",
      unitPrice: "Đơn giá: 179.000 đ/kg",
      price: 53700,
      image: "https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Móng Giò Trước Heo",
      category: "small",
      tagBadge: "Tươi Mới Sáng",
      packWeight: "Hộp 300g",
      stockStatus: "Còn 9 khay",
      unitPrice: "Đơn giá: 145.000 đ/kg",
      price: 43500,
      image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Thăn Bò Sạch Ubomeat",
      category: "best",
      tagBadge: "Thượng Hạng",
      packWeight: "Hộp 300g",
      stockStatus: "Còn 15 khay",
      unitPrice: "Đơn giá: 349.700 đ/kg",
      price: 104900,
      image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      name: "Nạc Vai Heo Truyền Thống",
      category: "small",
      tagBadge: "Mổ Sớm",
      packWeight: "Khay 300g",
      stockStatus: "Còn 31 khay",
      unitPrice: "Đơn giá: 190.300 đ/kg",
      price: 57100,
      image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 7,
      name: "Nạc Dăm Heo Truyền Thống",
      category: "small",
      discountBadge: "-6%",
      tagBadge: "Ưa chuộng",
      packWeight: "Khay 300g",
      stockStatus: "Còn 9 khay",
      unitPrice: "Đơn giá: 202.600 đ/kg",
      price: 60800,
      originalPrice: 65000,
      image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 8,
      name: "Trứng Gà Ta Thuần Việt",
      category: "combo",
      tagBadge: "Lòng đỏ đậm vị",
      packWeight: "Hộp 10 quả",
      stockStatus: "Thu hoạch rạng sáng",
      unitPrice: "Đơn giá: 4.200 đ/quả",
      price: 42000,
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 9,
      name: "Đậu Mơ Tươi Ngon Quê Mình",
      category: "small",
      tagBadge: "Thủ Công 100%",
      packWeight: "Hộp 300g",
      stockStatus: "Làm mới mỗi 4 giờ",
      unitPrice: "Đơn giá: 41.600 đ/kg",
      price: 20800,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 10,
      name: "Chân Gà Rút Xương Ubomeat",
      category: "combo",
      tagBadge: "Ăn Liền 1 Đổi 1",
      packWeight: "Khay 300g",
      stockStatus: "Còn 18 khay",
      unitPrice: "Đơn giá: 133.400 đ/kg",
      price: 66700,
      image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const activeProducts = apiProducts.length > 0 ? apiProducts : defaultProducts;

  const filteredProducts =
    activeTab === "all"
      ? activeProducts
      : activeTab === "sale"
      ? activeProducts.filter(
          (p) =>
            Boolean(p.discountBadge) ||
            Boolean(p.originalPrice) ||
            p.category === "combo"
        )
      : activeProducts.filter(
          (p) =>
            p.category === activeTab ||
            (activeTab === "small" && p.packWeight.includes("300g"))
        );

  return (
    <section id="meat" className="mt-10 sm:mt-12">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#195329] dark:text-emerald-400 tracking-wider uppercase">
            <span>❄️</span>
            <span>TIÊU CHUẨN MỔ LẠNH KHÉP KÍN 0 - 4°C</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#113a1b] dark:text-white tracking-tight">
            Thịt Heo Tươi Mát & Thực Phẩm Hôm Nay
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#195329] text-white shadow-xs"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5-Column Product Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
