"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductListHeader from "./ProductListHeader";
import ProductFilterSidebar, { FilterState } from "./ProductFilterSidebar";
import ProductGridArea from "./ProductGridArea";
import { Product, CategoryItem } from "@/types/product";
import { storeService } from "@/services/storeService";

interface ProductCatalogClientProps {
  categorySlug?: string;
  initialSearch?: string;
}

export default function ProductCatalogClient({
  categorySlug = "",
  initialSearch = "",
}: ProductCatalogClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState<FilterState>({
    categorySlug,
    standards: [],
    priceRange: "all",
    minPrice: "",
    maxPrice: "",
    weights: [],
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      storeService.getProducts(),
      storeService.getCategories(),
    ]).then(([pList, cList]) => {
      if (!isMounted) return;
      if (pList && pList.length > 0) setProducts(pList);
      if (cList && cList.length > 0) setCategories(cList);
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Tìm danh mục hiện tại nếu có
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.slug === filters.categorySlug);
  }, [categories, filters.categorySlug]);

  // Lọc sản phẩm theo danh mục và bộ lọc
  const categoryProducts = useMemo(() => {
    if (!filters.categorySlug) return products;
    if (filters.categorySlug === "san-sale") {
      return products.filter(
        (p) =>
          p.categorySlug === "san-sale" ||
          Boolean(p.discountBadge) ||
          (p.originalPrice && p.originalPrice > p.price)
      );
    }
    return products.filter((p) => p.categorySlug === filters.categorySlug);
  }, [products, filters.categorySlug]);

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
          categories={categories}
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
