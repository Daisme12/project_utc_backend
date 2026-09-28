"use client";

import React, { useState, useMemo } from "react";
import ProductListHeader from "./ProductListHeader";
import ProductFilterSidebar, { FilterState } from "./ProductFilterSidebar";
import ProductGridArea from "./ProductGridArea";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/products";

interface ProductCatalogClientProps {
  categorySlug?: string;
  initialSearch?: string;
}

export default function ProductCatalogClient({
  categorySlug = "",
  initialSearch = "",
}: ProductCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState<FilterState>({
    categorySlug,
    standards: [],
    priceRange: "all",
    minPrice: "",
    maxPrice: "",
    weights: [],
  });

  // Tìm danh mục hiện tại nếu có
  const currentCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === filters.categorySlug);
  }, [filters.categorySlug]);

  // Lọc sản phẩm theo danh mục và bộ lọc
  const categoryProducts = useMemo(() => {
    if (!filters.categorySlug) return MOCK_PRODUCTS;
    if (filters.categorySlug === "san-sale") {
      return MOCK_PRODUCTS.filter(
        (p) =>
          p.categorySlug === "san-sale" ||
          Boolean(p.discountBadge) ||
          (p.originalPrice && p.originalPrice > p.price)
      );
    }
    return MOCK_PRODUCTS.filter((p) => p.categorySlug === filters.categorySlug);
  }, [filters.categorySlug]);

  const handleReset = () => {
    setSearchQuery("");
    setFilters({
      categorySlug: "",
      standards: [],
      priceRange: "all",
      minPrice: "",
      maxPrice: "",
      weights: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Title */}
      <ProductListHeader
        categoryTitle={currentCategory?.name}
        totalCount={categoryProducts.length}
      />

      {/* 2. Main Content: Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Filter Sidebar */}
        <ProductFilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleReset}
          filteredCount={categoryProducts.length}
        />

        {/* Product Grid Area */}
        <ProductGridArea
          products={categoryProducts}
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleReset}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
}
