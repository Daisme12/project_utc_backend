import { API_URL } from "@/lib/constants";

// Types
export interface AdminProduct {
  id: number;
  categoryId?: number;
  categoryName?: string;
  sku: string;
  slug: string;
  name: string;
  brand?: string;
  origin?: string;
  standard?: string;
  unit: string;
  packWeight?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  isWeighing?: boolean;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
}

export interface AdminOrderItem {
  id?: number;
  productId: number;
  productName: string;
  packWeight?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
}

export interface AdminOrderVoucher {
  id?: number;
  voucherCode: string;
  discountAmount: number;
}

export interface AdminOrder {
  id: number;
  orderCode: string;
  channel: "WEB" | "POS";
  userId?: number;
  cashierId?: number;
  customerName: string;
  customerPhone?: string;
  shippingAddress?: string;
  deliveryMethod?: string;
  note?: string;
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  orderStatus: "PENDING" | "PROCESSING" | "DELIVERING" | "COMPLETED" | "CANCELLED";
  isPrinted: boolean;
  createdAt: string;
  items: AdminOrderItem[];
  vouchers?: AdminOrderVoucher[];
}

export interface AdminGoodsReceipt {
  id: number;
  receiptCode: string;
  supplierId: number;
  supplierName?: string;
  productId: number;
  productName?: string;
  batchNumber?: string;
  expDate?: string;
  quantity: number;
  importPrice: number;
  totalCost: number;
  note?: string;
  createdAt: string;
}

export interface AdminSupplier {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface AdminVoucher {
  id: number;
  code: string;
  badge?: string;
  title: string;
  discountType: "PERCENT" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  role: "ADMIN" | "CASHIER" | "CUSTOMER";
  accumulatedPoints?: number;
  isActive: boolean;
  createdAt: string;
}

// Fallback Mock Data
const MOCK_CATEGORIES: AdminCategory[] = [
  { id: 1, name: "Săn Sale Giờ Vàng", slug: "san-sale", icon: "🔥", description: "Ưu đãi sốc giờ vàng mỗi ngày giảm tới 50%", displayOrder: 1, isActive: true },
  { id: 2, name: "Thịt Heo Tươi Mát", slug: "thit-heo-tuoi-mat", icon: "🥩", description: "Thịt heo sạch chuẩn VietGAP bảo quản lạnh 0-4°C", displayOrder: 2, isActive: true },
  { id: 3, name: "Thịt Bò Úc Chuẩn Mát", slug: "thit-bo-uc", icon: "🥩", description: "Bò Úc nhập khẩu mát nguyên tảng cắt tươi hàng ngày", displayOrder: 3, isActive: true },
  { id: 4, name: "Thủy Hải Sản Tươi Sống", slug: "thuy-hai-san-tuoi", icon: "🦐", description: "Hải sản tươi rói giao sống tận nhà", displayOrder: 4, isActive: true },
  { id: 5, name: "Trứng & Gia Cầm Thả Vườn", slug: "trung-gia-cam", icon: "🥚", description: "Gà ta thả đồi và trứng gà tươi sạch mỗi sáng", displayOrder: 5, isActive: true },
  { id: 6, name: "Rau Củ Chuẩn VietGAP", slug: "rau-cu-vietgap", icon: "🥬", description: "Rau củ hữu cơ chuẩn VietGAP hái tươi mỗi sáng", displayOrder: 6, isActive: true },
  { id: 7, name: "Đậu Hũ & Thực Phẩm Sơ Chế", slug: "dau-hu-so-che", icon: "🥢", description: "Đậu hũ truyền thống và các món ăn sơ chế sẵn tiện lợi", displayOrder: 7, isActive: true },
];

const MOCK_PRODUCTS: AdminProduct[] = [
  { id: 1, categoryId: 1, categoryName: "Săn Sale Giờ Vàng", sku: "COMBO-25M", slug: "combo-gia-dinh-so-che", name: "Combo Gia Đình Sơ Chế Mâm Cơm 25 Phút", brand: "UBOFOOD TIỆN LỢI", origin: "Ba Vì, Hà Nội", standard: "euchill", unit: "Khay", packWeight: "Khay lớn 1kg", price: 182000, originalPrice: 215000, stockQuantity: 50, isWeighing: false, rating: 5.0, reviewCount: 312, imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 2, categoryId: 1, categoryName: "Săn Sale Giờ Vàng", sku: "BOUC-FS500", slug: "ba-chi-bo-uc-flash-sale", name: "Ba Chỉ Bò Úc Cuộn Nhúng Lẩu Chuẩn Mát", brand: "UBOMEAT BÒ ÚC", origin: "Nhập khẩu Úc", standard: "euchill", unit: "Khay", packWeight: "Khay 500g", price: 89000, originalPrice: 135000, stockQuantity: 35, isWeighing: false, rating: 4.9, reviewCount: 189, imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 3, categoryId: 2, categoryName: "Thịt Heo Tươi Mát", sku: "HEO-SUON-300", slug: "suon-than-heo-truyen-thong", name: "Sườn Thăn Heo Truyền Thống", brand: "UBOMEAT CHUẨN MÁT", origin: "Hà Nam", standard: "vietgap", unit: "Khay", packWeight: "Khay 300g", price: 71600, originalPrice: 78000, stockQuantity: 80, isWeighing: false, rating: 4.9, reviewCount: 128, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 4, categoryId: 2, categoryName: "Thịt Heo Tươi Mát", sku: "HEO-BACHI-300", slug: "ba-chi-heo-truyen-thong", name: "Ba Chỉ Heo Truyền Thống", brand: "UBOMEAT CHUẨN MÁT", origin: "Hà Nam", standard: "euchill", unit: "Khay", packWeight: "Khay 300g", price: 67400, originalPrice: 74000, stockQuantity: 75, isWeighing: false, rating: 5.0, reviewCount: 242, imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 5, categoryId: 2, categoryName: "Thịt Heo Tươi Mát", sku: "HEO-XAY-300", slug: "thit-xay-heo-truyen-thong", name: "Thịt Xay Heo Truyền Thống", brand: "UBOMEAT XAY SẠCH", origin: "Hà Nam", standard: "oxyfresh", unit: "Khay", packWeight: "Khay 300g", price: 53700, originalPrice: 58000, stockQuantity: 60, isWeighing: false, rating: 4.8, reviewCount: 96, imageUrl: "https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 7, categoryId: 3, categoryName: "Thịt Bò Úc Chuẩn Mát", sku: "BO-THAN-300", slug: "than-bo-sach-ubomeat", name: "Thăn Bò Sạch Ubomeat", brand: "UBOMEAT BÒ ÚC", origin: "Nhập khẩu Úc", standard: "euchill", unit: "Khay", packWeight: "Khay 300g", price: 104900, originalPrice: 120000, stockQuantity: 40, isWeighing: false, rating: 5.0, reviewCount: 178, imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 10, categoryId: 5, categoryName: "Trứng & Gia Cầm Thả Vườn", sku: "GA-TRUNGTA-10P", slug: "trung-ga-ta-thuan-viet", name: "Trứng Gà Ta Thuần Việt", brand: "UBOFARM GIA CẦM", origin: "Ba Vì, Hà Nội", standard: "organic", unit: "Hộp", packWeight: "Hộp 10 quả", price: 42000, originalPrice: 46000, stockQuantity: 150, isWeighing: false, rating: 5.0, reviewCount: 210, imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 13, categoryId: 4, categoryName: "Thủy Hải Sản Tươi Sống", sku: "CA-HOINAUY-250", slug: "ca-hoi-nauy-tuoi-fillet", name: "Cá Hồi Na Uy Tươi Fillet", brand: "UBOSEAHẢI SẢN", origin: "Nhập khẩu Na Uy", standard: "euchill", unit: "Khay", packWeight: "Khay 250g", price: 135000, originalPrice: 155000, stockQuantity: 40, isWeighing: false, rating: 5.0, reviewCount: 312, imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 14, categoryId: 4, categoryName: "Thủy Hải Sản Tươi Sống", sku: "TOM-THECT-500", slug: "tom-the-chan-trang-song", name: "Tôm Thẻ Chân Trắng Sống", brand: "UBOSEAHẢI SẢN", origin: "Quảng Ninh", standard: "vietgap", unit: "Hộp", packWeight: "Hộp 500g", price: 115000, originalPrice: 130000, stockQuantity: 50, isWeighing: false, rating: 4.9, reviewCount: 167, imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80", isActive: true },
  { id: 15, categoryId: 6, categoryName: "Rau Củ Chuẩn VietGAP", sku: "RAU-BOXOI-500", slug: "cai-bo-xoi-thuy-canh-vietgap", name: "Cải Bó Xôi Thủy Canh VietGAP", brand: "UBOFARM ĐÀ LẠT", origin: "Đà Lạt, Lâm Đồng", standard: "vietgap", unit: "Túi", packWeight: "Túi 500g", price: 28000, originalPrice: 32000, stockQuantity: 100, isWeighing: false, rating: 4.9, reviewCount: 159, imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80", isActive: true },
];

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: 1,
    orderCode: "UBO-WEB-20260928",
    channel: "WEB",
    userId: 3,
    customerName: "Lê Văn Mua Hàng",
    customerPhone: "0966666666",
    shippingAddress: "Tòa Keangnam Landmark 72, Nam Từ Liêm, Hà Nội",
    deliveryMethod: "FAST_2H",
    note: "Gửi bảo vệ sảnh A, gọi điện trước khi đến 5 phút",
    totalAmount: 253600,
    shippingFee: 25000,
    finalAmount: 203600,
    paymentMethod: "COD",
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    isPrinted: true,
    createdAt: "2026-09-28T09:30:00",
    items: [
      { productId: 2, productName: "Ba Chỉ Bò Úc Cuộn Nhúng Lẩu Chuẩn Mát", packWeight: "Khay 500g", unit: "Khay", quantity: 2, unitPrice: 89000, subtotal: 178000, imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80" },
      { productId: 3, productName: "Sườn Thăn Heo Truyền Thống", packWeight: "Khay 300g", unit: "Khay", quantity: 1, unitPrice: 71600, subtotal: 71600, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" }
    ],
    vouchers: [
      { voucherCode: "GIAM50K", discountAmount: 50000 },
      { voucherCode: "FREESHIP2H", discountAmount: 25000 }
    ]
  },
  {
    id: 2,
    orderCode: "UBO-WEB-20260929",
    channel: "WEB",
    userId: 4,
    customerName: "Hoàng Thị Mai",
    customerPhone: "0912345678",
    shippingAddress: "Số 15 phố Chùa Láng, Đống Đa, Hà Nội",
    deliveryMethod: "FAST_2H",
    note: "Giao tầng 3 chung cư, gọi trước",
    totalAmount: 250000,
    shippingFee: 25000,
    finalAmount: 250000,
    paymentMethod: "VNPAY",
    paymentStatus: "PAID",
    orderStatus: "PROCESSING",
    isPrinted: false,
    createdAt: "2026-09-28T14:15:00",
    items: [
      { productId: 13, productName: "Cá Hồi Na Uy Tươi Fillet", packWeight: "Khay 250g", unit: "Khay", quantity: 1, unitPrice: 135000, subtotal: 135000, imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
      { productId: 14, productName: "Tôm Thẻ Chân Trắng Sống", packWeight: "Hộp 500g", unit: "Hộp", quantity: 1, unitPrice: 115000, subtotal: 115000, imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80" }
    ],
    vouchers: [
      { voucherCode: "FREESHIP2H", discountAmount: 25000 }
    ]
  },
  {
    id: 3,
    orderCode: "UBO-POS-1001",
    channel: "POS",
    userId: 3,
    cashierId: 2,
    customerName: "Lê Văn Mua Hàng",
    customerPhone: "0966666666",
    shippingAddress: "Mua trực tiếp tại quầy Ubofood Cầu Giấy",
    deliveryMethod: "TAKE_AWAY",
    note: "Khách thanh toán tiền mặt tại quầy",
    totalAmount: 113600,
    shippingFee: 0,
    finalAmount: 113600,
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    isPrinted: true,
    createdAt: "2026-09-28T16:40:00",
    items: [
      { productId: 3, productName: "Sườn Thăn Heo Truyền Thống", packWeight: "Khay 300g", unit: "Khay", quantity: 1, unitPrice: 71600, subtotal: 71600, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
      { productId: 10, productName: "Trứng Gà Ta Thuần Việt", packWeight: "Hộp 10 quả", unit: "Hộp", quantity: 1, unitPrice: 42000, subtotal: 42000, imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80" }
    ]
  }
];

const MOCK_SUPPLIERS: AdminSupplier[] = [
  { id: 1, name: "Tập Đoàn Nông Nghiệp Ba Vì Clean Farm", phone: "0243888999", address: "Huyện Ba Vì, TP. Hà Nội", isActive: true },
  { id: 2, name: "Trang Trại Chăn Nuôi Heo Chuẩn VietGAP Hà Nam", phone: "0226388776", address: "Thị xã Duy Tiên, Tỉnh Hà Nam", isActive: true },
  { id: 3, name: "Hợp Tác Xã Nông Sản Hữu Cơ Mộc Châu", phone: "0212389966", address: "Thị trấn Nông trường Mộc Châu, Tỉnh Sơn La", isActive: true },
  { id: 4, name: "Vựa Thủy Hải Sản Sạch Cát Bà - Quảng Ninh", phone: "0203387799", address: "Cảng cá Hạ Long, TP. Hạ Long, Tỉnh Quảng Ninh", isActive: true }
];

const MOCK_GOODS_RECEIPTS: AdminGoodsReceipt[] = [
  { id: 1, receiptCode: "GR-20260928-01", supplierId: 1, supplierName: "Ba Vì Clean Farm", productId: 2, productName: "Ba Chỉ Bò Úc Cuộn Nhúng Lẩu Chuẩn Mát", batchNumber: "LOT-OXY-8921", expDate: "2026-10-05", quantity: 50, importPrice: 65000, totalCost: 3250000, note: "Nhập thịt bò Úc tươi đóng khay OxyFresh tiêu chuẩn lạnh 0 - 4°C", createdAt: "2026-09-28T07:15:00" },
  { id: 2, receiptCode: "GR-20260928-02", supplierId: 2, supplierName: "Heo VietGAP Hà Nam", productId: 3, productName: "Sườn Thăn Heo Truyền Thống", batchNumber: "LOT-PORK-3312", expDate: "2026-10-03", quantity: 100, importPrice: 52000, totalCost: 5200000, note: "Nhập sườn thăn heo tươi chuẩn VietGAP", createdAt: "2026-09-28T08:00:00" },
  { id: 3, receiptCode: "GR-20260928-03", supplierId: 4, supplierName: "Hải Sản Cát Bà", productId: 13, productName: "Cá Hồi Na Uy Tươi Fillet", batchNumber: "LOT-SALMON-771", expDate: "2026-10-02", quantity: 40, importPrice: 98000, totalCost: 3920000, note: "Nhập cá hồi Na Uy tươi fillet ướp đá lạnh chuyên dụng", createdAt: "2026-09-28T08:45:00" }
];

const MOCK_VOUCHERS: AdminVoucher[] = [
  { id: 1, code: "GIAM50K", badge: "HOT -50%", title: "Giảm 50.000đ cho đơn hàng thực phẩm mát đầu tiên từ 150.000đ", discountType: "FIXED_AMOUNT", discountValue: 50000, minOrderAmount: 150000, startDate: "2026-09-01T00:00:00", endDate: "2026-12-31T23:59:59", isActive: true },
  { id: 2, code: "FREESHIP2H", badge: "FREESHIP", title: "Miễn phí vận chuyển hỏa tốc 2 giờ (-25.000đ) cho đơn từ 150.000đ", discountType: "FIXED_AMOUNT", discountValue: 25000, minOrderAmount: 150000, startDate: "2026-09-01T00:00:00", endDate: "2026-12-31T23:59:59", isActive: true },
  { id: 3, code: "UBOMEAT", badge: "-20K", title: "Giảm 20.000đ trực tiếp khi mua các loại thịt bò Úc & heo mát", discountType: "FIXED_AMOUNT", discountValue: 20000, minOrderAmount: 100000, startDate: "2026-09-01T00:00:00", endDate: "2026-12-31T23:59:59", isActive: true },
  { id: 4, code: "UBOCHAOXUAN", badge: "-10K", title: "Giảm 10.000đ chào bạn mới mua sắm tại Ubofood", discountType: "FIXED_AMOUNT", discountValue: 10000, minOrderAmount: 0, startDate: "2026-09-01T00:00:00", endDate: "2026-12-31T23:59:59", isActive: true }
];

const MOCK_USERS: AdminUser[] = [
  { id: 1, username: "admin", fullName: "Nguyễn Quản Trị", phone: "0988888888", email: "admin@utc.edu.vn", role: "ADMIN", accumulatedPoints: 500, isActive: true, createdAt: "2026-09-01T08:00:00" },
  { id: 2, username: "thungan01", fullName: "Trần Thị Thu Ngân", phone: "0977777777", email: "cashier01@utc.edu.vn", role: "CASHIER", accumulatedPoints: 100, isActive: true, createdAt: "2026-09-02T09:00:00" },
  { id: 3, username: "khachhang01", fullName: "Lê Văn Mua Hàng", phone: "0966666666", email: "customer01@gmail.com", role: "CUSTOMER", accumulatedPoints: 250, isActive: true, createdAt: "2026-09-10T14:30:00" },
  { id: 4, username: "khachhang02", fullName: "Hoàng Thị Mai", phone: "0912345678", email: "customer02@gmail.com", role: "CUSTOMER", accumulatedPoints: 80, isActive: true, createdAt: "2026-09-15T11:20:00" }
];

// Helper Fetch wrapper with timeout and fallback
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<{ data: T; isFallback: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      return { data: json.data !== undefined ? json.data : json, isFallback: false };
    }
    throw new Error(`HTTP Error ${res.status}`);
  } catch (err) {
    console.warn(`[adminService] API call to ${url} failed, using fallback data.`, err);
    return { data: fallbackData as T, isFallback: true };
  }
}

// Admin Service API
export const adminService = {
  // Check health
  async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/health`, { cache: "no-store", signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 1. Dashboard
  async getDashboardStats() {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      this.getProducts(),
      this.getOrders(),
      this.getUsers()
    ]);

    const sortedOrders = [...ordersRes.data].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) {
        return timeB - timeA;
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.orderStatus === "COMPLETED" ? order.finalAmount : 0), 0);
    const completedOrders = ordersRes.data.filter(o => o.orderStatus === "COMPLETED").length;
    const pendingOrders = ordersRes.data.filter(o => o.orderStatus === "PENDING" || o.orderStatus === "PROCESSING").length;
    const lowStockProducts = productsRes.data.filter(p => p.stockQuantity <= 40).length;

    return {
      totalRevenue,
      totalOrders: ordersRes.data.length,
      completedOrders,
      pendingOrders,
      totalProducts: productsRes.data.length,
      lowStockProducts,
      totalUsers: usersRes.data.length,
      recentOrders: sortedOrders.slice(0, 5),
      isFallback: productsRes.isFallback || ordersRes.isFallback
    };
  },

  // 2. Products
  async getProducts() {
    const res = await fetchWithFallback<any[]>(`${API_URL}/products`, { method: "GET" }, MOCK_PRODUCTS);
    const normalized: AdminProduct[] = (res.data || []).map((p: any) => ({
      ...p,
      categoryId: p.categoryId ?? p.category?.id,
      categoryName: p.categoryName ?? p.category?.name,
    }));
    return { data: normalized, isFallback: res.isFallback };
  },

  async createProduct(dto: Partial<AdminProduct>) {
    return fetchWithFallback<AdminProduct>(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, { ...MOCK_PRODUCTS[0], id: Date.now(), ...dto } as AdminProduct);
  },

  async updateProduct(id: number, dto: Partial<AdminProduct>) {
    return fetchWithFallback<AdminProduct>(`${API_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto)
    }, { ...MOCK_PRODUCTS[0], id, ...dto } as AdminProduct);
  },

  async deleteProduct(id: number) {
    return fetchWithFallback<string>(`${API_URL}/products/${id}`, { method: "DELETE" }, "SUCCESS");
  },

  // 3. Orders
  async getOrders() {
    const res = await fetchWithFallback<any[]>(`${API_URL}/orders`, { method: "GET" }, MOCK_ORDERS);
    const normalized: AdminOrder[] = (res.data || []).map((o: any) => ({
      ...o,
      userId: o.userId ?? o.user?.id,
      cashierId: o.cashierId ?? o.cashier?.id,
      customerName: o.customerName || o.user?.fullName || "Khách Hàng",
      customerPhone: o.customerPhone || o.user?.phone || "",
    })).sort((a: any, b: any) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) {
        return timeB - timeA;
      }
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
    return { data: normalized, isFallback: res.isFallback };
  },

  async createOrder(dto: Partial<AdminOrder>) {
    const res = await fetchWithFallback<any>(`${API_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, {
      ...MOCK_ORDERS[0],
      id: Date.now(),
      orderCode: dto.orderCode || `UBO-POS-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      ...dto
    } as AdminOrder);

    const o = res.data;
    const normalized: AdminOrder = {
      ...o,
      userId: o?.userId ?? o?.user?.id,
      cashierId: o?.cashierId ?? o?.cashier?.id,
      customerName: o?.customerName || o?.user?.fullName || dto.customerName || "Khách Hàng",
      customerPhone: o?.customerPhone || o?.user?.phone || dto.customerPhone || "",
    };
    return { data: normalized, isFallback: res.isFallback };
  },

  async updateOrderStatus(id: number, status: string) {
    const res = await fetchWithFallback<any>(`${API_URL}/orders/${id}/status?status=${status}`, { method: "PUT" }, {
      ...MOCK_ORDERS[0],
      id,
      orderStatus: status as AdminOrder["orderStatus"]
    });

    const o = res.data;
    const normalized: AdminOrder = {
      ...o,
      userId: o?.userId ?? o?.user?.id,
      cashierId: o?.cashierId ?? o?.cashier?.id,
      customerName: o?.customerName || o?.user?.fullName || "Khách Hàng",
      customerPhone: o?.customerPhone || o?.user?.phone || "",
    };
    return { data: normalized, isFallback: res.isFallback };
  },

  async markOrderAsPrinted(id: number) {
    return fetchWithFallback<string>(`${API_URL}/orders/${id}/print`, { method: "POST" }, "SUCCESS");
  },

  // 4. Categories
  async getCategories() {
    return fetchWithFallback<AdminCategory[]>(`${API_URL}/categories`, { method: "GET" }, MOCK_CATEGORIES);
  },

  async createCategory(dto: Partial<AdminCategory>) {
    return fetchWithFallback<AdminCategory>(`${API_URL}/categories`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, { ...MOCK_CATEGORIES[0], id: Date.now(), ...dto } as AdminCategory);
  },

  async updateCategory(id: number, dto: Partial<AdminCategory>) {
    return fetchWithFallback<AdminCategory>(`${API_URL}/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto)
    }, { ...MOCK_CATEGORIES[0], id, ...dto } as AdminCategory);
  },

  async deleteCategory(id: number) {
    return fetchWithFallback<string>(`${API_URL}/categories/${id}`, { method: "DELETE" }, "SUCCESS");
  },

  // 5. Goods Receipts
  async getGoodsReceipts() {
    return fetchWithFallback<AdminGoodsReceipt[]>(`${API_URL}/goods-receipts`, { method: "GET" }, MOCK_GOODS_RECEIPTS);
  },

  async createGoodsReceipt(dto: Partial<AdminGoodsReceipt>) {
    return fetchWithFallback<AdminGoodsReceipt>(`${API_URL}/goods-receipts?createdByUserId=1`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, { ...MOCK_GOODS_RECEIPTS[0], id: Date.now(), ...dto } as AdminGoodsReceipt);
  },

  // 6. Suppliers
  async getSuppliers() {
    return fetchWithFallback<AdminSupplier[]>(`${API_URL}/suppliers`, { method: "GET" }, MOCK_SUPPLIERS);
  },

  async createSupplier(dto: Partial<AdminSupplier>) {
    return fetchWithFallback<AdminSupplier>(`${API_URL}/suppliers`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, { ...MOCK_SUPPLIERS[0], id: Date.now(), ...dto } as AdminSupplier);
  },

  async deleteSupplier(id: number) {
    return fetchWithFallback<string>(`${API_URL}/suppliers/${id}`, { method: "DELETE" }, "SUCCESS");
  },

  // 7. Vouchers
  async getVouchers() {
    return fetchWithFallback<AdminVoucher[]>(`${API_URL}/vouchers`, { method: "GET" }, MOCK_VOUCHERS);
  },

  async createVoucher(dto: Partial<AdminVoucher>) {
    return fetchWithFallback<AdminVoucher>(`${API_URL}/vouchers`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, { ...MOCK_VOUCHERS[0], id: Date.now(), ...dto } as AdminVoucher);
  },

  async deleteVoucher(id: number) {
    return fetchWithFallback<string>(`${API_URL}/vouchers/${id}`, { method: "DELETE" }, "SUCCESS");
  },

  // 8. Users
  async getUsers() {
    return fetchWithFallback<AdminUser[]>(`${API_URL}/users`, { method: "GET" }, MOCK_USERS);
  },

  async createUser(dto: Partial<AdminUser>) {
    return fetchWithFallback<AdminUser>(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify(dto)
    }, { ...MOCK_USERS[0], id: Date.now(), ...dto } as AdminUser);
  },

  async updateUser(id: number, dto: Partial<AdminUser>) {
    return fetchWithFallback<AdminUser>(`${API_URL}/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto)
    }, { ...MOCK_USERS[0], id, ...dto } as AdminUser);
  },

  async deleteUser(id: number) {
    return fetchWithFallback<string>(`${API_URL}/users/${id}`, { method: "DELETE" }, "SUCCESS");
  },

  // 9. Cloudinary Image Upload
  async uploadImage(file: File, folder: string = "products"): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    // 1. Try uploading to backend Spring Boot endpoint (/upload/image)
    try {
      const res = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        const url = json.data?.url || json.data || json.url;
        if (url && typeof url === "string") return url;
      }
    } catch (e) {
      console.warn("[adminService] Backend upload failed, trying direct Cloudinary...", e);
    }

    // 2. Direct Cloudinary upload fallback using project Cloudinary credentials
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzz1nibmx";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "project-utc";
      const cldFormData = new FormData();
      cldFormData.append("file", file);
      cldFormData.append("upload_preset", uploadPreset);
      cldFormData.append("folder", `project-utc/${folder}`);

      const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cldFormData,
      });
      if (cldRes.ok) {
        const cldJson = await cldRes.json();
        if (cldJson.secure_url) return cldJson.secure_url;
        if (cldJson.url) return cldJson.url;
      }
    } catch (err) {
      console.warn("[adminService] Direct Cloudinary upload failed, using local base64 fallback...", err);
    }

    // 3. Fallback to base64 data URL so user can always see and save their image immediately
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
