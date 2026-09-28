import { API_URL } from "@/lib/constants";
import { Product, CategoryItem } from "@/types/product";
import { MeatProduct } from "@/components/home/ProductCard";

export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
}

export interface BackendProduct {
  id: number;
  category?: BackendCategory;
  categoryId?: number;
  categoryName?: string;
  sku: string;
  slug?: string;
  name: string;
  brand?: string;
  origin?: string;
  standard?: string;
  unit?: string;
  packWeight?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  isWeighing?: boolean;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface BackendVoucher {
  id: number;
  code: string;
  description?: string;
  discountType: "PERCENT" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface CreateOrderPayload {
  orderCode?: string;
  channel?: "WEB" | "POS";
  userId?: number;
  cashierId?: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryMethod?: string;
  note?: string;
  totalAmount: number;
  shippingFee?: number;
  finalAmount: number;
  paymentMethod: string;
  orderStatus?: string;
  items: {
    productId: number;
    productName: string;
    packWeight?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    imageUrl?: string;
  }[];
  voucherCodes?: string[];
}

// Convert Backend Product to frontend Product
export function mapBackendProductToProduct(p: BackendProduct): Product {
  const priceNum = Number(p.price) || 0;
  const originalPriceNum = p.originalPrice ? Number(p.originalPrice) : undefined;
  let discountBadge: string | undefined = undefined;
  if (originalPriceNum && originalPriceNum > priceNum) {
    const pct = Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
    discountBadge = `-${pct}%`;
  }

  const standardLower = (p.standard || "vietgap").toLowerCase();
  const validStandards: Array<"vietgap" | "organic" | "euchill" | "oxyfresh"> = [
    "vietgap",
    "organic",
    "euchill",
    "oxyfresh",
  ];
  const standard = validStandards.includes(standardLower as any)
    ? (standardLower as "vietgap" | "organic" | "euchill" | "oxyfresh")
    : "vietgap";

  const packWeight = p.packWeight || (p.unit ? `Khay 300g` : "Khay 300g");
  let weightCat: "300g" | "500g" | "1kg" = "300g";
  if (packWeight.includes("500")) weightCat = "500g";
  else if (packWeight.includes("1kg") || packWeight.includes("1000")) weightCat = "1kg";

  const formattedUnitPrice = new Intl.NumberFormat("vi-VN").format(priceNum);

  return {
    id: p.id,
    slug: p.slug || p.sku?.toLowerCase() || `sp-${p.id}`,
    name: p.name,
    brand: p.brand || "UBOMEAT CHUẨN MÁT",
    categorySlug: p.category?.slug || "thit-heo-tuoi-mat",
    categoryName: p.category?.name || "Thịt Tươi Sạch",
    price: priceNum,
    originalPrice: originalPriceNum,
    unitPrice: `Đơn giá: ${formattedUnitPrice} đ/${p.unit || "khay"}`,
    packWeight: packWeight,
    stockStatus:
      p.stockQuantity > 0 ? `Còn ${p.stockQuantity} ${p.unit || "khay"}` : "Tạm hết hàng",
    rating: p.rating ? Number(p.rating) : 4.9,
    reviewCount: p.reviewCount || 36,
    badge: discountBadge ? `Sale ${discountBadge}` : "Chuẩn Mát 0-4°C",
    discountBadge,
    standard,
    weightCategory: weightCat,
    image:
      p.imageUrl ||
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  };
}

// Convert Product to MeatProduct for FeaturedProducts
export function mapProductToMeatProduct(p: Product): MeatProduct {
  let cat: "all" | "small" | "large" | "best" | "combo" = "all";
  if (p.categorySlug === "san-sale" || p.discountBadge) cat = "combo";
  else if (p.weightCategory === "300g") cat = "small";
  else if (p.weightCategory === "500g") cat = "large";
  else cat = "best";

  return {
    id: p.id,
    name: p.name,
    category: cat,
    price: p.price,
    originalPrice: p.originalPrice,
    unitPrice: p.unitPrice,
    packWeight: p.packWeight,
    stockStatus: p.stockStatus,
    discountBadge: p.discountBadge,
    tagBadge: p.badge || "VietGAP",
    image: p.image,
  };
}

export const storeService = {
  // 1. Get all products from API (with fallback)
  async getProducts(params?: { categorySlug?: string; keyword?: string }): Promise<Product[]> {
    try {
      let endpoint = `${API_URL}/products`;
      if (params?.categorySlug && params.categorySlug !== "all" && params.categorySlug !== "san-sale") {
        endpoint = `${API_URL}/products/category-slug/${params.categorySlug}`;
      } else if (params?.keyword) {
        endpoint = `${API_URL}/products/search?keyword=${encodeURIComponent(params.keyword)}`;
      }

      const res = await fetch(endpoint, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data) && data.length > 0) {
          return data.map(mapBackendProductToProduct);
        }
      }
    } catch (err) {
      console.warn("[storeService] getProducts failed:", err);
    }
    return [];
  },

  // 2. Get all categories from API (with fallback)
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data) && data.length > 0) {
          return data.map((c: BackendCategory) => ({
            slug: c.slug,
            name: c.name,
            icon: c.icon || "🥩",
            count: 24,
          }));
        }
      }
    } catch (err) {
      console.warn("[storeService] getCategories failed:", err);
    }
    return [];
  },

  // 3. Get Voucher by Code from API
  async getVoucherByCode(code: string): Promise<BackendVoucher | null> {
    try {
      const res = await fetch(`${API_URL}/vouchers/${encodeURIComponent(code)}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (err) {
      console.warn(`[storeService] getVoucherByCode(${code}) failed:`, err);
    }
    return null;
  },

  // 4. Create Order in API
  async createOrder(payload: CreateOrderPayload): Promise<any> {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Lỗi đặt hàng (${res.status})`);
    }

    const json = await res.json();
    return json.data || json;
  },
};
