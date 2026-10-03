/**
 * Unified Order Status Definition and Normalization for Ubofood
 * Hợp nhất trạng thái đơn hàng trên toàn hệ thống (Web Khách Hàng, Profile, Admin Dashboard, Admin Orders, POS)
 */

export type OrderStatusCanonical =
  | "PENDING"
  | "PROCESSING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderStatusInfo {
  canonical: OrderStatusCanonical;
  label: string;
  adminLabel: string;
  step: number; // 1: Đã đặt, 2: Sơ chế lạnh, 3: Đang giao 2H, 4: Hoàn tất, 0: Đã hủy
  stepTitle: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  fullBadgeClass: string;
}

/**
 * Chuẩn hóa trạng thái đơn hàng về chuẩn duy nhất:
 * PENDING | PROCESSING | DELIVERING | COMPLETED | CANCELLED
 * Chấp nhận các alias như SHIPPING, CONFIRMED, DELIVERED, CANCELED...
 */
export function normalizeOrderStatus(rawStatus?: string | null): OrderStatusCanonical {
  if (!rawStatus) return "PENDING";
  const s = String(rawStatus).trim().toUpperCase();

  switch (s) {
    case "PENDING":
    case "CHO_XAC_NHAN":
    case "CHO_DUYET":
      return "PENDING";

    case "PROCESSING":
    case "CONFIRMED":
    case "PREPARING":
    case "DANG_XU_LY":
    case "SO_CHE":
      return "PROCESSING";

    case "DELIVERING":
    case "SHIPPING":
    case "DELIVERY":
    case "IN_TRANSIT":
    case "DANG_GIAO":
      return "DELIVERING";

    case "COMPLETED":
    case "DELIVERED":
    case "FINISHED":
    case "SUCCESS":
    case "HOAN_TAT":
    case "HOAN_THANH":
      return "COMPLETED";

    case "CANCELLED":
    case "CANCELED":
    case "DA_HUY":
      return "CANCELLED";

    default:
      return "PENDING";
  }
}

/**
 * Lấy thông tin hiển thị trạng thái chuẩn
 */
export function getOrderStatusInfo(
  rawStatus?: string | null,
  context: "customer" | "admin" = "customer"
): OrderStatusInfo {
  const canonical = normalizeOrderStatus(rawStatus);

  switch (canonical) {
    case "PROCESSING":
      return {
        canonical,
        label: "Đang chuẩn bị",
        adminLabel: "Đang Xử Lý",
        step: 2,
        stepTitle: "Sơ chế lạnh",
        badgeBg: "bg-blue-50 dark:bg-blue-950/70",
        textColor: "text-blue-700 dark:text-blue-300",
        borderColor: "border-blue-200 dark:border-blue-800",
        dotColor: "bg-blue-500 animate-pulse",
        fullBadgeClass:
          "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      };

    case "DELIVERING":
      return {
        canonical,
        label: "Đang giao 2H",
        adminLabel: "Đang Giao 2H",
        step: 3,
        stepTitle: "Đang giao 2H",
        badgeBg: "bg-purple-50 dark:bg-purple-950/70",
        textColor: "text-purple-700 dark:text-purple-300",
        borderColor: "border-purple-200 dark:border-purple-800",
        dotColor: "bg-purple-500 animate-ping",
        fullBadgeClass:
          "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
      };

    case "COMPLETED":
      return {
        canonical,
        label: "Đã hoàn thành",
        adminLabel: "Hoàn Thành",
        step: 4,
        stepTitle: "Hoàn tất",
        badgeBg: "bg-emerald-50 dark:bg-emerald-950/70",
        textColor: "text-emerald-700 dark:text-emerald-300",
        borderColor: "border-emerald-200 dark:border-emerald-800",
        dotColor: "bg-emerald-500",
        fullBadgeClass:
          "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      };

    case "CANCELLED":
      return {
        canonical,
        label: "Đã hủy đơn",
        adminLabel: "Đã Hủy",
        step: 0,
        stepTitle: "Đã hủy",
        badgeBg: "bg-red-50 dark:bg-red-950/70",
        textColor: "text-red-700 dark:text-red-300",
        borderColor: "border-red-200 dark:border-red-800",
        dotColor: "bg-red-500",
        fullBadgeClass:
          "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
      };

    case "PENDING":
    default:
      return {
        canonical: "PENDING",
        label: "Chờ xác nhận",
        adminLabel: "Chờ Duyệt ⚡",
        step: 1,
        stepTitle: "Đã đặt hàng",
        badgeBg: "bg-amber-50 dark:bg-amber-950/70",
        textColor: "text-amber-700 dark:text-amber-300",
        borderColor: "border-amber-200 dark:border-amber-800",
        dotColor: "bg-amber-500 animate-pulse",
        fullBadgeClass:
          context === "admin"
            ? "bg-red-600 text-white shadow-sm border border-red-500"
            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      };
  }
}

/**
 * Kiểm tra đơn hàng có khớp với tab lọc trạng thái không
 */
export function matchesOrderStatus(
  orderStatus: string | null | undefined,
  filterTabId: string
): boolean {
  if (!filterTabId || filterTabId === "ALL") return true;
  const canonicalOrder = normalizeOrderStatus(orderStatus);
  const canonicalFilter = normalizeOrderStatus(filterTabId);
  return canonicalOrder === canonicalFilter;
}

/**
 * Danh sách tabs lọc cho trang Khách Hàng (/orders)
 */
export const CUSTOMER_ORDER_TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "PROCESSING", label: "Đang chuẩn bị" },
  { id: "DELIVERING", label: "Đang giao" },
  { id: "COMPLETED", label: "Đã hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" },
];

/**
 * Danh sách tabs lọc cho trang Quản Trị (/admin/orders)
 */
export const ADMIN_ORDER_TABS = [
  { id: "ALL", label: "Tất Cả Đơn" },
  { id: "PENDING", label: "🔴 Chờ Duyệt" },
  { id: "PROCESSING", label: "Đang Xử Lý" },
  { id: "DELIVERING", label: "Đang Giao 2H" },
  { id: "COMPLETED", label: "Hoàn Thành" },
  { id: "CANCELLED", label: "Đã Hủy" },
];
